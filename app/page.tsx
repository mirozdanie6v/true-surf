"use client";

import { useEffect, useState } from "react";

const PARTS = ["1", "2", "3", "4", "5", "6a", "6b"];

function decodeBase64Utf8(value: string) {
  const binary = atob(value.replace(/\s+/g, ""));
  const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
  return new TextDecoder("utf-8").decode(bytes);
}

const HERO_STYLE = `
<style id="true-surf-hero-art">
.hero{
  position:relative!important;
  isolation:isolate;
  min-height:430px;
  display:flex;
  flex-direction:column;
  justify-content:flex-end;
  padding:28px 20px 24px!important;
  background:
    linear-gradient(90deg,rgba(6,47,54,.96) 0%,rgba(6,47,54,.86) 36%,rgba(6,47,54,.46) 68%,rgba(6,47,54,.20) 100%),
    linear-gradient(180deg,rgba(6,47,54,.06) 0%,rgba(6,47,54,.62) 100%),
    url('/true-surf-hero.svg') 62% center/cover no-repeat!important;
}
.hero:after{
  content:"";
  position:absolute;
  inset:0;
  z-index:-1;
  pointer-events:none;
  background:linear-gradient(180deg,rgba(255,255,255,.05),transparent 32%,rgba(6,47,54,.18));
}
.hero .tribal{opacity:.08!important}
.hero .eyebrow,.hero h1,.hero p,.hero .hero-actions{position:relative;z-index:2}
.hero h1{max-width:330px;text-shadow:0 3px 20px rgba(0,0,0,.28)}
.hero p{max-width:330px;text-shadow:0 2px 14px rgba(0,0,0,.22)}
@media (max-width:430px){
  .hero{
    min-height:500px;
    padding:26px 18px 22px!important;
    background:
      linear-gradient(180deg,rgba(6,47,54,.12) 0%,rgba(6,47,54,.28) 36%,rgba(6,47,54,.92) 72%,rgba(6,47,54,.98) 100%),
      url('/true-surf-hero.svg') 67% 40%/cover no-repeat!important;
  }
  .hero h1{max-width:100%}
  .hero p{max-width:100%}
}
</style>`;

export default function Home() {
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadLanding() {
      try {
        const responses = await Promise.all(
          PARTS.map((part) => fetch(`/landing-parts/${part}.txt`, { cache: "no-store" })),
        );

        for (const response of responses) {
          if (!response.ok) {
            throw new Error(`Landing payload failed to load: ${response.status}`);
          }
        }

        const chunks = await Promise.all(responses.map((response) => response.text()));
        if (cancelled) return;

        let html = decodeBase64Utf8(chunks.join(""));
        html = html.replace("</head>", `${HERO_STYLE}</head>`);
        document.open();
        document.write(html);
        document.close();
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Landing failed to load");
        }
      }
    }

    loadLanding();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <main style={{ minHeight: "100vh", display: "grid", placeItems: "center", padding: 24 }}>
      <p>{error ?? "TRUE SURF"}</p>
    </main>
  );
}
