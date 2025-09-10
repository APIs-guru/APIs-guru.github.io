"use client";

import React, { Suspense } from "react";
import { useGridLayout } from "@/hooks/useGridLayout";
import { LoadingSkeleton } from "@/components/LoadingSkeleton";
import { ApiGrid } from "@/components/ApiGrid";
import { liteClient as algoliasearch } from "algoliasearch/lite";
import { InstantSearchNext } from "react-instantsearch-nextjs";
import { SearchSection } from "@/components/SearchSection";

const searchClient = algoliasearch(
  "D29MLR0AMY",
  "03da9918f8ebfdb40e9b37cfd43ed8c4"
);

const indexName = "prod_apis_guru";

const routing = {
  router: {
    cleanUrlOnDispose: false,
  },
  stateMapping: {
    stateToRoute(uiState: any) {
      const indexUiState = uiState[indexName] || {};
      return {
        query: indexUiState.query || undefined,
      };
    },
    routeToState(routeState: any) {
      // Extract providerSlug from pathname if available
      let providerSlug = "";
      if (typeof window !== "undefined") {
        const pathSegments = window.location.pathname.split("/");
        const apisIndex = pathSegments.indexOf("apis");
        if (apisIndex !== -1 && pathSegments[apisIndex + 1]) {
          providerSlug = pathSegments[apisIndex + 1];
        }
      }

      return {
        [indexName]: {
          query: providerSlug || routeState.query || "",
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
        <InstantSearchNext
          indexName={indexName}
          searchClient={searchClient}
          routing={routing}
        >
          {!providerSlug && <SearchSection />}

          <ApiGrid gridColumns={gridColumns} pageSize={pageSize} />
        </InstantSearchNext>
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
