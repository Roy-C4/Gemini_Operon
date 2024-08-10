import React from "react";
import "../Css/NotFoundPage.css";
import Lottie from "react-lottie";
import errorAnimation from "../Assets/404notfound.json";

const NotFoundPage = () => {
  // Lottie options
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: errorAnimation,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice"
    }
  };

  return (
    <div className="not-found-container">
      <div className="not-found-content">
        <Lottie
          options={defaultOptions}
          height={400}
          width={400}
          isStopped={false}
          isPaused={false}
        />
        <h1 className="not-found-title">Oops!</h1>
        <p className="not-found-text">
          We couldn't find the page you're looking for.
        </p>
      </div>
    </div>
  );
};

export default NotFoundPage;
