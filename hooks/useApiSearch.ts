import { useState, useEffect, useCallback } from "react";
import { ApiCardModel } from "@/models/ApiCardModel";
import { fetchApisInfinite } from "@/services/api";
import { cleanDescription } from "@/utils/textProcessing";

export function useApiSearch(initialSearchTerm: string, pageSize: number) {
  const [searchTerm, setSearchTerm] = useState(initialSearchTerm);
  const [allApiCards, setAllApiCards] = useState<ApiCardModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  const cleanApiData = useCallback((apis: ApiCardModel[]) => {
    return apis.map((card) => {
      const cleanedCard = { ...card };
      if (cleanedCard.cardDescription) {
        cleanedCard.cardDescription = cleanDescription(
          cleanedCard.cardDescription
        );
      }
      if (cleanedCard.markedDescription) {
        cleanedCard.markedDescription = cleanDescription(
          cleanedCard.markedDescription
        );
      }
      return cleanedCard;
    });
  }, []);

  const loadMoreApis = useCallback(async () => {
    if (loadingMore || !hasMore) return;

    setLoadingMore(true);
    try {
      const response = await fetchApisInfinite(
        currentPage + 1,
        searchTerm,
        pageSize
      );

      if (response.apis.length > 0) {
        const cleanedApis = cleanApiData(response.apis);
        setAllApiCards((prev) => [...prev, ...cleanedApis]);
        setCurrentPage((prev) => prev + 1);
        setHasMore(response.hasMore);
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
      } catch (error) {
        console.error("Error searching APIs:", error);
        setAllApiCards([]);
        setHasMore(false);
      } finally {
        setLoading(false);
      }
    },
    [pageSize, cleanApiData]
  );

  const searchApis = useCallback(
    async (term: string) => {
      await resetSearch(term);
    },
    [resetSearch]
  );

  return {
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
  };
}
