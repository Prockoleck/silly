"use client";

import { useState, useRef, useEffect, useCallback } from "react";

const ELEM = {
  EMPTY: 0, SAND: 1, WATER: 2, FIRE: 3, SMOKE: 4, STONE: 5, WOOD: 6,
  PLANT: 7, ACID: 8, OIL: 9, LAVA: 10, ICE: 11, STEAM: 12, SALT: 13,
  GLASS: 14, MUD: 15, VINE: 16, ASH: 17, BRICK: 18,
};

const ELEM_DATA: Record<number, { name: string; color: string; state: string; density: number; life: number }> = {
  [ELEM.EMPTY]: { name: "Empty", color: "transparent", state: "empty", density: 0, life: 0 },
  [ELEM.SAND]: { name: "Sand", color: "#e8c170", state: "solid", density: 2, life: 0 },
  [ELEM.WATER]: { name: "Water", color: "#4488ff", state: "liquid", density: 1, life: 0 },
  [ELEM.FIRE]: { name: "Fire", color: "#ff6600", state: "gas", density: -1, life: 80 },
  [ELEM.SMOKE]: { name: "Smoke", color: "#888888", state: "gas", density: -2, life: 60 },
  [ELEM.STONE]: { name: "Stone", color: "#777777", state: "solid", density: 3, life: 0 },
  [ELEM.WOOD]: { name: "Wood", color: "#8B5A2B", state: "solid", density: 2, life: 0 },
  [ELEM.PLANT]: { name: "Plant", color: "#44aa44", state: "solid", density: 1, life: 0 },
  [ELEM.ACID]: { name: "Acid", color: "#88ff44", state: "liquid", density: 0, life: 120 },
  [ELEM.OIL]: { name: "Oil", color: "#886622", state: "liquid", density: 0, life: 0 },
  [ELEM.LAVA]: { name: "Lava", color: "#ff4400", state: "liquid", density: 2, life: 300 },
  [ELEM.ICE]: { name: "Ice", color: "#bbddff", state: "solid", density: 2, life: 0 },
  [ELEM.STEAM]: { name: "Steam", color: "#e0e0e0", state: "gas", density: -3, life: 50 },
  [ELEM.SALT]: { name: "Salt", color: "#ffffff", state: "solid", density: 2, life: 0 },
  [ELEM.GLASS]: { name: "Glass", color: "#aaccee", state: "solid", density: 3, life: 0 },
  [ELEM.MUD]: { name: "Mud", color: "#886644", state: "solid", density: 2, life: 0 },
  [ELEM.VINE]: { name: "Vine", color: "#228822", state: "solid", density: 1, life: 0 },
  [ELEM.ASH]: { name: "Ash", color: "#555555", state: "solid", density: 1, life: 0 },
  [ELEM.BRICK]: { name: "Brick", color: "#aa5544", state: "solid", density: 3, life: 0 },
};

const W = 200;
const H = 120;
const PX = 4;

function rand(n: number) { return Math.floor(Math.random() * n); }
function rng(): number { return Math.random(); }

type Cell = { id: number; life: number; extra: number };

function emptyCell(): Cell { return { id: 0, life: 0, extra: 0 }; }

function createGrid(): Cell[][] {
  return Array.from({ length: H }, () => Array.from({ length: W }, () => emptyCell()));
}

function inBounds(x: number, y: number) { return x >= 0 && x < W && y >= 0 && y < H; }

function getColors(eid: number, life: number): [number, number, number] {
  const d = ELEM_DATA[eid];
  if (!d) return [0, 0, 0];
  const hex = d.color;
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  if (eid === ELEM.FIRE) {
    const t = life / 80;
    return [255, Math.floor(120 + 135 * t), Math.floor(t * 40)];
  }
  if (eid === ELEM.LAVA) {
    const t = life / 300;
    return [255, Math.floor(60 + 100 * (1 - t)), 0];
  }
  if (eid === ELEM.SMOKE) {
    const t = 1 - life / 60;
    const gv = Math.floor(80 + 80 * t);
    return [gv, gv, gv];
  }
  if (eid === ELEM.STEAM) {
    const t = 1 - life / 50;
    const gv = Math.floor(180 + 75 * t);
    return [gv, gv, gv];
  }
  const noise = rand(20) - 10;
  return [
    Math.max(0, Math.min(255, r + noise)),
    Math.max(0, Math.min(255, g + noise)),
    Math.max(0, Math.min(255, b + noise)),
  ];
}

export default function Sandboxels() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gridRef = useRef<Cell[][]>(createGrid());
  const [selected, setSelected] = useState(ELEM.SAND);
  const [brushSize, setBrushSize] = useState(4);
  const [paused, setPaused] = useState(false);
  const mouseDown = useRef(false);
  const rightDown = useRef(false);
  const mouseX = useRef(0);
  const mouseY = useRef(0);
  const animRef = useRef(0);

  const elements = Object.entries(ELEM_DATA)
    .filter(([id]) => Number(id) !== 0)
    .map(([id, d]) => ({ id: Number(id), ...d }));

  const drawPixel = useCallback((x: number, y: number, brushId?: number) => {
    const grid = gridRef.current;
    const id = brushId ?? selected;
    if (!inBounds(x, y)) return;
    const sz = brushSize;
    for (let dy = -sz; dy <= sz; dy++) {
      for (let dx = -sz; dx <= sz; dx++) {
        if (dx * dx + dy * dy > sz * sz) continue;
        const px = x + dx;
        const py = y + dy;
        if (!inBounds(px, py)) continue;
        if (id === ELEM.EMPTY) {
          grid[py][px] = emptyCell();
        } else if (grid[py][px].id === 0 || grid[py][px].id === ELEM.FIRE || grid[py][px].id === ELEM.SMOKE || grid[py][px].id === ELEM.STEAM) {
          grid[py][px] = { id, life: ELEM_DATA[id]?.life ?? 0, extra: 0 };
        }
      }
    }
  }, [selected, brushSize]);

  const fillCanvas = useCallback((id: number) => {
    const grid = gridRef.current;
    for (let y = 0; y < H; y++) {
      for (let x = 0; x < W; x++) {
        grid[y][x] = { id, life: id === 0 ? 0 : (ELEM_DATA[id]?.life ?? 0), extra: 0 };
      }
    }
  }, []);

  const resetCanvas = useCallback(() => {
    gridRef.current = createGrid();
  }, []);

  const setPixel = (grid: Cell[][], x: number, y: number, id: number, life = 0) => {
    if (!inBounds(x, y)) return;
    grid[y][x] = { id, life: life || (ELEM_DATA[id]?.life ?? 0), extra: 0 };
  };

  const swapPixels = (grid: Cell[][], x1: number, y1: number, x2: number, y2: number) => {
    const temp = grid[y1][x1];
    grid[y1][x1] = grid[y2][x2];
    grid[y2][x2] = temp;
  };

  const isType = (grid: Cell[][], x: number, y: number, ...ids: number[]) => {
    if (!inBounds(x, y)) return false;
    return ids.includes(grid[y][x].id);
  };

  const getType = (grid: Cell[][], x: number, y: number) => {
    if (!inBounds(x, y)) return ELEM.EMPTY;
    return grid[y][x].id;
  };

  const simTick = useCallback(() => {
    const grid = gridRef.current;
    const dir = rng() > 0.5;

    for (let y = H - 1; y >= 0; y--) {
      for (let x = dir ? 0 : W - 1; dir ? x < W : x >= 0; dir ? x++ : x--) {
        const cell = grid[y][x];
        if (cell.id === ELEM.EMPTY) continue;

        if (cell.life > 0) {
          cell.life--;
          if (cell.life <= 0) {
            if (cell.id === ELEM.FIRE || cell.id === ELEM.SMOKE || cell.id === ELEM.STEAM) {
              if (cell.id === ELEM.FIRE && rng() < 0.3) {
                setPixel(grid, x, y, ELEM.SMOKE, 40);
              } else {
                grid[y][x] = emptyCell();
              }
              continue;
            }
            if (cell.id === ELEM.ACID) {
              grid[y][x] = emptyCell();
              continue;
            }
            if (cell.id === ELEM.LAVA) {
              setPixel(grid, x, y, ELEM.STONE);
              continue;
            }
            grid[y][x] = emptyCell();
            continue;
          }
        }

        const below = y + 1 < H ? grid[y + 1][x].id : -1;
        const belowL = x - 1 >= 0 && y + 1 < H ? grid[y + 1][x - 1].id : -1;
        const belowR = x + 1 < W && y + 1 < H ? grid[y + 1][x + 1].id : -1;
        const left = x - 1 >= 0 ? grid[y][x - 1].id : -1;
        const right = x + 1 < W ? grid[y][x + 1].id : -1;
        const above = y - 1 >= 0 ? grid[y - 1][x].id : -1;

        const d = ELEM_DATA[cell.id];
        if (!d) continue;

        if (d.state === "solid" && d.density > 0) {
          // Fall
          if (below === ELEM.EMPTY) {
            swapPixels(grid, x, y, x, y + 1);
          } else if (d.density >= 2 && belowL === ELEM.EMPTY && belowR === ELEM.EMPTY) {
            const choice = rng() > 0.5;
            swapPixels(grid, x, y, choice ? x - 1 : x + 1, y + 1);
          } else if (d.density >= 2 && belowL === ELEM.EMPTY) {
            swapPixels(grid, x, y, x - 1, y + 1);
          } else if (d.density >= 2 && belowR === ELEM.EMPTY) {
            swapPixels(grid, x, y, x + 1, y + 1);
          }
        }

        if (d.state === "liquid") {
          let moved = false;
          if (below === ELEM.EMPTY) {
            swapPixels(grid, x, y, x, y + 1); moved = true;
          } else if (belowL === ELEM.EMPTY) {
            swapPixels(grid, x, y, x - 1, y + 1); moved = true;
          } else if (belowR === ELEM.EMPTY) {
            swapPixels(grid, x, y, x + 1, y + 1); moved = true;
          }
          if (!moved) {
            const lDir = rng() > 0.5;
            if (lDir && left === ELEM.EMPTY) swapPixels(grid, x, y, x - 1, y);
            else if (!lDir && right === ELEM.EMPTY) swapPixels(grid, x, y, x + 1, y);
            else if (left === ELEM.EMPTY) swapPixels(grid, x, y, x - 1, y);
            else if (right === ELEM.EMPTY) swapPixels(grid, x, y, x + 1, y);
          }
        }

        if (d.state === "gas") {
          let moved = false;
          if (above === ELEM.EMPTY) { swapPixels(grid, x, y, x, y - 1); moved = true; }
          else if (x - 1 >= 0 && grid[y - 1]?.[x - 1]?.id === ELEM.EMPTY) { swapPixels(grid, x, y, x - 1, y - 1); moved = true; }
          else if (x + 1 < W && grid[y - 1]?.[x + 1]?.id === ELEM.EMPTY) { swapPixels(grid, x, y, x + 1, y - 1); moved = true; }
          if (!moved) {
            const lDir = rng() > 0.5;
            if (lDir && left === ELEM.EMPTY) swapPixels(grid, x, y, x - 1, y);
            else if (!lDir && right === ELEM.EMPTY) swapPixels(grid, x, y, x + 1, y);
            else if (left === ELEM.EMPTY) swapPixels(grid, x, y, x - 1, y);
            else if (right === ELEM.EMPTY) swapPixels(grid, x, y, x + 1, y);
          }
        }

        // Interactions
        const neighbors = [
          { dx: -1, dy: 0 }, { dx: 1, dy: 0 }, { dx: 0, dy: -1 }, { dx: 0, dy: 1 },
          { dx: -1, dy: -1 }, { dx: 1, dy: -1 }, { dx: -1, dy: 1 }, { dx: 1, dy: 1 },
        ];

        for (const n of neighbors) {
          const nx = x + n.dx;
          const ny = y + n.dy;
          if (!inBounds(nx, ny)) continue;
          const nid = grid[ny][nx].id;

          // Fire interactions
          if (cell.id === ELEM.FIRE) {
            if (nid === ELEM.WOOD || nid === ELEM.PLANT || nid === ELEM.VINE) {
              if (rng() < 0.02) setPixel(grid, nx, ny, ELEM.FIRE, rand(60) + 20);
            }
            if (nid === ELEM.OIL) {
              if (rng() < 0.1) setPixel(grid, nx, ny, ELEM.FIRE, rand(80) + 30);
            }
            if (nid === ELEM.ICE) {
              setPixel(grid, nx, ny, ELEM.WATER);
              grid[y][x] = emptyCell();
            }
            if (nid === ELEM.WATER) {
              setPixel(grid, nx, ny, ELEM.STEAM, rand(30) + 10);
              grid[y][x] = emptyCell();
            }
            if (nid === ELEM.SALT) {
              setPixel(grid, nx, ny, ELEM.GLASS);
            }
          }

          // Lava interactions
          if (cell.id === ELEM.LAVA) {
            if (nid === ELEM.WATER) {
              setPixel(grid, nx, ny, ELEM.STEAM, rand(20) + 10);
              setPixel(grid, x, y, ELEM.STONE);
            }
            if (nid === ELEM.WOOD || nid === ELEM.PLANT || nid === ELEM.VINE) {
              if (rng() < 0.05) setPixel(grid, nx, ny, ELEM.FIRE, rand(60) + 20);
            }
            if (nid === ELEM.OIL) {
              if (rng() < 0.2) setPixel(grid, nx, ny, ELEM.FIRE, rand(80) + 30);
            }
            if (nid === ELEM.ICE) {
              setPixel(grid, nx, ny, ELEM.WATER);
              setPixel(grid, x, y, ELEM.STONE);
            }
          }

          // Acid interactions
          if (cell.id === ELEM.ACID) {
            if (nid !== ELEM.EMPTY && nid !== ELEM.ACID && nid !== ELEM.GLASS && nid !== ELEM.STONE && nid !== ELEM.BRICK) {
              if (rng() < 0.15) {
                setPixel(grid, nx, ny, ELEM.SMOKE, rand(20) + 10);
                if (rng() < 0.3) grid[y][x] = emptyCell();
              }
            }
            if (nid === ELEM.GLASS && rng() < 0.01) {
              setPixel(grid, nx, ny, ELEM.EMPTY);
            }
          }

          // Water interactions
          if (cell.id === ELEM.WATER) {
            if (nid === ELEM.SALT) {
              setPixel(grid, nx, ny, ELEM.EMPTY);
            }
            if (nid === ELEM.LAVA) {
              setPixel(grid, nx, ny, ELEM.STONE);
              setPixel(grid, x, y, ELEM.STEAM, rand(20) + 10);
            }
          }

          // Plant/Vine growth
          if ((cell.id === ELEM.PLANT || cell.id === ELEM.VINE) && nid === ELEM.EMPTY && rng() < 0.001) {
            setPixel(grid, nx, ny, cell.id);
          }
        }
      }
    }
  }, []);

  const render = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const grid = gridRef.current;
    const imageData = ctx.createImageData(W, H);
    const data = imageData.data;

    for (let y = 0; y < H; y++) {
      for (let x = 0; x < W; x++) {
        const cell = grid[y][x];
        const idx = (y * W + x) * 4;
        if (cell.id === 0) {
          data[idx] = 30; data[idx + 1] = 30; data[idx + 2] = 30; data[idx + 3] = 255;
        } else {
          const [r, g, b] = getColors(cell.id, cell.life);
          data[idx] = r; data[idx + 1] = g; data[idx + 2] = b; data[idx + 3] = 255;
        }
      }
    }

    const tempCanvas = document.createElement("canvas");
    tempCanvas.width = W;
    tempCanvas.height = H;
    const tempCtx = tempCanvas.getContext("2d");
    if (!tempCtx) return;
    tempCtx.putImageData(imageData, 0, 0);
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(tempCanvas, 0, 0, canvas.width, canvas.height);
  }, []);

  const loop = useCallback(() => {
    if (!paused) simTick();
    render();
    animRef.current = requestAnimationFrame(loop);
  }, [paused, simTick, render]);

  useEffect(() => {
    animRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animRef.current);
  }, [loop]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const getPos = (e: React.MouseEvent | MouseEvent | Touch) => {
      const rect = canvas.getBoundingClientRect();
      return {
        x: Math.floor(((e.clientX - rect.left) / rect.width) * W),
        y: Math.floor(((e.clientY - rect.top) / rect.height) * H),
      };
    };

    const handleMouseDown = (e: MouseEvent) => {
      if (e.button === 0) { mouseDown.current = true; rightDown.current = false; }
      if (e.button === 2) { rightDown.current = true; mouseDown.current = false; }
      const pos = getPos(e);
      drawPixel(pos.x, pos.y, rightDown.current ? ELEM.EMPTY : undefined);
    };

    const handleMouseMove = (e: MouseEvent) => {
      const pos = getPos(e);
      if (mouseDown.current) drawPixel(pos.x, pos.y);
      if (rightDown.current) drawPixel(pos.x, pos.y, ELEM.EMPTY);
    };

    const handleMouseUp = () => {
      mouseDown.current = false;
      rightDown.current = false;
    };

    const handleTouchStart = (e: TouchEvent) => {
      e.preventDefault();
      const touch = e.touches[0];
      if (!touch) return;
      const pos = getPos(touch);
      drawPixel(pos.x, pos.y);
    };

    const handleTouchMove = (e: TouchEvent) => {
      e.preventDefault();
      const touch = e.touches[0];
      if (!touch) return;
      const pos = getPos(touch);
      drawPixel(pos.x, pos.y);
    };

    const handleContextMenu = (e: Event) => e.preventDefault();

    canvas.addEventListener("mousedown", handleMouseDown);
    canvas.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    canvas.addEventListener("touchstart", handleTouchStart, { passive: false });
    canvas.addEventListener("touchmove", handleTouchMove, { passive: false });
    canvas.addEventListener("contextmenu", handleContextMenu);

    return () => {
      canvas.removeEventListener("mousedown", handleMouseDown);
      canvas.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
      canvas.removeEventListener("touchstart", handleTouchStart);
      canvas.removeEventListener("touchmove", handleTouchMove);
      canvas.removeEventListener("contextmenu", handleContextMenu);
    };
  }, [drawPixel]);

  const stepOnce = useCallback(() => {
    simTick();
    render();
  }, [simTick, render]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent | KeyboardEvent) => {
    const k = (e as KeyboardEvent).key || (e as React.KeyboardEvent).key;
    if (k === " " || k === "p" || k === "P") { e.preventDefault(); setPaused(p => !p); }
    if (k === "r" || k === "R") { resetCanvas(); }
    if (k === ">" || k === ".") { if (paused) stepOnce(); }
    if (k === "=" || k === "+") setBrushSize(s => Math.min(s + 1, 15));
    if (k === "-" || k === "_") setBrushSize(s => Math.max(s - 1, 1));
    if (k === "1") fillCanvas(ELEM.SAND);
    if (k === "2") fillCanvas(ELEM.WATER);
    if (k === "3") fillCanvas(ELEM.FIRE);
    if (k === "0") fillCanvas(0);
  }, [paused, resetCanvas, stepOnce, fillCanvas]);

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown as EventListener);
    return () => window.removeEventListener("keydown", handleKeyDown as EventListener);
  }, [handleKeyDown]);

  return (
    <div className="flex flex-col items-center gap-3 select-none">
      <canvas
        ref={canvasRef}
        width={W}
        height={H}
        className="w-full max-w-[800px] aspect-[200/120] rounded-lg border-2 border-[#444] cursor-crosshair"
        style={{ imageRendering: "pixelated" }}
      />

      <div className="flex flex-wrap justify-center gap-1 max-w-[800px]">
        {elements.map((el) => (
          <button
            key={el.id}
            onClick={() => setSelected(el.id)}
            className={`px-2.5 py-1 text-xs font-medium rounded-md transition-all active:scale-95 ${
              selected === el.id
                ? "ring-2 ring-white text-white"
                : "text-[#aaa] hover:text-white hover:bg-[#444]"
            }`}
            style={{
              backgroundColor: selected === el.id ? el.color : "#333",
              textShadow: selected === el.id ? "0 1px 2px rgba(0,0,0,0.5)" : "none",
            }}
          >
            {el.name}
          </button>
        ))}
      </div>

      <div className="flex items-center gap-3 text-sm text-[#aaa]">
        <button
          onClick={() => setPaused(p => !p)}
          className="px-3 py-1.5 rounded-md bg-[#333] hover:bg-[#444] transition-colors font-medium text-white"
        >
          {paused ? "▶ Play" : "⏸ Pause"}
        </button>
        <button
          onClick={stepOnce}
          disabled={!paused}
          className={`px-3 py-1.5 rounded-md transition-colors font-medium ${
            paused ? "bg-[#333] hover:bg-[#444] text-white" : "bg-[#222] text-[#555] cursor-not-allowed"
          }`}
        >
          ⏭ Step
        </button>
        <button
          onClick={resetCanvas}
          className="px-3 py-1.5 rounded-md bg-[#333] hover:bg-[#444] transition-colors font-medium text-white"
        >
          ↺ Reset
        </button>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setBrushSize(s => Math.max(s - 1, 1))}
            className="w-7 h-7 rounded-md bg-[#333] hover:bg-[#444] transition-colors text-white font-bold text-sm flex items-center justify-center"
          >
            −
          </button>
          <span className="text-xs w-4 text-center text-white font-medium">{brushSize}</span>
          <button
            onClick={() => setBrushSize(s => Math.min(s + 1, 15))}
            className="w-7 h-7 rounded-md bg-[#333] hover:bg-[#444] transition-colors text-white font-bold text-sm flex items-center justify-center"
          >
            +
          </button>
        </div>
      </div>

      <div className="text-xs text-[#555] text-center max-w-[600px] leading-relaxed">
        Left-click/touch to place · Right-click to erase · Scroll to resize brush · Space to pause · R to reset
      </div>
    </div>
  );
}
