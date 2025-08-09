// App.jsx  —— DevoTech 占位站（Framer Motion 版）
// 重点修复：把 .to(...) 全部改为 useTransform / useMotionTemplate；去除 react-spring 混用

import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion, useScroll, useTransform, useMotionTemplate } from "framer-motion";

// —— 基础样式（你可移到独立 CSS 文件）——
const baseStyles = `
:root{--bg:#0b1120;--fg:#e5e7eb;--muted:#94a3b8;--card:#111827;--brand:#60a5fa;}
:root[data-theme="light"]{--bg:#ffffff;--fg:#0b1120;--muted:#334155;--card:#f1f5f9;--brand:#2563eb;}
*{box-sizing:border-box} html,body,#root{height:100%}
body{margin:0;background:var(--bg);color:var(--fg);font-family:ui-sans-serif,system-ui,Segoe UI,Roboto,Helvetica,Arial}
a{color:inherit;text-decoration:none}
.container{max-width:1100px;margin:0 auto;padding:0 20px}
.btn{background:var(--brand);border:0;color:#fff;padding:12px 18px;border-radius:10px;font-weight:600;cursor:pointer}
.btn.ghost{background:transparent;border:1px solid var(--brand);color:var(--brand)}
.header{position:sticky;top:0;z-index:50;backdrop-filter:blur(8px);border-bottom:1px solid rgba(255,255,255,.06)}
.nav{display:flex;align-items:center;justify-content:space-between;height:64px}
.nav a{margin:0 10px;opacity:.85}
.hero{position:relative;min-height:72vh;display:grid;place-items:center;overflow:hidden}
.hero h1{font-size:clamp(32px,5vw,56px);margin:0;text-align:center;line-height:1.1}
.grid{display:grid;grid-template-columns:repeat(3,1fr);gap:16px}
.card{background:var(--card);border:1px solid rgba(255,255,255,.06);border-radius:14px;padding:18px}
.section{padding:72px 0;border-top:1px solid rgba(255,255,255,.06)}
.badge{display:inline-block;padding:6px 10px;border:1px solid rgba(255,255,255,.18);border-radius:999px;font-size:12px;opacity:.8}
.logoRow{display:flex;gap:22px;flex-wrap:wrap;opacity:.8}
footer{padding:40px 0;border-top:1px solid rgba(255,255,255,.06)}
.kbd{font-family:ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;background:rgba(255,255,255,.08);padding:2px 6px;border-radius:6px;border:1px solid rgba(255,255,255,.12)}
img{max-width:100%;display:block;border-radius:10px}
input,textarea{width:100%;padding:10px;border-radius:10px;border:1px solid rgba(255,255,255,.15);background:transparent;color:var(--fg)}
fieldset{border:0;padding:0;margin:0 0 12px 0}
label{display:block;margin:0 0 6px 0;font-size:14px;color:var(--muted)}
small{color:var(--muted)}
/* before/after 滑块 */
.baWrap{position:relative;overflow:hidden;border-radius:12px}
.baWrap img{display:block;width:100%;height:auto}
.baTop{position:absolute;inset:0;overflow:hidden}
.baHandle{position:absolute;top:0;bottom:0;width:2px;background:var(--brand);box-shadow:0 0 0 2px rgba(0,0,0,.2)}
/* 响应 */
@media (max-width:900px){.grid{grid-template-columns:1fr}}
`;

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
  // 全局滚动进度
  const { scrollYProgress } = useScroll();
  const bgOpacity = useTransform(scrollYProgress, [0, 0.15, 1], [0.25, 0.6, 0.85]);
  const bg = useMotionTemplate`rgba(2,6,23, ${bgOpacity})`; // FIX: 用 useMotionTemplate 替代 .to
  const { theme, setTheme } = useDarkMode();

  return (
    <motion.header className="header" style={{ backgroundColor: bg }}>
      <div className="container nav">
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <Logo />
          <span style={{ fontWeight: 800, letterSpacing: 0.3 }}>DevoTech</span>
        </div>
        <nav aria-label="Primary">
          <a href="#home">首页</a>
          <a href="#products">产品</a>
          <a href="#services">服务</a>
          <a href="#portfolio">案例</a>
          <a href="#team">团队</a>
          <a href="#careers">招聘</a>
          <a href="#blog">博客</a>
          <a href="#faq">FAQ</a>
          <a href="#contact">联系</a>
        </nav>
        <div style={{ display: "flex", gap: 8 }}>
          <button className="btn ghost" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            aria-label="切换主题">
            {theme === "dark" ? "Light" : "Dark"}
          </button>
          <a className="btn" href="#contact">Get in Touch</a>
        </div>
      </div>
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
  const ref = useRef(null);
  // 基于 section 自身滚动的视差
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["0vh", "-20vh"]); // 背景图上移
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.1]);

  return (
    <section id="home" className="hero" ref={ref} aria-label="Hero">
      <motion.div
        aria-hidden
        style={{
          position: "absolute", inset: -40, zIndex: -1, background:
            "radial-gradient(1200px 600px at 50% 20%, rgba(96,165,250,.25), transparent 60%)",
          filter: "blur(20px)"
        }}
      />
      <motion.img
        src="https://images.unsplash.com/photo-1518779578993-ec3579fee39f?q=80&w=1600&auto=format&fit=crop"
        alt=""
        loading="lazy"
        style={{
          position: "absolute", inset: 0, objectFit: "cover", width: "100%", height: "100%",
          transformOrigin: "center"
        }}
        // FIX: 用 useTransform 绑定 y/scale
        animate={{}}
        transition={{ type: "spring", stiffness: 60, damping: 20 }}
        as={motion.img}
      />
      <motion.div style={{ y, scale, position: "absolute", inset: 0, zIndex: -2 }} />
      <div className="container" style={{ textAlign: "center" }}>
        <span className="badge">Empower Your Digital Future</span>
        <h1 style={{ marginTop: 14 }}>
          从想法到上线，<br />DevoTech 助你高效落地
        </h1>
        <p style={{ color: "var(--muted)" }}>
          定制软件 · 移动端 · AI & 数据 · 云原生 · 交付与运维
        </p>
        <div style={{ marginTop: 18, display: "flex", gap: 10, justifyContent: "center" }}>
          <a className="btn" href="#products">查看产品</a>
          <a className="btn ghost" href="#contact">免费咨询</a>
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
    { t: "VisionKit", d: "轻量图像识别与质检 SDK", tag: "Beta" },
    { t: "DataFlow", d: "事件流与可观测性框架", tag: "Stable" },
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
    { t: "前端工程师", loc: "Remote / Moncton", type: "Full-time" },
    { t: "后端工程师", loc: "Remote / Moncton", type: "Full-time" },
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
  useEffect(() => {
    // SSR 安全注入样式
    const style = document.createElement("style");
    style.innerHTML = baseStyles;
    document.head.appendChild(style);
    return () => { document.head.removeChild(style); };
  }, []);

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
