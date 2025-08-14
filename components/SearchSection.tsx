import React, { useEffect } from "react";
import { SearchBox, useInstantSearch } from "react-instantsearch";

interface SearchSectionProps {
  searchTerm: string;
  apiCount: number;

}

export function SearchSection({
  searchTerm,
  apiCount,
 
}: SearchSectionProps) {
  const { results } = useInstantSearch({});
  useEffect(() => {
    console.log(results);
  }, [results]);
  return (
    <div id="search" className="mb-8 max-w-3xl mx-auto">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
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
        <SearchBox
          placeholder={`Search through APIs...`}
          classNames={{
            form: "relative",
            input:
              "w-full pl-12 pr-4 py-2 text-lg border-2 border-gray-200 rounded-xl transition-all duration-200 shadow-sm hover:shadow-md",
            submit: "hidden",
            reset: "hidden",
            loadingIndicator: "hidden", // Hide the loading indicator
          }}
        />
      </div>
      {searchTerm && (
        <div className="mt-3 text-lg text-gray-600 text-center">
          {apiCount.toLocaleString()} APIs found
        </div>
      )}
    </div>
  );
}
