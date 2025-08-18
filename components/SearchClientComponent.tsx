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
        <InstantSearch
          indexName="prod_apis_guru"
          searchClient={searchClient}
          initialUiState={{
            prod_apis_guru: {
              query: initialCombinedSearchTerm,
              sortBy: "prod_apis_guru_by_name_asc",
            },
          }}
        >
          <SearchSection />

          <ApiGrid gridColumns={gridColumns} pageSize={pageSize} />
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
