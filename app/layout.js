import localFont from "next/font/local";
import "./globals.css";
import { absoluteUrl, siteDescription, siteName, siteTitle, siteUrl } from "@/lib/seo";

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

export const metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: siteTitle,
    template: `%s | ${siteName}`,
  },
  description: siteDescription,
  applicationName: siteName,
  authors: [{ name: siteName }],
  creator: siteName,
  publisher: siteName,
  keywords: [
    "Olena Oprich",
    "children's book illustrator",
    "children's illustration",
    "storybook illustration",
    "book illustration portfolio",
    "Ukrainian illustrator",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    siteName,
    title: siteTitle,
    description: siteDescription,
    images: [
      {
        url: absoluteUrl("/olena_hero.jpg"),
        width: 1000,
        height: 1000,
        alt: "Portrait illustration by Olena Oprich",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteTitle,
    description: siteDescription,
    images: [absoluteUrl("/olena_hero.jpg")],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
};

export default function RootLayout({ children }) {
  return (

    <html lang="uk" className={`${displayFont.variable} ${funFont.variable}`}>
      <body>
        <div className="site-background">
          {children}
        </div>
        
      </body>
    </html>
  
  );
}
