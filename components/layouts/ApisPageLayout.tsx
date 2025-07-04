import React from "react";
import Head from "next/head";
import Header from "../Header";
import Footer from "../Footer";

interface ApisPageLayoutProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
}

export default function ApisPageLayout({
  children,
  title = "API Directory - APIs.guru",
  description = "Wikipedia for Web APIs. Directory of REST API specs",
}: ApisPageLayoutProps) {
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="preconnect" href="https://api.apis.guru" />
        <link rel="preconnect" href="https://img.shields.io" />
      </Head>

      <Header />

      <div className="page-content apis-list min-h-screen" id="content">
        {children}
      </div>

      <Footer />

      {/* API-specific scripts would be loaded using Next.js Script component in actual implementation */}
    </>
  );
}
