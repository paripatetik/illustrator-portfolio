import localFont from "next/font/local";
import "./globals.css";

const displayFont = localFont({
  src: [
    {
      path: "../lib/fonts/Blushing.ttf",
      weight: "400",
      style: "normal",
    },
  ],
  variable: "--font-display",
  display: "swap",
});

const funFont = localFont({
  src: [
    {
      path: "../lib/fonts/line_seed/LINESeedSans_W_Th.woff2",
      weight: "100",
      style: "normal",
    },
    {
      path: "../lib/fonts/line_seed/LINESeedSans_W_Rg.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../lib/fonts/line_seed/LINESeedSans_W_Bd.woff2",
      weight: "700",
      style: "normal",
    },
    {
      path: "../lib/fonts/line_seed/LINESeedSans_W_XBd.woff2",
      weight: "800",
      style: "normal",
    },
    {
      path: "../lib/fonts/line_seed/LINESeedSans_W_He.woff2",
      weight: "900",
      style: "normal",
    },
  ],
  variable: "--font-fun",
  display: "swap",
});

export default function RootLayout({ children }) {
  return (
    <html lang="uk" className={`${displayFont.variable} ${funFont.variable}`}>
      <body>
        {children}
      </body>
    </html>
  );
}
