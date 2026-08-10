import type { Metadata } from "next";
import { Montserrat, Playfair_Display, Poppins, Open_Sans } from "next/font/google";
import "./globals.css";

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
  display: "swap",
});

const openSans = Open_Sans({
  subsets: ["latin"],
  weight: ["600", "700"],
  variable: "--font-open-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Sophea Naildesign | Gepflegte Hände stehen im Mittelpunkt",
  description:
    "Nagelstudio in Winterthur – Maniküre, Pediküre, Shellac, Gel und Acryl. Sophea Naildesign.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de">
      <body
        className={`${montserrat.variable} ${playfair.variable} ${poppins.variable} ${openSans.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
