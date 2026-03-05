// src/WeddingSite.jsx
import { useEffect, useRef, useState } from "react";

/* ══════════════════════════════════════════════════════════════════
   PHOTOS
══════════════════════════════════════════════════════════════════ */
const PHOTOS = [
  { src: "/5.jpg" },
  { src: "/4.jpg" },
  { src: "/1.jpg" },
  { src: "/6.jpg" },
  { src: "/3.jpg", wide: true },
  { src: "/2.jpg", wide: true },
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
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&family=Playfair+Display:ital,wght@0,400;0,500;0,700;1,400;1,500&display=swap');

  :root {
    --champagne: #f6f1ea;
    --ink: #241d19;
    --dusty-rose: #b99793;
    --sage: #7d8b77;
    --muted: #7a685a;
  }

  *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }

  html {
    scroll-behavior: smooth;
    -webkit-text-size-adjust: 100%;
    text-size-adjust: 100%;
  }

  body {
    background: var(--champagne);
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
  @keyframes scrollFade {
    0%, 100% { opacity: 0.5; }
    50%      { opacity: 1; }
  }
  @keyframes heroFloatIn {
    from { opacity: 0; transform: translateY(14px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes kyleSweep {
    from { opacity: 0; transform: translateX(42%); }
    to   { opacity: 1; transform: translateX(0); }
  }
  @keyframes amberSweep {
    from { opacity: 0; transform: translateX(-42%); }
    to   { opacity: 1; transform: translateX(0); }
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
    padding: 60px 28px 60px;
    position: relative;
    overflow: hidden;
  }
  .hero-names {
    font-family: 'Playfair Display', 'Times New Roman', serif;
    font-weight: 500;
    font-size: clamp(36px, 9vw, 100px);
    line-height: 1.1;
    letter-spacing: 0.02em;
    color: var(--ink);
    white-space: nowrap;
    position: relative;
    display: grid;
    grid-template-columns: 1fr;
    justify-items: center;
    isolation: isolate;
  }
  .hero-kyle {
    display: block;
    width: 100%;
    font-family: 'Playfair Display', 'Times New Roman', serif;
    text-align: center;
    margin-bottom: 0.06em;
    position: relative;
    z-index: 1;
    font-style: normal;
    animation: kyleSweep 1.15s cubic-bezier(.22,.8,.24,1) 0.36s both;
  }
  .hero-amber {
    display: block;
    width: 100%;
    font-family: 'Playfair Display', 'Times New Roman', serif;
    text-align: center;
    margin-top: 0.02em;
    position: relative;
    z-index: 1;
    font-style: normal;
    animation: amberSweep 1.15s cubic-bezier(.22,.8,.24,1) 0.48s both;
  }
  .hero-amber .hero-amp {
    font-style: italic;
    font-weight: 400;
    color: var(--dusty-rose);
    opacity: 0.6;
    margin-right: 0.12em;
  }
  .hero-date {
    font-family: 'DM Sans', sans-serif;
    font-size: clamp(16px, 3vw, 22px);
    color: var(--sage);
    letter-spacing: 0.06em;
    font-weight: 500;
    margin-top: 24px;
    animation: heroFloatIn 1s ease 0.76s both;
  }
  @media (max-width: 480px) {
    .hero-names { line-height: 1.12; letter-spacing: 0.03em; font-size: clamp(30px, 9vw, 100px); }
    .hero-kyle { margin-bottom: 0; }
    .hero-amber { margin-top: 0; }
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
    max-width: 960px;
    margin: 0 auto;
    text-align: center;
  }
  .details-contact {
    grid-column: 1;
  }

  /* ── Photo grid ── */
  .photo-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 20px;
  }
  @media (min-width: 560px) {
    .photo-grid { grid-template-columns: repeat(2, 1fr); gap: 22px; }
  }
  @media (min-width: 1024px) {
    .photo-grid { gap: 28px; }
  }
  .photo-wide { grid-column: span 1; }
  @media (min-width: 560px) {
    .photo-wide { grid-column: span 2; }
  }

  /* ── Apple-style photo reveal ── */
  .photo-card {
    overflow: hidden;
    border-radius: 4px;
    position: relative;
    box-shadow: 0 14px 44px rgba(0,0,0,0.1);
    will-change: transform, opacity;
  }
  .photo-card img {
    width: 100%;
    height: auto;
    display: block;
    filter: contrast(1.02) saturate(0.92);
  }

  /* ── Floating RSVP button ── */
  .fab-rsvp {
    position: fixed;
    bottom: 24px;
    left: 50%;
    transform: translateX(-50%) scale(1);
    z-index: 300;
    background: rgba(16,16,16,0.92);
    color: #f5f0eb;
    border: 1px solid rgba(255,255,255,0.1);
    padding: 15px 36px;
    font-family: 'Playfair Display', serif;
    font-size: 14px;
    font-style: italic;
    font-weight: 400;
    letter-spacing: 0.12em;
    cursor: pointer;
    border-radius: 60px;
    box-shadow: 0 8px 40px rgba(0,0,0,0.25);
    transition: transform 320ms cubic-bezier(.2,.8,.2,1), box-shadow 320ms ease;
    -webkit-tap-highlight-color: transparent;
    touch-action: manipulation;
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
  }
  @media (min-width: 640px) {
    .fab-rsvp {
      bottom: 32px;
      padding: 16px 42px;
      font-size: 15px;
    }
  }
  .fab-rsvp:hover {
    transform: translateX(-50%) translateY(-2px) scale(1.04);
    box-shadow: 0 14px 52px rgba(0,0,0,0.32);
  }
  .fab-rsvp:active { transform: translateX(-50%) translateY(0) scale(0.98); }

  /* ── Glass modal ── */
  .glass-backdrop {
    position: fixed;
    inset: 0;
    z-index: 400;
    background: rgba(36,29,25,0.35);
    backdrop-filter: blur(20px) saturate(1.4);
    -webkit-backdrop-filter: blur(20px) saturate(1.4);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px;
    opacity: 0;
    transition: opacity 0.35s ease;
    pointer-events: none;
  }
  .glass-backdrop.open {
    opacity: 1;
    pointer-events: auto;
  }
  .glass-card {
    background: rgba(245,240,235,0.82);
    backdrop-filter: blur(32px) saturate(1.5);
    -webkit-backdrop-filter: blur(32px) saturate(1.5);
    border: 1px solid rgba(200,184,162,0.4);
    border-radius: 18px;
    padding: 44px 32px 40px;
    max-width: 500px;
    width: 100%;
    max-height: 90vh;
    overflow-y: auto;
    box-shadow: 0 24px 80px rgba(0,0,0,0.18), 0 0 0 1px rgba(255,255,255,0.12) inset;
    transform: translateY(24px) scale(0.96);
    transition: transform 0.4s cubic-bezier(.2,.8,.2,1), opacity 0.35s ease;
    opacity: 0;
  }
  .glass-backdrop.open .glass-card {
    transform: translateY(0) scale(1);
    opacity: 1;
  }
  .glass-close {
    position: absolute;
    top: 16px;
    right: 20px;
    background: none;
    border: none;
    font-size: 22px;
    color: #9a8878;
    cursor: pointer;
    padding: 8px;
    line-height: 1;
    transition: color 0.2s;
    -webkit-tap-highlight-color: transparent;
  }
  .glass-close:hover { color: #1a1a1a; }
  @media (min-width: 640px) {
    .glass-card { padding: 52px 44px 48px; }
  }

  /* ── Calendar dropdown ── */
  .cal-wrap {
    position: relative;
    display: inline-block;
  }
  .cal-btn {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    background: transparent;
    border: 1px solid #c8b8a2;
    padding: 10px 20px;
    font-family: 'DM Sans', sans-serif;
    font-size: 12px;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: #6b5d52;
    cursor: pointer;
    transition: background 0.2s, color 0.2s;
    -webkit-tap-highlight-color: transparent;
  }
  .cal-btn:hover { background: #1a1a1a; color: #f5f0eb; border-color: #1a1a1a; }
  .cal-btn:hover svg { stroke: #f5f0eb; }
  .cal-dropdown {
    position: absolute;
    top: calc(100% + 6px);
    left: 50%;
    transform: translateX(-50%) translateY(-4px);
    background: rgba(245,240,235,0.97);
    backdrop-filter: blur(16px);
    -webkit-backdrop-filter: blur(16px);
    border: 1px solid #d4c5b0;
    border-radius: 8px;
    padding: 6px 0;
    min-width: 180px;
    box-shadow: 0 8px 32px rgba(0,0,0,0.12);
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.2s, transform 0.2s;
    z-index: 10;
  }
  .cal-dropdown.open {
    opacity: 1;
    pointer-events: auto;
    transform: translateX(-50%) translateY(0);
  }
  .cal-dropdown a {
    display: block;
    padding: 10px 18px;
    font-family: 'DM Sans', sans-serif;
    font-size: 13px;
    color: #3a3a3a;
    text-decoration: none;
    transition: background 0.15s;
  }
  .cal-dropdown a:hover { background: rgba(200,184,162,0.2); }

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

  /* ── Loading spinner ── */
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
  .btn-spinner {
    display: inline-block;
    width: 14px;
    height: 14px;
    border: 2px solid rgba(245,240,235,0.3);
    border-top-color: #f5f0eb;
    border-radius: 50%;
    animation: spin 0.6s linear infinite;
    vertical-align: middle;
    margin-right: 8px;
  }

  /* ── Checkmark draw animation ── */
  @keyframes drawCheck {
    from { stroke-dashoffset: 36; }
    to   { stroke-dashoffset: 0; }
  }
  @keyframes scaleIn {
    from { transform: scale(0.7); opacity: 0; }
    to   { transform: scale(1); opacity: 1; }
  }
  .success-circle {
    width: 64px;
    height: 64px;
    border-radius: 50%;
    border: 1.5px solid #7d8b77;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 24px;
    animation: scaleIn 0.5s cubic-bezier(.2,.8,.2,1) both;
  }
  .success-check {
    stroke-dasharray: 36;
    stroke-dashoffset: 36;
    animation: drawCheck 0.5s ease 0.3s forwards;
  }

  /* ── Form error state ── */
  .error-msg {
    font-family: 'DM Sans', sans-serif;
    font-size: 12px;
    color: #c0564f;
    margin-top: 6px;
  }

  /* ── Honeypot ── */
  .honeypot {
    position: absolute;
    left: -9999px;
    opacity: 0;
    height: 0;
    overflow: hidden;
  }

  /* ── Lightbox ── */
  .lightbox-backdrop {
    position: fixed;
    inset: 0;
    z-index: 500;
    background: rgba(0,0,0,0.92);
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0;
    transition: opacity 0.3s ease;
    pointer-events: none;
  }
  .lightbox-backdrop.open {
    opacity: 1;
    pointer-events: auto;
  }
  .lightbox-img {
    max-width: 90vw;
    max-height: 85vh;
    object-fit: contain;
    border-radius: 4px;
    transform: scale(0.95);
    transition: transform 0.35s cubic-bezier(.2,.8,.2,1);
  }
  .lightbox-backdrop.open .lightbox-img {
    transform: scale(1);
  }
  .lightbox-btn {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    background: rgba(255,255,255,0.1);
    border: 1px solid rgba(255,255,255,0.15);
    color: #f5f0eb;
    width: 48px;
    height: 48px;
    border-radius: 50%;
    font-size: 20px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background 0.2s;
    backdrop-filter: blur(8px);
    -webkit-backdrop-filter: blur(8px);
    -webkit-tap-highlight-color: transparent;
  }
  .lightbox-btn:hover { background: rgba(255,255,255,0.2); }
  .lightbox-prev { left: 16px; }
  .lightbox-next { right: 16px; }
  .lightbox-close {
    position: absolute;
    top: 16px;
    right: 20px;
    background: none;
    border: none;
    color: rgba(255,255,255,0.7);
    font-size: 28px;
    cursor: pointer;
    padding: 8px;
    transition: color 0.2s;
    -webkit-tap-highlight-color: transparent;
  }
  .lightbox-close:hover { color: #fff; }
  .lightbox-counter {
    position: absolute;
    bottom: 20px;
    left: 50%;
    transform: translateX(-50%);
    font-family: 'DM Sans', sans-serif;
    font-size: 12px;
    color: rgba(255,255,255,0.5);
    letter-spacing: 0.1em;
  }
  @media (max-width: 640px) {
    .lightbox-img { max-width: 72vw; }
    .lightbox-btn { width: 36px; height: 36px; font-size: 16px; z-index: 2; }
    .lightbox-prev { left: 6px; }
    .lightbox-next { right: 6px; }
    .cal-row { justify-content: center; }
  }

  /* ── FAQ ── */
  .faq-section {
    max-width: 680px;
    margin: 0 auto;
    padding: 80px 20px 100px;
  }
  @media (min-width: 640px) {
    .faq-section { padding: 100px 40px 120px; }
  }
  .faq-item {
    border-top: 1px solid #d4c5b0;
    padding: 28px 0;
  }
  .faq-q {
    font-family: 'Playfair Display', serif;
    font-size: clamp(18px, 3vw, 22px);
    font-weight: 400;
    color: #1a1a1a;
    margin-bottom: 12px;
  }
  .faq-a {
    font-family: 'DM Sans', sans-serif;
    font-size: 15px;
    color: #6b5d52;
    line-height: 1.7;
  }
  .faq-a a {
    color: var(--dusty-rose);
    text-decoration: underline;
    text-underline-offset: 3px;
  }
  .faq-a a:hover { color: #1a1a1a; }

  /* ── Focus visible ── */
  :focus-visible {
    outline: 2px solid var(--dusty-rose);
    outline-offset: 3px;
  }
  .glass-close:focus-visible,
  .lightbox-close:focus-visible,
  .lightbox-btn:focus-visible {
    outline: 2px solid #f5f0eb;
    outline-offset: 2px;
  }
  .fab-rsvp:focus-visible {
    outline: 2px solid #f5f0eb;
    outline-offset: 4px;
  }
  .goldBtn:focus-visible {
    outline: 2px solid #f5f0eb;
    outline-offset: 3px;
  }
  .photo-card:focus-visible {
    outline: 2px solid var(--dusty-rose);
    outline-offset: 4px;
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
function NavBar({ scrollY, onRsvpClick }) {
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
        {/* Desktop links */}
        <div className="nav-links">
          {["Details", "Gallery", "FAQ"].map((s) => (
            <a key={s} href={`#${s.toLowerCase()}`} style={link}>{s}</a>
          ))}
          <a key="Registry" href="https://www.target.com/gift-registry/gift-giver?registryId=3db2c510-174e-11f1-8c28-17903ce32dc5&type=WEDDING" target="_blank" rel="noopener noreferrer" style={link}>Registry</a>
          <a key="RSVP" href="#" onClick={(e) => { e.preventDefault(); onRsvpClick(); }} style={link}>RSVP</a>
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
        {["Details", "Gallery", "FAQ"].map((s, i) => (
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
        <a
          key="Registry"
          href="https://www.target.com/gift-registry/gift-giver?registryId=3db2c510-174e-11f1-8c28-17903ce32dc5&type=WEDDING"
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => setMenuOpen(false)}
          style={{
            opacity: menuOpen ? 1 : 0,
            transform: menuOpen ? "translateY(0)" : "translateY(14px)",
            transition: `opacity 0.35s ease ${0.08 + 3 * 0.07}s, transform 0.35s ease ${0.08 + 3 * 0.07}s`,
          }}
        >
          Registry
        </a>
        <a
          key="RSVP"
          href="#"
          onClick={(e) => { e.preventDefault(); setMenuOpen(false); onRsvpClick(); }}
          style={{
            opacity: menuOpen ? 1 : 0,
            transform: menuOpen ? "translateY(0)" : "translateY(14px)",
            transition: `opacity 0.35s ease ${0.08 + 4 * 0.07}s, transform 0.35s ease ${0.08 + 4 * 0.07}s`,
          }}
        >
          RSVP
        </a>
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
   PHOTO CARD  (Apple-style scroll reveal with parallax)
══════════════════════════════════════════════════════════════════ */
function PhotoCard({ photo, index, onClick }) {
  const cardRef = useRef(null);
  const [style, setStyle] = useState({ opacity: 0, transform: "scale(1.08) translateY(40px)" });

  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;

    const update = () => {
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;
      // progress: 0 = just entering bottom, 1 = fully in view
      const progress = Math.min(Math.max((vh - rect.top) / (vh * 0.6), 0), 1);
      // ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);

      const scale = 1.08 - 0.08 * eased;
      const translateY = 40 * (1 - eased);
      const opacity = eased;

      // parallax offset for images
      const center = rect.top + rect.height / 2 - vh / 2;
      const parallax = center * 0.08;

      setStyle({
        opacity,
        transform: `scale(${scale}) translateY(${translateY}px)`,
        parallax,
      });
    };

    window.addEventListener("scroll", update, { passive: true });
    update();
    return () => window.removeEventListener("scroll", update);
  }, []);

  const isWide = !!photo.wide;

  return (
    <figure
      ref={cardRef}
      className={`photo-card${isWide ? " photo-wide" : ""}`}
      style={{
        opacity: style.opacity,
        transform: style.transform,
        transition: "transform 0.05s linear, opacity 0.05s linear",
        cursor: onClick ? "pointer" : "default",
      }}
      onClick={onClick}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onClick(); } } : undefined}
    >
      <img
        src={photo.src}
        alt={`Wedding photo ${index + 1}`}
        loading="lazy"
      />
      {/* Bottom vignette */}
      <div style={{
        position: "absolute",
        inset: 0,
        background: "linear-gradient(to top, rgba(0,0,0,0.18) 0%, transparent 40%)",
        pointerEvents: "none",
      }} />
    </figure>
  );
}

/* ══════════════════════════════════════════════════════════════════
   RSVP MODAL  (Netlify — glass blur overlay)
══════════════════════════════════════════════════════════════════ */
function RSVPModal({ open, onClose }) {
  const [form, setForm] = useState({ name: "", guests: "1", attending: "yes", note: "", guestNames: [] });
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const firstInputRef = useRef(null);

  // Lock body scroll while open + autofocus
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    if (open && firstInputRef.current) {
      setTimeout(() => firstInputRef.current.focus(), 400);
    }
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  const set = (k) => (e) => {
    const val = e.target.value;
    setForm((f) => {
      const next = { ...f, [k]: val };
      if (k === "guests") {
        const count = parseInt(val, 10) || 1;
        const names = [...(f.guestNames || [])];
        while (names.length < count - 1) names.push("");
        next.guestNames = names.slice(0, count - 1);
      }
      return next;
    });
    if (errors[k]) setErrors((prev) => ({ ...prev, [k]: false }));
  };

  const setGuestName = (idx) => (e) => {
    const val = e.target.value;
    setForm((f) => {
      const names = [...(f.guestNames || [])];
      names[idx] = val;
      return { ...f, guestNames: names };
    });
    if (errors[`guest-${idx}`]) setErrors((prev) => ({ ...prev, [`guest-${idx}`]: false }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = true;
    if (form.attending === "yes") {
      (form.guestNames || []).forEach((n, i) => {
        if (!n.trim()) newErrors[`guest-${i}`] = true;
      });
    }
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    setLoading(true);
    const data = {
      "form-name": "rsvp",
      name: form.name,
      attending: form.attending,
      guests: form.attending === "yes" ? form.guests : "0",
      note: form.note,
    };
    if (form.attending === "yes") {
      (form.guestNames || []).forEach((n, i) => {
        data[`guest-name-${i + 2}`] = n;
      });
    }
    fetch("/", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams(data).toString(),
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
    transition: "border-color 0.2s",
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
    <div
      className={`glass-backdrop${open ? " open" : ""}`}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="rsvp-title"
    >
      <div className="glass-card" style={{ position: "relative" }}>
        <button className="glass-close" onClick={onClose} aria-label="Close RSVP">&times;</button>

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

        <h2 id="rsvp-title" style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: "clamp(30px, 7vw, 44px)",
          fontWeight: 400,
          lineHeight: 1.05,
          color: "#1a1a1a",
          marginBottom: "36px",
        }}>
          Will you join us?
        </h2>

        {sent ? (
          <div style={{ textAlign: "center", padding: "32px 0 10px" }}>
            <div className="success-circle">
              <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                <path
                  className="success-check"
                  d="M6 14.5L11.5 20L22 8"
                  stroke="#7d8b77"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
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
            data-netlify-honeypot="bot-field"
            onSubmit={handleSubmit}
            style={{ display: "flex", flexDirection: "column", gap: "28px" }}
          >
            <input type="hidden" name="form-name" value="rsvp" />
            <div className="honeypot" aria-hidden="true">
              <label>Don&apos;t fill this out if you&apos;re human
                <input name="bot-field" tabIndex={-1} autoComplete="off" />
              </label>
            </div>

            {/* Name */}
            <div>
              <label htmlFor="rsvp-name" style={labelStyle}>Full Name</label>
              <input
                id="rsvp-name"
                ref={firstInputRef}
                name="name"
                style={{ ...inputBase, ...(errors.name ? { borderBottomColor: "#c0564f" } : {}) }}
                placeholder="Your name"
                value={form.name}
                onChange={set("name")}
                required
                autoComplete="name"
              />
              {errors.name && <p className="error-msg">Please enter your name</p>}
            </div>

            {/* Attending */}
            <fieldset style={{ border: "none", padding: 0, margin: 0 }}>
              <legend style={labelStyle}>Attending</legend>
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
                      style={{ position: "absolute", opacity: 0, width: 0, height: 0 }}
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
            </fieldset>

            {/* Guest count + dynamic names */}
            {form.attending === "yes" && (
              <>
                <div>
                  <label htmlFor="rsvp-guests" style={labelStyle}>Number of Guests</label>
                  <select
                    id="rsvp-guests"
                    name="guests"
                    style={{ ...inputBase, cursor: "pointer", paddingRight: "20px" }}
                    value={form.guests}
                    onChange={set("guests")}
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                      <option key={n} value={n}>{n}</option>
                    ))}
                  </select>
                </div>

                {(form.guestNames || []).map((gn, i) => (
                  <div key={i}>
                    <label htmlFor={`rsvp-guest-${i + 2}`} style={labelStyle}>Guest {i + 2} Name</label>
                    <input
                      id={`rsvp-guest-${i + 2}`}
                      name={`guest-name-${i + 2}`}
                      style={{ ...inputBase, ...(errors[`guest-${i}`] ? { borderBottomColor: "#c0564f" } : {}) }}
                      placeholder={`Guest ${i + 2} name`}
                      value={gn}
                      onChange={setGuestName(i)}
                      autoComplete="name"
                    />
                    {errors[`guest-${i}`] && <p className="error-msg">Please enter this guest&apos;s name</p>}
                  </div>
                ))}
              </>
            )}

            {/* Note */}
            <div>
              <label htmlFor="rsvp-note" style={labelStyle}>A Note for the Couple</label>
              <textarea
                id="rsvp-note"
                name="note"
                style={{ ...inputBase, resize: "none", height: "76px" }}
                placeholder="Optional message…"
                value={form.note}
                onChange={set("note")}
              />
            </div>

            <div>
              <button type="submit" className="goldBtn" disabled={loading}>
                {loading ? <><span className="btn-spinner" />Sending…</> : "Send RSVP"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════
   ADD TO CALENDAR
══════════════════════════════════════════════════════════════════ */
const CAL_EVENT = {
  title: "Kyle & Amber's Wedding",
  start: "20260606T190000Z", // June 6 2026 noon PDT = 19:00 UTC
  end:   "20260606T230000Z", // ~4 PM PDT = 23:00 UTC
  location: "Capital Christian Center, 4431 Martin Way E, Olympia, WA 98516",
  description: "Wedding ceremony of Kyle Hollenbaugh & Amber Rivera. Arrive by 11:00 AM, seated by 11:30 AM. Ceremony begins at noon.",
};

function AddToCalendar() {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    const close = (e) => { if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false); };
    document.addEventListener("click", close);
    return () => document.removeEventListener("click", close);
  }, [open]);

  const googleUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(CAL_EVENT.title)}&dates=${CAL_EVENT.start}/${CAL_EVENT.end}&location=${encodeURIComponent(CAL_EVENT.location)}&details=${encodeURIComponent(CAL_EVENT.description)}`;

  const icsContent = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "BEGIN:VEVENT",
    `DTSTART:${CAL_EVENT.start}`,
    `DTEND:${CAL_EVENT.end}`,
    `SUMMARY:${CAL_EVENT.title}`,
    `LOCATION:${CAL_EVENT.location}`,
    `DESCRIPTION:${CAL_EVENT.description}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");

  const downloadIcs = (e) => {
    e.preventDefault();
    const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "kyle-amber-wedding.ics";
    a.click();
    URL.revokeObjectURL(url);
    setOpen(false);
  };

  return (
    <div className="cal-wrap" ref={wrapRef}>
      <button
        className="cal-btn"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-haspopup="true"
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="#6b5d52" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="1" y="2.5" width="12" height="10" rx="1.5" />
          <line x1="4" y1="1" x2="4" y2="4" />
          <line x1="10" y1="1" x2="10" y2="4" />
          <line x1="1" y1="6" x2="13" y2="6" />
        </svg>
        Add to Calendar
      </button>
      <div className={`cal-dropdown${open ? " open" : ""}`}>
        <a href={googleUrl} target="_blank" rel="noopener noreferrer" onClick={() => setOpen(false)}>Google Calendar</a>
        <a href="#" onClick={downloadIcs}>Apple Calendar</a>
        <a href="#" onClick={downloadIcs}>Outlook</a>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════
   LIGHTBOX
══════════════════════════════════════════════════════════════════ */
function Lightbox({ photos, index, onClose, onPrev, onNext }) {
  const isOpen = index !== null && index !== undefined;
  const touchStart = useRef(null);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowLeft") onPrev();
      else if (e.key === "ArrowRight") onNext();
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose, onPrev, onNext]);

  const onTouchStart = (e) => { touchStart.current = e.touches[0].clientX; };
  const onTouchEnd = (e) => {
    if (touchStart.current === null) return;
    const diff = e.changedTouches[0].clientX - touchStart.current;
    if (Math.abs(diff) > 50) { diff > 0 ? onPrev() : onNext(); }
    touchStart.current = null;
  };

  return (
    <div
      className={`lightbox-backdrop${isOpen ? " open" : ""}`}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
      aria-hidden={!isOpen}
    >
      <button className="lightbox-close" onClick={onClose} aria-label="Close gallery">&times;</button>
      {isOpen && (
        <>
          <button className="lightbox-btn lightbox-prev" onClick={onPrev} aria-label="Previous photo">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M10 3L5 8L10 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </button>
          <img
            className="lightbox-img"
            src={photos[index].src}
            alt={`Wedding photo ${index + 1} of ${photos.length}`}
          />
          <button className="lightbox-btn lightbox-next" onClick={onNext} aria-label="Next photo">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M6 3L11 8L6 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </button>
          <p className="lightbox-counter">{index + 1} / {photos.length}</p>
        </>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════
   MAIN
══════════════════════════════════════════════════════════════════ */
export default function WeddingSite() {
  const scrollY = useSmoothScrollY();
  const [detailsRef, detailsVisible] = useInView(0.08);
  const [galleryHeaderRef, galleryHeaderVisible] = useInView(0.1);
  const [rsvpOpen, setRsvpOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(null);
  const [faqRef, faqVisible] = useInView(0.08);
  const footerRef = useRef(null);
  const [fabHidden, setFabHidden] = useState(false);

  // Hide FAB when footer is in view
  useEffect(() => {
    const el = footerRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => setFabHidden(e.isIntersecting),
      { threshold: 0.1 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);


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
      <NavBar scrollY={scrollY} onRsvpClick={() => setRsvpOpen(true)} />

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
            fontFamily: "'Playfair Display', serif",
            fontSize: "13px",
            letterSpacing: "0.12em",
            textTransform: "none",
            fontStyle: "italic",
            color: "#9f8a7a",
            opacity: 0.7,
            marginBottom: "20px",
            animation: "fadeUp 1s ease 0.2s both",
          }}>
            Join
          </p>

          <h1 className="hero-names">
            <em className="hero-kyle">Kyle Hollenbaugh</em>
            <em className="hero-amber"><span className="hero-amp">&amp;</span> Amber Rivera</em>
          </h1>

          <div style={{
            width: "44px",
            height: "1px",
            background: "#c8b8a2",
            margin: "24px auto",
          }} />

          <p className="hero-date">
            June 6th, 2026
          </p>
          <p style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: "12px",
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: "#9f8a7a",
            opacity: 0.65,
            marginTop: "10px",
            animation: "fadeUp 1s ease 0.6s both",
          }}>
            Ceremony begins at noon
          </p>
        </div>

        {/* Scroll cue */}
        <div style={{
          position: "absolute",
          bottom: "48px",
          left: "50%",
          transform: "translateX(-50%)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "10px",
          pointerEvents: "none",
          animation: "scrollFade 2.8s ease infinite",
        }}>
          <p style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: "9px",
            letterSpacing: "0.28em",
            textTransform: "uppercase",
            color: "#9a8878",
          }}>
            Scroll
          </p>
          <div style={{
            width: "1px",
            height: "36px",
            background: "linear-gradient(to bottom, #9a8878, transparent)",
          }} />
          <svg width="12" height="8" viewBox="0 0 12 8" fill="none" style={{ opacity: 0.7 }}>
            <path d="M1 1L6 6L11 1" stroke="#9a8878" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </section>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  DETAILS */}
      <section id="details" style={{ padding: "80px 20px 60px" }}>
        <div
          ref={detailsRef}
          className={`details-grid reveal${detailsVisible ? " in" : ""}`}
        >
          {/* Ceremony — centered */}
          <div style={{
            borderTop: "1px solid #d4c5b0",
            paddingTop: "26px",
            paddingBottom: "40px",
          }}>
            <p style={detail}>Ceremony</p>
            <p style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "clamp(20px, 3vw, 24px)",
              color: "#1a1a1a",
              fontWeight: 400,
              lineHeight: 1.5,
            }}>June 6th, 2026 — Noon</p>
            <p style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "clamp(16px, 2.5vw, 19px)",
              color: "#6b5d52",
              fontWeight: 400,
            }}>Capital Christian Center</p>
            <a
              href="https://maps.google.com/?q=Capital+Christian+Center,+4431+Martin+Way+E,+Olympia,+WA+98516"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "15px",
                color: "#9a8878",
                fontWeight: 400,
                textDecoration: "none",
                borderBottom: "1px solid rgba(154,136,120,0.35)",
                paddingBottom: "1px",
                transition: "color 0.2s",
                display: "inline-block",
              }}
            >4431 Martin Way E, Olympia, WA 98516</a>
            <p style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "13px",
              color: "#9a8878",
              fontWeight: 400,
              fontStyle: "italic",
              marginTop: "14px",
              lineHeight: 1.5,
            }}>Arrive by 11:00 AM · Seated by 11:30 AM</p>
            <div className="cal-row" style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginTop: "18px", alignItems: "center" }}>
              <AddToCalendar />
              <a
                href="https://maps.google.com/?q=Capital+Christian+Center,+4431+Martin+Way+E,+Olympia,+WA+98516"
                target="_blank"
                rel="noopener noreferrer"
                className="cal-btn"
                style={{ textDecoration: "none" }}
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="#6b5d52" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M7 1C4.5 1 2.5 3 2.5 5.5C2.5 9 7 13 7 13C7 13 11.5 9 11.5 5.5C11.5 3 9.5 1 7 1Z" />
                  <circle cx="7" cy="5.5" r="1.5" />
                </svg>
                Directions
              </a>
            </div>
          </div>

          {/* Contact — full width row on desktop, centered */}
          <div className="details-contact" style={{
            borderTop: "1px solid #d4c5b0",
            paddingTop: "26px",
            paddingBottom: "40px",
            paddingRight: "28px",
          }}>
            <p style={detail}>Contact</p>
            <div style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "clamp(15px, 2.2vw, 18px)",
              color: "#6b5d52",
              fontWeight: 400,
              marginTop: "6px",
              display: "flex",
              flexDirection: "column",
              gap: "6px",
            }}>
              <span>
                Kyle Hollenbaugh{" "}
                <a href="tel:+13607632293" style={{ color: "inherit", textDecoration: "none" }}>(360) 763-2293</a>
              </span>
              <span>
                Amber Rivera{" "}
                <a href="tel:+13609952926" style={{ color: "inherit", textDecoration: "none" }}>(360) 995-2926</a>
              </span>
            </div>
          </div>
        </div>
      </section>

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
            <PhotoCard key={i} photo={photo} index={i} onClick={() => setLightboxIndex(i)} />
          ))}
        </div>
      </section>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  FAQ */}
      <section id="faq" className="faq-section">
        <div
          ref={faqRef}
          className={`reveal${faqVisible ? " in" : ""}`}
        >
          <p style={{
            fontFamily: "system-ui, sans-serif",
            fontSize: "10px",
            letterSpacing: "0.26em",
            textTransform: "uppercase",
            color: "#9a8878",
            marginBottom: "10px",
          }}>Questions</p>
          <h2 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: "clamp(32px, 6vw, 52px)",
            fontWeight: 400,
            color: "#1a1a1a",
            marginBottom: "36px",
          }}>
            Need to know
          </h2>

          <div className="faq-item">
            <p className="faq-q">What is the dress code?</p>
            <p className="faq-a">
              Blue Ties — Semi-formal cocktail attire. Gentlemen are encouraged to wear blue ties.
            </p>
          </div>

          <div className="faq-item">
            <p className="faq-q">Do you have a gift registry?</p>
            <p className="faq-a">
              Your presence is the greatest gift! If you&apos;d like to honor us with something, we are registered at{" "}
              <a
                href="https://www.target.com/gift-registry/gift-giver?registryId=3db2c510-174e-11f1-8c28-17903ce32dc5&type=WEDDING"
                target="_blank"
                rel="noopener noreferrer"
              >
                Target
              </a>.
            </p>
          </div>

          <div className="faq-item" style={{ borderBottom: "1px solid #d4c5b0" }}>
            <p className="faq-q">What time should I arrive?</p>
            <p className="faq-a">
              Please arrive by 11:00 AM so you can be comfortably seated by 11:30 AM. The ceremony begins promptly at noon.
            </p>
          </div>
        </div>
      </section>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  LIGHTBOX */}
      <Lightbox
        photos={PHOTOS}
        index={lightboxIndex}
        onClose={() => setLightboxIndex(null)}
        onPrev={() => setLightboxIndex((i) => (i > 0 ? i - 1 : PHOTOS.length - 1))}
        onNext={() => setLightboxIndex((i) => (i < PHOTOS.length - 1 ? i + 1 : 0))}
      />

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  FLOATING RSVP + MODAL */}
      <button
        className="fab-rsvp"
        onClick={() => setRsvpOpen(true)}
        aria-label="Open RSVP form"
        style={{
          opacity: fabHidden ? 0 : 1,
          pointerEvents: fabHidden ? "none" : "auto",
          transition: "opacity 0.3s ease, transform 320ms cubic-bezier(.2,.8,.2,1), box-shadow 320ms ease",
        }}
      >
        RSVP
      </button>
      <RSVPModal open={rsvpOpen} onClose={() => setRsvpOpen(false)} />

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  FOOTER */}
      <footer ref={footerRef} style={{
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
          June 6th, 2026 · Capital Christian Center, Olympia, WA
        </p>
      </footer>
    </div>
  );
}
