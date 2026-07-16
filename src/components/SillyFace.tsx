"use client";

import { useRef, useEffect, useState, useCallback } from "react";

export default function SillyFace() {
  const faceRef = useRef<HTMLDivElement>(null);
  const [dizzy, setDizzy] = useState(false);
  const [clickCount, setClickCount] = useState(0);

  useEffect(() => {
    const face = faceRef.current;
    if (!face) return;

    const pupils = face.querySelectorAll<HTMLElement>(".pupil");

    const onMove = (e: MouseEvent) => {
      const rect = face.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = (e.clientX - cx) / (rect.width / 2);
      const dy = (e.clientY - cy) / (rect.height / 2);
      const dist = Math.sqrt(dx * dx + dy * dy);
      const clamp = dist > 1 ? 1 / dist : 1;
      const px = dx * clamp * 3;
      const py = dy * clamp * 3;
      pupils.forEach((p) => {
        p.style.transform = `translate(${px}px, ${py}px)`;
      });
    };

    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  const handleClick = useCallback(() => {
    setClickCount((c) => {
      const next = c + 1;
      if (next >= 5) {
        setDizzy(true);
        setTimeout(() => {
          setDizzy(false);
          setClickCount(0);
        }, 2000);
        return 0;
      }
      return next;
    });
  }, []);

  return (
    <div
      ref={faceRef}
      onClick={handleClick}
      className={`relative inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 select-none ${dizzy ? "scale-110" : ""}`}
      style={dizzy ? { animation: "dizzy-tilt 0.75s ease-in-out infinite", transformOrigin: "bottom center" } : undefined}
    >
      <svg
        viewBox="0 0 50 50"
        className="w-full h-full"
        style={{ filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.1))" }}
      >
        {/* Face */}
        <circle cx="25" cy="25" r="22" fill="#FFDCB5" stroke="#2D2A24" strokeWidth="2" />

        {/* Rosy cheeks */}
        <ellipse cx="11" cy="28" rx="4.5" ry="3" fill="#FFB5B5" opacity="0.45" />
        <ellipse cx="39" cy="28" rx="4" ry="2.5" fill="#FFB5B5" opacity="0.45" />

        {/* Left eyebrow (raised — silly!) */}
        <path d="M 9 12 Q 14 8 19 11" fill="none" stroke="#2D2A24" strokeWidth="2" strokeLinecap="round" />

        {/* Right eyebrow (normal) */}
        <path d="M 31 14 Q 36 12 41 14" fill="none" stroke="#2D2A24" strokeWidth="2" strokeLinecap="round" />

        {/* Freckles */}
        <circle cx="14" cy="23" r="0.8" fill="#D4A57A" />
        <circle cx="17" cy="25" r="0.7" fill="#D4A57A" />
        <circle cx="13" cy="26" r="0.6" fill="#D4A57A" />

        {/* Lopsided smile */}
        <path
          d="M 15 33 Q 25 40 37 32"
          fill="none"
          stroke="#2D2A24"
          strokeWidth="2"
          strokeLinecap="round"
        />

        {/* Tongue (appears on click buildup) */}
        {clickCount >= 3 && !dizzy && (
          <ellipse cx="26" cy="37" rx="3.5" ry="2.5" fill="#FF7B89" stroke="#2D2A24" strokeWidth="1" />
        )}

        {/* Dizzy stars */}
        {dizzy && (
          <>
            <text x="8" y="10" fontSize="7" fill="#FFB347" fontWeight="bold">★</text>
            <text x="38" y="8" fontSize="5" fill="#FFB347" fontWeight="bold">★</text>
            <text x="24" y="6" fontSize="4" fill="#FFB347">✦</text>
          </>
        )}
      </svg>

      {/* Interactive eyes overlay */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute bg-white rounded-full border-2 border-[#2D2A24]"
          style={{ width: "22%", height: "22%", left: "22%", top: "28%" }}
        >
          <div
            className="pupil absolute bg-[#2D2A24] rounded-full"
            style={{ width: "40%", height: "40%", left: "30%", top: "30%", transition: "transform 75ms ease-out" }}
          />
        </div>

        <div
          className="absolute bg-white rounded-full border-2 border-[#2D2A24]"
          style={{ width: "17%", height: "17%", left: "59%", top: "30%" }}
        >
          <div
            className="pupil absolute bg-[#2D2A24] rounded-full"
            style={{ width: "44%", height: "44%", left: "28%", top: "28%", transition: "transform 75ms ease-out" }}
          />
        </div>
      </div>
    </div>
  );
}
