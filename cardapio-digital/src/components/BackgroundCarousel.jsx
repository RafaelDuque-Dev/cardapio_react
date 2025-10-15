import { useState, useEffect } from "react";
import "../App.css";

const images = [
  "https://images.pexels.com/photos/34306114/pexels-photo-34306114.jpeg",
  "https://images.pexels.com/photos/143640/pexels-photo-143640.jpeg"
];

export default function BackgroundCarousel() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 3000); // muda a cada 5 segundos
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="carousel-container">
      {images.map((img, index) => (
        <div
          key={index}
          className={`carousel-image ${
            index === current ? "active" : ""
          }`}
          style={{ backgroundImage: `url(${img})` }}
        ></div>
      ))}
      <div className="overlay"></div>
    </div>
  );
}
