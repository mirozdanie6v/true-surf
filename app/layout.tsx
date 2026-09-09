import type { Metadata, Viewport } from "next";
import Script from "next/script";
import "./globals.css";

export const metadata: Metadata = {
  title: "TRUE SURF — Mini App",
  description: "True Surf Bai Dai: уроки, трансфер, прайс и кабинет райдера.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#f4ead7",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ru">
      <body>
        <Script src="https://dashboard.viiversion.com/tracker.js" strategy="afterInteractive" data-project="TRUE SURF" />
        {children}
      </body>
    </html>
  );
}
