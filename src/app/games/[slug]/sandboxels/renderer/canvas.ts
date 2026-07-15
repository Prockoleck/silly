import { pixelMap, currentPixels, W, H, PX, pixelTicks, isPaused } from "../engine/core";
import elements from "../data/elements";

export function renderToCanvas(canvas: HTMLCanvasElement) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const imageData = ctx.createImageData(W, H);
  const data = imageData.data;

  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      const idx = (y * W + x) * 4;
      const pixel = pixelMap[x]?.[y];
      if (!pixel || pixel.del) {
        data[idx] = 30; data[idx + 1] = 30; data[idx + 2] = 30; data[idx + 3] = 255;
      } else {
        const color = parseColor(pixel.color);
        if (color) {
          data[idx] = color[0]; data[idx + 1] = color[1]; data[idx + 2] = color[2]; data[idx + 3] = 255;
        } else {
          data[idx] = 255; data[idx + 1] = 0; data[idx + 2] = 255; data[idx + 3] = 255;
        }
        // Charge glow overlay
        if (pixel.charge) {
          data[idx] = Math.min(255, data[idx] + 80);
          data[idx + 1] = Math.min(255, data[idx + 1] + 80);
        }
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
}

const colorCache = new Map<string, [number, number, number]>();
function parseColor(color: string): [number, number, number] | null {
  const cached = colorCache.get(color);
  if (cached) return cached;

  let result: [number, number, number] | null = null;
  if (color.startsWith("rgb")) {
    const m = color.match(/\d+/g);
    if (m && m.length >= 3) {
      result = [parseInt(m[0]), parseInt(m[1]), parseInt(m[2])];
    }
  } else if (color.startsWith("#")) {
    const hex = color.replace("#", "");
    result = [parseInt(hex.substr(0, 2), 16), parseInt(hex.substr(2, 2), 16), parseInt(hex.substr(4, 2), 16)];
  }
  if (result) colorCache.set(color, result);
  return result;
}

// Category display data
export interface CategoryInfo {
  id: string;
  name: string;
  color: string;
}

export const categories: CategoryInfo[] = [
  { id: "land", name: "Land", color: "#835b3c" },
  { id: "liquids", name: "Liquids", color: "#2167ff" },
  { id: "powders", name: "Powders", color: "#c8b090" },
  { id: "solids", name: "Solids", color: "#777777" },
  { id: "energy", name: "Energy", color: "#ff6600" },
  { id: "weapons", name: "Weapons", color: "#cc4444" },
  { id: "gases", name: "Gases", color: "#d0d0d8" },
  { id: "food", name: "Food", color: "#d4a050" },
  { id: "life", name: "Life", color: "#44aa44" },
  { id: "machines", name: "Machines", color: "#a08040" },
  { id: "special", name: "Special", color: "#aa88ff" },
  { id: "tools", name: "Tools", color: "#ff0000" },
  { id: "states", name: "States", color: "#888888" },
];
