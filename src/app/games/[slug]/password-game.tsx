"use client";

import { useState, useEffect, useRef, useCallback } from "react";

const MONTHS = [
  "january","february","march","april","may","june",
  "july","august","september","october","november","december",
];

const COUNTRIES = [
  { name: "Afghanistan", flag: "🇦🇫" }, { name: "Albania", flag: "🇦🇱" },
  { name: "Algeria", flag: "🇩🇿" }, { name: "Argentina", flag: "🇦🇷" },
  { name: "Australia", flag: "🇦🇺" }, { name: "Austria", flag: "🇦🇹" },
  { name: "Bangladesh", flag: "🇧🇩" }, { name: "Belgium", flag: "🇧🇪" },
  { name: "Bolivia", flag: "🇧🇴" }, { name: "Brazil", flag: "🇧🇷" },
  { name: "Canada", flag: "🇨🇦" }, { name: "Chile", flag: "🇨🇱" },
  { name: "China", flag: "🇨🇳" }, { name: "Colombia", flag: "🇨🇴" },
  { name: "Cuba", flag: "🇨🇺" }, { name: "Czech Republic", flag: "🇨🇿" },
  { name: "Denmark", flag: "🇩🇰" }, { name: "Ecuador", flag: "🇪🇨" },
  { name: "Egypt", flag: "🇪🇬" }, { name: "Ethiopia", flag: "🇪🇹" },
  { name: "Finland", flag: "🇫🇮" }, { name: "France", flag: "🇫🇷" },
  { name: "Germany", flag: "🇩🇪" }, { name: "Ghana", flag: "🇬🇭" },
  { name: "Greece", flag: "🇬🇷" }, { name: "Hungary", flag: "🇭🇺" },
  { name: "Iceland", flag: "🇮🇸" }, { name: "India", flag: "🇮🇳" },
  { name: "Indonesia", flag: "🇮🇩" }, { name: "Iran", flag: "🇮🇷" },
  { name: "Iraq", flag: "🇮🇶" }, { name: "Ireland", flag: "🇮🇪" },
  { name: "Israel", flag: "🇮🇱" }, { name: "Italy", flag: "🇮🇹" },
  { name: "Jamaica", flag: "🇯🇲" }, { name: "Japan", flag: "🇯🇵" },
  { name: "Kenya", flag: "🇰🇪" }, { name: "Malaysia", flag: "🇲🇾" },
  { name: "Mexico", flag: "🇲🇽" }, { name: "Morocco", flag: "🇲🇦" },
  { name: "Nepal", flag: "🇳🇵" }, { name: "Netherlands", flag: "🇳🇱" },
  { name: "New Zealand", flag: "🇳🇿" }, { name: "Nigeria", flag: "🇳🇬" },
  { name: "Norway", flag: "🇳🇴" }, { name: "Pakistan", flag: "🇵🇰" },
  { name: "Peru", flag: "🇵🇪" }, { name: "Philippines", flag: "🇵🇭" },
  { name: "Poland", flag: "🇵🇱" }, { name: "Portugal", flag: "🇵🇹" },
  { name: "Romania", flag: "🇷🇴" }, { name: "Russia", flag: "🇷🇺" },
  { name: "Saudi Arabia", flag: "🇸🇦" }, { name: "South Africa", flag: "🇿🇦" },
  { name: "South Korea", flag: "🇰🇷" }, { name: "Spain", flag: "🇪🇸" },
  { name: "Sweden", flag: "🇸🇪" }, { name: "Switzerland", flag: "🇨🇭" },
  { name: "Thailand", flag: "🇹🇭" }, { name: "Turkey", flag: "🇹🇷" },
  { name: "Ukraine", flag: "🇺🇦" }, { name: "United Arab Emirates", flag: "🇦🇪" },
  { name: "United Kingdom", flag: "🇬🇧" }, { name: "United States", flag: "🇺🇸" },
  { name: "Vietnam", flag: "🇻🇳" }, { name: "Zimbabwe", flag: "🇿🇼" },
];

const ELEMENTS = [
  { s: "H", n: 1 }, { s: "He", n: 2 }, { s: "Li", n: 3 }, { s: "Be", n: 4 },
  { s: "B", n: 5 }, { s: "C", n: 6 }, { s: "N", n: 7 }, { s: "O", n: 8 },
  { s: "F", n: 9 }, { s: "Ne", n: 10 }, { s: "Na", n: 11 }, { s: "Mg", n: 12 },
  { s: "Al", n: 13 }, { s: "Si", n: 14 }, { s: "P", n: 15 }, { s: "S", n: 16 },
  { s: "Cl", n: 17 }, { s: "Ar", n: 18 }, { s: "K", n: 19 }, { s: "Ca", n: 20 },
  { s: "Sc", n: 21 }, { s: "Ti", n: 22 }, { s: "V", n: 23 }, { s: "Cr", n: 24 },
  { s: "Mn", n: 25 }, { s: "Fe", n: 26 }, { s: "Co", n: 27 }, { s: "Ni", n: 28 },
  { s: "Cu", n: 29 }, { s: "Zn", n: 30 }, { s: "Ga", n: 31 }, { s: "Ge", n: 32 },
  { s: "As", n: 33 }, { s: "Se", n: 34 }, { s: "Br", n: 35 }, { s: "Kr", n: 36 },
  { s: "Rb", n: 37 }, { s: "Sr", n: 38 }, { s: "Y", n: 39 }, { s: "Zr", n: 40 },
  { s: "Nb", n: 41 }, { s: "Mo", n: 42 }, { s: "Tc", n: 43 }, { s: "Ru", n: 44 },
  { s: "Rh", n: 45 }, { s: "Pd", n: 46 }, { s: "Ag", n: 47 }, { s: "Cd", n: 48 },
  { s: "In", n: 49 }, { s: "Sn", n: 50 }, { s: "Sb", n: 51 }, { s: "Te", n: 52 },
  { s: "I", n: 53 }, { s: "Xe", n: 54 }, { s: "Cs", n: 55 }, { s: "Ba", n: 56 },
  { s: "La", n: 57 }, { s: "Ce", n: 58 }, { s: "Pr", n: 59 }, { s: "Nd", n: 60 },
  { s: "Pm", n: 61 }, { s: "Sm", n: 62 }, { s: "Eu", n: 63 }, { s: "Gd", n: 64 },
  { s: "Tb", n: 65 }, { s: "Dy", n: 66 }, { s: "Ho", n: 67 }, { s: "Er", n: 68 },
  { s: "Tm", n: 69 }, { s: "Yb", n: 70 }, { s: "Lu", n: 71 }, { s: "Hf", n: 72 },
  { s: "Ta", n: 73 }, { s: "W", n: 74 }, { s: "Re", n: 75 }, { s: "Os", n: 76 },
  { s: "Ir", n: 77 }, { s: "Pt", n: 78 }, { s: "Au", n: 79 }, { s: "Hg", n: 80 },
  { s: "Tl", n: 81 }, { s: "Pb", n: 82 }, { s: "Bi", n: 83 }, { s: "Po", n: 84 },
  { s: "At", n: 85 }, { s: "Rn", n: 86 }, { s: "Fr", n: 87 }, { s: "Ra", n: 88 },
  { s: "Ac", n: 89 }, { s: "Th", n: 90 }, { s: "Pa", n: 91 }, { s: "U", n: 92 },
  { s: "Np", n: 93 }, { s: "Pu", n: 94 }, { s: "Am", n: 95 }, { s: "Cm", n: 96 },
  { s: "Bk", n: 97 }, { s: "Cf", n: 98 }, { s: "Es", n: 99 }, { s: "Fm", n: 100 },
  { s: "Md", n: 101 }, { s: "No", n: 102 }, { s: "Lr", n: 103 }, { s: "Rf", n: 104 },
  { s: "Db", n: 105 }, { s: "Sg", n: 106 }, { s: "Bh", n: 107 }, { s: "Hs", n: 108 },
  { s: "Mt", n: 109 }, { s: "Ds", n: 110 }, { s: "Rg", n: 111 }, { s: "Cn", n: 112 },
  { s: "Nh", n: 113 }, { s: "Fl", n: 114 }, { s: "Mc", n: 115 }, { s: "Lv", n: 116 },
  { s: "Ts", n: 117 }, { s: "Og", n: 118 },
];

const TWO_LETTER_ELEMENTS = ELEMENTS.filter((e) => e.s.length === 2);

const ROMAN_REGEX = /M{0,4}(CM|CD|D?C{0,3})(XC|XL|L?X{0,3})(IX|IV|V?I{0,3})/g;

function isPrime(n: number): boolean {
  if (n < 2) return false;
  for (let i = 2; i * i <= n; i++) {
    if (n % i === 0) return false;
  }
  return true;
}

function romanToNum(s: string): number {
  const v: Record<string, number> = { M: 1000, D: 500, C: 100, L: 50, X: 10, V: 5, I: 1 };
  let r = 0;
  for (let i = 0; i < s.length; i++) {
    const c = v[s[i]] || 0;
    const nx = v[s[i + 1]] || 0;
    r += c < nx ? -c : c;
  }
  return r;
}

function extractRomans(pw: string): string[] {
  return (pw.match(ROMAN_REGEX) || []).filter((m) => m.length > 0);
}

function getMoonPhaseEmoji(): string {
  const ref = Date.UTC(2000, 0, 6, 18, 14);
  const cycle = 29.530588853 * 86400000;
  const phase = ((Date.now() - ref) % cycle) / cycle;
  if (phase < 0.0625) return "🌑";
  if (phase < 0.1875) return "🌒";
  if (phase < 0.3125) return "🌓";
  if (phase < 0.4375) return "🌔";
  if (phase < 0.5625) return "🌕";
  if (phase < 0.6875) return "🌖";
  if (phase < 0.8125) return "🌗";
  if (phase < 0.9375) return "🌘";
  return "🌑";
}

function generateCaptcha(): { text: string; dataUrl: string } {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let text = "";
  for (let i = 0; i < 5; i++) {
    text += chars[Math.floor(Math.random() * chars.length)];
  }
  const canvas = document.createElement("canvas");
  canvas.width = 180;
  canvas.height = 50;
  const ctx = canvas.getContext("2d")!;
  ctx.fillStyle = "#e8e8e8";
  ctx.fillRect(0, 0, 180, 50);
  for (let i = 0; i < text.length; i++) {
    ctx.save();
    ctx.font = `${18 + Math.random() * 8}px monospace`;
    ctx.fillStyle = `rgb(${60 + Math.floor(Math.random() * 100)},${60 + Math.floor(Math.random() * 100)},${60 + Math.floor(Math.random() * 100)})`;
    ctx.translate(15 + i * 32, 32 + Math.random() * 8);
    ctx.rotate((Math.random() - 0.5) * 0.6);
    ctx.fillText(text[i], 0, 0);
    ctx.restore();
  }
  for (let i = 0; i < 200; i++) {
    ctx.fillStyle = `rgba(${Math.floor(Math.random() * 255)},${Math.floor(Math.random() * 255)},${Math.floor(Math.random() * 255)},0.15)`;
    ctx.fillRect(Math.random() * 180, Math.random() * 50, 1.5, 1.5);
  }
  for (let i = 0; i < 4; i++) {
    ctx.strokeStyle = `rgba(${Math.floor(Math.random() * 200)},${Math.floor(Math.random() * 200)},${Math.floor(Math.random() * 200)},0.4)`;
    ctx.beginPath();
    ctx.moveTo(Math.random() * 180, Math.random() * 50);
    ctx.bezierCurveTo(Math.random() * 180, Math.random() * 50, Math.random() * 180, Math.random() * 50, Math.random() * 180, Math.random() * 50);
    ctx.stroke();
  }
  return { text, dataUrl: canvas.toDataURL() };
}

function getCurrentTime(): string {
  const now = new Date();
  let h = now.getHours();
  const m = now.getMinutes().toString().padStart(2, "0");
  const ampm = h >= 12 ? "PM" : "AM";
  h = h % 12 || 12;
  return `${h}:${m}`;
}

type Ctx = {
  captchaText: string;
  captchaImage: string;
  randomColor: string;
  sacrificed: Set<string>;
  country: { name: string; flag: string };
  moonPhase: string;
  showSacrifice: boolean;
  sacrificeSelected: string[];
};

type Rule = {
  msg: string;
  check: (pw: string, c: Ctx) => boolean;
  sub?: (c: Ctx, pw: string, refresh: () => void, onSacrifice: (ch: string) => void) => React.ReactNode;
};

const ALL_RULES: Rule[] = [
  { msg: "Your password must be at least 5 characters.", check: (pw) => pw.length >= 5 },
  { msg: "Your password must include a number.", check: (pw) => /\d/.test(pw) },
  { msg: "Your password must include an uppercase letter.", check: (pw) => /[A-Z]/.test(pw) },
  { msg: "Your password must include a special character.", check: (pw) => /[^a-zA-Z0-9]/.test(pw) },
  {
    msg: "The digits in your password must add up to 25.",
    check: (pw) => {
      const d = pw.match(/\d/g);
      return d ? d.reduce((s, x) => s + parseInt(x), 0) === 25 : false;
    },
  },
  { msg: "Your password must include a month of the year.", check: (pw) => MONTHS.some((m) => pw.toLowerCase().includes(m)) },
  { msg: "Your password must include a Roman numeral.", check: (pw) => extractRomans(pw).length > 0 },
  { msg: "Your password must include one of our sponsors: Pepsi, Starbucks, or Shell.", check: (pw) => /pepsi|starbucks|shell/i.test(pw) },
  {
    msg: "The Roman numerals in your password should multiply to 35.",
    check: (pw) => {
      const r = extractRomans(pw);
      if (r.length === 0) return false;
      return r.reduce((a, x) => a * romanToNum(x), 1) === 35;
    },
  },
  {
    msg: "Your password must include this CAPTCHA.",
    check: (pw, c) => pw.toLowerCase().includes(c.captchaText.toLowerCase()),
    sub: (c, _pw, refresh) => (
      <div style={{ marginTop: 8, display: "flex", alignItems: "center", gap: 10 }}>
        <img src={c.captchaImage} alt="CAPTCHA" style={{ borderRadius: 4, border: "1px solid #ccc" }} />
        <button onClick={refresh} style={{ cursor: "pointer", fontSize: 18, background: "none", border: "none" }}>🔄</button>
      </div>
    ),
  },
  {
    msg: "Your password must include a two-letter symbol from the periodic table.",
    check: (pw) => TWO_LETTER_ELEMENTS.some((e) => pw.includes(e.s)),
  },
  {
    msg: "Your password must include the current phase of the moon as an emoji.",
    check: (pw, c) => pw.includes(c.moonPhase),
    sub: (c) => <span style={{ fontSize: 24 }}>{c.moonPhase}</span>,
  },
  {
    msg: "Your password must include the name of this country.",
    check: (pw, c) => {
      const norm = (s: string) => s.toLowerCase().replace(/[\s\-]/g, "");
      return norm(pw).includes(norm(c.country.name));
    },
    sub: (c) => <span style={{ fontSize: 20 }}>{c.country.flag} {c.country.name}</span>,
  },
  {
    msg: "Your password must include a leap year.",
    check: (pw) => {
      const nums = pw.match(/\d+/g) || [];
      const romans = extractRomans(pw).map(romanToNum);
      const all = [...nums.map(Number), ...romans];
      return all.some((y) => y > 0 && ((y % 4 === 0 && y % 100 !== 0) || y % 400 === 0));
    },
  },
  {
    msg: "🥚 ← This is my chicken Paul. He hasn't hatched yet, please put him in your password and keep him safe.",
    check: (pw) => pw.includes("🥚"),
  },
  {
    msg: "The elements in your password must have atomic numbers that add up to 200.",
    check: (pw) => {
      const sorted = [...ELEMENTS].sort((a, b) => b.s.length - a.s.length);
      let remaining = pw;
      let sum = 0;
      for (const e of sorted) {
        while (remaining.includes(e.s)) {
          remaining = remaining.replace(e.s, "");
          sum += e.n;
        }
      }
      return sum === 200;
    },
  },
  {
    msg: "Your password must contain one of the following affirmations: i am loved, i am worthy, i am enough.",
    check: (pw) => /i\s*am\s*loved|i\s*am\s*worthy|i\s*am\s*enough/i.test(pw),
  },
  {
    msg: "A sacrifice must be made. Pick 2 letters that you will no longer be able to use.",
    check: (pw, c) => {
      if (c.sacrificed.size < 2) return false;
      for (const ch of c.sacrificed) {
        if (pw.toLowerCase().includes(ch)) return false;
      }
      return true;
    },
    sub: (c, _pw, _refresh, onSacrifice) => {
      if (c.sacrificed.size >= 2) {
        return <span>You sacrificed: {[...c.sacrificed].join(", ").toUpperCase()}</span>;
      }
      return (
        <div style={{ marginTop: 8 }}>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 4, maxWidth: 380 }}>
            {"abcdefghijklmnopqrstuvwxyz".split("").map((ch) => {
              const selected = c.sacrificeSelected.includes(ch);
              return (
                <button
                  key={ch}
                  onClick={() => onSacrifice(ch)}
                  style={{
                    width: 32, height: 32, display: "flex", alignItems: "center", justifyContent: "center",
                    border: "1px solid #ccc", borderRadius: 4, cursor: "pointer", fontSize: 14, fontWeight: 600,
                    background: selected ? "#e74c3c" : "#fff", color: selected ? "#fff" : "#333",
                  }}
                >
                  {ch.toUpperCase()}
                </button>
              );
            })}
          </div>
          <p style={{ fontSize: 13, color: "#888", marginTop: 6 }}>
            {c.sacrificeSelected.length}/2 selected
          </p>
        </div>
      );
    },
  },
  {
    msg: "Your password must include this color in hex.",
    check: (pw, c) => {
      const match = pw.match(/#?([0-9a-fA-F]{6})/g);
      if (!match) return false;
      const target = parseInt(c.randomColor.slice(1), 16);
      return match.some((m) => {
        const val = parseInt(m.replace("#", ""), 16);
        const tr = (target >> 16) & 0xff, tg = (target >> 8) & 0xff, tb = target & 0xff;
        const ur = (val >> 16) & 0xff, ug = (val >> 8) & 0xff, ub = val & 0xff;
        return Math.abs(tr - ur) <= 5 && Math.abs(tg - ug) <= 5 && Math.abs(tb - ub) <= 5;
      });
    },
    sub: (c) => (
      <div style={{ marginTop: 8, display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{ width: 40, height: 40, borderRadius: 6, background: c.randomColor, border: "2px solid #ccc" }} />
        <span style={{ fontFamily: "monospace", fontSize: 14 }}>{c.randomColor}</span>
      </div>
    ),
  },
  {
    msg: "Your password must include the length of your password.",
    check: (pw) => pw.includes(String(pw.length)),
  },
  {
    msg: "The length of your password must be a prime number.",
    check: (pw) => isPrime(pw.length),
  },
  {
    msg: "Your password must include the current time (e.g. 3:45).",
    check: (pw) => pw.includes(getCurrentTime()),
    sub: () => <span style={{ fontFamily: "monospace", fontSize: 16 }}>{getCurrentTime()}</span>,
  },
];

function CheckIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2ecc71" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function ErrorIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#e74c3c" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

const ANIM_CSS = `
@keyframes ruleSlideIn {
  from { opacity: 0; transform: translateY(-8px); }
  to   { opacity: 1; transform: translateY(0); }
}
@keyframes btnSlideIn {
  from { opacity: 0; transform: translateY(8px); }
  to   { opacity: 1; transform: translateY(0); }
}
`;

export default function PasswordGame() {
  const [password, setPassword] = useState("");
  const [ctx, setCtx] = useState<Ctx>({
    captchaText: "", captchaImage: "", randomColor: "",
    sacrificed: new Set(), country: { name: "", flag: "" },
    moonPhase: "", showSacrifice: false, sacrificeSelected: [],
  });
  const [inited, setInited] = useState(false);
  const [gameComplete, setGameComplete] = useState(false);
  const [reType, setReType] = useState("");
  const [reTypeOk, setReTypeOk] = useState(false);
  const [tick, setTick] = useState(0);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const prevReachedRef = useRef(1);

  useEffect(() => {
    const captcha = generateCaptcha();
    const country = COUNTRIES[Math.floor(Math.random() * COUNTRIES.length)];
    setCtx((prev) => ({
      ...prev,
      captchaText: captcha.text,
      captchaImage: captcha.dataUrl,
      randomColor: `#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, "0")}`,
      country,
      moonPhase: getMoonPhaseEmoji(),
    }));
    setInited(true);
  }, []);

  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 1000);
    return () => clearInterval(id);
  }, []);

  const refreshCaptcha = useCallback(() => {
    const c = generateCaptcha();
    setCtx((prev) => ({ ...prev, captchaText: c.text, captchaImage: c.dataUrl }));
  }, []);

  const handleSacrifice = useCallback((ch: string) => {
    setCtx((prev) => {
      const sel = prev.sacrificeSelected.includes(ch)
        ? prev.sacrificeSelected.filter((x) => x !== ch)
        : prev.sacrificeSelected.length < 2
          ? [...prev.sacrificeSelected, ch]
          : prev.sacrificeSelected;
      if (sel.length === 2) {
        return { ...prev, sacrificed: new Set(sel), sacrificeSelected: sel };
      }
      return { ...prev, sacrificeSelected: sel };
    });
  }, []);

  const pw = gameComplete ? reType : password;
  let ruleReached = 1;
  for (let i = 0; i < ALL_RULES.length; i++) {
    if (ALL_RULES[i].check(pw, ctx)) {
      ruleReached = i + 2;
    } else {
      break;
    }
  }
  ruleReached = Math.min(ruleReached, ALL_RULES.length + 1);
  const allPassed = ruleReached > ALL_RULES.length;

  const handleConfirm = () => {
    setGameComplete(true);
    setReType("");
    setReTypeOk(false);
  };

  useEffect(() => {
    if (gameComplete && reType.length > 0) {
      setReTypeOk(reType === password);
    }
  }, [reType, password, gameComplete]);

  if (!inited) return null;

  const isNewRule = ruleReached > prevReachedRef.current;
  if (isNewRule) {
    prevReachedRef.current = ruleReached;
  }

  return (
    <div style={{ maxWidth: 560, margin: "0 auto", fontFamily: "sans-serif" }}>
      <style dangerouslySetInnerHTML={{ __html: ANIM_CSS }} />
      <h1 style={{ fontSize: 28, fontWeight: 700, textAlign: "center", marginBottom: 24 }}>
        The Password Game
      </h1>

      {gameComplete && reTypeOk ? (
        <div style={{
          textAlign: "center", padding: "48px 24px", background: "#f0fff4",
          borderRadius: 12, border: "2px solid #2ecc71",
        }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>🎉</div>
          <h2 style={{ fontSize: 24, color: "#2ecc71", marginBottom: 8 }}>Congratulations!</h2>
          <p style={{ color: "#555" }}>
            You have successfully chosen a password in {password.length} characters.
          </p>
          <div style={{
            marginTop: 16, padding: 12, background: "#fff", borderRadius: 8,
            border: "1px solid #2ecc71", fontFamily: "monospace", fontSize: 18,
            wordBreak: "break-all",
          }}>
            {password}
          </div>
        </div>
      ) : (
        <>
          <div style={{ position: "relative" }}>
            <label style={{ display: "block", fontSize: 14, color: "#888", marginBottom: 6 }}>
              {gameComplete ? "Please re-type your password" : "Please choose a password"}
            </label>
            <div style={{ position: "relative" }}>
              <textarea
                ref={inputRef}
                value={pw}
                onChange={(e) => gameComplete ? setReType(e.target.value) : setPassword(e.target.value)}
                spellCheck={false}
                style={{
                  width: "100%", minHeight: 60, padding: "14px 50px 14px 14px",
                  fontSize: 20, fontFamily: "monospace", border: "2px solid #ddd",
                  borderRadius: 8, outline: "none", resize: "vertical",
                  transition: "border-color 0.2s",
                }}
                onFocus={(e) => (e.currentTarget.style.borderColor = "#2ecc71")}
                onBlur={(e) => (e.currentTarget.style.borderColor = "#ddd")}
              />
              <span style={{
                position: "absolute", right: 12, bottom: 10, fontSize: 13, color: "#aaa",
                fontFamily: "monospace",
              }}>
                {pw.length}
              </span>
            </div>
          </div>

          {gameComplete && !reTypeOk && reType.length > 0 && (
            <p style={{ color: "#e74c3c", fontSize: 14, marginTop: 6 }}>
              Your passwords must match
            </p>
          )}

          <div>
            {ALL_RULES.map((rule, i) => {
              const ruleNum = i + 1;
              if (ruleNum >= ruleReached + 1) return null;
              const passed = ruleNum < ruleReached;
              const isNew = ruleNum === ruleReached - 1 && ruleReached > prevReachedRef.current;
              return (
                <div
                  key={i}
                  style={{
                    display: "flex", alignItems: "flex-start", gap: 10,
                    padding: "10px 0", borderTop: i > 0 ? "1px solid #eee" : "none",
                    opacity: passed ? 0.55 : 1,
                    transition: "opacity 0.4s ease",
                    ...(isNew ? { animation: "ruleSlideIn 0.3s ease-out" } : {}),
                  }}
                >
                  <div style={{ position: "relative", width: 20, height: 20, flexShrink: 0, marginTop: 2 }}>
                    <div style={{ position: "absolute", top: 0, left: 0, opacity: passed ? 1 : 0, transition: "opacity 0.35s ease, transform 0.35s ease", transform: passed ? "scale(1)" : "scale(0.7)" }}>
                      <CheckIcon />
                    </div>
                    <div style={{ position: "absolute", top: 0, left: 0, opacity: passed ? 0 : 1, transition: "opacity 0.35s ease, transform 0.35s ease", transform: passed ? "scale(0.7)" : "scale(1)" }}>
                      <ErrorIcon />
                    </div>
                  </div>
                  <div>
                    <span style={{ fontSize: 12, color: "#999", fontWeight: 600 }}>Rule {ruleNum}</span>
                    <p style={{ margin: "2px 0 0", fontSize: 14, color: "#333", lineHeight: 1.5 }}>
                      {rule.msg}
                    </p>
                    {rule.sub && rule.sub(ctx, pw, refreshCaptcha, handleSacrifice)}
                  </div>
                </div>
              );
            })}
          </div>

          {allPassed && !gameComplete && (
            <div style={{ textAlign: "center", marginTop: 24, animation: "btnSlideIn 0.35s ease-out" }}>
              <button
                onClick={handleConfirm}
                style={{
                  padding: "12px 32px", fontSize: 16, fontWeight: 600,
                  background: "#2ecc71", color: "#fff", border: "none",
                  borderRadius: 8, cursor: "pointer",
                }}
              >
                Is this your final password?
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
