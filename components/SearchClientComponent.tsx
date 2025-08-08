"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { fetchApisInfinite } from "@/services/api";
import { cleanDescription } from "@/utils/textProcessing";
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
    setAllApiCards,
    loading,
    setLoading,
    loadingMore,
    hasMore,
    currentPage,
    loadMoreApis,
    searchApis,
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
    const fetchInitialData = async () => {
      try {
        setLoading(true);
        await resetSearch(initialCombinedSearchTerm);
      } catch (error) {
        console.error("Error fetching initial data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, [pageSize, initialCombinedSearchTerm, resetSearch, setLoading]);

  useEffect(() => {
    const handleSearchChange = async () => {
      const combinedSearchTerm = providerSlug
        ? `${providerSlug}:${searchTerm}`.trim()
        : searchTerm;

      if (combinedSearchTerm !== initialCombinedSearchTerm) {
        try {
          await resetSearch(combinedSearchTerm);
        } catch (error) {
          console.error("Error in debounced search:", error);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    const debounceTimer = setTimeout(handleSearchChange, 1000);
    return () => clearTimeout(debounceTimer);
  }, [
    searchTerm,
    initialCombinedSearchTerm,
    providerSlug,
    resetSearch,
    setLoading,
  ]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
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
