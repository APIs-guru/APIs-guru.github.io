import { useState, useCallback } from "react";
import { ApiCard } from "@/types/api";
import { fetchApisInfinite } from "@/services/api";
import { cleanDescription } from "@/utils/textProcessing";

export function useApiSearch(initialSearchTerm: string, pageSize: number) {
  const [searchTerm, setSearchTerm] = useState(initialSearchTerm);
  const [allApiCards, setAllApiCards] = useState<ApiCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const cleanApiData = useCallback((apis: ApiCard[]) => {
    return apis.map((card) => ({
      ...card,
      cardDescription: card.cardDescription
        ? cleanDescription(card.cardDescription)
        : card.cardDescription,
      markedDescription: card.markedDescription
        ? cleanDescription(card.markedDescription)
        : card.markedDescription,
    }));
  }, []);

  const loadMoreApis = useCallback(async () => {
    if (loadingMore || !hasMore) return;

    setLoadingMore(true);
    try {
      const response = await fetchApisInfinite(
        currentPage + 1,
        searchTerm,
        pageSize,
      );

      if (response.apis.length > 0) {
        const cleanedApis = cleanApiData(response.apis);
        setAllApiCards((prev) => [...prev, ...cleanedApis]);
        setCurrentPage((prev) => prev + 1);
        setHasMore(response.hasMore);
        setTotalCount(response.totalCount);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error("Error loading more APIs:", error);
      setHasMore(false);
    } finally {
      setLoadingMore(false);
    }
  }, [currentPage, searchTerm, loadingMore, hasMore, pageSize, cleanApiData]);

  const resetSearch = useCallback(
    async (term: string) => {
      setLoading(true);
      setCurrentPage(1);
      setHasMore(true);

      try {
        const response = await fetchApisInfinite(1, term, pageSize);
        const cleanedApis = cleanApiData(response.apis);

        setAllApiCards(cleanedApis);
        setHasMore(response.hasMore);
        setCurrentPage(1);
        setTotalCount(response.totalCount);
      } catch (error) {
        console.error("Error searching APIs:", error);
        setAllApiCards([]);
        setHasMore(false);
        setTotalCount(0);
      } finally {
        setLoading(false);
      }
    },
    [pageSize, cleanApiData],
  );

  return {
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
  };
}
