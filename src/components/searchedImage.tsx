import { useState } from "react";
import axios from "axios";

export default function SearchedImage({ image, reference, index }) {
  const [modal, setModal] = useState(false);
  const [data, setData] = useState([]);
  const axiosConfig = {
    headers: {
      Authorization: "Client-ID e7iGw2rsiHMnSz5OWx4sQMAWYXKnQJ5A4B2D_TEg8DQ",
    },
  };
  const toggleModal = async () => {
    try {
      const response = await axios({
        method: "GET",
        url: `https://api.unsplash.com/photos/${image.id}/statistics`,
        ...axiosConfig,
      });
      setData(response.data);
      console.log(response.data);
      setModal(!modal);
    } catch (error) {
      console.error("Error fetching data from Unsplash:", error);
    }
  };
  return (
    <a
      ref={reference ? reference : null}
      target="_blank"
      rel="noreferrer"
      onClick={toggleModal}
      className="btn-modal"
    >
      <div className="info-container">
        <div className="image-box">
          <img src={image?.urls.small} />
        </div>
      </div>
      {modal && (
        <div className="modal">
          <div onClick={toggleModal} className="overlay"></div>
          <div className="modal-content">
            <img src={image.urls.full} alt="" />
            <div className="stat-box">
              <h1>გადმოწერები:</h1>
              <h1>{data.downloads?.total}</h1>
            </div>
            <div className="stat-box">
              <h1>ნახვები:</h1>
              <h1>{data.views?.total}</h1>
            </div>
            <div className="stat-box">
              <h1>მოწონებები:</h1>
              <h1>{image.likes}</h1>
            </div>
          </div>
        </div>
      )}
    </a>
  );
}
