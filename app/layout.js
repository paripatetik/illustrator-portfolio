import localFont from "next/font/local";
import "./globals.css";

const displayFont = localFont({
  src: [
    {
      path: "../lib/fonts/BlushingApple-Regular.ttf",
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
      path: "../lib/fonts/GrowingSeed-Regular.ttf",
      weight: "400",
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
