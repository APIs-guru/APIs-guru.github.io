import React from "react";
import { Input } from "@/components/ui/input";

interface SearchSectionProps {
  searchTerm: string;
  apiCount: number;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function SearchSection({
  searchTerm,
  apiCount,
  onSearchChange,
}: SearchSectionProps) {
  return (
    <div id="search" className="mb-8 max-w-3xl mx-auto">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <svg
            className="h-5 w-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
        <Input
          id="search-input"
          type="search"
          placeholder={`Search through ${apiCount.toLocaleString()} APIs...`}
          value={searchTerm}
          onChange={onSearchChange}
          className="w-full pl-12 pr-4 py-6 text-lg border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 shadow-sm hover:shadow-md"
        />
      </div>
      {searchTerm && (
        <div className="mt-3 text-lg text-gray-600 text-center">
          Filtering {apiCount.toLocaleString()} APIs
        </div>
      )}
    </div>
  );
}