import type { Metadata } from "next";
import { Noto_Sans_Bengali, Inter, Sora } from "next/font/google";
import { AdminProviders } from "@/components/admin/admin-providers";
import "../globals.css";

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
  title: "Admin — Street Food Platform",
  robots: "noindex, nofollow",
};

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="bn" className="dark">
      <body className={`admin-theme ${fontSans.variable} ${fontLatin.variable} ${fontHeading.variable} font-sans antialiased`}>
        <AdminProviders>{children}</AdminProviders>
      </body>
    </html>
  );
}
