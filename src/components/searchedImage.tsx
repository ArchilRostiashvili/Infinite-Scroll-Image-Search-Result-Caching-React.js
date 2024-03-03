export default function SearchedImage({ image, reference, index }) {
  return (
    <a
      // href={image.urls.regular}
      ref={reference ? reference : null}
      target="_blank"
      rel="noreferrer"
    >
      <div className="info-container">
        <div className="image-box">
          <img src={image?.urls.small} />
        </div>
      </div>
    </a>
  );
}
