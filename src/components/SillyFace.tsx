"use client";

import { useRef, useEffect, useState, useCallback } from "react";

export default function SillyFace() {
  const faceRef = useRef<HTMLDivElement>(null);
  const [dizzy, setDizzy] = useState(false);
  const [dizzyDir, setDizzyDir] = useState(1);
  const [bouncing, setBouncing] = useState(false);

  // Track accumulated rotation for dizzy detection
  const angleRef = useRef(0);
  const prevAngleRef = useRef<number | null>(null);
  const dizzyTimeoutRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => {
    const face = faceRef.current;
    if (!face) return;

    const pupils = face.querySelectorAll<HTMLElement>(".pupil");

    const onMove = (e: MouseEvent) => {
      const rect = face.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;

      // Eye tracking
      const dx = (e.clientX - cx) / (rect.width / 2);
      const dy = (e.clientY - cy) / (rect.height / 2);
      const dist = Math.sqrt(dx * dx + dy * dy);
      const clamp = dist > 1 ? 1 / dist : 1;
      const px = dx * clamp * 3;
      const py = dy * clamp * 3;
      pupils.forEach((p) => {
        p.style.transform = `translate(${px}px, ${py}px)`;
      });

      // Rotation tracking for dizzy
      if (!dizzy) {
        const angle = Math.atan2(e.clientY - cy, e.clientX - cx);
        if (prevAngleRef.current !== null) {
          let delta = angle - prevAngleRef.current;
          if (delta > Math.PI) delta -= Math.PI * 2;
          if (delta < -Math.PI) delta += Math.PI * 2;
          angleRef.current += delta;
        }
        prevAngleRef.current = angle;

        if (Math.abs(angleRef.current) >= Math.PI * 6) {
          setDizzyDir(angleRef.current > 0 ? 1 : -1);
          setDizzy(true);
          if (dizzyTimeoutRef.current) clearTimeout(dizzyTimeoutRef.current);
          dizzyTimeoutRef.current = setTimeout(() => {
            setDizzy(false);
            angleRef.current = 0;
            prevAngleRef.current = null;
          }, 2000);
        }
      }
    };

    const onLeave = () => {
      prevAngleRef.current = null;
      angleRef.current = 0;
    };

    window.addEventListener("mousemove", onMove);
    face.addEventListener("mouseleave", onLeave);
    return () => {
      window.removeEventListener("mousemove", onMove);
      face.removeEventListener("mouseleave", onLeave);
      if (dizzyTimeoutRef.current) clearTimeout(dizzyTimeoutRef.current);
    };
  }, [dizzy]);

  const handleClick = useCallback(() => {
    setBouncing(true);
    if (dizzyTimeoutRef.current) clearTimeout(dizzyTimeoutRef.current);
    setDizzy(false);
    angleRef.current = 0;
    prevAngleRef.current = null;
  }, []);

  const onBounceEnd = useCallback(() => {
    setBouncing(false);
  }, []);

  return (
    <div
      ref={faceRef}
      onClick={handleClick}
      onAnimationEnd={onBounceEnd}
      className={`relative inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 select-none ${bouncing ? "bounce-ball" : ""} ${dizzy ? "scale-110" : ""}`}
      style={{
        ...(dizzy ? { animation: "dizzy-tilt 0.75s ease-in-out infinite", transformOrigin: "bottom center" } : {}),
        cursor: "pointer",
        filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.1))",
      }}
    >
      <svg
        viewBox="0 0 50 50"
        className="w-full h-full"
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

        {/* Dizzy stars */}
        {dizzy && (
          <>
            <text x="6" y="10" fontSize="6" fill="#FFB347" fontWeight="bold">★</text>
            <text x="40" y="10" fontSize="6" fill="#FFB347" fontWeight="bold">★</text>
            <text x="23" y="6" fontSize="4" fill="#FFB347">✦</text>
          </>
        )}
      </svg>

      {/* Interactive eyes overlay */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute bg-white rounded-full border-2 border-[#2D2A24]"
          style={{ width: "16%", height: "20%", left: "15%", top: "12%" }}
        >
          <div
            className="pupil absolute bg-[#2D2A24] rounded-full"
            style={{
              width: "50%", height: "50%", left: "25%", top: "25%",
              transition: "transform 75ms ease-out",
              ...(dizzy ? { animation: `dizzy-spin 0.65s linear infinite`, animationDirection: dizzyDir === 1 ? "normal" : "reverse", transition: "none" } : {}),
            }}
          />
        </div>

        <div
          className="absolute bg-white rounded-full border-2 border-[#2D2A24]"
          style={{ width: "16%", height: "20%", left: "35%", top: "12%" }}
        >
          <div
            className="pupil absolute bg-[#2D2A24] rounded-full"
            style={{
              width: "50%", height: "50%", left: "25%", top: "25%",
              transition: "transform 75ms ease-out",
              ...(dizzy ? { animation: `dizzy-spin 0.65s linear infinite`, animationDirection: dizzyDir === 1 ? "normal" : "reverse", transition: "none" } : {}),
            }}
          />
        </div>
      </div>
    </div>
  );
}
