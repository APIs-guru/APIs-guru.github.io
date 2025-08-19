"use client";

import React from "react";
import { Download, FileText } from "lucide-react";

interface ApiButtonsProps {
  swaggerUrl: string;
  swaggerYamlUrl: string;
  origUrl: string;
  title: string;
  version?: string;
}

async function downloadFile(url: string, filename: string) {
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error("Failed to fetch file");
    const blob = await response.blob();
    const downloadUrl = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = downloadUrl;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(downloadUrl);
  } catch (error) {
    console.error("Download failed:", error);
    alert("Failed to download file. Please try again.");
  }
}

export default function ApiButtons({
  swaggerUrl,
  swaggerYamlUrl,
  origUrl,
  title,
  version,
}: ApiButtonsProps) {
  return (
    <div className="flex flex-wrap gap-3">
      <button
        onClick={() =>
          downloadFile(
            swaggerUrl,
            `${title}${version ? `-v${version}` : ""}-swagger.json`,
          )
        }
        className="py-2 px-4 bg-[#388c9a] rounded text-white hover:bg-[#2a6b77] flex items-center gap-2 transition-colors duration-200"
        title={`Download JSON${version ? ` for version ${version}` : ""}`}
      >
        <Download className="w-4 h-4" />
        JSON
      </button>

      <button
        onClick={() =>
          downloadFile(
            swaggerYamlUrl,
            `${title}${version ? `-v${version}` : ""}-swagger.yaml`,
          )
        }
        className="py-2 px-4 bg-[#388c9a] rounded text-white hover:bg-[#2a6b77] flex items-center gap-2 transition-colors duration-200"
        title={`Download YAML${version ? ` for version ${version}` : ""}`}
      >
        <Download className="w-4 h-4" />
        YAML
      </button>

      <button
        onClick={() =>
          downloadFile(
            origUrl,
            `${title}${version ? `-v${version}` : ""}-original.json`,
          )
        }
        className="py-2 px-4 bg-[#388c9a] rounded text-white hover:bg-[#2a6b77] flex items-center gap-2 transition-colors duration-200"
        title={`Download original${version ? ` for version ${version}` : ""}`}
      >
        <Download className="w-4 h-4" />
        Original
      </button>

      <button
        onClick={() => {
          const url = `https://redocly.github.io/redoc/?url=${swaggerUrl}`;
          const a = document.createElement("a");
          a.href = url;
          a.download = `${title}${version ? `-v${version}` : ""}-docs.html`;
          a.click();
        }}
        className="py-2 px-4 bg-[#388c9a] rounded text-white hover:bg-[#2a6b77] flex items-center gap-2 transition-colors duration-200"
        title={`Download documentation${version ? ` for version ${version}` : ""}`}
      >
        <FileText className="w-4 h-4" />
        Documentation
      </button>
    </div>
  );
}
