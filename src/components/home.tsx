import React, { useState, useRef, useCallback } from "react";
import useImageSearch from "../hooks/useImageSearch";
import SearchedImage from "./searchedImage";

export default function History() {
  const [term, setTerm] = useState<string>("");
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [isHistory, setIsHistory] = useState<boolean>(false);

  const { data, hasMore, isLoading, error, isFetching, isRefetching } =
    useImageSearch(term, pageNumber, isHistory);
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

  function handleSearch(e: React.ChangeEvent<HTMLInputElement>) {
    setTerm(e.target.value);
    setPageNumber(1);
  }

  return (
    <>
      <div className="search-container">
        <input
          type="text"
          value={term}
          className="search-bar"
          onChange={handleSearch}
          placeholder="შეიყვანეთ საძიებო სიტყვა..."
        ></input>
      </div>
      <div className="miscelaneous-box">
        {isFetching && <h1>Loading...</h1>}
      </div>
      <div className="miscelaneous-box">
        {error && <h1>Something went wrong...</h1>}
      </div>
      <div className="result-container">
        {data?.length !== 0 &&
          data?.map((image, index) => {
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
