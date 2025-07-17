export const updateQueryParam = (
  searchParams: URLSearchParams | null,
  term: string,
) => {
  if (!searchParams) return "";

  const params = new URLSearchParams(searchParams.toString());

  if (term) {
    params.set("q", term);
  } else {
    params.delete("q");
  }

  const newUrl =
    window.location.pathname +
    (params.toString() ? `?${params.toString()}` : "");

  window.history.pushState({}, "", newUrl);

  return `${window.location.origin}${newUrl}`;
};
