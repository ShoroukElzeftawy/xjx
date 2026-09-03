import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://xjewelryx-objects.elzeftawyshorouk.chatgpt.site"),
  title: "XJEWELRYX — Engineered in New York",
  description: "Direct-to-consumer fine jewelry from 47th Street. Engineered gold, disclosed materials, no storefront markup.",
  icons: { icon: "/brand-assets/logos/xjx-white-mark.png", shortcut: "/brand-assets/logos/xjx-white-mark.png" },
  openGraph: {
    title: "XJEWELRYX",
    description: "Built without the markup.",
    images: ["/og.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "XJEWELRYX",
    description: "Built without the markup.",
    images: ["/og.png"],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
