"use client";

import React from "react";
import { FileText, ExternalLink } from "lucide-react";

interface ApiButtonsProps {
  swaggerUrl: string;
  title: string;
  version?: string;
}

export default function ApiButtons({
  swaggerUrl,
  title,
  version,
}: ApiButtonsProps) {
  const handleViewDocs = () => {
    const url = `https://redocly.github.io/redoc/?url=${swaggerUrl}`;
    window.open(url, "_blank");
  };

  return (
    <button
      onClick={handleViewDocs}
      className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#388c9a] to-[#2a6b77] text-white font-medium rounded-lg hover:from-[#2a6b77] hover:to-[#1e4d56] transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
      title={`View documentation${version ? ` for version ${version}` : ""}`}
    >
      <FileText className="w-5 h-5" />
      View Documentation
      <ExternalLink className="w-4 h-4" />
    </button>
  );
}
