import { useEffect, useState } from "react";
import axios, { Canceler } from "axios";
import { useDebounce } from "./bounceHooks";

export default function useImageSearch(term: string, pageNumber: number) {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);
  const [images, setImages] = useState([]);
  const [hasMore, setHasMore] = useState<boolean>(false);
  const debauncedSearch = useDebounce(term);

  useEffect(() => {
    setImages([]);
  }, [term]);

  useEffect(() => {
    setIsLoading(true);
    setError(false);
    let cancel: Canceler;
    if (term.length > 0) {
      axios({
        method: "GET",
        url: `https://api.unsplash.com/search/photos?client_id=e7iGw2rsiHMnSz5OWx4sQMAWYXKnQJ5A4B2D_TEg8DQ`,
        params: {
          query: debauncedSearch,
          order_by: "popular",
          page: pageNumber,
          per_page: 20,
        },
        cancelToken: new axios.CancelToken((c) => (cancel = c)),
      })
        .then((res) => {
          console.log("Fetched!");
          setImages((prevImages) => {
            return [
              ...new Set([
                ...prevImages,
                ...res.data.results.map((b: any) => b),
              ]),
            ];
          });
          setHasMore(res.data.results.length > 0);
          setIsLoading(false);
        })
        .catch((e) => {
          if (axios.isCancel(e)) return;
          setError(true);
        });
      return () => cancel();
    }
  }, [debauncedSearch, pageNumber]);

  return { isLoading, error, images, hasMore };
}
