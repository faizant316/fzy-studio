import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono, Syne } from "next/font/google";
import "./globals.css";

export const viewport: Viewport = { themeColor: "#0a0a0a" };

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "swap",
  weight: ["400", "500"],
});

const syne = Syne({
  subsets: ["latin"],
  variable: "--font-syne",
  display: "swap",
  weight: ["400", "600", "700", "800"],
});

const SITE = "https://fzystudio.dev";
const TITLE = "FZY — Web Development Studio";
const DESCRIPTION =
  "FZY is a web development studio building custom platforms for real businesses. Booking systems, dashboards, and automation, engineered end to end. Based in Sacramento, CA.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  metadataBase: new URL(SITE),
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    type: "website",
    url: SITE,
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} ${syne.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
