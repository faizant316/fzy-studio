import type { Metadata, Viewport } from "next";
import { Inter, Cormorant_Garamond } from "next/font/google";
import "./globals.css";
import SmoothScroll from "@/components/SmoothScroll";

export const viewport: Viewport = {
  themeColor: "#0a0a0b",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
});

// Serif used inside the Makeup by Roko case-study "preview pane" (Roko's brand font).
const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-cormorant",
  display: "swap",
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
});

const SITE = "https://fzystudio.dev";
const TITLE = "FZY — Web Development Studio";
const DESCRIPTION =
  "FZY is a web development studio building custom platforms for real businesses. Booking systems, dashboards, and automation, designed and engineered end to end. Sacramento, CA.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  metadataBase: new URL(SITE),
  openGraph: { title: TITLE, description: DESCRIPTION, type: "website", url: SITE },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.variable} ${cormorant.variable} antialiased`}>
        <SmoothScroll />
        {children}
      </body>
    </html>
  );
}
