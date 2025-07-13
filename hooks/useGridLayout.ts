import { useState, useEffect, useCallback } from "react";

export function useGridLayout() {
  const [gridColumns, setGridColumns] = useState(5);
  const [pageSize, setPageSize] = useState(30);

  const detectGridColumns = useCallback(() => {
    if (typeof window === "undefined") return 5;

    const width = window.innerWidth;
    if (width < 768) return 1;
    if (width < 1024) return 3;
    return 5;
  }, []);

  const calculatePageSize = useCallback((columns: number) => {
    const rowsToLoad = 6;
    const baseSize = columns * rowsToLoad;

    return Math.round(baseSize / columns) * columns;
  }, []);

  useEffect(() => {
    const updateGridLayout = () => {
      const newColumns = detectGridColumns();
      const newPageSize = calculatePageSize(newColumns);

      setGridColumns(newColumns);
      setPageSize(newPageSize);
    };

    updateGridLayout();

    window.addEventListener("resize", updateGridLayout);
    return () => window.removeEventListener("resize", updateGridLayout);
  }, [detectGridColumns, calculatePageSize]);

  return { gridColumns, pageSize };
}
