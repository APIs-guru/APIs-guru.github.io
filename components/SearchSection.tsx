import React from "react";
import { Input } from "@/components/ui/input";

interface SearchSectionProps {
  searchTerm: string;
  apiCount: number;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onCopyLink: () => void;
  isCopied: boolean;
}

export function SearchSection({
  searchTerm,
  apiCount,
  onSearchChange,
  onCopyLink,
  isCopied,
}: SearchSectionProps) {
  return (
    <div id="search" className="mb-6 max-w-2xl mx-auto">
      <div className="mb-2 flex justify-between items-center">
        <label
          htmlFor="search-input"
          className="text-lg font-medium text-gray-700"
        >
          Filter {apiCount.toLocaleString()} APIs&nbsp;
          <button
            id="btnCopy"
            onClick={onCopyLink}
            className={`inline-flex items-center ${searchTerm ? "" : "hidden"}`}
            title="Copy search link to clipboard"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              className="h-5 w-5 text-gray-600"
            >
              <title>Copy search link to clipboard</title>
              <path d="M18 6v-6h-18v18h6v6h18v-18h-6zm-12 10h-4v-14h14v4h-10v10zm16 6h-14v-14h14v14z"></path>
            </svg>
            {isCopied && (
              <span className="ml-1 text-sm text-green-600">Copied!</span>
            )}
          </button>
        </label>
      </div>
      <Input
        id="search-input"
        type="search"
        placeholder="Search…"
        value={searchTerm}
        onChange={onSearchChange}
        className="w-full"
        required
      />
    </div>
  );
}
