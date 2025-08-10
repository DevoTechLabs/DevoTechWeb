// App.jsx  —— DevoTech 占位站（Framer Motion 版）
// 重点修复：把 .to(...) 全部改为 useTransform / useMotionTemplate；去除 react-spring 混用

import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion, useScroll, useTransform, useMotionTemplate } from "framer-motion";
import { useTranslation } from 'react-i18next'; // language switch
import Partners from "./components/Partners.jsx";

function useDarkMode() {
  const [theme, setTheme] = useState(
    typeof document !== "undefined"
      ? document.documentElement.getAttribute("data-theme") || "dark"
      : "dark"
  );
  useEffect(() => {
    if (typeof document === "undefined") return;
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);
  return { theme, setTheme };
}

function Header() {
  const { t, i18n } = useTranslation();
  const { theme, setTheme } = useDarkMode();
  const [open, setOpen] = useState(false);
  const { scrollYProgress } = useScroll();
  const bgOpacity = useTransform(scrollYProgress, [0, 0.15, 1], [0.25, 0.6, 0.85]);
  const bg = useMotionTemplate`rgba(2,6,23, ${bgOpacity})`;
  const lang = (i18n.resolvedLanguage || i18n.language || 'en').split('-')[0];

  useEffect(() => {
    const onHash = () => setOpen(false);
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  return (
    <motion.header className="header" style={{ backgroundColor: bg }}>
      <div className="container nav">
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <Logo />
          <span style={{ fontWeight: 800, letterSpacing: 0.3 }}>{t("brand", { defaultValue: "DevoTech" })}</span>
        </div>

        <nav className="nav-desktop" aria-label="Primary">
          <a href="#home">{t("nav.home", { defaultValue: "首页" })}</a>
          <a href="#products">{t("nav.products", { defaultValue: "产品" })}</a>
          <a href="#services">{t("nav.services", { defaultValue: "服务" })}</a>
          <a href="#portfolio">{t("nav.portfolio", { defaultValue: "案例" })}</a>
          <a href="#team">{t("nav.team", { defaultValue: "团队" })}</a>
          <a href="#careers">{t("nav.careers", { defaultValue: "招聘" })}</a>
          <a href="#blog">{t("nav.blog", { defaultValue: "博客" })}</a>
          <a href="#faq">{t("nav.faq", { defaultValue: "FAQ" })}</a>
          <a href="#contact">{t("nav.contact", { defaultValue: "联系" })}</a>
        </nav>

        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <select
            aria-label={t('lang.select', { defaultValue: 'Language' })}
            className="btn ghost"
            value={lang}
            onChange={(e) => i18n.changeLanguage(e.target.value)}
          >
            <option value="en">EN</option>
            <option value="zh">CN</option>
            <option value="fr">FR</option>
          </select>

          <button className="btn ghost" onClick={() => setTheme(theme === "dark" ? "light" : "dark")} aria-label="切换主题">
            {theme === "dark" ? "Light" : "Dark"}
          </button>

          <button className="btn menu-btn" onClick={() => setOpen(v => !v)} aria-expanded={open} aria-controls="mobile-menu">
            菜单
          </button>

          <a className="btn" href="#contact">Get in Touch</a>
        </div>
      </div>

      {open && (
        <div id="mobile-menu" className="container" style={{ paddingBottom: 12 }}>
          <div className="card" style={{ display: "grid", gap: 8 }}>
            <select
              aria-label={t('lang.select', { defaultValue: 'Language' })}
              className="btn ghost"
              value={lang}
              onChange={(e) => i18n.changeLanguage(e.target.value)}
              style={{ marginBottom: 8, width: "100%" }}
            >
              <option value="en">EN</option>
              <option value="zh">中文</option>
              <option value="fr">FR</option>
            </select>

            <a href="#home">{t("nav.home", { defaultValue: "首页" })}</a>
            <a href="#products">{t("nav.products", { defaultValue: "产品" })}</a>
            <a href="#services">{t("nav.services", { defaultValue: "服务" })}</a>
            <a href="#portfolio">{t("nav.portfolio", { defaultValue: "案例" })}</a>
            <a href="#team">{t("nav.team", { defaultValue: "团队" })}</a>
            <a href="#careers">{t("nav.careers", { defaultValue: "招聘" })}</a>
            <a href="#blog">{t("nav.blog", { defaultValue: "博客" })}</a>
            <a href="#faq">{t("nav.faq", { defaultValue: "FAQ" })}</a>
            <a href="#contact">{t("nav.contact", { defaultValue: "联系" })}</a>
          </div>
        </div>
      )}
    </motion.header>
  );
}


function Logo() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" role="img" aria-label="DevoTech logo">
      <path d="M12 2l8 4.5v9L12 20l-8-4.5v-9L12 2z" fill="none" stroke="currentColor" />
      <circle cx="12" cy="12" r="2.5" fill="currentColor" />
    </svg>
  );
}

function Hero() {
  const { t, i18n } = useTranslation();
  const HERO_H = "clamp(420px, 82vh, 900px)";

  // allow title1 to wrap on narrow screens
  const [isNarrow, setIsNarrow] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 560px)");
    const onChange = e => setIsNarrow(e.matches);
    onChange(mq);
    mq.addEventListener?.("change", onChange) || mq.addListener(onChange);
    return () => mq.removeEventListener?.("change", onChange) || mq.removeListener(onChange);
  }, []);

  const lang = (i18n.resolvedLanguage || "en").split("-")[0];
  const rawTitle1 = t("hero.title1", { defaultValue: "Devotion · Evolution · Volition" });
  // keep unbroken on wider screens for English; allow wrap on phones or non-Latin languages
  const title1Text = lang === "en" && !isNarrow ? rawTitle1.replace(/\s/g, "\u00A0") : rawTitle1;

  return (
    <section
      id="home"
      aria-label="Hero"
      style={{
        position: "relative",
        left: "50%", right: "50%", marginLeft: "-50vw", marginRight: "-50vw",
        width: "100vw", minHeight: HERO_H
      }}
    >
      <div style={{ position: "absolute", inset: 0, overflow: "hidden", zIndex: 0 }}>
        <video
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          poster="/hero.jpg"
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", filter: "brightness(.9)" }}
        >
          <source src="/hero.webm" type="video/webm" />
          <source src="/hero.mp4"  type="video/mp4" />
        </video>
        <div
          style={{
            position: "absolute", inset: 0, zIndex: 1,
            background:
              "radial-gradient(1000px 500px at 50% 20%, rgba(96,165,250,.18), transparent 60%)," +
              "linear-gradient(180deg, rgba(2,6,23,0) 0%, rgba(2,6,23,.45) 65%, rgba(2,6,23,.70) 100%)"
          }}
        />
      </div>

      <div
        style={{
          position: "relative", zIndex: 2, display: "grid", placeItems: "center",
          minHeight: HERO_H, paddingInline: 16
        }}
      >
        <div style={{ maxWidth: 1100, marginInline: "auto", width: "100%" }}>
          <div style={{ textAlign: "center" }}>
            <span
              style={{
                display: "inline-block", padding: "8px 14px", borderRadius: 999,
                background: "rgba(255,255,255,.06)", border: "1px solid rgba(255,255,255,.08)", fontSize: 14
              }}
            >
              {t("hero.badge", { defaultValue: "Empower Your Digital Future" })}
            </span>

            <h1 style={{ marginTop: 14, lineHeight: 1.1 }}>
              <div style={{ display: "flex", justifyContent: "center" }}>
                <span className="hero-title1">{title1Text}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "center" }}>
                <span className="hero-title2" style={{ marginTop: 6 }}>
                  {t("hero.title2", { defaultValue: "DevoTech keeps you on track" })}
                </span>
              </div>
            </h1>

            <p style={{ color: "var(--muted)", marginTop: 8, maxWidth: 880, marginInline: "auto", textAlign: "center" }}>
              {t("hero.desc", { defaultValue: "Custom software · Mobile · AI & Data · Cloud-native · Ops" })}
            </p>

            <div style={{ marginTop: 18, display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
              <a className="btn" href="#products">{t("hero.ctaView", { defaultValue: "View products" })}</a>
              <a className="btn ghost" href="#contact">{t("hero.ctaContact", { defaultValue: "Contact us" })}</a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}


const FadeIn = ({ children, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 12 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-80px" }}
    transition={{ duration: 0.6, delay }}
  >
    {children}
  </motion.div>
);

function Products() {
  const items = [
    { t: "DevoTrack", d: "一站式发货与物流追踪中台", tag: "Coming soon" },
    { t: "VisionKit", d: "轻量图像识别与质检 SDK", tag: "Developing" },
    { t: "DataFlow", d: "事件流与可观测性框架", tag: "BetaTesting" },
  ];
  return (
    <section id="products" className="section">
      <div className="container">
        <h2>产品中心</h2>
        <p><small>以下为占位信息，可逐步替换真实截图与文案</small></p>
        <div className="grid" style={{ marginTop: 16 }}>
          {items.map((it, i) => (
            <FadeIn key={it.t} delay={i * 0.05}>
              <motion.div className="card" whileHover={{ y: -4 }}>
                <div className="badge">{it.tag}</div>
                <h3 style={{ margin: "10px 0" }}>{it.t}</h3>
                <p style={{ color: "var(--muted)" }}>{it.d}</p>
                <div style={{ height: 10 }} />
                <button className="btn ghost">查看详情</button>
              </motion.div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

function Services() {
  const items = [
    { t: "定制软件", d: "Web / 桌面 / 微服务 / 集成" },
    { t: "移动端", d: "iOS / Android / 跨平台" },
    { t: "AI & ML", d: "NLP、CV、LLM 应用与微调" },
    { t: "数据工程", d: "ETL、仓库、可视化、治理" },
    { t: "云原生", d: "K8s、Serverless、DevOps" },
    { t: "安全合规", d: "渗透、合规、审计" },
  ];
  return (
    <section id="services" className="section">
      <div className="container">
        <h2>服务</h2>
        <div className="grid" style={{ marginTop: 16 }}>
          {items.map((it, i) => (
            <FadeIn key={it.t} delay={i * 0.04}>
              <motion.div className="card" whileHover={{ scale: 1.02 }}>
                <h3>{it.t}</h3>
                <p style={{ color: "var(--muted)" }}>{it.d}</p>
              </motion.div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

function BeforeAfter({ before, after, alt = "" }) {
  const [pct, setPct] = useState(50);
  const px = useMemo(() => `${pct}%`, [pct]);
  return (
    <div className="baWrap" aria-label="前后对比组件">
      <img src={after} alt={alt + " after"} loading="lazy" />
      <div className="baTop" style={{ width: px }}>
        <img src={before} alt={alt + " before"} loading="lazy" />
      </div>
      <div className="baHandle" style={{ left: px }} />
      <input
        aria-label="调整对比"
        type="range" min="0" max="100" value={pct}
        onChange={(e) => setPct(Number(e.target.value))}
        style={{ position: "absolute", inset: 0, opacity: 0, cursor: "ew-resize" }}
      />
    </div>
  );
}

function Portfolio() {
  return (
    <section id="portfolio" className="section">
      <div className="container">
        <h2>案例</h2>
        <div style={{ display: "grid", gap: 16 }}>
          <FadeIn>
            <div className="card">
              <h3>“下单 → 配送”可视化</h3>
              <p style={{ color: "var(--muted)" }}>占位描述：通过可观测性将订单生命周期透明化，降低异常定位时间 45%。</p>
              <BeforeAfter
                before="https://images.unsplash.com/photo-1504639725590-34d0984388bd?q=80&w=1400&auto=format&fit=crop"
                after="https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=1400&auto=format&fit=crop"
                alt="dashboard"
              />
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}

function Team() {
  const people = new Array(6).fill(0).map((_, i) => ({
    name: `成员 ${i + 1}`, title: i === 0 ? "Founder / CEO" : "Engineer",
    avatar: `https://i.pravatar.cc/150?img=${i + 11}`
  }));
  return (
    <section id="team" className="section">
      <div className="container">
        <h2>团队</h2>
        <div className="grid" style={{ marginTop: 16 }}>
          {people.map((p, i) => (
            <FadeIn key={p.name} delay={i * 0.03}>
              <motion.div className="card" whileHover={{ y: -6 }}>
                <img src={p.avatar} alt={p.name} loading="lazy" />
                <h3 style={{ margin: "10px 0 0" }}>{p.name}</h3>
                <small>{p.title}</small>
              </motion.div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

function useAutoCarousel(length, ms = 3500) {
  const [i, setI] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setI(v => (v + 1) % length), ms);
    return () => clearInterval(id); // FIX: 清理 interval，防止内存泄漏
  }, [length, ms]);
  return [i, setI];
}

function Testimonials() {
  const data = [
    { name: "Acme Inc.", text: "交付效率很高，需求梳理到上线体验顺滑。" },
    { name: "North Logistics", text: "可观测性落地后，运维 MTTR 大幅降低。" },
    { name: "FinBridge", text: "在合规前提下完成了复杂系统的云原生改造。" },
  ];
  const [i, setI] = useAutoCarousel(data.length, 4000);

  return (
    <section className="section">
      <div className="container">
        <h2>客户评价</h2>
        <div className="card" role="region" aria-live="polite">
          <p style={{ fontSize: 18, minHeight: 48 }}>“{data[i].text}”</p>
          <small>— {data[i].name}</small>
          <div style={{ marginTop: 12, display: "flex", gap: 6 }}>
            {data.map((_, idx) => (
              <button
                key={idx}
                className="kbd"
                onClick={() => setI(idx)}
                aria-label={`切换到第 ${idx + 1} 条`}
                style={{ opacity: i === idx ? 1 : 0.5 }}
              >{idx + 1}</button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Careers() {
  const [open, setOpen] = useState(false);
  const jobs = [
    { t: "前端工程师", loc: "Remote", type: "Full-time" },
    { t: "后端工程师", loc: "Remote", type: "Full-time" },
    { t: "实习生 - 软件", loc: "Remote", type: "Intern" },
  ];
  return (
    <section id="careers" className="section">
      <div className="container">
        <h2>招聘</h2>
        <div className="grid" style={{ marginTop: 16 }}>
          {jobs.map((j) => (
            <div className="card" key={j.t}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <h3 style={{ margin: 0 }}>{j.t}</h3>
                  <small>{j.loc} · {j.type}</small>
                </div>
                <button className="btn" onClick={() => setOpen(true)}>申请</button>
              </div>
            </div>
          ))}
        </div>

        {open && (
          <div role="dialog" aria-modal="true"
               style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.5)", display: "grid", placeItems: "center" }}
               onClick={() => setOpen(false)}>
            <div className="card" style={{ width: 520, maxWidth: "90vw" }} onClick={(e) => e.stopPropagation()}>
              <h3>投递简历</h3>
              <form onSubmit={(e) => { e.preventDefault(); alert("占位：已提交"); setOpen(false); }}>
                <fieldset>
                  <label>姓名</label>
                  <input required placeholder="Your name" />
                </fieldset>
                <fieldset>
                  <label>Email</label>
                  <input type="email" required placeholder="you@company.com" />
                </fieldset>
                <fieldset>
                  <label>自我介绍</label>
                  <textarea rows={4} placeholder="简单描述你的优势…" />
                </fieldset>
                <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
                  <button type="button" className="btn ghost" onClick={() => setOpen(false)}>取消</button>
                  <button className="btn">提交</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

function Blog() {
  const posts = new Array(4).fill(0).map((_, i) => ({
    t: `占位文章标题 ${i + 1}`,
    cover: `https://picsum.photos/seed/blog${i}/800/480`,
    tag: i % 2 ? "Engineering" : "Announcement"
  }));
  return (
    <section id="blog" className="section">
      <div className="container">
        <h2>博客</h2>
        <div className="grid" style={{ marginTop: 16 }}>
          {posts.map((p) => (
            <div className="card" key={p.t}>
              <img src={p.cover} alt="" loading="lazy" />
              <div className="badge" style={{ marginTop: 10 }}>{p.tag}</div>
              <h3 style={{ margin: "10px 0" }}>{p.t}</h3>
              <button className="btn ghost">阅读全文</button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FAQ() {
  const [open, setOpen] = useState(null);
  const qas = [
    { q: "可以只做占位先上线吗？", a: "可以。先占位+局部真实内容，后续逐步替换。" },
    { q: "支持中英文切换？", a: "支持，多语言可后续接入 i18n。" },
    { q: "表单如何接入？", a: "可用 Formspree/EmailJS 或自建后端 API。" },
  ];
  return (
    <section id="faq" className="section">
      <div className="container">
        <h2>常见问题</h2>
        <div style={{ display: "grid", gap: 10, marginTop: 16 }}>
          {qas.map((it, idx) => {
            const active = open === idx;
            return (
              <div className="card" key={it.q}>
                <button
                  onClick={() => setOpen(active ? null : idx)}
                  aria-expanded={active}
                  className="btn ghost"
                  style={{ width: "100%", textAlign: "left" }}
                >
                  {it.q}
                </button>
                {active && <p style={{ marginTop: 10, color: "var(--muted)" }}>{it.a}</p>}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function Contact() {
  return (
    <section id="contact" className="section">
      <div className="container">
        <h2>联系我们</h2>
        <div className="grid" style={{ marginTop: 16 }}>
          <div className="card">
            <form onSubmit={(e) => { e.preventDefault(); alert("占位：已发送"); }}>
              <fieldset>
                <label>姓名</label>
                <input required placeholder="Your name" />
              </fieldset>
              <fieldset>
                <label>Email</label>
                <input type="email" required placeholder="you@company.com" />
              </fieldset>
              <fieldset>
                <label>留言</label>
                <textarea rows={5} placeholder="有什么我们可以帮到你？" />
              </fieldset>
              <button className="btn">发送</button>
            </form>
          </div>
          <div className="card">
            <h3>信息</h3>
            <p><b>Email:</b> contact@devotechlabs.com</p>
            <p><b>地址:</b> Moncton, NB, Canada</p>
            <div className="logoRow">
              <span className="kbd">Twitter</span>
              <span className="kbd">LinkedIn</span>
              <span className="kbd">GitHub</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer>
      <div className="container" style={{ display: "flex", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
        <small>© {new Date().getFullYear()} DevoTech. All rights reserved.</small>
        <div style={{ display: "flex", gap: 10 }}>
          <a href="#privacy"><small>隐私</small></a>
          <a href="#terms"><small>条款</small></a>
        </div>
      </div>
    </footer>
  );
}

export default function App() {
  return (
    <>
      <Header />
      <Hero />
      <main>
        <section className="section">
          <div className="container">
            <div className="logoRow">
              <span className="kbd">Partner A</span>
              <span className="kbd">Partner B</span>
              <span className="kbd">Partner C</span>
              <span className="kbd">Partner D</span>
            </div>
          </div>
        </section>
        <Products />
        <Services />
        <Portfolio />
        <Team />
        <Testimonials />
        <Careers />
        <Blog />
        <FAQ />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
