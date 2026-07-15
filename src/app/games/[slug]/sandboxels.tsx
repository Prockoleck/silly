"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import {
  W, H, pixelMap, currentPixels, pixelTicks, isPaused, setPaused,
  createGrid, createPixel, deletePixel, outOfBounds, isEmpty,
} from "./sandboxels/engine/core";
import {
  initSimulation, tickPixels, pixelColorPick,
} from "./sandboxels/engine/simulation";
import elements from "./sandboxels/data/elements";
import { renderToCanvas, categories } from "./sandboxels/renderer/canvas";

export default function SandboxelsGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [selectedElement, setSelectedElement] = useState("sand");
  const [selectedCategory, setSelectedCategory] = useState("land");
  const [brushSize, setBrushSize] = useState(4);
  const [pausedState, setPausedState] = useState(false);
  const [infoText, setInfoText] = useState("");
  const mouseDown = useRef(false);
  const rightDown = useRef(false);
  const mousePos = useRef({ x: 0, y: 0 });
  const lastPlace = useRef(-100);
  const initDone = useRef(false);

  // Initialize simulation
  useEffect(() => {
    if (!initDone.current) {
      initSimulation();
      initDone.current = true;
    }
    return () => {};
  }, []);

  // Game loop
  const loopRef = useRef(0);
  const tick = useCallback(() => {
    if (!isPaused()) tickPixels();
    const canvas = canvasRef.current;
    if (canvas) renderToCanvas(canvas);
    loopRef.current = requestAnimationFrame(tick);
  }, []);

  useEffect(() => {
    loopRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(loopRef.current);
  }, [tick]);

  // Get elements for current category
  const categoryElements = Object.entries(elements)
    .filter(([key, el]) => el.category === selectedCategory && !el.hidden && !el.tool)
    .sort((a, b) => (a[1].name || a[0]).localeCompare(b[1].name || b[0]));

  // Tools (always show)
  const tools = Object.entries(elements)
    .filter(([key, el]) => el.category === "tools" && el.canPlace !== false)
    .sort((a, b) => (a[1].name || a[0]).localeCompare(b[1].name || b[0]));

  // Drawing
  const getCanvasPos = useCallback((clientX: number, clientY: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    return {
      x: Math.floor(((clientX - rect.left) / rect.width) * W),
      y: Math.floor(((clientY - rect.top) / rect.height) * H),
    };
  }, []);

  const placeElement = useCallback((x: number, y: number, isRight = false) => {
    if (isRight) {
      // Erase
      const sz = Math.floor(brushSize / 2);
      for (let dy = -sz; dy <= sz; dy++) {
        for (let dx = -sz; dx <= sz; dx++) {
          if (dx * dx + dy * dy > sz * sz) continue;
          const px = x + dx, py = y + dy;
          if (!outOfBounds(px, py)) deletePixel(px, py);
        }
      }
      return;
    }

    const element = selectedElement;
    const info = elements[element];
    if (!info) return;

    // Tool handling
    if (info.tool) {
      const sz = Math.floor(brushSize / 2);
      for (let dy = -sz; dy <= sz; dy++) {
        for (let dx = -sz; dx <= sz; dx++) {
          if (dx * dx + dy * dy > sz * sz) continue;
          const px = x + dx, py = y + dy;
          if (outOfBounds(px, py)) continue;
          const pixel = pixelMap[px]?.[py];
          if (pixel && !pixel.del) info.tool(pixel);
        }
      }
      return;
    }

    // Heat/cool tools
    if (element === "heat" || element === "cool") {
      const sz = Math.floor(brushSize / 2);
      for (let dy = -sz; dy <= sz; dy++) {
        for (let dx = -sz; dx <= sz; dx++) {
          if (dx * dx + dy * dy > sz * sz) continue;
          const px = x + dx, py = y + dy;
          if (outOfBounds(px, py)) continue;
          const pixel = pixelMap[px]?.[py];
          if (pixel && !pixel.del) {
            pixel.temp += element === "heat" ? 5 : -5;
          }
        }
      }
      return;
    }

    // Erase tool
    if (element === "erase") {
      const sz = Math.floor(brushSize / 2);
      for (let dy = -sz; dy <= sz; dy++) {
        for (let dx = -sz; dx <= sz; dx++) {
          if (dx * dx + dy * dy > sz * sz) continue;
          const px = x + dx, py = y + dy;
          if (!outOfBounds(px, py)) deletePixel(px, py);
        }
      }
      return;
    }

    // Place element
    const sz = Math.floor(brushSize / 2);
    for (let dy = -sz; dy <= sz; dy++) {
      for (let dx = -sz; dx <= sz; dx++) {
        if (dx * dx + dy * dy > sz * sz) continue;
        const px = x + dx, py = y + dy;
        if (outOfBounds(px, py)) continue;
        if (isEmpty(px, py)) {
          createPixel(element, px, py);
          const p = pixelMap[px]?.[py];
          if (p) p.color = pixelColorPick(p);
        }
      }
    }
  }, [selectedElement, brushSize]);

  // Mouse events
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const onDown = (e: MouseEvent) => {
      if (e.button === 0) mouseDown.current = true;
      if (e.button === 2) rightDown.current = true;
      const pos = getCanvasPos(e.clientX, e.clientY);
      mousePos.current = pos;
      placeElement(pos.x, pos.y, e.button === 2);
    };

    const onMove = (e: MouseEvent) => {
      const pos = getCanvasPos(e.clientX, e.clientY);
      mousePos.current = pos;
      if (mouseDown.current) placeElement(pos.x, pos.y, false);
      if (rightDown.current) placeElement(pos.x, pos.y, true);
    };

    const onUp = () => {
      mouseDown.current = false;
      rightDown.current = false;
    };

    const onTouchStart = (e: TouchEvent) => {
      e.preventDefault();
      const touch = e.touches[0];
      if (!touch) return;
      const pos = getCanvasPos(touch.clientX, touch.clientY);
      mouseDown.current = true;
      placeElement(pos.x, pos.y, false);
    };

    const onTouchMove = (e: TouchEvent) => {
      e.preventDefault();
      const touch = e.touches[0];
      if (!touch) return;
      const pos = getCanvasPos(touch.clientX, touch.clientY);
      if (mouseDown.current) placeElement(pos.x, pos.y, false);
    };

    const onTouchEnd = () => {
      mouseDown.current = false;
    };

    canvas.addEventListener("mousedown", onDown);
    canvas.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    canvas.addEventListener("contextmenu", (e) => e.preventDefault());
    canvas.addEventListener("touchstart", onTouchStart, { passive: false });
    canvas.addEventListener("touchmove", onTouchMove, { passive: false });
    canvas.addEventListener("touchend", onTouchEnd);

    return () => {
      canvas.removeEventListener("mousedown", onDown);
      canvas.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
      canvas.removeEventListener("touchstart", onTouchStart);
      canvas.removeEventListener("touchmove", onTouchMove);
      canvas.removeEventListener("touchend", onTouchEnd);
    };
  }, [getCanvasPos, placeElement]);

  // Keyboard shortcuts
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === " " || e.key === "p") {
        e.preventDefault();
        setPaused(!isPaused());
        setPausedState(isPaused());
      }
      if (e.key === "r" || e.key === "R") {
        createGrid();
      }
      if (e.key === "=" || e.key === "+") setBrushSize(s => Math.min(s + 1, 20));
      if (e.key === "-" || e.key === "_") setBrushSize(s => Math.max(s - 1, 1));
      if (e.key === "0") createGrid();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const pixelCount = currentPixels.filter(p => !p.del).length;

  return (
    <div className="flex flex-col items-center gap-2 select-none">
      {/* Canvas */}
      <canvas
        ref={canvasRef}
        width={W}
        height={H}
        className="w-full max-w-[900px] aspect-[200/120] rounded-lg border-2 border-[#444] cursor-crosshair"
        style={{ imageRendering: "pixelated" }}
      />

      {/* Category bar */}
      <div className="flex flex-wrap justify-center gap-1 max-w-[900px]">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-2.5 py-1 text-xs font-medium rounded-md transition-all ${
              selectedCategory === cat.id
                ? "text-white ring-1 ring-white"
                : "text-[#aaa] hover:text-white"
            }`}
            style={{ backgroundColor: selectedCategory === cat.id ? cat.color : "#333" }}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Element bar */}
      <div className="flex flex-wrap justify-center gap-1 max-w-[900px] max-h-[120px] overflow-y-auto scrollbar-thin">
        {categoryElements.map(([key, el]) => (
          <button
            key={key}
            onClick={() => setSelectedElement(key)}
            className={`px-2 py-1 text-xs font-medium rounded-md transition-all active:scale-95 ${
              selectedElement === key
                ? "ring-2 ring-white text-white"
                : "text-[#aaa] hover:text-white"
            }`}
            style={{
              backgroundColor: selectedElement === key ? (Array.isArray(el.color) ? el.color[0] : el.color) : "#333",
            }}
            title={el.desc || el.name || key}
          >
            {el.name || key.replace(/_/g, " ")}
          </button>
        ))}
      </div>

      {/* Controls */}
      <div className="flex items-center gap-3 text-sm text-[#aaa] flex-wrap justify-center">
        <button
          onClick={() => { setPaused(!isPaused()); setPausedState(isPaused()); }}
          className={`px-3 py-1.5 rounded-md bg-[#333] hover:bg-[#444] transition-colors font-medium text-white`}
        >
          {isPaused() ? "▶ Play" : "⏸ Pause"}
        </button>
        <button
          onClick={() => { setPaused(true); setPausedState(true); tickPixels(); renderToCanvas(canvasRef.current!); setPaused(false); setPausedState(false); }}
          disabled={!isPaused()}
          className={`px-3 py-1.5 rounded-md transition-colors font-medium ${
            isPaused() ? "bg-[#333] hover:bg-[#444] text-white" : "bg-[#222] text-[#555] cursor-not-allowed"
          }`}
        >
          ⏭ Step
        </button>
        <button
          onClick={() => createGrid()}
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
            onClick={() => setBrushSize(s => Math.min(s + 1, 20))}
            className="w-7 h-7 rounded-md bg-[#333] hover:bg-[#444] transition-colors text-white font-bold text-sm flex items-center justify-center"
          >
            +
          </button>
        </div>
        <span className="text-[10px] text-[#555]">{pixelCount} px</span>
      </div>

      <div className="text-xs text-[#555] text-center max-w-[600px] leading-relaxed">
        Left-click to place · Right-click to erase · Scroll to resize brush · Space to pause · R to reset · {selectedElement}
      </div>
    </div>
  );
}
