"use client";

import React, { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useGridLayout } from "@/hooks/useGridLayout";
import { LoadingSkeleton } from "@/components/LoadingSkeleton";
import { ApiGrid } from "@/components/ApiGrid";
import { liteClient as algoliasearch } from "algoliasearch/lite";
import { InstantSearch } from "react-instantsearch";
import { SearchSection } from "@/components/SearchSection";

const searchClient = algoliasearch(
  "D29MLR0AMY",
  "03da9918f8ebfdb40e9b37cfd43ed8c4"
);

interface SearchClientComponentProps {
  providerSlug?: string;
}

function SearchClientComponentInner({
  providerSlug,
}: SearchClientComponentProps) {
  const searchParams = useSearchParams();
  const initialSearchTerm = searchParams?.get("q") || "";
  const initialCombinedSearchTerm = providerSlug
    ? `${providerSlug} ${initialSearchTerm}`.trim()
    : initialSearchTerm;

  const { gridColumns, pageSize } = useGridLayout();

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
  providerSlug,
}: SearchClientComponentProps) {
  return (
    <Suspense fallback={<LoadingSkeleton pageSize={30} />}>
      <SearchClientComponentInner providerSlug={providerSlug} />
    </Suspense>
  );
}
