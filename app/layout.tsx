import type { Metadata } from "next";
import { Noto_Sans_Bengali, Inter, Sora } from "next/font/google";
import { Providers } from "@/components/providers";
import "./globals.css";

const fontSans = Noto_Sans_Bengali({
  subsets: ["latin", "bengali"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-sans",
});

const fontLatin = Inter({
  subsets: ["latin"],
  variable: "--font-latin",
});

const fontHeading = Sora({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-heading",
});

export const metadata: Metadata = {
  title: "Street Food",
  description: "Street Food Review System",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="bn" className="dark">
      <body className={`${fontSans.variable} ${fontLatin.variable} ${fontHeading.variable} font-sans antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}