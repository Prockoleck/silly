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

    const updateRects = () => {
      rectRef.current = wrapper.getBoundingClientRect();
      resizeRef.current = false;
    };

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
        let lx: number, ly: number;
        if (lDist > 1) {
          lx = (ldx / lDist) * range;
          ly = (ldy / lDist) * range;
        } else {
          lx = ldx;
          ly = ldy;
        }

        // For the right eye we offset the center slightly
        const rightCx = cx;
        const rightCy = cy;
        const rdx = e.clientX - rightCx;
        const rdy = e.clientY - rightCy;
        const rDist = Math.sqrt((rdx / range) ** 2 + (rdy / range) ** 2);
        let rx: number, ry: number;
        if (rDist > 1) {
          rx = (rdx / rDist) * range;
          ry = (rdy / rDist) * range;
        } else {
          rx = rdx;
          ry = rdy;
        }

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
          fillRule: "evenodd",
          clipRule: "evenodd",
          strokeLinejoin: "round",
          strokeMiterlimit: 2,
        }}
      >
        <g transform="matrix(1,0,0,1,-3490.31,-1501.28)">
          <g transform="matrix(1,0,0,1.02073,3090.26,17.8656)">
            <g>
              <g transform="matrix(1,0,0,0.979688,394,1449.09)">
                <path
                  d="M45.378,35.48C49.508,22.594 44.372,9.428 33.906,6.074C23.44,2.72 11.608,10.447 7.478,23.333C3.348,36.219 8.484,49.384 18.95,52.738C29.416,56.093 41.249,48.366 45.378,35.48Z"
                  fill="rgb(195,153,103)"
                  fillRule="nonzero"
                />
              </g>
              <g transform="matrix(1.16206,0,0,1.04909,386.374,1447.76)">
                <path
                  d="M12.863,13.171C12.682,13.402 12.646,13.726 12.771,13.997C12.895,14.267 13.156,14.43 13.434,14.412C18.562,14.104 34.147,13.739 40.587,20.394L40.283,28.264L46.021,33.321C46.021,33.321 52.279,11.395 34.026,6.07C23.172,2.904 15.573,10.04 12.863,13.171Z"
                  fill="rgb(29,29,27)"
                  fillRule="nonzero"
                />
              </g>
            </g>
          </g>
          <g transform="matrix(0.875522,0,0,0.795728,3486.38,1503.75)">
            <path
              d="M26.272,45.074C25.032,48.037 21.738,49.501 18.906,48.315C15.956,47.081 14.638,43.566 15.93,40.481C17.17,37.518 20.465,36.053 23.297,37.24C26.247,38.476 27.564,41.989 26.272,45.074ZM23.286,43.561C23.774,42.397 23.241,41.086 22.127,40.62C20.897,40.105 19.454,40.707 18.916,41.994C18.428,43.158 18.961,44.469 20.075,44.935C21.305,45.45 22.748,44.848 23.286,43.561Z"
              fill="rgb(133,45,32)"
            />
          </g>
          <g transform="matrix(1,0,0,0.999997,3484.26,1496.99)">
            <path
              d="M20.758,23.007L22.238,24.621C22.238,24.621 20.148,26.534 18.899,28.578C18.533,29.178 18.236,29.784 18.13,30.351C18.066,30.692 18.063,31.013 18.27,31.264C18.587,31.649 19.204,31.854 20.161,31.972C21.43,32.129 23.189,32.057 25.575,31.697L25.901,33.863C22.694,34.347 20.495,34.325 19.046,34.002C17.828,33.73 17.054,33.233 16.579,32.656C15.712,31.604 15.732,30.163 16.388,28.656C17.559,25.967 20.758,23.007 20.758,23.007Z"
              fill="rgb(133,45,32)"
            />
          </g>
        </g>
      </svg>

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
            height: 6,
            width: 7,
            top: 6,
            left: -12,
          }}
        >
          <div
            ref={leftPupilRef}
            className="pupil"
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
            height: 6,
            width: 7,
            top: 6,
            right: -6,
          }}
        >
          <div
            ref={rightPupilRef}
            className="pupil"
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
