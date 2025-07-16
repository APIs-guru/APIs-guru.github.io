"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { fetchApisInfinite } from "@/services/api";
import { cleanDescription } from "@/utils/textProcessing";
import { updateQueryParam } from "@/utils/urlHelpers";
import { useGridLayout } from "@/hooks/useGridLayout";
import { useApiSearch } from "@/hooks/useApiSearch";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";
import { SearchSection } from "@/components/SearchSection";
import { ApiGrid } from "@/components/ApiGrid";
import { LoadingSkeleton } from "@/components/LoadingSkeleton";

interface SearchClientComponentProps {
  repoStarCounts: Record<string, number>;
}

function SearchClientComponentInner({
  repoStarCounts,
}: SearchClientComponentProps) {
  const searchParams = useSearchParams();
  const initialSearchTerm = searchParams?.get("q") || "";

  const { gridColumns, pageSize } = useGridLayout();
  const {
    searchTerm,
    setSearchTerm,
    allApiCards,
    setAllApiCards,
    loading,
    setLoading,
    loadingMore,
    hasMore,
    currentPage,
    loadMoreApis,
    searchApis,
    resetSearch,
  } = useApiSearch(initialSearchTerm, pageSize);

  const observerRef = useInfiniteScroll({
    hasMore,
    loadingMore,
    loading,
    loadMore: loadMoreApis,
  }) as React.RefObject<HTMLDivElement>;

  const [copyText, setCopyText] = useState("");
  const [isCopied, setIsCopied] = useState(false);
  const [apiMetrics, setApiMetrics] = useState({ numAPIs: 0, numEndpoints: 0 });

  // Initial data fetch
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setLoading(true);

        // Fetch metrics
        const apiMetricsResponse = await fetch(
          "https://api.apis.guru/v2/metrics.json"
        );
        const metrics = await apiMetricsResponse.json();
        setApiMetrics(metrics);

        // Initialize with search term from URL
        await resetSearch(initialSearchTerm);
      } catch (error) {
        console.error("Error fetching initial data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, [pageSize, initialSearchTerm, resetSearch, setLoading]);

  // Handle search term changes with proper debouncing and reset
  useEffect(() => {
    const handleSearchChange = async () => {
      if (searchTerm !== initialSearchTerm) {
        await resetSearch(searchTerm);
      }
    };

    const debounceTimer = setTimeout(handleSearchChange, 300);
    return () => clearTimeout(debounceTimer);
  }, [searchTerm, initialSearchTerm, resetSearch]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    const newUrl = updateQueryParam(searchParams, value);
    setCopyText(newUrl);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(copyText);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  // Update star counts
  useEffect(() => {
    Object.entries(repoStarCounts).forEach(([name, stars]) => {
      const elements = document.querySelectorAll(
        `[data-proj="${name}"].stars-count`
      );
      elements.forEach((el) => {
        if (el) el.textContent = stars.toString();
      });
    });
  }, [repoStarCounts]);

  // Initialize copy text from URL
  useEffect(() => {
    if (!searchParams) return;

    const term = searchParams.get("q") || "";
    if (term !== searchTerm) {
      setSearchTerm(term);
    }

    const params = new URLSearchParams(searchParams.toString());
    const url =
      window.location.pathname +
      (params.toString() ? `?${params.toString()}` : "");
    setCopyText(`${window.location.origin}${url}`);
  }, [searchParams, searchTerm, setSearchTerm]);

  return (
    <div className="container mx-auto px-4 relative">
      <div className="relative z-10">
        <SearchSection
          searchTerm={searchTerm}
          apiCount={apiMetrics.numAPIs}
          onSearchChange={handleSearch}
          
       
        />

        <ApiGrid
          cards={allApiCards}
          searchTerm={searchTerm}
          loadingMore={loadingMore}
          hasMore={hasMore}
          gridColumns={gridColumns}
          pageSize={pageSize}
          observerRef={observerRef}
        />
      </div>
    </div>
  );
}

export default function SearchClientComponent({
  repoStarCounts,
}: SearchClientComponentProps) {
  return (
    <Suspense fallback={<LoadingSkeleton pageSize={30} />}>
      <SearchClientComponentInner repoStarCounts={repoStarCounts} />
    </Suspense>
  );
}
