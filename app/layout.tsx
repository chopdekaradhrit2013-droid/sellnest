import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SellNest — Your business. Your own little corner of the internet.",
  description:
    "Create a beautiful online store, showcase your products and start receiving orders. No coding required. Built for home bakers, Instagram sellers, indie brands and makers.",
  keywords: [
    "online storefront",
    "store creator",
    "small business website",
    "whatsapp store",
    "bakery store online",
    "instagram seller shop",
    "e-commerce for makers",
    "SellNest",
  ],
  authors: [{ name: "SellNest" }],
  openGraph: {
    title: "SellNest — Your business. Your own little corner of the internet.",
    description:
      "Create a beautiful online store, showcase your products and start receiving orders. No coding required.",
    siteName: "SellNest",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&family=Playfair+Display:ital,wght@0,500;0,600;0,700;1,400;1,600&family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=Space+Grotesk:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-sans antialiased bg-[#FBFBFA] text-[#14141C] selection:bg-purple-100 selection:text-purple-900">
        {children}
      </body>
    </html>
  );
}

