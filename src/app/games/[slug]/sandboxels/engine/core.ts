import elements from "../data/elements";

// Grid dimensions
export const W = 200;
export const H = 120;
export const PX = 4;

// Simulation state
export let pixelMap: (Pixel | undefined)[][] = Array.from({ length: W }, () => Array(H).fill(undefined));
export let currentPixels: Pixel[] = [];
export const pixelTicks = { v: 0 };
let _paused = false;
export function isPaused() { return _paused; }
export function setPaused(v: boolean) { _paused = v; }
export let airTemp = 20;
export let airDensity = 1.225;
export let absoluteZero = -273.15;

// Per-tick temp storage for behavior parsing
export let btemp: Record<string, unknown> = {};

// Pixel class
export class Pixel {
  x: number;
  y: number;
  element: string;
  color: string;
  temp: number;
  start: number;
  burning?: boolean;
  burnStart?: number;
  charge?: number;
  chargeStart?: number;
  chargeCD?: number;
  flipX?: boolean;
  flipY?: boolean;
  r?: number;
  clone?: string;
  origColor?: string;
  alpha?: number;
  del?: boolean;
  drag?: boolean;
  food?: number;
  moist?: number;
  bx?: number;
  by?: number;
  climb?: number;
  _r?: number;
  skip?: boolean;
  glow?: boolean;
  emit?: boolean;
  painted?: string;
  dead?: boolean;
  h?: number;
  panic?: number;
  [key: string]: unknown;

  constructor(x: number, y: number, element: string) {
    this.x = x;
    this.y = y;
    this.element = element;
    this.temp = airTemp;
    this.start = pixelTicks.v;
    this.color = "#ffffff";
    const info = elements[element];
    if (info?.temp !== undefined) this.temp = info.temp + (airTemp - 20);
    if (info?.burning) { this.burning = true; this.burnStart = pixelTicks.v; }
    if (info?.charge) this.charge = info.charge;
    if (info?.flippableX) this.flipX = Math.random() >= 0.5;
    if (info?.flippableY) this.flipY = Math.random() >= 0.5;
    if (info?.rotatable) this.r = Math.floor(Math.random() * 4);
    if (info?.alpha !== undefined) this.alpha = info.alpha;
    if (info?.properties) {
      for (const key in info.properties) {
        this[key] = info.properties[key] instanceof Object
          ? JSON.parse(JSON.stringify(info.properties[key]))
          : info.properties[key];
      }
    }
    pixelMap[x][y] = this;
  }
}

// Grid operations
export function createGrid() {
  pixelMap = Array.from({ length: W }, () => Array(H).fill(undefined));
  currentPixels = [];
  pixelTicks.v = 0;
}

export function outOfBounds(x: number, y: number) {
  return x < 0 || x >= W || y < 0 || y >= H;
}

export function isEmpty(x: number, y: number, ignoreBounds = false) {
  if (outOfBounds(x, y)) return ignoreBounds;
  if (!pixelMap[x]) return true;
  return pixelMap[x][y] === undefined;
}

export function createPixel(element: string, x: number, y: number) {
  if (outOfBounds(x, y) || !pixelMap[x] || pixelMap[x][y] !== undefined) return;
  const pixel = new Pixel(x, y, element);
  pixelMap[x][y] = pixel;
  currentPixels.push(pixel);
}

export function deletePixel(x: number, y: number) {
  if (outOfBounds(x, y) || !pixelMap[x]) return;
  const pixel = pixelMap[x][y];
  if (pixel) {
    pixel.del = true;
    pixelMap[x][y] = undefined;
  }
}

export function movePixel(pixel: Pixel, nx: number, ny: number) {
  pixelMap[pixel.x][pixel.y] = undefined;
  pixel.x = nx;
  pixel.y = ny;
  pixelMap[nx][ny] = pixel;
}

export function swapPixels(p1: Pixel, p2: Pixel) {
  const tx = p1.x, ty = p1.y;
  p1.x = p2.x; p1.y = p2.y;
  p2.x = tx; p2.y = ty;
  pixelMap[p1.x][p1.y] = p1;
  pixelMap[p2.x][p2.y] = p2;
}

export function getPixel(x: number, y: number) {
  if (outOfBounds(x, y) || !pixelMap[x]) return undefined;
  return pixelMap[x][y];
}

export function shuffleArray<T>(arr: T[]) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export function choose<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function validDensitySwap(state1: string | undefined, state2: string | undefined) {
  if (!state1 || !state2) return false;
  if (state1 === state2) return state1 !== "solid";
  if (state1 === "solid") return state2 === "liquid" || state2 === "gas";
  if (state1 === "liquid") return state2 === "gas";
  return false;
}

export function changePixel(pixel: Pixel, newElement: string) {
  const oldInfo = elements[pixel.element];
  if (oldInfo?.onChange) oldInfo.onChange(pixel, newElement);
  if (!elements[newElement]) return;
  pixel.element = newElement;
  pixel.start = pixelTicks.v;
  const info = elements[newElement];
  // Update pixel color from element definition
  if (info?.color) {
    const colors = (Array.isArray(info.color) ? info.color : [info.color]).filter(Boolean);
    if (colors.length === 0) return;
    const chosen = colors.length === 1 ? colors[0] : choose(colors);
    const hex = chosen.replace("#", "");
    if (hex.length === 6 && /^[0-9a-fA-F]{6}$/.test(hex)) {
      pixel.color = `rgb(${parseInt(hex.substr(0, 2), 16)},${parseInt(hex.substr(2, 2), 16)},${parseInt(hex.substr(4, 2), 16)})`;
    }
  }
  if (info.burning) { pixel.burning = true; pixel.burnStart = pixelTicks.v; }
  else if (pixel.burning && !info.burn) { delete pixel.burning; delete pixel.burnStart; }
  delete pixel.origColor;
  if (info.temp !== undefined) pixel.temp = (info.temp + pixel.temp) / 2;
  pixelTempCheck(pixel);
}

// Need to import pixelTempCheck here, but it's defined later
// Use a circular-safe pattern
let _pixelTempCheck: ((p: Pixel) => void) | null = null;
export function setPixelTempCheck(fn: (p: Pixel) => void) { _pixelTempCheck = fn; }
export function pixelTempCheck(p: Pixel) { _pixelTempCheck?.(p); }

// ===== SYSTEM FUNCTIONS =====

export function stainPixel(newPixel: Pixel, hexColor: string, intensity: number) {
  if (!newPixel.color.startsWith("rgb")) return;
  if (!newPixel.origColor) newPixel.origColor = newPixel.color;
  const hex = hexColor.replace("#", "");
  const cr = parseInt(hex.substr(0, 2), 16);
  const cg = parseInt(hex.substr(2, 2), 16);
  const cb = parseInt(hex.substr(4, 2), 16);
  const prgb = newPixel.origColor.match(/\d+/g);
  if (!prgb || prgb.length < 3) return;
  const r = Math.floor(Number(prgb[0]) * (1 - intensity) + cr * intensity);
  const g = Math.floor(Number(prgb[1]) * (1 - intensity) + cg * intensity);
  const b = Math.floor(Number(prgb[2]) * (1 - intensity) + cb * intensity);
  newPixel.color = `rgb(${r},${g},${b})`;
}

export function releaseElement(pixel: Pixel, element: string, count = 1): Pixel | undefined {
  let released: Pixel | undefined;
  for (let i = 0; i < count; i++) {
    const spots = shuffleArray([...adjacentCoords, ...diagonalCoords]);
    for (const [dx, dy] of spots) {
      const x = pixel.x + dx, y = pixel.y + dy;
      if (isEmpty(x, y)) {
        createPixel(element, x, y);
        released = pixelMap[x][y];
        break;
      }
    }
  }
  return released;
}

export function explodeAt(x: number, y: number, radius: number, element = "fire") {
  for (let dx = -radius; dx <= radius; dx++) {
    for (let dy = -radius; dy <= radius; dy++) {
      if (dx * dx + dy * dy > radius * radius) continue;
      const px = x + dx, py = y + dy;
      if (outOfBounds(px, py)) continue;
      if (isEmpty(px, py)) {
        createPixel(element, px, py);
        const p = pixelMap[px][py];
        if (p) p.temp = 600 + Math.random() * 200;
      } else {
        const np = pixelMap[px][py];
        if (np) {
          const nf = elements[np.element];
          if (nf?.hardness && Math.random() < nf.hardness) {
            np.temp += 200;
            pixelTempCheck(np);
          } else {
            deletePixel(px, py);
            if (Math.random() < 0.3) {
              createPixel(element, px, py);
              const p = pixelMap[px][py];
              if (p) p.temp = 600 + Math.random() * 200;
            }
          }
        }
      }
    }
  }
}

// Coordinate arrays
export const adjacentCoords: [number, number][] = [[0,1],[0,-1],[1,0],[-1,0]];
export const squareCoords: [number, number][] = [[0,-1],[0,1],[1,0],[-1,0],[1,1],[1,-1],[-1,1],[-1,-1]];
export const diagonalCoords: [number, number][] = [[-1,1],[1,1],[1,-1],[-1,-1]];
export const biCoords: [number, number][] = [[0,1],[1,0]];
export let adjacentCoordsShuffle = adjacentCoords.slice();
export let squareCoordsShuffle = squareCoords.slice();
export let diagonalCoordsShuffle = diagonalCoords.slice();
