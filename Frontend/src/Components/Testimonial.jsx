import React from 'react';
import Titile from './Titile';
// Make sure to import your exact variable name from your assets file!
import { testimonials } from '../assets/assets'; 
import StarRating from './StarRating';

const Testimonial = () => {
  return (
    <div className='flex flex-col items-center px-6 md:px-16 lg:px-24 bg-slate-50 pt-20 pb-30'>
      
      <Titile 
        title="What Our Guests Say" 
        subTitle="Discover why discerning travelers consistently choose Quickstay for their exclusive and luxurious accommodations around the world." 
      />

      {/* Grid container for the mapped testimonial cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-16 w-full max-w-7xl ">
        
        {/* Mapping through your data from the assets file */}
        {testimonials.map((testimonial) => (
          <div 
            key={testimonial.id} 
            className="cursor-pointer flex flex-col w-full text-sm border border-gray-200 pb-6 rounded-lg bg-white shadow-[0px_4px_15px_0px] shadow-black/5 overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
          >
              {/* Header Profile Section */}
              <div className="flex items-center gap-4 px-5 py-4 bg-slate-50 border-b border-gray-100">
                  <img className="h-12 w-12 rounded-full object-cover" src={testimonial.image} alt={testimonials.name} />
                  <div>
                      <h1 className="text-lg font-medium text-gray-800">{testimonial.name}</h1>
                      <p className="text-gray-500">{testimonial.address}</p>

                  </div>
              </div>

              {/* Review Section */}
              <div className="p-5 pb-7 flex flex-col flex-grow">
                  
                  {/* The 5 Gold Stars (Using a quick JS array trick) */}
                  <div className="flex gap-0.5 mb-4">
                      <StarRating/>
                  </div>
                  
                  {/* The actual review text */}
                  <p className="text-gray-600 mt-2 leading-relaxed">"{testimonial.review}"</p>
              </div>
          </div>
        ))}

      </div>
    </div>
  );
}

export default Testimonial;