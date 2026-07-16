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

  return (
    <div
      ref={wrapperRef}
      onClick={startBounce}
      className={`relative shrink-0 ${dizzy ? "dizzy" : ""}`}
      style={{
        width: 30,
        height: 56,
        cursor: "pointer",
        userSelect: "none",
        WebkitUserSelect: "none",
        contain: "strict",
        WebkitTapHighlightColor: "transparent",
        ...(dizzy ? { animation: "dizzy-tilt 0.75s ease-in-out infinite", transformOrigin: "bottom center" } : {}),
      }}
    >
      <svg
        viewBox="0 0 42 50"
        style={{
          position: "absolute",
          bottom: 0,
          width: "100%",
          display: "block",
          strokeLinejoin: "round",
          strokeMiterlimit: 2,
        }}
      >
        <g transform="matrix(1,0,0,1,-3490.31,-1501.28)">
          <g transform="matrix(1,0,0,1.02073,3090.26,17.8656)">
            <g>
              {/* Body — bean shape from Neal.fun */}
              <g transform="matrix(1,0,0,0.979688,394,1449.09)">
                <path
                  d="M45.378,35.48C49.508,22.594 44.372,9.428 33.906,6.074C23.44,2.72 11.608,10.447 7.478,23.333C3.348,36.219 8.484,49.384 18.95,52.738C29.416,56.093 41.249,48.366 45.378,35.48Z"
                  fill="#7BC67E"
                  stroke="#2D2A24"
                  strokeWidth="1.5"
                />
              </g>
              {/* Belly */}
              <g transform="matrix(1,0,0,0.979688,394,1449.09)">
                <ellipse cx="27" cy="37" rx="9" ry="7" fill="#A8E6A3" opacity="0.5" />
              </g>
              {/* Rosy cheeks */}
              <g transform="matrix(1,0,0,0.979688,394,1449.09)">
                <ellipse cx="5" cy="33" rx="4" ry="2.5" fill="#FF9AA2" opacity="0.5" />
                <ellipse cx="49" cy="33" rx="4" ry="2.5" fill="#FF9AA2" opacity="0.5" />
              </g>
              {/* Spots */}
              <g transform="matrix(1,0,0,0.979688,394,1449.09)">
                <circle cx="19" cy="42" r="1.2" fill="#5DAF60" opacity="0.5" />
                <circle cx="32" cy="44" r="1.5" fill="#5DAF60" opacity="0.5" />
                <circle cx="24" cy="47" r="0.8" fill="#5DAF60" opacity="0.4" />
              </g>
              {/* Nostrils */}
              <g transform="matrix(1,0,0,0.979688,394,1449.09)">
                <circle cx="22" cy="25" r="1.2" fill="#4A8B4D" />
                <circle cx="29" cy="25" r="1.2" fill="#4A8B4D" />
              </g>
              {/* Wide smile */}
              <g transform="matrix(1,0,0,0.979688,394,1449.09)">
                <path
                  d="M 8 35 Q 27 46 46 35"
                  fill="none"
                  stroke="#2D2A24"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />
              </g>
            </g>
          </g>
        </g>
      </svg>

      {/* Eyes overlay */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          transform: "translate(-50%, -50%)",
          pointerEvents: "none",
          zIndex: 10,
        }}
      >
        <div
          style={{
            position: "absolute",
            background: "#fff",
            borderRadius: "50%",
            width: 8,
            height: 8,
            top: 3,
            left: -16,
          }}
        >
          <div
            ref={leftPupilRef}
            style={{
              position: "absolute",
              background: "#333",
              borderRadius: "50%",
              height: 4,
              width: 4,
              left: "calc(50% - 2px)",
              top: "calc(50% - 2px)",
              transform: "translate(-50%, -50%)",
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
          style={{
            position: "absolute",
            background: "#fff",
            borderRadius: "50%",
            width: 8,
            height: 8,
            top: 3,
            right: -10,
          }}
        >
          <div
            ref={rightPupilRef}
            style={{
              position: "absolute",
              background: "#333",
              borderRadius: "50%",
              height: 4,
              width: 4,
              left: "calc(50% - 2px)",
              top: "calc(50% - 2px)",
              transform: "translate(-50%, -50%)",
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
    </div>
  );
}
