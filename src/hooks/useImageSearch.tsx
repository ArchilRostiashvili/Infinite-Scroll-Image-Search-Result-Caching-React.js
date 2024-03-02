import { useEffect, useState } from "react";
import axios, { Canceler } from "axios";
import { useDebounce } from "./bounceHooks";
import { useQuery } from "@tanstack/react-query";

export default function useImageSearch(term: string, pageNumber: number) {
  const [hasMore, setHasMore] = useState<boolean>(false);
  const debouncedSearch = useDebounce(term);
  const [images, setImages] = useState<any[]>([]);

  const { isLoading, error } = useQuery({
    queryKey: ["search", debouncedSearch, pageNumber],
    refetchOnWindowFocus: false,
    queryFn: () => {
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
            setHasMore(res.data.results.length > 0);
            setImages((prevImages) => [...prevImages, ...res.data.results]);
            return res.data.results;
          })
          .catch((e) => {
            if (axios.isCancel(e)) return;
            throw e;
          });
      } else {
        setImages([]);
        return [];
      }
      return () => cancel();
    },
  });

  return { isLoading, error, data: images, hasMore };
}
