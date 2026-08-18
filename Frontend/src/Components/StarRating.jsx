import React from 'react';
import { testimonials } from '../assets/assets';
import { assets } from '../assets/assets';

// 👇 THIS IS THE FUNCTION WRAPPER. Everything must go inside here!
const StarRating = ({ rating = 4 }) => {
  
  // 1. Create an empty bucket (array) to hold our stars
  const stars = [];

  // 2. Run a simple loop 5 times
  for (let i = 0; i < 5; i++) {
    
    // 3. If the loop number is less than the rating, push a gold star into the bucket
    if (i < rating) {
      stars.push(
        <img key={i} src={assets.starIconFilled} alt="star" className="w-4.5 h-4.5" />
      );
    } 
    // 4. Otherwise, push an empty outline star into the bucket
    else {
      stars.push(
        <img key={i} src={assets.starIconOutlined} alt="star" className="w-4.5 h-4.5" />
      );
    }
  }

  // 5. Finally, return the bucket of stars to be displayed on the screen!
  // This return is now perfectly legal because it is inside the StarRating function.
  return (
    <>
      {stars}
    </>
  );

} // 👈 This curly brace closes the function!

export default StarRating;