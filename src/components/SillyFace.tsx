"use client";

import { useRef, useLayoutEffect, useState, useCallback } from "react";

export default function SillyFace() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const leftPupilRef = useRef<HTMLDivElement>(null);
  const rightPupilRef = useRef<HTMLDivElement>(null);
  const rectRef = useRef<DOMRect | null>(null);
  const resizeRef = useRef(false);
  const prevAngleRef = useRef<number | null>(null);
  const absAngleRef = useRef(0);
  const signedAngleRef = useRef(0);
  const dizzyRef = useRef(false);
  const dizzyDirRef = useRef<1 | -1>(1);
  const bouncePosRef = useRef(0);
  const bounceVelRef = useRef(0);
  const bouncingRef = useRef(false);
  const squashRef = useRef(0);
  const lastTimeRef = useRef(0);
  const rafRef = useRef<number>(0);
  const dizzyTimeoutRef = useRef<ReturnType<typeof setTimeout>>(undefined);
  const [dizzy, setDizzy] = useState(false);

  useLayoutEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;

    const onMove = (e: MouseEvent) => {
      if (!rectRef.current || resizeRef.current || bouncingRef.current) {
        rectRef.current = wrapper.getBoundingClientRect();
        resizeRef.current = false;
      }

      const rect = rectRef.current!;
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;

      if (!dizzyRef.current) {
        const dx = e.clientX - cx;
        const dy = e.clientY - cy;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 150) {
          const angle = Math.atan2(dy, dx);
          if (prevAngleRef.current !== null) {
            let delta = angle - prevAngleRef.current;
            if (delta > Math.PI) delta -= Math.PI * 2;
            if (delta < -Math.PI) delta += Math.PI * 2;
            absAngleRef.current += Math.abs(delta);
            signedAngleRef.current += delta;
          }
          prevAngleRef.current = angle;

          if (absAngleRef.current >= Math.PI * 4) {
            triggerDizzy();
          }
        } else {
          prevAngleRef.current = null;
          absAngleRef.current = Math.max(0, absAngleRef.current - 0.05);
        }
      }

      if (!dizzyRef.current) {
        const range = 1.5;
        const ldx = e.clientX - cx;
        const ldy = e.clientY - cy;
        const lDist = Math.sqrt((ldx / range) ** 2 + (ldy / range) ** 2);
        const lx = lDist > 1 ? (ldx / lDist) * range : ldx;
        const ly = lDist > 1 ? (ldy / lDist) * range : ldy;

        const rdx = e.clientX - cx;
        const rdy = e.clientY - cy;
        const rDist = Math.sqrt((rdx / range) ** 2 + (rdy / range) ** 2);
        const rx = rDist > 1 ? (rdx / rDist) * range : rdx;
        const ry = rDist > 1 ? (rdy / rDist) * range : rdy;

        if (leftPupilRef.current) {
          leftPupilRef.current.style.transform = `translate(${lx}px, ${ly}px)`;
        }
        if (rightPupilRef.current) {
          rightPupilRef.current.style.transform = `translate(${rx}px, ${ry}px)`;
        }
      }
    };

    const onResize = () => { resizeRef.current = true; };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("resize", onResize);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      if (dizzyTimeoutRef.current) clearTimeout(dizzyTimeoutRef.current);
    };
  }, []);

  const triggerDizzy = useCallback(() => {
    if (dizzyRef.current) return;
    dizzyDirRef.current = signedAngleRef.current >= 0 ? 1 : -1;
    dizzyRef.current = true;
    setDizzy(true);
    absAngleRef.current = 0;
    signedAngleRef.current = 0;
    prevAngleRef.current = null;
    if (leftPupilRef.current) leftPupilRef.current.style.transform = "";
    if (rightPupilRef.current) rightPupilRef.current.style.transform = "";
    if (dizzyTimeoutRef.current) clearTimeout(dizzyTimeoutRef.current);
    dizzyTimeoutRef.current = setTimeout(() => {
      dizzyRef.current = false;
      setDizzy(false);
    }, 2250);
  }, []);

  const animate = useCallback((time: number) => {
    if (!bouncingRef.current) return;
    const dt = (time - lastTimeRef.current) / 1000;
    lastTimeRef.current = time;
    if (dt > 0.1) {
      rafRef.current = requestAnimationFrame(animate);
      return;
    }
    squashRef.current *= 0.85;
    bounceVelRef.current += 0.4 * dt * 60;
    bouncePosRef.current += bounceVelRef.current * dt * 60;
    const wrapper = wrapperRef.current;
    if (!wrapper) return;
    if (bouncePosRef.current >= 0) {
      bouncePosRef.current = 0;
      squashRef.current = Math.min(0.02 * Math.abs(bounceVelRef.current), 0.25);
      bounceVelRef.current = 0.85 * -bounceVelRef.current;
      if (Math.abs(bounceVelRef.current) < 0.5) {
        bounceVelRef.current = 0;
        bouncingRef.current = false;
        wrapper.style.translate = "0 0";
        wrapper.style.scale = "1 1";
        return;
      }
    }
    wrapper.style.translate = `0 ${bouncePosRef.current}px`;
    wrapper.style.scale = `${1 + squashRef.current} ${1 - squashRef.current}`;
    rafRef.current = requestAnimationFrame(animate);
  }, []);

  const startBounce = useCallback(() => {
    if (bouncingRef.current) return;
    if (dizzyTimeoutRef.current) clearTimeout(dizzyTimeoutRef.current);
    dizzyRef.current = false;
    setDizzy(false);
    absAngleRef.current = 0;
    signedAngleRef.current = 0;
    prevAngleRef.current = null;
    if (leftPupilRef.current) leftPupilRef.current.style.transform = "";
    if (rightPupilRef.current) rightPupilRef.current.style.transform = "";
    bounceVelRef.current = -7.5;
    bouncingRef.current = true;
    lastTimeRef.current = performance.now();
    squashRef.current = 0;
    animate(performance.now());
  }, [animate]);

  const w = 40;
  const h = 75;
  const svgSize = w;
  const svgTop = h - svgSize;
  const scale = svgSize / 50;
  const eyeW = 12;
  const eyeH = 12;
  const leftEyeCx = 15 * scale;
  const leftEyeCy = svgTop + 14 * scale;
  const rightEyeCx = 35 * scale;
  const rightEyeCy = svgTop + 14 * scale;

  return (
    <div
      ref={wrapperRef}
      onClick={startBounce}
      className={`relative shrink-0 ${dizzy ? "dizzy" : ""}`}
      style={{
        width: w,
        height: h,
        cursor: "pointer",
        userSelect: "none",
        WebkitUserSelect: "none",
        contain: "strict",
        WebkitTapHighlightColor: "transparent",
        ...(dizzy ? { animation: "dizzy-tilt 0.75s ease-in-out infinite", transformOrigin: "bottom center" } : {}),
      }}
    >
      <svg
        viewBox="0 0 50 50"
        style={{
          position: "absolute",
          bottom: 0,
          width: "100%",
          display: "block",
          filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.1))",
        }}
      >
        {/* Body — wide frog shape */}
        <ellipse cx="25" cy="28" rx="22" ry="18" fill="#7BC67E" stroke="#2D2A24" strokeWidth="2" />

        {/* Belly — lighter */}
        <ellipse cx="25" cy="32" rx="14" ry="11" fill="#A8E6A3" opacity="0.6" />

        {/* Eye bumps */}
        <ellipse cx="15" cy="14" rx="7" ry="6" fill="#7BC67E" stroke="#2D2A24" strokeWidth="2" />
        <ellipse cx="35" cy="14" rx="7" ry="6" fill="#7BC67E" stroke="#2D2A24" strokeWidth="2" />

        {/* Rosy cheeks */}
        <ellipse cx="8" cy="30" rx="4" ry="2.5" fill="#FF9AA2" opacity="0.5" />
        <ellipse cx="42" cy="30" rx="4" ry="2.5" fill="#FF9AA2" opacity="0.5" />

        {/* Spots */}
        <circle cx="18" cy="36" r="1.5" fill="#5DAF60" opacity="0.5" />
        <circle cx="30" cy="38" r="2" fill="#5DAF60" opacity="0.5" />
        <circle cx="22" cy="40" r="1" fill="#5DAF60" opacity="0.4" />

        {/* Nostrils */}
        <circle cx="22" cy="24" r="1.2" fill="#4A8B4D" />
        <circle cx="28" cy="24" r="1.2" fill="#4A8B4D" />

        {/* Wide goofy smile */}
        <path
          d="M 12 32 Q 25 42 38 32"
          fill="none"
          stroke="#2D2A24"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>

      {/* Eyes overlay — positioned in wrapper pixels matching SVG rendering */}
      <div
        className="absolute bg-white rounded-full"
        style={{
          width: eyeW,
          height: eyeH,
          left: leftEyeCx - eyeW / 2,
          top: leftEyeCy - eyeH / 2,
          pointerEvents: "none",
        }}
      >
        <div
          ref={leftPupilRef}
          className="pupil"
          style={{
            position: "absolute",
            background: "#2D2A24",
            borderRadius: "50%",
            width: "50%",
            height: "50%",
            left: "25%",
            top: "25%",
            transition: "transform 75ms ease-out",
            ...(dizzy
              ? {
                  animation: `dizzy-spin 0.65s linear infinite`,
                  animationDirection: dizzyDirRef.current === 1 ? "normal" : "reverse",
                  transition: "none",
                }
              : {}),
          }}
        />
      </div>

      <div
        className="absolute bg-white rounded-full"
        style={{
          width: eyeW,
          height: eyeH,
          left: rightEyeCx - eyeW / 2,
          top: rightEyeCy - eyeH / 2,
          pointerEvents: "none",
        }}
      >
        <div
          ref={rightPupilRef}
          className="pupil"
          style={{
            position: "absolute",
            background: "#2D2A24",
            borderRadius: "50%",
            width: "50%",
            height: "50%",
            left: "25%",
            top: "25%",
            transition: "transform 75ms ease-out",
            ...(dizzy
              ? {
                  animation: `dizzy-spin 0.65s linear infinite`,
                  animationDirection: dizzyDirRef.current === 1 ? "normal" : "reverse",
                  transition: "none",
                }
              : {}),
          }}
        />
      </div>
    </div>
  );
}
