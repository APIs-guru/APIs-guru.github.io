"use client";

import { SearchIcon } from "lucide-react";
import React, { useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  SearchBox,
  useInstantSearch,
  useSearchBox,
  PoweredBy,
} from "react-instantsearch";

export function SearchSection() {
  const { results } = useInstantSearch();
  const { query, refine } = useSearchBox();
  const isInitialMount = useRef(true);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (isInitialMount.current) {
      const initialQuery = searchParams.get("query") || "";
      if (initialQuery !== query) {
        refine(initialQuery);
      }
      isInitialMount.current = false;
    }
  }, [refine, searchParams]);

  useEffect(() => {
    if (isInitialMount.current) return;

    const currentQuery = searchParams.get("query") || "";

    if (currentQuery !== query) {
      const params = new URLSearchParams(searchParams);
      if (query) {
        params.set("query", query);
      } else {
        params.delete("query");
      }
      router.push(`?${params.toString()}`, { scroll: false });
    }
  }, [query, router, searchParams]);

  return (
    <div className="max-w-3xl mx-auto">
      <div className="border-2 border-gray-200 rounded-xl transition-all duration-200 shadow-sm hover:shadow-md">
        <div className="flex items-center">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
              <SearchIcon className="h-5 w-5 text-gray-400" />
            </div>
            <SearchBox
              placeholder={`Search through ${results.nbHits.toLocaleString()} APIs...`}
              classNames={{
                form: "relative",
                input:
                  "w-full pl-12 pr-4 py-2 text-lg border-0 bg-transparent focus:outline-none",
                submit: "hidden",
                reset: "hidden",
                loadingIndicator: "hidden",
              }}
            />
          </div>
          <div className="flex items-center pr-4 border-l border-gray-200 ml-2 pl-4">
            <PoweredBy
              classNames={{
                root: "text-sm text-gray-500",
                link: "text-blue-600 hover:text-blue-800 no-underline",
                logo: "h-4 w-auto ml-1",
              }}
            />
          </div>
        </div>
      </div>
      <div
        className="my-3 min-h-[1.75rem] text-lg text-gray-600 text-center"
        aria-live="polite"
      >
        <span
          className={`inline-block transition-opacity duration-200 ${
            query ? "opacity-100" : "opacity-0"
          }`}
        >
          {results.nbHits.toLocaleString()} APIs found
        </span>
      </div>
    </div>
  );
}
