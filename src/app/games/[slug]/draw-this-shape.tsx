"use client";

import { useState, useRef, useCallback, useEffect } from "react";

type Point = { x: number; y: number };

type ShapeKey = "circle" | "square" | "triangle" | "star" | "pentagon";

const SHAPES: ShapeKey[] = ["circle", "square", "triangle", "star", "pentagon"];

const SHAPE_LABELS: Record<ShapeKey, string> = {
  circle: "Circle",
  square: "Square",
  triangle: "Triangle",
  star: "Star",
  pentagon: "Pentagon",
};

const CANVAS_SIZE = 320;

function insideCircle(x: number, y: number, cx: number, cy: number, r: number): boolean {
  return (x - cx) ** 2 + (y - cy) ** 2 <= r * r;
}

function insideRect(x: number, y: number, cx: number, cy: number, half: number): boolean {
  return x >= cx - half && x <= cx + half && y >= cy - half && y <= cy + half;
}

function pointInTriangle(px: number, py: number, ax: number, ay: number, bx: number, by: number, cx: number, cy: number): boolean {
  const d1 = (px - bx) * (ay - by) - (ax - bx) * (py - by);
  const d2 = (px - cx) * (by - cy) - (bx - cx) * (py - cy);
  const d3 = (px - ax) * (cy - ay) - (cx - ax) * (py - ay);
  const neg = d1 < 0 || d2 < 0 || d3 < 0;
  const pos = d1 > 0 || d2 > 0 || d3 > 0;
  return !(neg && pos);
}

function pointInPolygon(px: number, py: number, verts: Point[]): boolean {
  let inside = false;
  for (let i = 0, j = verts.length - 1; i < verts.length; j = i++) {
    const xi = verts[i].x, yi = verts[i].y;
    const xj = verts[j].x, yj = verts[j].y;
    if ((yi > py) !== (yj > py) && px < ((xj - xi) * (py - yi)) / (yj - yi) + xi) {
      inside = !inside;
    }
  }
  return inside;
}

function starPoints(cx: number, cy: number, outerR: number, innerR: number, points: number): Point[] {
  const verts: Point[] = [];
  for (let i = 0; i < points * 2; i++) {
    const r = i % 2 === 0 ? outerR : innerR;
    const angle = (Math.PI * i) / points - Math.PI / 2;
    verts.push({ x: cx + r * Math.cos(angle), y: cy + r * Math.sin(angle) });
  }
  return verts;
}

function polygonPoints(cx: number, cy: number, r: number, sides: number): Point[] {
  const verts: Point[] = [];
  for (let i = 0; i < sides; i++) {
    const angle = (2 * Math.PI * i) / sides - Math.PI / 2;
    verts.push({ x: cx + r * Math.cos(angle), y: cy + r * Math.sin(angle) });
  }
  return verts;
}

const SHAPE_DEFS: Record<ShapeKey, {
  draw: (ctx: CanvasRenderingContext2D, cx: number, cy: number, size: number) => void;
  isInside: (x: number, y: number, cx: number, cy: number, size: number) => boolean;
}> = {
  circle: {
    draw(ctx, cx, cy, size) {
      ctx.beginPath();
      ctx.arc(cx, cy, size * 0.4, 0, Math.PI * 2);
      ctx.stroke();
    },
    isInside(x, y, cx, cy, size) {
      return insideCircle(x, y, cx, cy, size * 0.4);
    },
  },
  square: {
    draw(ctx, cx, cy, size) {
      const half = size * 0.35;
      ctx.strokeRect(cx - half, cy - half, half * 2, half * 2);
    },
    isInside(x, y, cx, cy, size) {
      return insideRect(x, y, cx, cy, size * 0.35);
    },
  },
  triangle: {
    draw(ctx, cx, cy, size) {
      const r = size * 0.4;
      ctx.beginPath();
      for (let i = 0; i < 3; i++) {
        const a = (2 * Math.PI * i) / 3 - Math.PI / 2;
        const px = cx + r * Math.cos(a);
        const py = cy + r * Math.sin(a);
        i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
      }
      ctx.closePath();
      ctx.stroke();
    },
    isInside(x, y, cx, cy, size) {
      const r = size * 0.4;
      const pts = polygonPoints(cx, cy, r, 3);
      return pointInPolygon(x, y, pts);
    },
  },
  star: {
    draw(ctx, cx, cy, size) {
      const pts = starPoints(cx, cy, size * 0.4, size * 0.16, 5);
      ctx.beginPath();
      pts.forEach((p, i) => (i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y)));
      ctx.closePath();
      ctx.stroke();
    },
    isInside(x, y, cx, cy, size) {
      const pts = starPoints(cx, cy, size * 0.4, size * 0.16, 5);
      return pointInPolygon(x, y, pts);
    },
  },
  pentagon: {
    draw(ctx, cx, cy, size) {
      const pts = polygonPoints(cx, cy, size * 0.4, 5);
      ctx.beginPath();
      pts.forEach((p, i) => (i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y)));
      ctx.closePath();
      ctx.stroke();
    },
    isInside(x, y, cx, cy, size) {
      const pts = polygonPoints(cx, cy, size * 0.4, 5);
      return pointInPolygon(x, y, pts);
    },
  },
};

function computeScore(strokes: Point[][], shape: ShapeKey): number {
  const SIZE = 100;
  const offscreen = typeof document !== "undefined" ? document.createElement("canvas") : null;
  if (!offscreen) return 0;
  offscreen.width = SIZE;
  offscreen.height = SIZE;

  const ctx = offscreen.getContext("2d");
  if (!ctx) return 0;

  const cx = SIZE / 2;
  const cy = SIZE / 2;
  const scale = SIZE / CANVAS_SIZE;

  const def = SHAPE_DEFS[shape];

  const target = ctx.getImageData(0, 0, SIZE, SIZE);
  for (let y = 0; y < SIZE; y++) {
    for (let x = 0; x < SIZE; x++) {
      if (def.isInside(x, y, cx, cy, SIZE)) {
        const i = (y * SIZE + x) * 4;
        target.data[i] = 255;
        target.data[i + 1] = 255;
        target.data[i + 2] = 255;
        target.data[i + 3] = 255;
      }
    }
  }

  const drawn = ctx.getImageData(0, 0, SIZE, SIZE);
  ctx.fillStyle = "white";
  for (const stroke of strokes) {
    if (stroke.length < 2) continue;
    ctx.beginPath();
    ctx.lineWidth = Math.max(4, 6 * scale);
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    stroke.forEach((p, i) => {
      const sx = p.x * scale;
      const sy = p.y * scale;
      i === 0 ? ctx.moveTo(sx, sy) : ctx.lineTo(sx, sy);
    });
    ctx.stroke();
  }
  const drawnData = ctx.getImageData(0, 0, SIZE, SIZE);

  let intersection = 0;
  let union = 0;
  for (let i = 0; i < target.data.length; i += 4) {
    const t = target.data[i] > 128;
    const d = drawnData.data[i] > 128;
    if (t || d) union++;
    if (t && d) intersection++;
  }

  return union > 0 ? Math.round((intersection / union) * 100) : 0;
}

function rating(score: number): { label: string; emoji: string } {
  if (score >= 90) return { label: "Master Artist", emoji: "🎨" };
  if (score >= 75) return { label: "Skilled Doodler", emoji: "✏️" };
  if (score >= 60) return { label: "Getting There", emoji: "📈" };
  if (score >= 40) return { label: "Keep Practicing", emoji: "💪" };
  return { label: "Abstract Artist", emoji: "🎭" };
}

export default function DrawThisShape() {
  const [round, setRound] = useState(0);
  const [scores, setScores] = useState<number[]>([]);
  const [strokes, setStrokes] = useState<Point[][]>([]);
  const [currentStroke, setCurrentStroke] = useState<Point[]>([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [phase, setPhase] = useState<"drawing" | "scoring">("drawing");
  const [currentScore, setCurrentScore] = useState<number | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const shape = SHAPES[round];
  const isComplete = round >= SHAPES.length;

  const drawEverything = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = CANVAS_SIZE * dpr;
    canvas.height = CANVAS_SIZE * dpr;
    canvas.style.width = `${CANVAS_SIZE}px`;
    canvas.style.height = `${CANVAS_SIZE}px`;
    ctx.scale(dpr, dpr);

    ctx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

    const cx = CANVAS_SIZE / 2;
    const cy = CANVAS_SIZE / 2;

    ctx.setLineDash([6, 6]);
    ctx.strokeStyle = "#d6d3d1";
    ctx.lineWidth = 2.5;
    const def = SHAPE_DEFS[shape];
    def.draw(ctx, cx, cy, CANVAS_SIZE);
    ctx.setLineDash([]);

    ctx.strokeStyle = "#1c1917";
    ctx.lineWidth = 3.5;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    for (const stroke of strokes) {
      if (stroke.length < 2) continue;
      ctx.beginPath();
      stroke.forEach((p, i) => (i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y)));
      ctx.stroke();
    }

    if (currentStroke.length > 1) {
      ctx.beginPath();
      ctx.strokeStyle = "#f97316";
      ctx.lineWidth = 3.5;
      currentStroke.forEach((p, i) => (i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y)));
      ctx.stroke();
    }

    if (phase === "scoring" && currentScore !== null) {
      ctx.setLineDash([4, 4]);
      ctx.strokeStyle = "#22c55e";
      ctx.lineWidth = 3;
      const def = SHAPE_DEFS[shape];
      def.draw(ctx, cx, cy, CANVAS_SIZE);
      ctx.setLineDash([]);
    }
  }, [shape, strokes, currentStroke, phase, currentScore]);

  useEffect(() => {
    drawEverything();
  }, [drawEverything]);

  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    if (phase !== "drawing") return;
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    setIsDrawing(true);
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setCurrentStroke([{ x, y }]);
  }, [phase]);

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (!isDrawing || phase !== "drawing") return;
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setCurrentStroke((prev) => [...prev, { x, y }]);
  }, [isDrawing, phase]);

  const handlePointerUp = useCallback(() => {
    if (!isDrawing) return;
    setIsDrawing(false);
    setStrokes((prev) => [...prev, currentStroke]);
    setCurrentStroke([]);
  }, [isDrawing, currentStroke]);

  const submit = useCallback(() => {
    if (strokes.length === 0) return;
    setPhase("scoring");
    const score = computeScore(strokes, shape);
    setCurrentScore(score);
    setScores((prev) => [...prev, score]);
  }, [strokes, shape]);

  const next = useCallback(() => {
    setRound((r) => r + 1);
    setStrokes([]);
    setCurrentStroke([]);
    setPhase("drawing");
    setCurrentScore(null);
  }, []);

  const resetGame = useCallback(() => {
    setRound(0);
    setScores([]);
    setStrokes([]);
    setCurrentStroke([]);
    setPhase("drawing");
    setCurrentScore(null);
  }, []);

  const clearDrawing = useCallback(() => {
    setStrokes([]);
    setCurrentStroke([]);
    setCurrentScore(null);
    setPhase("drawing");
  }, []);

  const totalScore = scores.length > 0
    ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
    : 0;

  if (isComplete) {
    const r = rating(totalScore);
    return (
      <div className="w-full text-center py-4" style={{ animation: "fade-up 0.4s ease-out" }}>
        <div className="text-5xl mb-4">{r.emoji}</div>
        <h2 className="text-2xl font-bold text-ink mb-2">Game Over!</h2>
        <p className="text-ink-secondary mb-1">
          Your overall score: <span className="font-bold text-accent tabular-nums">{totalScore}%</span>
        </p>
        <p className="text-lg font-medium text-ink mb-6">{r.label}</p>

        <div className="max-w-xs mx-auto space-y-2 mb-6">
          {SHAPES.map((s, i) => (
            <div key={s} className="flex items-center justify-between text-sm">
              <span className="text-ink-secondary">{SHAPE_LABELS[s]}</span>
              <span className={`tabular-nums font-medium ${(scores[i] ?? 0) >= 60 ? "text-success" : "text-error"}`}>
                {scores[i] ?? 0}%
              </span>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-center gap-3">
          <button
            onClick={resetGame}
            className="px-5 py-2.5 rounded-lg text-sm font-medium text-white bg-accent hover:bg-accent-hover transition-all duration-200 active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          >
            Play again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full" style={{ animation: "fade-up 0.4s ease-out" }}>
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-sm font-medium text-ink">Round {round + 1} of {SHAPES.length}</p>
          <p className="text-xs text-ink-muted">Draw a <strong>{SHAPE_LABELS[shape]}</strong></p>
        </div>
        <div className="flex items-center gap-1.5">
          {SHAPES.map((_, i) => (
            <div
              key={i}
              className={`w-2.5 h-2.5 rounded-full transition-colors duration-300 ${
                i < round ? "bg-accent" : i === round ? "bg-accent/60" : "bg-border"
              }`}
            />
          ))}
        </div>
      </div>

      <div
        ref={containerRef}
        className="touch-none"
      >
        <canvas
          ref={canvasRef}
          className="block mx-auto rounded-xl border-2 border-border bg-surface cursor-crosshair"
          style={{ width: CANVAS_SIZE, height: CANVAS_SIZE, maxWidth: "100%" }}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerLeave={handlePointerUp}
        />
      </div>

      {phase === "scoring" && currentScore !== null && (
        <div className="mt-4 text-center" style={{ animation: "fade-up 0.3s ease-out" }}>
          <div className="text-3xl font-bold tabular-nums text-ink">
            {currentScore}%
          </div>
          <p className="text-sm text-ink-secondary mt-0.5">{rating(currentScore).label}</p>

          <button
            onClick={next}
            className="mt-3 px-5 py-2.5 rounded-lg text-sm font-medium text-white bg-accent hover:bg-accent-hover transition-all duration-200 active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          >
            {round < SHAPES.length - 1 ? "Next shape" : "See results"}
          </button>
        </div>
      )}

      {phase === "drawing" && (
        <div className="mt-4 flex items-center justify-center gap-3">
          <button
            onClick={clearDrawing}
            disabled={strokes.length === 0}
            className="px-4 py-2 rounded-lg text-sm font-medium text-ink-secondary bg-surface border border-border hover:border-accent hover:text-accent transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          >
            Clear
          </button>
          <button
            onClick={submit}
            disabled={strokes.length === 0}
            className="px-5 py-2.5 rounded-lg text-sm font-medium text-white bg-accent hover:bg-accent-hover transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          >
            Submit
          </button>
        </div>
      )}

      <p className="text-xs text-ink-muted text-center mt-4">
        The dashed outline shows the target. Draw on top of it.
      </p>
    </div>
  );
}
