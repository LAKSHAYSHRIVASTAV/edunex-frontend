import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import dashboardImg from "../assets/dashboard.png";

/* ─────────────────────────────────────────────
   DESIGN SYSTEM — midnight-ink editorial theme
   Deep navy / electric-indigo / champagne gold
   Font stack: "Syne" display + "DM Sans" body
───────────────────────────────────────────── */

const STYLE = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:ital,wght@0,300;0,400;0,500;1,300&display=swap');

  :root {
  /* 🌈 NEW BALANCED THEME (matches your UI) */

  --bg: #0f1226;
  --surface:   #161a35;         /* card background */
  --surface2:  #1c2145;         /* input / inner cards */

  --border:    rgba(255,255,255,0.08);

  /* 💜 Purple-Blue Gradient Feel */
  --indigo:    #6c63ff;         /* main brand */
  --indigo2:   #8b85ff;         /* lighter accent */

  /* ✨ Gold accent (keep premium feel) */
  --gold:      #f4d47c;
  --gold2:     #ffe7a3;

  /* 📝 Text */
  --text:      #f5f7ff;         /* softer white */
  --muted:     #a3a8c3;         /* readable grey */

  --danger:    #ff6b6b;
}

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  body {
  background: var(--bg);
  color: var(--text);
  font-family: 'DM Sans', sans-serif;
  -webkit-font-smoothing: antialiased;
}
  /* Scrollbar */
  ::-webkit-scrollbar { width: 4px; }
  ::-webkit-scrollbar-track { background: var(--bg); }
  ::-webkit-scrollbar-thumb { background: var(--indigo); border-radius: 4px; }

  /* Grain overlay */
  .grain::after {
    content: '';
    position: fixed;
    inset: 0;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E");
    pointer-events: none;
    z-index: 9999;
    opacity: 0.35;
  }

  /* Glow blob */
  .blob {
    position: absolute;
    border-radius: 50%;
    filter: blur(120px);

    pointer-events: none;
    animation: pulse 8s ease-in-out infinite alternate;
  }
  @keyframes pulse { from { opacity: 0.4; } to { opacity: 0.7; } }

  /* Marquee */
  .marquee-track { display: flex; gap: 40px; animation: marquee 28s linear infinite; }
  @keyframes marquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }

  /* Glow button */
  .btn-glow {
    background: linear-gradient(135deg, var(--indigo), #7c3aed);
    color: #fff;
    border: none;
    cursor: pointer;
    font-family: 'Syne', sans-serif;
    font-weight: 700;
    letter-spacing: 0.02em;
    position: relative;
    overflow: hidden;
    transition: box-shadow 0.3s;
  }
  .btn-glow::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, #818cf8, #a78bfa);
    opacity: 0;
    transition: opacity 0.3s;
  }
  .btn-glow:hover::before { opacity: 1; }
  .btn-glow:hover { box-shadow: 0 0 40px rgba(91,94,244,0.55); }

  /* Ghost button */
  .btn-ghost {
    background: transparent;
    border: 1px solid var(--border);
    color: var(--muted);
    cursor: pointer;
    font-family: 'DM Sans', sans-serif;
    transition: border-color 0.2s, color 0.2s;
  }
  .btn-ghost:hover { border-color: var(--indigo2); color: var(--text); }

  /* Card */
  .card {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 20px;
    transition: border-color 0.3s, transform 0.3s, box-shadow 0.3s;
  }
  .card:hover {
    border-color: rgba(91,94,244,0.4);
    transform: translateY(-4px);
    box-shadow: 0 20px 60px rgba(0,0,0,0.4);
  }

  /* Feature icon ring */
  .icon-ring {
    width: 52px; height: 52px;
    border-radius: 14px;
    border: 1px solid var(--border);
    background: var(--surface2);
    display: flex; align-items: center; justify-content: center;
    font-size: 22px;
    margin-bottom: 16px;
    transition: background 0.3s;
  }
  .card:hover .icon-ring { background: rgba(91,94,244,0.15); }

  /* Stat pill */
  .stat-pill {
    background: var(--surface2);
    border: 1px solid var(--border);
    border-radius: 100px;
    padding: 8px 22px;
    display: flex; flex-direction: column; align-items: center;
  }

  /* Input */
  .ai-textarea {
    width: 100%;
    padding: 16px;
    background: var(--surface2);
    border: 1px solid var(--border);
    border-radius: 14px;
    color: var(--text);
    font-family: 'DM Sans', sans-serif;
    font-size: 15px;
    resize: vertical;
    outline: none;
    transition: border-color 0.2s;
  }
  .ai-textarea::placeholder { color: var(--muted); }
  .ai-textarea:focus { border-color: var(--indigo); }

  /* Testimonial quote mark */
  .quote-mark {
    font-family: 'Syne', sans-serif;
    font-size: 80px;
    line-height: 1;
    color: var(--indigo);
    opacity: 0.2;
    position: absolute;
    top: -10px;
    left: 20px;
  }

  /* Nav link */
  .nav-link {
    color: var(--muted);
    text-decoration: none;
    font-size: 14px;
    font-weight: 500;
    letter-spacing: 0.02em;
    transition: color 0.2s;
    position: relative;
  }
  .nav-link::after {
    content: '';
    position: absolute;
    bottom: -2px; left: 0;
    width: 0; height: 1px;
    background: var(--indigo);
    transition: width 0.2s;
  }
  .nav-link:hover { color: var(--text); }
  .nav-link:hover::after { width: 100%; }

  /* Step line */
  .step-line {
    position: absolute;
    top: 26px;
    left: calc(50% + 40px);
    width: calc(100% - 80px);
    height: 1px;
    background: linear-gradient(to right, var(--indigo), transparent);
  }

  /* Divider */
  .divider {
    height: 1px;
    background: linear-gradient(to right, transparent, var(--border), transparent);
  }
`;

/* ─── Data ─────────────────────────────────── */

const FEATURES = [
  { icon: "📄", title: "AI Summary", desc: "Distill long notes into crisp, structured summaries in seconds." },
  { icon: "🧠", title: "Quiz Generator", desc: "Auto-generate MCQs and short-answers tailored to your material." },
  { icon: "🗂️", title: "Smart Flashcards", desc: "Spaced-repetition cards that adapt to what you keep forgetting." },
  { icon: "🤖", title: "AI Tutor", desc: "Ask follow-up questions and get Socratic explanations." },
  { icon: "📊", title: "Analytics", desc: "Track retention, weak spots, and study streaks at a glance." },
  { icon: "🔗", title: "Knowledge Graph", desc: "Visualize how concepts connect across all your notes." },
];

const TESTIMONIALS = [
  { name: "Rahul S.", role: "Engineering, IIT Delhi", text: "I cut study time by almost half. The summaries are shockingly accurate and the quizzes actually test understanding, not just memory.", stars: 5 },
  { name: "Priya M.", role: "Medicine, AIIMS", text: "The knowledge graph alone is worth it. I can finally see how pharmacology connects to physiology without reading five books.", stars: 5 },
  { name: "Aman K.", role: "CA Final, ICAI", text: "Feels like a personal tutor that's always available. I use it every single day before mock exams. 🔥", stars: 5 },
];

const STEPS = [
  { n: "01", title: "Paste Your Notes", desc: "Any format — typed, scanned PDF, or voice transcript." },
  { n: "02", title: "AI Processes", desc: "Our model extracts key ideas and builds a knowledge map." },
  { n: "03", title: "Study & Retain", desc: "Revise with quizzes, flashcards, and your AI tutor." },
];

const LOGOS = ["📚 Oxford", "🎓 MIT OCW", "✏️ NPTEL", "🔬 Khan Academy", "📖 Coursera", "🏛️ edX"];

/* ─── Animated counter ─────────────────────── */
function Counter({ end, suffix = "" }: { end: number; suffix?: string }) {
  const [val, setVal] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        let start = 0;
        const step = end / 60;
        const t = setInterval(() => {
          start += step;
          if (start >= end) { setVal(end); clearInterval(t); }
          else setVal(Math.floor(start));
        }, 16);
      }
    }, { threshold: 0.5 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [end]);
  return <span ref={ref}>{val}{suffix}</span>;
}

/* ─── Main component ───────────────────────── */
export default function Home() {
  const navigate = useNavigate();
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [navScrolled, setNavScrolled] = useState(false);
  const [tab, setTab] = useState(0);
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 80]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  useEffect(() => {
    const onScroll = () => setNavScrolled(window.scrollY > 30);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleGenerate = async () => {
    if (!input.trim()) { setOutput("⚠️ Please enter some text first."); return; }
    setLoading(true); setOutput("");
    try {
      const res = await fetch("https://edunex-backend-rj22.onrender.com/api/ai/summary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: input }),
      });
      const data = await res.json();
      setOutput(data?.summary || data?.result || "No response from AI.");
    } catch {
      setOutput("⚠️ Backend connection failed. Please try again.");
    }
    setLoading(false);
  };

  const stagger = {
    hidden: {},
    show: { transition: { staggerChildren: 0.1 } },
  };
  const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
  };

  return (
    <>
      <style>{STYLE}</style>
      <div className="grain" style={{ minHeight: "100vh", background: "var(--bg)", overflowX: "hidden" }}>

        {/* ── NAVBAR ──────────────────────────────── */}
        <motion.nav
          style={{
            position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
            display: "flex", alignItems: "center", justifyContent: "space-between",
            padding: "0 40px", height: 64,
            background: navScrolled ? "rgba(6,8,15,0.85)" : "transparent",
            backdropFilter: navScrolled ? "blur(16px)" : "none",
            borderBottom: navScrolled ? "1px solid var(--border)" : "none",
            transition: "background 0.3s, backdrop-filter 0.3s, border 0.3s",
          }}
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {/* Logo */}
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{
              width: 32, height: 32, borderRadius: 8,
              background: "linear-gradient(135deg, var(--indigo), #7c3aed)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 14, fontFamily: "Syne, sans-serif", fontWeight: 800, color: "#fff",
            }}>E</div>
            <span style={{ fontFamily: "Syne, sans-serif", fontWeight: 800, fontSize: 18, letterSpacing: "0.04em", color: "var(--text)" }}>
              EDUNEX
            </span>
            <span style={{
              fontSize: 10, fontWeight: 600, letterSpacing: "0.06em",
              background: "rgba(91,94,244,0.2)", color: "var(--indigo2)",
              border: "1px solid rgba(91,94,244,0.3)", borderRadius: 100,
              padding: "2px 8px", textTransform: "uppercase",
            }}>Beta</span>
          </div>

          {/* Links */}
          <div style={{ display: "flex", gap: 32 }}>
            {[["#features", "Features"], ["#how", "How it works"], ["#demo", "Demo"]].map(([href, label]) => (
              <a key={href} href={href} className="nav-link">{label}</a>
            ))}
          </div>

          {/* Actions */}
          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            <button className="btn-ghost" onClick={() => navigate("/login")}
              style={{ padding: "8px 20px", borderRadius: 10, fontSize: 14 }}>
              Sign in
            </button>
            <motion.button className="btn-glow" onClick={() => navigate("/register")}
              whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
              style={{ padding: "9px 22px", borderRadius: 10, fontSize: 14, zIndex: 1 }}>
              Get Started →
            </motion.button>
          </div>
        </motion.nav>

        {/* ── HERO ────────────────────────────────── */}
        <div ref={heroRef} style={{ position: "relative", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>

          {/* Blobs */}
          <div className="blob" style={{ width: 600, height: 600, background: "var(--indigo)", top: "10%", left: "15%", opacity: 0.12 }} />
          <div className="blob" style={{ width: 400, height: 400, background: "#7c3aed", bottom: "10%", right: "10%", opacity: 0.1, animationDelay: "3s" }} />
          <div className="blob" style={{ width: 300, height: 300, background: "var(--gold)", top: "60%", left: "60%", opacity: 0.05, animationDelay: "6s" }} />

          {/* Grid lines */}
          <div style={{
            position: "absolute", inset: 0,
            backgroundImage: `
              linear-gradient(var(--border) 1px, transparent 1px),
              linear-gradient(90deg, var(--border) 1px, transparent 1px)
            `,
            backgroundSize: "60px 60px",
            maskImage: "radial-gradient(ellipse 80% 60% at 50% 50%, black 40%, transparent 100%)",
          }} />

          <motion.div style={{ y: heroY, opacity: heroOpacity, position: "relative", textAlign: "center", padding: "0 24px", maxWidth: 820, zIndex: 2 }}>

            {/* Badge */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
              style={{ display: "inline-flex", alignItems: "center", gap: 8,
                background: "rgba(91,94,244,0.1)", border: "1px solid rgba(91,94,244,0.25)",
                borderRadius: 100, padding: "6px 16px", marginBottom: 32,
              }}>
              <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#4ade80", display: "inline-block", animation: "pulse 2s ease infinite" }} />
              <span style={{ fontSize: 13, color: "var(--indigo2)", fontWeight: 500 }}>
                1,200+ students studying smarter
              </span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              style={{ fontFamily: "Syne, sans-serif", fontWeight: 800, fontSize: "clamp(42px, 7vw, 76px)", lineHeight: 1.08, letterSpacing: "-0.03em", marginBottom: 24 }}>
              Your notes,<br />
              <span style={{ background: "linear-gradient(135deg, var(--indigo2), #a78bfa, var(--gold))", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                transformed by AI.
              </span>
            </motion.h1>

            {/* Sub */}
            <motion.p
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.6 }}
              style={{ fontSize: "clamp(15px, 2vw, 18px)", color: "var(--muted)", lineHeight: 1.7, marginBottom: 44, maxWidth: 560, margin: "0 auto 44px" }}>
              Paste your notes and get AI summaries, quizzes, flashcards, and a personal tutor — all in one place. Save 10+ hours a week.
            </motion.p>

            {/* CTA row */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.6 }}
              style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
              <motion.button className="btn-glow" onClick={() => navigate("/register")}
                whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
                style={{ padding: "14px 34px", borderRadius: 14, fontSize: 16, zIndex: 1 }}>
                Start for free — no card needed
              </motion.button>
              <motion.button className="btn-ghost" onClick={() => document.getElementById("demo")?.scrollIntoView({ behavior: "smooth" })}
                whileHover={{ scale: 1.02 }}
                style={{ padding: "14px 28px", borderRadius: 14, fontSize: 15 }}>
                See live demo ↓
              </motion.button>
            </motion.div>

            {/* Social proof avatars */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
              style={{ marginTop: 48, display: "flex", alignItems: "center", justifyContent: "center", gap: 12 }}>
              <div style={{ display: "flex" }}>
                {["👨🏽‍💻", "👩🏻‍🎓", "👨🏼‍⚕️", "👩🏾‍🔬", "👨🏿‍🏫"].map((e, i) => (
                  <div key={i} style={{
                    width: 32, height: 32, borderRadius: "50%",
                    background: `hsl(${200 + i * 30}, 60%, 30%)`,
                    border: "2px solid var(--bg)",
                    marginLeft: i === 0 ? 0 : -10,
                    display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15,
                  }}>{e}</div>
                ))}
              </div>
              <div>
                <span style={{ color: "var(--gold)", fontWeight: 700, fontSize: 14 }}>★★★★★</span>
                <span style={{ color: "var(--muted)", fontSize: 13, marginLeft: 6 }}>4.6 avg · 1.2K+ users</span>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* ── MARQUEE ─────────────────────────────── */}
        <div style={{ borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)", padding: "18px 0", overflow: "hidden", position: "relative" }}>
          <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 120, background: "linear-gradient(to right, var(--bg), transparent)", zIndex: 2 }} />
          <div style={{ position: "absolute", right: 0, top: 0, bottom: 0, width: 120, background: "linear-gradient(to left, var(--bg), transparent)", zIndex: 2 }} />
          <div className="marquee-track">
            {[...LOGOS, ...LOGOS].map((l, i) => (
              <span key={i} style={{ whiteSpace: "nowrap", color: "var(--muted)", fontSize: 14, fontWeight: 500 }}>{l}</span>
            ))}
          </div>
        </div>

        {/* ── STATS ───────────────────────────────── */}
        <section style={{ padding: "80px 24px" }}>
          <motion.div
            variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true }}
            style={{ maxWidth: 900, margin: "0 auto", display: "flex", gap: 20, flexWrap: "wrap", justifyContent: "center" }}>
            {[
              { value: 1200, suffix: "+", label: "Active Students" },
              { value: 8500, suffix: "+", label: "Notes Processed" },
              { value: 10, suffix: "x", label: "Faster Revision" },
              { value: 4.6, suffix: "★", label: "Avg Rating" },
            ].map((s, i) => (
              <motion.div key={i} variants={fadeUp} className="stat-pill"
                style={{ minWidth: 160, textAlign: "center", padding: "24px 36px" }}>
                <span style={{ fontFamily: "Syne, sans-serif", fontSize: 40, fontWeight: 800, color: "var(--indigo2)", lineHeight: 1 }}>
                  {i === 3 ? s.value + s.suffix : <Counter end={s.value as number} suffix={s.suffix} />}
                </span>
                <span style={{ fontSize: 13, color: "var(--muted)", marginTop: 6, display: "block" }}>{s.label}</span>
              </motion.div>
            ))}
          </motion.div>
        </section>

        <div className="divider" style={{ maxWidth: 900, margin: "0 auto" }} />

        {/* ── FEATURES ────────────────────────────── */}
        <section id="features" style={{ padding: "100px 24px" }}>
          <motion.div style={{ maxWidth: 1100, margin: "0 auto" }}>
            <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true, margin: "-80px" }}>

              <motion.p variants={fadeUp} style={{ fontSize: 12, letterSpacing: "0.12em", color: "var(--indigo2)", fontWeight: 600, textTransform: "uppercase", marginBottom: 14 }}>
                FEATURES
              </motion.p>
              <motion.h2 variants={fadeUp} style={{ fontFamily: "Syne, sans-serif", fontSize: "clamp(30px, 5vw, 52px)", fontWeight: 800, lineHeight: 1.1, letterSpacing: "-0.02em", marginBottom: 64, maxWidth: 500 }}>
                Everything you need to master any subject.
              </motion.h2>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 20 }}>
                {FEATURES.map((f, i) => (
                  <motion.div key={i} variants={fadeUp} className="card" style={{ padding: "28px" }}>
                    <div className="icon-ring">{f.icon}</div>
                    <h3 style={{ fontFamily: "Syne, sans-serif", fontWeight: 700, fontSize: 17, marginBottom: 8 }}>{f.title}</h3>
                    <p style={{ color: "var(--muted)", fontSize: 14, lineHeight: 1.65 }}>{f.desc}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        </section>

        <div className="divider" style={{ maxWidth: 900, margin: "0 auto" }} />

        {/* ── HOW IT WORKS ────────────────────────── */}
        <section id="how" style={{ padding: "100px 24px" }}>
          <motion.div style={{ maxWidth: 1000, margin: "0 auto" }}
            variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true, margin: "-80px" }}>
            <motion.p variants={fadeUp} style={{ fontSize: 12, letterSpacing: "0.12em", color: "var(--indigo2)", fontWeight: 600, textTransform: "uppercase", marginBottom: 14 }}>
              HOW IT WORKS
            </motion.p>
            <motion.h2 variants={fadeUp} style={{ fontFamily: "Syne, sans-serif", fontSize: "clamp(28px, 4vw, 46px)", fontWeight: 800, letterSpacing: "-0.02em", marginBottom: 64 }}>
              Study smarter in 3 steps.
            </motion.h2>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 24 }}>
              {STEPS.map((s, i) => (
                <motion.div key={i} variants={fadeUp} className="card" style={{ padding: "32px 28px", position: "relative" }}>
                  <div style={{
                    fontFamily: "Syne, sans-serif", fontSize: 48, fontWeight: 800,
                    color: "transparent", WebkitTextStroke: "1px rgba(91,94,244,0.3)",
                    lineHeight: 1, marginBottom: 16,
                  }}>{s.n}</div>
                  <h3 style={{ fontFamily: "Syne, sans-serif", fontWeight: 700, fontSize: 18, marginBottom: 10 }}>{s.title}</h3>
                  <p style={{ color: "var(--muted)", fontSize: 14, lineHeight: 1.7 }}>{s.desc}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </section>

        <div className="divider" style={{ maxWidth: 900, margin: "0 auto" }} />

        {/* ── AI DEMO ─────────────────────────────── */}
        <section id="demo" style={{ padding: "100px 24px" }}>
          <motion.div style={{ maxWidth: 820, margin: "0 auto" }}
            variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true, margin: "-80px" }}>

            <motion.p variants={fadeUp} style={{ fontSize: 12, letterSpacing: "0.12em", color: "var(--indigo2)", fontWeight: 600, textTransform: "uppercase", marginBottom: 14, textAlign: "center" }}>
              LIVE DEMO
            </motion.p>
            <motion.h2 variants={fadeUp} style={{ fontFamily: "Syne, sans-serif", fontSize: "clamp(28px, 4vw, 46px)", fontWeight: 800, letterSpacing: "-0.02em", marginBottom: 12, textAlign: "center" }}>
              Try it right now.
            </motion.h2>
            <motion.p variants={fadeUp} style={{ color: "var(--muted)", textAlign: "center", marginBottom: 48, fontSize: 15 }}>
              Paste any block of text and watch AI generate a clean summary.
            </motion.p>

            <motion.div variants={fadeUp} className="card" style={{ padding: "32px" }}>
              {/* Tabs */}
              <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
                {["Summary", "Quiz", "Flashcards"].map((t, i) => (
                  <button key={i} onClick={() => setTab(i)}
                    style={{
                      padding: "6px 16px", borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: "pointer",
                      background: tab === i ? "var(--indigo)" : "transparent",
                      color: tab === i ? "#fff" : "var(--muted)",
                      border: tab === i ? "none" : "1px solid var(--border)",
                      transition: "all 0.2s",
                    }}>
                    {t}
                  </button>
                ))}
              </div>

              <textarea className="ai-textarea" rows={6}
                value={input} onChange={e => setInput(e.target.value)}
                placeholder="Paste your notes, a chapter excerpt, or any text here..." />

              <div style={{ display: "flex", gap: 12, marginTop: 16, alignItems: "center" }}>
                <motion.button className="btn-glow" onClick={handleGenerate}
                  whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                  style={{ padding: "11px 28px", borderRadius: 10, fontSize: 15, zIndex: 1 }}
                  disabled={loading}>
                  {loading ? "Generating..." : "Generate ✦"}
                </motion.button>
                {input && (
                  <button onClick={() => { setInput(""); setOutput(""); }} className="btn-ghost"
                    style={{ padding: "10px 16px", borderRadius: 10, fontSize: 13 }}>
                    Clear
                  </button>
                )}
              </div>

              <AnimatePresence>
                {loading && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    style={{ marginTop: 24, display: "flex", alignItems: "center", gap: 12, color: "var(--muted)", fontSize: 14 }}>
                    <div style={{ width: 18, height: 18, border: "2px solid var(--indigo)", borderTopColor: "transparent", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
                    AI is thinking...
                  </motion.div>
                )}
                {output && !loading && (
                  <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                    style={{ marginTop: 24, background: "var(--surface2)", border: "1px solid var(--border)", borderRadius: 14, padding: "20px 24px" }}>
                    <p style={{ fontSize: 12, color: "var(--indigo2)", fontWeight: 600, letterSpacing: "0.08em", marginBottom: 12, textTransform: "uppercase" }}>
                      AI Output
                    </p>
                    <p style={{ color: "var(--text)", lineHeight: 1.75, fontSize: 15, whiteSpace: "pre-line" }}>{output}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </motion.div>
        </section>

        <div className="divider" style={{ maxWidth: 900, margin: "0 auto" }} />

        {/* ── DASHBOARD PREVIEW ───────────────────── */}
        <section style={{ padding: "100px 24px", textAlign: "center" }}>
          <motion.div style={{ maxWidth: 1000, margin: "0 auto" }}
            variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true, margin: "-80px" }}>
            <motion.p variants={fadeUp} style={{ fontSize: 12, letterSpacing: "0.12em", color: "var(--indigo2)", fontWeight: 600, textTransform: "uppercase", marginBottom: 14 }}>
              DASHBOARD
            </motion.p>
            <motion.h2 variants={fadeUp} style={{ fontFamily: "Syne, sans-serif", fontSize: "clamp(28px, 4vw, 46px)", fontWeight: 800, letterSpacing: "-0.02em", marginBottom: 48 }}>
              Your entire learning stack, unified.
            </motion.h2>

            <motion.div variants={fadeUp} style={{
              borderRadius: 20, overflow: "hidden",
              border: "1px solid var(--border)",
              boxShadow: "0 40px 120px rgba(0,0,0,0.6), 0 0 0 1px rgba(91,94,244,0.1)",
              position: "relative",
            }}>
              {/* Glow rim */}
              <div style={{ position: "absolute", inset: 0, borderRadius: 20, boxShadow: "inset 0 1px 0 rgba(255,255,255,0.06)", zIndex: 1, pointerEvents: "none" }} />
              <motion.img src={dashboardImg} alt="Dashboard preview"
                style={{ width: "100%", display: "block" }}
                whileHover={{ scale: 1.01 }}
                transition={{ duration: 0.4 }} />
            </motion.div>
          </motion.div>
        </section>

        <div className="divider" style={{ maxWidth: 900, margin: "0 auto" }} />

        {/* ── TESTIMONIALS ────────────────────────── */}
        <section style={{ padding: "100px 24px" }}>
          <motion.div style={{ maxWidth: 1100, margin: "0 auto" }}
            variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true, margin: "-80px" }}>
            <motion.p variants={fadeUp} style={{ fontSize: 12, letterSpacing: "0.12em", color: "var(--indigo2)", fontWeight: 600, textTransform: "uppercase", marginBottom: 14 }}>
              TESTIMONIALS
            </motion.p>
            <motion.h2 variants={fadeUp} style={{ fontFamily: "Syne, sans-serif", fontSize: "clamp(28px, 4vw, 46px)", fontWeight: 800, letterSpacing: "-0.02em", marginBottom: 56 }}>
              Students love EDUNEX.
            </motion.h2>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 20 }}>
              {TESTIMONIALS.map((t, i) => (
                <motion.div key={i} variants={fadeUp} className="card" style={{ padding: "36px 28px", position: "relative" }}>
                  <span className="quote-mark">"</span>
                  <p style={{ color: "var(--text)", lineHeight: 1.75, fontSize: 15, marginBottom: 24, position: "relative" }}>
                    {t.text}
                  </p>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div style={{
                      width: 38, height: 38, borderRadius: "50%",
                      background: `linear-gradient(135deg, hsl(${220 + i * 30}, 70%, 40%), hsl(${260 + i * 20}, 60%, 50%))`,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 15, fontWeight: 700, color: "#fff",
                    }}>{t.name[0]}</div>
                    <div>
                      <p style={{ fontWeight: 600, fontSize: 14 }}>{t.name}</p>
                      <p style={{ color: "var(--muted)", fontSize: 12 }}>{t.role}</p>
                    </div>
                    <div style={{ marginLeft: "auto", color: "var(--gold)", fontSize: 12 }}>{"★".repeat(t.stars)}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </section>

        {/* ── FINAL CTA ───────────────────────────── */}
        <section style={{ padding: "100px 24px" }}>
          <motion.div
            initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            style={{
              maxWidth: 860, margin: "0 auto", textAlign: "center",
              background: "var(--surface)", border: "1px solid var(--border)",
              borderRadius: 28, padding: "72px 48px",
              position: "relative", overflow: "hidden",
            }}>

            {/* Radial glow */}
            <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: 500, height: 300, background: "radial-gradient(ellipse, rgba(91,94,244,0.12) 0%, transparent 70%)", pointerEvents: "none" }} />

            <p style={{ fontSize: 12, letterSpacing: "0.12em", color: "var(--indigo2)", fontWeight: 600, textTransform: "uppercase", marginBottom: 16 }}>
              GET STARTED TODAY
            </p>
            <h2 style={{ fontFamily: "Syne, sans-serif", fontSize: "clamp(30px, 5vw, 54px)", fontWeight: 800, letterSpacing: "-0.03em", lineHeight: 1.1, marginBottom: 20 }}>
              Ready to study<br />
              <span style={{ background: "linear-gradient(135deg, var(--indigo2), var(--gold))", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                10× smarter?
              </span>
            </h2>
            <p style={{ color: "var(--muted)", fontSize: 16, marginBottom: 40, maxWidth: 440, margin: "0 auto 40px" }}>
              Join 1,200+ students already using EDUNEX to save hours and score higher.
            </p>

            <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
              <motion.button className="btn-glow" onClick={() => navigate("/register")}
                whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
                style={{ padding: "15px 38px", borderRadius: 14, fontSize: 16, zIndex: 1 }}>
                Create free account →
              </motion.button>
              <motion.button className="btn-ghost" onClick={() => navigate("/login")}
                style={{ padding: "15px 28px", borderRadius: 14, fontSize: 15 }}>
                Sign in
              </motion.button>
            </div>
          </motion.div>
        </section>

        {/* ── FOOTER ──────────────────────────────── */}
        <footer style={{ borderTop: "1px solid var(--border)", padding: "40px 40px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 20 }}>
          <div>
            <span style={{ fontFamily: "Syne, sans-serif", fontWeight: 800, fontSize: 16, color: "var(--text)" }}>EDUNEX</span>
            <p style={{ color: "var(--muted)", fontSize: 12, marginTop: 4 }}>© 2026 EDUNEX. All rights reserved.</p>
          </div>
          <p style={{ color: "var(--muted)", fontSize: 12 }}>Built with React · Node.js · MongoDB · AI APIs</p>
        </footer>

        {/* Spinner keyframe */}
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    </>
  );
}
