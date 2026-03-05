// src/WeddingSite.jsx
import { useEffect, useRef, useState } from "react";

/* ══════════════════════════════════════════════════════════════════
   PHOTOS
   Once you have real photos, replace the gradient placeholders:

   import p1 from "./assets/photo1.jpeg";
   import p2 from "./assets/photo2.jpeg";
   const PHOTOS = [{ src: p1 }, { src: p2 }, ...];

   Until then, the warm gradient tiles below look intentional and
   beautiful on every device.
══════════════════════════════════════════════════════════════════ */
const PHOTOS = [
  { gradient: "linear-gradient(140deg,#e8d5c0 0%,#c9a98a 55%,#7a5040 100%)" },
  { gradient: "linear-gradient(155deg,#d4c5b0 0%,#b8958a 50%,#6a4840 100%)" },
  { gradient: "linear-gradient(125deg,#e0d0be 0%,#bfa080 52%,#685038 100%)" },
  { gradient: "linear-gradient(148deg,#dcc8b0 0%,#c4a078 48%,#704838 100%)" },
];

/* ══════════════════════════════════════════════════════════════════
   HOOKS
══════════════════════════════════════════════════════════════════ */

/** Smooth lerp-based scroll value — desktop only; raw value on mobile */
function useSmoothScrollY() {
  const [y, setY] = useState(0);
  const target = useRef(0);
  const raf = useRef(null);

  useEffect(() => {
    const isMobile = window.innerWidth < 768;

    const onScroll = () => {
      target.current = window.scrollY;
      if (isMobile) setY(window.scrollY);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    if (!isMobile) {
      const tick = () => {
        setY((prev) => prev + (target.current - prev) * 0.08);
        raf.current = requestAnimationFrame(tick);
      };
      raf.current = requestAnimationFrame(tick);
    }

    return () => {
      window.removeEventListener("scroll", onScroll);
      if (raf.current) cancelAnimationFrame(raf.current);
    };
  }, []);

  return y;
}

/** Fires once when the element enters the viewport */
function useInView(threshold = 0.12) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setVisible(true); },
      { threshold }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [threshold]);

  return [ref, visible];
}

/* ══════════════════════════════════════════════════════════════════
   GLOBAL STYLES  (mobile-first, then ≥640 tablet, ≥1024 desktop)
══════════════════════════════════════════════════════════════════ */
const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,700;1,400;1,500&display=swap');

  *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }

  html {
    scroll-behavior: smooth;
    -webkit-text-size-adjust: 100%;
    text-size-adjust: 100%;
  }

  body {
    background: #f5f0eb;
    overscroll-behavior-y: none;
    overflow-x: hidden;
  }

  /* ── Prevent iOS zoom on input focus ── */
  input, select, textarea { font-size: 16px !important; }

  ::selection { background: #d4c5b0; }

  ::-webkit-scrollbar { width: 3px; }
  ::-webkit-scrollbar-track { background: #f5f0eb; }
  ::-webkit-scrollbar-thumb { background: #c8b8a2; border-radius: 2px; }

  /* ── Keyframes ── */
  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(22px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes chevron {
    0%, 100% { transform: translateX(-50%) translateY(0);   opacity: 0.6; }
    50%       { transform: translateX(-50%) translateY(10px); opacity: 1;   }
  }
  @keyframes kyleSlide {
    from { transform: translateX(65%); opacity: 0; }
    to   { transform: translateX(0);   opacity: 1; }
  }
  @keyframes amberSlide {
    from { transform: translateX(-65%); opacity: 0; }
    to   { transform: translateX(0);    opacity: 1; }
  }
  @keyframes ampPop {
    from { opacity: 0; transform: scale(0.7); }
    to   { opacity: 1; transform: scale(1);   }
  }
  @keyframes grain {
    0%   { transform: translate(0%,    0%); }
    20%  { transform: translate(-2%,   1%); }
    40%  { transform: translate( 1%,  -2%); }
    60%  { transform: translate(-1%,   2%); }
    80%  { transform: translate( 2%,  -1%); }
    100% { transform: translate( 0%,   0%); }
  }

  /* ── Reveal animation ── */
  .reveal {
    opacity: 0;
    transform: translateY(26px);
    transition: opacity 0.9s ease, transform 1s cubic-bezier(.2,.8,.2,1);
  }
  .reveal.in { opacity: 1; transform: translateY(0); }

  /* ── Nav ── */
  .nav {
    position: fixed;
    top: 0; left: 0; right: 0;
    z-index: 200;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 14px 20px;
    background: rgba(245,240,235,0.93);
    backdrop-filter: blur(14px);
    -webkit-backdrop-filter: blur(14px);
    border-bottom: 1px solid rgba(200,184,162,0.35);
  }

  /* Desktop links */
  .nav-links { display: none; gap: 28px; }
  .nav-links a:hover { color: #1a1a1a !important; }

  /* Hamburger button — mobile only */
  .nav-hamburger {
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 5px;
    cursor: pointer;
    background: none;
    border: none;
    padding: 8px;
    z-index: 201;
    -webkit-tap-highlight-color: transparent;
    touch-action: manipulation;
  }
  .nav-hamburger span {
    display: block;
    width: 22px;
    height: 1.5px;
    border-radius: 1px;
    transition: transform 0.3s ease, opacity 0.3s ease;
  }
  .nav-hamburger.open span:nth-child(1) { transform: translateY(6.5px) rotate(45deg); }
  .nav-hamburger.open span:nth-child(2) { opacity: 0; transform: scaleX(0); }
  .nav-hamburger.open span:nth-child(3) { transform: translateY(-6.5px) rotate(-45deg); }

  /* Full-screen mobile menu */
  .mobile-menu {
    position: fixed;
    inset: 0;
    z-index: 199;
    background: rgba(245,240,235,0.97);
    backdrop-filter: blur(24px);
    -webkit-backdrop-filter: blur(24px);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 4px;
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.3s ease;
  }
  .mobile-menu.open { opacity: 1; pointer-events: auto; }
  .mobile-menu a {
    font-family: 'Playfair Display', serif;
    font-size: clamp(40px, 11vw, 58px);
    font-style: italic;
    font-weight: 400;
    color: #1a1a1a;
    text-decoration: none;
    letter-spacing: 0.03em;
    padding: 10px 0;
    transition: color 0.2s;
  }
  .mobile-menu a:hover { color: #9a8878; }

  @media (min-width: 768px) {
    .nav { padding: 18px 40px; }
    .nav-links { display: flex; }
    .nav-hamburger { display: none; }
    .mobile-menu { display: none !important; }
  }

  /* ── Hero ── */
  .hero {
    height: 100vh;
    height: 100svh;
    min-height: 580px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    padding: 80px 28px 60px;
    position: relative;
    overflow: hidden;
  }
  .hero-names {
    font-family: 'Playfair Display', serif;
    font-weight: 400;
    font-size: clamp(36px, 12vw, 120px);
    line-height: 0.88;
    color: #1a1a1a;
    width: min(92vw, 860px);
    position: relative;
    isolation: isolate;
  }
  .hero-kyle {
    display: block;
    text-align: left;
    position: relative;
    z-index: 1;
    animation: kyleSlide 1.1s cubic-bezier(.22,.8,.22,1) 0.5s both;
  }
  .hero-amber {
    display: block;
    text-align: right;
    position: relative;
    z-index: 1;
    animation: amberSlide 1.1s cubic-bezier(.22,.8,.22,1) 0.65s both;
  }
  .hero-amp {
    display: block;
    font-family: 'Playfair Display', serif;
    font-style: italic;
    font-weight: 400;
    font-size: 0.62em;
    letter-spacing: 0.08em;
    color: #b8a088;
    margin: -2px 0;
    text-align: center;
    position: relative;
    z-index: 2;
    animation: ampPop 0.7s cubic-bezier(.34,1.56,.64,1) 0.25s both;
  }
  .hero-date {
    font-family: 'Playfair Display', serif;
    font-size: clamp(14px, 2.8vw, 20px);
    color: #6b5d52;
    letter-spacing: 0.1em;
    font-weight: 400;
    animation: fadeUp 1.1s ease 0.7s both;
  }
  .letterbox {
    position: absolute;
    left: 0; right: 0;
    background: #0c0c0c;
    opacity: 0.88;
    height: 32px;
  }
  @media (min-width: 640px) {
    .letterbox { height: 44px; }
  }

  /* ── Details ── */
  .details-grid {
    display: grid;
    grid-template-columns: 1fr;
    max-width: 900px;
    margin: 0 auto;
  }
  @media (min-width: 640px) {
    .details-grid { grid-template-columns: repeat(3, 1fr); }
  }

  /* ── Photo grid ── */
  .photo-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 12px;
  }
  @media (min-width: 560px) {
    .photo-grid { grid-template-columns: repeat(2, 1fr); gap: 14px; }
  }
  @media (min-width: 1024px) {
    .photo-grid { gap: 18px; }
  }
  .photo-wide { grid-column: span 1; }
  @media (min-width: 560px) {
    .photo-wide { grid-column: span 2; }
  }

  /* ── RSVP form ── */
  .rsvp-wrap {
    max-width: 540px;
    margin: 0 auto;
    padding: 72px 20px 96px;
  }
  @media (min-width: 640px) {
    .rsvp-wrap { padding: 112px 40px 140px; }
  }
  .attend-row {
    display: flex;
    flex-direction: column;
    gap: 0;
  }
  @media (min-width: 400px) {
    .attend-row { flex-direction: row; flex-wrap: wrap; }
  }
  .attend-opt {
    display: flex;
    align-items: center;
    gap: 12px;
    cursor: pointer;
    padding: 14px 0;
    min-height: 52px;
    flex: 1;
    min-width: 180px;
    user-select: none;
    -webkit-user-select: none;
  }

  /* ── Gold shimmer button ── */
  .goldBtn {
    position: relative;
    overflow: hidden;
    width: 100%;
    background: #101010;
    color: #f5f0eb;
    border: 1px solid rgba(255,255,255,0.08);
    padding: 18px 40px;
    font-family: system-ui, sans-serif;
    font-size: 11px;
    letter-spacing: 0.22em;
    text-transform: uppercase;
    cursor: pointer;
    box-shadow: 0 14px 36px rgba(0,0,0,0.15);
    transition: transform 180ms ease, opacity 180ms ease, box-shadow 220ms ease;
    -webkit-tap-highlight-color: transparent;
    touch-action: manipulation;
  }
  @media (min-width: 640px) {
    .goldBtn { width: auto; }
  }
  .goldBtn::before {
    content: "";
    position: absolute;
    inset: -40%;
    background: linear-gradient(
      120deg,
      rgba(255,255,255,0) 35%,
      rgba(212,197,176,0.22) 46%,
      rgba(255,255,255,0) 62%
    );
    transform: translateX(-55%);
    opacity: 0;
    transition: opacity 180ms ease;
    pointer-events: none;
  }
  .goldBtn:hover {
    transform: translateY(-1px);
    opacity: 0.92;
    box-shadow: 0 18px 50px rgba(0,0,0,0.18);
  }
  .goldBtn:hover::before {
    opacity: 1;
    animation: shimmerSweep 900ms ease;
  }
  .goldBtn:active { transform: translateY(0); opacity: 0.9; }
  .goldBtn:disabled { opacity: 0.5; cursor: wait; transform: none; }

  @keyframes shimmerSweep {
    0%   { transform: translateX(-55%); }
    100% { transform: translateX(55%);  }
  }
  /* ── Respect reduced motion ── */
  @media (prefers-reduced-motion: reduce) {
    .reveal { transition: none; opacity: 1; transform: none; }
    *, *::before, *::after { animation-duration: 0.01ms !important; }
  }
`;

/* ══════════════════════════════════════════════════════════════════
   FILM OVERLAY  (vignette + grain)
══════════════════════════════════════════════════════════════════ */
function FilmOverlay() {
  return (
    <div
      aria-hidden="true"
      style={{
        position: "fixed",
        inset: 0,
        pointerEvents: "none",
        zIndex: 998,
        mixBlendMode: "overlay",
      }}
    >
      <div style={{
        position: "absolute",
        inset: 0,
        background: "radial-gradient(ellipse at center, rgba(0,0,0,0) 38%, rgba(0,0,0,0.32) 100%)",
      }} />
      <div style={{
        position: "absolute",
        inset: "-20%",
        backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="160" height="160"><filter id="n"><feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" stitchTiles="stitch"/></filter><rect width="160" height="160" filter="url(%23n)" opacity="0.22"/></svg>')`,
        opacity: 0.11,
        animation: "grain 8s steps(8) infinite",
      }} />
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════
   NAV BAR
══════════════════════════════════════════════════════════════════ */
function NavBar({ scrollY }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const scrolled = scrollY > 60;

  // Close menu when user scrolls
  useEffect(() => {
    if (menuOpen && scrollY > 80) setMenuOpen(false);
  }, [scrollY]);

  // Lock body scroll while menu is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  const brandColor = "#1a1a1a";
  const barColor   = "#1a1a1a";

  const link = {
    fontFamily: "system-ui, sans-serif",
    fontSize: "10px",
    letterSpacing: "0.22em",
    textTransform: "uppercase",
    textDecoration: "none",
    color: "#6b5d52",
    transition: "color 0.3s",
  };

  return (
    <>
      <nav className="nav">
        <span style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: "17px",
          fontWeight: 400,
          fontStyle: "italic",
          color: brandColor,
          letterSpacing: "0.04em",
          transition: "color 0.3s",
        }}>
          Kyle &amp; Amber
        </span>

        {/* Desktop links */}
        <div className="nav-links">
          {["Details", "Gallery", "RSVP"].map((s) => (
            <a key={s} href={`#${s.toLowerCase()}`} style={link}>{s}</a>
          ))}
        </div>

        {/* Mobile hamburger */}
        <button
          className={`nav-hamburger${menuOpen ? " open" : ""}`}
          onClick={() => setMenuOpen((o) => !o)}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
        >
          <span style={{ background: barColor }} />
          <span style={{ background: barColor }} />
          <span style={{ background: barColor }} />
        </button>
      </nav>

      {/* Mobile fullscreen menu */}
      <div className={`mobile-menu${menuOpen ? " open" : ""}`}>
        {["Details", "Gallery", "RSVP"].map((s, i) => (
          <a
            key={s}
            href={`#${s.toLowerCase()}`}
            onClick={() => setMenuOpen(false)}
            style={{
              opacity: menuOpen ? 1 : 0,
              transform: menuOpen ? "translateY(0)" : "translateY(14px)",
              transition: `opacity 0.35s ease ${0.08 + i * 0.07}s, transform 0.35s ease ${0.08 + i * 0.07}s`,
            }}
          >
            {s}
          </a>
        ))}
        <div style={{
          width: 40, height: 1, background: "#c8b8a2",
          margin: "20px 0 10px",
          opacity: menuOpen ? 1 : 0,
          transition: "opacity 0.35s ease 0.32s",
        }} />
        <p style={{
          fontFamily: "system-ui, sans-serif",
          fontSize: "10px",
          color: "#9a8878",
          letterSpacing: "0.22em",
          textTransform: "uppercase",
          opacity: menuOpen ? 1 : 0,
          transition: "opacity 0.35s ease 0.38s",
        }}>
          Kyle &amp; Amber
        </p>
      </div>
    </>
  );
}

/* ══════════════════════════════════════════════════════════════════
   PHOTO CARD  (parallax on desktop, fade-in everywhere)
══════════════════════════════════════════════════════════════════ */
function PhotoCard({ photo, index }) {
  const [cardRef, visible] = useInView(0.1);
  const imgRef = useRef(null);
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    if (!photo.src || window.innerWidth < 768) return;
    const handle = () => {
      const el = imgRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const center = rect.top + rect.height / 2 - window.innerHeight / 2;
      setOffset(center * 0.11);
    };
    window.addEventListener("scroll", handle, { passive: true });
    handle();
    return () => window.removeEventListener("scroll", handle);
  }, [photo.src]);

  const isWide = index % 3 === 0;

  return (
    <figure
      ref={cardRef}
      className={`reveal${visible ? " in" : ""}${isWide ? " photo-wide" : ""}`}
      style={{
        overflow: "hidden",
        borderRadius: "2px",
        aspectRatio: isWide ? "16/8" : "4/5",
        position: "relative",
        background: photo.gradient || "#e8ddd3",
        boxShadow: "0 14px 44px rgba(0,0,0,0.1)",
        transitionDelay: `${index * 0.07}s`,
      }}
    >
      {photo.src ? (
        <div ref={imgRef} style={{ width: "100%", height: "100%", overflow: "hidden" }}>
          <img
            src={photo.src}
            alt={`Kyle and Amber — memory ${index + 1}`}
            loading="lazy"
            style={{
              width: "100%",
              height: "120%",
              objectFit: "cover",
              display: "block",
              transform: `translateY(${offset}px)`,
              transition: "transform 0.06s linear",
              filter: "contrast(1.02) saturate(0.9)",
            }}
          />
        </div>
      ) : (
        /* Gradient placeholder — swap with real photo when ready */
        <div style={{
          width: "100%",
          height: "100%",
          background: photo.gradient,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}>
          <span style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: "12px",
            color: "rgba(255,255,255,0.42)",
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            fontStyle: "italic",
          }}>
            photo coming soon
          </span>
        </div>
      )}
      {/* Bottom vignette */}
      <div style={{
        position: "absolute",
        inset: 0,
        background: "linear-gradient(to top, rgba(0,0,0,0.22) 0%, transparent 50%)",
        pointerEvents: "none",
      }} />
    </figure>
  );
}

/* ══════════════════════════════════════════════════════════════════
   RSVP FORM  (Netlify)
══════════════════════════════════════════════════════════════════ */
function RSVPForm() {
  const [sectionRef, visible] = useInView(0.08);
  const [form, setForm] = useState({ name: "", guests: "1", attending: "yes", note: "" });
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    setLoading(true);
    fetch("/", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ "form-name": "rsvp", ...form }).toString(),
    })
      .then(() => setSent(true))
      .catch(() => alert("Submission failed — please try again."))
      .finally(() => setLoading(false));
  };

  const inputBase = {
    width: "100%",
    background: "transparent",
    border: "none",
    borderBottom: "1px solid #c8b8a2",
    padding: "12px 0",
    fontFamily: "'Playfair Display', serif",
    fontSize: "16px",
    color: "#1a1a1a",
    outline: "none",
    letterSpacing: "0.02em",
    borderRadius: 0,
    appearance: "none",
    WebkitAppearance: "none",
  };

  const labelStyle = {
    display: "block",
    fontFamily: "system-ui, sans-serif",
    fontSize: "10px",
    letterSpacing: "0.2em",
    textTransform: "uppercase",
    color: "#9a8878",
    marginBottom: "10px",
  };

  return (
    <section id="rsvp" ref={sectionRef}>
      <div className={`rsvp-wrap reveal${visible ? " in" : ""}`}>
        <p style={{
          fontFamily: "system-ui, sans-serif",
          fontSize: "10px",
          letterSpacing: "0.3em",
          textTransform: "uppercase",
          color: "#9a8878",
          marginBottom: "14px",
        }}>
          kindly reply
        </p>

        <h2 style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: "clamp(38px, 9vw, 58px)",
          fontWeight: 400,
          lineHeight: 1.05,
          color: "#1a1a1a",
          marginBottom: "52px",
        }}>
          Will you join us?
        </h2>

        {sent ? (
          <div style={{ textAlign: "center", padding: "52px 0 20px" }}>
            <div style={{
              width: "56px",
              height: "56px",
              borderRadius: "50%",
              border: "1px solid #c8b8a2",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 24px",
              fontSize: "24px",
            }}>✉</div>
            <p style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "26px",
              fontWeight: 400,
              color: "#1a1a1a",
              marginBottom: "10px",
            }}>
              Your RSVP is on its way.
            </p>
            <p style={{
              fontFamily: "system-ui, sans-serif",
              fontSize: "13px",
              color: "#9a8878",
              lineHeight: 1.6,
            }}>
              We can't wait to celebrate with you.
            </p>
          </div>
        ) : (
          <form
            name="rsvp"
            method="POST"
            data-netlify="true"
            onSubmit={handleSubmit}
            style={{ display: "flex", flexDirection: "column", gap: "36px" }}
          >
            <input type="hidden" name="form-name" value="rsvp" />

            {/* Name */}
            <div>
              <label style={labelStyle}>Full Name</label>
              <input
                name="name"
                style={inputBase}
                placeholder="Your name"
                value={form.name}
                onChange={set("name")}
                required
                autoComplete="name"
              />
            </div>

            {/* Attending */}
            <div>
              <label style={labelStyle}>Attending</label>
              <div className="attend-row">
                {[
                  { value: "yes", label: "Joyfully accepts" },
                  { value: "no",  label: "Regretfully declines" },
                ].map(({ value, label }) => (
                  <label key={value} className="attend-opt">
                    <input
                      type="radio"
                      name="attending"
                      value={value}
                      checked={form.attending === value}
                      onChange={set("attending")}
                      style={{ display: "none" }}
                    />
                    <div style={{
                      width: "20px",
                      height: "20px",
                      minWidth: "20px",
                      borderRadius: "50%",
                      border: `1px solid ${form.attending === value ? "#1a1a1a" : "#c8b8a2"}`,
                      background: form.attending === value ? "#1a1a1a" : "transparent",
                      transition: "all 0.2s",
                    }} />
                    <span style={{
                      fontFamily: "'Playfair Display', serif",
                      fontSize: "18px",
                      fontWeight: 400,
                      color: form.attending === value ? "#1a1a1a" : "#9a8878",
                      transition: "color 0.2s",
                    }}>
                      {label}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Guest count */}
            {form.attending === "yes" && (
              <div>
                <label style={labelStyle}>Number of Guests</label>
                <select
                  name="guests"
                  style={{ ...inputBase, cursor: "pointer", paddingRight: "20px" }}
                  value={form.guests}
                  onChange={set("guests")}
                >
                  {[1, 2, 3, 4].map((n) => (
                    <option key={n} value={n}>{n}</option>
                  ))}
                </select>
              </div>
            )}

            {/* Note */}
            <div>
              <label style={labelStyle}>A Note for the Couple</label>
              <textarea
                name="note"
                style={{ ...inputBase, resize: "none", height: "76px" }}
                placeholder="Optional message…"
                value={form.note}
                onChange={set("note")}
              />
            </div>

            <div>
              <button type="submit" className="goldBtn" disabled={loading}>
                {loading ? "Sending…" : "Send RSVP"}
              </button>
            </div>
          </form>
        )}
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════════════════════════
   MAIN
══════════════════════════════════════════════════════════════════ */
export default function WeddingSite() {
  const scrollY = useSmoothScrollY();
  const [detailsRef, detailsVisible] = useInView(0.08);
  const [galleryHeaderRef, galleryHeaderVisible] = useInView(0.1);

  const detail = {
    fontFamily: "system-ui, sans-serif",
    fontSize: "10px",
    letterSpacing: "0.26em",
    textTransform: "uppercase",
    color: "#9a8878",
    marginBottom: "16px",
  };

  return (
    <div style={{
      background: "#f5f0eb",
      minHeight: "100vh",
      overflowX: "hidden",
      fontFamily: "system-ui, sans-serif",
    }}>
      <style>{CSS}</style>
      <FilmOverlay />
      <NavBar scrollY={scrollY} />

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  HERO */}
      <section className="hero">
        {/* Soft orbs — desktop parallax */}
        <div style={{
          position: "absolute",
          top: "8%", left: "2%",
          width: "min(50vw, 460px)", height: "min(50vw, 460px)",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(200,184,162,0.2) 0%, transparent 70%)",
          transform: `translateY(${scrollY * 0.07}px)`,
          pointerEvents: "none",
        }} />
        <div style={{
          position: "absolute",
          bottom: "6%", right: "-2%",
          width: "min(42vw, 380px)", height: "min(42vw, 380px)",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(180,156,130,0.16) 0%, transparent 70%)",
          transform: `translateY(${scrollY * -0.05}px)`,
          pointerEvents: "none",
        }} />

        {/* Cinematic letterbox bars */}
        <div className="letterbox" style={{ top: 0 }} />
        <div className="letterbox" style={{ bottom: 0 }} />

        {/* Content */}
        <div style={{ position: "relative", zIndex: 1 }}>
          <p style={{
            fontFamily: "system-ui, sans-serif",
            fontSize: "10px",
            letterSpacing: "0.34em",
            textTransform: "uppercase",
            color: "#9a8878",
            marginBottom: "28px",
            animation: "fadeUp 1s ease 0.2s both",
          }}>
            Together with their families
          </p>

          <h1 className="hero-names">
            <em className="hero-kyle">Kyle</em>
            <span className="hero-amp">&amp;</span>
            <em className="hero-amber">Amber</em>
          </h1>

          <div style={{
            width: "44px",
            height: "1px",
            background: "#c8b8a2",
            margin: "30px auto",
          }} />

          <p className="hero-date">
            Date · Venue
          </p>
        </div>

        {/* Scroll cue */}
        <div style={{
          position: "absolute",
          bottom: "52px",
          left: "50%",
          animation: "chevron 2.4s ease infinite",
          pointerEvents: "none",
        }}>
          <div style={{
            width: "1px",
            height: "46px",
            background: "linear-gradient(to bottom, transparent, #9a8878)",
          }} />
        </div>
      </section>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  DETAILS */}
      <section id="details" style={{ padding: "80px 20px 60px" }}>
        <div
          ref={detailsRef}
          className={`details-grid reveal${detailsVisible ? " in" : ""}`}
        >
          {[
            { label: "Ceremony",  l1: "Time TBD",            l2: "Venue TBD",        l3: "Location" },
            { label: "Reception", l1: "Time TBD",            l2: "Venue TBD",        l3: "Cocktails & Dancing" },
            { label: "Attire",    l1: "Black Tie Optional",  l2: "Florals Welcome",  l3: "" },
          ].map(({ label, l1, l2, l3 }) => (
            <div key={label} style={{
              borderTop: "1px solid #d4c5b0",
              paddingTop: "26px",
              paddingBottom: "40px",
              paddingRight: "28px",
            }}>
              <p style={detail}>{label}</p>
              <p style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "clamp(20px, 3vw, 24px)",
                color: "#1a1a1a",
                fontWeight: 400,
                lineHeight: 1.5,
              }}>{l1}</p>
              <p style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "clamp(16px, 2.5vw, 19px)",
                color: "#6b5d52",
                fontWeight: 400,
              }}>{l2}</p>
              {l3 && (
                <p style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: "15px",
                  color: "#9a8878",
                  fontWeight: 400,
                }}>{l3}</p>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  ORNAMENT */}
      <div style={{ textAlign: "center", padding: "8px 0 56px" }}>
        <span style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: "22px",
          color: "#c8b8a2",
          fontStyle: "italic",
        }}>✦</span>
      </div>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  GALLERY */}
      <section id="gallery" style={{ padding: "0 16px 100px", maxWidth: "1100px", margin: "0 auto" }}>
        <div
          ref={galleryHeaderRef}
          className={`reveal${galleryHeaderVisible ? " in" : ""}`}
          style={{ marginBottom: "44px" }}
        >
          <p style={{ ...detail, marginBottom: "10px" }}>Our story</p>
          <h2 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: "clamp(32px, 6vw, 52px)",
            fontWeight: 400,
            color: "#1a1a1a",
          }}>
            A few memories
          </h2>
        </div>

        <div className="photo-grid">
          {PHOTOS.map((photo, i) => (
            <PhotoCard key={i} photo={photo} index={i} />
          ))}
        </div>
      </section>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  RSVP */}
      <div style={{ borderTop: "1px solid #d4c5b0", margin: "0 20px" }} />
      <RSVPForm />

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  FOOTER */}
      <footer style={{
        textAlign: "center",
        padding: "52px 20px",
        borderTop: "1px solid #d4c5b0",
      }}>
        <p style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: "22px",
          fontWeight: 400,
          fontStyle: "italic",
          color: "#1a1a1a",
          marginBottom: "8px",
        }}>
          Kyle &amp; Amber
        </p>
        <p style={{
          fontFamily: "system-ui, sans-serif",
          fontSize: "10px",
          color: "#9a8878",
          letterSpacing: "0.16em",
          textTransform: "uppercase",
        }}>
          Date · Location
        </p>
      </footer>
    </div>
  );
}
