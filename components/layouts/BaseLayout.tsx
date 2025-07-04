import React from "react";
import Head from "next/head";

interface BaseLayoutProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
  image?: string;
}

export default function BaseLayout({
  children,
  title = "APIs.guru",
  description = "Wikipedia for Web APIs. Directory of REST API specs",
  image = "/assets/images/banner.svg",
}: BaseLayoutProps) {
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        {image && <meta property="og:image" content={image} />}
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {children}
      {/* Additional scripts would go here */}
    </>
  );
}
