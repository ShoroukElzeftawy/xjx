import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://xjewelryx-objects.elzeftawyshorouk.chatgpt.site"),
  title: "XJEWELRYX — Objects With Intent",
  description: "Architectural jewelry in recycled metals. Precision made, designed to remain.",
  icons: { icon: "/brand-assets/logos/xjx-black-mark.png", shortcut: "/brand-assets/logos/xjx-black-mark.png" },
  openGraph: { title: "XJEWELRYX", description: "Objects with intent.", images: ["/og.png"] },
  twitter: { card: "summary_large_image", title: "XJEWELRYX", description: "Objects with intent.", images: ["/og.png"] },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
