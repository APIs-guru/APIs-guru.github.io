"use client";

import React, { useEffect, useRef, useCallback, useState } from "react";
import {
  useInfiniteHits,
  useInstantSearch,
  useSearchBox,
} from "react-instantsearch";
import Card from "./ApiCard";
import { CardSkeleton } from "@/components/ui/CardSkeleton";
import { cleanDescription } from "@/utils/textProcessing";

interface ApiGridProps {
  gridColumns: number;
  pageSize: number;
}

const transformItems = (items: any[]) => {
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

export function ApiGrid({ gridColumns, pageSize }: ApiGridProps) {
  const { query } = useSearchBox();
  const { status, error } = useInstantSearch({ catchError: true });
  const {
    hits,
    isLastPage,
    showMore: originalShowMore,
  } = useInfiniteHits(
    {
      transformItems,
      showPrevious: false,
    },
    { skipSuspense: true }
  );

  const [hasInitiallyLoaded, setHasInitiallyLoaded] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const observerRef = useRef<HTMLDivElement | null>(null);
  const prevQueryRef = useRef(query);

  const loading = status === "loading";
  const stalled = status === "stalled";
  const hasError = status === "error";
  const isSearching = loading || stalled;
  const hasMore = !isLastPage && !hasError;

  const showMore = useCallback(() => {
    if (hasMore && !isSearching) {
      setIsLoadingMore(true);
      originalShowMore();
    }
  }, [hasMore, isSearching, originalShowMore]);

  useEffect(() => {
    if (isLoadingMore && status === "idle") {
      setIsLoadingMore(false);
    }
  }, [isLoadingMore, status]);

  useEffect(() => {
    if (query !== prevQueryRef.current) {
      setIsLoadingMore(false);
      prevQueryRef.current = query;
    }
  }, [query]);

  useEffect(() => {
    if (!isSearching && hits.length >= 0) {
      setHasInitiallyLoaded(true);
    }
  }, [isSearching, hits.length]);

  const handleIntersection = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      if (entries[0].isIntersecting && hasMore && !isSearching) {
        showMore();
      }
    },
    [hasMore, isSearching, showMore]
  );

  useEffect(() => {
    const observer = observerRef.current;
    if (!observer) return;

    const intersectionObserver = new IntersectionObserver(handleIntersection, {
      threshold: 0.1,
      rootMargin: "100px",
    });

    intersectionObserver.observe(observer);
    return () => intersectionObserver.disconnect();
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

  const shouldShowInitialSkeleton =
    isSearching && !hasInitiallyLoaded && hits.length === 0;
  const shouldShowNoResults =
    hits.length === 0 && hasInitiallyLoaded && query.length > 0;

  return (
    <section id="apis-list" className="cards">
      {stalled && (
        <div className="fixed top-0 left-0 w-full h-1 bg-blue-500 animate-pulse z-50" />
      )}

      {shouldShowInitialSkeleton ? (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {Array.from({ length: Math.min(pageSize, gridColumns * 2) }).map(
            (_, index) => (
              <CardSkeleton key={`skeleton-loading-${index}`} />
            )
          )}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {hits.length > 0 ? (
              hits.map((hit, index) => (
                <Card key={`${hit.objectID}-${index}`} model={hit} />
              ))
            ) : shouldShowNoResults ? (
              <div className="col-span-full text-center py-6 bg-gray-50 rounded-lg border border-gray-100">
                No APIs found matching &quot;{query}&quot;
              </div>
            ) : null}
          </div>

          {isLoadingMore && (
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
