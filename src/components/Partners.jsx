import React from "react";

export default function Partners() {
  const items = [
    { src: "/logos/polarbyte.svg",   alt: "Polarbyte" },
    { src: "/logos/nebulaworks.svg", alt: "NebulaWorks" },
    { src: "/logos/aurorastack.svg", alt: "AuroraStack" },
    { src: "/logos/quasarlabs.svg",  alt: "Quasar Labs" },
    { src: "/logos/latticecloud.svg",alt: "LatticeCloud" },
    { src: "/logos/driftline.svg",   alt: "Driftline" },
    { src: "/logos/forgenine.svg",   alt: "ForgeNine" },
    { src: "/logos/bluelantern.svg", alt: "Blue Lantern" },
  ];

  return (
    <section id="partners" className="container" aria-label="Partners" style={{ paddingBlock: 56 }}>
      <h3 style={{ textAlign: "center", marginBottom: 24, opacity:.9 }}>
        Trusted by forward-thinking teams
      </h3>
      <ul className="logo-grid" role="list" style={{ listStyle: "none", margin: 0, padding: 0 }}>
        {items.map(it => (
          <li key={it.alt} className="logo-item">
            <img src={it.src} alt={it.alt} loading="lazy" decoding="async" />
          </li>
        ))}
      </ul>
    </section>
  );
}
