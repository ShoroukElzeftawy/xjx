import type { Metadata, Viewport } from "next";
import "./globals.css";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export const metadata: Metadata = {
  metadataBase: new URL("https://xjewelryx-objects.elzeftawyshorouk.chatgpt.site"),
  title: "XJEWELRYX — Engineered in Canada",
  description: "Direct-to-consumer fine jewelry from Canada. We cut the fluff.",
  icons: { icon: "/brand-assets/logos/xjx-white-mark.png", shortcut: "/brand-assets/logos/xjx-white-mark.png" },
  openGraph: {
    title: "XJEWELRYX",
    description: "We cut the fluff.",
    images: ["/og.jpg"],
  },
  twitter: {
    card: "summary_large_image",
    title: "XJEWELRYX",
    description: "We cut the fluff.",
    images: ["/og.jpg"],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
