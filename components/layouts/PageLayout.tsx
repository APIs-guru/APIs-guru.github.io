import React from "react";
import Header from "@/components/Header";
import Support from "@/components/Support";
import Footer from "@/components/Footer";

interface PageLayoutProps {
  children: React.ReactNode;
  title: string;
  className?: string;
  showSupport?: boolean;
}

export default function PageLayout({
  children,
  title,
  className = "",
  showSupport = true,
}: PageLayoutProps) {
  return (
    <>
      <Header />
      <Support showSupport={showSupport} />
      <main className="min-h-screen bg-white">
        <div className={`page-wrapper ${className}`}>
          <h1 className="text-4xl font-bold mb-6">{title}</h1>
          {children}
        </div>
      </main>
      <Footer />
    </>
  );
}
