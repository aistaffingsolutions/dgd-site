import { useState, useEffect, useRef, useMemo, Suspense, Component } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import * as THREE from "three";

class ErrorBoundary extends Component {
  constructor(props) { super(props); this.state = { error: false }; }
  static getDerivedStateFromError() { return { error: true }; }
  render() { return this.state.error ? (this.props.fallback ?? null) : this.props.children; }
}

const PHONE = "tel:+353874099266";
const PHONE_DISPLAY = "087 409 9266";
const WA = "https://wa.me/353874099266";

const C = {
  bg:      "#04091A",
  surface: "#070D1E",
  panel:   "rgba(255,255,255,0.03)",
  border:  "rgba(255,255,255,0.07)",
  borderH: "rgba(255,255,255,0.18)",
  text:    "#E8EFFF",
  muted:   "#6B8BAE",
  accent:  "#2174B1",
  accentL: "#3A9FD8",
  orange:  "#FF9900",
};

// ─── 3D Components ────────────────────────────────────────────────────────────

function HeroScene() {
  const groupRef = useRef();
  const sphereRef = useRef();
  const wireRef = useRef();
  const ring1Ref = useRef();
  const ring2Ref = useRef();
  const ring3Ref = useRef();
  const accentRefs = [useRef(), useRef(), useRef(), useRef()];

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const mx = state.mouse.x;
    const my = state.mouse.y;
    if (groupRef.current) {
      groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, my * -0.55, 0.08);
      groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, mx * 0.65, 0.08);
    }
    if (sphereRef.current) sphereRef.current.rotation.y = t * 0.1;
    if (wireRef.current) { wireRef.current.rotation.y = t * 0.07; wireRef.current.rotation.x = t * 0.04; }
    // Rings speed up/slow down slightly with mouse for extra interactivity
    const speed = 1 + Math.abs(mx) * 0.4;
    if (ring1Ref.current) ring1Ref.current.rotation.z = t * 0.38 * speed;
    if (ring2Ref.current) ring2Ref.current.rotation.x = t * -0.28 * speed;
    if (ring3Ref.current) { ring3Ref.current.rotation.y = t * 0.22 * speed; ring3Ref.current.rotation.z = t * 0.09; }
    accentRefs.forEach((r, i) => {
      if (r.current) { r.current.rotation.x = t * (0.4 + i * 0.15); r.current.rotation.y = t * (0.3 + i * 0.1); }
    });
  });

  const accents = [
    { pos: [-3.0, 1.7, -0.8], color: "#FF9900", s: 0.13 },
    { pos: [2.2, -2.0, 0.6], color: "#3A9FD8", s: 0.09 },
    { pos: [-2.2, -1.6, 1.2], color: "#2174B1", s: 0.08 },
    { pos: [1.6, 2.4, -0.6], color: "#FF9900", s: 0.07 },
  ];

  return (
    <group ref={groupRef} position={[2.6, 0.1, 0]}>
      <Float speed={0.7} floatIntensity={0.35} rotationIntensity={0}>
        {/* Sharp chrome sphere */}
        <mesh ref={sphereRef}>
          <sphereGeometry args={[1.45, 96, 96]} />
          <meshPhysicalMaterial
            color="#0b1e38"
            metalness={1}
            roughness={0.03}
            envMapIntensity={3}
            emissive="#050f1e"
            emissiveIntensity={0.5}
          />
        </mesh>
        {/* Digital grid overlay */}
        <mesh ref={wireRef}>
          <sphereGeometry args={[1.49, 20, 16]} />
          <meshBasicMaterial color="#2174B1" wireframe transparent opacity={0.1} />
        </mesh>
      </Float>

      {/* Gyroscope ring 1 — equatorial blue */}
      <mesh ref={ring1Ref} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[2.05, 0.014, 3, 200]} />
        <meshStandardMaterial color="#3A9FD8" emissive="#3A9FD8" emissiveIntensity={0.6} transparent opacity={0.8} />
      </mesh>

      {/* Gyroscope ring 2 — tilted accent */}
      <mesh ref={ring2Ref} rotation={[Math.PI / 3.5, Math.PI / 5, 0]}>
        <torusGeometry args={[2.55, 0.009, 3, 200]} />
        <meshStandardMaterial color="#2174B1" emissive="#2174B1" emissiveIntensity={0.4} transparent opacity={0.55} />
      </mesh>

      {/* Gyroscope ring 3 — orange outer orbit */}
      <mesh ref={ring3Ref} rotation={[0, Math.PI / 4, Math.PI / 5]}>
        <torusGeometry args={[3.05, 0.005, 3, 200]} />
        <meshStandardMaterial color="#FF9900" emissive="#FF9900" emissiveIntensity={0.5} transparent opacity={0.35} />
      </mesh>

      {/* Floating accent diamonds */}
      {accents.map((a, i) => (
        <mesh key={i} ref={accentRefs[i]} position={a.pos}>
          <octahedronGeometry args={[a.s, 0]} />
          <meshStandardMaterial color={a.color} emissive={a.color} emissiveIntensity={2} roughness={0} />
        </mesh>
      ))}
    </group>
  );
}

function StarField() {
  const ref = useRef();
  const positions = useMemo(() => {
    const pos = new Float32Array(1800 * 3);
    for (let i = 0; i < 1800; i++) {
      pos[i * 3]     = (Math.random() - 0.5) * 28;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 28;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 28;
    }
    return pos;
  }, []);

  useFrame(() => { if (ref.current) ref.current.rotation.y += 0.00018; });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={1800} array={positions} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={0.04} color="#8BA3C7" transparent opacity={0.4} sizeAttenuation />
    </points>
  );
}

// ─── Logo ─────────────────────────────────────────────────────────────────────

const Logo = ({ scale = 1 }) => (
  <svg viewBox="0 0 220 65" width={220 * scale} height={65 * scale}>
    <path d="M 28,3 L 51,14 L 51,41 L 28,62 L 5,41 L 5,14 Z" fill="#2174B1" />
    <path d="M 28,9 L 46,18 L 46,39 L 28,56 L 10,39 L 10,18 Z" fill="#04091A" />
    <text x="28" y="38" textAnchor="middle" fontFamily="'Arial Black',system-ui,sans-serif" fontWeight="900" fontSize="18" fill="#E8EFFF" letterSpacing="2">dgd</text>
    <line x1="67" y1="16" x2="67" y2="49" stroke="rgba(255,255,255,0.12)" strokeWidth="1.2"/>
    <text x="77" y="28" fontFamily="Georgia,serif" fontSize="8.5" fill="rgba(255,255,255,0.4)" letterSpacing="2.2">DREAM</text>
    <text x="77" y="39" fontFamily="Georgia,serif" fontSize="8.5" fill="rgba(255,255,255,0.4)" letterSpacing="2.2">GATEWAY</text>
    <text x="77" y="50" fontFamily="Georgia,serif" fontWeight="700" fontSize="8.5" fill="#2174B1" letterSpacing="2.2">DONE</text>
  </svg>
);

// ─── Data ─────────────────────────────────────────────────────────────────────

const steps = [
  { n: "01", t: "We Reach Out", b: "We contact local businesses directly across Ireland. No agency middleman — just an honest conversation about what we can do for you." },
  { n: "02", t: "We Build Your Site", b: "Our team designs and builds your full website. We're a startup earning our reputation one site at a time, and we take that seriously." },
  { n: "03", t: "You Leave a Review", b: "All we ask in return is one honest Google review. It's how we grow, and it costs you nothing but two minutes." },
  { n: "04", t: "You're Live", b: "Your site goes live and stays live. We handle everything in the background — you just focus on your business." },
];

const faqs = [
  { q: "Do I own my website?", a: "Everything we build is yours. We host and maintain it, but if you ever want to take it elsewhere, we'll make that easy." },
  { q: "What if I need changes?", a: "Smaller updates are covered. For anything bigger, we'll have a quick chat and come up with something fair." },
  { q: "Why do you ask for a review?", a: "We're building our name from the ground up. A genuine review from a happy client is worth more to us than any ad." },
  { q: "What kind of businesses do you work with?", a: "Trades, cafés, salons, restaurants, physios — any Irish small business that deserves a proper online presence." },
  { q: "How fast can you turn it around?", a: "Most sites go live within 48 hours of us getting your information. We don't drag our feet." },
];

// ─── App ──────────────────────────────────────────────────────────────────────

export default function App() {
  const [openFaq, setOpenFaq] = useState(null);
  const [scrolled, setScrolled] = useState(false);
  const [vis, setVis] = useState({});
  const refs = useRef({});

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const io = new IntersectionObserver(
      es => es.forEach(e => { if (e.isIntersecting) setVis(v => ({ ...v, [e.target.dataset.id]: true })); }),
      { threshold: 0.1 }
    );
    Object.values(refs.current).forEach(r => r && io.observe(r));
    return () => io.disconnect();
  }, []);

  const r = (id, delay = 0) => ({
    "data-id": id,
    ref: el => refs.current[id] = el,
    style: {
      opacity: vis[id] ? 1 : 0,
      transform: vis[id] ? "none" : "translateY(24px)",
      transition: `opacity .8s cubic-bezier(.4,0,.2,1) ${delay}s, transform .8s cubic-bezier(.4,0,.2,1) ${delay}s`
    }
  });

  return (
    <div style={{ background: C.bg, color: C.text, minHeight: "100vh", fontFamily: "'DM Sans', system-ui, sans-serif", overflowX: "hidden" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@300;400;500&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::selection { background: #2174B140; }
        a { color: inherit; text-decoration: none; }
        html { scroll-behavior: smooth; }

        .pill {
          display: inline-flex; align-items: center;
          font-family: 'DM Sans', sans-serif; font-weight: 500; font-size: 13px; letter-spacing: .4px;
          padding: 13px 28px; border-radius: 100px; border: none; cursor: pointer;
          transition: all .25s cubic-bezier(.4,0,.2,1);
        }
        .pill-primary {
          background: linear-gradient(135deg, #2174B1 0%, #1560A0 100%);
          color: #fff;
          box-shadow: 0 0 28px rgba(33,116,177,0.4);
        }
        .pill-primary:hover {
          background: linear-gradient(135deg, #3A9FD8 0%, #2174B1 100%);
          box-shadow: 0 0 44px rgba(33,116,177,0.6);
          transform: translateY(-2px);
        }
        .pill-outline {
          background: rgba(255,255,255,0.04);
          color: ${C.text};
          border: 1px solid rgba(255,255,255,0.12);
          backdrop-filter: blur(10px);
        }
        .pill-outline:hover {
          border-color: rgba(33,116,177,0.5);
          background: rgba(33,116,177,0.08);
          color: ${C.accentL};
        }

        .step-card {
          padding: 40px;
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 22px;
          background: rgba(255,255,255,0.02);
          backdrop-filter: blur(12px);
          transition: all .3s cubic-bezier(.4,0,.2,1);
        }
        .step-card:hover {
          border-color: rgba(33,116,177,0.35);
          background: rgba(33,116,177,0.05);
          transform: translateY(-5px);
          box-shadow: 0 24px 64px rgba(33,116,177,0.14);
        }

        .faq-row {
          padding: 24px 0;
          border-bottom: 1px solid rgba(255,255,255,0.06);
          cursor: pointer;
          transition: all .2s;
        }
        .faq-row:first-child { border-top: 1px solid rgba(255,255,255,0.06); }
        .faq-row:hover .fq { color: ${C.accentL}; }
        .fq { transition: color .2s; font-family: 'DM Serif Display', serif; font-size: 18px; color: ${C.text}; }

        .contact-link {
          display: flex; align-items: center; gap: 16px; padding: 22px 26px;
          border: 1px solid rgba(255,255,255,0.1); border-radius: 18px;
          background: rgba(255,255,255,0.04); backdrop-filter: blur(10px);
          transition: all .25s cubic-bezier(.4,0,.2,1);
        }
        .contact-link:hover {
          border-color: rgba(255,255,255,0.25);
          background: rgba(255,255,255,0.08);
          transform: translateY(-3px);
          box-shadow: 0 14px 44px rgba(0,0,0,0.3);
        }

        .nav-link {
          font-size: 12px; letter-spacing: 2px; color: ${C.muted}; font-weight: 500;
          transition: color .2s;
        }
        .nav-link:hover { color: ${C.text}; }

        @keyframes fadeUp { from { opacity:0; transform:translateY(22px); } to { opacity:1; transform:none; } }
        @keyframes ticker { from { transform:translateX(0); } to { transform:translateX(-33.33%); } }
        @keyframes pulse { 0%,100% { opacity:.3; } 50% { opacity:.9; } }
      `}</style>

      {/* NAV */}
      <nav style={{
        position: "fixed", inset: "0 0 auto 0", zIndex: 100,
        padding: "0 48px", height: 68,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        background: scrolled ? "rgba(4,9,26,0.9)" : "transparent",
        borderBottom: scrolled ? "1px solid rgba(255,255,255,0.06)" : "1px solid transparent",
        backdropFilter: scrolled ? "blur(24px)" : "none",
        transition: "all .35s"
      }}>
        <Logo scale={.72} />
        <div style={{ display: "flex", gap: 36, alignItems: "center" }}>
          <a href="#how" className="nav-link">HOW IT WORKS</a>
          <a href="#faq" className="nav-link">FAQ</a>
          <a href="#contact" className="pill pill-primary" style={{ fontSize: 12, padding: "9px 22px" }}>GET STARTED</a>
        </div>
      </nav>

      {/* HERO */}
      <section style={{ position: "relative", height: "100vh", overflow: "hidden", display: "flex", alignItems: "center" }}>

        {/* 3D Canvas */}
        <ErrorBoundary fallback={null}>
          <div style={{ position: "absolute", inset: 0, zIndex: 0 }}>
            <Canvas
              camera={{ position: [0, 0, 6], fov: 62 }}
              gl={{ powerPreference: "high-performance", antialias: true, stencil: false, alpha: true }}
              dpr={[1, 2]}
            >
              <ambientLight intensity={0.08} />
              <directionalLight position={[6, 10, 4]} intensity={1.0} color="#ddeeff" />
              <pointLight position={[7, 3, 5]} intensity={3} color="#3A9FD8" />
              <pointLight position={[-5, -2, -2]} intensity={1.2} color="#2174B1" />
              <pointLight position={[0, -5, 4]} intensity={0.8} color="#FF9900" />
              <Suspense fallback={null}>
                <HeroScene />
              </Suspense>
              <StarField />
            </Canvas>
          </div>
        </ErrorBoundary>

        {/* Blue glow behind 3D */}
        <div style={{ position: "absolute", right: "8%", top: "50%", transform: "translateY(-50%)", width: 520, height: 520, background: "radial-gradient(circle, rgba(33,116,177,0.1) 0%, transparent 70%)", pointerEvents: "none", zIndex: 1 }} />

        {/* Subtle grid */}
        <div style={{ position: "absolute", inset: 0, zIndex: 1, backgroundImage: `linear-gradient(rgba(255,255,255,0.018) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.018) 1px, transparent 1px)`, backgroundSize: "72px 72px", pointerEvents: "none" }} />

        {/* Hero content */}
        <div style={{ position: "relative", zIndex: 2, padding: "0 48px", maxWidth: 680 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 32, opacity: 0, animation: "fadeUp .6s ease .1s forwards" }}>
            <div style={{ width: 32, height: 1.5, background: `linear-gradient(90deg, ${C.accent}, transparent)` }} />
            <span style={{ fontSize: 10, letterSpacing: 4, color: C.accent, fontWeight: 500 }}>DREAM GATEWAY DONE</span>
          </div>

          <h1 style={{ fontFamily: "'DM Serif Display',serif", lineHeight: 1.04, letterSpacing: "-2px", marginBottom: 28, opacity: 0, animation: "fadeUp .7s ease .2s forwards" }}>
            <span style={{ display: "block", fontSize: "clamp(44px,6.5vw,86px)", color: C.muted, fontWeight: 400, fontStyle: "italic" }}>Websites that</span>
            <span style={{ display: "block", fontSize: "clamp(44px,6.5vw,86px)", color: C.text }}>get your business</span>
            <span style={{ display: "block", fontSize: "clamp(44px,6.5vw,86px)", color: C.accent, fontStyle: "italic" }}>results.</span>
          </h1>

          <p style={{ fontSize: 17, color: C.muted, lineHeight: 1.8, maxWidth: 440, marginBottom: 44, fontWeight: 300, opacity: 0, animation: "fadeUp .7s ease .34s forwards" }}>
            We work with Irish small businesses to get them online — properly. From first call to live site in under 48 hours.
          </p>

          <div style={{ display: "flex", gap: 14, flexWrap: "wrap", marginBottom: 56, opacity: 0, animation: "fadeUp .7s ease .46s forwards" }}>
            <a href="#contact" className="pill pill-primary" style={{ fontSize: 14, padding: "14px 36px" }}>Get Your Website</a>
            <a href="#how" className="pill pill-outline" style={{ fontSize: 14 }}>See How It Works</a>
          </div>

          <div style={{ display: "flex", gap: 32, flexWrap: "wrap", opacity: 0, animation: "fadeUp .7s ease .56s forwards" }}>
            {["Simple process", "Live in 48 hours", "Local Irish team"].map(t => (
              <div key={t} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{ width: 6, height: 6, borderRadius: "50%", background: C.accent, boxShadow: `0 0 8px ${C.accent}` }} />
                <span style={{ fontSize: 13, color: C.muted }}>{t}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll indicator */}
        <div style={{ position: "absolute", bottom: 32, left: "50%", transform: "translateX(-50%)", zIndex: 2, display: "flex", flexDirection: "column", alignItems: "center", gap: 8, opacity: 0, animation: "fadeUp .6s ease 1.2s forwards" }}>
          <span style={{ fontSize: 9, letterSpacing: 3, color: C.muted }}>SCROLL</span>
          <div style={{ width: 1, height: 40, background: `linear-gradient(${C.accent}, transparent)`, animation: "pulse 2s ease infinite" }} />
        </div>
      </section>

      {/* TICKER */}
      <div style={{ borderTop: "1px solid rgba(255,255,255,0.05)", borderBottom: "1px solid rgba(255,255,255,0.05)", padding: "16px 0", overflow: "hidden", background: "rgba(255,255,255,0.012)" }}>
        <div style={{ display: "flex", gap: 72, whiteSpace: "nowrap", animation: "ticker 28s linear infinite" }}>
          {[...Array(3)].flatMap(() => ["Cafés","Barbers","Plumbers","Physios","Restaurants","Electricians","Salons","Solicitors","Accountants","Gyms","Florists","Beauticians"]).map((t, i) => (
            <span key={i} style={{ fontSize: 9, letterSpacing: 4.5, color: "rgba(255,255,255,0.16)", fontWeight: 500 }}>{t.toUpperCase()}</span>
          ))}
        </div>
      </div>

      {/* HOW IT WORKS */}
      <section id="how" style={{ padding: "130px 48px" }}>
        <div style={{ maxWidth: 1020, margin: "0 auto" }}>
          <div {...r("how-h")} style={{ ...r("how-h").style, marginBottom: 64 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
              <div style={{ width: 24, height: 1.5, background: `linear-gradient(90deg, ${C.accent}, transparent)` }} />
              <span style={{ fontSize: 9, letterSpacing: 4, color: C.accent }}>THE PROCESS</span>
            </div>
            <h2 style={{ fontFamily: "'DM Serif Display',serif", fontSize: "clamp(32px,4.5vw,58px)", fontWeight: 900, letterSpacing: -1.5, lineHeight: 1.08 }}>
              First call to live site.<br /><span style={{ color: C.muted, fontWeight: 400, fontStyle: "italic" }}>Under 48 hours.</span>
            </h2>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16 }}>
            {steps.map((s, i) => (
              <div key={i} className="step-card" {...r(`s${i}`, i * .09)} style={{ ...r(`s${i}`, i * .09).style }}>
                <div style={{ fontFamily: "'DM Serif Display',serif", fontSize: 12, color: C.accent, letterSpacing: 3, marginBottom: 20 }}>{s.n}</div>
                <div style={{ width: 28, height: 1, background: `linear-gradient(90deg, ${C.accent}60, transparent)`, marginBottom: 20 }} />
                <h3 style={{ fontFamily: "'DM Serif Display',serif", fontSize: 21, fontWeight: 700, marginBottom: 12, letterSpacing: -.3, color: C.text }}>{s.t}</h3>
                <p style={{ fontSize: 14, color: C.muted, lineHeight: 1.85 }}>{s.b}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact" style={{ padding: "0 48px 130px" }}>
        <div style={{ maxWidth: 1020, margin: "0 auto" }}>
          <div {...r("c")} style={{
            ...r("c").style,
            background: "linear-gradient(135deg, #0C2340 0%, #091A30 50%, #0C2040 100%)",
            border: "1px solid rgba(33,116,177,0.22)",
            borderRadius: 28, padding: "72px 64px",
            display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 52,
            position: "relative", overflow: "hidden",
            boxShadow: "0 40px 120px rgba(33,116,177,0.1)"
          }}>
            <div style={{ position: "absolute", top: -100, right: -80, width: 380, height: 380, background: "radial-gradient(circle, rgba(33,116,177,0.14) 0%, transparent 70%)", pointerEvents: "none" }} />
            <div style={{ position: "absolute", bottom: -80, left: -60, width: 280, height: 280, background: "radial-gradient(circle, rgba(255,153,0,0.06) 0%, transparent 70%)", pointerEvents: "none" }} />

            <div style={{ flex: 1, minWidth: 260, position: "relative" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
                <div style={{ width: 20, height: 1, background: "rgba(255,255,255,0.25)" }} />
                <span style={{ fontSize: 9, letterSpacing: 4, color: "rgba(255,255,255,0.45)" }}>GET IN TOUCH</span>
              </div>
              <h2 style={{ fontFamily: "'DM Serif Display',serif", fontSize: "clamp(26px,3.5vw,46px)", fontWeight: 900, letterSpacing: -1, lineHeight: 1.1, marginBottom: 18, color: "#E8EFFF" }}>
                Ready to get<br />your business online?
              </h2>
              <p style={{ fontSize: 14, color: "rgba(255,255,255,0.5)", lineHeight: 1.9, maxWidth: 360 }}>
                Heard about us through a friend, spotted our work, or just found us yourself — give us a call or send a WhatsApp. We'll take it from there.
              </p>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 14, minWidth: 280, position: "relative" }}>
              <a href={PHONE} className="contact-link">
                <div style={{ width: 42, height: 42, borderRadius: 12, background: "rgba(33,116,177,0.18)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.8a19.79 19.79 0 01-3.07-8.63A2 2 0 012 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" />
                  </svg>
                </div>
                <div>
                  <div style={{ fontSize: 9, letterSpacing: 2.5, color: "rgba(255,255,255,0.4)", marginBottom: 4 }}>CALL US</div>
                  <div style={{ fontSize: 16, fontFamily: "'DM Serif Display',serif", fontWeight: 700, color: "#E8EFFF" }}>{PHONE_DISPLAY}</div>
                </div>
              </a>
              <a href={WA} target="_blank" rel="noreferrer" className="contact-link">
                <div style={{ width: 42, height: 42, borderRadius: 12, background: "rgba(37,211,102,0.14)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                    <path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.554 4.118 1.528 5.851L0 24l6.341-1.508A11.955 11.955 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.812 9.812 0 01-5.002-1.366l-.359-.214-3.724.886.924-3.638-.234-.374A9.818 9.818 0 012.182 12C2.182 6.573 6.573 2.182 12 2.182S21.818 6.573 21.818 12 17.427 21.818 12 21.818z" />
                  </svg>
                </div>
                <div>
                  <div style={{ fontSize: 9, letterSpacing: 2.5, color: "rgba(255,255,255,0.4)", marginBottom: 4 }}>WHATSAPP</div>
                  <div style={{ fontSize: 16, fontFamily: "'DM Serif Display',serif", fontWeight: 700, color: "#E8EFFF" }}>Message directly</div>
                </div>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" style={{ padding: "0 48px 130px" }}>
        <div style={{ maxWidth: 720, margin: "0 auto" }}>
          <div {...r("fq-h")} style={{ ...r("fq-h").style, marginBottom: 52 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
              <div style={{ width: 20, height: 1.5, background: `linear-gradient(90deg, ${C.accent}, transparent)` }} />
              <span style={{ fontSize: 9, letterSpacing: 4, color: C.accent }}>FAQ</span>
            </div>
            <h2 style={{ fontFamily: "'DM Serif Display',serif", fontSize: "clamp(28px,4vw,48px)", fontWeight: 900, letterSpacing: -1.2 }}>Questions we get asked.</h2>
          </div>
          <div>
            {faqs.map((f, i) => (
              <div key={i} className="faq-row" onClick={() => setOpenFaq(openFaq === i ? null : i)} {...r(`f${i}`, i * .06)} style={{ ...r(`f${i}`, i * .06).style }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span className="fq">{f.q}</span>
                  <span style={{ color: C.accent, fontSize: 22, fontWeight: 300, marginLeft: 24, flexShrink: 0, transition: "transform .25s", transform: openFaq === i ? "rotate(45deg)" : "none" }}>+</span>
                </div>
                {openFaq === i && <p style={{ fontSize: 14, color: C.muted, lineHeight: 1.9, marginTop: 16 }}>{f.a}</p>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* BOTTOM CTA */}
      <section style={{ padding: "80px 48px 110px", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
        <div {...r("cta")} style={{ ...r("cta").style, maxWidth: 680, margin: "0 auto", textAlign: "center" }}>
          <h2 style={{ fontFamily: "'DM Serif Display',serif", fontSize: "clamp(36px,5vw,68px)", fontWeight: 900, letterSpacing: -2, lineHeight: 1.05, marginBottom: 24 }}>
            Let's get you<br /><span style={{ fontStyle: "italic", color: C.accent }}>online.</span>
          </h2>
          <p style={{ fontSize: 15, color: C.muted, lineHeight: 1.8, marginBottom: 44 }}>Get in touch and we'll have your site live within 48 hours.</p>
          <a href="#contact" className="pill pill-primary" style={{ fontSize: 14, padding: "15px 44px" }}>Get Your Website</a>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ padding: "28px 48px", borderTop: "1px solid rgba(255,255,255,0.05)", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 20 }}>
        <Logo scale={.65} />
        <div style={{ display: "flex", gap: 28 }}>
          {["Dream Gateway Done", "dgd.ie", "© 2026"].map(t => (
            <span key={t} style={{ fontSize: 10, color: "rgba(255,255,255,0.18)", letterSpacing: 1.5 }}>{t.toUpperCase()}</span>
          ))}
        </div>
      </footer>
    </div>
  );
}
