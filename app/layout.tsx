import type { Metadata } from "next";
import { headers } from "next/headers";
import "./globals.css";

export async function generateMetadata(): Promise<Metadata> {
  const incoming = await headers();
  const host = incoming.get("host") ?? "localhost:3000";
  const protocol = host.startsWith("localhost") ? "http" : "https";
  const image = `${protocol}://${host}/og.png`;
  return {
    title: "XJEWELRYX — Objects With Intent",
    description: "Architectural jewelry in recycled metals. Precision made, designed to remain.",
    icons: { icon: "/favicon.svg" },
    openGraph: { title: "XJEWELRYX", description: "Objects with intent.", images: [image] },
    twitter: { card: "summary_large_image", title: "XJEWELRYX", description: "Objects with intent.", images: [image] },
  };
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
