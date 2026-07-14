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
}> = {
  circle: {
    draw(ctx, cx, cy, size) {
      ctx.beginPath();
      ctx.arc(cx, cy, size * 0.4, 0, Math.PI * 2);
      ctx.stroke();
    },
  },
  square: {
    draw(ctx, cx, cy, size) {
      const half = size * 0.35;
      ctx.strokeRect(cx - half, cy - half, half * 2, half * 2);
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
  },
  star: {
    draw(ctx, cx, cy, size) {
      const pts = starPoints(cx, cy, size * 0.4, size * 0.16, 5);
      ctx.beginPath();
      pts.forEach((p, i) => (i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y)));
      ctx.closePath();
      ctx.stroke();
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
  },
};

function shapePerimeterPoints(shape: ShapeKey): Point[] {
  const SIZE = 100;
  const cx = SIZE / 2;
  const cy = SIZE / 2;
  const N = 200;

  switch (shape) {
    case "circle": {
      const r = SIZE * 0.4;
      const pts: Point[] = [];
      for (let i = 0; i < N; i++) {
        const a = (2 * Math.PI * i) / N;
        pts.push({ x: cx + r * Math.cos(a), y: cy + r * Math.sin(a) });
      }
      return pts;
    }
    case "square": {
      const half = SIZE * 0.35;
      const pts: Point[] = [];
      for (let i = 0; i < N; i++) {
        const t = i / N;
        if (t < 0.25) {
          const p = t * 4;
          pts.push({ x: cx - half + p * 2 * half, y: cy - half });
        } else if (t < 0.5) {
          const p = (t - 0.25) * 4;
          pts.push({ x: cx + half, y: cy - half + p * 2 * half });
        } else if (t < 0.75) {
          const p = (t - 0.5) * 4;
          pts.push({ x: cx + half - p * 2 * half, y: cy + half });
        } else {
          const p = (t - 0.75) * 4;
          pts.push({ x: cx - half, y: cy + half - p * 2 * half });
        }
      }
      return pts;
    }
    case "triangle": {
      const verts = polygonPoints(cx, cy, SIZE * 0.4, 3);
      return samplePolygonPerimeter(verts, N);
    }
    case "star": {
      const verts = starPoints(cx, cy, SIZE * 0.4, SIZE * 0.16, 5);
      return samplePolygonPerimeter(verts, N);
    }
    case "pentagon": {
      const verts = polygonPoints(cx, cy, SIZE * 0.4, 5);
      return samplePolygonPerimeter(verts, N);
    }
  }
}

function samplePolygonPerimeter(verts: Point[], N: number): Point[] {
  const edgeLens: number[] = [];
  let totalLen = 0;
  for (let i = 0; i < verts.length; i++) {
    const j = (i + 1) % verts.length;
    const dx = verts[j].x - verts[i].x;
    const dy = verts[j].y - verts[i].y;
    const len = Math.sqrt(dx * dx + dy * dy);
    edgeLens.push(len);
    totalLen += len;
  }

  const pts: Point[] = [];
  for (let s = 0; s < N; s++) {
    const dist = (s / N) * totalLen;
    let accumulated = 0;
    for (let i = 0; i < verts.length; i++) {
      const j = (i + 1) % verts.length;
      if (accumulated + edgeLens[i] >= dist) {
        const t = (dist - accumulated) / edgeLens[i];
        pts.push({
          x: verts[i].x + t * (verts[j].x - verts[i].x),
          y: verts[i].y + t * (verts[j].y - verts[i].y),
        });
        break;
      }
      accumulated += edgeLens[i];
    }
  }
  return pts;
}

function computeScore(strokes: Point[][], shape: ShapeKey): number {
  const SIZE = 100;
  const scale = SIZE / CANVAS_SIZE;

  const allPoints = strokes.flatMap((s) => s.map((p) => ({ x: p.x * scale, y: p.y * scale })));
  if (allPoints.length < 5) return 0;

  const perimeter = shapePerimeterPoints(shape);

  let totalDist = 0;
  for (const pp of perimeter) {
    let minDist = Infinity;
    for (const sp of allPoints) {
      const dx = pp.x - sp.x;
      const dy = pp.y - sp.y;
      const dist = dx * dx + dy * dy;
      if (dist < minDist) minDist = dist;
    }
    totalDist += Math.sqrt(minDist);
  }

  const avgDist = totalDist / perimeter.length;
  const maxDist = Math.sqrt(SIZE * SIZE * 2) / 2;
  const normalized = Math.max(0, 1 - avgDist / (maxDist * 0.35));
  return Math.min(100, Math.round(Math.pow(normalized, 0.6) * 100));
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
