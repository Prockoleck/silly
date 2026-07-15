import { Pixel, pixelMap, pixelTicks, W, H, outOfBounds, isEmpty, createPixel, deletePixel, changePixel, getPixel, movePixel, swapPixels, choose, shuffleArray, releaseElement, explodeAt, absoluteZero, pixelTempCheck } from "./core";
import elements from "../data/elements";
import { behaveCrawler, behaveFly, behaveLiquid, behaveWall, behaveGas, behaveSturdyPowder, behavePowder, behaveCloner, doDefaults, feedPixel, tryMove, pixelColorPick } from "./simulation";

function dieFromTemp(pixel: Pixel, tempHigh: number, tempLow: number, deathElem: string) {
  if (pixel.temp > tempHigh || pixel.temp < tempLow) {
    changePixel(pixel, deathElem);
    return true;
  }
  return false;
}

function randChance(pct: number) { return Math.random() * 100 < pct; }

function adjacentOfType(x: number, y: number, elem: string | string[]): boolean {
  const elems = Array.isArray(elem) ? elem : [elem];
  for (const [dx, dy] of [[0,-1],[0,1],[-1,0],[1,0],[-1,-1],[1,1],[1,-1],[-1,1]]) {
    const nx = x + dx, ny = y + dy;
    if (!outOfBounds(nx, ny) && pixelMap[nx]?.[ny] && elems.includes(pixelMap[nx][ny]!.element)) return true;
  }
  return false;
}

function countAdjacent(x: number, y: number, elem: string): number {
  let count = 0;
  for (const [dx, dy] of [[0,-1],[0,1],[-1,0],[1,0]]) {
    const nx = x + dx, ny = y + dy;
    if (!outOfBounds(nx, ny) && pixelMap[nx]?.[ny]?.element === elem) count++;
  }
  return count;
}

function randomEmptyNear(x: number, y: number, range = 1): [number, number] | null {
  const spots: [number, number][] = [];
  for (let dx = -range; dx <= range; dx++) {
    for (let dy = -range; dy <= range; dy++) {
      if (dx === 0 && dy === 0) continue;
      const nx = x + dx, ny = y + dy;
      if (!outOfBounds(nx, ny) && isEmpty(nx, ny)) spots.push([nx, ny]);
    }
  }
  if (spots.length === 0) return null;
  return choose(spots);
}

// ===== LIFE FORM TICK FUNCTIONS =====

export function tickAnt(pixel: Pixel) {
  if (pixel.start === pixelTicks.v) return;
  const died = dieFromTemp(pixel, 100, 0, "dead_bug");
  if (died) return;
  behaveCrawler(pixel,
    (_p, nx, ny) => {
      const tx = pixel.x + nx, ty = pixel.y + ny;
      if (!outOfBounds(tx, ty) && pixelMap[tx]?.[ty]) {
        const target = pixelMap[tx][ty]!;
        const inf = elements[target.element];
        const r = elements[pixel.element]?.reactions?.[target.element];
        if (r && (r.func || r.elem1 || r.elem2)) {
          if (r.elem2) {
            const e2 = Array.isArray(r.elem2) ? choose(r.elem2.filter(Boolean)) : r.elem2;
            if (e2) changePixel(target, e2);
          }
          if (r.elem1) {
            const e1 = Array.isArray(r.elem1) ? choose(r.elem1.filter(Boolean)) : r.elem1;
            if (e1) changePixel(pixel, e1);
          }
          if (!r.elem1 && r.chance && Math.random() < r.chance) {
            feedPixel(pixel);
          }
        } else if (inf?.foodNeed !== undefined && r?.chance) {
          if (Math.random() < r.chance) {
            changePixel(target, "dead_bug");
            feedPixel(pixel);
          }
        }
      }
    }
  );
}

export function tickSpider(pixel: Pixel) {
  if (pixel.start === pixelTicks.v) return;
  if (dieFromTemp(pixel, 100, 0, "dead_bug")) return;
  behaveCrawler(pixel,
    (_p, nx, ny) => {
      const tx = pixel.x + nx, ty = pixel.y + ny;
      if (!outOfBounds(tx, ty) && pixelMap[tx]?.[ty]) {
        const target = pixelMap[tx][ty]!;
        if (target.element === "fly" || target.element === "firefly" || target.element === "flea" || target.element === "dead_bug") {
          changePixel(target, "web");
          feedPixel(pixel);
        }
      }
    },
    (_p) => {
      if (randChance(0.5) && isEmpty(pixel.x, pixel.y + 1)) {
        createPixel("web", pixel.x, pixel.y + 1);
      }
    }
  );
}

export function tickFly(pixel: Pixel) {
  if (pixel.start === pixelTicks.v) return;
  if (dieFromTemp(pixel, 100, 0, "dead_bug")) return;
  behaveFly(pixel, (_p, target) => {
    if (target && elements[target.element]?.foodNeed !== undefined) {
      if (randChance(10)) { changePixel(target, "dead_bug"); feedPixel(pixel); }
    }
    if (target?.element === "rotten_meat" || target?.element === "dirty_water") {
      if (randChance(5)) feedPixel(pixel);
    }
  });
  if (pixel.del) return;
  if (adjacentOfType(pixel.x, pixel.y, ["rotten_meat", "dirty_water", "sugar", "honey"])) {
    if (randChance(2)) feedPixel(pixel);
  }
}

export function tickFirefly(pixel: Pixel) {
  if (pixel.start === pixelTicks.v) return;
  if (dieFromTemp(pixel, 100, 0, "dead_bug")) return;
  pixel.glow = true;
  behaveFly(pixel, (_p, target) => {
    if (target && (target.element === "dead_bug" || target.element === "petal" || target.element === "pistil")) {
      if (randChance(10)) feedPixel(pixel);
    }
  });
}

export function tickBee(pixel: Pixel) {
  if (pixel.start === pixelTicks.v) return;
  if (dieFromTemp(pixel, 100, 0, "dead_bug")) return;
  behaveFly(pixel, (_p, target) => {
    if (!target) return;
    if ((target.element === "petal" || target.element === "pistil" || target.element === "flower_seed" || target.element === "pollen") && randChance(15)) {
      feedPixel(pixel);
      if (pixel.food && pixel.food > 10 && randChance(5) && isEmpty(pixel.x, pixel.y + 1)) {
        createPixel("honey", pixel.x, pixel.y + 1);
      }
    }
  });
}

export function tickTermite(pixel: Pixel) {
  if (pixel.start === pixelTicks.v) return;
  if (dieFromTemp(pixel, 100, 0, "dead_bug")) return;
  behaveCrawler(pixel,
    (_p, nx, ny) => {
      const tx = pixel.x + nx, ty = pixel.y + ny;
      if (!outOfBounds(tx, ty) && pixelMap[tx]?.[ty]) {
        const target = pixelMap[tx][ty]!;
        const woodTypes = ["wood", "tree_branch", "paper", "cellulose", "bamboo", "bamboo_plant", "sapling", "sawdust", "mulch", "confetti", "wheat", "straw", "particleboard", "tinder", "lichen"];
        if (woodTypes.includes(target.element) && randChance(4)) {
          changePixel(target, "sawdust");
          feedPixel(pixel);
        }
      }
    }
  );
}

export function tickWorm(pixel: Pixel) {
  if (pixel.start === pixelTicks.v) return;
  if (dieFromTemp(pixel, 100, 0, "dead_bug")) return;
  const dirs = shuffleArray([[0,1],[0,-1],[1,0],[-1,0]]);
  for (const [dx, dy] of dirs) {
    const nx = pixel.x + dx, ny = pixel.y + dy;
    if (!outOfBounds(nx, ny) && pixelMap[nx]?.[ny]) {
      const target = pixelMap[nx][ny]!;
      if ((target.element === "dirt" || target.element === "mud" || target.element === "wet_sand" || target.element === "clay_soil") && randChance(5)) {
        swapPixels(pixel, target);
        feedPixel(pixel);
        return;
      }
    }
  }
  tryMove(pixel, pixel.x, pixel.y + 1);
  doDefaults(pixel);
}

export function tickFlea(pixel: Pixel) {
  if (pixel.start === pixelTicks.v) return;
  if (dieFromTemp(pixel, 100, 0, "dead_bug")) return;
  if (!tryMove(pixel, pixel.x + (pixel.flipX ? -1 : 1), pixel.y - 1)) {
    if (!tryMove(pixel, pixel.x, pixel.y - 1)) {
      pixel.flipX = !pixel.flipX;
      if (!tryMove(pixel, pixel.x + (pixel.flipX ? -1 : 1), pixel.y + 1)) {
        tryMove(pixel, pixel.x, pixel.y + 1);
      }
    }
  }
  for (const [dx, dy] of [[0,1],[0,-1],[1,0],[-1,0]]) {
    const nx = pixel.x + dx, ny = pixel.y + dy;
    if (!outOfBounds(nx, ny) && pixelMap[nx]?.[ny]?.element === "blood") {
      feedPixel(pixel);
      break;
    }
  }
  doDefaults(pixel);
}

export function tickFish(pixel: Pixel) {
  if (pixel.start === pixelTicks.v) return;
  if (dieFromTemp(pixel, 50, 0, "dead_bug")) return;
  if (pixel.element !== "fish") return;
  behaveLiquid(pixel);
  if (pixel.del || pixel.element !== "fish") return;
  for (const [dx, dy] of [[0,1],[0,-1],[1,0],[-1,0]]) {
    const nx = pixel.x + dx, ny = pixel.y + dy;
    if (!outOfBounds(nx, ny) && pixelMap[nx]?.[ny]) {
      const target = pixelMap[nx][ny]!;
      const foods = ["algae", "plankton", "plant", "worm"];
      if (foods.includes(target.element) && randChance(5)) {
        changePixel(target, "water");
        feedPixel(pixel);
      }
      if (target.element === "frog" || target.element === "tadpole" || target.element === "fish") {
        if (randChance(1)) { changePixel(pixel, "dead_bug"); }
      }
    }
  }
}

export function tickFrog(pixel: Pixel) {
  if (pixel.start === pixelTicks.v) return;
  if (dieFromTemp(pixel, 50, 0, "dead_bug")) return;
  const waterNear = adjacentOfType(pixel.x, pixel.y, ["water", "salt_water", "dirty_water"]);
  if (!waterNear && pixelMap[pixel.x]?.[pixel.y + 1]) {
    if (!tryMove(pixel, pixel.x, pixel.y + 1)) {
      if (randChance(5)) tryMove(pixel, pixel.x + (Math.random() < 0.5 ? 1 : -1), pixel.y);
    }
  }
  if (waterNear && randChance(10)) {
    const dir = Math.random() < 0.5 ? 1 : -1;
    if (isEmpty(pixel.x + dir, pixel.y) || isEmpty(pixel.x + dir, pixel.y - 1)) {
      if (tryMove(pixel, pixel.x + dir, pixel.y - 1)) {}
    }
  }
  for (const [dx, dy] of [[0,0],[0,1],[0,-1],[1,0],[-1,0],[1,1],[1,-1],[-1,1],[-1,-1]]) {
    const nx = pixel.x + dx, ny = pixel.y + dy;
    if (!outOfBounds(nx, ny) && pixelMap[nx]?.[ny]) {
      const target = pixelMap[nx][ny]!;
      if ((target.element === "fly" || target.element === "firefly" || target.element === "flea" || target.element === "worm") && randChance(10)) {
        changePixel(target, "dead_bug");
        feedPixel(pixel);
      }
    }
  }
  if (waterNear && pixel.food && pixel.food > 15 && randChance(2)) {
    releaseElement(pixel, "tadpole", 1);
    pixel.food = 0;
  }
  doDefaults(pixel);
}

export function tickTadpole(pixel: Pixel) {
  if (pixel.start === pixelTicks.v) return;
  if (dieFromTemp(pixel, 50, 0, "dead_bug")) return;
  behaveLiquid(pixel);
  if (pixel.del) return;
  if (pixel.food === undefined) pixel.food = 0;
  if (adjacentOfType(pixel.x, pixel.y, ["algae", "plankton"])) {
    if (randChance(10)) pixel.food++;
  }
  if (pixel.food && pixel.food > 10) {
    changePixel(pixel, "frog");
    return;
  }
  if (randChance(0.5) && pixel.temp > 30) {
    changePixel(pixel, "frog");
  }
}

export function tickBird(pixel: Pixel) {
  if (pixel.start === pixelTicks.v) return;
  if (dieFromTemp(pixel, 120, -18, "cooked_meat")) return;
  behaveFly(pixel, (_p, target) => {
    if (!target) return;
    const seeds = ["wheat_seed", "corn_seed", "flower_seed", "grass_seed", "pumpkin_seed", "seeds", "rice", "corn", "wheat", "coffee_bean"];
    if (seeds.includes(target.element) && randChance(10)) {
      changePixel(target, "dirt");
      feedPixel(pixel);
    }
    if ((target.element === "worm" || target.element === "flea" || target.element === "ant" || target.element === "termite" || target.element === "dead_bug" || target.element === "spider") && randChance(8)) {
      changePixel(target, "dead_bug");
      feedPixel(pixel);
    }
  });
}

export function tickRat(pixel: Pixel) {
  if (pixel.start === pixelTicks.v) return;
  if (dieFromTemp(pixel, 60, -10, "rotten_meat")) return;
  behaveCrawler(pixel,
    (_p, nx, ny) => {
      const tx = pixel.x + nx, ty = pixel.y + ny;
      if (!outOfBounds(tx, ty) && pixelMap[tx]?.[ty]) {
        const target = pixelMap[tx][ty]!;
        const foods = ["cheese", "bread", "meat", "rotten_meat", "wheat", "corn", "rice", "sugar", "candy", "chocolate", "dough", "batter", "nut", "nut_meat", "cheese_powder", "rotten_cheese"];
        if (foods.includes(target.element) && randChance(8)) {
          changePixel(target, "dirt");
          feedPixel(pixel);
        }
        if (target.element === "dead_bug" && randChance(5)) {
          changePixel(target, "dirt");
          feedPixel(pixel);
        }
      }
    }
  );
}

export function tickHuman(pixel: Pixel) {
  if (pixel.start === pixelTicks.v) return;
  const info = elements[pixel.element];
  if (!info) return;
  if (pixel.dead) { changePixel(pixel, "body"); return; }
  if (pixel.temp > 60 || pixel.temp < -10) { changePixel(pixel, "body"); pixel.dead = true; return; }
  if (pixel.del) return;
  doDefaults(pixel);
  if (pixel.del) return;
  if (pixel.panic === undefined) pixel.panic = 0;
  if (pixel.panic > 0 && randChance(10)) {
    const dir = pixel.flipX ? -1 : 1;
    for (let i = 0; i < 3; i++) {
      if (tryMove(pixel, pixel.x + dir, pixel.y + (Math.random() < 0.5 ? -1 : 1))) break;
    }
    pixel.panic = Math.max(0, pixel.panic - 1);
  }
  for (const [dx, dy] of [[0, -1], [0, 1], [-1, 0], [1, 0]]) {
    const nx = pixel.x + dx, ny = pixel.y + dy;
    if (outOfBounds(nx, ny)) continue;
    const np = pixelMap[nx]?.[ny];
    if (!np) continue;
    if (np.element === "infection" || np.element === "plague" || np.element === "cancer") {
      if (randChance(5)) { pixel.panic = 5; }
    }
    if (np.element === "fire" || np.element === "plasma" || np.element === "acid" || np.element === "acid_gas") {
      if (randChance(10)) { pixel.panic = 5; tryMove(pixel, pixel.x + (pixel.flipX ? -1 : 1), pixel.y - 1); }
    }
  }
  if (pixel.food === undefined) pixel.food = 0;
  if (adjacentOfType(pixel.x, pixel.y, ["meat", "bread", "cooked_meat", "fruit", "vegetable", "cheese", "candy", "chocolate", "juice", "soda", "coffee", "tea", "broth"])) {
    if (randChance(2)) pixel.food++;
  }
}

// ===== PLANT TICK FUNCTIONS =====

export function tickGrass(pixel: Pixel) {
  if (pixel.start === pixelTicks.v) return;
  doDefaults(pixel);
  if (pixel.del) return;
  if (pixel.h === undefined) pixel.h = 0;
  if (pixel.h < 5 && randChance(1)) {
    pixel.h++;
  }
  if (pixel.h >= 2 && randChance(0.05)) {
    const dirs = shuffleArray([[-1, 1], [1, 1], [-1, 0], [1, 0]]);
    for (const [dx, dy] of dirs) {
      const nx = pixel.x + dx, ny = pixel.y + dy;
      if (outOfBounds(nx, ny)) continue;
      const target = pixelMap[nx]?.[ny];
      if (target && target.element === "dirt" && isEmpty(nx, ny - 1)) {
        createPixel("grass", nx, ny - 1);
        const gp = pixelMap[nx][ny - 1];
        if (gp) { gp.h = 0; gp.temp = pixel.temp; }
        break;
      }
      if (target && (target.element === "mud" || target.element === "clay_soil") && isEmpty(nx, ny - 1)) {
        createPixel("grass", nx, ny - 1);
        break;
      }
    }
  }
}

export function tickPlant(pixel: Pixel) {
  if (pixel.start === pixelTicks.v) return;
  doDefaults(pixel);
  if (pixel.del) return;
  if (pixel.temp > 60 || pixel.temp < -5) return;
  if (pixel.moist === undefined) pixel.moist = 0;
  if (adjacentOfType(pixel.x, pixel.y, ["water", "dirty_water", "salt_water", "sugar_water"]) && pixel.moist < 10) {
    pixel.moist += 0.1;
  }
  if (pixel.moist > 0 && randChance(0.1) && pixel.h === undefined) {
    pixel.h = 0;
  }
  if (pixel.h !== undefined && pixel.h < 10 && pixel.moist > 1 && randChance(0.5)) {
    pixel.h++;
  }
  if (pixel.h !== undefined && pixel.h > 3 && randChance(0.02) && isEmpty(pixel.x, pixel.y - 1)) {
    createPixel("petal", pixel.x, pixel.y - 1);
  }
  if (pixel.h !== undefined && pixel.h > 5 && randChance(0.01)) {
    releaseElement(pixel, "seed", 1);
  }
}

export function tickSapling(pixel: Pixel) {
  if (pixel.start === pixelTicks.v) return;
  doDefaults(pixel);
  if (pixel.del) return;
  if (pixel.temp > 60 || pixel.temp < -5) return;
  if (pixel.moist === undefined) pixel.moist = 0;
  if (adjacentOfType(pixel.x, pixel.y, ["water", "dirty_water"]) && pixel.moist < 10) {
    pixel.moist += 0.05;
  }
  if (pixel.moist > 5 && pixel.h === undefined) pixel.h = 0;
  if (pixel.h !== undefined && pixel.h < 3 && pixel.moist > 3 && randChance(0.2)) {
    pixel.h++;
  }
  if (pixel.h !== undefined && pixel.h >= 3 && pixel.moist > 5) {
    changePixel(pixel, "tree_branch");
    return;
  }
}

export function tickTreeBranch(pixel: Pixel) {
  if (pixel.start === pixelTicks.v) return;
  doDefaults(pixel);
  if (pixel.del) return;
  if (pixel.temp > 60 || pixel.temp < -5) return;
  if (randChance(0.1) && isEmpty(pixel.x, pixel.y - 1)) {
    createPixel("tree_branch", pixel.x, pixel.y - 1);
    const branch = pixelMap[pixel.x][pixel.y - 1];
    if (branch) branch.temp = pixel.temp;
  }
  if (randChance(0.05)) {
    const dirs = shuffleArray([[-1, 0], [1, 0], [-1, -1], [1, -1]]);
    for (const [dx, dy] of dirs) {
      const nx = pixel.x + dx, ny = pixel.y + dy;
      if (!outOfBounds(nx, ny) && isEmpty(nx, ny)) {
        createPixel("leaf", nx, ny);
        break;
      }
    }
  }
  if (randChance(0.02)) {
    releaseElement(pixel, "sapling", 1);
  }
}

export function tickVine(pixel: Pixel) {
  if (pixel.start === pixelTicks.v) return;
  doDefaults(pixel);
  if (pixel.del) return;
  if (pixel.temp > 60 || pixel.temp < -5) return;
  if (randChance(1)) {
    const dirs = shuffleArray([[0, 1], [0, -1], [-1, 0], [1, 0]]);
    for (const [dx, dy] of dirs) {
      const nx = pixel.x + dx, ny = pixel.y + dy;
      if (!outOfBounds(nx, ny) && isEmpty(nx, ny) && adjacentOfType(nx, ny, ["wall", "wood", "tree_branch", "stone", "rock", "brick", "concrete"])) {
        createPixel("vine", nx, ny);
        break;
      }
    }
  }
}

export function tickCactus(pixel: Pixel) {
  if (pixel.start === pixelTicks.v) return;
  doDefaults(pixel);
  if (pixel.del) return;
  if (pixel.temp > 80) return;
  if (randChance(0.05) && isEmpty(pixel.x, pixel.y - 1)) {
    createPixel("cactus", pixel.x, pixel.y - 1);
  }
  if (randChance(0.02)) {
    const spots = shuffleArray([[-1, 0], [1, 0], [-1, 1], [1, 1]]);
    for (const [dx, dy] of spots) {
      const nx = pixel.x + dx, ny = pixel.y + dy;
      if (!outOfBounds(nx, ny) && isEmpty(nx, ny) && (adjacentOfType(nx, ny, ["sand", "desert_sand"]))) {
        createPixel("cactus", nx, ny);
        break;
      }
    }
  }
}

export function tickKelp(pixel: Pixel) {
  if (pixel.start === pixelTicks.v) return;
  doDefaults(pixel);
  if (pixel.del) return;
  const inWater = adjacentOfType(pixel.x, pixel.y, ["water", "salt_water"]);
  if (!inWater) { changePixel(pixel, "dead_plant"); return; }
  if (randChance(0.1) && isEmpty(pixel.x, pixel.y - 1)) {
    createPixel("kelp", pixel.x, pixel.y - 1);
    const kp = pixelMap[pixel.x][pixel.y - 1];
    if (kp) kp.temp = pixel.temp;
  }
}

export function tickCoral(pixel: Pixel) {
  if (pixel.start === pixelTicks.v) return;
  doDefaults(pixel);
  if (pixel.del) return;
  const inWater = adjacentOfType(pixel.x, pixel.y, ["water", "salt_water"]);
  if (!inWater) { changePixel(pixel, "dead_plant"); return; }
  if (randChance(0.05)) {
    const spots = shuffleArray([[-1, 0], [1, 0], [0, 1], [0, -1]]);
    for (const [dx, dy] of spots) {
      const nx = pixel.x + dx, ny = pixel.y + dy;
      if (!outOfBounds(nx, ny) && isEmpty(nx, ny)) {
        createPixel("coral", nx, ny);
        break;
      }
    }
  }
}

export function tickMushroom(pixel: Pixel) {
  if (pixel.start === pixelTicks.v) return;
  doDefaults(pixel);
  if (pixel.del) return;
  if (pixel.temp > 40 || pixel.temp < -5) return;
  if (randChance(0.02)) {
    const spots = shuffleArray([[-1, 1], [1, 1], [-1, 0], [1, 0]]);
    for (const [dx, dy] of spots) {
      const nx = pixel.x + dx, ny = pixel.y + dy;
      if (!outOfBounds(nx, ny) && isEmpty(nx, ny) && (adjacentOfType(nx, ny, ["wood", "dirt", "mud", "rotten_meat"]))) {
        const elem = pixel.element === "mushroom_cap" ? "mushroom_gill" : "mushroom_cap";
        createPixel(elem, nx, ny);
        break;
      }
    }
  }
}

export function tickLichen(pixel: Pixel) {
  if (pixel.start === pixelTicks.v) return;
  doDefaults(pixel);
  if (pixel.del) return;
  if (randChance(0.05)) {
    const spots = shuffleArray([[-1, 0], [1, 0], [0, 1], [0, -1], [-1, -1], [1, 1], [-1, 1], [1, -1]]);
    for (const [dx, dy] of spots) {
      const nx = pixel.x + dx, ny = pixel.y + dy;
      if (!outOfBounds(nx, ny) && isEmpty(nx, ny) && adjacentOfType(nx, ny, ["rock", "stone", "wall", "wood", "tree_branch"])) {
        createPixel("lichen", nx, ny);
        break;
      }
    }
  }
}

// ===== MACHINE TICK FUNCTIONS =====

export function tickECloner(pixel: Pixel) {
  if (pixel.start === pixelTicks.v) return;
  if (pixel.charge === undefined || pixel.charge <= 0) return;
  for (const [dx, dy] of [[0,1],[0,-1],[1,0],[-1,0]]) {
    const nx = pixel.x + dx, ny = pixel.y + dy;
    if (!outOfBounds(nx, ny) && pixelMap[nx]?.[ny]) {
      const target = pixelMap[nx][ny]!;
      if (target.element === pixel.element || target.element === "wall") continue;
      const elem = elements[target.element];
      if (elem?.ignore?.includes(pixel.element)) continue;
      const pick = elem?.pickElement || target.element;
      const spots = shuffleArray([[0,1],[0,-1],[1,0],[-1,0],[1,1],[1,-1],[-1,1],[-1,-1]]);
      for (const [sx, sy] of spots) {
        const px = pixel.x + sx, py = pixel.y + sy;
        if (!outOfBounds(px, py) && isEmpty(px, py)) {
          createPixel(pick.includes(",") ? choose(pick.split(",")) : pick, px, py);
          return;
        }
      }
    }
  }
  doDefaults(pixel);
}

export function tickSlowCloner(pixel: Pixel) {
  if (pixel.start === pixelTicks.v) return;
  if (pixelTicks.v % 3 !== 0) return;
  behaveCloner(pixel);
}

export function tickClonePowder(pixel: Pixel) {
  if (pixel.start === pixelTicks.v) return;
  behavePowder(pixel);
  if (pixel.del) return;
  if (pixelTicks.v % 2 !== 0) return;
  for (const [dx, dy] of [[0,1],[0,-1],[1,0],[-1,0]]) {
    const nx = pixel.x + dx, ny = pixel.y + dy;
    if (outOfBounds(nx, ny) || !pixelMap[nx]?.[ny]) continue;
    const target = pixelMap[nx][ny]!;
    if (target.element === pixel.element || target.element === "wall" || target.element === "cloner") continue;
    const pick = elements[target.element]?.pickElement || target.element;
    if (!pixel.clone) { pixel.clone = pick; pixel.temp = target.temp; }
    else {
      const spots = shuffleArray([[-1, 0], [1, 0], [0, 1], [0, -1], [1, 1], [-1, 1], [1, -1], [-1, -1]]);
      for (const [sx, sy] of spots) {
        const px = pixel.x + sx, py = pixel.y + sy;
        if (!outOfBounds(px, py) && isEmpty(px, py)) {
          createPixel(pixel.clone, px, py);
          return;
        }
      }
    }
  }
  doDefaults(pixel);
}

export function tickFloatingCloner(pixel: Pixel) {
  if (pixel.start === pixelTicks.v) return;
  if (isEmpty(pixel.x, pixel.y + 1)) {
    tryMove(pixel, pixel.x, pixel.y + 1);
  }
  if (pixel.del) return;
  if (pixelTicks.v % 3 !== 0) return;
  for (const [dx, dy] of [[0,1],[0,-1],[1,0],[-1,0]]) {
    const nx = pixel.x + dx, ny = pixel.y + dy;
    if (outOfBounds(nx, ny) || !pixelMap[nx]?.[ny]) continue;
    const target = pixelMap[nx][ny]!;
    if (target.element === "wall" || target.element === "cloner" || target.element === "ecloner" || target.element === "floating_cloner") continue;
    const pick = elements[target.element]?.pickElement || target.element;
    const spots = shuffleArray([[-1, 0], [1, 0], [0, 1], [0, -1]]);
    for (const [sx, sy] of spots) {
      const px = pixel.x + sx, py = pixel.y + sy;
      if (!outOfBounds(px, py) && isEmpty(px, py)) {
        createPixel(pick.includes(",") ? choose(pick.split(",")) : pick, px, py);
        return;
      }
    }
  }
}

export function tickSensor(pixel: Pixel) {
  if (pixel.start === pixelTicks.v) return;
  const range = 3;
  let detected = false;
  for (let dx = -range; dx <= range; dx++) {
    for (let dy = -range; dy <= range; dy++) {
      if (dx === 0 && dy === 0) continue;
      const nx = pixel.x + dx, ny = pixel.y + dy;
      if (outOfBounds(nx, ny)) continue;
      const np = pixelMap[nx]?.[ny];
      if (np && np.element !== "wall" && np.element !== pixel.element) {
        if (elements[np.element]?.ignore?.includes(pixel.element)) continue;
        if (elements[pixel.element]?.ignore?.includes(np.element)) continue;
        detected = true;
        break;
      }
    }
    if (detected) break;
  }
  if (detected) {
    for (const [dx, dy] of [[0,1],[0,-1],[1,0],[-1,0]]) {
      const nx = pixel.x + dx, ny = pixel.y + dy;
      if (!outOfBounds(nx, ny) && pixelMap[nx]?.[ny]) {
        const np = pixelMap[nx][ny]!;
        if (elements[np.element]?.conduct !== undefined && !np.charge) {
          np.charge = 1;
          np.chargeStart = pixelTicks.v;
        }
      }
    }
  }
  doDefaults(pixel);
}

export function tickFan(pixel: Pixel) {
  if (pixel.start === pixelTicks.v) return;
  if (pixel.charge === undefined || pixel.charge <= 0) return;
  const dirs = [[0, -1], [0, -2], [0, -3]];
  for (const [dx, dy] of dirs) {
    const nx = pixel.x + dx, ny = pixel.y + dy;
    if (outOfBounds(nx, ny)) continue;
    const np = pixelMap[nx]?.[ny];
    if (!np || elements[np.element]?.movable === false) continue;
    const targetY = ny - 1;
    if (!outOfBounds(nx, targetY) && isEmpty(nx, targetY)) {
      movePixel(np, nx, targetY);
    } else if (!outOfBounds(nx, ny + 1) && isEmpty(nx, ny + 1)) {
      const dir = pixel.flipX ? -1 : 1;
      const sx = nx + dir;
      if (!outOfBounds(sx, ny) && isEmpty(sx, ny)) {
        movePixel(np, sx, ny);
      }
    }
  }
}

export function tickPressurePlate(pixel: Pixel) {
  if (pixel.start === pixelTicks.v) return;
  const above = pixelMap[pixel.x]?.[pixel.y - 1];
  const hasWeight = above !== undefined && above.element !== "wall" && above.element !== pixel.element;
  if (hasWeight) {
    for (const [dx, dy] of [[0,1],[0,-1],[1,0],[-1,0]]) {
      const nx = pixel.x + dx, ny = pixel.y + dy;
      if (!outOfBounds(nx, ny) && pixelMap[nx]?.[ny]) {
        const np = pixelMap[nx][ny]!;
        if (elements[np.element]?.conduct !== undefined && !np.charge) {
          np.charge = 1;
          np.chargeStart = pixelTicks.v;
        }
      }
    }
  }
  doDefaults(pixel);
}

export function tickVoid(pixel: Pixel) {
  if (pixel.start === pixelTicks.v) return;
  for (const [dx, dy] of [[0,1],[0,-1],[1,0],[-1,0],[1,1],[1,-1],[-1,1],[-1,-1]]) {
    const nx = pixel.x + dx, ny = pixel.y + dy;
    if (!outOfBounds(nx, ny) && pixelMap[nx]?.[ny]) {
      const np = pixelMap[nx][ny]!;
      if (elements[np.element]?.hardness && Math.random() < elements[np.element]!.hardness!) continue;
      deletePixel(nx, ny);
    }
  }
  doDefaults(pixel);
}

export function tickSun(pixel: Pixel) {
  if (pixel.start === pixelTicks.v) return;
  for (let dx = -2; dx <= 2; dx++) {
    for (let dy = -2; dy <= 2; dy++) {
      if (dx === 0 && dy === 0) continue;
      const nx = pixel.x + dx, ny = pixel.y + dy;
      if (outOfBounds(nx, ny)) continue;
      const np = pixelMap[nx]?.[ny];
      if (!np) continue;
      np.temp += 5;
      pixelTempCheck(np);
      if (elements[np.element]?.burn !== undefined && !np.burning && Math.random() * 100 < elements[np.element]!.burn! * 0.1) {
        np.burning = true;
        np.burnStart = pixelTicks.v;
      }
    }
  }
  doDefaults(pixel);
}

export function tickAntimatter(pixel: Pixel) {
  if (pixel.start === pixelTicks.v) return;
  for (const [dx, dy] of [[0,1],[0,-1],[1,0],[-1,0],[1,1],[1,-1],[-1,1],[-1,-1]]) {
    const nx = pixel.x + dx, ny = pixel.y + dy;
    if (outOfBounds(nx, ny)) continue;
    if (isEmpty(nx, ny)) {
      if (randChance(5)) {
        const elems = ["photons", "energy", "explosion"];
        createPixel(choose(elems), nx, ny);
      }
    } else {
      const np = pixelMap[nx][ny]!;
      if (elements[np.element]?.hardness && Math.random() < elements[np.element]!.hardness!) continue;
      deletePixel(nx, ny);
    }
  }
  if (randChance(2)) {
    deletePixel(pixel.x, pixel.y);
  }
  doDefaults(pixel);
}

export function tickLight(pixel: Pixel) {
  if (pixel.start === pixelTicks.v) return;
  if (randChance(10)) { deletePixel(pixel.x, pixel.y); return; }
  for (const [dx, dy] of [[0,-1],[0,1],[-1,0],[1,0]]) {
    const nx = pixel.x + dx, ny = pixel.y + dy;
    if (outOfBounds(nx, ny)) continue;
    if (isEmpty(nx, ny)) {
      createPixel("light", nx, ny);
      const lp = pixelMap[nx][ny];
      if (lp) lp.temp = pixel.temp;
      break;
    }
  }
  doDefaults(pixel);
}

export function tickFlash(pixel: Pixel) {
  if (pixel.start === pixelTicks.v) return;
  for (const [dx, dy] of [[0,-1],[0,1],[-1,0],[1,0]]) {
    const nx = pixel.x + dx, ny = pixel.y + dy;
    if (outOfBounds(nx, ny)) continue;
    const np = pixelMap[nx]?.[ny];
    if (np && np.element === "flash" && randChance(20)) {
      deletePixel(pixel.x, pixel.y);
      return;
    }
  }
  if (randChance(15)) { deletePixel(pixel.x, pixel.y); return; }
  doDefaults(pixel);
}

export function tickNeutron(pixel: Pixel) {
  if (pixel.start === pixelTicks.v) return;
  behaveGas(pixel);
  if (pixel.del) return;
  for (const [dx, dy] of [[0,1],[0,-1],[1,0],[-1,0]]) {
    const nx = pixel.x + dx, ny = pixel.y + dy;
    if (outOfBounds(nx, ny)) continue;
    const np = pixelMap[nx]?.[ny];
    if (!np) continue;
    const nf = elements[np.element];
    if (nf?.hardness !== undefined && Math.random() < nf.hardness) { np.temp += 200; pixelTempCheck(np); continue; }
    const target = np.element;
    if (target === "neutron" || target === "wall") continue;
    const results: Record<string, string> = {
      "hydrogen": "proton",
      "water": "steam",
      "uranium": "radiation",
      "plutonium": "radiation",
      "sodium": "magnesium",
      "potassium": "calcium",
      "iron": "manganese",
      "copper": "nickel",
    };
    if (results[target]) {
      changePixel(np, results[target]);
      if (randChance(30)) deletePixel(pixel.x, pixel.y);
    } else {
      np.temp += 100;
      pixelTempCheck(np);
    }
  }
}

export function tickMidasTouch(pixel: Pixel) {
  if (pixel.start === pixelTicks.v) return;
  behaveGas(pixel);
  if (pixel.del) return;
  for (const [dx, dy] of [[0,1],[0,-1],[1,0],[-1,0]]) {
    const nx = pixel.x + dx, ny = pixel.y + dy;
    if (outOfBounds(nx, ny)) continue;
    const np = pixelMap[nx]?.[ny];
    if (!np) continue;
    if (np.element !== "gold" && np.element !== "wall" && np.element !== "midas_touch") {
      if (elements[np.element]?.hardness && Math.random() < elements[np.element]!.hardness!) continue;
      changePixel(np, "gold");
    }
  }
}

export function tickVirus(pixel: Pixel) {
  if (pixel.start === pixelTicks.v) return;
  behavePowder(pixel);
  if (pixel.del) return;
  if (pixelTicks.v % 3 !== 0) return;
  for (const [dx, dy] of [[0,1],[0,-1],[1,0],[-1,0]]) {
    const nx = pixel.x + dx, ny = pixel.y + dy;
    if (outOfBounds(nx, ny)) continue;
    const np = pixelMap[nx]?.[ny];
    if (!np) continue;
    const nf = elements[np.element];
    if (nf?.category === "life" && np.element !== "virus" && np.element !== "dead_bug" && np.element !== "antibody") {
      if (randChance(10)) {
        changePixel(np, "virus");
      }
    }
  }
}

export function tickInfection(pixel: Pixel) {
  if (pixel.start === pixelTicks.v) return;
  behaveLiquid(pixel);
  if (pixel.del) return;
  if (pixelTicks.v % 3 !== 0) return;
  for (const [dx, dy] of [[0,1],[0,-1],[1,0],[-1,0]]) {
    const nx = pixel.x + dx, ny = pixel.y + dy;
    if (outOfBounds(nx, ny)) continue;
    const np = pixelMap[nx]?.[ny];
    if (!np) continue;
    if (np.element === "blood" || np.element === "meat" || np.element === "body" || np.element === "head") {
      if (randChance(15)) changePixel(np, "infection");
    }
    if (np.element === "antibody" && randChance(20)) {
      deletePixel(pixel.x, pixel.y);
      return;
    }
  }
}

export function tickAntibody(pixel: Pixel) {
  if (pixel.start === pixelTicks.v) return;
  behaveLiquid(pixel);
  if (pixel.del) return;
  for (const [dx, dy] of [[0,1],[0,-1],[1,0],[-1,0]]) {
    const nx = pixel.x + dx, ny = pixel.y + dy;
    if (outOfBounds(nx, ny)) continue;
    const np = pixelMap[nx]?.[ny];
    if (!np) continue;
    if (np.element === "infection" && randChance(20)) {
      changePixel(np, "blood");
      return;
    }
    if (np.element === "plague" && randChance(5)) {
      changePixel(np, "blood");
      return;
    }
  }
}

// ===== EXPLOSIVE TICK FUNCTIONS =====

function explosionSmoke(x: number, y: number, count: number) {
  for (let i = 0; i < count; i++) {
    const nx = x + Math.floor(Math.random() * count * 3) - Math.floor(count * 1.5);
    const ny = y + Math.floor(Math.random() * count * 3) - Math.floor(count * 1.5);
    if (!outOfBounds(nx, ny) && isEmpty(nx, ny)) {
      createPixel("smoke", nx, ny);
    }
  }
}

function igniteNearby(x: number, y: number, radius: number, elementKey: string) {
  for (let dx = -radius; dx <= radius; dx++) {
    for (let dy = -radius; dy <= radius; dy++) {
      if (dx * dx + dy * dy > radius * radius) continue;
      const nx = x + dx, ny = y + dy;
      if (outOfBounds(nx, ny)) continue;
      const np = pixelMap[nx]?.[ny];
      if (np && np.element === elementKey && !np.burning) {
        np.burning = true;
        np.burnStart = pixelTicks.v;
      }
    }
  }
}

export function tickTNT(pixel: Pixel) {
  if (pixel.start === pixelTicks.v) return;
  if (pixel.burning || (pixel.charge && pixel.charge > 0) || pixel.temp > 200) {
    igniteNearby(pixel.x, pixel.y, 8, "tnt");
    explodeAt(pixel.x, pixel.y, 8, "fire");
    explosionSmoke(pixel.x, pixel.y, 8);
    deletePixel(pixel.x, pixel.y);
    return;
  }
  behaveSturdyPowder(pixel);
}

export function tickDynamite(pixel: Pixel) {
  if (pixel.start === pixelTicks.v) return;
  const ignited = pixel.burning || (pixel.charge && pixel.charge > 0) || pixel.temp > 200;
  if (ignited) {
    if (!pixel.burning) { pixel.burning = true; pixel.burnStart = pixelTicks.v; }
    if (pixelTicks.v - (pixel.burnStart ?? pixelTicks.v) > 50) {
      igniteNearby(pixel.x, pixel.y, 10, "dynamite");
      explodeAt(pixel.x, pixel.y, 10, "fire");
      explosionSmoke(pixel.x, pixel.y, 10);
      deletePixel(pixel.x, pixel.y);
      return;
    }
  }
  behaveSturdyPowder(pixel);
}

export function tickC4(pixel: Pixel) {
  if (pixel.start === pixelTicks.v) return;
  if (pixel.burning || (pixel.charge && pixel.charge > 0) || pixel.temp > 200) {
    igniteNearby(pixel.x, pixel.y, 14, "c4");
    explodeAt(pixel.x, pixel.y, 14, "explosion");
    explosionSmoke(pixel.x, pixel.y, 15);
    deletePixel(pixel.x, pixel.y);
    return;
  }
  behaveSturdyPowder(pixel);
}

export function tickGrenade(pixel: Pixel) {
  if (pixel.start === pixelTicks.v) return;
  const ignited = pixel.burning || (pixel.charge && pixel.charge > 0) || pixel.temp > 200;
  if (ignited) {
    if (!pixel.burning) { pixel.burning = true; pixel.burnStart = pixelTicks.v; }
    if (pixelTicks.v - (pixel.burnStart ?? pixelTicks.v) > 30) {
      explodeAt(pixel.x, pixel.y, 12, "shrapnel");
      explosionSmoke(pixel.x, pixel.y, 8);
      deletePixel(pixel.x, pixel.y);
      return;
    }
  }
  behaveSturdyPowder(pixel);
}

export function tickLandMine(pixel: Pixel) {
  if (pixel.start === pixelTicks.v) return;
  behaveSturdyPowder(pixel);
  if (pixel.del) return;
  if (pixel.temp > 200) {
    explodeAt(pixel.x, pixel.y, 10, "shrapnel");
    explosionSmoke(pixel.x, pixel.y, 8);
    deletePixel(pixel.x, pixel.y);
    return;
  }
  const above = pixelMap[pixel.x]?.[pixel.y - 1];
  if (above && above.element !== "land_mine" && above.element !== "wall") {
    explodeAt(pixel.x, pixel.y, 10, "shrapnel");
    explosionSmoke(pixel.x, pixel.y, 8);
    deletePixel(pixel.x, pixel.y);
  }
}

export function tickNuke(pixel: Pixel) {
  if (pixel.start === pixelTicks.v) return;
  if (pixel.burning || (pixel.charge && pixel.charge > 0) || pixel.temp > 200) {
    explodeAt(pixel.x, pixel.y, 40, "plasma");
    for (let i = 0; i < 20; i++) {
      const nx = pixel.x + Math.floor(Math.random() * 80) - 40;
      const ny = pixel.y + Math.floor(Math.random() * 80) - 40;
      if (!outOfBounds(nx, ny) && isEmpty(nx, ny)) {
        createPixel("radiation", nx, ny);
        if (randChance(30)) createPixel("fallout", nx, ny);
      }
    }
    explosionSmoke(pixel.x, pixel.y, 40);
    deletePixel(pixel.x, pixel.y);
    return;
  }
  behaveSturdyPowder(pixel);
}

export function tickRocket(pixel: Pixel) {
  if (pixel.start === pixelTicks.v) return;
  const ignited = pixel.burning || (pixel.charge && pixel.charge > 0) || pixel.temp > 200;
  if (ignited) {
    if (!pixel.burning) { pixel.burning = true; pixel.burnStart = pixelTicks.v; }
    if (isEmpty(pixel.x, pixel.y - 1)) {
      createPixel("fire", pixel.x, pixel.y - 1);
      const fp = pixelMap[pixel.x][pixel.y - 1];
      if (fp) fp.temp = 1000;
    }
    if (!tryMove(pixel, pixel.x, pixel.y - 1)) {
      if (!tryMove(pixel, pixel.x + (Math.random() < 0.5 ? 1 : -1), pixel.y)) {
        explodeAt(pixel.x, pixel.y, 15, "fire");
        explosionSmoke(pixel.x, pixel.y, 12);
        deletePixel(pixel.x, pixel.y);
        return;
      }
    }
    return;
  }
  if (adjacentOfType(pixel.x, pixel.y, ["fire", "plasma"]) && randChance(10)) {
    pixel.burning = true;
    pixel.burnStart = pixelTicks.v;
  }
  behaveSturdyPowder(pixel);
}

export function tickFirework(pixel: Pixel) {
  if (pixel.start === pixelTicks.v) return;
  if (pixel.burning || (pixel.charge && pixel.charge > 0) || pixel.temp > 200) {
    if (!pixel.burning) pixel.burning = true;
    if (isEmpty(pixel.x, pixel.y - 1)) {
      createPixel("fw_ember", pixel.x, pixel.y - 1);
    }
    if (tryMove(pixel, pixel.x, pixel.y - 1)) {
    } else {
      explodeAt(pixel.x, pixel.y, 10, "fw_ember");
      deletePixel(pixel.x, pixel.y);
    }
    return;
  }
  behaveSturdyPowder(pixel);
}

export function tickEgg(pixel: Pixel) {
  if (pixel.start === pixelTicks.v) return;
  doDefaults(pixel);
  if (pixel.del) return;
  if (pixel.element !== "egg") return;
  if (pixel.temp > 30 && pixel.temp < 50 && randChance(0.05)) {
    const babies = ["ant", "spider", "fly", "firefly", "worm", "flea"];
    changePixel(pixel, choose(babies));
    return;
  }
  if (pixel.temp < 0 && randChance(1)) {
    changePixel(pixel, "yolk");
  }
  doDefaults(pixel);
}

export function tickCell(pixel: Pixel) {
  if (pixel.start === pixelTicks.v) return;
  if (dieFromTemp(pixel, 102, -2, "dirty_water")) return;
  behaveLiquid(pixel);
  if (pixel.del) return;
  if (pixel.food === undefined) pixel.food = 0;
  if (adjacentOfType(pixel.x, pixel.y, ["sugar", "sugar_water", "oxygen", "carbon_dioxide"])) {
    if (randChance(5)) pixel.food++;
  }
  if (adjacentOfType(pixel.x, pixel.y, ["poison", "mercury", "chlorine", "cyanide", "alcohol"])) {
    if (randChance(5)) changePixel(pixel, "dna");
  }
  if (pixel.food && pixel.food > 10 && randChance(2)) {
    const spots = shuffleArray([[-1, 0], [1, 0], [0, 1], [0, -1]]);
    for (const [dx, dy] of spots) {
      const nx = pixel.x + dx, ny = pixel.y + dy;
      if (!outOfBounds(nx, ny) && isEmpty(nx, ny)) {
        createPixel("cell", nx, ny);
        pixel.food = 0;
        break;
      }
    }
  }
}

export function tickCancer(pixel: Pixel) {
  if (pixel.start === pixelTicks.v) return;
  if (pixel.temp > 80 || pixel.temp < -30) { changePixel(pixel, "plague"); return; }
  behaveLiquid(pixel);
  if (pixel.del) return;
  if (pixel.food === undefined) pixel.food = 0;
  if (adjacentOfType(pixel.x, pixel.y, ["sugar", "sugar_water", "cell"])) {
    if (randChance(8)) pixel.food++;
  }
  if (pixel.food && pixel.food > 5 && randChance(5)) {
    const spots = shuffleArray([[-1, 0], [1, 0], [0, 1], [0, -1]]);
    for (const [dx, dy] of spots) {
      const nx = pixel.x + dx, ny = pixel.y + dy;
      if (!outOfBounds(nx, ny) && isEmpty(nx, ny)) {
        createPixel("cancer", nx, ny);
        pixel.food = 0;
        break;
      }
    }
  }
}

export function tickPlague(pixel: Pixel) {
  if (pixel.start === pixelTicks.v) return;
  behaveGas(pixel);
  if (pixel.del) return;
  if (pixelTicks.v % 3 !== 0) return;
  for (const [dx, dy] of [[0,1],[0,-1],[1,0],[-1,0]]) {
    const nx = pixel.x + dx, ny = pixel.y + dy;
    if (outOfBounds(nx, ny)) continue;
    const np = pixelMap[nx]?.[ny];
    if (!np) continue;
    const nf = elements[np.element];
    if (nf?.category === "life" && np.element !== "plague") {
      if (randChance(10)) changePixel(np, "plague");
    }
    if (np.element === "antibody" && randChance(15)) {
      deletePixel(pixel.x, pixel.y);
      return;
    }
  }
}

export function tickExplosion(pixel: Pixel) {
  if (pixel.start === pixelTicks.v) return;
  if (randChance(25)) { deletePixel(pixel.x, pixel.y); return; }
  behaveGas(pixel);
}

export function tickFwEmber(pixel: Pixel) {
  if (pixel.start === pixelTicks.v) return;
  if (randChance(30)) { deletePixel(pixel.x, pixel.y); return; }
  behaveGas(pixel);
}
