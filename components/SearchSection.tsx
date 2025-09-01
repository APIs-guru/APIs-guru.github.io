"use client";

import { SearchIcon } from "lucide-react";

import * as Sentry from "@sentry/browser";
import {
  SearchBox,
  useInstantSearch,
  useSearchBox,
  PoweredBy,
} from "react-instantsearch";
import { useEffect, useState } from "react";

export function SearchSection() {
  const { results } = useInstantSearch();
  const { query } = useSearchBox();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && query) {
      Sentry.addBreadcrumb({
        category: "search",
        message: `Search query executed: ${query}`,
        level: "info",
        data: {
          query_length: query.length,
          results_count: results.nbHits,
          search_timestamp: new Date().toISOString(),
          search_interface: "main_search",
        },
      });
    }
  }, [mounted, query, results.nbHits]);

  const handleSearchFocus = () => {
    Sentry.addBreadcrumb({
      category: "ui.interaction",
      message: "User focused on main search input field",
      level: "info",
      data: {
        search_interface: "main_search",
        query_length: query ? query.length : 0,
        timestamp: new Date().toISOString(),
      },
    });
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="border-2 border-gray-200 rounded-xl transition-all duration-200 shadow-sm hover:shadow-md">
        <div className="flex items-center">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
              <SearchIcon className="h-5 w-5 text-gray-400" />
            </div>
            <SearchBox
              placeholder={
                mounted
                  ? `Search through ${results.nbHits.toLocaleString("en-US")} APIs...`
                  : "Search APIs..."
              }
              classNames={{
                form: "relative",
                input:
                  "w-full pl-12 pr-4 py-2 text-lg border-0 bg-transparent focus:outline-none",
                submit: "hidden",
                reset: "hidden",
                loadingIndicator: "hidden",
              }}
              onFocus={handleSearchFocus}
            />
          </div>
          <div className="flex items-center pr-4 border-l border-gray-200 ml-2 pl-4">
            {mounted ? (
              <PoweredBy
                classNames={{
                  root: "text-sm text-gray-500",
                  link: "text-blue-600 hover:text-blue-800 no-underline",
                  logo: "h-4 w-auto ml-1",
                }}
              />
            ) : (
              <div aria-hidden="true" className="h-4 w-[90px]" />
            )}
          </div>
        </div>
      </div>
      <div
        className="my-3 min-h-[1.75rem] text-lg text-gray-600 text-center"
        aria-live="polite"
      >
        <span
          suppressHydrationWarning
          className={`inline-block transition-opacity duration-200 ${
            mounted && query ? "opacity-100" : "opacity-0"
          }`}
        >
          {mounted && query
            ? `${results.nbHits.toLocaleString("en-US")} APIs found`
            : ""}
        </span>
      </div>
    </div>
  );
}
