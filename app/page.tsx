"use client";

import { useEffect, useState } from "react";

const PARTS = ["1", "2", "3", "4", "5", "6a", "6b"];

function decodeBase64Utf8(value: string) {
  const binary = atob(value.replace(/\s+/g, ""));
  const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
  return new TextDecoder("utf-8").decode(bytes);
}

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

        const html = decodeBase64Utf8(chunks.join(""));
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
