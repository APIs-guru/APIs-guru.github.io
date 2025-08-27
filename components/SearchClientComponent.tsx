"use client";

import React, { Suspense } from "react";
import { useGridLayout } from "@/hooks/useGridLayout";
import { LoadingSkeleton } from "@/components/LoadingSkeleton";
import { ApiGrid } from "@/components/ApiGrid";
import { liteClient as algoliasearch } from "algoliasearch/lite";
import { InstantSearch } from "react-instantsearch";
import { SearchSection } from "@/components/SearchSection";
import { history } from "instantsearch.js/es/lib/routers";

const searchClient = algoliasearch(
  "D29MLR0AMY",
  "03da9918f8ebfdb40e9b37cfd43ed8c4"
);

const indexName = "prod_apis_guru";

const routing = {
  router: history(),
  stateMapping: {
    stateToRoute(uiState: any) {
      const indexUiState = uiState[indexName] || {};
      return {
        query: indexUiState.query || undefined,
      };
    },
    routeToState(routeState: any) {
      return {
        [indexName]: {
          query: routeState.query || "",
        },
      };
    },
  },
};

interface SearchClientComponentProps {
  providerSlug?: string;
}

function SearchClientComponentInner({
  providerSlug,
}: SearchClientComponentProps) {
  const { gridColumns, pageSize } = useGridLayout();

  return (
    <div className="container mx-auto px-4 relative">
      <div className="relative z-10">
        <InstantSearch
          indexName={indexName}
          searchClient={searchClient}
          routing={routing}
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
