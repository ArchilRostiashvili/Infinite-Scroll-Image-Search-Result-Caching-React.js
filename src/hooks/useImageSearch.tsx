import { useState } from "react";
import axios, { Canceler } from "axios";
import { useDebounce } from "./bounceHooks";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { useQueryClient } from "@tanstack/react-query";
export default function useImageSearch(term: string, pageNumber: number) {
  const [hasMore, setHasMore] = useState<boolean>(false);
  const debouncedSearch = useDebounce(term);
  const queryClient = useQueryClient();
  const {
    data = [],
    isFetching,
    isLoading,
    error,
    isRefetching,
  } = useQuery({
    queryKey: ["search", debouncedSearch, pageNumber],
    queryFn: () => {
      const previousPage = pageNumber - 1;
      const previousDataExists =
        queryClient.getQueryData(["search", debouncedSearch, previousPage]) !==
        undefined;
      let cancel: Canceler;
      if (debouncedSearch.length > 0) {
        return axios({
          method: "GET",
          url: `https://api.unsplash.com/search/photos?client_id=e7iGw2rsiHMnSz5OWx4sQMAWYXKnQJ5A4B2D_TEg8DQ`,
          params: {
            query: debouncedSearch,
            order_by: "popular",
            page: pageNumber,
            per_page: 20,
          },
          cancelToken: new axios.CancelToken((c) => (cancel = c)),
        })
          .then((res) => {
            const storedString = localStorage.getItem("searchHistory");
            let searchHistory = [];
            if (storedString) {
              searchHistory = JSON.parse(storedString);
            }
            if (
              !searchHistory.includes(debouncedSearch) &&
              debouncedSearch !== ""
            ) {
              searchHistory.push(debouncedSearch);
              localStorage.setItem(
                "searchHistory",
                JSON.stringify(searchHistory)
              );
            }
            if (previousDataExists) {
              const previousData = queryClient.getQueryData([
                "search",
                debouncedSearch,
                previousPage,
              ]);
              setHasMore(res.data.results.length > 0);
              return [...previousData, ...res.data.results];
            } else {
              setHasMore(res.data.results.length > 0);
              return res.data.results;
            }
          })
          .catch((e) => {
            if (axios.isCancel(e)) return;
            throw e;
          });
      }
      return () => cancel();
    },
    placeholderData: keepPreviousData,
    refetchOnWindowFocus: false,
    staleTime: Infinity,
    refetchOnMount: true,
  });
  console.log("Fetching", { debouncedSearch, data });
  return { isLoading, error, data, hasMore, isFetching, isRefetching };
}
