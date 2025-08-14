import React, { useEffect, useRef, useCallback } from "react";
import { useInfiniteHits, useInstantSearch } from "react-instantsearch";
import Card from "./ApiCard";
import { CardSkeleton } from "@/components/ui/CardSkeleton";
import { cleanDescription } from "@/utils/textProcessing";

interface ApiGridProps {
  searchTerm: string;
  gridColumns: number;
  pageSize: number;
}
const transformItems = (items: any[]) => {
  console.log("Transforming items:", items);
  return items.map((item) => ({
    ...item,
    name: item.name || item.objectID,
    description: cleanDescription(item.description || ""),
    title: item.title || item.name || "",
    categories: item.categories ? item.categories.split(",") : [],
    tags: item.tags ? item.tags.split(",") : [],
    contact: item.contact || "",
    license: item.license || "",
    logoUrl: item.logoUrl || "",
    swaggerUrl: item.swaggerUrl || "",
    swaggerYamlUrl: item.swaggerYamlUrl || "",
    externalUrl: item.externalUrl || "",
    version: item.version || "",
    added: item.added || "",
    updated: item.updated || "",
  }));
};

export function ApiGrid({ searchTerm, gridColumns, pageSize }: ApiGridProps) {
  const { status, error } = useInstantSearch({ catchError: true });
  const { hits, isLastPage, showMore, results } = useInfiniteHits({
    transformItems,
    showPrevious: false,
  });

  const loading = status === "loading";
  const stalled = status === "stalled";
  const hasError = status === "error";
  const initialLoading = (loading || stalled) && hits.length === 0;
  const loadingMore = (loading || stalled) && hits.length > 0;
  const hasMore = !isLastPage && !hasError;

  const observerRef = useRef<HTMLDivElement | null>(null);

  const handleIntersection = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      if (entries[0].isIntersecting && hasMore && !loading && !stalled) {
        showMore();
      }
    },
    [hasMore, loading, stalled, showMore]
  );

  useEffect(() => {
    const observer = observerRef.current;
    if (!observer) return;

    const intersectionObserver = new IntersectionObserver(handleIntersection, {
      threshold: 0.1,
      rootMargin: "100px",
    });

    intersectionObserver.observe(observer);

    return () => {
      intersectionObserver.disconnect();
    };
  }, [handleIntersection]);

  if (hasError && error) {
    return (
      <section id="apis-list" className="cards">
        <div className="col-span-full text-center py-6 bg-red-50 rounded-lg border border-red-100">
          <p className="text-red-600">Error loading APIs: {error.message}</p>
        </div>
      </section>
    );
  }

  return (
    <section id="apis-list" className="cards">
      {initialLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 mt-4">
          {Array.from({ length: Math.min(pageSize, gridColumns * 2) }).map(
            (_, index) => (
              <CardSkeleton key={`skeleton-loading-${index}`} />
            )
          )}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 mt-4">
            {hits.length > 0 ? (
              hits.map((hit, index) => {
                console.log("Rendering hit:", hit);
                return <Card key={`${hit.objectID}-${index}`} model={hit} />;
              })
            ) : (
              <div className="col-span-full text-center py-6 bg-gray-50 rounded-lg border border-gray-100">
                No APIs found matching &quot;{searchTerm}&quot;
              </div>
            )}
          </div>

          {loadingMore && (
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 mt-4">
              {Array.from({ length: Math.min(pageSize, gridColumns) }).map(
                (_, index) => (
                  <CardSkeleton key={`skeleton-more-${index}`} />
                )
              )}
            </div>
          )}
        </>
      )}

      <div ref={observerRef} className="h-10 mt-4" aria-hidden="true" />

      {!hasMore && hits.length > 0 && !hasError && (
        <div className="text-center py-6 text-gray-500">
          That's all the APIs! 🎉
        </div>
      )}
    </section>
  );
}
