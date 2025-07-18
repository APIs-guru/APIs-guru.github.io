import React from "react";
import { ApiCardModel } from "@/models/ApiCardModel";
import Card from "@/components/Card";
import { CardSkeleton } from "@/components/ui/CardSkeleton";

interface ApiGridProps {
  cards: ApiCardModel[];
  searchTerm: string;
  loading: boolean;
  loadingMore: boolean;
  hasMore: boolean;
  gridColumns: number;
  pageSize: number;
  observerRef: React.RefObject<HTMLDivElement | null>;
}

export function ApiGrid({
  cards,
  searchTerm,
  loading,
  loadingMore,
  hasMore,
  gridColumns,
  pageSize,
  observerRef,
}: ApiGridProps) {
  return (
    <section id="apis-list" className="cards">
      {/* Show skeletons when loading initial data */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 mt-4">
          {Array.from({ length: Math.min(pageSize, gridColumns * 2) }).map(
            (_, index) => (
              <CardSkeleton key={`skeleton-loading-${index}`} />
            )
          )}
        </div>
      ) : (
        <>
          {/* Show skeletons when loading more data */}
          {loadingMore && (
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 mt-4">
              {Array.from({ length: Math.min(pageSize, gridColumns * 2) }).map(
                (_, index) => (
                  <CardSkeleton key={`skeleton-more-${index}`} />
                )
              )}
            </div>
          )}
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {cards.length > 0 ? (
              cards.map((card, index) => (
                <Card key={`${card.name}-${index}`} model={card} />
              ))
            ) : (
              <div className="col-span-full text-center py-6 bg-gray-50 rounded-lg border border-gray-100">
                No APIs found matching &quot;{searchTerm}&quot;
              </div>
            )}
          </div>
        </>
      )}

      {/* Intersection observer target */}
      <div ref={observerRef} className="h-10 mt-4" />

      {/* End of results indicator */}
      {!hasMore && cards.length > 0 && (
        <div className="text-center py-6 text-gray-500">
          That's all the APIs! 🎉
        </div>
      )}
    </section>
  );
}
