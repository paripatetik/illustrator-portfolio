import { Fredoka, Playfair_Display } from "next/font/google";
import "./globals.css";

const funFont = Fredoka({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-fun",
});

const displayFont = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-display",
});

export default function RootLayout({ children }) {
  return (
    <html lang="uk" className={`${funFont.variable} ${displayFont.variable}`}>
      <body>
        {children}
      </body>
    </html>
  );
}
