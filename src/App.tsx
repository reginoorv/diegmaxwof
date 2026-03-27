import React, { useState, useEffect, useRef } from "react";
import { 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  signOut,
  User
} from "firebase/auth";
import { 
  collection, 
  onSnapshot, 
  doc, 
  setDoc, 
  addDoc, 
  deleteDoc, 
  query, 
  orderBy,
  getDoc,
  getDocs,
  getDocFromServer
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { auth, db, storage } from "./firebase";

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * WOF WOODEN CLONE - Minimal Furniture & Design Studio
 * Built as a single-component React application.
 */

const ADMIN_EMAIL = "inoterastudio@gmail.com";

const TOKENS = {
  bg: "#FFFFFF",
  textPrimary: "#111111",
  textBody: "#444444",
  textMuted: "#888888",
  border: "#EEEEEE",
  footerBg: "#0A0A0A",
  surface: "#F9F9F9"
};

const LOGS = [];

const WORKS = [];

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

  const pages = ["produk", "karya", "catatan", "tentang"];

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
            className={`nav-link ${currentPage === (p === "produk" ? "products" : p === "karya" ? "works" : p === "catatan" ? "logs" : p === "tentang" ? "about" : p) ? "active" : ""}`}
            onClick={() => { 
              const pageKey = p === "produk" ? "products" : p === "karya" ? "works" : p === "catatan" ? "logs" : p === "tentang" ? "about" : p;
              setCurrentPage(pageKey); 
              window.scrollTo(0, 0); 
            }}
          >
            {p.charAt(0).toUpperCase() + p.slice(1)}
            {p === "produk" && " ▾"}
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
            <span key={p} onClick={() => { 
              const pageKey = p === "produk" ? "products" : p === "karya" ? "works" : p === "catatan" ? "logs" : p === "tentang" ? "about" : p;
              setCurrentPage(pageKey); 
              setMobileOpen(false); 
              window.scrollTo(0, 0); 
            }}
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
  const productLinks = ["Semua Produk", "Stool", "Bangku", "Kursi", "Meja", "Rak"];

  return (
    <footer style={{ background: TOKENS.footerBg, padding: "64px 48px 32px", fontFamily: "'Inter', sans-serif" }}>
      <div className="footer-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 40, marginBottom: 48 }}>

        {/* Col 1 — Brand */}
        <div>
          <div style={{ fontWeight: 700, letterSpacing: "0.3em", fontSize: 18, color: "#fff", marginBottom: 20 }}>D I E G M A</div>
          <div style={{ color: "#666", fontSize: 11, lineHeight: 2 }}>
            <div>© 2026 - DIEGMA</div>
            <div>Hak Cipta Dilindungi.</div>
            <div>Jakarta, Indonesia</div>
          </div>
        </div>

        {/* Col 2 — Products */}
        <div>
          <div style={{ color: "#fff", fontSize: 13, fontWeight: 500, marginBottom: 12 }}>Produk</div>
          {productLinks.map(l => (
            <a key={l} className="footer-link" onClick={() => { setCurrentPage("products"); window.scrollTo(0, 0); }}>{l}</a>
          ))}
        </div>

        {/* Col 3 — Contact */}
        <div>
          <div style={{ color: "#fff", fontSize: 13, fontWeight: 500, marginBottom: 12 }}>Kontak</div>
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
            Daftar untuk mendapatkan<br />informasi terbaru
          </div>
          <div style={{ display: "flex", gap: 0, borderBottom: "1px solid #333" }}>
            <input placeholder="Email" style={{
              flex: 1, background: "transparent", border: "none", color: "#aaa",
              fontSize: 12, padding: "8px 0", outline: "none", fontFamily: "'Inter', sans-serif",
            }} />
            <button style={{
              background: "transparent", border: "none",
              color: "#aaa", fontSize: 12, padding: "8px 0", cursor: "pointer", fontFamily: "'Inter', sans-serif",
            }}>Berlangganan</button>
          </div>
        </div>
      </div>
    </footer>
  );
}

function HeroSlider({ slides }) {
  const [slide, setSlide] = useState(0);
  const displaySlides = slides && slides.length > 0 ? slides : [];

  useEffect(() => {
    if (displaySlides.length === 0) return;
    const t = setTimeout(() => setSlide((s) => (s + 1) % displaySlides.length), 5000);
    return () => clearTimeout(t);
  }, [slide, displaySlides.length]);

  return (
    <div style={{ position: "relative", width: "100%", height: "85vh", background: "#000", overflow: "hidden" }}>
      {displaySlides.map((s, i) => {
        const imgUrl = typeof s === "string" ? s : s.imageUrl || s.img;

        return (
          <div key={i} style={{
            position: "absolute", inset: 0,
            opacity: i === slide ? 1 : 0,
            transition: "opacity 1.5s ease-in-out",
            zIndex: i === slide ? 1 : 0
          }}>
            <div style={{
              position: "absolute", inset: 0,
              backgroundImage: `url(${imgUrl})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              transform: i === slide ? "scale(1.05)" : "scale(1)",
              transition: "transform 6s ease-out"
            }} />
            <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.2)" }} />
          </div>
        );
      })}
      {/* Arrows */}
      {displaySlides.length > 1 && [["‹", -1, "left"], ["›", 1, "right"]].map(([arrow, dir, side]) => (
        <button key={side} onClick={() => setSlide((s) => (s + displaySlides.length + dir) % displaySlides.length)}
          className="slider-arrow"
          style={{
            position: "absolute", [side as any]: 24, top: "50%", transform: "translateY(-50%)",
            width: 40, height: 40, borderRadius: "50%", border: `1px solid ${TOKENS.border}`,
            background: "#fff", fontSize: 18, cursor: "pointer", zIndex: 2,
            transition: "all 0.2s", display: "flex", alignItems: "center", justifyContent: "center"
          }}>
          {arrow}
        </button>
      ))}
      {/* Dots */}
      {displaySlides.length > 1 && (
        <div style={{ position: "absolute", bottom: 20, left: "50%", transform: "translateX(-50%)", display: "flex", gap: 8, zIndex: 2 }}>
          {displaySlides.map((_, i) => (
            <div key={i} onClick={() => setSlide(i)} style={{ width: 6, height: 6, borderRadius: "50%", background: i === slide ? "#111" : "#CCC", cursor: "pointer", transition: "background 0.2s" }} />
          ))}
        </div>
      )}
    </div>
  );
}

function HomePage({ setCurrentPage, setSelectedLog, setSelectedWork, heroData, worksData, logsData }) {
  const handleLogClick = (log) => {
    setSelectedLog(log);
    setCurrentPage("log-detail");
    window.scrollTo(0, 0);
  };

  const handleWorkClick = (work) => {
    setSelectedWork(work);
    setCurrentPage("work-detail");
    window.scrollTo(0, 0);
  };

  const displayLogs = logsData && logsData.length > 0 ? logsData : LOGS;
  const displayWorks = worksData && worksData.length > 0 ? worksData : WORKS;

  return (
    <div>
      <HeroSlider slides={heroData} />

      {/* Brand description */}
      <div className="section-pad two-col reveal" style={{ padding: "80px 48px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 64 }}>
        <p style={{ fontWeight: 400, fontSize: 16, color: TOKENS.textPrimary, lineHeight: 1.6 }}>DIEGMA adalah studio arsitektur dan desain interior premium di Jakarta yang menawarkan jasa desain, konstruksi, dan furniture custom dengan pendekatan modern dan inovatif.</p>
        <p style={{ fontWeight: 300, fontSize: 14, color: TOKENS.textBody, lineHeight: 1.8 }}>Kami percaya bahwa setiap ruang memiliki cerita unik. Melalui kolaborasi antara arsitek dan desainer interior, kami menciptakan solusi hunian yang fungsional, estetis, dan berkelanjutan.</p>
      </div>

      {/* Products section -> Services */}
      <div className="section-pad reveal" style={{ padding: "80px 48px" }}>
        <h2 className="heading-large" style={{ fontWeight: 700, fontSize: "clamp(40px,6vw,48px)", letterSpacing: "-0.02em", textTransform: "uppercase", marginBottom: 48 }}>Layanan</h2>
        <div className="services-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 48 }}>
          {[
            { 
              name: "Desain Interior & Eksterior", 
              desc: "Layanan desain komprehensif untuk menciptakan ruang yang fungsional, estetis, dan sesuai dengan kebutuhan Anda.",
              benefits: [
                "Desain yang disesuaikan dengan kebutuhan dan gaya hidup Anda",
                "Pendekatan holistik yang menggabungkan estetika dan fungsionalitas",
                "Penggunaan material berkualitas tinggi dengan perhatian pada detail",
                "Proses kolaboratif yang melibatkan Anda dalam setiap tahapan"
              ],
              img: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=80"
            },
            { 
              name: "Konstruksi", 
              desc: "Implementasi proyek yang profesional dengan fokus pada kualitas, efisiensi, dan kepatuhan terhadap standar keamanan.",
              benefits: [
                "Manajemen proyek yang efisien dan tepat waktu",
                "Tim berpengalaman dengan keahlian teknis tinggi",
                "Kepatuhan terhadap standar keamanan dan kualitas",
                "Komunikasi transparan selama proses konstruksi"
              ],
              img: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1200&q=80"
            },
            { 
              name: "Furniture", 
              desc: "Desain dan produksi furniture custom yang menggabungkan estetika, fungsionalitas, dan kualitas terbaik.",
              benefits: [
                "Desain furniture yang sesuai dengan ruang and kebutuhan spesifik",
                "Penggunaan material berkualitas tinggi dan tahan lama",
                "Keahlian craftsmanship dengan perhatian pada detail",
                "Kombinasi sempurna antara estetika dan fungsi"
              ],
              img: "https://images.unsplash.com/photo-1595428774223-ef52624120d2?auto=format&fit=crop&w=1200&q=80"
            },
          ].map((s, i) => (
            <div key={i} className="reveal-child reveal" style={{ display: "flex", flexDirection: "column" }}>
              <div className="img-zoom-wrap" style={{ background: TOKENS.surface, aspectRatio: "16/10", width: "100%", marginBottom: 24 }}>
                <div className="img-inner" style={{ width: "100%", height: "100%", backgroundImage: `url(${s.img})`, backgroundSize: "cover", backgroundPosition: "center" }} />
              </div>
              <h3 style={{ fontSize: 20, fontWeight: 600, color: TOKENS.textPrimary, marginBottom: 12 }}>{s.name}</h3>
              <p style={{ fontSize: 14, color: TOKENS.textBody, lineHeight: 1.6, marginBottom: 24, fontWeight: 300 }}>{s.desc}</p>
              
              <div style={{ marginTop: "auto" }}>
                <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: TOKENS.textMuted, marginBottom: 12, borderBottom: `1px solid ${TOKENS.border}`, paddingBottom: 8 }}>Keuntungan</div>
                <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                  {s.benefits.map((b, bi) => (
                    <li key={bi} style={{ fontSize: 12, color: TOKENS.textBody, marginBottom: 8, display: "flex", gap: 12, alignItems: "flex-start", lineHeight: 1.5 }}>
                      <span style={{ color: TOKENS.textPrimary, fontWeight: 700 }}>•</span>
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Logs section */}
      <div className="section-pad reveal" style={{ padding: "64px 48px" }}>
        <h2 className="heading-large" style={{ fontWeight: 700, fontSize: "clamp(40px,6vw,48px)", letterSpacing: "-0.02em", textTransform: "uppercase", marginBottom: 8 }}>Catatan</h2>
        <p style={{ fontSize: 13, color: TOKENS.textMuted, marginBottom: 32 }}>Jelajahi wawasan, cerita, dan pembaruan dari studio kami, yang dibuat untuk menginspirasi dan memberi informasi.</p>
        
        <div className="logs-home-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
          {/* Big card */}
          {displayLogs[0] && (
            <div className="reveal-child reveal" style={{ cursor: "pointer" }} onClick={() => handleLogClick(displayLogs[0])}>
              <div className="img-zoom-wrap" style={{ aspectRatio: "4/3", marginBottom: 12 }}>
                <div className="img-inner" style={{ width: "100%", height: "100%", backgroundImage: `url(${displayLogs[0].img})`, backgroundSize: "cover", backgroundPosition: "center" }} />
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: TOKENS.textMuted, marginBottom: 6 }}>
                <span>{displayLogs[0].cat}</span><span>{displayLogs[0].date}</span>
              </div>
              <div style={{ fontSize: 18, fontWeight: 600, color: TOKENS.textPrimary, marginBottom: 6 }}>{displayLogs[0].title}</div>
              <div style={{ fontSize: 12, color: TOKENS.textBody, lineHeight: 1.7, marginBottom: 8 }}>{displayLogs[0].excerpt}</div>
              <span style={{ fontSize: 12, color: TOKENS.textPrimary, textDecoration: "underline", textUnderlineOffset: 3, cursor: "pointer" }}>Baca selengkapnya</span>
            </div>
          )}
          {/* 2x2 small cards */}
          <div className="logs-small-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            {displayLogs.slice(1, 5).map((l, i) => (
              <div key={i} className="reveal-child reveal" style={{ cursor: "pointer" }} onClick={() => handleLogClick(l)}>
                <div className="img-zoom-wrap" style={{ aspectRatio: "3/2", marginBottom: 8 }}>
                  <div className="img-inner" style={{ width: "100%", height: "100%", backgroundImage: `url(${l.img})`, backgroundSize: "cover", backgroundPosition: "center" }} />
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, color: TOKENS.textMuted, marginBottom: 4 }}>
                  <span>{l.cat}</span><span>{l.date}</span>
                </div>
                <div style={{ fontSize: 13, fontWeight: 600, color: TOKENS.textPrimary, marginBottom: 4 }}>{l.title}</div>
                <span style={{ fontSize: 11, color: TOKENS.textPrimary, textDecoration: "underline", textUnderlineOffset: 3, cursor: "pointer" }}>Baca selengkapnya</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Works section */}
      <div className="section-pad reveal" style={{ padding: "64px 48px" }}>
        <h2 className="heading-large" style={{ fontWeight: 700, fontSize: "clamp(40px,6vw,48px)", letterSpacing: "-0.02em", textTransform: "uppercase", marginBottom: 32 }}>Karya</h2>
        <div className="grid-4" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 2 }}>
          {displayWorks.slice(0, 4).map((w, i) => (
            <div key={i} className="reveal-child reveal work-card" onClick={() => handleWorkClick(w)} style={{ cursor: "pointer", position: "relative" }}>
              <div className="img-zoom-wrap">
                <div className="img-inner" style={{ backgroundImage: `url(${w.bg || w.imageUrl || w.img})`, backgroundSize: "cover", backgroundPosition: "center", aspectRatio: "1/1", width: "100%" }} />
                <div className="work-overlay">
                  <span style={{ fontSize: 10, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em" }}>Lihat Proyek</span>
                </div>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 0" }}>
                <div style={{ fontSize: 13, color: TOKENS.textPrimary, fontWeight: 500 }}>{w.label || w.title}</div>
                <div style={{ width: 24, height: 24, border: `1px solid ${TOKENS.border}`, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.3s" }} className="work-arrow">
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="7" y1="17" x2="17" y2="7"></line><polyline points="7 7 17 7 17 17"></polyline></svg>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* The Metric Bento Section */}
      <div className="section-pad reveal" style={{ padding: "120px 48px", borderTop: `1px solid ${TOKENS.border}`, backgroundColor: TOKENS.surface }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, marginBottom: 80, alignItems: "end" }}>
          <div>
            <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.2em", color: TOKENS.textMuted, textTransform: "uppercase", marginBottom: 24 }} className="reveal-child">Pencapaian Kami</div>
            <h2 style={{ fontWeight: 700, fontSize: "clamp(32px, 5vw, 48px)", color: TOKENS.textPrimary, lineHeight: 1.1, letterSpacing: "-0.03em" }} className="reveal-child">
              Dedikasi Dalam <br/>Setiap Detail.
            </h2>
          </div>
          <p style={{ fontSize: 15, color: TOKENS.textMuted, lineHeight: 1.8, maxWidth: 400, fontWeight: 300 }} className="reveal-child">
            Selama lebih dari satu dekade, DIEGMA telah bertransformasi dari studio kecil menjadi mitra desain terpercaya bagi ratusan klien di seluruh Indonesia.
          </p>
        </div>

        <div className="reveal-child metric-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 1, backgroundColor: TOKENS.border, border: `1px solid ${TOKENS.border}` }}>
          {[
            { num: "12+", label: "Tahun Pengalaman", desc: "Konsistensi dalam kualitas sejak 2014." },
            { num: "150+", label: "Proyek Selesai", desc: "Mencakup residensial hingga komersial." },
            { num: "24", label: "Penghargaan", desc: "Pengakuan atas inovasi dan estetika." },
            { num: "100%", label: "Kepuasan Klien", desc: "Fokus utama pada visi dan kebutuhan klien." }
          ].map((m, i) => (
            <div key={i} style={{ padding: "48px 32px", backgroundColor: "#fff", transition: "all 0.4s" }} className="metric-card">
              <div style={{ fontSize: 40, fontWeight: 700, color: TOKENS.textPrimary, marginBottom: 16, letterSpacing: "-0.04em" }}>{m.num}</div>
              <div style={{ fontSize: 13, fontWeight: 600, color: TOKENS.textPrimary, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 12 }}>{m.label}</div>
              <div style={{ fontSize: 12, color: TOKENS.textMuted, lineHeight: 1.6, fontWeight: 300 }}>{m.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ProductsPage({ setCurrentPage, setSelectedProduct, productsData }) {
  const categories = ["Semua", "Interior & Eksterior", "Konstruksi", "Furnitur"];
  const [activeTab, setActiveTab] = useState("Semua");

  useEffect(() => {
    // Re-trigger reveal for new items
    const timer = setTimeout(() => {
      const revealElements = document.querySelectorAll(".products-grid .reveal");
      revealElements.forEach(el => {
        el.classList.add("visible");
        const children = el.querySelectorAll(".reveal-child");
        children.forEach((child, i) => {
          setTimeout(() => child.classList.add("visible"), i * 50);
        });
      });
    }, 100);
    return () => clearTimeout(timer);
  }, [activeTab]);

  const allProducts = productsData && productsData.length > 0 ? productsData : [];

  const filtered = activeTab === "Semua" ? allProducts : allProducts.filter(p => p.cat === activeTab);

  const handleProductClick = (product) => {
    setSelectedProduct(product);
    setCurrentPage("product-detail");
    window.scrollTo(0, 0);
  };

  return (
    <div style={{ paddingTop: 80 }}>
      {/* Tab bar */}
      <div style={{ borderBottom: `1px solid ${TOKENS.border}`, display: "flex", overflowX: "auto", whiteSpace: "nowrap", marginTop: 24 }} className="hide-scrollbar filter-bar">
        {categories.map(c => (
          <button 
            key={c} 
            className={`tab-btn ${activeTab === c ? "active" : ""}`} 
            onClick={() => setActiveTab(c)}
            style={{ transition: "all 0.4s cubic-bezier(0.16, 1, 0.3, 1)" }}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="section-pad reveal" style={{ padding: "64px 48px 120px" }}>
        <div style={{ marginBottom: 48 }}>
          <h1 className="heading-large reveal-child" style={{ fontWeight: 700, fontSize: "clamp(40px,6vw,64px)", letterSpacing: "-0.02em", textTransform: "uppercase", marginBottom: 16 }}>Produk Kami</h1>
          <p className="reveal-child" style={{ fontSize: 14, color: TOKENS.textMuted, maxWidth: 600, lineHeight: 1.6 }}>
            Kami menawarkan berbagai solusi desain dan konstruksi yang dapat disesuaikan dengan kebutuhan Anda, mulai dari paket desain interior hingga furnitur kustom berkualitas tinggi.
          </p>
        </div>

        <div key={activeTab} className="grid-4 reveal products-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 2 }}>
          {filtered.map((p, i) => (
            <div 
              key={i} 
              className="reveal-child reveal product-card" 
              onClick={() => handleProductClick(p)}
              style={{ cursor: "pointer", border: `1px solid ${TOKENS.border}`, padding: 24, background: "#fff", transition: "all 0.3s" }}
            >
              <div className="img-zoom-wrap" style={{ marginBottom: 20 }}>
                <div className="img-inner" style={{ backgroundImage: `url(${p.img})`, backgroundSize: "cover", backgroundPosition: "center", aspectRatio: "1/1", width: "100%" }} />
              </div>
              <div style={{ fontSize: 11, color: TOKENS.textMuted, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 8 }}>{p.cat}</div>
              <div style={{ fontSize: 16, fontWeight: 600, color: TOKENS.textPrimary, marginBottom: 8, lineHeight: 1.3 }}>{p.name}</div>
              <div style={{ fontSize: 13, color: TOKENS.textBody, fontWeight: 300 }}>{p.price}</div>
              
              <div style={{ marginTop: 24, paddingTop: 16, borderTop: `1px solid ${TOKENS.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: 11, fontWeight: 600, textTransform: "uppercase", color: TOKENS.textPrimary }}>Detail</span>
                <div className="product-arrow" style={{ width: 32, height: 32, border: `1px solid ${TOKENS.border}`, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.3s" }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function WorksPage({ setCurrentPage, setSelectedWork, worksData }) {
  const categories = ["Semua Proyek", "Interior & Eksterior", "Konstruksi", "Furnitur"];
  const [activeFilter, setActiveFilter] = useState("Semua Proyek");

  const handleWorkClick = (work) => {
    setSelectedWork(work);
    setCurrentPage("work-detail");
    window.scrollTo(0, 0);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      const revealElements = document.querySelectorAll(".grid-works .reveal");
      revealElements.forEach(el => {
        el.classList.add("visible");
        const children = el.querySelectorAll(".reveal-child");
        children.forEach((child, i) => {
          setTimeout(() => child.classList.add("visible"), i * 50);
        });
      });
    }, 100);
    return () => clearTimeout(timer);
  }, [activeFilter]);

  const displayWorks = worksData && worksData.length > 0 ? worksData : WORKS;
  const filteredWorks = activeFilter === "Semua Proyek" ? displayWorks : displayWorks.filter(w => (w.category || w.type) === activeFilter);

  return (
    <div style={{ paddingTop: 80 }}>
      {/* Filter Bar */}
      <div style={{ borderBottom: `1px solid ${TOKENS.border}`, display: "flex", overflowX: "auto", whiteSpace: "nowrap", marginTop: 24 }} className="hide-scrollbar filter-bar">
        {categories.map(c => (
          <button 
            key={c} 
            className={`tab-btn ${activeFilter === c ? "active" : ""}`} 
            onClick={() => setActiveFilter(c)}
            style={{ transition: "all 0.4s cubic-bezier(0.16, 1, 0.3, 1)" }}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="section-pad reveal" style={{ padding: "64px 48px 120px" }}>
        <div style={{ marginBottom: 64 }}>
          <h1 className="heading-large reveal-child" style={{ fontWeight: 700, fontSize: "clamp(40px,6vw,64px)", letterSpacing: "-0.02em", textTransform: "uppercase", marginBottom: 16 }}>Karya Terpilih</h1>
          <p className="reveal-child" style={{ fontSize: 14, color: TOKENS.textMuted, maxWidth: 600, lineHeight: 1.8 }}>
            Kumpulan proyek pilihan kami yang mencakup desain arsitektur, interior, hingga konstruksi bangunan. Setiap karya adalah wujud kolaborasi antara visi klien dan keahlian teknis kami.
          </p>
        </div>

        <div className="grid-works reveal" style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 48 }}>
          {filteredWorks.map((w, i) => (
            <div key={i} className="reveal-child reveal work-card" onClick={() => handleWorkClick(w)} style={{ cursor: "pointer", position: "relative" }}>
              <div className="img-zoom-wrap" style={{ marginBottom: 24, overflow: "hidden" }}>
                <div className="img-inner" style={{ background: `url(${w.bg || w.imageUrl || w.img})`, backgroundSize: 'cover', backgroundPosition: 'center', aspectRatio: "16/10", width: "100%" }} />
                <div className="work-overlay">
                  <span style={{ fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em" }}>Lihat Proyek</span>
                </div>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
                <div>
                  <div style={{ fontSize: 11, color: TOKENS.textMuted, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 8 }}>{w.category || w.type} — {w.year}</div>
                  <div style={{ fontSize: 24, color: TOKENS.textPrimary, fontWeight: 600, letterSpacing: "-0.01em" }}>{w.label || w.title}</div>
                  <div style={{ fontSize: 14, color: TOKENS.textMuted, marginTop: 4, fontWeight: 300 }}>{w.project || w.description?.substring(0, 60)}</div>
                </div>
                <div style={{ width: 40, height: 40, border: `1px solid ${TOKENS.border}`, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.3s" }} className="work-arrow">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><line x1="7" y1="17" x2="17" y2="7"></line><polyline points="7 7 17 7 17 17"></polyline></svg>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function WorkDetailPage({ work, setCurrentPage, setSelectedWork, worksData }) {
  useEffect(() => {
    window.scrollTo(0, 0);
    const timer = setTimeout(() => {
      const revealElements = document.querySelectorAll(".reveal");
      revealElements.forEach(el => {
        el.classList.add("visible");
        const children = el.querySelectorAll(".reveal-child");
        children.forEach((child, i) => {
          setTimeout(() => child.classList.add("visible"), i * 100);
        });
      });
    }, 100);
    return () => clearTimeout(timer);
  }, [work]);

  if (!work) return null;

  return (
    <div style={{ paddingTop: 80, backgroundColor: "#fff" }}>
      <div className="section-pad reveal" style={{ padding: "80px 48px 120px" }}>
        {/* Back Button */}
        <button 
          onClick={() => setCurrentPage("works")}
          style={{ 
            background: "none", 
            border: "none", 
            cursor: "pointer", 
            display: "flex", 
            alignItems: "center", 
            gap: 12, 
            marginBottom: 64,
            padding: 0,
            color: TOKENS.textMuted,
            fontSize: 12,
            fontWeight: 600,
            textTransform: "uppercase",
            letterSpacing: "0.1em"
          }}
          className="back-btn"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
          Kembali ke Karya
        </button>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "start" }}>
          {/* Left: Info */}
          <div className="reveal-child">
            <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 32 }}>
              <span style={{ fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: TOKENS.textPrimary }}>{work.category || work.type}</span>
              <div style={{ width: 4, height: 4, borderRadius: "50%", background: TOKENS.border }} />
              <span style={{ fontSize: 12, fontWeight: 500, color: TOKENS.textMuted }}>{work.year}</span>
            </div>
            
            <h1 style={{ fontSize: "clamp(32px, 5vw, 64px)", fontWeight: 700, color: TOKENS.textPrimary, marginBottom: 48, lineHeight: 1.1, letterSpacing: "-0.03em" }}>{work.label || work.title}</h1>
            
            <div style={{ marginBottom: 64 }}>
              <div style={{ fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em", color: TOKENS.textMuted, marginBottom: 24, borderBottom: `1px solid ${TOKENS.border}`, paddingBottom: 12 }}>Tentang Proyek</div>
              <p style={{ fontSize: 16, color: TOKENS.textBody, lineHeight: 1.8, fontWeight: 300 }}>{work.description}</p>
            </div>

            {work.details && work.details.length > 0 && (
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 40 }}>
                {work.details.map((d, i) => (
                  <div key={i}>
                    <div style={{ fontSize: 10, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em", color: TOKENS.textMuted, marginBottom: 8 }}>{d.title}</div>
                    <div style={{ fontSize: 14, color: TOKENS.textPrimary, fontWeight: 500 }}>{d.value}</div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right: Main Image */}
          <div className="img-zoom-wrap reveal-child" style={{ width: "100%", aspectRatio: "4/5", overflow: "hidden" }}>
            <div className="img-inner" style={{ width: "100%", height: "100%", backgroundImage: `url(${work.bg || work.imageUrl || work.img})`, backgroundSize: "cover", backgroundPosition: "center" }} />
          </div>
        </div>

        {/* Gallery Section */}
        {work.gallery && work.gallery.length > 0 && (
          <div style={{ marginTop: 120 }} className="reveal">
            <div style={{ fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em", color: TOKENS.textMuted, marginBottom: 48, textAlign: "center" }} className="reveal-child">Galeri Proyek</div>
            <div className="reveal-child work-gallery-grid" style={{ display: "grid", gridTemplateColumns: `repeat(${work.gallery.length}, 1fr)`, gap: 24 }}>
              {work.gallery.map((img, i) => (
                <div key={i} className="img-zoom-wrap" style={{ aspectRatio: "1/1" }}>
                  <div className="img-inner" style={{ width: "100%", height: "100%", backgroundImage: `url(${img})`, backgroundSize: "cover", backgroundPosition: "center" }} />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Next Project Section */}
        {worksData && worksData.length > 1 && (
          <div style={{ marginTop: 160, borderTop: `1px solid ${TOKENS.border}`, paddingTop: 80 }} className="reveal">
            <div style={{ display: "flex", justifyContent: "center", marginBottom: 40 }}>
              <span style={{ fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.2em", color: TOKENS.textMuted }}>Proyek Selanjutnya</span>
            </div>
            {(() => {
              const currentIndex = worksData.findIndex(w => w.id === work.id);
              const nextWork = worksData[(currentIndex + 1) % worksData.length];
              if (!nextWork) return null;
              return (
                <div 
                  onClick={() => {
                    setSelectedWork(nextWork);
                    setCurrentPage("work-detail");
                    window.scrollTo(0, 0);
                  }}
                  style={{ textAlign: "center", cursor: "pointer" }}
                  className="reveal-child next-project-link"
                >
                  <h2 style={{ fontSize: "clamp(40px, 8vw, 120px)", fontWeight: 700, letterSpacing: "-0.04em", textTransform: "uppercase", color: TOKENS.textPrimary, transition: "all 0.4s" }}>{nextWork.label || nextWork.title}</h2>
                  <div style={{ display: "flex", justifyContent: "center", marginTop: 24 }}>
                    <div style={{ width: 64, height: 64, border: `1px solid ${TOKENS.border}`, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.3s" }} className="work-arrow">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><line x1="7" y1="17" x2="17" y2="7"></line><polyline points="7 7 17 7 17 17"></polyline></svg>
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>
        )}
      </div>
    </div>
  );
}

function ProductDetailPage({ product, setCurrentPage }) {
  if (!product) return null;

  const waLink = `https://wa.me/6281239243317?text=${encodeURIComponent(
    `Halo DIEGMA Studio, saya tertarik dengan produk "${product.name}". Bisa minta informasi lebih lanjut?`
  )}`;

  return (
    <div style={{ paddingTop: 120, paddingBottom: 120 }}>
      <div className="section-pad">
        <button 
          onClick={() => setCurrentPage("products")}
          style={{ 
            background: "none", 
            border: "none", 
            display: "flex", 
            alignItems: "center", 
            gap: 8, 
            fontSize: 12, 
            fontWeight: 600, 
            textTransform: "uppercase", 
            letterSpacing: "0.1em", 
            cursor: "pointer",
            marginBottom: 48,
            color: TOKENS.textPrimary
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
          Kembali ke Produk
        </button>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "start" }} className="two-col">
          <div className="reveal">
            <div className="img-zoom-wrap reveal-child" style={{ border: `1px solid ${TOKENS.border}` }}>
              <img 
                src={product.img} 
                alt={product.name} 
                style={{ width: "100%", display: "block", aspectRatio: "1/1", objectFit: "cover" }} 
              />
            </div>
          </div>
          
          <div className="reveal">
            <div className="reveal-child" style={{ fontSize: 12, fontWeight: 600, color: TOKENS.textMuted, textTransform: "uppercase", letterSpacing: "0.15em", marginBottom: 16 }}>{product.cat}</div>
            <h1 className="reveal-child" style={{ fontSize: "clamp(32px, 5vw, 48px)", fontWeight: 700, letterSpacing: "-0.02em", color: TOKENS.textPrimary, marginBottom: 24, lineHeight: 1.1 }}>{product.name}</h1>
            <div className="reveal-child" style={{ fontSize: 24, fontWeight: 300, color: TOKENS.textPrimary, marginBottom: 40, borderBottom: `1px solid ${TOKENS.border}`, paddingBottom: 24 }}>{product.price}</div>
            
            <div className="reveal-child" style={{ marginBottom: 48 }}>
              <div style={{ fontSize: 11, fontWeight: 600, textTransform: "uppercase", color: TOKENS.textMuted, marginBottom: 16, letterSpacing: "0.1em" }}>Deskripsi Produk</div>
              <p style={{ fontSize: 15, color: TOKENS.textBody, lineHeight: 1.8, fontWeight: 300 }}>
                {product.description || product.desc || "Layanan profesional dari DIEGMA Studio yang mengutamakan kualitas, estetika, dan fungsionalitas. Kami memastikan setiap detail dikerjakan dengan presisi tinggi untuk memenuhi ekspektasi Anda."}
              </p>
            </div>

            <a 
              href={waLink} 
              target="_blank" 
              rel="noopener noreferrer"
              className="cta-btn reveal-child"
              style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, width: "100%", padding: "20px", textDecoration: "none" }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
              Tanya via WhatsApp
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

function LogsPage({ setCurrentPage, setSelectedLog, logsData }) {
  const tabs = ["Semua Catatan", "Wawasan Desain", "Pembaruan Proyek", "Catatan Konstruksi", "Desain Furnitur"];
  const [activeTab, setActiveTab] = useState("Semua Catatan");

  const handleLogClick = (log) => {
    setSelectedLog(log);
    setCurrentPage("log-detail");
    window.scrollTo(0, 0);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      const revealElements = document.querySelectorAll(".grid-logs .reveal, .featured-log.reveal");
      revealElements.forEach(el => {
        el.classList.add("visible");
        const children = el.querySelectorAll(".reveal-child");
        children.forEach((child, i) => {
          setTimeout(() => child.classList.add("visible"), i * 50);
        });
      });
    }, 100);
    return () => clearTimeout(timer);
  }, [activeTab]);

  const displayLogs = logsData && logsData.length > 0 ? logsData : LOGS;
  const filtered = activeTab === "Semua Catatan" ? displayLogs : displayLogs.filter(l => l.cat === activeTab);
  const featuredPost = displayLogs.find(l => l.featured);
  const listPosts = filtered.filter(l => !l.featured || activeTab !== "Semua Catatan");

  return (
    <div style={{ paddingTop: 80 }}>
      {/* Tab bar */}
      <div style={{ borderBottom: `1px solid ${TOKENS.border}`, display: "flex", overflowX: "auto", whiteSpace: "nowrap", marginTop: 24 }} className="hide-scrollbar filter-bar">
        {tabs.map(t => (
          <button key={t} className={`tab-btn ${activeTab === t ? "active" : ""}`} onClick={() => setActiveTab(t)}>{t}</button>
        ))}
      </div>

      <div className="section-pad" style={{ padding: "64px 48px 120px" }}>
        {/* Header */}
        <div style={{ marginBottom: 80 }} className="reveal">
          <h1 className="heading-large reveal-child" style={{ fontWeight: 700, fontSize: "clamp(40px,6vw,64px)", letterSpacing: "-0.02em", textTransform: "uppercase", marginBottom: 16 }}>Catatan & Jurnal</h1>
          <p className="reveal-child" style={{ fontSize: 14, color: TOKENS.textMuted, maxWidth: 600, lineHeight: 1.8 }}>
            Catatan perjalanan, pemikiran desain, dan pembaruan teknis dari studio kami. Kami berbagi proses di balik layar untuk memberikan wawasan lebih dalam tentang bagaimana kami bekerja.
          </p>
        </div>

        {/* Featured Post */}
        {activeTab === "Semua Catatan" && featuredPost && (
          <div className="featured-log reveal" style={{ marginBottom: 120, cursor: "pointer" }} onClick={() => handleLogClick(featuredPost)}>
            <div className="img-zoom-wrap" style={{ width: "100%", aspectRatio: "21/9", marginBottom: 40, overflow: "hidden" }}>
              <div className="img-inner" style={{ width: "100%", height: "100%", backgroundImage: `url(${featuredPost.img})`, backgroundSize: "cover", backgroundPosition: "center" }} />
            </div>
            <div style={{ maxWidth: 800 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 24 }} className="reveal-child">
                <span style={{ fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em", color: TOKENS.textMuted }}>Unggulan — {featuredPost.cat}</span>
                <div style={{ width: 4, height: 4, borderRadius: "50%", background: TOKENS.border }} />
                <span style={{ fontSize: 11, fontWeight: 500, color: TOKENS.textMuted }}>{featuredPost.date}</span>
              </div>
              <h2 className="reveal-child" style={{ fontSize: "clamp(32px, 4vw, 56px)", fontWeight: 600, color: TOKENS.textPrimary, marginBottom: 24, lineHeight: 1.1, letterSpacing: "-0.02em" }}>{featuredPost.title}</h2>
              <p className="reveal-child" style={{ fontSize: 18, color: TOKENS.textBody, lineHeight: 1.7, marginBottom: 32, fontWeight: 300 }}>{featuredPost.excerpt}</p>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }} className="read-more-link reveal-child">
                <span style={{ fontSize: 12, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em" }}>Baca Artikel Lengkap</span>
                <div style={{ width: 32, height: 1, background: TOKENS.textPrimary, transition: "width 0.3s" }} className="line" />
              </div>
            </div>
          </div>
        )}

        {/* List Posts */}
        <div className="grid-logs reveal" style={{ display: "flex", flexDirection: "column", gap: 120 }}>
          {listPosts.map((l, i) => {
            const isEven = i % 2 === 0;
            return (
              <div key={i} className="reveal-child reveal log-item" style={{ 
                cursor: "pointer", 
                display: "grid", 
                gridTemplateColumns: "1fr 1fr", 
                gap: 80, 
                alignItems: "center" 
              }} onClick={() => handleLogClick(l)}>
                <div className="img-zoom-wrap" style={{ aspectRatio: "4/3", overflow: "hidden", order: isEven ? 0 : 1 }}>
                  <div className="img-inner" style={{ width: "100%", height: "100%", backgroundImage: `url(${l.img})`, backgroundSize: "cover", backgroundPosition: "center" }} />
                </div>
                <div style={{ padding: isEven ? "0 0 0 40px" : "0 40px 0 0", order: isEven ? 1 : 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 24 }}>
                    <span style={{ fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em", color: TOKENS.textMuted }}>{l.cat}</span>
                    <div style={{ width: 4, height: 4, borderRadius: "50%", background: TOKENS.border }} />
                    <span style={{ fontSize: 11, fontWeight: 500, color: TOKENS.textMuted }}>{l.date}</span>
                  </div>
                  <h2 style={{ fontSize: "clamp(24px, 2.5vw, 32px)", fontWeight: 600, color: TOKENS.textPrimary, marginBottom: 24, lineHeight: 1.2, letterSpacing: "-0.01em" }}>{l.title}</h2>
                  <p style={{ fontSize: 15, color: TOKENS.textBody, lineHeight: 1.8, marginBottom: 32, fontWeight: 300 }}>{l.excerpt}</p>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }} className="read-more-link">
                    <span style={{ fontSize: 12, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em" }}>Baca Artikel Lengkap</span>
                    <div style={{ width: 24, height: 1, background: TOKENS.textPrimary, transition: "width 0.3s" }} className="line" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function LogDetailPage({ log, setCurrentPage }) {
  useEffect(() => {
    window.scrollTo(0, 0);
    const timer = setTimeout(() => {
      const revealElements = document.querySelectorAll(".reveal");
      revealElements.forEach(el => {
        el.classList.add("visible");
        const children = el.querySelectorAll(".reveal-child");
        children.forEach((child, i) => {
          setTimeout(() => child.classList.add("visible"), i * 100);
        });
      });
    }, 100);
    return () => clearTimeout(timer);
  }, [log]);

  if (!log) return null;

  return (
    <div style={{ paddingTop: 80, backgroundColor: "#fff" }}>
      <div className="section-pad reveal" style={{ padding: "80px 48px 120px" }}>
        <button 
          onClick={() => setCurrentPage("logs")}
          style={{ 
            background: "none", 
            border: "none", 
            cursor: "pointer", 
            display: "flex", 
            alignItems: "center", 
            gap: 12, 
            marginBottom: 64,
            padding: 0,
            color: TOKENS.textMuted,
            fontSize: 12,
            fontWeight: 600,
            textTransform: "uppercase",
            letterSpacing: "0.1em"
          }}
          className="back-btn"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
          Kembali ke Catatan
        </button>

        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 32 }} className="reveal-child">
            <span style={{ fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: TOKENS.textPrimary }}>{log.cat}</span>
            <div style={{ width: 4, height: 4, borderRadius: "50%", background: TOKENS.border }} />
            <span style={{ fontSize: 12, fontWeight: 500, color: TOKENS.textMuted }}>{log.date}</span>
          </div>
          
          <h1 className="reveal-child" style={{ fontSize: "clamp(32px, 5vw, 72px)", fontWeight: 700, color: TOKENS.textPrimary, marginBottom: 48, lineHeight: 1.1, letterSpacing: "-0.03em" }}>{log.title}</h1>
          
          <div className="img-zoom-wrap reveal-child" style={{ width: "100%", aspectRatio: "16/9", marginBottom: 80, overflow: "hidden" }}>
            <div className="img-inner" style={{ width: "100%", height: "100%", backgroundImage: `url(${log.img})`, backgroundSize: "cover", backgroundPosition: "center" }} />
          </div>

          <div style={{ maxWidth: 700, margin: "0 auto" }}>
            <p className="reveal-child" style={{ fontSize: 20, color: TOKENS.textPrimary, lineHeight: 1.6, marginBottom: 48, fontWeight: 500, fontStyle: "italic" }}>{log.excerpt}</p>
            <div className="reveal-child" style={{ fontSize: 18, color: TOKENS.textBody, lineHeight: 1.9, fontWeight: 300, whiteSpace: "pre-line" }}>
              {log.content}
              {"\n\n"}
              DIEGMA percaya bahwa setiap proyek adalah kesempatan untuk mengeksplorasi batas-batas kreativitas dan teknis. Melalui jurnal ini, kami berharap dapat memberikan inspirasi bagi Anda yang sedang merencanakan pembangunan atau sekadar mengapresiasi keindahan arsitektur.
              {"\n\n"}
              Kami terus berkomitmen untuk memberikan kualitas terbaik dalam setiap detail, memastikan bahwa visi klien kami terwujud dalam bentuk yang paling fungsional dan estetis. Terima kasih telah mengikuti perjalanan kami.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function AboutPage() {
  const values = [
    { title: "Kualitas Premium", desc: "Kami berkomitmen untuk memberikan hasil dengan standar tertinggi dalam setiap aspek pekerjaan, dari material hingga eksekusi." },
    { title: "Kolaborasi", desc: "Kami percaya pada kekuatan kolaborasi antara tim ahli dan klien untuk mencapai hasil yang personal dan bermakna." },
    { title: "Ketepatan Waktu", desc: "Menghargai waktu Anda dengan manajemen proyek yang efisien dan penyelesaian sesuai jadwal yang disepakati." },
    { title: "Inovasi", desc: "Terus berinovasi dan mengembangkan solusi desain terkini untuk menjawab tantangan arsitektur modern." }
  ];

  useEffect(() => {
    const timer = setTimeout(() => {
      const revealElements = document.querySelectorAll(".reveal");
      revealElements.forEach(el => {
        el.classList.add("visible");
        const children = el.querySelectorAll(".reveal-child");
        children.forEach((child, i) => {
          setTimeout(() => child.classList.add("visible"), i * 100);
        });
      });
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div style={{ paddingTop: 80, backgroundColor: "#fff" }}>
      {/* Hero Section - Split Layout */}
      <div className="reveal" style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", minHeight: "80vh", borderBottom: `1px solid ${TOKENS.border}` }}>
        <div style={{ padding: "120px 64px", display: "flex", flexDirection: "column", justifyContent: "center", borderRight: `1px solid ${TOKENS.border}` }}>
          <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.2em", color: TOKENS.textMuted, textTransform: "uppercase", marginBottom: 32 }} className="reveal-child">Tentang Kami</div>
          <h1 style={{ fontWeight: 700, fontSize: "clamp(48px, 8vw, 96px)", color: TOKENS.textPrimary, lineHeight: 0.9, letterSpacing: "-0.04em", marginBottom: 48 }} className="reveal-child">
            Menciptakan <br/>Ruang Yang <br/>Bermakna.
          </h1>
          <p style={{ fontSize: 18, color: TOKENS.textBody, lineHeight: 1.6, maxWidth: 450, fontWeight: 300 }} className="reveal-child">
            DIEGMA adalah studio arsitektur dan desain interior yang berdedikasi untuk menciptakan harmoni antara fungsi, estetika, dan konteks lingkungan.
          </p>
        </div>
        <div className="reveal-child" style={{ backgroundImage: "url(https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80)", backgroundSize: "cover", backgroundPosition: "center" }} />
      </div>

      {/* Studio Intro - Asymmetric Grid */}
      <div className="section-pad reveal" style={{ padding: "160px 64px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1.5fr", gap: 120, alignItems: "start" }}>
          <div>
            <div style={{ width: 40, height: 2, background: "#111", marginBottom: 32 }} className="reveal-child" />
            <h3 style={{ fontSize: 32, fontWeight: 600, color: TOKENS.textPrimary, marginBottom: 24, letterSpacing: "-0.02em" }} className="reveal-child">Visi & Misi</h3>
            <p style={{ fontSize: 15, color: TOKENS.textMuted, lineHeight: 1.8, fontWeight: 300 }} className="reveal-child">
              Kami tidak hanya membangun struktur; kami membangun pengalaman. Visi kami adalah menjadi pionir dalam desain yang berkelanjutan dan inovatif di Indonesia.
            </p>
          </div>
          <div style={{ fontSize: 20, color: TOKENS.textBody, lineHeight: 1.7, fontWeight: 300 }} className="reveal-child">
            <p style={{ marginBottom: 40 }}>
              Berdiri dengan semangat untuk membawa perubahan dalam lanskap arsitektur lokal, DIEGMA menggabungkan keahlian teknis yang mendalam dengan kepekaan artistik yang tinggi. Kami percaya bahwa setiap garis yang kami tarik memiliki dampak pada kualitas hidup penghuninya.
            </p>
            <p>
              Dengan tim yang terdiri dari para profesional berpengalaman, kami menawarkan solusi desain komprehensif mulai dari konsep awal hingga implementasi akhir. Setiap proyek kami ditangani dengan perhatian penuh pada detail, kualitas, dan keberlanjutan.
            </p>
          </div>
        </div>
      </div>

      {/* Filosofi Section - Dark Mode Accent */}
      <div style={{ backgroundColor: "#111", padding: "160px 64px", color: "#fff" }} className="reveal">
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, marginBottom: 120, alignItems: "end" }}>
            <h3 style={{ fontSize: "clamp(40px, 5vw, 64px)", fontWeight: 700, lineHeight: 1, letterSpacing: "-0.03em" }} className="reveal-child">Filosofi <br/>Desain Kami</h3>
            <p style={{ fontSize: 16, color: "rgba(255,255,255,0.6)", lineHeight: 1.8, maxWidth: 400 }} className="reveal-child">
              Pendekatan holistik kami menyeimbangkan tiga pilar utama untuk menciptakan hasil yang abadi.
            </p>
          </div>
          
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", borderTop: "1px solid rgba(255,255,255,0.1)" }} className="reveal-child">
            {[
              { num: "01", title: "Fungsi", desc: "Menciptakan ruang yang bekerja secara optimal untuk penggunanya." },
              { num: "02", title: "Estetika", desc: "Menghadirkan keindahan visual yang abadi dan berkarakter." },
              { num: "03", title: "Keberlanjutan", desc: "Memperhatikan dampak lingkungan dan efisiensi jangka panjang." }
            ].map((item, i) => (
              <div key={i} style={{ padding: "64px 40px", borderRight: i < 2 ? "1px solid rgba(255,255,255,0.1)" : "none", transition: "all 0.4s" }} className="philosophy-item">
                <div style={{ fontSize: 14, fontWeight: 600, color: "rgba(255,255,255,0.4)", marginBottom: 32 }}>{item.num}</div>
                <div style={{ fontSize: 24, fontWeight: 600, marginBottom: 16 }}>{item.title}</div>
                <div style={{ fontSize: 14, color: "rgba(255,255,255,0.5)", lineHeight: 1.7 }}>{item.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Values Section - Clean Grid */}
      <div className="section-pad reveal" style={{ padding: "160px 64px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 80 }}>
          <div style={{ maxWidth: 500 }}>
            <h3 style={{ fontSize: 40, fontWeight: 700, color: TOKENS.textPrimary, marginBottom: 24, letterSpacing: "-0.02em" }} className="reveal-child">Nilai Perusahaan</h3>
            <p style={{ fontSize: 16, color: TOKENS.textMuted, lineHeight: 1.6 }} className="reveal-child">Prinsip yang kami pegang teguh dalam setiap kolaborasi dan eksekusi proyek.</p>
          </div>
          <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.2em", color: TOKENS.textMuted, textTransform: "uppercase" }} className="reveal-child">Nilai Inti Kami</div>
        </div>
        
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 1, backgroundColor: TOKENS.border, border: `1px solid ${TOKENS.border}` }} className="reveal-child">
          {values.map((v, i) => (
            <div key={i} style={{ padding: 48, backgroundColor: "#fff", transition: "all 0.4s" }} className="value-card">
              <div style={{ fontSize: 18, fontWeight: 600, color: TOKENS.textPrimary, marginBottom: 24 }}>{v.title}</div>
              <div style={{ fontSize: 14, color: TOKENS.textBody, lineHeight: 1.8, fontWeight: 300 }}>{v.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Contact section - Minimalist */}
      <div className="section-pad reveal" style={{ padding: "0 64px 160px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 120, alignItems: "start" }}>
          <div>
            <h2 style={{ fontWeight: 700, fontSize: 48, textTransform: "uppercase", letterSpacing: "-0.03em", color: TOKENS.textPrimary, marginBottom: 48 }}>Hubungi Kami</h2>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 40 }}>
              <div>
                <div style={{ fontSize: 11, fontWeight: 600, textTransform: "uppercase", color: TOKENS.textMuted, marginBottom: 16 }}>Lokasi</div>
                <div style={{ fontSize: 14, color: TOKENS.textBody, lineHeight: 1.6 }}>Jakarta Selatan,<br/>DKI Jakarta, Indonesia</div>
              </div>
              <div>
                <div style={{ fontSize: 11, fontWeight: 600, textTransform: "uppercase", color: TOKENS.textMuted, marginBottom: 16 }}>Kontak</div>
                <div style={{ fontSize: 14, color: TOKENS.textBody, lineHeight: 1.6 }}>+62 812 3924 3317<br/>diegma9@gmail.com</div>
              </div>
            </div>
          </div>
          <div className="reveal-child" style={{ background: "#f5f5f5", height: 400, display: "flex", alignItems: "center", justifyContent: "center", border: `1px solid ${TOKENS.border}`, position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", opacity: 0.1, backgroundImage: "radial-gradient(#000 1px, transparent 1px)", backgroundSize: "20px 20px" }} />
            <div style={{ textAlign: "center", zIndex: 1 }}>
              <div style={{ fontSize: 12, fontWeight: 600, letterSpacing: "0.1em", color: TOKENS.textMuted, textTransform: "uppercase", marginBottom: 8 }}>Google Maps Placeholder</div>
              <div style={{ fontSize: 16, fontWeight: 500, color: TOKENS.textPrimary }}>DIEGMA Studio, Jakarta</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function AdminPanel({ user, isAuthReady, heroData, worksData, productsData, logsData }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("hero");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err: any) {
      console.error("Login error:", err);
      if (err.code === "auth/user-not-found" || err.code === "auth/wrong-password") {
        setError("Email atau password salah.");
      } else if (err.code === "auth/too-many-requests") {
        setError("Terlalu banyak percobaan. Silakan coba lagi nanti.");
      } else {
        setError("Login gagal. Silakan coba lagi.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => signOut(auth);

  if (!isAuthReady) return <div style={{ padding: 100, textAlign: "center" }}>Memuat...</div>;

  if (!user || user.email !== ADMIN_EMAIL) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f5f5f5", padding: 24 }}>
        <div style={{ background: "#fff", padding: 48, borderRadius: 8, boxShadow: "0 10px 30px rgba(0,0,0,0.05)", width: "100%", maxWidth: 400 }}>
          <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 32, textAlign: "center" }}>Admin Login</h1>
          {user && user.email !== ADMIN_EMAIL && (
            <div style={{ color: "#856404", fontSize: 13, marginBottom: 24, padding: 16, background: "#fff3cd", border: "1px solid #ffeeba", borderRadius: 4, lineHeight: 1.5 }}>
              Anda masuk sebagai <strong>{user.email}</strong>, tetapi email ini tidak terdaftar sebagai Admin.
              <button onClick={handleLogout} style={{ display: "block", marginTop: 8, background: "none", border: "none", color: "#856404", textDecoration: "underline", cursor: "pointer", padding: 0, fontWeight: 600 }}>Logout & Ganti Akun</button>
            </div>
          )}
          <form onSubmit={handleLogin}>
            <div style={{ marginBottom: 24 }}>
              <label style={{ display: "block", fontSize: 12, fontWeight: 600, marginBottom: 8, textTransform: "uppercase" }}>Email</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} style={{ width: "100%", padding: "12px 16px", border: `1px solid ${TOKENS.border}`, borderRadius: 4 }} required />
            </div>
            <div style={{ marginBottom: 32 }}>
              <label style={{ display: "block", fontSize: 12, fontWeight: 600, marginBottom: 8, textTransform: "uppercase" }}>Password</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} style={{ width: "100%", padding: "12px 16px", border: `1px solid ${TOKENS.border}`, borderRadius: 4 }} required />
            </div>
            {error && <div style={{ color: "red", fontSize: 13, marginBottom: 24 }}>{error}</div>}
            <button 
              type="submit" 
              disabled={loading}
              style={{ 
                width: "100%", 
                padding: 16, 
                background: loading ? "#888" : "#111", 
                color: "#fff", 
                border: "none", 
                borderRadius: 4, 
                fontWeight: 600, 
                cursor: loading ? "not-allowed" : "pointer",
                transition: "background 0.2s"
              }}
            >
              {loading ? "Memproses..." : "Login"}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "#f9f9f9", paddingTop: 0 }}>
      <div style={{ background: "#fff", borderBottom: `1px solid ${TOKENS.border}`, padding: "0 48px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", height: 80 }}>
          <div style={{ display: "flex", gap: 32, alignItems: "center" }}>
            <span 
              onClick={() => window.location.href = "/"}
              style={{ fontWeight: 700, letterSpacing: "0.2em", fontSize: 14, cursor: "pointer", color: "#111", marginRight: 24 }}
            >
              D I E G M A
            </span>
            {["hero", "works", "products", "logs"].map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)} style={{ background: "none", border: "none", padding: "28px 0", fontSize: 13, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em", color: activeTab === tab ? "#111" : "#888", borderBottom: activeTab === tab ? "2px solid #111" : "2px solid transparent", cursor: "pointer" }}>{tab}</button>
            ))}
          </div>
          <button onClick={handleLogout} style={{ background: "none", border: "none", fontSize: 12, fontWeight: 600, color: "#888", cursor: "pointer" }}>Logout</button>
        </div>
      </div>

      <div style={{ padding: 48 }}>
        {activeTab === "hero" && <HeroManager slides={heroData} />}
        {activeTab === "works" && <ContentManager type="works" items={worksData} />}
        {activeTab === "products" && <ContentManager type="products" items={productsData} />}
        {activeTab === "logs" && <ContentManager type="logs" items={logsData} />}
      </div>

      <div style={{ padding: "0 48px 80px", borderTop: `1px solid ${TOKENS.border}`, marginTop: 48, paddingTop: 48 }}>
        <div style={{ background: "#fff", padding: 32, borderRadius: 8, border: "1px solid #fee2e2" }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, color: "#991b1b", marginBottom: 8 }}>Zone Bahaya: Reset Database</h3>
          <p style={{ fontSize: 13, color: "#666", marginBottom: 24 }}>Gunakan fitur ini untuk menghapus semua isi Produk, Karya, dan Catatan sekaligus jika Anda ingin memulai dari awal.</p>
          <button 
            onClick={async () => {
              if (confirm("APAKAH ANDA YAKIN? Semua data Produk, Karya, dan Catatan akan dihapus permanen.")) {
                if (confirm("KONFIRMASI TERAKHIR: Tindakan ini tidak dapat dibatalkan.")) {
                  try {
                    // Delete works
                    for (const item of worksData) {
                      await deleteDoc(doc(db, "works", item.id));
                    }
                    // Delete products
                    for (const item of productsData) {
                      await deleteDoc(doc(db, "products", item.id));
                    }
                    // Delete logs
                    for (const item of logsData) {
                      await deleteDoc(doc(db, "logs", item.id));
                    }
                    alert("Semua data berhasil dihapus. Silakan mulai isi dari awal.");
                  } catch (err) {
                    handleFirestoreError(err, OperationType.DELETE, "all");
                  }
                }
              }
            }}
            style={{ padding: "12px 24px", background: "#ef4444", color: "#fff", border: "none", fontWeight: 600, borderRadius: 4, cursor: "pointer" }}
          >
            Reset All Content
          </button>
        </div>
      </div>
    </div>
  );
}

function ImageUpload({ label, value, onChange }) {
  const [uploading, setUploading] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Limit size to 2MB for better performance
    if (file.size > 2000000) {
      alert("Ukuran gambar terlalu besar (maksimal 2MB).");
      return;
    }

    setUploading(true);
    try {
      const storageRef = ref(storage, `uploads/${Date.now()}_${file.name}`);
      const snapshot = await uploadBytes(storageRef, file);
      const url = await getDownloadURL(snapshot.ref);
      onChange(url);
    } catch (err) {
      console.error("Upload error:", err);
      alert("Gagal mengunggah gambar.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div style={{ marginBottom: 24 }}>
      <label style={{ display: "block", fontSize: 11, fontWeight: 600, marginBottom: 8, textTransform: "uppercase" }}>{label}</label>
      <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
        {value && (
          <div style={{ width: 80, height: 80, borderRadius: 4, overflow: "hidden", border: `1px solid ${TOKENS.border}`, flexShrink: 0 }}>
            <img src={value} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          </div>
        )}
        <div style={{ flex: 1 }}>
          <input 
            type="file" 
            accept="image/*" 
            onChange={handleFileChange} 
            disabled={uploading}
            style={{ 
              width: "100%", 
              padding: "10px", 
              border: `1px dashed ${TOKENS.border}`, 
              fontSize: 12,
              cursor: uploading ? "not-allowed" : "pointer"
            }} 
          />
          <div style={{ fontSize: 10, color: "#888", marginTop: 4 }}>
            {uploading ? "Mengunggah..." : "Pilih file gambar (JPG, PNG, WEBP)"}
          </div>
        </div>
      </div>
    </div>
  );
}

function HeroManager({ slides }) {
  const [uploading, setUploading] = useState(false);

  const handleUploadImages = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []) as File[];
    if (files.length === 0) return;

    setUploading(true);
    try {
      const newSlides = [...slides];
      for (const file of files) {
        const storageRef = ref(storage, `hero/${Date.now()}_${file.name}`);
        const snapshot = await uploadBytes(storageRef, file);
        const url = await getDownloadURL(snapshot.ref);
        newSlides.push({ id: Date.now() + Math.random(), imageUrl: url });
      }
      await setDoc(doc(db, "settings", "hero"), { slides: newSlides });
    } catch (err) {
      console.error("Hero upload error:", err);
      alert("Gagal mengunggah gambar hero.");
    } finally {
      setUploading(false);
      if (e.target) e.target.value = ""; // Reset input
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Hapus slide ini?")) return;
    try {
      await setDoc(doc(db, "settings", "hero"), { slides: slides.filter(s => s.id !== id) });
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, "settings/hero");
    }
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 32 }}>
        <h2 style={{ fontSize: 24, fontWeight: 700 }}>Manage Hero Slides</h2>
        <div style={{ position: "relative" }}>
          <input 
            type="file" 
            multiple 
            accept="image/*" 
            onChange={handleUploadImages} 
            disabled={uploading}
            id="hero-upload"
            style={{ display: "none" }}
          />
          <label 
            htmlFor="hero-upload"
            style={{ 
              padding: "12px 24px", 
              background: uploading ? "#888" : "#111", 
              color: "#fff", 
              border: "none", 
              fontWeight: 600, 
              cursor: uploading ? "not-allowed" : "pointer",
              borderRadius: 4
            }}
          >
            {uploading ? "Mengunggah..." : "Tambah Gambar Hero"}
          </label>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 24 }}>
        {slides.map(s => (
          <div key={s.id} style={{ background: "#fff", border: `1px solid ${TOKENS.border}`, borderRadius: 8, overflow: "hidden", position: "relative" }}>
            <img src={s.imageUrl} style={{ width: "100%", height: 200, objectFit: "cover" }} />
            <div style={{ padding: 16, display: "flex", justifyContent: "flex-end" }}>
              <button onClick={() => handleDelete(s.id)} style={{ background: "none", border: "none", color: "red", fontWeight: 600, fontSize: 12, textTransform: "uppercase", cursor: "pointer" }}>Hapus</button>
            </div>
          </div>
        ))}
      </div>
      {slides.length === 0 && (
        <div style={{ padding: 80, textAlign: "center", background: "#fff", border: `1px dashed ${TOKENS.border}`, borderRadius: 8, color: "#888" }}>
          Belum ada gambar hero. Silakan unggah gambar.
        </div>
      )}
    </div>
  );
}

function ContentManager({ type, items }) {
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const handleDelete = async (id) => {
    if (!confirm(`Hapus ${type} ini?`)) return;
    try {
      await deleteDoc(doc(db, type, id));
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, `${type}/${id}`);
    }
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 32 }}>
        <h2 style={{ fontSize: 24, fontWeight: 700, textTransform: "capitalize" }}>Manage {type}</h2>
        <button onClick={() => { setEditing(null); setShowForm(true); }} style={{ padding: "12px 24px", background: "#111", color: "#fff", border: "none", fontWeight: 600 }}>Add New</button>
      </div>

      {showForm && (
        <div style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 2000 }}>
          <div style={{ background: "#fff", padding: 48, borderRadius: 8, width: "100%", maxWidth: 800, maxHeight: "90vh", overflowY: "auto" }}>
            <ContentForm type={type} initialData={editing} onClose={() => { setShowForm(false); setEditing(null); }} />
          </div>
        </div>
      )}

      <div style={{ background: "#fff", border: `1px solid ${TOKENS.border}`, borderRadius: 8 }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: `1px solid ${TOKENS.border}`, textAlign: "left" }}>
              <th style={{ padding: 20, fontSize: 11, textTransform: "uppercase", color: "#888" }}>Title/Name</th>
              <th style={{ padding: 20, fontSize: 11, textTransform: "uppercase", color: "#888" }}>Category</th>
              <th style={{ padding: 20, fontSize: 11, textTransform: "uppercase", color: "#888" }}>Date/Price</th>
              <th style={{ padding: 20, fontSize: 11, textTransform: "uppercase", color: "#888" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map(item => (
              <tr key={item.id} style={{ borderBottom: `1px solid ${TOKENS.border}` }}>
                <td style={{ padding: 20, fontSize: 14, fontWeight: 500 }}>{item.title || item.name || item.label}</td>
                <td style={{ padding: 20, fontSize: 14, color: "#666" }}>{item.category || item.cat || item.type}</td>
                <td style={{ padding: 20, fontSize: 14, color: "#666" }}>{item.date || item.price || item.year}</td>
                <td style={{ padding: 20 }}>
                  <div style={{ display: "flex", gap: 16 }}>
                    <button onClick={() => { setEditing(item); setShowForm(true); }} style={{ background: "none", border: "none", color: "#111", fontWeight: 600, fontSize: 12, textTransform: "uppercase", cursor: "pointer" }}>Edit</button>
                    <button onClick={() => handleDelete(item.id)} style={{ background: "none", border: "none", color: "red", fontWeight: 600, fontSize: 12, textTransform: "uppercase", cursor: "pointer" }}>Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ContentForm({ type, initialData, onClose }) {
  // Normalize initialData so form always uses canonical field names
  const normalize = (data: any) => {
    if (!data) return null;
    if (type === "works") {
      return {
        label: data.label || data.title || "",
        category: data.category || data.cat || data.type || "",
        year: data.year || data.date || "",
        bg: data.bg || data.imageUrl || data.img || "",
        description: data.description || data.desc || data.content || "",
        gallery: data.gallery || [],
      };
    }
    if (type === "products") {
      return {
        name: data.name || "",
        cat: data.cat || data.category || data.type || "",
        price: data.price || data.date || data.year || "",
        img: data.img || data.imageUrl || data.bg || "",
        description: data.description || data.desc || data.content || "",
        specs: data.specs || [],
      };
    }
    if (type === "logs") {
      return {
        title: data.title || data.label || "",
        cat: data.cat || data.category || data.type || "",
        date: data.date || data.year || "",
        img: data.img || data.imageUrl || data.bg || "",
        excerpt: data.excerpt || "",
        content: data.content || data.description || data.desc || "",
        featured: data.featured || false,
      };
    }
    return data;
  };

  const [form, setForm] = useState(normalize(initialData) || (() => {
    if (type === "works") return { label: "", category: "", year: "", bg: "", description: "", gallery: [] };
    if (type === "products") return { name: "", cat: "", price: "", img: "", description: "", specs: [] };
    if (type === "logs") return { title: "", cat: "", date: "", img: "", excerpt: "", content: "", featured: false };
    return {};
  }));

  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      // Build clean payload with ONLY canonical fields per type
      let payload: any = {};
      if (type === "works") {
        payload = {
          label: form.label,
          category: form.category,
          year: form.year,
          bg: form.bg,
          description: form.description,
          gallery: form.gallery || [],
          createdAt: initialData?.createdAt || new Date().toISOString(),
        };
      } else if (type === "products") {
        payload = {
          name: form.name,
          cat: form.cat,
          price: form.price,
          img: form.img,
          description: form.description,
          specs: form.specs || [],
          createdAt: initialData?.createdAt || new Date().toISOString(),
        };
      } else if (type === "logs") {
        payload = {
          title: form.title,
          cat: form.cat,
          date: form.date,
          img: form.img,
          excerpt: form.excerpt,
          content: form.content,
          featured: form.featured || false,
          createdAt: initialData?.createdAt || new Date().toISOString(),
        };
      }

      if (initialData?.id) {
        await setDoc(doc(db, type, initialData.id), payload);
      } else {
        await addDoc(collection(db, type), payload);
      }
      onClose();
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, type);
    } finally {
      setSaving(false);
    }
  };

  const inputStyle = { width: "100%", padding: 12, border: `1px solid ${TOKENS.border}`, fontFamily: "'Inter', sans-serif", fontSize: 13, borderRadius: 4 };
  const labelStyle = { display: "block", fontSize: 11, fontWeight: 600, marginBottom: 8, textTransform: "uppercase" as const, color: TOKENS.textMuted };

  return (
    <form onSubmit={handleSubmit}>
      <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 32 }}>{initialData ? "Edit" : "Add"} {type}</h3>

      {/* === WORKS FORM === */}
      {type === "works" && (
        <>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginBottom: 24 }}>
            <div>
              <label style={labelStyle}>Judul Proyek</label>
              <input value={form.label} onChange={e => setForm({ ...form, label: e.target.value })} style={inputStyle} required placeholder="Contoh: Rumah Modern BSD" />
            </div>
            <div>
              <label style={labelStyle}>Kategori</label>
              <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} style={inputStyle} required>
                <option value="">Pilih kategori...</option>
                <option value="Interior & Eksterior">Interior & Eksterior</option>
                <option value="Konstruksi">Konstruksi</option>
                <option value="Furnitur">Furnitur</option>
              </select>
            </div>
          </div>
          <div style={{ marginBottom: 24 }}>
            <label style={labelStyle}>Tahun</label>
            <input value={form.year} onChange={e => setForm({ ...form, year: e.target.value })} style={inputStyle} required placeholder="Contoh: 2024" />
          </div>
          <ImageUpload label="Foto Utama Proyek" value={form.bg} onChange={val => setForm({ ...form, bg: val })} />
          <div style={{ marginBottom: 24 }}>
            <label style={labelStyle}>Deskripsi Proyek</label>
            <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} style={{ ...inputStyle, height: 150 }} placeholder="Ceritakan detail proyek ini..." />
          </div>
          {/* Gallery */}
          <div style={{ marginBottom: 32 }}>
            <label style={labelStyle}>Galeri Foto</label>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))", gap: 16, marginBottom: 16 }}>
              {(form.gallery || []).map((img, idx) => (
                <div key={idx} style={{ position: "relative", aspectRatio: "1/1", border: `1px solid ${TOKENS.border}`, borderRadius: 4, overflow: "hidden" }}>
                  <img src={img} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  <button type="button" onClick={() => setForm({ ...form, gallery: form.gallery.filter((_, i) => i !== idx) })}
                    style={{ position: "absolute", top: 4, right: 4, background: "rgba(255,0,0,0.8)", color: "#fff", border: "none", borderRadius: "50%", width: 20, height: 20, fontSize: 10, cursor: "pointer" }}>✕</button>
                </div>
              ))}
              <label style={{ aspectRatio: "1/1", border: `1px dashed ${TOKENS.border}`, borderRadius: 4, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", cursor: "pointer", background: TOKENS.surface }}>
                <input type="file" multiple accept="image/*" style={{ display: "none" }}
                  onChange={async (e: React.ChangeEvent<HTMLInputElement>) => {
                    const files = Array.from(e.target.files || []) as File[];
                    const newGallery = [...(form.gallery || [])];
                    for (const file of files) {
                      const storageRef = ref(storage, `gallery/${Date.now()}_${file.name}`);
                      const snapshot = await uploadBytes(storageRef, file);
                      const url = await getDownloadURL(snapshot.ref);
                      newGallery.push(url);
                    }
                    setForm({ ...form, gallery: newGallery });
                    if (e.target) e.target.value = "";
                  }} />
                <span style={{ fontSize: 20, color: "#888" }}>+</span>
                <span style={{ fontSize: 10, color: "#888" }}>Upload</span>
              </label>
            </div>
          </div>
        </>
      )}

      {/* === PRODUCTS FORM === */}
      {type === "products" && (
        <>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginBottom: 24 }}>
            <div>
              <label style={labelStyle}>Nama Produk</label>
              <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} style={inputStyle} required placeholder="Contoh: Kursi Minimalis Oslo" />
            </div>
            <div>
              <label style={labelStyle}>Kategori</label>
              <select value={form.cat} onChange={e => setForm({ ...form, cat: e.target.value })} style={inputStyle} required>
                <option value="">Pilih kategori...</option>
                <option value="Interior & Eksterior">Interior & Eksterior</option>
                <option value="Konstruksi">Konstruksi</option>
                <option value="Furnitur">Furnitur</option>
              </select>
            </div>
          </div>
          <div style={{ marginBottom: 24 }}>
            <label style={labelStyle}>Harga</label>
            <input value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} style={inputStyle} required placeholder="Contoh: Rp 4.500.000" />
          </div>
          <ImageUpload label="Foto Produk" value={form.img} onChange={val => setForm({ ...form, img: val })} />
          <div style={{ marginBottom: 24 }}>
            <label style={labelStyle}>Deskripsi Produk</label>
            <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} style={{ ...inputStyle, height: 150 }} placeholder="Jelaskan spesifikasi dan keunggulan produk..." />
          </div>
        </>
      )}

      {/* === LOGS FORM === */}
      {type === "logs" && (
        <>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginBottom: 24 }}>
            <div>
              <label style={labelStyle}>Judul Artikel</label>
              <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} style={inputStyle} required placeholder="Contoh: Tren Desain Interior 2024" />
            </div>
            <div>
              <label style={labelStyle}>Kategori</label>
              <input value={form.cat} onChange={e => setForm({ ...form, cat: e.target.value })} style={inputStyle} required placeholder="Contoh: Desain, Inspirasi, Tips" />
            </div>
          </div>
          <div style={{ marginBottom: 24 }}>
            <label style={labelStyle}>Tanggal</label>
            <input type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} style={inputStyle} required />
          </div>
          <ImageUpload label="Foto Artikel" value={form.img} onChange={val => setForm({ ...form, img: val })} />
          <div style={{ marginBottom: 24 }}>
            <label style={labelStyle}>Ringkasan (Excerpt)</label>
            <textarea value={form.excerpt} onChange={e => setForm({ ...form, excerpt: e.target.value })} style={{ ...inputStyle, height: 80 }} placeholder="Ringkasan singkat artikel (tampil di halaman Catatan)..." />
          </div>
          <div style={{ marginBottom: 24 }}>
            <label style={labelStyle}>Isi Artikel Lengkap</label>
            <textarea value={form.content} onChange={e => setForm({ ...form, content: e.target.value })} style={{ ...inputStyle, height: 200 }} placeholder="Tulis isi lengkap artikel di sini..." />
          </div>
          <div style={{ marginBottom: 32, display: "flex", alignItems: "center", gap: 12 }}>
            <input type="checkbox" checked={form.featured} onChange={e => setForm({ ...form, featured: e.target.checked })} id="featured" />
            <label htmlFor="featured" style={{ fontSize: 13, fontWeight: 500 }}>Featured Post (tampil pertama)</label>
          </div>
        </>
      )}

      <div style={{ display: "flex", gap: 16, justifyContent: "flex-end" }}>
        <button type="button" onClick={onClose} style={{ padding: "12px 24px", background: "none", border: "none", color: "#888", fontWeight: 600, cursor: "pointer" }}>Batal</button>
        <button type="submit" disabled={saving} style={{ padding: "12px 32px", background: saving ? "#888" : "#111", color: "#fff", border: "none", fontWeight: 600, cursor: saving ? "not-allowed" : "pointer", borderRadius: 4 }}>
          {saving ? "Menyimpan..." : "Simpan"}
        </button>
      </div>
    </form>
  );
}

// --- Main App ---

enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId: string | undefined;
    email: string | null | undefined;
    emailVerified: boolean | undefined;
    isAnonymous: boolean | undefined;
    tenantId: string | null | undefined;
    providerInfo: {
      providerId: string;
      displayName: string | null;
      email: string | null;
      photoUrl: string | null;
    }[];
  }
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null, showAlert = true) {
  const errMsg = error instanceof Error ? error.message : String(error);
  const errInfo: FirestoreErrorInfo = {
    error: errMsg,
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData.map(provider => ({
        providerId: provider.providerId,
        displayName: provider.displayName,
        email: provider.email,
        photoUrl: provider.photoURL
      })) || []
    },
    operationType,
    path
  }
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  if (showAlert) {
    const isPermission = errMsg.toLowerCase().includes('permission') || errMsg.toLowerCase().includes('missing or insufficient');
    if (isPermission) {
      alert(`Akses ditolak Firebase. Pastikan Anda login sebagai admin (${ADMIN_EMAIL}) dan Firestore Rules sudah diperbarui.`);
    } else {
      alert(`Terjadi kesalahan: ${errMsg}`);
    }
  }
}

export default function App() {
  const [currentPage, setCurrentPage] = useState("home");
  const [selectedLog, setSelectedLog] = useState(null);
  const [selectedWork, setSelectedWork] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Firebase State
  const [user, setUser] = useState<User | null>(null);
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [heroData, setHeroData] = useState<any[]>([]);
  const [worksData, setWorksData] = useState<any[]>([]);
  const [productsData, setProductsData] = useState<any[]>([]);
  const [logsData, setLogsData] = useState<any[]>([]);

  // Check for hidden admin route on load
  useEffect(() => {
    if (window.location.pathname === "/diegma-internal-vault") {
      setCurrentPage("admin");
    }
  }, []);

  // Auth Listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setIsAuthReady(true);
    });
    return () => unsubscribe();
  }, []);

  // Test Connection
  useEffect(() => {
    async function testConnection() {
      try {
        await getDocFromServer(doc(db, 'test', 'connection'));
      } catch (error) {
        if(error instanceof Error && error.message.includes('the client is offline')) {
          console.error("Please check your Firebase configuration. ");
        }
      }
    }
    testConnection();
  }, []);

  // Data Fetching
  useEffect(() => {
    const unsubHero = onSnapshot(collection(db, "settings"), (snapshot) => {
      const hero = snapshot.docs.find(d => d.id === "hero")?.data();
      if (hero && hero.slides) {
        setHeroData(hero.slides);
      } else {
        // Fallback to static if empty
        setHeroData([
          "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1920&q=80",
          "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1920&q=80",
          "https://images.unsplash.com/photo-1600566753190-17f0bb2a6c3e?auto=format&fit=crop&w=1920&q=80",
          "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1920&q=80"
        ]);
      }
    }, (error) => handleFirestoreError(error, OperationType.LIST, "settings/hero", false));

    const unsubWorks = onSnapshot(query(collection(db, "works"), orderBy("year", "desc")), (snapshot) => {
      const works = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setWorksData(works.length > 0 ? works : WORKS);
    }, (error) => handleFirestoreError(error, OperationType.LIST, "works", false));

    const unsubProducts = onSnapshot(collection(db, "products"), (snapshot) => {
      const products = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setProductsData(products.length > 0 ? products : []);
    }, (error) => handleFirestoreError(error, OperationType.LIST, "products", false));

    const unsubLogs = onSnapshot(query(collection(db, "logs"), orderBy("date", "desc")), (snapshot) => {
      const logs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setLogsData(logs.length > 0 ? logs : LOGS);
    }, (error) => handleFirestoreError(error, OperationType.LIST, "logs", false));

    return () => {
      unsubHero();
      unsubWorks();
      unsubProducts();
      unsubLogs();
    };
  }, []);

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
        padding: 14px 28px;
        border: none;
        background: transparent;
        color: #888;
        font-family: 'Inter', sans-serif;
        font-size: 11px;
        font-weight: 600;
        letter-spacing: 0.1em;
        text-transform: uppercase;
        cursor: pointer;
        transition: all 0.3s;
        border-bottom: 2px solid transparent;
      }
      .tab-btn:hover {
        color: #111;
      }
      .tab-btn.active {
        color: #111;
        border-bottom: 2px solid #111;
      }

      .products-grid .reveal-child:hover {
        border-color: #111 !important;
        transform: translateY(-4px);
        box-shadow: 0 10px 30px rgba(0,0,0,0.05);
      }
      .product-card:hover .product-arrow {
        background: #111;
        color: #fff;
        border-color: #111 !important;
        transform: scale(1.1);
      }
      .products-grid .reveal-child:hover .img-inner {
        transform: scale(1.05);
      }

      .work-card:hover .work-arrow {
        background: #111;
        color: #fff;
        border-color: #111 !important;
      }
      .work-overlay {
        position: absolute;
        top: 0; left: 0; width: 100%; height: 100%;
        background: rgba(0,0,0,0.4);
        display: flex;
        align-items: center;
        justify-content: center;
        color: #fff;
        opacity: 0;
        transition: opacity 0.4s ease;
        pointer-events: none;
      }
      .work-card:hover .work-overlay {
        opacity: 1;
      }
      .grid-works {
        grid-template-columns: repeat(2, 1fr) !important;
      }

      .log-item:hover .line {
        width: 48px !important;
      }
      .log-item:hover .read-more-link {
        color: #111;
      }
      .hide-scrollbar::-webkit-scrollbar {
        display: none;
      }
      .hide-scrollbar {
        -ms-overflow-style: none;
        scrollbar-width: none;
      }

      .value-card:hover {
        border-color: #111 !important;
        transform: translateY(-8px);
        box-shadow: 0 20px 40px rgba(0,0,0,0.05);
      }
      .metric-card:hover {
        transform: translateY(-8px);
        box-shadow: 0 20px 40px rgba(0,0,0,0.05);
        z-index: 1;
      }
      .philosophy-item:hover {
        background: #111 !important;
      }
      .philosophy-item:hover div {
        color: #fff !important;
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

      .next-project-link:hover h2 {
        color: #666 !important;
        transform: translateY(-8px);
      }
      .next-project-link:hover .work-arrow {
        background: #111;
        color: #fff;
        border-color: #111 !important;
        transform: scale(1.1);
      }

      .filter-bar {
        justify-content: center;
      }
      @media (max-width: 768px) {
        .filter-bar {
          justify-content: flex-start;
        }
      }

      @media (max-width: 768px) {
        .navbar-container { padding: 18px 24px !important; }
        .desktop-nav { display: none !important; }
        .hamburger { display: flex !important; }
        .grid-4 { grid-template-columns: repeat(2, 1fr) !important; }
        .metric-grid { grid-template-columns: repeat(2, 1fr) !important; }
        .grid-4-logs { grid-template-columns: repeat(1, 1fr) !important; }
        .two-col { grid-template-columns: 1fr !important; gap: 32px !important; }
        .logs-home-grid { grid-template-columns: 1fr !important; }
        .logs-small-grid { grid-template-columns: 1fr 1fr !important; }
        .footer-grid { grid-template-columns: 1fr 1fr !important; }
        .section-pad { padding: 48px 24px !important; }
        .work-gallery-grid { grid-template-columns: 1fr !important; }
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
      case "home": return <HomePage setCurrentPage={setCurrentPage} setSelectedLog={setSelectedLog} setSelectedWork={setSelectedWork} heroData={heroData} worksData={worksData} logsData={logsData} />;
      case "products": return <ProductsPage setCurrentPage={setCurrentPage} setSelectedProduct={setSelectedProduct} productsData={productsData} />;
      case "product-detail": return <ProductDetailPage product={selectedProduct} setCurrentPage={setCurrentPage} />;
      case "works": return <WorksPage setCurrentPage={setCurrentPage} setSelectedWork={setSelectedWork} worksData={worksData} />;
      case "work-detail": return <WorkDetailPage work={selectedWork} setCurrentPage={setCurrentPage} setSelectedWork={setSelectedWork} worksData={worksData} />;
      case "logs": return <LogsPage setCurrentPage={setCurrentPage} setSelectedLog={setSelectedLog} logsData={logsData} />;
      case "log-detail": return <LogDetailPage log={selectedLog} setCurrentPage={setCurrentPage} />;
      case "about": return <AboutPage />;
      case "admin": return <AdminPanel user={user} isAuthReady={isAuthReady} heroData={heroData} worksData={worksData} productsData={productsData} logsData={logsData} />;
      default: return <HomePage setCurrentPage={setCurrentPage} setSelectedLog={setSelectedLog} setSelectedWork={setSelectedWork} heroData={heroData} worksData={worksData} logsData={logsData} />;
    }
  };

  return (
    <div style={{ fontFamily: "'Inter', sans-serif", background: TOKENS.bg, minHeight: "100vh" }}>
      {currentPage !== "admin" && <Navbar currentPage={currentPage} setCurrentPage={setCurrentPage} />}
      <main>{renderPage()}</main>
      {currentPage !== "admin" && <Footer setCurrentPage={setCurrentPage} />}
    </div>
  );
}
