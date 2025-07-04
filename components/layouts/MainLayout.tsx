import React from "react";
import BaseLayout from "./BaseLayout";
import Header from "../Header";
import Footer from "../Footer";

interface MainLayoutProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
  image?: string;
}

export default function MainLayout({
  children,
  title,
  description,
  image,
}: MainLayoutProps) {
  return (
    <BaseLayout title={title} description={description} image={image}>
      <Header />
      <div className="min-h-screen">
        <div className="page-content" id="content">
          {children}
        </div>
      </div>
      <Footer />
    </BaseLayout>
  );
}
