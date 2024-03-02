import React, { useState, useRef, useCallback } from "react";
import useImageSearch from "../hooks/useImageSearch";

export default function App() {
  const [term, setTerm] = useState<string>("");
  const [pageNumber, setPageNumber] = useState<number>(1);

  const { data, hasMore, isLoading, error } = useImageSearch(term, pageNumber);

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
        { threshold: 0.99 }
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
        ></input>
      </div>
      <div className="result-container">
        {data?.length !== 0 &&
          data?.map((image, index) => {
            // SEPARATE COMPONENTS FOR THIS!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
            if (data.length === index + 1) {
              return (
                <a
                  // href={image.urls.regular}
                  ref={lastImageElementRef}
                  target="_blank"
                  rel="noreferrer"
                  key={image?.id}
                >
                  <div className="info-container">
                    <div className="image-box">
                      <img src={image?.urls.small} />
                    </div>
                    <h1>{"№: " + parseInt(index + 1)}</h1>
                    <p>{image?.description}</p>
                    <h1>{"likes: " + image?.likes}</h1>
                  </div>
                </a>
              );
            } else {
              return (
                <a
                  // href={image.urls.regular}
                  target="_blank"
                  rel="noreferrer"
                  key={image?.id}
                >
                  <div className="info-container">
                    <div className="image-box">
                      <img src={image?.urls.small} />
                    </div>
                    <h1>{"№: " + parseInt(index + 1)}</h1>
                    <p>{image?.description}</p>
                    <h1>{"likes: " + image?.likes}</h1>
                  </div>
                </a>
              );
            }
          })}
      </div>
      <div>{term.length !== 0 && isLoading && "Loading..."}</div>
      <div>{error && "Error"}</div>
    </>
  );
}
