import React, { useEffect, useRef, useState } from 'react';
import Img1 from '../../assets/onboarding_image_1.svg';
import Img2 from '../../assets/onboarding_image_2.svg';
import Img3 from '../../assets/onboarding_image_3.svg';

const InfiniteSlider = () => {
  const images = [Img1, Img2, Img3];
  const totalSlides = images.length;
  const [currentIndex, setCurrentIndex] = useState(0);
  const sliderRef = useRef(null);
  const transitionTime = 700; // ms for slide animation
  const delayTime = 3000;     // ms between slides

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => prev + 1);
    }, delayTime + transitionTime);

    return () => clearInterval(interval);
  }, []);

  // Reset without animation when reaching duplicated end
  useEffect(() => {
    if (currentIndex === totalSlides) {
      // After sliding to duplicate set, reset instantly to start (index 0)
      const timer = setTimeout(() => {
        if (sliderRef.current) {
          sliderRef.current.style.transition = 'none';
          setCurrentIndex(0);
          sliderRef.current.style.transform = `translateX(0%)`;

          // Force reflow so transition resets properly
          // Then re-enable transition
          void sliderRef.current.offsetWidth; 
          sliderRef.current.style.transition = `transform ${transitionTime}ms ease-in-out`;
        }
      }, transitionTime);

      return () => clearTimeout(timer);
    }
  }, [currentIndex, totalSlides, transitionTime]);

  return (
    <div className="bg-white rounded-2xl p-2 shadow-xl relative z-10 overflow-hidden w-full h-100">
      <div
        ref={sliderRef}
        className="flex"
        style={{
          width: `${totalSlides * 2 * 100}%`, // duplicated slides count
          transform: `translateX(-${(currentIndex * 100) / (totalSlides * 2)}%)`,
          transition: `transform ${transitionTime}ms ease-in-out`,
        }}
      >
        {[...images, ...images].map((img, idx) => (
          <div
            key={idx}
            className="flex-shrink-0 h-90"
            style={{ width: `${100 / (totalSlides * 2)}%` }}
          >
            <img
              src={img}
              alt={`Slide ${idx + 1}`}
              className="w-full h-full object-cover rounded-xl"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default InfiniteSlider;
