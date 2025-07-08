import { Geist, Geist_Mono, Roboto } from "next/font/google";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Support from "@/components/Support";
import Script from "next/script";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const roboto = Roboto({
  variable: "--font-roboto",
  subsets: ["latin"],
  weight: ["300", "400"],
  style: ["normal", "italic"],
  display: "swap",
});

export const metadata = {
  title: "APIs.guru - Wikipedia for Web APIs",
  description: "Wikipedia for Web APIs. Directory of REST API specs",
  viewport: "width=device-width, initial-scale=1",
  icons: {
    icon: [
      {
        url: "/images/favicons/icon-16x16.png",
        sizes: "16x16",
        type: "image/png",
      },
      {
        url: "/images/favicons/icon-32x32.png",
        sizes: "32x32",
        type: "image/png",
      },
      {
        url: "/images/favicons/icon-96x96.png",
        sizes: "96x96",
        type: "image/png",
      },
    ],
  },
  openGraph: {
    title: "APIs.guru - Wikipedia for Web APIs",
    description: "Wikipedia for Web APIs. Directory of REST API specs",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${roboto.variable} antialiased`}
      >
        <Header />

        <main className="min-h-screen bg-white">{children}</main>

        <Footer />

        {/* Google Analytics - Replace with your GA ID */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-XXXXXXXXXX');
          `}
        </Script>
      </body>
    </html>
  );
}
