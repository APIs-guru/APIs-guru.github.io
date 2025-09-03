"use client";

import { useState } from "react";
import { Download, Copy, ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface JsonTreeActionsProps {
  swaggerUrl: string;
  swaggerYamlUrl: string;
  title: string;
  version?: string;
  jsonData?: any;
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
    toast.error("Failed to download file. Please try again.");
  }
}

export default function JsonTreeActions({
  swaggerUrl,
  swaggerYamlUrl,
  title,
  version,
  jsonData,
}: JsonTreeActionsProps) {
  const copyToClipboard = async (data: string, format: string) => {
    try {
      await navigator.clipboard.writeText(data);
      toast.success(`Copied ${format} to clipboard`);
    } catch (err) {
      toast.error(`Failed to copy ${format}`);
    }
  };

  const handleCopyJson = async () => {
    if (jsonData) {
      await copyToClipboard(JSON.stringify(jsonData, null, 2), "JSON");
    }
  };

  const handleCopyYaml = async () => {
    try {
      const response = await fetch(swaggerYamlUrl);
      const yamlText = await response.text();
      await copyToClipboard(yamlText, "YAML");
    } catch (err) {
      toast.error("Failed to fetch and copy YAML");
    }
  };

  const handleDownloadJson = () => {
    downloadFile(
      swaggerUrl,
      `${title}${version ? `-v${version}` : ""}-swagger.json`
    );
  };

  const handleDownloadYaml = () => {
    downloadFile(
      swaggerYamlUrl,
      `${title}${version ? `-v${version}` : ""}-swagger.yaml`
    );
  };

  return (
    <div className="absolute top-4 right-4 flex gap-2 z-10">
      {/* Download Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            size="sm"
            className="h-8 px-3 bg-black/60 hover:bg-black/80 text-white border border-gray-600 backdrop-blur-sm"
          >
            <Download className="h-3 w-3 mr-1" />
            Download
            <ChevronDown className="h-3 w-3 ml-1" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={handleDownloadJson}>JSON</DropdownMenuItem>
          <DropdownMenuItem onClick={handleDownloadYaml}>YAML</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Copy Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            size="sm"
            className="h-8 px-3 bg-black/60 hover:bg-black/80 text-white border border-gray-600 backdrop-blur-sm"
          >
            <Copy className="h-3 w-3 mr-1" />
            Copy
            <ChevronDown className="h-3 w-3 ml-1" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={handleCopyJson}>JSON</DropdownMenuItem>
          <DropdownMenuItem onClick={handleCopyYaml}>YAML</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
