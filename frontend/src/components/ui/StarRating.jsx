import React, { useState } from 'react';
import { Star } from 'lucide-react';

// Star Rating Component
const StarRating = ({ rating, onRatingChange, readonly = false }) => {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          size={16}
          className={`${
            star <= rating 
              ? 'fill-yellow-400 text-yellow-400' 
              : 'text-gray-300'
          } ${readonly ? 'cursor-default' : 'cursor-pointer hover:text-yellow-400'}`}
          onClick={() => !readonly && onRatingChange && onRatingChange(star)}
        />
      ))}
      <span className="text-sm text-gray-600 ml-2">({rating}/5)</span>
    </div>
  );
};

export default StarRating;