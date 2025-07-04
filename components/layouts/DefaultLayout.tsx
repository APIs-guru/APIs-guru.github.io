import React from "react";
import MainLayout from "./MainLayout";
import Support from "../Support";

interface DefaultLayoutProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
  image?: string;
}

export default function DefaultLayout({
  children,
  title,
  description,
  image,
}: DefaultLayoutProps) {
  return (
    <MainLayout title={title} description={description} image={image}>
      <div className="container mx-auto px-4">
        <Support />
        {children}
      </div>
    </MainLayout>
  );
}
