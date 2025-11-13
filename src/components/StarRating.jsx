import { useState } from "react";
import { Star } from "lucide-react";

export default function StarRating({ rating, onRate }) {
  const [hover, setHover] = useState(null);

  const stars = Array.from({ length: 10 }, (_, i) => (i + 1) / 1); // 1 a 10
  return (
    <div className="flex flex-wrap gap-0.5">
      {stars.map((starValue) => (
        <Star
          key={starValue}
          className={`w-5 h-5 cursor-pointer transition-transform duration-100 ${
            (hover || rating) >= starValue
              ? "text-yellow-400 fill-yellow-400 scale-110"
              : "text-gray-500"
          }`}
          onClick={() => onRate(starValue)}
          onMouseEnter={() => setHover(starValue)}
          onMouseLeave={() => setHover(null)}
        />
      ))}
    </div>
  );
}