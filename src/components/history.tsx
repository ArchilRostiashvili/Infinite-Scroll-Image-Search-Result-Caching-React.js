import { useState, useRef, useCallback, useEffect } from "react";
import useImageSearch from "../hooks/useImageSearch";
import SearchedImage from "./searchedImage";

export default function App<T>() {
  const [term, setTerm] = useState<string>("");
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [searchHistory, setSearchHistory] = useState([]);

  const storedString = localStorage.getItem("searchHistory");
  useEffect(() => {
    setSearchHistory(JSON.parse(storedString));
    setTerm("");
    setPageNumber(0);
  }, [storedString]);

  const { data, hasMore, isLoading, error, isFetching } = useImageSearch(
    term,
    pageNumber
  );

  const observer = useRef<IntersectionObserver | undefined>();
  const lastImageElementRef = useCallback(
    (node: any) => {
      if (isLoading) {
        return;
      }
      if (observer.current) {
        observer.current.disconnect();
      }
      observer.current = new IntersectionObserver(
        (entries) => {
          const isAnyIntersecting = entries.some(
            (entry) => entry.isIntersecting
          );
          if (isAnyIntersecting && hasMore) {
            setPageNumber((previousPageNumber) => previousPageNumber + 1);
          }
        },
        { threshold: 0.9 }
      );
      if (node) observer.current.observe(node);
    },
    [isLoading, hasMore]
  );

  function handleSearch(result: string) {
    setTerm(result);
    setPageNumber(1);
    console.log(term);
  }

  return (
    <>
      <div className="history">
        <h1>თქვენი საძიებო ისტორია</h1>
        <div className="history-tags">
          {searchHistory &&
            searchHistory.map((result) => {
              return (
                <h2
                  key={result}
                  onClick={() => {
                    handleSearch(result);
                  }}
                >
                  {result}
                </h2>
              );
            })}
        </div>
      </div>
      <div className="miscelaneous-box">
        {isFetching && <h1>Loading...</h1>}
      </div>
      <div className="miscelaneous-box">
        {error && <h1>Something went wrong...</h1>}
      </div>
      <div className="result-container">
        {data.length !== 0 &&
          data.map((image: T, index: number) => {
            if (data.length === index + 1) {
              return (
                <SearchedImage
                  key={image?.id}
                  image={image}
                  reference={lastImageElementRef}
                  index={index}
                ></SearchedImage>
              );
            } else {
              return (
                <SearchedImage
                  key={image?.id}
                  image={image}
                  reference={null}
                  index={index}
                ></SearchedImage>
              );
            }
          })}
      </div>
    </>
  );
}
