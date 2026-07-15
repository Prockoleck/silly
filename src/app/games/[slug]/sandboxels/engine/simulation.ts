import {
  Pixel, pixelMap, currentPixels, pixelTicks,
  W, H, airTemp, airDensity, absoluteZero,
  outOfBounds, isEmpty, createPixel, deletePixel,
  movePixel, swapPixels, getPixel, shuffleArray, choose,
  validDensitySwap, changePixel, setPixelTempCheck, pixelTempCheck,
  adjacentCoords, squareCoords, diagonalCoords, biCoords,
  adjacentCoordsShuffle, squareCoordsShuffle, diagonalCoordsShuffle,
  btemp, createGrid, stainPixel, releaseElement, explodeAt,
} from "./core";
import elements, { type ElementDefinition } from "../data/elements";
import * as ticks from "./ticks";

// ===== TEMPERATURE CHECK (register with core, lazy) =====
let _tempCheckRegistered = false;
function ensureTempCheckRegistered() {
  if (_tempCheckRegistered) return;
  _tempCheckRegistered = true;
  setPixelTempCheck(function tempCheck(pixel: Pixel) {
  if (pixel.del) return;
  const info = elements[pixel.element];
  if (!info) return;
  if (pixel.temp < absoluteZero) pixel.temp = absoluteZero;

  if (info.tempHigh !== undefined && pixel.temp >= info.tempHigh) {
    let result = info.stateHigh;
    if (result === null) { deletePixel(pixel.x, pixel.y); return; }
    if (Array.isArray(result)) result = choose(result);
    if (result) changePixel(pixel, result);
    return;
  }

  if (info.tempLow !== undefined && pixel.temp <= info.tempLow) {
    let result = info.stateLow;
    if (result === null) { deletePixel(pixel.x, pixel.y); return; }
    if (Array.isArray(result)) result = choose(result);
    if (result) changePixel(pixel, result);
  }
});
}

// ===== BEHAVIORS =====

// POWDER: falls down, slides on slopes
export function behavePowder(pixel: Pixel) {
  if (pixel.start === pixelTicks.v) return;
  if (pixel.charge && elements[pixel.element]?.behaviorOn) { pixelTick(pixel); return; }
  if (!tryMove(pixel, pixel.x, pixel.y + 1)) {
    if (Math.random() < 0.5) {
      if (!tryMove(pixel, pixel.x + 1, pixel.y + 1)) tryMove(pixel, pixel.x - 1, pixel.y + 1);
    } else {
      if (!tryMove(pixel, pixel.x - 1, pixel.y + 1)) tryMove(pixel, pixel.x + 1, pixel.y + 1);
    }
  }
  doDefaults(pixel);
}

// STURDYPOWDER: falls straight down only
export function behaveSturdyPowder(pixel: Pixel) {
  if (pixel.start === pixelTicks.v) return;
  if (pixel.charge && elements[pixel.element]?.behaviorOn) { pixelTick(pixel); return; }
  tryMove(pixel, pixel.x, pixel.y + 1);
  doDefaults(pixel);
}

// LIQUID: spreads on ground, has viscosity
export function behaveLiquid(pixel: Pixel) {
  if (pixel.start === pixelTicks.v) return;
  if (pixel.charge && elements[pixel.element]?.behaviorOn) { pixelTick(pixel); return; }
  const info = elements[pixel.element];
  let viscMove = true;
  if (info?.viscosity) {
    viscMove = Math.random() * 100 < 100 / Math.pow(info.viscosity, 0.25);
  }
  if (viscMove) {
    const spots = shuffleArray([1, 0, -1]);
    for (const coord of spots) {
      if (tryMove(pixel, pixel.x + coord, pixel.y + 1)) return;
    }
  }
  const dir = Math.random() < 0.5 ? 1 : -1;
  if (!tryMove(pixel, pixel.x + dir, pixel.y)) {
    tryMove(pixel, pixel.x - dir, pixel.y);
  }
  doDefaults(pixel);
}

// SUPERFLUID: extremely runny
export function behaveSuperfluid(pixel: Pixel) {
  if (pixel.start === pixelTicks.v) return;
  if (pixel.charge && elements[pixel.element]?.behaviorOn) { pixelTick(pixel); return; }
  if (!tryMove(pixel, pixel.x, pixel.y + 1)) {
    const nx = pixel.flipX ? pixel.x - 1 : pixel.x + 1;
    if (Math.random() < 0.5) {
      if (!tryMove(pixel, nx, pixel.y)) {
        pixel.flipX = !pixel.flipX;
        tryMove(pixel, nx, pixel.y + 1);
      }
    } else {
      if (!tryMove(pixel, nx, pixel.y + 1)) {
        if (!tryMove(pixel, nx, pixel.y)) pixel.flipX = !pixel.flipX;
      }
    }
  }
  doDefaults(pixel);
}

// GAS: moves in all directions
export function behaveGas(pixel: Pixel) {
  if (pixel.start === pixelTicks.v) return;
  if (pixel.charge && elements[pixel.element]?.behaviorOn) { pixelTick(pixel); return; }
  shuffleArray(adjacentCoordsShuffle);
  let moved = false;
  for (const [dx, dy] of adjacentCoordsShuffle) {
    if (tryMove(pixel, pixel.x + dx, pixel.y + dy)) { moved = true; break; }
  }
  if (!moved) {
    shuffleArray(diagonalCoordsShuffle);
    for (const [dx, dy] of diagonalCoordsShuffle) {
      if (tryMove(pixel, pixel.x + dx, pixel.y + dy)) break;
    }
  }
  doDefaults(pixel);
}

// MOLTEN: liquid + spawns fire above
export function behaveMolten(pixel: Pixel) {
  if (Math.random() < 0.025 && isEmpty(pixel.x, pixel.y - 1)) {
    createPixel("fire", pixel.x, pixel.y - 1);
    const p = pixelMap[pixel.x][pixel.y - 1];
    if (p) {
      p.temp = pixel.temp;
      const info = elements[pixel.element];
      if (info?.fireColor) p.color = pixelColorPick(p, info.fireColor);
    }
  }
  behaveLiquid(pixel);
}

// GAS that dissipates
export function behaveDgas(pixel: Pixel) {
  if (Math.random() < 0.05) { deletePixel(pixel.x, pixel.y); return; }
  behaveGas(pixel);
}

// WALL: does nothing
export function behaveWall(_pixel: Pixel) {}

// BOUNCY: bounces off walls
export function behaveBouncy(pixel: Pixel) {
  if (pixel.bx === undefined) {
    pixel.bx = Math.random() < 0.5 ? 1 : Math.random() < 0.5 ? 0 : -1;
    pixel.by = Math.random() < 0.5 ? 1 : Math.random() < 0.5 ? 0 : -1;
    if (pixel.bx === 0 && pixel.by === 0) {
      if (Math.random() < 0.5) pixel.bx = Math.random() < 0.5 ? 1 : -1;
      else pixel.by = Math.random() < 0.5 ? 1 : -1;
    }
  }
  if (!pixel.del && pixel.bx && !tryMove(pixel, pixel.x + pixel.bx, pixel.y)) pixel.bx = -pixel.bx;
  if (!pixel.del && pixel.by && !tryMove(pixel, pixel.x, pixel.y + pixel.by)) pixel.by = -pixel.by;
}

// CLONER: copies adjacent elements
export function behaveCloner(pixel: Pixel) {
  for (const [dx, dy] of adjacentCoords) {
    const x = pixel.x + dx, y = pixel.y + dy;
    if (!pixel.clone) {
      if (!isEmpty(x, y, true)) {
        const np = pixelMap[x][y];
        if (!np || elements[pixel.element]?.ignore?.includes(np.element)) continue;
        if (elements[pixel.element]?.id === elements[np.element]?.id) continue;
        pixel.clone = elements[np.element]?.pickElement || np.element;
        pixel.temp = np.temp;
      }
    } else if (isEmpty(x, y)) {
      createPixel(pixel.clone.includes(",") ? choose(pixel.clone.split(",")) : pixel.clone, x, y);
      if (pixelMap[x][y]) pixelMap[x][y]!.temp = pixel.temp;
    }
  }
}

// FLY: flying insect movement
export function behaveFly(pixel: Pixel, onHit?: (p: Pixel, target?: Pixel) => void) {
  const nx = pixel.flipX ? -1 : 1;
  const ny = Math.random() < 0.5 ? -1 : 1;
  let hit: [number, number] | false = false;
  if (!tryMove(pixel, pixel.x + nx, pixel.y + ny)) {
    if (!tryMove(pixel, pixel.x + nx, pixel.y - ny)) {
      if (!tryMove(pixel, pixel.x, pixel.y + ny)) {
        if (!tryMove(pixel, pixel.x, pixel.y - ny)) hit = [pixel.x, pixel.y - ny];
      } else hit = [pixel.x, pixel.y + ny];
    } else hit = [pixel.x + nx, pixel.y - ny];
  } else hit = [pixel.x + nx, pixel.y + ny];

  if (hit && onHit) {
    if (!isEmpty(hit[0], hit[1], true)) onHit(pixel, pixelMap[hit[0]][hit[1]]);
    else onHit(pixel);
  }
  if (pixel.del) return;
  if ((!isEmpty(pixel.x + nx, pixel.y) && !(pixel.x + nx < 0 || pixel.x + nx >= W)) || Math.random() < 0.02) {
    pixel.flipX = !pixel.flipX;
  }
  if (pixel.charge && elements[pixel.element]?.behaviorOn) pixelTick(pixel);
  doDefaults(pixel);
}

// UL_UR: moves up-left and up-right (optimized)
export function behaveULUR(pixel: Pixel) {
  if (pixel.start === pixelTicks.v) return;
  const move1Spots = shuffleArray([0, 1, -1]);
  let moved = false;
  for (const coord of move1Spots) {
    if (tryMove(pixel, pixel.x + coord, pixel.y - 1)) { moved = true; break; }
  }
  if (!moved && !pixel.del) {
    const move2Spots = shuffleArray([[0, 1], [1, 0], [-1, 0]]);
    for (const [dx, dy] of move2Spots) {
      if (tryMove(pixel, pixel.x + dx, pixel.y + dy)) break;
    }
  }
  if (!pixel.del) {
    doHeat(pixel);
    doAirDensity(pixel);
    doBurning(pixel);
  }
}

// SEEDRISE: rises through soil, turning soil to fiber
export function behaveSeedrise(pixel: Pixel) {
  if (Math.random() < 0.02) {
    let x = 0;
    if (Math.random() < 0.25) x += Math.random() < 0.5 ? -1 : 1;
    if (!isEmpty(pixel.x + x, pixel.y - 1, true)) {
      const above = pixelMap[pixel.x + x][pixel.y - 1];
      if (above && above.element !== pixel.element) {
        swapPixels(pixel, above);
        changePixel(above, "fiber");
      }
    }
  }
  doDefaults(pixel);
}

// CRAWLER: wall-following movement with rotation states
export function behaveCrawler(pixel: Pixel, onHit?: (p: Pixel, nx: number, ny: number) => void, afterMove?: (p: Pixel, nx: number, ny: number) => void) {
  if (pixel.r === undefined) pixel.r = 0;
  if (pixel.climb === undefined) pixel.climb = 0;
  let newX = 0, newY = 0, floorX = 0, floorY = 0;
  if (pixel.r === 0) { newX = 1; floorY = 1; }
  else if (pixel.r === 1) { newY = 1; floorX = 1; }
  else if (pixel.r === 2) { newX = -1; floorY = 1; }
  else if (pixel.r === 3) { newY = -1; floorX = 1; }

  if (!isEmpty(pixel.x - floorX, pixel.y - floorY)) {
    if (!isEmpty(pixel.x + floorX, pixel.y + floorY) && Math.random() < 0.5) {}
    else { floorX = -floorX; floorY = -floorY; }
  }

  if (!(isEmpty(pixel.x + floorX, pixel.y + floorY) && tryMove(pixel, pixel.x, pixel.y + 1))) {
    pixel.climb++;
    if (!tryMove(pixel, pixel.x + newX, pixel.y + newY) && !tryMove(pixel, pixel.x + newX, pixel.y + newY + (Math.random() < 0.5 ? 1 : -1))) {
      pixel.climb = 0;
      if (onHit) onHit(pixel, newX, newY);
      if (!isEmpty(pixel.x + newX, pixel.y + newY, true) && pixelMap[pixel.x + newX][pixel.y + newY]?.element === pixel.element) {
        pixelMap[pixel.x + newX][pixel.y + newY]!.r = pixel.r;
      } else {
        pixel.r = Math.floor(Math.random() * 4);
      }
    } else if (pixel.r % 2 === 1) {
      if (tryMove(pixel, pixel.x + floorX, pixel.y)) {
        pixel.r = floorX < 0 ? 2 : 0;
        pixel.climb = 0;
      }
    } else if (tryMove(pixel, pixel.x, pixel.y + floorY)) {
      pixel.r = floorY < 0 ? 3 : 1;
      pixel.climb = 0;
    }
    if (afterMove) afterMove(pixel, newX, newY);
  } else {
    pixel.r = Math.random() < 0.5 ? 0 : 2;
    pixel.climb = 0;
  }
  doDefaults(pixel);
}

// ===== CHARGE =====
export function chargePixel(pixel: Pixel, amount = 1) {
  if (elements[pixel.element]?.conduct === undefined) return;
  if (elements[pixel.element]?.colorOn) pixel.color = pixelColorPick(pixel);
  pixel.charge = Math.max(0, amount);
  pixel.chargeStart = pixelTicks.v;
}

// ===== ABSORB =====
export function absorbBehavior(pixel: Pixel, limit = 100, rate = 0.1) {
  if (pixel.moist === undefined) pixel.moist = 0;
  for (const [dx, dy] of adjacentCoords) {
    const x = pixel.x + dx, y = pixel.y + dy;
    if (!isEmpty(x, y, true)) {
      const np = pixelMap[x][y];
      if (!np) continue;
      if (np.element === pixel.element) {
        const avg: number = ((pixel.moist ?? 0) + (np.moist ?? 0)) / 2;
        pixel.moist = avg; np.moist = avg;
      } else if (elements[pixel.element]?.reactions?.[np.element] && (pixel.moist ?? 0) < limit && Math.random() < rate) {
        deletePixel(x, y);
        pixel.moist = (pixel.moist ?? 0) + 1;
      }
    } else if ((pixel.moist ?? 0) >= 1 && pixel.temp > 100 && Math.random() < 0.1) {
      createPixel("steam", x, y);
      pixel.moist = (pixel.moist ?? 0) - 1;
    }
  }
}

// ===== FEED =====
export function feedPixel(pixel: Pixel) {
  if (!pixel.food) pixel.food = 1;
  else pixel.food++;
  const need = elements[pixel.element]?.foodNeed ?? 30;
  if (pixel.food > need) {
    const released = releaseElement(pixel, elements[pixel.element]?.egg || "egg", 1);
    if (released) {
      const baby = elements[pixel.element]?.baby || pixel.element;
      changePixel(released, baby);
      if (elements[pixel.element]?.eggColor) {
        released.color = pixelColorPick(released, elements[pixel.element]!.eggColor!);
      }
    }
    pixel.food = 0;
  }
}

// ===== MOVEMENT =====
export function tryMove(pixel: Pixel, nx: number, ny: number): boolean {
  if (pixel.drag) return true;
  if (pixel.del) return false;
  if (outOfBounds(nx, ny)) return false;

  if (isEmpty(nx, ny)) {
    movePixel(pixel, nx, ny);
    return true;
  }

  const info = elements[pixel.element];
  if (!info) return false;

  const newPixel = pixelMap[nx][ny];
  if (!newPixel) return false;
  const newInfo = elements[newPixel.element];
  if (!newInfo) return false;

  // Reactions
  if (info.reactions?.[newPixel.element]) {
    if (reactPixels(pixel, newPixel)) return true;
  }
  if (newInfo.reactions?.[pixel.element] && !newInfo.reactions[pixel.element].oneway) {
    if (reactPixels(newPixel, pixel)) return true;
  }

  // Density swapping
  if (info.id !== newInfo.id) {
    if (info.density !== undefined && newInfo.density !== undefined) {
      if (validDensitySwap(info.state, newInfo.state) && info.density >= newInfo.density) {
        if (Math.random() < (info.density - newInfo.density) / (info.density + newInfo.density)) {
          swapPixels(pixel, newPixel);
          return true;
        }
      }
    }
    if (info.onCollide) info.onCollide(pixel, newPixel);
    if (newInfo.onMoveInto) newInfo.onMoveInto(newPixel, pixel);
  } else if (info.state !== "solid" && validDensitySwap(info.state, info.state)) {
    if (Math.random() < 0.1) {
      swapPixels(pixel, newPixel);
      return true;
    }
  }

  return false;
}

function reactPixels(pixel: Pixel, target: Pixel): boolean {
  const info = elements[pixel.element];
  if (!info?.reactions) return false;
  const r = info.reactions[target.element];
  if (!r) return false;
  if (r.tempMin !== undefined && pixel.temp < r.tempMin) return false;
  if (r.tempMax !== undefined && pixel.temp > r.tempMax) return false;
  if (r.chance !== undefined && Math.random() > r.chance) return false;
  if (r.charged && !(pixel.charge || target.charge)) return false;
  if (r.setting !== undefined && pixel.setting !== r.setting) return false;
  if (r.burning1 !== undefined && Boolean(pixel.burning) !== r.burning1) return false;
  if (r.burning2 !== undefined && Boolean(target.burning) !== r.burning2) return false;

  if (r.func && !pixel.del) {
    r.func(pixel, target);
  }
  if (r.charge1 !== undefined && !target.del) {
    target.charge = (target.charge ?? 0) + r.charge1;
    target.chargeStart = pixelTicks.v;
  }
  if (r.elem1 !== undefined && !pixel.del) {
    const e1 = Array.isArray(r.elem1) ? choose(r.elem1) : r.elem1;
    if (e1 === null) deletePixel(pixel.x, pixel.y);
    else changePixel(pixel, e1);
  }
  if (r.elem2 !== undefined) {
    const e2 = Array.isArray(r.elem2) ? choose(r.elem2) : r.elem2;
    if (e2 === null) deletePixel(target.x, target.y);
    else changePixel(target, e2);
  }
  if (r.stain1 && !pixel.del) {
    stainPixel(pixel, r.stain1, 0.3);
  }
  if (r.temp1 !== undefined) pixel.temp += r.temp1;
  if (r.color2 && pixelMap[target.x][target.y]) {
    pixelMap[target.x][target.y]!.color = pixelColorPick(pixelMap[target.x][target.y]!, r.color2);
  }
  if (r.attr2 && !target.del) {
    for (const key in r.attr2) {
      target[key] = r.attr2[key];
    }
  }
  return true;
}

// ===== REACTION DISPATCHER =====
export function tickReactions(pixel: Pixel) {
  const elName = pixel.element;
  for (const [dx, dy] of adjacentCoords) {
    const x = pixel.x + dx, y = pixel.y + dy;
    if (isEmpty(x, y, true)) continue;
    const np = pixelMap[x][y];
    if (!np) continue;
    const r1 = elements[elName]?.reactions?.[np.element];
    if (r1) reactPixels(pixel, np);
    const r2 = elements[np.element]?.reactions?.[pixel.element];
    if (r2 && !r2.oneway) reactPixels(np, pixel);
  }
}

// ===== HEAT =====
export function doHeat(pixel: Pixel) {
  const info = elements[pixel.element];
  if (!info || info.insulate) return;
  let changed = false;
  for (const [dx, dy] of biCoords) {
    const x = pixel.x + dx, y = pixel.y + dy;
    if (isEmpty(x, y, true)) continue;
    const np = pixelMap[x][y];
    if (!np || np.temp === pixel.temp || elements[np.element]?.insulate) continue;
    const avg = (pixel.temp + np.temp) / 2;
    pixel.temp = avg; np.temp = avg;
    changed = true;
    pixelTempCheck(np);
  }
  if (changed) pixelTempCheck(pixel);
}

// ===== BURNING =====
export function doBurning(pixel: Pixel) {
  if (!pixel.burning) return;
  const info = elements[pixel.element];
  if (!info) return;
  if (info.insulate !== true) pixel.temp += 1;
  pixelTempCheck(pixel);
  if (pixel.temp < 0) { pixel.burning = false; pixel.burnStart = undefined; return; }

  for (const [dx, dy] of adjacentCoords) {
    const x = pixel.x + dx, y = pixel.y + dy;
    if (isEmpty(x, y, true)) continue;
    const np = pixelMap[x][y];
    if (!np) continue;
    const nf = elements[np.element];
    if (nf?.burn !== undefined && !np.burning && Math.random() * 100 < nf.burn) {
      np.burning = true; np.burnStart = pixelTicks.v;
    }
    if (nf?.extinguish) { pixel.burning = false; pixel.burnStart = undefined; return; }
  }

  const burnTime = info.burnTime ?? 200;
  if (pixelTicks.v - (pixel.burnStart ?? pixelTicks.v) > burnTime && Math.random() * 100 < (info.burn ?? 10)) {
    let into: string | null | (string | null)[] = info.burnInto || "fire";
    if (Array.isArray(into)) { const f = into.filter(Boolean); into = f.length ? choose(f) : "fire"; }
    if (into) changePixel(pixel, into);
  } else if (Math.random() < 0.1 && info.fireElement !== null) {
    let fe = info.fireElement || "fire";
    if (Array.isArray(fe)) fe = choose(fe);
    if (isEmpty(pixel.x, pixel.y - 1)) {
      createPixel(fe, pixel.x, pixel.y - 1);
      const p = pixelMap[pixel.x][pixel.y - 1];
      if (p) {
        p.temp = pixel.temp;
        if (info.fireColor) p.color = pixelColorPick(p, info.fireColor);
      }
    }
  }
}

// ===== ELECTRICITY =====
export function doElectricity(pixel: Pixel) {
  if (pixel.chargeStart === pixelTicks.v) return;
  if (pixel.charge) {
    pixel.charge = Math.round((pixel.charge - 0.2) * 100) / 100;
    for (const [dx, dy] of adjacentCoords) {
      const x = pixel.x + dx, y = pixel.y + dy;
      if (isEmpty(x, y, true)) continue;
      const np = pixelMap[x][y];
      if (!np || np.charge || np.chargeCD) continue;
      const nf = elements[np.element];
      if (!nf || nf.conduct === undefined) continue;
      if (nf.ignoreConduct?.includes(pixel.element)) continue;
      const con = np.temp <= (nf.superconductorAt ?? -Infinity) ? 1 : nf.conduct;
      if (Math.random() < con) {
        np.charge = 1; np.chargeStart = pixelTicks.v;
        doElectricity(np);
        if (nf.colorOn) np.color = pixelColorPick(np);
      } else if (nf.insulate !== true) {
        np.temp += pixel.charge / 4; pixelTempCheck(np);
      }
    }
    if (pixel.charge <= 0) {
      pixel.charge = undefined; pixel.chargeStart = undefined;
      const con = elements[pixel.element]?.conduct ?? 0;
      pixel.chargeCD = Math.round(4 + 4 * (1 - con)) || 4;
    }
  } else if (pixel.chargeCD) {
    pixel.chargeCD -= 1;
    if (pixel.chargeCD <= 0) {
      pixel.chargeCD = undefined;
      if (elements[pixel.element]?.colorOn) pixel.color = pixelColorPick(pixel);
    }
  }
}

// ===== STAINING =====
export function doStaining(pixel: Pixel) {
  const stain = elements[pixel.element]?.stain;
  if (!stain) return;
  const stainAbs = Math.abs(stain);
  let newColor: RegExpMatchArray | null = null;
  if (stain > 0) newColor = pixel.color.match(/\d+/g);

  for (const [dx, dy] of adjacentCoords) {
    const x = pixel.x + dx, y = pixel.y + dy;
    if (isEmpty(x, y, true)) continue;
    const np = pixelMap[x][y];
    if (!np) continue;
    const nf = elements[np.element];
    if (!nf) continue;
    if ((nf.state !== "solid" && nf.id !== elements[pixel.element]?.id)) continue;
    if (elements[pixel.element]?.ignore?.includes(np.element)) continue;
    if (!np.color.startsWith("rgb")) continue;
    if (Math.random() < stainAbs) {
      const rgbMatch = np.color.match(/\d+/g);
      if (!rgbMatch || rgbMatch.length < 3) continue;
      const rgb = [Number(rgbMatch[0]), Number(rgbMatch[1]), Number(rgbMatch[2])];
      if (stain < 0 && np.origColor) {
        const ocMatch = np.origColor.match(/\d+/g);
        if (ocMatch && ocMatch.length >= 3) {
          for (let j = 0; j < 3; j++) rgb[j] = Math.floor(rgb[j] * (1 - stainAbs) + Number(ocMatch[j]) * stainAbs);
        }
      } else if (stain > 0 && newColor) {
        if (!np.origColor) np.origColor = np.color;
        for (let j = 0; j < 3; j++) rgb[j] = Math.floor(rgb[j] * (1 - stainAbs) + Number(newColor[j]) * stainAbs);
      }
      np.color = `rgb(${rgb[0]},${rgb[1]},${rgb[2]})`;
    }
  }
}

// ===== AIR DENSITY =====
export function doAirDensity(pixel: Pixel) {
  const info = elements[pixel.element];
  if (!info || info.density === undefined || info.ignoreAir || info.movable === false) return;
  if (info.density < airDensity && validDensitySwap("gas", info.state || "")) {
    if (Math.random() < (airDensity - info.density) / (airDensity + info.density)) {
      tryMove(pixel, pixel.x, pixel.y - 1);
    }
  }
}

// ===== PIXEL TICK (behavior parser) =====
export function pixelTick(pixel: Pixel) {
  if (pixel.start === pixelTicks.v) return;
  const info = elements[pixel.element];
  if (!info) return;
  if (info.behavior && typeof info.behavior === "function") {
    info.behavior(pixel);
    return;
  }
  // Array-based behaviors
  const behavior = (pixel.charge && info.behaviorOn) ? info.behaviorOn : info.behavior;
  if (!behavior || !Array.isArray(behavior)) return;
  let b: string[][];
  if (typeof behavior[0] === "string") {
    b = behavior.map(r => (r as string).split("|"));
  } else {
    b = behavior as string[][];
  }
  if (pixel.flipX) {
    for (const row of b) {
      row.reverse();
    }
  }
  if (pixel.flipY) {
    b.reverse();
  }
  if (pixel.r !== undefined) {
    const size = b.length;
    const rotated: string[][] = Array.from({ length: size }, () => []);
    for (let i = 0; i < pixel.r; i++) {
      for (let y = 0; y < size; y++) {
        for (let x = 0; x < size; x++) {
          rotated[x][size - 1 - y] = b[y][x];
        }
      }
      for (let y = 0; y < size; y++) {
        for (let x = 0; x < size; x++) {
          b[y][x] = rotated[y][x];
        }
      }
    }
  }

  const x = pixel.x, y = pixel.y;
  const move1Spots: Array<{ x: number; y: number }> = [];
  const move2Spots: Array<{ x: number; y: number }> = [];
  const deleteSpots: Array<{ x: number; y: number; arg: string | null }> = [];
  const createSpots: Array<{ x: number; y: number; arg: string }> = [];
  const supportSpots: Array<{ x: number; y: number }> = [];
  let moved = false;

  // Parse behavior grid
  for (let by = 0; by < behavior.length; by++) {
    const row = behavior[by];
    if (!Array.isArray(row)) continue;
    for (let bx = 0; bx < row.length; bx++) {
      const b = row[bx];
      if (b === "XX" || b === undefined) continue;
      const parts = String(b).split(" AND ");
      for (const part of parts) {
        let cmd = part;
        let chance = 100;
        let arg: string | null = null;
        if (cmd.includes("%")) {
          const parts = cmd.split("%");
          const parsed = parseFloat(parts[1]);
          chance = isNaN(parsed) ? 100 : parsed;
          cmd = parts[0];
        }
        if (cmd.includes(":")) {
          arg = cmd.split(":")[1];
          cmd = cmd.split(":")[0];
        }
        if (Math.random() * 100 >= chance) continue;

        const nx = x + (bx - 1);
        const ny = y + (by - 1);

        switch (cmd) {
          case "M1": move1Spots.push({ x: nx, y: ny }); break;
          case "M2": move2Spots.push({ x: nx, y: ny }); break;
          case "DL": deleteSpots.push({ x: nx, y: ny, arg }); break;
          case "CR":
            if (isEmpty(nx, ny)) {
              const elem = arg || pixel.element;
              createPixel(elem.includes(",") ? choose(elem.split(",")) : elem, nx, ny);
              const np = pixelMap[nx][ny];
              if (np) { np.temp = pixel.temp; pixelTempCheck(np); }
            }
            break;
          case "CL":
            if (isEmpty(nx, ny)) {
              createPixel(pixel.element, nx, ny);
            }
            break;
          case "CF":
            if (pixel.clone && isEmpty(nx, ny)) {
              createPixel(pixel.clone, nx, ny);
              if (pixelMap[nx][ny]) pixelMap[nx][ny]!.temp = pixel.temp;
            } else if (!pixel.clone && !isEmpty(nx, ny, true)) {
              const np = pixelMap[nx][ny];
              if (np && np.element !== pixel.element) {
                pixel.clone = elements[np.element]?.pickElement || np.element;
                pixel.temp = np.temp;
                pixelTempCheck(pixel);
              }
            }
            break;
          case "SH":
            if (!isEmpty(nx, ny, true)) {
              const np = pixelMap[nx][ny];
              if (np) { np.charge = parseFloat(arg || "1"); np.chargeStart = pixelTicks.v; }
            }
            break;
          case "HT":
            if (!isEmpty(nx, ny, true)) {
              const np = pixelMap[nx][ny];
              if (np && !elements[np.element]?.insulate) {
                np.temp += parseFloat(arg || "1"); pixelTempCheck(np);
              }
            }
            break;
          case "CO":
            if (!isEmpty(nx, ny, true)) {
              const np = pixelMap[nx][ny];
              if (np && !elements[np.element]?.insulate) {
                np.temp -= parseFloat(arg || "1"); pixelTempCheck(np);
              }
            }
            break;
          case "SW":
            if (!isEmpty(nx, ny, true)) {
              const np = pixelMap[nx][ny];
              if (np && (!elements[np.element]?.hardness || Math.random() > elements[np.element]!.hardness!)) {
                swapPixels(pixel, np); moved = true;
              }
            }
            break;
          case "MX":
            if (!isEmpty(nx, ny, true)) {
              const np = pixelMap[nx][ny];
              if (np && np.element !== pixel.element) {
                swapPixels(pixel, np); moved = true;
              }
            }
            break;
          case "CH":
            if (!isEmpty(nx, ny, true) && arg) {
              const np = pixelMap[nx][ny];
              if (np) {
                let target = arg;
                if (target.includes(">")) {
                  const [from, to] = target.split(">");
                  if (from.includes(",") ? from.split(",").includes(np.element) : from === np.element) target = to;
                  else break;
                }
                if (target.includes(",")) target = choose(target.split(","));
                changePixel(np, target);
              }
            }
            break;
          case "C2":
            if (arg && moved) {
              let target = arg;
              if (target.includes(",")) target = choose(target.split(","));
              changePixel(pixel, target);
            }
            break;
          case "ST":
            if (!isEmpty(nx, ny, true)) {
              const np = pixelMap[nx][ny];
              if (np && np.element !== pixel.element) { /* sticking would prevent move */ }
            }
            break;
          case "SP":
            if (isEmpty(nx, ny)) supportSpots.push({ x: nx, y: ny });
            break;
          case "SA":
            if (!isEmpty(nx, ny, true)) { moved = true; }
            break;
          case "BO":
            if (!isEmpty(nx, ny, true) || outOfBounds(nx, ny)) {
              const nf = !isEmpty(nx, ny, true) && pixelMap[nx][ny] ? elements[pixelMap[nx][ny]!.element] : undefined;
              if (nf?.state === "solid" || outOfBounds(nx, ny)) {
                if (pixel.flippableX) pixel.flipX = !pixel.flipX;
              }
            }
            break;
          case "FX":
            if (!isEmpty(nx, ny, true) && pixelMap[nx][ny]?.flippableX) {
              const np = pixelMap[nx][ny];
              if (np) np.flipX = arg === "0" ? false : arg === "1" ? true : !np.flipX;
            }
            break;
          case "RL":
            if (arg) {
              let elem = arg;
              if (elem.includes(",")) elem = choose(elem.split(","));
              releaseElement(pixel, elem, 1);
            }
            break;
          case "EX":
            if (arg) {
              const parts = arg.split(">");
              const exRadius = parseInt(parts[0]) || 10;
              const exElem = parts[1] || "fire";
              explodeAt(nx, ny, exRadius, exElem);
            } else {
              explodeAt(nx, ny, 10, "fire");
            }
            break;
          case "SM":
            if (!isEmpty(nx, ny, true)) {
              const np = pixelMap[nx][ny];
              if (np) {
                const nf = elements[np.element];
                if (nf?.breakInto) {
                  const bi = Array.isArray(nf.breakInto) ? choose(nf.breakInto.filter(Boolean)) : nf.breakInto;
                  if (bi) changePixel(np, bi);
                } else if (!nf?.hardness || Math.random() > nf.hardness) deletePixel(nx, ny);
              }
            }
            break;
          case "DB":
            if (!isEmpty(nx, ny, true)) {
              deletePixel(nx, ny);
            }
            deletePixel(x, y);
            return;
          case "LB":
          case "L1":
            if (isEmpty(x, y, true)) {
              createPixel(arg || pixel.element, x, y);
            }
            break;
          case "L2":
            if (isEmpty(x, y, true)) {
              createPixel(arg || pixel.element, x, y);
            }
            break;
          case "CC":
            if (!isEmpty(nx, ny, true)) {
              const np = pixelMap[nx][ny];
              if (np) np.color = pixel.color;
            }
            break;
        }
      }
    }
  }

  // Support check: if all support spots are occupied, don't fall
  if (supportSpots.length > 0) {
    const allSupported = supportSpots.every((s) => !isEmpty(s.x, s.y, true));
    if (allSupported) moved = true;
  }

  // Execute delete spots
  for (const spot of deleteSpots) {
    if (!isEmpty(spot.x, spot.y, true)) {
      const np = pixelMap[spot.x][spot.y];
      if (np && (!elements[np.element]?.hardness || Math.random() > elements[np.element]!.hardness!)) {
        if (spot.x === pixel.x && spot.y === pixel.y) { pixel.del = true; return; }
        deletePixel(spot.x, spot.y);
      }
    }
  }

  // Execute move spots
  if (!moved) {
    shuffleArray(move1Spots);
    for (const spot of move1Spots) {
      if (tryMove(pixel, spot.x, spot.y)) { moved = true; break; }
    }
  }
  if (!moved) {
    shuffleArray(move2Spots);
    for (const spot of move2Spots) {
      if (tryMove(pixel, spot.x, spot.y)) { moved = true; break; }
    }
  }

  doDefaults(pixel);
}

export function doDefaults(pixel: Pixel) {
  if (pixel.del) return;
  const info = elements[pixel.element];
  if (!info) return;
  if (info.reactions) tickReactions(pixel);
  if (info.insulate !== true) doHeat(pixel);
  doAirDensity(pixel);
  doBurning(pixel);
  doElectricity(pixel);
  if (info.stain !== undefined) doStaining(pixel);
}

// ===== COLOR =====
export function pixelColorPick(pixel: Pixel, customColor?: string | string[]): string {
  const info = elements[pixel.element];
  if (!info) return "#ffffff";
  if (pixel.charge && info.colorOn) customColor = info.colorOn;
  if (Array.isArray(customColor)) customColor = choose(customColor);

  let rgb: { r: number; g: number; b: number } | { r: number; g: number; b: number }[] | undefined;
  if (customColor) {
    const c = customColor.replace("#", "");
    if (c.length === 6 && /^[0-9a-fA-F]{6}$/.test(c)) {
      rgb = { r: parseInt(c.substr(0, 2), 16), g: parseInt(c.substr(2, 2), 16), b: parseInt(c.substr(4, 2), 16) };
    }
  } else {
    rgb = info.colorObject;
  }
  if (!rgb) return "#ffffff";
  if (Array.isArray(rgb)) rgb = choose(rgb);

  const grain = (info.grain ?? 1) * 15;
  const offset = Math.floor(Math.random() * (Math.random() > 0.5 ? -1 : 1) * Math.random() * grain);
  const r = Math.max(0, Math.min(255, rgb.r + offset));
  const g = Math.max(0, Math.min(255, rgb.g + offset));
  const b = Math.max(0, Math.min(255, rgb.b + offset));
  return `rgb(${r},${g},${b})`;
}

// ===== MAIN TICK =====
export function tickPixels() {
  const newCurrentPixels = [...currentPixels];
  shuffleArray(newCurrentPixels);

  for (const pixel of newCurrentPixels) {
    if (pixel.skip || pixel.del) continue;
    const info = elements[pixel.element];
    if (!info) continue;

    if (info.movable !== false) {
      // Loop/void border handling
      if (pixel.x < 0 || pixel.x >= W || pixel.y < 0 || pixel.y >= H) {
        deletePixel(pixel.x, pixel.y);
        continue;
      }
    }

    // Run tick function
    if (info.tick) {
      info.tick(pixel);
    } else if (info.behavior) {
      pixelTick(pixel);
    }
  }

  pixelTicks.v++;
}

// ===== AUTO-GENERATION =====
function autoGen(newname: string, sourceKey: string, template: { behavior: (p: Pixel) => void; state: string; type: string; hidden: boolean; rgb: number[][]; viscosity?: number; tempDiff?: number }) {
  if (elements[newname]) return;
  const src = elements[sourceKey];
  if (!src) return;

  const colorSrc = Array.isArray(src.color) ? src.color : [src.color].filter(Boolean) as string[];
  const newColors = colorSrc.map((c: string) => {
    const hex = c.replace("#", "");
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    const mult = choose(template.rgb);
    const nr = Math.max(0, Math.min(255, Math.floor(r * mult[0])));
    const ng = Math.max(0, Math.min(255, Math.floor(g * mult[1])));
    const nb = Math.max(0, Math.min(255, Math.floor(b * mult[2])));
    return `#${nr.toString(16).padStart(2, "0")}${ng.toString(16).padStart(2, "0")}${nb.toString(16).padStart(2, "0")}`;
  });

  const newEl: ElementDefinition = {
    color: newColors.length === 1 ? newColors[0] : newColors,
    behavior: template.behavior,
    category: "states",
    state: template.state,
    hidden: template.hidden,
    density: src.density !== undefined ? Math.round(src.density * (template.type === "high" ? 0.9 : 1.1)) : undefined,
    temp: src.temp !== undefined ? src.temp + (template.type === "high" ? 100 : -100) : undefined,
    conduct: src.conduct,
    burn: src.burn,
    burnTime: src.burnTime,
    fireColor: src.fireColor,
    viscosity: template.viscosity,
    colorObject: undefined,
  };

  if (template.type === "high") {
    newEl.tempLow = src.tempHigh !== undefined ? src.tempHigh + (template.tempDiff ?? -100) : undefined;
    newEl.stateLow = sourceKey;
  } else {
    newEl.tempHigh = src.tempLow !== undefined ? src.tempLow + (template.tempDiff ?? 100) : undefined;
    newEl.stateHigh = sourceKey;
  }

  elements[newname] = newEl as ElementDefinition;
}

function checkAutoGen(key: string, el: ElementDefinition) {
  if (el.tempHigh !== undefined && el.stateHigh === undefined) {
    if (el.state === "solid" || el.state === undefined) {
      const moltenName = `molten_${key}`;
      autoGen(moltenName, key, { behavior: behaveMolten, state: "liquid", type: "high", hidden: true, rgb: [[2, 1.25, 0.5], [2, 1, 0.5], [2, 0.75, 0]], viscosity: 10000, tempDiff: -100 });
      el.stateHigh = moltenName;
    } else if (el.state === "liquid") {
      const gasName = `${key}_gas`;
      autoGen(gasName, key, { behavior: behaveGas, state: "gas", type: "high", hidden: true, rgb: [[1.5, 1.5, 1.5]], tempDiff: -10 });
      el.stateHigh = gasName;
    }
  }

  if (el.tempLow !== undefined && el.stateLow === undefined) {
    if (el.state === "liquid") {
      const frozenName = `${key}_ice`;
      autoGen(frozenName, key, { behavior: behaveWall, state: "solid", type: "low", hidden: true, rgb: [[1.2, 1.2, 1.3]], tempDiff: 10 });
      el.stateLow = frozenName;
    } else if (el.state === "gas") {
      const liquidName = `liquid_${key}`;
      autoGen(liquidName, key, { behavior: behaveLiquid, state: "liquid", type: "low", hidden: true, rgb: [[0.5, 0.5, 0.5]], tempDiff: 10 });
      el.stateLow = liquidName;
    }
  }
}

// ===== INIT =====
export function initSimulation() {
  ensureTempCheckRegistered();
  createGrid();

  // First pass: set up colors and IDs
  for (const key in elements) {
    const el = elements[key];
    if (el.color && !el.colorObject) {
      const colors = Array.isArray(el.color) ? el.color : [el.color];
      const objs = colors.map((c: string) => {
        const hex = c.replace("#", "");
        return { r: parseInt(hex.substr(0, 2), 16), g: parseInt(hex.substr(2, 2), 16), b: parseInt(hex.substr(4, 2), 16) };
      });
      el.colorObject = objs.length === 1 ? objs[0] : objs;
    }
    if (!el.id) el.id = Object.keys(elements).indexOf(key) + 1;
  }

  // Second pass: auto-generate state transitions
  for (const key in elements) {
    const el = elements[key];
    checkAutoGen(key, el);
  }

  // Third pass: auto-assign behaviors
  for (const key in elements) {
    const el = elements[key];
    if (el.behavior) continue;
    if (el.movable === false) { el.behavior = behaveWall; continue; }
    if (el.tick || el.tool) continue;
    if (el.state === "gas") { el.behavior = behaveGas; continue; }
    if (el.state === "liquid") {
      if (key.startsWith("molten") || key.startsWith("melted") || (el.temp !== undefined && el.temp > 500)) {
        el.behavior = behaveMolten;
      } else {
        el.behavior = behaveLiquid;
      }
      continue;
    }
    if (el.state === "solid" && el.density !== undefined && el.density > 0) {
      el.behavior = behavePowder;
      continue;
    }
  }

  // Fourth pass: wire up custom tick functions
  const tickMap: Record<string, keyof typeof ticks> = {
    ant: "tickAnt",
    spider: "tickSpider",
    fly: "tickFly",
    firefly: "tickFirefly",
    bee: "tickBee",
    termite: "tickTermite",
    worm: "tickWorm",
    flea: "tickFlea",
    fish: "tickFish",
    frog: "tickFrog",
    tadpole: "tickTadpole",
    bird: "tickBird",
    rat: "tickRat",
    human: "tickHuman",
    grass: "tickGrass",
    plant: "tickPlant",
    sapling: "tickSapling",
    tree_branch: "tickTreeBranch",
    vine: "tickVine",
    cactus: "tickCactus",
    kelp: "tickKelp",
    coral: "tickCoral",
    mushroom_cap: "tickMushroom",
    mushroom_gill: "tickMushroom",
    lichen: "tickLichen",
    ecloner: "tickECloner",
    slow_cloner: "tickSlowCloner",
    clone_powder: "tickClonePowder",
    floating_cloner: "tickFloatingCloner",
    sensor: "tickSensor",
    fan: "tickFan",
    pressure_plate: "tickPressurePlate",
    void: "tickVoid",
    sun: "tickSun",
    antimatter: "tickAntimatter",
    light: "tickLight",
    flash: "tickFlash",
    neutron: "tickNeutron",
    midas_touch: "tickMidasTouch",
    virus: "tickVirus",
    infection: "tickInfection",
    antibody: "tickAntibody",
    tnt: "tickTNT",
    dynamite: "tickDynamite",
    c4: "tickC4",
    grenade: "tickGrenade",
    land_mine: "tickLandMine",
    nuke: "tickNuke",
    rocket: "tickRocket",
    firework: "tickFirework",
    explosion: "tickExplosion",
    fw_ember: "tickFwEmber",
    egg: "tickEgg",
    cell: "tickCell",
    cancer: "tickCancer",
    plague: "tickPlague",
  };
  for (const [key, tickName] of Object.entries(tickMap)) {
    if (elements[key] && ticks[tickName]) {
      elements[key]!.tick = ticks[tickName] as (pixel: Pixel) => void;
    }
  }
}


