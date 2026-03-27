import { useState, useEffect, useRef } from "react";

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * WOF WOODEN CLONE - Minimal Furniture & Design Studio
 * Built as a single-component React application.
 */

const TOKENS = {
  bg: "#FFFFFF",
  surface: "#F7F7F7",
  border: "#EEEEEE",
  textPrimary: "#000000",
  textBody: "#333333",
  textMuted: "#666666",
  footerBg: "#000000",
  footerText: "#CCCCCC",
  productImgBg: "#F0F0F0",
  imgPlaceholder1: "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1200&q=80",
  imgPlaceholder2: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=80",
  imgPlaceholder3: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1200&q=80",
};

// --- Sub-Components ---

function Navbar({ currentPage, setCurrentPage }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navStyle = {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 100,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "18px 48px",
    background: "rgba(255,255,255,0.95)",
    backdropFilter: "blur(8px)",
    borderBottom: scrolled ? `1px solid ${TOKENS.border}` : "1px solid transparent",
    transition: "border-color 0.3s",
    fontFamily: "'Inter', sans-serif",
  };

  const pages = ["products", "works", "logs", "about"];

  return (
    <nav style={navStyle} className="navbar-container">
      {/* Logo */}
      <span
        onClick={() => { setCurrentPage("home"); window.scrollTo(0, 0); }}
        style={{ fontWeight: 700, letterSpacing: "0.3em", fontSize: 18, cursor: "pointer", color: TOKENS.textPrimary }}
      >
        D I E G M A
      </span>

      {/* Desktop links */}
      <div className="desktop-nav" style={{ display: "flex", gap: 32, alignItems: "center" }}>
        {pages.map((p) => (
          <span
            key={p}
            className={`nav-link ${currentPage === p ? "active" : ""}`}
            onClick={() => { setCurrentPage(p); window.scrollTo(0, 0); }}
          >
            {p.charAt(0).toUpperCase() + p.slice(1)}
            {p === "products" && " ▾"}
          </span>
        ))}
      </div>

      {/* Hamburger (mobile) */}
      <button
        onClick={() => setMobileOpen(true)}
        style={{ background: "none", border: "none", cursor: "pointer", display: "none", flexDirection: "column", gap: 5 }}
        className="hamburger"
      >
        {[0, 1, 2].map(i => <span key={i} style={{ width: 22, height: 1.5, background: "#111", display: "block" }} />)}
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div style={{
          position: "fixed", inset: 0, background: "#111", zIndex: 200,
          display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 40,
        }}>
          <button onClick={() => setMobileOpen(false)} style={{ position: "absolute", top: 20, right: 24, background: "none", border: "none", color: "#fff", fontSize: 28, cursor: "pointer" }}>✕</button>
          {["home", ...pages].map((p) => (
            <span key={p} onClick={() => { setCurrentPage(p); setMobileOpen(false); window.scrollTo(0, 0); }}
              style={{ color: "#fff", fontSize: 24, fontWeight: 400, cursor: "pointer", fontFamily: "'Inter', sans-serif", letterSpacing: "0.05em" }}>
              {p.toUpperCase()}
            </span>
          ))}
        </div>
      )}
    </nav>
  );
}

function Footer({ setCurrentPage }) {
  const productLinks = ["All Products", "Stool", "Bench", "Chair", "Table", "Shelf"];

  return (
    <footer style={{ background: TOKENS.footerBg, padding: "64px 48px 32px", fontFamily: "'Inter', sans-serif" }}>
      <div className="footer-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 40, marginBottom: 48 }}>

        {/* Col 1 — Brand */}
        <div>
          <div style={{ fontWeight: 700, letterSpacing: "0.3em", fontSize: 18, color: "#fff", marginBottom: 20 }}>D I E G M A</div>
          <div style={{ color: "#666", fontSize: 11, lineHeight: 2 }}>
            <div>© 2026 - DIEGMA</div>
            <div>All Right Reserved.</div>
            <div>Jakarta, Indonesia</div>
          </div>
        </div>

        {/* Col 2 — Products */}
        <div>
          <div style={{ color: "#fff", fontSize: 13, fontWeight: 500, marginBottom: 12 }}>Products</div>
          {productLinks.map(l => (
            <a key={l} className="footer-link" onClick={() => { setCurrentPage("products"); window.scrollTo(0, 0); }}>{l}</a>
          ))}
        </div>

        {/* Col 3 — Contact */}
        <div>
          <div style={{ color: "#fff", fontSize: 13, fontWeight: 500, marginBottom: 12 }}>Contact</div>
          {["Jakarta, Indonesia", "+62 812 3924 3317", "diegma9@gmail.com"].map(t => (
            <div key={t} style={{ color: "#666", fontSize: 13, lineHeight: 2 }}>{t}</div>
          ))}
          <div style={{ marginTop: 16 }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="2" width="20" height="20" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r="1" fill="#666" stroke="none" />
            </svg>
          </div>
        </div>

        {/* Col 4 — Newsletter */}
        <div>
          <div style={{ color: "#fff", fontSize: 14, fontWeight: 500, lineHeight: 1.4, marginBottom: 20 }}>
            Sign up for the latest<br />information
          </div>
          <div style={{ display: "flex", gap: 0, borderBottom: "1px solid #333" }}>
            <input placeholder="Email" style={{
              flex: 1, background: "transparent", border: "none", color: "#aaa",
              fontSize: 12, padding: "8px 0", outline: "none", fontFamily: "'Inter', sans-serif",
            }} />
            <button style={{
              background: "transparent", border: "none",
              color: "#aaa", fontSize: 12, padding: "8px 0", cursor: "pointer", fontFamily: "'Inter', sans-serif",
            }}>Subscribe</button>
          </div>
        </div>
      </div>
    </footer>
  );
}

function HeroSlider() {
  const [slide, setSlide] = useState(0);
  const slides = [
    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1920&q=80",
    "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1920&q=80",
    "https://images.unsplash.com/photo-1600566753190-17f0bb2a6c3e?auto=format&fit=crop&w=1920&q=80",
    "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1920&q=80"
  ];

  useEffect(() => {
    const t = setTimeout(() => setSlide((s) => (s + 1) % slides.length), 5000);
    return () => clearTimeout(t);
  }, [slide]);

  return (
    <div style={{ position: "relative", width: "100%", height: "85vh", background: "#000", overflow: "hidden" }}>
      {slides.map((s, i) => (
        <div key={i} style={{
          position: "absolute", inset: 0,
          backgroundImage: `url(${s})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          opacity: i === slide ? 1 : 0,
          transition: "opacity 1.5s ease-in-out",
          transform: i === slide ? "scale(1.05)" : "scale(1)",
          transitionProperty: "opacity, transform",
          transitionDuration: "1.5s, 6s",
        }} />
      ))}
      {/* Arrows */}
      {[["‹", -1, "left"], ["›", 1, "right"]].map(([arrow, dir, side]) => (
        <button key={side} onClick={() => setSlide((s) => (s + slides.length + dir) % slides.length)}
          className="slider-arrow"
          style={{
            position: "absolute", [side]: 24, top: "50%", transform: "translateY(-50%)",
            width: 40, height: 40, borderRadius: "50%", border: `1px solid ${TOKENS.border}`,
            background: "#fff", fontSize: 18, cursor: "pointer", zIndex: 2,
            transition: "all 0.2s", display: "flex", alignItems: "center", justifyContent: "center"
          }}>
          {arrow}
        </button>
      ))}
      {/* Dots */}
      <div style={{ position: "absolute", bottom: 20, left: "50%", transform: "translateX(-50%)", display: "flex", gap: 8 }}>
        {slides.map((_, i) => (
          <div key={i} onClick={() => setSlide(i)} style={{ width: 6, height: 6, borderRadius: "50%", background: i === slide ? "#111" : "#CCC", cursor: "pointer", transition: "background 0.2s" }} />
        ))}
      </div>
    </div>
  );
}

function HomePage({ setCurrentPage }) {
  const products = [
    { name: "Muka Bench", price: "IDR 1.500.000" },
    { name: "Muka Chair", price: "IDR 1.800.000" },
    { name: "Sekitar Bench", price: "IDR 2.635.000" },
    { name: "Taku Bench", price: "IDR 1.760.000" },
  ];
  const logs = [
    { cat: "Architecture", date: "20 Mar 2026", title: "The Future of Sustainable Living", excerpt: "Exploring how DIEGMA integrates green technology and sustainable materials into modern residential architecture for a better future.", img: "https://images.unsplash.com/photo-1518005020250-6859b2827c6d?auto=format&fit=crop&w=800&q=80" },
    { cat: "Interior", date: "10 Feb 2026", title: "Minimalism: More Than Just Less", excerpt: "Why minimalist design is about intentionality and how it improves daily well-being through thoughtful space planning.", img: "https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?auto=format&fit=crop&w=800&q=80" },
    { cat: "News", date: "15 Jan 2026", title: "Excellence in Design 2025", excerpt: "We are honored to receive recognition for our work on the Uluwatu Villa project at the annual Architecture Awards.", img: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80" },
    { cat: "Ideas", date: "05 Dec 2025", title: "Choosing the Right Materials", excerpt: "A guide to selecting sustainable and durable materials for your next construction project, from foundation to finish.", img: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=800&q=80" },
    { cat: "Project", date: "12 Nov 2025", title: "Behind the Scenes: SCBD Office", excerpt: "A deep dive into the planning and execution of one of Jakarta's most modern and efficient office spaces.", img: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80" },
  ];
  const works = [
    { name: "Uluwatu Villa", bg: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80" },
    { name: "SCBD Office", bg: "https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=800&q=80" },
    { name: "Menteng Apartment", bg: "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=800&q=80" },
    { name: "Kemang Rooftop", bg: "https://images.unsplash.com/photo-1531835597930-518295974661?auto=format&fit=crop&w=800&q=80" },
  ];

  return (
    <div>
      <HeroSlider />

      {/* Brand description */}
      <div className="section-pad two-col reveal" style={{ padding: "80px 48px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 64 }}>
        <p style={{ fontWeight: 400, fontSize: 16, color: TOKENS.textPrimary, lineHeight: 1.6 }}>DIEGMA adalah studio arsitektur dan desain interior premium di Jakarta yang menawarkan jasa desain, konstruksi, dan furniture custom dengan pendekatan modern dan inovatif.</p>
        <p style={{ fontWeight: 300, fontSize: 14, color: TOKENS.textBody, lineHeight: 1.8 }}>Kami percaya bahwa setiap ruang memiliki cerita unik. Melalui kolaborasi antara arsitek dan desainer interior, kami menciptakan solusi hunian yang fungsional, estetis, dan berkelanjutan.</p>
      </div>

      {/* Products section -> Services */}
      <div className="section-pad reveal" style={{ padding: "64px 48px 32px" }}>
        <h2 className="heading-large" style={{ fontWeight: 700, fontSize: "clamp(40px,6vw,48px)", letterSpacing: "-0.02em", textTransform: "uppercase", marginBottom: 32 }}>Services</h2>
        <div className="grid-4" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 2 }}>
          {[
            { name: "Architecture Design", desc: "Perencanaan bangunan modern" },
            { name: "Interior Design", desc: "Transformasi ruang dalam" },
            { name: "Construction", desc: "Pembangunan berkualitas tinggi" },
            { name: "Custom Furniture", desc: "Mebel yang dipersonalisasi" },
          ].map((s, i) => (
            <div key={i} className="reveal-child reveal" style={{ cursor: "pointer" }}>
              <div className="img-zoom-wrap" style={{ background: TOKENS.surface, aspectRatio: "4/5", width: "100%" }}>
                <div className="img-inner" style={{ width: "100%", height: "100%", backgroundImage: `url(https://images.unsplash.com/photo-${i === 0 ? '1613490493576-7fde63acd811' : i === 1 ? '1618221195710-dd6b41faaea6' : i === 2 ? '1503387762-592deb58ef4e' : '1595428774223-ef52624120d2'}?auto=format&fit=crop&w=800&q=80)`, backgroundSize: "cover" }} />
              </div>
              <div style={{ padding: "15px 0 2px", fontSize: 14, fontWeight: 600, color: TOKENS.textPrimary }}>{s.name}</div>
              <div style={{ fontSize: 12, color: TOKENS.textMuted }}>{s.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Logs section */}
      <div className="section-pad reveal" style={{ padding: "64px 48px" }}>
        <h2 className="heading-large" style={{ fontWeight: 700, fontSize: "clamp(40px,6vw,48px)", letterSpacing: "-0.02em", textTransform: "uppercase", marginBottom: 8 }}>Logs</h2>
        <p style={{ fontSize: 13, color: TOKENS.textMuted, marginBottom: 32 }}>Explore insights, stories, and updates from our studio, crafted to inspire and inform.</p>
        
        <div className="logs-home-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
          {/* Big card */}
          <div className="reveal-child reveal" style={{ cursor: "pointer" }}>
            <div className="img-zoom-wrap" style={{ aspectRatio: "4/3", marginBottom: 12 }}>
              <div className="img-inner" style={{ width: "100%", height: "100%", backgroundImage: `url(${logs[0].img})`, backgroundSize: "cover", backgroundPosition: "center" }} />
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: TOKENS.textMuted, marginBottom: 6 }}>
              <span>{logs[0].cat}</span><span>{logs[0].date}</span>
            </div>
            <div style={{ fontSize: 18, fontWeight: 600, color: TOKENS.textPrimary, marginBottom: 6 }}>{logs[0].title}</div>
            <div style={{ fontSize: 12, color: TOKENS.textBody, lineHeight: 1.7, marginBottom: 8 }}>{logs[0].excerpt}</div>
            <span style={{ fontSize: 12, color: TOKENS.textPrimary, textDecoration: "underline", textUnderlineOffset: 3, cursor: "pointer" }}>Read more</span>
          </div>
          {/* 2x2 small cards */}
          <div className="logs-small-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            {logs.slice(1, 5).map((l, i) => (
              <div key={i} className="reveal-child reveal" style={{ cursor: "pointer" }}>
                <div className="img-zoom-wrap" style={{ aspectRatio: "3/2", marginBottom: 8 }}>
                  <div className="img-inner" style={{ width: "100%", height: "100%", backgroundImage: `url(${l.img})`, backgroundSize: "cover", backgroundPosition: "center" }} />
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, color: TOKENS.textMuted, marginBottom: 4 }}>
                  <span>{l.cat}</span><span>{l.date}</span>
                </div>
                <div style={{ fontSize: 13, fontWeight: 600, color: TOKENS.textPrimary, marginBottom: 4 }}>{l.title}</div>
                <span style={{ fontSize: 11, color: TOKENS.textPrimary, textDecoration: "underline", textUnderlineOffset: 3, cursor: "pointer" }}>Read more</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Works section */}
      <div className="section-pad reveal" style={{ padding: "64px 48px" }}>
        <h2 className="heading-large" style={{ fontWeight: 700, fontSize: "clamp(40px,6vw,48px)", letterSpacing: "-0.02em", textTransform: "uppercase", marginBottom: 32 }}>Works</h2>
        <div className="grid-4" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 2 }}>
          {works.map((w, i) => (
            <div key={i} className="reveal-child reveal" onClick={() => { setCurrentPage("works"); window.scrollTo(0, 0); }} style={{ cursor: "pointer" }}>
              <div className="img-zoom-wrap">
                <div className="img-inner" style={{ backgroundImage: `url(${w.bg})`, backgroundSize: "cover", backgroundPosition: "center", aspectRatio: "1/1", width: "100%" }} />
              </div>
              <div style={{ fontSize: 13, color: TOKENS.textPrimary, padding: "8px 0 2px" }}>{w.name}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Client logos strip */}
      <div className="reveal" style={{ padding: "80px 48px", borderTop: `1px solid ${TOKENS.border}` }}>
        <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.2em", color: TOKENS.textMuted, textTransform: "uppercase", textAlign: "center", marginBottom: 48 }}>Selected Clients</div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 48 }}>
          {[
            { name: "SCBD", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2e/Logo_of_the_Jakarta_Stock_Exchange.svg/1200px-Logo_of_the_Jakarta_Stock_Exchange.svg.png" },
            { name: "AMAN", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0c/Aman_Resorts_logo.svg/2560px-Aman_Resorts_logo.svg.png" },
            { name: "HYATT", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f3/Hyatt_logo.svg/2560px-Hyatt_logo.svg.png" },
            { name: "MARRIOTT", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/03/Marriott_International_logo.svg/2560px-Marriott_International_logo.svg.png" },
            { name: "CIPUTRA", logo: "https://upload.wikimedia.org/wikipedia/id/thumb/b/b3/Logo_Ciputra.svg/1200px-Logo_Ciputra.svg.png" },
            { name: "SINAR MAS", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/Sinar_Mas_Logo.svg/1200px-Sinar_Mas_Logo.svg.png" }
          ].map((brand, i) => (
            <div key={i} style={{ flex: "1 1 120px", display: "flex", justifyContent: "center", filter: "grayscale(100%) contrast(0.5)", opacity: 0.4, transition: "all 0.3s" }} className="client-logo">
              <div style={{ fontSize: 14, fontWeight: 800, letterSpacing: "0.2em", color: "#000", textAlign: "center" }}>{brand.name}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ProductsPage() {
  const categories = ["All Products", "Stool", "Bench", "Chair", "Table", "Shelf"];
  const [activeTab, setActiveTab] = useState("All Products");

  const allProducts = [
    { name: "Bunkaisu Stool", price: "IDR 550.000", cat: "Stool", img: "https://images.unsplash.com/photo-1503602642458-232111445657?auto=format&fit=crop&w=800&q=80" },
    { name: "Chisel Stool A", price: "IDR 620.000", cat: "Stool", img: "https://images.unsplash.com/photo-1592078615290-033ee584e267?auto=format&fit=crop&w=800&q=80" },
    { name: "Chisel Stool B", price: "IDR 680.000", cat: "Stool", img: "https://images.unsplash.com/photo-1562184552-997c461abbe6?auto=format&fit=crop&w=800&q=80" },
    { name: "Chisel Stool C", price: "IDR 720.000", cat: "Stool", img: "https://images.unsplash.com/photo-1538688598194-58e2d67e8bcd?auto=format&fit=crop&w=800&q=80" },
    { name: "DVN Stool", price: "IDR 480.000", cat: "Stool", img: "https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?auto=format&fit=crop&w=800&q=80" },
    { name: "Kanna Stool", price: "IDR 590.000", cat: "Stool", img: "https://images.unsplash.com/photo-1501045661006-fcebe0081478?auto=format&fit=crop&w=800&q=80" },
    { name: "Kitaro Stack Stool", price: "IDR 750.000", cat: "Stool", img: "https://images.unsplash.com/photo-1581539250439-c96689b516dd?auto=format&fit=crop&w=800&q=80" },
    { name: "Mori Stool", price: "IDR 520.000", cat: "Stool", img: "https://images.unsplash.com/photo-1594913785162-e6785b423cb1?auto=format&fit=crop&w=800&q=80" },
    { name: "Muka Stool", price: "IDR 560.000", cat: "Stool", img: "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?auto=format&fit=crop&w=800&q=80" },
    { name: "Shi Stool", price: "IDR 490.000", cat: "Stool", img: "https://images.unsplash.com/photo-1505843490538-5133c6c7d0e1?auto=format&fit=crop&w=800&q=80" },
    { name: "Taku Stool", price: "IDR 610.000", cat: "Stool", img: "https://images.unsplash.com/photo-1592078615290-033ee584e267?auto=format&fit=crop&w=800&q=80" },
    { name: "Mori Bench", price: "IDR 1.200.000", cat: "Bench", img: "https://images.unsplash.com/photo-1517705008128-361805f42e86?auto=format&fit=crop&w=800&q=80" },
    { name: "Muka Bench", price: "IDR 1.500.000", cat: "Bench", img: "https://images.unsplash.com/photo-1503602642458-232111445657?auto=format&fit=crop&w=800&q=80" },
    { name: "Sekitar Bench", price: "IDR 2.635.000", cat: "Bench", img: "https://images.unsplash.com/photo-1519947486511-46149fa0a254?auto=format&fit=crop&w=800&q=80" },
    { name: "Shi Bench", price: "IDR 1.100.000", cat: "Bench", img: "https://images.unsplash.com/photo-1540518614846-7eded433c457?auto=format&fit=crop&w=800&q=80" },
    { name: "Taku Bench", price: "IDR 1.760.000", cat: "Bench", img: "https://images.unsplash.com/photo-1517705008128-361805f42e86?auto=format&fit=crop&w=800&q=80" },
    { name: "Kanna Arm Chair", price: "IDR 2.400.000", cat: "Chair", img: "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?auto=format&fit=crop&w=800&q=80" },
    { name: "Kanna Chair", price: "IDR 1.950.000", cat: "Chair", img: "https://images.unsplash.com/photo-1581539250439-c96689b516dd?auto=format&fit=crop&w=800&q=80" },
    { name: "Kitaro Chair", price: "IDR 2.100.000", cat: "Chair", img: "https://images.unsplash.com/photo-1592078615290-033ee584e267?auto=format&fit=crop&w=800&q=80" },
    { name: "Landai Chair A", price: "IDR 2.800.000", cat: "Chair", img: "https://images.unsplash.com/photo-1503602642458-232111445657?auto=format&fit=crop&w=800&q=80" },
    { name: "Landai Chair B", price: "IDR 3.100.000", cat: "Chair", img: "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?auto=format&fit=crop&w=800&q=80" },
    { name: "Muka Chair", price: "IDR 1.800.000", cat: "Chair", img: "https://images.unsplash.com/photo-1581539250439-c96689b516dd?auto=format&fit=crop&w=800&q=80" },
    { name: "Shi Chair", price: "IDR 1.700.000", cat: "Chair", img: "https://images.unsplash.com/photo-1592078615290-033ee584e267?auto=format&fit=crop&w=800&q=80" },
    { name: "DVN Side Table", price: "IDR 890.000", cat: "Table", img: "https://images.unsplash.com/photo-1533090161767-e6ffed986c88?auto=format&fit=crop&w=800&q=80" },
    { name: "Muka Desk A", price: "IDR 3.200.000", cat: "Table", img: "https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?auto=format&fit=crop&w=800&q=80" },
    { name: "Muka Desk B", price: "IDR 3.500.000", cat: "Table", img: "https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?auto=format&fit=crop&w=800&q=80" },
    { name: "Muka Cafe Table", price: "IDR 2.100.000", cat: "Table", img: "https://images.unsplash.com/photo-1533090161767-e6ffed986c88?auto=format&fit=crop&w=800&q=80" },
    { name: "Muka Dining Table 180", price: "IDR 5.400.000", cat: "Table", img: "https://images.unsplash.com/photo-1533090161767-e6ffed986c88?auto=format&fit=crop&w=800&q=80" },
    { name: "Nakahie Table 38", price: "IDR 1.200.000", cat: "Table", img: "https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?auto=format&fit=crop&w=800&q=80" },
    { name: "Nakahie Table 55", price: "IDR 1.600.000", cat: "Table", img: "https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?auto=format&fit=crop&w=800&q=80" },
    { name: "Pedersen Plant Podium", price: "IDR 780.000", cat: "Table", img: "https://images.unsplash.com/photo-1533090161767-e6ffed986c88?auto=format&fit=crop&w=800&q=80" },
    { name: "Pedersen Side Table", price: "IDR 950.000", cat: "Table", img: "https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?auto=format&fit=crop&w=800&q=80" },
    { name: "Shi Coffee Table", price: "IDR 1.850.000", cat: "Table", img: "https://images.unsplash.com/photo-1533090161767-e6ffed986c88?auto=format&fit=crop&w=800&q=80" },
    { name: "Shi Dining Table", price: "IDR 4.200.000", cat: "Table", img: "https://images.unsplash.com/photo-1533090161767-e6ffed986c88?auto=format&fit=crop&w=800&q=80" },
    { name: "DVN Wall Shelf", price: "IDR 680.000", cat: "Shelf", img: "https://images.unsplash.com/photo-1594026112284-02bb6f3352fe?auto=format&fit=crop&w=800&q=80" },
    { name: "Gengai Shelf (L)", price: "IDR 2.400.000", cat: "Shelf", img: "https://images.unsplash.com/photo-1594026112284-02bb6f3352fe?auto=format&fit=crop&w=800&q=80" },
    { name: "Gengai Shelf (M)", price: "IDR 1.950.000", cat: "Shelf", img: "https://images.unsplash.com/photo-1594026112284-02bb6f3352fe?auto=format&fit=crop&w=800&q=80" },
    { name: "Gengai Shelf (S)", price: "IDR 1.500.000", cat: "Shelf", img: "https://images.unsplash.com/photo-1594026112284-02bb6f3352fe?auto=format&fit=crop&w=800&q=80" },
    { name: "Gengai Credenza", price: "IDR 5.800.000", cat: "Shelf", img: "https://images.unsplash.com/photo-1594026112284-02bb6f3352fe?auto=format&fit=crop&w=800&q=80" },
    { name: "Gengai Nightstand", price: "IDR 1.200.000", cat: "Shelf", img: "https://images.unsplash.com/photo-1594026112284-02bb6f3352fe?auto=format&fit=crop&w=800&q=80" },
  ];

  const filtered = activeTab === "All Products" ? allProducts : allProducts.filter(p => p.cat === activeTab);

  return (
    <div style={{ paddingTop: 80 }}>
      {/* Tab bar */}
      <div style={{ borderBottom: `1px solid ${TOKENS.border}`, display: "flex", overflowX: "auto", whiteSpace: "nowrap" }} className="hide-scrollbar">
        {categories.map(c => (
          <button key={c} className={`tab-btn ${activeTab === c ? "active" : ""}`} onClick={() => setActiveTab(c)}>{c}</button>
        ))}
      </div>

      <div className="section-pad reveal" style={{ padding: "48px 48px 64px" }}>
        <h1 className="heading-large" style={{ fontWeight: 700, fontSize: "clamp(40px,6vw,64px)", letterSpacing: "-0.02em", textTransform: "uppercase", marginBottom: 40 }}>Products</h1>
        <div className="grid-4" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 2 }}>
          {filtered.map((p, i) => (
            <div key={i} className="reveal-child reveal" style={{ cursor: "pointer" }}>
              <div className="img-zoom-wrap">
                <div className="img-inner" style={{ backgroundImage: `url(${p.img})`, backgroundSize: "cover", backgroundPosition: "center", aspectRatio: "1/1", width: "100%" }} />
              </div>
              <div style={{ padding: "8px 0 2px", fontSize: 13, fontWeight: 400, color: TOKENS.textPrimary }}>{p.name}</div>
              <div style={{ fontSize: 12, color: TOKENS.textMuted, paddingBottom: 16 }}>{p.price}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function WorksPage() {
  const works = [
    { label: "Uluwatu Villa", project: "Modern Minimalist Villa", type: "Architecture", year: "2026", bg: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80" },
    { label: "SCBD Office", project: "The Glass House", type: "Architecture", year: "2025", bg: "https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=800&q=80" },
    { label: "Menteng Apt", project: "Scandi-Industrial", type: "Interior", year: "2025", bg: "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=800&q=80" },
    { label: "Kemang Rooftop", project: "Urban Garden", type: "Landscape", year: "2024", bg: "https://images.unsplash.com/photo-1531835597930-518295974661?auto=format&fit=crop&w=800&q=80" },
    { label: "Senopati Penthouse", project: "Luxury Living", type: "Full Build", year: "2024", bg: "https://images.unsplash.com/photo-1600566753190-17f0bb2a6c3e?auto=format&fit=crop&w=800&q=80" },
    { label: "Labuan Bajo", project: "Eco-Resort", type: "Architecture", year: "2024", bg: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80" },
    { label: "Grand Indonesia", project: "Minimalist Retail", type: "Interior", year: "2025", bg: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=800&q=80" },
    { label: "Bintaro Home", project: "Family Residence", type: "Construction", year: "2025", bg: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80" },
    { label: "Pondok Indah", project: "Classic Modern", type: "Interior", year: "2025", bg: "https://images.unsplash.com/photo-1600566753190-17f0bb2a6c3e?auto=format&fit=crop&w=800&q=80" },
  ];

  const [activeFilter, setActiveFilter] = useState("All Projects");
  const filteredWorks = activeFilter === "All Projects" ? works : works.filter(w => w.type === activeFilter);

  return (
    <div style={{ paddingTop: 80 }}>
      <div className="section-pad reveal" style={{ padding: "48px 48px 64px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16, flexWrap: "wrap", gap: 20 }}>
          <h1 className="heading-large" style={{ fontWeight: 700, fontSize: "clamp(40px,6vw,64px)", letterSpacing: "-0.02em", textTransform: "uppercase" }}>Works</h1>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <select 
              value={activeFilter}
              onChange={(e) => setActiveFilter(e.target.value)}
              style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, border: "none", borderBottom: `1px solid ${TOKENS.textPrimary}`, padding: "4px 8px", background: "transparent", cursor: "pointer", outline: "none" }}
            >
              <option>All Projects</option>
              <option>Architecture</option>
              <option>Interior</option>
              <option>Landscape</option>
              <option>Full Build</option>
              <option>Construction</option>
            </select>
          </div>
        </div>
        <p style={{ fontSize: 13, color: TOKENS.textBody, lineHeight: 1.8, maxWidth: 480, marginBottom: 40, fontWeight: 300 }}>
          We work with a wide range of clients on various custom projects ranging from residential villas to commercial office spaces. We strive to create innovative solutions for every unique challenge.
        </p>

        <div className="grid-4" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 2 }}>
          {filteredWorks.map((w, i) => (
            <div key={i} className="reveal-child reveal" style={{ cursor: "pointer" }}>
              <div className="img-zoom-wrap">
                <div className="img-inner" style={{ background: `url(${w.bg})`, backgroundSize: 'cover', backgroundPosition: 'center', aspectRatio: "1/1", width: "100%" }} />
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: TOKENS.textMuted, padding: "8px 0 2px" }}>
                <span>{w.label}</span><span>{w.year}</span>
              </div>
              {w.project && <div style={{ fontSize: 14, color: TOKENS.textPrimary, paddingBottom: 16, fontWeight: 500 }}>{w.project}</div>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function LogsPage() {
  const tabs = ["Architecture", "Interior", "News", "Ideas", "Project"];
  const [activeTab, setActiveTab] = useState("Architecture");

  const logs = [
    { cat: "Architecture", date: "20 Mar 2026", title: "The Future of Sustainable Living", excerpt: "Exploring how DIEGMA integrates green technology and sustainable materials into modern residential architecture for a better future. We focus on energy efficiency and low-impact construction.", img: "https://images.unsplash.com/photo-1518005020250-6859b2827c6d?auto=format&fit=crop&w=800&q=80" },
    { cat: "Interior", date: "10 Feb 2026", title: "Minimalism: More Than Just Less", excerpt: "Why minimalist design is about intentionality and how it improves daily well-being through thoughtful space planning and a focus on essential elements.", img: "https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?auto=format&fit=crop&w=800&q=80" },
    { cat: "News", date: "15 Jan 2026", title: "Excellence in Design 2025", excerpt: "We are honored to receive recognition for our work on the Uluwatu Villa project at the annual Architecture Awards. This award reflects our commitment to innovation.", img: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80" },
    { cat: "Ideas", date: "05 Dec 2025", title: "Choosing the Right Materials", excerpt: "A guide to selecting sustainable and durable materials for your next construction project, from foundation to finish. Quality materials are the backbone of any great design.", img: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=800&q=80" },
    { cat: "Project", date: "12 Nov 2025", title: "Behind the Scenes: SCBD Office", excerpt: "A deep dive into the planning and execution of one of Jakarta's most modern and efficient office spaces. We explore the challenges of high-rise interior construction.", img: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80" },
    { cat: "Architecture", date: "24 Oct 2025", title: "Urban Density Solutions", excerpt: "How we design functional living spaces in high-density urban environments without sacrificing comfort or aesthetic appeal.", img: "https://images.unsplash.com/photo-1449156001437-3a144f007355?auto=format&fit=crop&w=800&q=80" },
    { cat: "Interior", date: "16 Aug 2025", title: "The Power of Natural Light", excerpt: "Every piece of our design considers the path of the sun. Natural light enhances the mood and reduces energy consumption in modern homes.", img: "https://images.unsplash.com/photo-1507652313519-d4e9174996dd?auto=format&fit=crop&w=800&q=80" },
    { cat: "News", date: "17 Jul 2025", title: "New Studio Opening", excerpt: "We are excited to announce the opening of our new design studio in South Jakarta. Come visit us to discuss your next dream project.", img: "https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=800&q=80" },
    { cat: "News", date: "10 Jan 2026", title: "DIEGMA at BDD 2025", excerpt: "We participated in Bintaro Design District 2025 with our latest architectural concepts and custom furniture pieces...", img: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=800&q=80" },
    { cat: "Ideas", date: "05 Dec 2025", title: "On Modern Living", excerpt: "The philosophy behind designing spaces that adapt to the changing needs of modern families and professionals.", img: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80" },
  ];

  const filtered = logs.filter(l => l.cat === activeTab);

  return (
    <div style={{ paddingTop: 80 }}>
      {/* Tab bar */}
      <div style={{ borderBottom: `1px solid ${TOKENS.border}`, display: "flex" }}>
        {tabs.map(t => (
          <button key={t} className={`tab-btn ${activeTab === t ? "active" : ""}`} onClick={() => setActiveTab(t)}>{t}</button>
        ))}
      </div>

      <div className="section-pad reveal" style={{ padding: "48px 48px 64px" }}>
        <h1 className="heading-large" style={{ fontWeight: 700, fontSize: "clamp(40px,6vw,64px)", letterSpacing: "-0.02em", textTransform: "uppercase", marginBottom: 8 }}>Logs</h1>
        <p style={{ fontSize: 13, color: TOKENS.textMuted, marginBottom: 48 }}>Explore insights, stories, and updates from our studio, crafted to inspire and inform.</p>

        <div className="grid-4-logs" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 32 }}>
          {filtered.map((l, i) => (
            <div key={i} className="reveal-child reveal" style={{ cursor: "pointer" }}>
              <div className="img-zoom-wrap" style={{ aspectRatio: "3/2", marginBottom: 12 }}>
                <div className="img-inner" style={{ width: "100%", height: "100%", backgroundImage: `url(${l.img})`, backgroundSize: "cover", backgroundPosition: "center" }} />
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: TOKENS.textMuted, marginBottom: 6 }}>
                <span>{l.cat}</span><span>{l.date}</span>
              </div>
              <div style={{ fontSize: 16, fontWeight: 600, color: TOKENS.textPrimary, marginBottom: 4, lineHeight: 1.3 }}>{l.title}</div>
              <div style={{ fontSize: 12, color: TOKENS.textBody, lineHeight: 1.7, marginBottom: 8, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{l.excerpt}</div>
              <span style={{ fontSize: 12, color: TOKENS.textPrimary, textDecoration: "underline", textUnderlineOffset: 3 }}>Read more</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function AboutPage() {
  const team = [
    ["SAEP", "CEO, Founder"],
    ["SAEP", "CMO"],
    ["SAEP", "Project Manager"],
    ["SAEP", "Production Leader"],
    ["SAEP", "Production"],
    ["SAEP", "Production"],
    ["SAEP", "Production"],
    ["SAEP", "Product Designer"],
    ["SAEP", "Interior Designer"],
    ["SAEP", "Finance"],
  ];

  return (
    <div style={{ paddingTop: 80 }}>
      <div className="section-pad reveal" style={{ padding: "64px 48px" }}>

        {/* Brand intro */}
        <h1 className="about-heading reveal-child" style={{ fontWeight: 600, fontSize: "clamp(24px,4vw,40px)", color: TOKENS.textPrimary, lineHeight: 1.2, maxWidth: 560, marginBottom: 40 }}>
          Well-Designed Flatpack &<br />Bespoke Furniture
        </h1>
        <div className="two-col reveal-child" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 64, marginBottom: 64 }}>
          <p style={{ fontSize: 13, color: TOKENS.textBody, lineHeight: 1.9, fontWeight: 300 }}>DIEGMA adalah studio arsitektur dan desain interior premium di Jakarta yang menawarkan jasa desain, konstruksi, dan furniture custom dengan pendekatan modern dan inovatif.</p>
          <p style={{ fontSize: 13, color: TOKENS.textBody, lineHeight: 1.9, fontWeight: 300 }}>Kami berdedikasi untuk menciptakan ruang yang tidak hanya indah secara visual tetapi juga memberikan kenyamanan maksimal bagi penghuninya. Berbasis di Jakarta, Indonesia.</p>
        </div>

        {/* Studio photos */}
        <div className="reveal-child" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 4, marginBottom: 96 }}>
          <div style={{ backgroundImage: "url(https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80)", backgroundSize: "cover", backgroundPosition: "center", aspectRatio: "4/3" }} />
          <div style={{ backgroundImage: "url(https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=800&q=80)", backgroundSize: "cover", backgroundPosition: "center", aspectRatio: "4/3" }} />
        </div>

        {/* Peoples section */}
        <div className="two-col reveal" style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: 64, marginBottom: 96 }}>
          <h2 style={{ fontWeight: 700, fontSize: "clamp(32px,5vw,48px)", textTransform: "uppercase", letterSpacing: "-0.02em", color: TOKENS.textPrimary }}>Peoples</h2>
          <div>
            <p style={{ fontSize: 13, color: TOKENS.textBody, lineHeight: 1.9, fontWeight: 300, marginBottom: 32 }}>
              Introducing our furniture team! Our team of skilled designers and craftsmen are dedicated to bringing your vision to life with beautifully crafted furniture that meets your unique needs and style preferences.
            </p>
            {team.map(([name, role], i) => (
              <div key={i} className="reveal-child reveal" style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: `1px solid ${TOKENS.border}`, fontSize: 13 }}>
                <span style={{ color: TOKENS.textPrimary }}>{name}</span>
                <span style={{ color: TOKENS.textMuted }}>{role}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Contact section */}
        <div className="two-col reveal" style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: 64, marginBottom: 96 }}>
          <div>
            <h2 style={{ fontWeight: 700, fontSize: "clamp(32px,5vw,48px)", textTransform: "uppercase", letterSpacing: "-0.02em", color: TOKENS.textPrimary, marginBottom: 24 }}>Contact</h2>
            {["Jakarta, Indonesia", "", "+62 812 3924 3317", "diegma9@gmail.com"].map((t, i) => (
              <div key={i} style={{ fontSize: 13, color: t ? TOKENS.textBody : "transparent", lineHeight: 2, fontWeight: 300 }}>{t || "."}</div>
            ))}
          </div>
          {/* Google Maps placeholder */}
          <div style={{ background: "#E0E8EE", height: 300, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, color: "#888", fontFamily: "'Inter', sans-serif" }}>
            Google Maps — WOF Wooden, Malang
          </div>
        </div>

      </div>
    </div>
  );
}

// --- Main App ---

export default function App() {
  const [currentPage, setCurrentPage] = useState("home");

  // Inject Google Fonts
  useEffect(() => {
    const link = document.createElement("link");
    link.href = "https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap";
    link.rel = "stylesheet";
    document.head.appendChild(link);
  }, []);

  // Inject global styles
  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = `
      * { box-sizing: border-box; margin: 0; padding: 0; }
      body { font-family: 'Inter', sans-serif; background: #fff; overflow-x: hidden; }
      html { scroll-behavior: smooth; }

      .reveal {
        opacity: 0;
        transform: translateY(24px);
        transition: opacity 0.8s cubic-bezier(0.25,0.46,0.45,0.94),
                    transform 0.8s cubic-bezier(0.25,0.46,0.45,0.94);
      }
      .reveal.visible {
        opacity: 1;
        transform: translateY(0);
      }

      .img-zoom-wrap { overflow: hidden; position: relative; }
      .img-zoom-wrap .img-inner {
        transition: transform 0.6s cubic-bezier(0.25,0.46,0.45,0.94);
      }
      .img-zoom-wrap:hover .img-inner {
        transform: scale(1.05);
      }

      .nav-link {
        position: relative;
        text-decoration: none;
        color: #111;
        font-size: 13px;
        cursor: pointer;
        padding-bottom: 2px;
      }
      .nav-link::after {
        content: '';
        position: absolute;
        bottom: 0; left: 0;
        width: 100%; height: 1.5px;
        background: #111;
        transform: scaleX(0);
        transform-origin: left;
        transition: transform 0.25s ease;
      }
      .nav-link:hover::after { transform: scaleX(1); }
      .nav-link.active::after { transform: scaleX(1); }

      .tab-btn {
        padding: 12px 24px;
        border: none;
        background: transparent;
        color: #888;
        font-family: 'Inter', sans-serif;
        font-size: 12px;
        font-weight: 500;
        letter-spacing: 0.05em;
        cursor: pointer;
        transition: all 0.3s;
        border-bottom: 1px solid transparent;
      }
      .tab-btn.active {
        background: #111;
        color: #fff;
      }

      .cta-btn {
        display: inline-block;
        padding: 12px 32px;
        border: 1px solid #111;
        background: transparent;
        color: #111;
        font-family: 'Inter', sans-serif;
        font-size: 11px;
        font-weight: 500;
        letter-spacing: 0.1em;
        text-transform: uppercase;
        cursor: pointer;
        transition: all 0.3s;
      }
      .cta-btn:hover { background: #111; color: #fff; }

      .footer-link {
        color: #666;
        font-size: 13px;
        font-weight: 400;
        cursor: pointer;
        display: block;
        line-height: 2.2;
        text-decoration: none;
        transition: color 0.2s;
      }
      .footer-link:hover { color: #aaa; }

      .hide-scrollbar::-webkit-scrollbar { display: none; }
      .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }

      .slider-arrow:hover {
        background: #111 !important;
        color: #fff !important;
      }

      .client-logo:hover {
        opacity: 1 !important;
        filter: grayscale(0%) contrast(1) !important;
      }

      @media (max-width: 768px) {
        .navbar-container { padding: 18px 24px !important; }
        .desktop-nav { display: none !important; }
        .hamburger { display: flex !important; }
        .grid-4 { grid-template-columns: repeat(2, 1fr) !important; }
        .grid-4-logs { grid-template-columns: repeat(1, 1fr) !important; }
        .two-col { grid-template-columns: 1fr !important; gap: 32px !important; }
        .logs-home-grid { grid-template-columns: 1fr !important; }
        .logs-small-grid { grid-template-columns: 1fr 1fr !important; }
        .footer-grid { grid-template-columns: 1fr 1fr !important; }
        .section-pad { padding: 48px 24px !important; }
      }

      @media (max-width: 480px) {
        .grid-4 { grid-template-columns: 1fr !important; }
        .logs-small-grid { grid-template-columns: 1fr !important; }
        .footer-grid { grid-template-columns: 1fr !important; }
      }
    `;
    document.head.appendChild(style);
  }, []);

  // Scroll reveal
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            // stagger children
            const children = entry.target.querySelectorAll(".reveal-child");
            children.forEach((child, i) => {
              setTimeout(() => child.classList.add("visible"), i * 100);
            });
          }
        });
      },
      { threshold: 0.1 }
    );
    document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [currentPage]);

  const renderPage = () => {
    switch (currentPage) {
      case "home": return <HomePage setCurrentPage={setCurrentPage} />;
      case "products": return <ProductsPage />;
      case "works": return <WorksPage />;
      case "logs": return <LogsPage />;
      case "about": return <AboutPage />;
      default: return <HomePage setCurrentPage={setCurrentPage} />;
    }
  };

  return (
    <div style={{ fontFamily: "'Inter', sans-serif", background: TOKENS.bg, minHeight: "100vh" }}>
      <Navbar currentPage={currentPage} setCurrentPage={setCurrentPage} />
      <main>{renderPage()}</main>
      <Footer setCurrentPage={setCurrentPage} />
    </div>
  );
}
