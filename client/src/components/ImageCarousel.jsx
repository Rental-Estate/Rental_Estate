import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { useState } from 'react';

const ImageCarousel = ({ image }) => {
  const [index, setIndex] = useState(0);
  const images = Array.isArray(image) ? image : [image];

  const prev = () => setIndex((index - 1 + images.length) % images.length);
  const next = () => setIndex((index + 1) % images.length);

  return (
    <div className="relative w-full h-80 bg-gray-200 overflow-hidden">
      <img
        src={images[index]}
        alt="Property"
        className="w-full h-full object-cover"
      />
      {images.length > 1 && (
        <>
          <button onClick={prev} className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-30 text-white p-2 rounded-full">
            <FaChevronLeft />
          </button>
          <button onClick={next} className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-30 text-white p-2 rounded-full">
            <FaChevronRight />
          </button>
        </>
      )}
    </div>
  );
};

export default ImageCarousel;