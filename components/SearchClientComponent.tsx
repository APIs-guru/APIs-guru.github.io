"use client";

import React, { useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useGridLayout } from "@/hooks/useGridLayout";
import { useApiSearch } from "@/hooks/useApiSearch";
import { LoadingSkeleton } from "@/components/LoadingSkeleton";
import { ApiGrid } from "@/components/ApiGrid";
import { liteClient as algoliasearch } from "algoliasearch/lite";
import { InstantSearch, Hits } from "react-instantsearch";
import { SearchSection } from "@/components/SearchSection";

const searchClient = algoliasearch(
  "D29MLR0AMY",
  "03da9918f8ebfdb40e9b37cfd43ed8c4"
);

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
  const { searchTerm, setSearchTerm, resetSearch, totalCount } = useApiSearch(
    initialCombinedSearchTerm,
    pageSize
  );

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

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div className="container mx-auto px-4 relative">
      <div className="relative z-10">
        <InstantSearch
          indexName="test_apis_guru"
          searchClient={searchClient}
          initialUiState={{
            test_apis_guru: {
              sortBy: "test_apis_guru_by_name_asc",
            },
          }}
        >
          <SearchSection searchTerm={searchTerm} apiCount={totalCount} />

          <ApiGrid
            gridColumns={gridColumns}
            pageSize={pageSize}
            searchTerm={searchTerm}
          />
        </InstantSearch>
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
