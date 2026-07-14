"use client";

import { useState, useCallback } from "react";

type Page = {
  url: string;
  title: string;
  body: string[];
  links: { text: string; target: string }[];
  marquee?: string;
  hitCounter?: number;
  gif?: string;
};

const PAGES: Record<string, Page> = {
  "welcome": {
    url: "www.geocities.com/~sillysurfer/index.html",
    title: "Welcome to SillySurfer's Homepage!",
    marquee: "Welcome to my little corner of the World Wide Web!",
    hitCounter: 8742,
    body: [
      "HELLO and WELCOME to my AWESOME homepage! I made this all by myself using HTML I learned from a book!",
      "This page is best viewed in Netscape Navigator 4.7 at 800x600 resolution. If you're using Internet Explorer, please upgrade to a REAL browser. :)",
      "I have lots of cool links and fun stuff. Click around and enjoy! Don't forget to sign my guestbook!",
    ],
    links: [
      { text: "My Cool Pages", target: "links" },
      { text: "About Me", target: "about" },
      { text: "Fun Stuff", target: "fun" },
      { text: "Guestbook", target: "guestbook" },
      { text: "Web Rings", target: "webrings" },
    ],
    gif: "under-construction",
  },
  "about": {
    url: "www.geocities.com/~sillysurfer/about.html",
    title: "All About SillySurfer",
    hitCounter: 3401,
    body: [
      "Hi! My name is SillySurfer and I'm 14 years old. I live in California and my hobbies include: skateboarding, collecting Beanie Babies, and surfing the World Wide Web!",
      "My favorite bands are Backstreet Boys and *NSYNC. I also like Green Day (my mom says they're too loud but I think they're cool).",
      "I have a pet hamster named Pixel. He's brown and white and loves to run on his wheel. I'll put a picture of him up soon!",
      "My favorite TV show is Friends. I've seen every episode at least 3 times. I also like The X-Files even though it scares me.",
      "Email me at sillysurfer@aol.com! I check my inbox every day after school!",
    ],
    links: [
      { text: "Back to Homepage", target: "welcome" },
      { text: "My Cool Pages", target: "links" },
    ],
    gif: "best-viewed",
  },
  "links": {
    url: "www.geocities.com/~sillysurfer/links.html",
    title: "Cool Links!",
    hitCounter: 2103,
    body: [
      "Here are all the COOLEST sites on the internet! Bookmark this page!!!",
      "I update this list every week so check back often!",
    ],
    links: [
      { text: "Back to Homepage", target: "welcome" },
      { text: "Fun Stuff", target: "fun" },
      { text: "~*~ Angelfire Free Homepages ~*~", target: "angelfire" },
      { text: "AOL Hometown", target: "aol" },
      { text: "Hamster Dance!", target: "hamster" },
    ],
    gif: "new",
  },
  "fun": {
    url: "www.geocities.com/~sillysurfer/fun.html",
    title: "!!! FUN STUFF !!!",
    marquee: "WOW! Lots of fun things to do! Click around!",
    hitCounter: 5621,
    body: [
      "Welcome to the fun zone! Everything here is TOTALLY RAD!",
      "Check out these amazing things I found on the internet. You won't BELIEVE your eyes!",
    ],
    links: [
      { text: "Back to Homepage", target: "welcome" },
      { text: "The Dancing Baby", target: "dancing-baby" },
      { text: "Numa Numa Guy", target: "numa" },
      { text: "All Your Base", target: "ayb" },
    ],
    gif: "fire",
  },
  "guestbook": {
    url: "www.geocities.com/~sillysurfer/guestbook.html",
    title: "Sign My Guestbook!",
    hitCounter: 1204,
    body: [
      "Please sign my guestbook! Tell me what you think of my site! I read every single entry!",
      "Be nice or I'll delete your message. My site, my rules! :)",
    ],
    links: [
      { text: "Back to Homepage", target: "welcome" },
      { text: "View Entries", target: "guestbook-entries" },
    ],
    gif: "email",
  },
  "guestbook-entries": {
    url: "www.geocities.com/~sillysurfer/guestbook.cgi",
    title: "Guestbook Entries",
    hitCounter: 1204,
    body: [
      "Entries 1-10 of 47:",
      "",
      "CoolCoder99: 'Nice site dude! Check out my hacking page!'",
      "WebWizard2000: 'Your HTML is pretty good for a beginner. Keep it up!'",
      "SparklePony: 'OMG I LOVE your hamster!!! What's his name???'",
      "DarkKnight: 'This site is LAME. Get a life.'",
      "MegaFan_X: 'Link to my site and I'll link to yours! Email me!'",
      "SurferGirl: 'I'm from California too! What part?'",
      "TechMaster: 'Your page loaded in 45 seconds. Optimize your GIFs.'",
      "RainbowBrite: 'Pixels sounds so cute! I have a cat named Whiskers!'",
      "Newbie101: 'How did you make the text move??? That's so cool!!!'",
      "SillySurfer: 'Thanks for all the nice comments! I'll update soon!!!'",
    ],
    links: [
      { text: "Back to Guestbook", target: "guestbook" },
      { text: "Back to Homepage", target: "welcome" },
    ],
  },
  "webrings": {
    url: "www.geocities.com/~sillysurfer/webrings.html",
    title: "Awesome Web Rings",
    hitCounter: 893,
    body: [
      "Join these web rings to find other cool sites like mine!",
      "[ Next Site | Previous Site | Random Site | List All Sites ]",
    ],
    links: [
      { text: "Back to Homepage", target: "welcome" },
      { text: "Teen Homepages Web Ring", target: "webring" },
      { text: "Hamster Lovers Web Ring", target: "webring" },
      { text: "HTML Newbies Web Ring", target: "webring" },
    ],
    gif: "webring",
  },
  "angelfire": {
    url: "www.angelfire.com/free/homepages",
    title: "Angelfire Free Homepages",
    hitCounter: 99999,
    body: [
      "ANGELFIRE - The BEST place for FREE homepages!",
      "Get 5MB of FREE web space! No ads! (Well, maybe a few.)",
    ],
    links: [
      { text: "Back to Links", target: "links" },
      { text: "Back to Homepage", target: "welcome" },
    ],
    gif: "angelfire",
  },
  "aol": {
    url: "www.hometown.aol.com",
    title: "AOL Hometown",
    hitCounter: 99999,
    body: [
      "Welcome to AOL Hometown!",
      "America Online members can build their own homepages for free!",
      "You've Got Mail!",
    ],
    links: [
      { text: "Back to Links", target: "links" },
      { text: "Back to Homepage", target: "welcome" },
    ],
    gif: "aol",
  },
  "hamster": {
    url: "www.hamsterdance.org",
    title: "HAMSTER DANCE!!!!",
    hitCounter: 99999,
    marquee: "~~~ The HAMSTER DANCE! The HAMSTER DANCE! ~~~",
    body: [
      "* ~ * ~ * H A M S T E R * D A N C E * ~ * ~ *",
      "",
      "[  (&#9679;)(&#9679;)  ]",
      "[  (&#9733;)(&#9733;)  ]",
      "[  (&#9679;)(&#9679;)  ]",
      "",
      "Dance hamster dance!",
    ],
    links: [
      { text: "Back to Links", target: "links" },
      { text: "Back to Homepage", target: "welcome" },
    ],
    gif: "hamster",
  },
  "dancing-baby": {
    url: "www.dancingbaby.com",
    title: "THE DANCING BABY!!!",
    hitCounter: 99999,
    marquee: "~~~ DANCE BABY DANCE! ~~~",
    body: [
      "!!!!!!!!!!!!!!! THE DANCING BABY !!!!!!!!!!!!!!!",
      "",
      "OMG this is the CUTEST thing EVER!!!",
      "(Everyone on the internet is talking about this!!!)",
      "",
      "If you can't see the animation, download the Shockwave plugin at macromedia.com!",
    ],
    links: [
      { text: "Back to Fun", target: "fun" },
      { text: "Back to Homepage", target: "welcome" },
    ],
    gif: "baby",
  },
  "numa": {
    url: "www.numaguy.com",
    title: "Numa Numa Guy!",
    hitCounter: 99999,
    marquee: "~~~~~~~~~~~ MA-I-A-HIIIIII ~~~~~~~~~~~ MA-I-A-HUUUUU ~~~~~~~~~~~",
    body: [
      "DRAGOSTEA DIN TEI - O-ZONE",
      "",
      "Ma-ia-hiiii",
      "Ma-ia-huuuu",
      "Ma-ia-hooo",
      "Ma-ia-hahaha",
      "",
      "This song is stuck in my head FOREVER!!!",
    ],
    links: [
      { text: "Back to Fun", target: "fun" },
      { text: "Back to Homepage", target: "welcome" },
    ],
    gif: "music",
  },
  "ayb": {
    url: "www.allyourbase.com",
    title: "ALL YOUR BASE ARE BELONG TO US",
    hitCounter: 99999,
    marquee: "ALL YOUR BASE ARE BELONG TO US",
    body: [
      "In A.D. 2101, war was beginning.",
      "",
      "Somebody set up us the bomb.",
      "We get signal.",
      "Main screen turn on.",
      "",
      "All your base are belong to us.",
      "You have no chance to survive make your time.",
      "",
      "HA HA HA HA",
    ],
    links: [
      { text: "Back to Fun", target: "fun" },
      { text: "Back to Homepage", target: "welcome" },
    ],
    gif: "funny",
  },
};

const GIFS: Record<string, string> = {
  "under-construction": "🚧",
  "best-viewed": "🖥️",
  "new": "🆕",
  "fire": "🔥",
  "email": "✉️",
  "webring": "🔗",
  "angelfire": "💫",
  "aol": "📧",
  "hamster": "🐹",
  "baby": "👶",
  "music": "🎵",
  "funny": "😂",
};

const LOADING_LINES = [
  "Connecting to server...",
  "Contacting host...",
  "Resolving IP address...",
  "Sending request (HTTP/1.0)...",
  "Receiving response...",
  "Loading page...",
  "Rendering HTML...",
  "Downloading images... (3 of 12)",
  "Downloading images... (7 of 12)",
  "Downloading images... (12 of 12)",
  "Running marquee tag...",
  "Applying &lt;blink&gt; effect...",
  "Counting visitor hits...",
  "Complete!",
];

const KEY_COLORS = ["#0000FF", "#FF0000", "#008000", "#FF00FF", "#800080", "#FF6600"];

function randomColor() {
  return KEY_COLORS[Math.floor(Math.random() * KEY_COLORS.length)];
}

export default function OldWebExplorer() {
  const [currentPage, setCurrentPage] = useState<string>("welcome");
  const [history, setHistory] = useState<string[]>(["welcome"]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [visitedPages, setVisitedPages] = useState<Set<string>>(new Set(["welcome"]));
  const [inlineCount, setInlineCount] = useState(0);

  const page = PAGES[currentPage];

  const navigate = useCallback((target: string) => {
    if (!PAGES[target]) return;
    if (loading) return;

    setLoading(true);
    setLoadingProgress(0);

    const interval = setInterval(() => {
      setLoadingProgress((p) => {
        if (p >= LOADING_LINES.length - 1) {
          clearInterval(interval);
          setLoading(false);
          setCurrentPage(target);
          setHistory((h) => {
            const newHistory = h.slice(0, historyIndex + 1);
            newHistory.push(target);
            return newHistory;
          });
          setHistoryIndex((i) => i + 1);
          setVisitedPages((v) => new Set([...v, target]));
          return LOADING_LINES.length - 1;
        }
        return p + 1;
      });
    }, 80 + Math.random() * 120);

    setInlineCount((c) => c + 1);
  }, [loading, historyIndex]);

  const goBack = useCallback(() => {
    if (historyIndex <= 0 || loading) return;
    const newIndex = historyIndex - 1;
    setHistoryIndex(newIndex);
    setCurrentPage(history[newIndex]);
  }, [historyIndex, history, loading]);

  const goForward = useCallback(() => {
    if (historyIndex >= history.length - 1 || loading) return;
    const newIndex = historyIndex + 1;
    setHistoryIndex(newIndex);
    setCurrentPage(history[newIndex]);
  }, [historyIndex, history, loading]);

  if (!page) {
    return <div className="text-center py-8 text-error">404 - Page Not Found</div>;
  }

  return (
    <div className="w-full" style={{ animation: "fade-up 0.4s ease-out" }}>
      <div className="bg-gradient-to-r from-blue-900 via-purple-900 to-blue-900 rounded-t-xl border-2 border-blue-950 overflow-hidden">
        <div className="px-3 py-1.5 flex items-center gap-2 bg-gradient-to-b from-blue-800 to-blue-950 border-b border-blue-700">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-500" />
            <div className="w-3 h-3 rounded-full bg-yellow-500" />
            <div className="w-3 h-3 rounded-full bg-green-500" />
          </div>
          <div className="flex-1 text-center">
            <span className="text-blue-200 text-xs font-mono">Netscape Navigator</span>
          </div>
        </div>

        <div className="flex items-center gap-0.5 px-2 py-1 bg-gray-100">
          <button
            onClick={goBack}
            disabled={historyIndex <= 0 || loading}
            className="px-2 py-0.5 text-xs bg-gray-200 border border-gray-300 rounded hover:bg-gray-300 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            ◄ Back
          </button>
          <button
            onClick={goForward}
            disabled={historyIndex >= history.length - 1 || loading}
            className="px-2 py-0.5 text-xs bg-gray-200 border border-gray-300 rounded hover:bg-gray-300 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            ►
          </button>
          <button
            onClick={() => navigate("welcome")}
            disabled={loading}
            className="px-2 py-0.5 text-xs bg-gray-200 border border-gray-300 rounded hover:bg-gray-300 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Home
          </button>
          <div className="flex-1 mx-1 px-1.5 py-0.5 text-xs bg-white border border-gray-400 truncate font-mono text-gray-700">
            http://{page.url}
          </div>
        </div>
      </div>

      {loading ? (
        <div className="bg-[#000080] text-gray-300 font-mono text-xs p-4 border-x-2 border-b-2 border-blue-950 min-h-[320px]">
          {LOADING_LINES.slice(0, loadingProgress + 1).map((line, i) => (
            <div key={i} className="mb-0.5">
              {line}
              {i === loadingProgress && <span className="animate-pulse">_</span>}
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-[#C0C0C0] border-x-2 border-b-2 border-blue-950 min-h-[320px]">
          <div className="bg-[#FFFFF0] mx-3 my-3 border-2 border-gray-400 p-3">
            {page.marquee && (
              <div className="overflow-hidden whitespace-nowrap mb-3 bg-[#FFFF00] text-[#FF0000] font-bold text-sm py-1 px-2 border border-orange-400">
                <div className="inline-block animate-marquee">
                  {page.marquee}
                </div>
              </div>
            )}

            <div className="text-center mb-3">
              <span className="text-3xl sm:text-4xl font-bold font-display" style={{ color: randomColor() }}>
                {page.title}
              </span>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-4 mb-3 text-xs">
              {page.gif && (
                <div className="text-center">
                  <span className="text-3xl">{GIFS[page.gif]}</span>
                  <div className="text-[#808080] font-mono mt-0.5">animated_gif.gif</div>
                </div>
              )}
              <div className="text-center font-mono text-[#808080] text-[10px]">
                <div className="bg-black text-green-400 px-2 py-0.5 mb-0.5 text-[11px] font-bold tracking-wider">
                  Visitor #{page.hitCounter?.toLocaleString()}
                </div>
                since 03/12/1999
              </div>
            </div>

            <div className="text-xs sm:text-sm text-[#000000] leading-relaxed">
              {page.body.map((line, i) => (
                <p key={i} className="mb-1.5">{line || <br />}</p>
              ))}
            </div>

            {page.marquee && (
              <div className="overflow-hidden whitespace-nowrap mt-3 bg-[#00FF00] text-[#0000FF] font-bold text-sm py-1 px-2 border border-green-600">
                <div className="inline-block animate-marquee">
                  {page.marquee}
                </div>
              </div>
            )}

            <hr className="my-3 border-t-2 border-dashed border-[#FF00FF]" />

            <div className="text-center">
              <p className="text-[10px] font-bold text-[#808080] mb-2">- * - * - LINKS - * - * -</p>
              {page.links.map((link, i) => (
                <button
                  key={i}
                  onClick={() => navigate(link.target)}
                  className="block w-full text-left px-2 py-1.5 text-sm sm:text-base text-[#0000FF] underline hover:text-[#FF00FF] hover:bg-[#FFFF00] transition-colors font-bold"
                  style={{
                    fontFamily: "Times New Roman, serif",
                    fontSize: `${14 + (i % 3) * 2}px`,
                  }}
                >
                  {link.text}
                </button>
              ))}
            </div>

            <div className="mt-4 pt-2 border-t border-[#C0C0C0] text-center text-[9px] font-mono text-[#808080]">
              <span className="font-bold text-[#0000FF]">&lt;HTML&gt;</span> Best viewed in Netscape Navigator 4.7 |
              Last updated: 08/21/1999 |
              Made with Notepad
            </div>
          </div>

          <div className="bg-gradient-to-r from-gray-300 to-gray-400 text-[10px] text-gray-600 px-3 py-1 text-center border-t border-gray-400 font-mono">
            <span className="animate-pulse">✦</span> {page.url}
            <span className="mx-2">|</span>
            Document: Done
            <span className="mx-2">|</span>
            {visitedPages.size} page{visitedPages.size !== 1 ? "s" : ""} visited
          </div>
        </div>
      )}

      <div className="mt-3 text-center">
        <p className="text-xs text-ink-muted">
          {inlineCount} link{inlineCount !== 1 ? "s" : ""} clicked — explore the old web!
        </p>
        {visitedPages.size >= Object.keys(PAGES).length && (
          <p className="text-sm text-success font-medium mt-1" style={{ animation: "fade-up 0.4s ease-out" }}>
            You explored every page on this site!
          </p>
        )}
      </div>
    </div>
  );
}
