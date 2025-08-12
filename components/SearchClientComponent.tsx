"use client";

import React, { useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useGridLayout } from "@/hooks/useGridLayout";
import { useApiSearch } from "@/hooks/useApiSearch";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";
import { SearchSection } from "@/components/SearchSection";
import { ApiGrid } from "@/components/ApiGrid";
import { LoadingSkeleton } from "@/components/LoadingSkeleton";

interface SearchClientComponentProps {
  repoStarCounts: Record<string, number>;
  providerSlug?: string;
}

function SearchClientComponentInner({
  repoStarCounts,
  providerSlug,
}: SearchClientComponentProps) {
  const searchParams = useSearchParams();
  const initialSearchTerm = searchParams?.get("q") || "";

  const initialCombinedSearchTerm = providerSlug
    ? `${providerSlug} ${initialSearchTerm}`.trim()
    : initialSearchTerm;

  const { gridColumns, pageSize } = useGridLayout();

  const {
    searchTerm,
    setSearchTerm,
    allApiCards,
    loading,
    setLoading,
    loadingMore,
    hasMore,
    loadMoreApis,
    resetSearch,
    totalCount,
  } = useApiSearch(initialCombinedSearchTerm, pageSize);

  const observerRef = useInfiniteScroll({
    hasMore,
    loadingMore,
    loading,
    loadMore: loadMoreApis,
  }) as React.RefObject<HTMLDivElement>;

  useEffect(() => {
    resetSearch(initialCombinedSearchTerm);
  }, [pageSize, initialCombinedSearchTerm, resetSearch]);

  useEffect(() => {
    const handleSearchChange = async () => {
      const combinedSearchTerm = providerSlug
        ? `${providerSlug}:${searchTerm}`.trim()
        : searchTerm;

      await resetSearch(combinedSearchTerm);
    };

    const debounceTimer = setTimeout(handleSearchChange, 300);
    return () => clearTimeout(debounceTimer);
  }, [searchTerm, initialCombinedSearchTerm, providerSlug, resetSearch]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setLoading(true);
  };

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

  return (
    <div className="container mx-auto px-4 relative">
      <div className="relative z-10">
        <SearchSection
          searchTerm={searchTerm}
          apiCount={totalCount}
          onSearchChange={handleSearch}
        />

        <ApiGrid
          cards={allApiCards}
          searchTerm={searchTerm}
          loading={loading}
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
  providerSlug,
}: SearchClientComponentProps) {
  return (
    <Suspense fallback={<LoadingSkeleton pageSize={30} />}>
      <SearchClientComponentInner
        repoStarCounts={repoStarCounts}
        providerSlug={providerSlug}
      />
    </Suspense>
  );
}
