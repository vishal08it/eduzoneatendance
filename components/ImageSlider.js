import { useState, useEffect } from 'react';
import styles from '../styles/Home.module.css';

export default function ImageSlider() {
  const images = ['/banner1.jpg', '/banner2.jpg', '/banner3.jpg', '/banner4.jpg'];
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className={styles.slider}>
      <div
        className={styles.slideTrack}
        style={{ transform: `translateX(-${current * 100}%)` }}
      >
        {images.map((src, idx) => (
          <img
            key={idx}
            src={src}
            alt={`Banner ${idx + 1}`}
            className={styles.slideImage}
          />
        ))}
      </div>
    </div>
  );
}
