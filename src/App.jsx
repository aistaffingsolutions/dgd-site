import { useState, useEffect, useRef } from "react";

const PHONE = "tel:+353874099266";
const PHONE_DISPLAY = "087 409 9266";
const WA = "https://wa.me/353874099266";

// Palette — Tech/SaaS (from website color code guide)
const C = {
  bg:      "#F5F8FF",
  surface: "#EEF3FB",
  border:  "#C8D8EF",
  text:    "#0D1F3C",
  muted:   "#5B7299",
  accent:  "#2174B1",
  accentL: "#3A8FD4",
  orange:  "#FF9900",
};

const Logo = ({ scale = 1 }) => (
  <svg viewBox="0 0 220 65" width={220 * scale} height={65 * scale}>
    <path d="M 28,3 L 51,14 L 51,41 L 28,62 L 5,41 L 5,14 Z" fill="#2174B1" />
    <path d="M 28,9 L 46,18 L 46,39 L 28,56 L 10,39 L 10,18 Z" fill="#FFFFFF" />
    <text x="19" y="36" textAnchor="middle"
      fontFamily="'Arial Black','DM Sans',system-ui,sans-serif"
      fontWeight="900" fontSize="22" fill="#2174B1">d</text>
    <text x="28" y="36" textAnchor="middle"
      fontFamily="'Arial Black','DM Sans',system-ui,sans-serif"
      fontWeight="900" fontSize="22" fill="#2174B1">g</text>
    <text x="37" y="36" textAnchor="middle"
      fontFamily="'Arial Black','DM Sans',system-ui,sans-serif"
      fontWeight="900" fontSize="22" fill="#2174B1">d</text>
    <line x1="67" y1="16" x2="67" y2="49" stroke={C.border} strokeWidth="1.2"/>
    <text x="77" y="28" fontFamily="Georgia,serif" fontSize="8.5" fill={C.muted} letterSpacing="2.2">DIGITAL</text>
    <text x="77" y="39" fontFamily="Georgia,serif" fontSize="8.5" fill={C.muted} letterSpacing="2.2">GROWTH</text>
    <text x="77" y="50" fontFamily="Georgia,serif" fontWeight="700" fontSize="8.5" fill="#2174B1" letterSpacing="2.2">DESIGN</text>
  </svg>
);

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

export default function App() {
  const [openFaq, setOpenFaq] = useState(null);
  const [scrolled, setScrolled] = useState(false);
  const [vis, setVis] = useState({});
  const refs = useRef({});

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
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
      transform: vis[id] ? "none" : "translateY(20px)",
      transition: `opacity .7s cubic-bezier(.4,0,.2,1) ${delay}s, transform .7s cubic-bezier(.4,0,.2,1) ${delay}s`
    }
  });

  return (
    <div style={{ background: C.bg, color: C.text, minHeight: "100vh", fontFamily: "'DM Sans', system-ui, sans-serif", overflowX: "hidden" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@300;400;500&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::selection { background: #2174B130; }
        a { color: inherit; text-decoration: none; }

        .pill {
          display: inline-flex; align-items: center;
          font-family: 'DM Sans', sans-serif; font-weight: 500; font-size: 13px; letter-spacing: .4px;
          padding: 13px 28px; border-radius: 100px; border: none; cursor: pointer;
          transition: all .25s cubic-bezier(.4,0,.2,1);
        }
        .pill-solid { background: ${C.accent}; color: ${C.bg}; }
        .pill-solid:hover { background: ${C.text}; }
        .pill-outline { background: transparent; color: ${C.text}; border: 1.5px solid ${C.border}; }
        .pill-outline:hover { border-color: ${C.accent}; color: ${C.accent}; }

        .step-line {
          display: grid; grid-template-columns: 72px 1px 1fr;
          gap: 0 32px; align-items: start; padding: 36px 0;
          border-bottom: 1px solid ${C.border}; transition: all .2s;
        }
        .step-line:first-child { border-top: 1px solid ${C.border}; }
        .step-line:hover { background: ${C.surface}; margin: 0 -28px; padding: 36px 28px; border-radius: 14px; border-color: transparent; }

        .faq-row { padding: 22px 0; border-bottom: 1px solid ${C.border}; cursor: pointer; }
        .faq-row:first-child { border-top: 1px solid ${C.border}; }
        .faq-row:hover .fq { color: ${C.accent}; }
        .fq { transition: color .2s; font-family: 'DM Serif Display', serif; font-size: 17px; }

        .contact-card {
          display: flex; align-items: center; gap: 16px; padding: 22px 26px;
          border: 1.5px solid ${C.border}; border-radius: 18px; background: ${C.surface};
          transition: all .25s cubic-bezier(.4,0,.2,1);
        }
        .contact-card:hover { border-color: ${C.accent}; transform: translateY(-3px); box-shadow: 0 12px 40px ${C.accent}18; }

        @keyframes fadeUp { from { opacity:0; transform:translateY(18px); } to { opacity:1; transform:none; } }
        @keyframes ticker { from { transform:translateX(0); } to { transform:translateX(-33.33%); } }
      `}</style>

      {/* NAV */}
      <nav style={{
        position: "fixed", inset: "0 0 auto 0", zIndex: 100,
        padding: "0 48px", height: 68,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        background: scrolled ? "rgba(240,235,216,.94)" : "transparent",
        borderBottom: scrolled ? `1px solid ${C.border}` : "1px solid transparent",
        backdropFilter: scrolled ? "blur(20px)" : "none",
        transition: "all .35s"
      }}>
        <Logo scale={.72} />
        <div style={{ display: "flex", gap: 36, alignItems: "center" }}>
          <a href="#how" style={{ fontSize: 13, letterSpacing: 1.5, color: C.muted, fontWeight: 500 }}>HOW IT WORKS</a>
          <a href="#faq" style={{ fontSize: 13, letterSpacing: 1.5, color: C.muted, fontWeight: 500 }}>FAQ</a>
          <a href="#contact" className="pill pill-solid" style={{ fontSize: 12, padding: "9px 22px" }}>GET STARTED</a>
        </div>
      </nav>

      {/* HERO */}
      <section style={{ minHeight: "100vh", display: "flex", flexDirection: "column", justifyContent: "center", padding: "120px 48px 80px", position: "relative", overflow: "hidden" }}>
        {/* Subtle grid */}
        <div style={{ position: "absolute", inset: 0, zIndex: 0, backgroundImage: `linear-gradient(${C.border}50 1px, transparent 1px), linear-gradient(90deg, ${C.border}50 1px, transparent 1px)`, backgroundSize: "64px 64px" }}/>
        {/* Glow */}
        <div style={{ position: "absolute", top: "20%", right: "5%", width: 500, height: 500, borderRadius: "50%", background: `radial-gradient(circle, ${C.accent}0A 0%, transparent 70%)`, zIndex: 0 }}/>
        {/* Watermark */}
        <div style={{ position: "absolute", right: -40, top: "50%", transform: "translateY(-52%)", fontFamily: "Georgia,serif", fontWeight: 900, fontSize: "clamp(200px,24vw,380px)", color: C.text, opacity: .04, userSelect: "none", letterSpacing: -16, zIndex: 0, lineHeight: 1 }}>DGD</div>

        <div style={{ position: "relative", zIndex: 1, maxWidth: 860 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 28, opacity: 0, animation: "fadeUp .6s ease .1s forwards" }}>
            <div style={{ width: 28, height: 1.5, background: C.accent }}/>
            <span style={{ fontSize: 11, letterSpacing: 4, color: C.accent, fontWeight: 500 }}>DIGITAL GROWTH DESIGN</span>
          </div>

          <h1 style={{ fontFamily: "'DM Serif Display',serif", fontWeight: 900, lineHeight: 1.04, letterSpacing: "-2px", marginBottom: 28, opacity: 0, animation: "fadeUp .7s ease .18s forwards" }}>
            <span style={{ display: "block", fontSize: "clamp(48px,7.5vw,100px)", color: C.muted, fontWeight: 400, fontStyle: "italic" }}>Websites that</span>
            <span style={{ display: "block", fontSize: "clamp(48px,7.5vw,100px)" }}>work for your</span>
            <span style={{ display: "block", fontSize: "clamp(48px,7.5vw,100px)", color: C.accent, fontStyle: "italic" }}>business.</span>
          </h1>

          <p style={{ fontSize: 18, color: C.muted, lineHeight: 1.8, maxWidth: 480, marginBottom: 44, fontWeight: 300, opacity: 0, animation: "fadeUp .7s ease .3s forwards" }}>
            We work with Irish small businesses to get them online — properly. From first call to live site in under 48 hours.
          </p>

          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 60, opacity: 0, animation: "fadeUp .7s ease .42s forwards" }}>
            <a href="#contact" className="pill pill-solid" style={{ fontSize: 13 }}>Get Your Website</a>
            <a href="#how" className="pill pill-outline" style={{ fontSize: 13 }}>See How It Works</a>
          </div>

          <div style={{ display: "flex", gap: 36, flexWrap: "wrap", opacity: 0, animation: "fadeUp .7s ease .52s forwards" }}>
            {["Simple process", "Live in 48 hours", "Local Irish team"].map(t => (
              <div key={t} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{ width: 5, height: 5, borderRadius: "50%", background: C.accent }}/>
                <span style={{ fontSize: 13, color: C.muted }}>{t}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TICKER */}
      <div style={{ borderTop: `1px solid ${C.border}`, borderBottom: `1px solid ${C.border}`, padding: "14px 0", overflow: "hidden", background: C.surface }}>
        <div style={{ display: "flex", gap: 60, whiteSpace: "nowrap", animation: "ticker 24s linear infinite" }}>
          {[...Array(3)].flatMap(() => ["Cafés","Barbers","Plumbers","Physios","Restaurants","Electricians","Salons","Solicitors","Accountants","Gyms","Florists","Beauticians"]).map((t, i) => (
            <span key={i} style={{ fontSize: 10, letterSpacing: 4, color: C.border, fontWeight: 500 }}>{t.toUpperCase()}</span>
          ))}
        </div>
      </div>

      {/* HOW IT WORKS */}
      <section id="how" style={{ padding: "120px 48px" }}>
        <div style={{ maxWidth: 960, margin: "0 auto" }}>
          <div {...r("how-h")} style={{ ...r("how-h").style, marginBottom: 56 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
              <div style={{ width: 20, height: 1.5, background: C.accent }}/>
              <span style={{ fontSize: 10, letterSpacing: 4, color: C.accent }}>THE PROCESS</span>
            </div>
            <h2 style={{ fontFamily: "'DM Serif Display',serif", fontSize: "clamp(32px,4.5vw,56px)", fontWeight: 900, letterSpacing: -1.5, lineHeight: 1.08 }}>
              First call to live site.<br/><span style={{ color: C.muted, fontWeight: 400, fontStyle: "italic" }}>Under 48 hours.</span>
            </h2>
          </div>
          <div>
            {steps.map((s, i) => (
              <div key={i} className="step-line" {...r(`s${i}`, i * .1)} style={{ ...r(`s${i}`, i * .1).style }}>
                <div style={{ fontFamily: "'DM Serif Display',serif", fontSize: 11, color: C.accent, letterSpacing: 3, paddingTop: 3 }}>{s.n}</div>
                <div style={{ width: 1, background: C.border, alignSelf: "stretch", marginTop: 4 }}/>
                <div>
                  <h3 style={{ fontFamily: "'DM Serif Display',serif", fontSize: 20, fontWeight: 700, marginBottom: 10, letterSpacing: -.3 }}>{s.t}</h3>
                  <p style={{ fontSize: 14, color: C.muted, lineHeight: 1.8, maxWidth: 520 }}>{s.b}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact" style={{ padding: "0 48px 120px" }}>
        <div style={{ maxWidth: 960, margin: "0 auto" }}>
          <div {...r("c")} style={{
            ...r("c").style,
            background: C.accent,
            borderRadius: 28, padding: "64px 60px",
            display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 52
          }}>
            <div style={{ flex: 1, minWidth: 260 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18 }}>
                <div style={{ width: 18, height: 1, background: C.bg, opacity: .5 }}/>
                <span style={{ fontSize: 10, letterSpacing: 4, color: C.bg, opacity: .7 }}>GET IN TOUCH</span>
              </div>
              <h2 style={{ fontFamily: "'DM Serif Display',serif", fontSize: "clamp(26px,3.5vw,44px)", fontWeight: 900, letterSpacing: -1, lineHeight: 1.1, marginBottom: 18, color: C.bg }}>
                Ready to get<br/>your business online?
              </h2>
              <p style={{ fontSize: 14, color: C.bg, opacity: .7, lineHeight: 1.85, maxWidth: 360 }}>
                Heard about us through a friend, spotted our work on another site, or just found us yourself — give us a call or send a WhatsApp. We'll take it from there.
              </p>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 14, minWidth: 270 }}>
              <a href={PHONE} style={{ display: "flex", alignItems: "center", gap: 16, padding: "22px 26px", border: `1.5px solid ${C.bg}30`, borderRadius: 18, background: `${C.bg}15`, transition: "all .25s", textDecoration: "none" }}
                onMouseOver={e => { e.currentTarget.style.background = `${C.bg}25`; e.currentTarget.style.borderColor = `${C.bg}60`; }}
                onMouseOut={e => { e.currentTarget.style.background = `${C.bg}15`; e.currentTarget.style.borderColor = `${C.bg}30`; }}>
                <div style={{ width: 40, height: 40, borderRadius: 12, background: `${C.bg}20`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={C.bg} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.8a19.79 19.79 0 01-3.07-8.63A2 2 0 012 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/>
                  </svg>
                </div>
                <div>
                  <div style={{ fontSize: 9, letterSpacing: 2.5, color: C.bg, opacity: .6, marginBottom: 4 }}>CALL US</div>
                  <div style={{ fontSize: 16, fontFamily: "'DM Serif Display',serif", fontWeight: 700, color: C.bg }}>{PHONE_DISPLAY}</div>
                </div>
              </a>
              <a href={WA} target="_blank" rel="noreferrer" style={{ display: "flex", alignItems: "center", gap: 16, padding: "22px 26px", border: `1.5px solid ${C.bg}30`, borderRadius: 18, background: `${C.bg}15`, transition: "all .25s", textDecoration: "none" }}
                onMouseOver={e => { e.currentTarget.style.background = `${C.bg}25`; e.currentTarget.style.borderColor = `${C.bg}60`; }}
                onMouseOut={e => { e.currentTarget.style.background = `${C.bg}15`; e.currentTarget.style.borderColor = `${C.bg}30`; }}>
                <div style={{ width: 40, height: 40, borderRadius: 12, background: `${C.bg}20`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill={C.bg}>
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                    <path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.554 4.118 1.528 5.851L0 24l6.341-1.508A11.955 11.955 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.812 9.812 0 01-5.002-1.366l-.359-.214-3.724.886.924-3.638-.234-.374A9.818 9.818 0 012.182 12C2.182 6.573 6.573 2.182 12 2.182S21.818 6.573 21.818 12 17.427 21.818 12 21.818z"/>
                  </svg>
                </div>
                <div>
                  <div style={{ fontSize: 9, letterSpacing: 2.5, color: C.bg, opacity: .6, marginBottom: 4 }}>WHATSAPP</div>
                  <div style={{ fontSize: 16, fontFamily: "'DM Serif Display',serif", fontWeight: 700, color: C.bg }}>Message directly</div>
                </div>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" style={{ padding: "0 48px 120px" }}>
        <div style={{ maxWidth: 720, margin: "0 auto" }}>
          <div {...r("fq-h")} style={{ ...r("fq-h").style, marginBottom: 48 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
              <div style={{ width: 18, height: 1.5, background: C.accent }}/>
              <span style={{ fontSize: 10, letterSpacing: 4, color: C.accent }}>FAQ</span>
            </div>
            <h2 style={{ fontFamily: "'DM Serif Display',serif", fontSize: "clamp(26px,3.5vw,44px)", fontWeight: 900, letterSpacing: -1 }}>Questions we get asked.</h2>
          </div>
          <div>
            {faqs.map((f, i) => (
              <div key={i} className="faq-row" onClick={() => setOpenFaq(openFaq === i ? null : i)} {...r(`f${i}`, i * .07)} style={{ ...r(`f${i}`, i * .07).style }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span className="fq">{f.q}</span>
                  <span style={{ color: C.accent, fontSize: 22, fontWeight: 300, marginLeft: 24, flexShrink: 0, transition: "transform .2s", transform: openFaq === i ? "rotate(45deg)" : "none" }}>+</span>
                </div>
                {openFaq === i && <p style={{ fontSize: 14, color: C.muted, lineHeight: 1.85, marginTop: 14 }}>{f.a}</p>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* BOTTOM CTA */}
      <section style={{ padding: "80px 48px 100px", borderTop: `1px solid ${C.border}` }}>
        <div {...r("cta")} style={{ ...r("cta").style, maxWidth: 680, margin: "0 auto", textAlign: "center" }}>
          <h2 style={{ fontFamily: "'DM Serif Display',serif", fontSize: "clamp(32px,5vw,64px)", fontWeight: 900, letterSpacing: -2, lineHeight: 1.05, marginBottom: 22 }}>
            Let's get you<br/><span style={{ fontStyle: "italic", color: C.accent }}>online.</span>
          </h2>
          <p style={{ fontSize: 15, color: C.muted, lineHeight: 1.8, marginBottom: 40 }}>Get in touch and we'll have your site live within 48 hours.</p>
          <a href="#contact" className="pill pill-solid" style={{ fontSize: 14, padding: "15px 40px" }}>Get Your Website</a>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ padding: "32px 48px", borderTop: `1px solid ${C.border}`, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 20 }}>
        <Logo scale={.68} />
        <div style={{ display: "flex", gap: 32 }}>
          {["Digital Growth Design", "dgd.ie", "© 2025"].map(t => (
            <span key={t} style={{ fontSize: 10, color: C.border, letterSpacing: 1.5 }}>{t.toUpperCase()}</span>
          ))}
        </div>
      </footer>
    </div>
  );
}
