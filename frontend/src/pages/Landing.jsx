import LandingHeader from "../components/LandingHeader.jsx";
import { useEffect, useRef, useState } from "react";

// At the top of Landing.jsx, replace the const paths with imports:
import imgHome from "../assets/images/home.png";
import imgDetail from "../assets/images/detail.png";
import imgCreate from "../assets/images/create.png";
import imgFeedback from "../assets/images/feedback.png";

// ─── Inline styles as a style tag ───────────────────────────────────────────
const css = `
  @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=DM+Sans:wght@300;400;500;600&family=Space+Mono:wght@400;700&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --black: #0a0a0a;
    --white: #fafafa;
    --gray: #6b6b6b;
    --light-gray: #e8e8e8;
    --accent-purple: #d966f5;
    --accent-orange: #f5813e;
    --accent-green: #4ade80;
    --accent-blue: #3b82f6;
    --accent-red: #ef4444;
    --accent-amber: #f59e0b;
  }

  html { scroll-behavior: smooth; }

  body {
    background: var(--white);
    color: var(--black);
    font-family: 'DM Sans', sans-serif;
    overflow-x: hidden;
  }

  /* ── HERO ─────────────────────────────────────────────────────────── */
  .hero {
    min-height: 100vh;
    display: grid;
    grid-template-columns: 1fr 1fr;
    position: relative;
    overflow: hidden;
  }

  .hero::before {
    content: '';
    position: absolute;
    inset: 0;
    background:
      radial-gradient(ellipse 60% 60% at 70% 40%, rgba(217,102,245,0.12) 0%, transparent 70%),
      radial-gradient(ellipse 40% 40% at 20% 80%, rgba(74,222,128,0.10) 0%, transparent 60%);
    pointer-events: none;
  }

  .hero-left {
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 120px 60px 80px 80px;
    position: relative;
    z-index: 2;
  }

  .hero-eyebrow {
    font-family: 'Space Mono', monospace;
    font-size: 11px;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: var(--gray);
    margin-bottom: 28px;
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .hero-eyebrow::before {
    content: '';
    display: block;
    width: 32px;
    height: 1px;
    background: var(--gray);
  }

  .hero-title {
    font-family: 'Instrument Serif', serif;
    font-size: clamp(52px, 6vw, 88px);
    line-height: 0.95;
    letter-spacing: -0.02em;
    color: var(--black);
    margin-bottom: 32px;
  }

  .hero-title em {
    font-style: italic;
    color: var(--accent-purple);
  }

  .hero-subtitle {
    font-size: 17px;
    line-height: 1.7;
    color: var(--gray);
    max-width: 420px;
    margin-bottom: 52px;
    font-weight: 300;
  }

  .hero-cta-group {
    display: flex;
    align-items: center;
    gap: 20px;
    flex-wrap: wrap;
  }

  .btn-primary {
    background: var(--black);
    color: var(--white);
    font-family: 'DM Sans', sans-serif;
    font-size: 15px;
    font-weight: 500;
    padding: 16px 36px;
    border: 2px solid var(--black);
    border-radius: 100px;
    cursor: pointer;
    text-decoration: none;
    display: inline-flex;
    align-items: center;
    gap: 8px;
    transition: all 0.25s ease;
    letter-spacing: 0.01em;
  }

  .btn-primary:hover {
    background: var(--white);
    color: var(--black);
    transform: translateY(-2px);
    box-shadow: 0 12px 40px rgba(0,0,0,0.15);
  }

  .btn-secondary {
    font-family: 'Space Mono', monospace;
    font-size: 12px;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: var(--gray);
    text-decoration: none;
    display: inline-flex;
    align-items: center;
    gap: 8px;
    transition: color 0.2s;
  }

  .btn-secondary:hover { color: var(--black); }

  .hero-stats {
    display: flex;
    gap: 40px;
    margin-top: 60px;
    padding-top: 40px;
    border-top: 1px solid var(--light-gray);
  }

  .hero-stat-num {
    font-family: 'Instrument Serif', serif;
    font-size: 36px;
    line-height: 1;
    color: var(--black);
  }

  .hero-stat-label {
    font-size: 12px;
    color: var(--gray);
    margin-top: 4px;
    font-weight: 300;
  }

  /* ── HERO RIGHT: floating mockup ──────────────────────────────────── */
  .hero-right {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 80px 40px 80px 0;
    z-index: 2;
  }

  .mockup-shell {
    position: relative;
    width: 100%;
    max-width: 560px;
  }

  .mockup-card {
    background: var(--white);
    border-radius: 20px;
    box-shadow: 0 24px 80px rgba(0,0,0,0.14), 0 4px 16px rgba(0,0,0,0.06);
    overflow: hidden;
    transform: perspective(1200px) rotateY(-6deg) rotateX(2deg);
    transition: transform 0.5s ease;
    border: 1px solid rgba(0,0,0,0.07);
  }

  .mockup-card:hover {
    transform: perspective(1200px) rotateY(-2deg) rotateX(1deg);
  }

  .mockup-card img {
    width: 100%;
    display: block;
  }

  .floating-badge {
    position: absolute;
    background: var(--white);
    border-radius: 16px;
    box-shadow: 0 8px 32px rgba(0,0,0,0.12);
    padding: 14px 20px;
    display: flex;
    align-items: center;
    gap: 12px;
    border: 1px solid var(--light-gray);
    animation: float 4s ease-in-out infinite;
    font-family: 'DM Sans', sans-serif;
  }

  .badge-1 {
    top: 5%;
    right: -5%;
    animation-delay: 0s;
  }

  .badge-2 {
    bottom: 12%;
    left: -8%;
    animation-delay: 1.5s;
  }

  .badge-dot {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background: var(--accent-green);
    flex-shrink: 0;
  }

  .badge-dot.orange { background: var(--accent-orange); }

  .badge-text-main {
    font-size: 14px;
    font-weight: 600;
    color: var(--black);
    white-space: nowrap;
  }

  .badge-text-sub {
    font-size: 11px;
    color: var(--gray);
    white-space: nowrap;
  }

  @keyframes float {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-10px); }
  }

  /* ── MARQUEE ──────────────────────────────────────────────────────── */
  .marquee-strip {
    background: var(--black);
    padding: 18px 0;
    overflow: hidden;
    position: relative;
  }

  .marquee-track {
    display: flex;
    gap: 48px;
    width: max-content;
    animation: marquee 20s linear infinite;
  }

  .marquee-item {
    font-family: 'Space Mono', monospace;
    font-size: 12px;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    color: rgba(255,255,255,0.5);
    white-space: nowrap;
    display: flex;
    align-items: center;
    gap: 20px;
  }

  .marquee-dot {
    width: 5px;
    height: 5px;
    border-radius: 50%;
    background: var(--accent-purple);
    display: inline-block;
    flex-shrink: 0;
  }

  @keyframes marquee {
    from { transform: translateX(0); }
    to { transform: translateX(-50%); }
  }

  /* ── FEATURES SECTION ─────────────────────────────────────────────── */
  .section {
    padding: 120px 80px;
  }

  .section-label {
    font-family: 'Space Mono', monospace;
    font-size: 10px;
    letter-spacing: 0.25em;
    text-transform: uppercase;
    color: var(--gray);
    margin-bottom: 20px;
  }

  .section-title {
    font-family: 'Instrument Serif', serif;
    font-size: clamp(38px, 4vw, 60px);
    line-height: 1.05;
    letter-spacing: -0.02em;
    color: var(--black);
    max-width: 600px;
    margin-bottom: 80px;
  }

  .section-title em {
    font-style: italic;
    color: var(--accent-purple);
  }

  /* Feature grid */
  .features-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 2px;
    background: var(--light-gray);
    border: 2px solid var(--light-gray);
    border-radius: 24px;
    overflow: hidden;
  }

  .feature-cell {
    background: var(--white);
    padding: 44px 40px;
    position: relative;
    transition: background 0.25s;
    cursor: default;
  }

  .feature-cell:hover {
    background: var(--black);
  }

  .feature-cell:hover .feature-title,
  .feature-cell:hover .feature-desc,
  .feature-cell:hover .feature-num { color: var(--white); }

  .feature-cell:hover .feature-icon-bg { background: rgba(255,255,255,0.08); }

  .feature-num {
    font-family: 'Space Mono', monospace;
    font-size: 11px;
    color: var(--light-gray);
    margin-bottom: 32px;
    transition: color 0.25s;
  }

  .feature-icon-bg {
    width: 52px;
    height: 52px;
    border-radius: 14px;
    background: var(--light-gray);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 24px;
    margin-bottom: 24px;
    transition: background 0.25s;
  }

  .feature-title {
    font-family: 'Instrument Serif', serif;
    font-size: 24px;
    line-height: 1.2;
    color: var(--black);
    margin-bottom: 12px;
    transition: color 0.25s;
  }

  .feature-desc {
    font-size: 14px;
    line-height: 1.65;
    color: var(--gray);
    font-weight: 300;
    transition: color 0.25s;
  }

  /* ── SHOWCASE SECTION ─────────────────────────────────────────────── */
  .showcase-section {
    padding: 0 80px 120px;
  }

  .showcase-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 60px;
    align-items: center;
  }

  .showcase-grid.reverse { direction: rtl; }
  .showcase-grid.reverse > * { direction: ltr; }

  .showcase-img-wrap {
    position: relative;
  }

  .showcase-img-card {
    border-radius: 20px;
    overflow: hidden;
    box-shadow: 0 20px 60px rgba(0,0,0,0.12);
    border: 1px solid rgba(0,0,0,0.06);
  }

  .showcase-img-card img { width: 100%; display: block; }

  .showcase-accent {
    position: absolute;
    width: 120px;
    height: 120px;
    border-radius: 50%;
    opacity: 0.15;
    z-index: -1;
  }

  .accent-purple { background: var(--accent-purple); top: -30px; left: -30px; }
  .accent-orange { background: var(--accent-orange); bottom: -20px; right: -20px; }
  .accent-green  { background: var(--accent-green);  bottom: -20px; left: -20px; }

  .showcase-text { padding: 20px 0; }

  .showcase-tag {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    background: var(--black);
    color: var(--white);
    font-family: 'Space Mono', monospace;
    font-size: 10px;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    padding: 6px 14px;
    border-radius: 100px;
    margin-bottom: 24px;
  }

  .showcase-heading {
    font-family: 'Instrument Serif', serif;
    font-size: clamp(28px, 3vw, 44px);
    line-height: 1.1;
    letter-spacing: -0.02em;
    color: var(--black);
    margin-bottom: 20px;
  }

  .showcase-heading em {
    font-style: italic;
    color: var(--accent-orange);
  }

  .showcase-body {
    font-size: 16px;
    line-height: 1.75;
    color: var(--gray);
    font-weight: 300;
    margin-bottom: 32px;
  }

  .showcase-pills {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
  }

  .pill {
    border: 1.5px solid var(--light-gray);
    border-radius: 100px;
    padding: 8px 16px;
    font-size: 13px;
    color: var(--black);
    font-weight: 500;
    display: flex;
    align-items: center;
    gap: 6px;
  }

  /* ── STATS BAND ───────────────────────────────────────────────────── */
  .stats-band {
    background: var(--black);
    padding: 80px;
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 2px;
  }

  .stat-block {
    padding: 40px;
    border-right: 1px solid rgba(255,255,255,0.08);
  }

  .stat-block:last-child { border-right: none; }

  .stat-big {
    font-family: 'Instrument Serif', serif;
    font-size: clamp(48px, 5vw, 80px);
    line-height: 1;
    color: var(--white);
    margin-bottom: 8px;
  }

  .stat-big span { color: var(--accent-purple); }

  .stat-label {
    font-size: 13px;
    color: rgba(255,255,255,0.4);
    font-weight: 300;
    line-height: 1.5;
  }

  /* ── HABIT TYPES SECTION ──────────────────────────────────────────── */
  .types-section {
    padding: 120px 80px;
    background: var(--black);
  }

  .types-section .section-label { color: rgba(255,255,255,0.3); }
  .types-section .section-title { color: var(--white); max-width: 100%; margin-bottom: 60px; }

  .types-cards {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 20px;
    margin-top: 60px;
  }

  .type-card {
    border-radius: 20px;
    padding: 44px 36px;
    position: relative;
    overflow: hidden;
  }

  .type-card-regular { background: #1a1a1a; border: 1px solid #2a2a2a; }
  .type-card-negative { background: #160a1a; border: 1px solid #2d1535; }
  .type-card-todo { background: #0a1620; border: 1px solid #0e2535; }

  .type-card-icon {
    width: 56px;
    height: 56px;
    border-radius: 14px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 26px;
    margin-bottom: 28px;
  }

  .icon-green  { background: rgba(74,222,128,0.12); }
  .icon-purple { background: rgba(217,102,245,0.12); }
  .icon-blue   { background: rgba(59,130,246,0.12); }

  .type-card-title {
    font-family: 'Instrument Serif', serif;
    font-size: 26px;
    color: var(--white);
    margin-bottom: 14px;
  }

  .type-card-desc {
    font-size: 14px;
    line-height: 1.7;
    color: rgba(255,255,255,0.45);
    font-weight: 300;
  }

  .type-card-tag {
    display: inline-block;
    margin-top: 24px;
    font-family: 'Space Mono', monospace;
    font-size: 10px;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    padding: 5px 12px;
    border-radius: 100px;
  }

  .tag-green  { background: rgba(74,222,128,0.15);  color: var(--accent-green); }
  .tag-purple { background: rgba(217,102,245,0.15); color: var(--accent-purple); }
  .tag-blue   { background: rgba(59,130,246,0.15);  color: var(--accent-blue); }

  /* ── FEEDBACK SECTION ─────────────────────────────────────────────── */
  .feedback-section {
    padding: 120px 80px;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 80px;
    align-items: center;
  }

  .feedback-img-card {
    border-radius: 20px;
    overflow: hidden;
    box-shadow: 0 20px 60px rgba(0,0,0,0.10);
    border: 1px solid var(--light-gray);
  }

  .feedback-img-card img { width: 100%; display: block; }

  /* ── CTA SECTION ──────────────────────────────────────────────────── */
  .cta-section {
    margin: 0 80px 80px;
    background: var(--black);
    border-radius: 28px;
    padding: 100px 80px;
    position: relative;
    overflow: hidden;
    text-align: center;
  }

  .cta-section::before {
    content: '';
    position: absolute;
    top: -60%;
    left: 50%;
    transform: translateX(-50%);
    width: 600px;
    height: 400px;
    background: radial-gradient(ellipse, rgba(217,102,245,0.2) 0%, transparent 70%);
    pointer-events: none;
  }

  .cta-title {
    font-family: 'Instrument Serif', serif;
    font-size: clamp(40px, 5vw, 72px);
    line-height: 1.0;
    letter-spacing: -0.02em;
    color: var(--white);
    margin-bottom: 24px;
    position: relative;
  }

  .cta-title em { font-style: italic; color: var(--accent-purple); }

  .cta-sub {
    font-size: 17px;
    color: rgba(255,255,255,0.45);
    font-weight: 300;
    margin-bottom: 48px;
    max-width: 440px;
    margin-left: auto;
    margin-right: auto;
    line-height: 1.7;
    position: relative;
  }

  .btn-white {
    background: var(--white);
    color: var(--black);
    font-family: 'DM Sans', sans-serif;
    font-size: 15px;
    font-weight: 600;
    padding: 16px 40px;
    border: none;
    border-radius: 100px;
    cursor: pointer;
    text-decoration: none;
    display: inline-flex;
    align-items: center;
    gap: 8px;
    transition: all 0.25s ease;
    position: relative;
  }

  .btn-white:hover {
    transform: translateY(-3px);
    box-shadow: 0 16px 48px rgba(255,255,255,0.15);
  }

  /* ── FOOTER ───────────────────────────────────────────────────────── */
  .footer {
    padding: 40px 80px;
    border-top: 1px solid var(--light-gray);
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .footer-brand {
    font-family: 'Instrument Serif', serif;
    font-size: 22px;
    color: var(--black);
  }

  .footer-copy {
    font-family: 'Space Mono', monospace;
    font-size: 10px;
    letter-spacing: 0.1em;
    color: var(--gray);
  }

  /* ── SCROLL ANIMATIONS ─────────────────────────────────────────────── */
  .reveal {
    opacity: 0;
    transform: translateY(30px);
    transition: opacity 0.7s ease, transform 0.7s ease;
  }

  .reveal.visible {
    opacity: 1;
    transform: translateY(0);
  }

  /* ── RESPONSIVE ─────────────────────────────────────────────────────── */
  @media (max-width: 960px) {
    .hero { grid-template-columns: 1fr; }
    .hero-right { display: none; }
    .hero-left { padding: 120px 40px 80px; }
    .section, .showcase-section { padding: 80px 40px; }
    .features-grid { grid-template-columns: 1fr 1fr; }
    .showcase-grid { grid-template-columns: 1fr; gap: 40px; }
    .showcase-grid.reverse { direction: ltr; }
    .stats-band { grid-template-columns: 1fr 1fr; padding: 60px 40px; }
    .stat-block { border-right: none; border-bottom: 1px solid rgba(255,255,255,0.08); }
    .types-cards { grid-template-columns: 1fr; }
    .types-section, .feedback-section { padding: 80px 40px; }
    .feedback-section { grid-template-columns: 1fr; }
    .cta-section { margin: 0 40px 60px; padding: 80px 40px; }
    .footer { padding: 32px 40px; }
  }

  @media (max-width: 600px) {
    .hero-left { padding: 100px 24px 60px; }
    .section, .showcase-section, .types-section { padding: 60px 24px; }
    .features-grid { grid-template-columns: 1fr; }
    .stats-band { padding: 40px 24px; }
    .cta-section { margin: 0 24px 48px; padding: 60px 24px; }
    .footer { padding: 28px 24px; flex-direction: column; gap: 12px; text-align: center; }
    .hero-stats { flex-wrap: wrap; gap: 24px; }
  }
`;

const features = [
  {
    num: "01",
    icon: "🔄",
    title: "Regular Habits",
    desc: "Build daily routines that stick. Set frequency, track streaks, and watch your consistency compound over time.",
  },
  {
    num: "02",
    icon: "🚫",
    title: "Negative Habits",
    desc: "Track what you want to quit. Mark the days you resist and watch your self-control grow visually.",
  },
  {
    num: "03",
    icon: "✅",
    title: "One-Time Todos",
    desc: "Important tasks that need doing — once. Keep them alongside your habits so nothing slips through.",
  },
  {
    num: "04",
    icon: "🔥",
    title: "Streak Tracking",
    desc: "See your current and best streaks. Every day you complete a habit, the fire grows stronger.",
  },
  {
    num: "05",
    icon: "📅",
    title: "Calendar Heatmap",
    desc: "A beautiful month-by-month view of every day you completed your habit — at a single glance.",
  },
  {
    num: "06",
    icon: "📊",
    title: "Completion Rate",
    desc: "Know exactly how consistent you've been. Your completion rate keeps you honest and motivated.",
  },
];

// We embed the screenshots as img src using the public paths
// In production these should be actual hosted image URLs.
// Here we reference them symbolically — replace with real paths.
const IMG_HOME = imgHome; // Image 1
const IMG_DETAIL = imgDetail; // Image 2
const IMG_CREATE = imgCreate; // Image 3
const IMG_FEEDBACK = imgFeedback; // Image 4

function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll(".reveal");
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) e.target.classList.add("visible");
        }),
      { threshold: 0.12 },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
}

export default function Landing() {
  useReveal();

  const marqueeItems = [
    "Build better habits",
    "Track your streaks",
    "Quit bad habits",
    "Stay consistent",
    "One-time todos",
    "See your progress",
    "Build better habits",
    "Track your streaks",
    "Quit bad habits",
    "Stay consistent",
    "One-time todos",
    "See your progress",
  ];

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: css }} />
      <LandingHeader />

      {/* ── HERO ────────────────────────────────────────────────────── */}
      <section className="hero">
        <div className="hero-left">
          <p className="hero-eyebrow">Habit Tracker · 2026</p>
          <h1 className="hero-title">
            Build habits
            <br />
            that <em>actually</em>
            <br />
            last.
          </h1>
          <p className="hero-subtitle">
            Track daily routines, break bad patterns, and crush one-time tasks —
            all in one beautifully simple dashboard.
          </p>
          <div className="hero-cta-group">
            <a href="/signup" className="btn-primary">
              Start for free →
            </a>
            <a href="#features" className="btn-secondary">
              See how it works ↓
            </a>
          </div>
          <div className="hero-stats">
            <div>
              <div className="hero-stat-num">93%</div>
              <div className="hero-stat-label">avg. completion rate</div>
            </div>
            <div>
              <div className="hero-stat-num">3</div>
              <div className="hero-stat-label">habit types</div>
            </div>
            <div>
              <div className="hero-stat-num">∞</div>
              <div className="hero-stat-label">streak potential</div>
            </div>
          </div>
        </div>

        <div className="hero-right">
          <div className="mockup-shell">
            {/* Floating badge top-right */}
            <div className="floating-badge badge-1">
              <div className="badge-dot" />
              <div>
                <div className="badge-text-main">🔥 6-day streak!</div>
                <div className="badge-text-sub">No Sugar · Keep going</div>
              </div>
            </div>

            {/* Main mockup */}
            <div className="mockup-card">
              <img src={IMG_HOME} alt="Habit Tracker Dashboard" />
            </div>

            {/* Floating badge bottom-left */}
            <div className="floating-badge badge-2">
              <div className="badge-dot orange" />
              <div>
                <div className="badge-text-main">93% completion</div>
                <div className="badge-text-sub">This month · Outstanding</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── MARQUEE ─────────────────────────────────────────────────── */}
      <div className="marquee-strip">
        <div className="marquee-track">
          {marqueeItems.map((item, i) => (
            <div className="marquee-item" key={i}>
              {item}
              <span className="marquee-dot" />
            </div>
          ))}
        </div>
      </div>

      {/* ── FEATURES ────────────────────────────────────────────────── */}
      <section className="section" id="features">
        <p className="section-label reveal">Everything you need</p>
        <h2 className="section-title reveal">
          Six ways to
          <br />
          <em>own your day</em>
        </h2>
        <div className="features-grid reveal">
          {features.map((f) => (
            <div className="feature-cell" key={f.num}>
              <div className="feature-num">{f.num}</div>
              <div className="feature-icon-bg">{f.icon}</div>
              <div className="feature-title">{f.title}</div>
              <div className="feature-desc">{f.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── SHOWCASE 1: Dashboard ───────────────────────────────────── */}
      <section className="showcase-section">
        <div className="showcase-grid">
          <div className="showcase-img-wrap reveal">
            <span className="showcase-accent accent-purple" />
            <div className="showcase-img-card">
              <img src={IMG_HOME} alt="Dashboard view" />
            </div>
          </div>
          <div className="showcase-text reveal">
            <div className="showcase-tag">✦ Home Dashboard</div>
            <h3 className="showcase-heading">
              All your habits,
              <br />
              one <em>clean</em> view.
            </h3>
            <p className="showcase-body">
              Morning, afternoon, evening — filter by time of day or see
              everything at once. Color-coded habit cards make your daily status
              impossible to miss. One tap to mark a habit done; your streak
              updates instantly.
            </p>
            <div className="showcase-pills">
              <span className="pill">🌅 Morning filter</span>
              <span className="pill">🌆 Afternoon filter</span>
              <span className="pill">🌙 Evening filter</span>
              <span className="pill">📅 Monthly calendar</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── SHOWCASE 2: Habit Detail ────────────────────────────────── */}
      <section className="showcase-section" style={{ paddingTop: 0 }}>
        <div className="showcase-grid reverse">
          <div className="showcase-img-wrap reveal">
            <span className="showcase-accent accent-orange" />
            <div className="showcase-img-card">
              <img src={IMG_DETAIL} alt="Habit detail and stats" />
            </div>
          </div>
          <div className="showcase-text reveal">
            <div className="showcase-tag">✦ Habit Analytics</div>
            <h3 className="showcase-heading">
              Deep-dive into
              <br />
              your <em style={{ color: "var(--accent-orange)" }}>progress</em>.
            </h3>
            <p className="showcase-body">
              Tap any habit to see your current streak, best streak, total
              completions, this-week count, and completion rate. A scrollable
              calendar heatmap shows you exactly which days you showed up — and
              which days you didn't.
            </p>
            <div className="showcase-pills">
              <span className="pill">🔥 Current & best streak</span>
              <span className="pill">📊 Completion rate</span>
              <span className="pill">🗓 Heatmap calendar</span>
              <span className="pill">📈 Weekly count</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS BAND ──────────────────────────────────────────────── */}
      <div className="stats-band">
        {[
          {
            big: "3",
            accent: "+",
            label: "Habit types: Regular, Negative & One-Time Todo",
          },
          {
            big: "93",
            accent: "%",
            label: "Average completion rate across all users",
          },
          {
            big: "7",
            accent: "+",
            label: "Days best streak tracked & celebrated",
          },
          {
            big: "∞",
            accent: "",
            label: "Habits you can track — no limits, no paywalls",
          },
        ].map((s, i) => (
          <div className="stat-block reveal" key={i}>
            <div className="stat-big">
              {s.big}
              <span>{s.accent}</span>
            </div>
            <div className="stat-label">{s.label}</div>
          </div>
        ))}
      </div>

      {/* ── HABIT TYPES ─────────────────────────────────────────────── */}
      <section className="types-section">
        <p className="section-label">Habit types</p>
        <h2 className="section-title">
          Three types.
          <br />
          Every goal covered.
        </h2>
        <div className="types-cards">
          <div className="type-card type-card-regular reveal">
            <div className="type-card-icon icon-green">🔄</div>
            <div className="type-card-title">Regular Habits</div>
            <div className="type-card-desc">
              For the routines you want to build. Set your target days — daily,
              3×/week, or custom — and track your consistency with streaks and a
              completion rate.
            </div>
            <span className="type-card-tag tag-green">
              Build · Repeat · Grow
            </span>
          </div>
          <div className="type-card type-card-negative reveal">
            <div className="type-card-icon icon-purple">🚫</div>
            <div className="type-card-title">Negative Habits</div>
            <div className="type-card-desc">
              For the patterns you want to break. Track the days you
              successfully avoided the habit. No sugar, no smoking, no scrolling
              — make resistance visible.
            </div>
            <span className="type-card-tag tag-purple">
              Resist · Track · Quit
            </span>
          </div>
          <div className="type-card type-card-todo reveal">
            <div className="type-card-icon icon-blue">☑️</div>
            <div className="type-card-title">One-Time Todos</div>
            <div className="type-card-desc">
              For important tasks with a due date. Collect your bank cards,
              schedule that doctor's appointment — keep it alongside your habits
              so nothing falls through.
            </div>
            <span className="type-card-tag tag-blue">Task · Date · Done</span>
          </div>
        </div>

        <div style={{ marginTop: 80, textAlign: "center" }}>
          <div
            className="showcase-img-card reveal"
            style={{
              maxWidth: 700,
              margin: "0 auto",
              borderRadius: 20,
              overflow: "hidden",
              boxShadow: "0 24px 80px rgba(0,0,0,0.3)",
            }}
          >
            <img
              src={IMG_CREATE}
              alt="Create habit modal"
              style={{ width: "100%", display: "block" }}
            />
          </div>
        </div>
      </section>

      {/* ── FEEDBACK ────────────────────────────────────────────────── */}
      <section className="feedback-section">
        <div className="reveal">
          <div className="feedback-img-card">
            <img src={IMG_FEEDBACK} alt="Feedback page" />
          </div>
        </div>
        <div className="showcase-text reveal">
          <div
            className="showcase-tag"
            style={{ background: "var(--accent-blue)", color: "white" }}
          >
            ✦ Feedback
          </div>
          <h3 className="showcase-heading">
            Built with your
            <br />
            <em style={{ color: "var(--accent-blue)" }}>voice</em> in mind.
          </h3>
          <p className="showcase-body">
            We actively listen. Submit general feedback, report a bug, request a
            feature, or just say hello. Every submission is read and shapes what
            we build next. You're not just a user — you're a co-creator.
          </p>
          <div className="showcase-pills">
            <span className="pill">💬 General feedback</span>
            <span className="pill">🐛 Bug reports</span>
            <span className="pill">🚀 Feature requests</span>
            <span className="pill">📬 Always read</span>
          </div>
        </div>
      </section>

      {/* ── CTA ─────────────────────────────────────────────────────── */}
      <div className="cta-section reveal">
        <h2 className="cta-title">
          Your best self
          <br />
          starts <em>today</em>.
        </h2>
        <p className="cta-sub">
          Free to use. No credit card. Build the habits that matter, track them
          honestly, and watch yourself change.
        </p>
        <a href="/signup" className="btn-white">
          Create your first habit →
        </a>
      </div>

      {/* ── FOOTER ──────────────────────────────────────────────────── */}
      <footer className="footer">
        <div className="footer-brand">HabitFlow</div>
        <div className="footer-copy">
          © 2026 · Built to help you show up, every day.
        </div>
      </footer>
    </>
  );
}
