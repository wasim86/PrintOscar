'use client';

import { useState, useEffect } from 'react';
import { Star, ChevronLeft, ChevronRight, CheckCircle } from 'lucide-react';

const googleReviews = [
  {
    id: 1,
    name: "Holly Stiener",
    date: "2024-08-27",
    rating: 5,
    text: "Just went to get a few copies made and Oscar was so nice and personable. Highly recommend!",
    verified: true
  },
  {
    id: 2,
    name: "Curtis Hucks",
    date: "2024-02-21",
    rating: 5,
    text: "Very good. Excellent customer service.",
    verified: true
  },
  {
    id: 3,
    name: "Shaade Camacho Ramsey",
    date: "2023-03-04",
    rating: 5,
    text: "I have been coming to this place for years. Great work and they are always pleasant and professional.",
    verified: true
  },
  {
    id: 4,
    name: "Jason Heidt",
    date: "2022-12-02",
    rating: 5,
    text: "Great service and professionalism",
    verified: true
  },
  {
    id: 5,
    name: "Juli Van Every Hendricks",
    date: "2022-09-01",
    rating: 5,
    text: "I found Oscar on Google because I needed an engraved plaque for a customer gift, and I needed it within a few hours. Oscar worked with me over the phone and ema...",
    verified: true,
    readMore: true
  },
  {
    id: 6,
    name: "Brian McLoughlin",
    date: "2021-02-11",
    rating: 5,
    text: "Oscar is the best! Took care of my fantasy football trophy engraving and wedding invitations! Great job, fast and fair prices. Great Local Business!!",
    verified: true
  }
];

export const EtsyReviewsSection = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [itemsPerPage, setItemsPerPage] = useState(3);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setItemsPerPage(1);
      } else if (window.innerWidth < 1024) {
        setItemsPerPage(2);
      } else {
        setItemsPerPage(3);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (!isPaused) {
      const interval = setInterval(() => {
        setCurrentIndex((prevIndex) => {
          // If we are at the end (showing the last set), reset to 0
          // For a seamless infinite loop, we'd need more complex logic, but this is a simple auto-slider
          // Max index is (total - itemsPerPage)
          const maxIndex = googleReviews.length - itemsPerPage;
          return prevIndex >= maxIndex ? 0 : prevIndex + 1;
        });
      }, 5000); // 5 seconds

      return () => clearInterval(interval);
    }
  }, [itemsPerPage, isPaused]);

  const nextSlide = () => {
    const maxIndex = googleReviews.length - itemsPerPage;
    setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
  };

  const prevSlide = () => {
    const maxIndex = googleReviews.length - itemsPerPage;
    setCurrentIndex((prev) => (prev <= 0 ? maxIndex : prev - 1));
  };

  const renderStars = () =>
    Array.from({ length: 5 }).map((_, i) => (
      <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
    ));

  return (
    <section 
      className="py-16 bg-gray-50"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="max-w-7xl mx-auto px-4">
        {/* HEADER */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            EXCELLENT
          </h2>
          <div className="flex justify-center items-center mb-1">
            {renderStars()}
          </div>
          <p className="text-gray-600 text-sm mb-4">
            Based on <span className="font-bold text-gray-900">16 reviews</span>
          </p>
          
          {/* Google Logo */}
          <div className="flex justify-center items-center">
            <span className="text-2xl font-medium" style={{ fontFamily: 'Product Sans, Arial, sans-serif' }}>
              <span className="text-[#4285F4]">G</span>
              <span className="text-[#EA4335]">o</span>
              <span className="text-[#FBBC05]">o</span>
              <span className="text-[#4285F4]">g</span>
              <span className="text-[#34A853]">l</span>
              <span className="text-[#EA4335]">e</span>
            </span>
          </div>
        </div>

        {/* CAROUSEL CONTAINER */}
        <div className="relative overflow-hidden px-4">
          {/* NAVIGATION BUTTONS */}
          <button 
            onClick={prevSlide}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white p-2 rounded-full shadow-lg hover:bg-gray-50 text-gray-600 transition-all hidden md:block"
            aria-label="Previous review"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          
          <button 
            onClick={nextSlide}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white p-2 rounded-full shadow-lg hover:bg-gray-50 text-gray-600 transition-all hidden md:block"
            aria-label="Next review"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* SLIDING TRACK */}
          <div 
            className="flex transition-transform duration-500 ease-in-out"
            style={{ transform: `translateX(-${currentIndex * (100 / itemsPerPage)}%)` }}
          >
            {googleReviews.map((review) => (
              <div
                key={review.id}
                className="flex-shrink-0 px-3"
                style={{ width: `${100 / itemsPerPage}%` }}
              >
                <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-all h-full flex flex-col border border-gray-100">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center text-xl font-bold uppercase">
                        {review.name.charAt(0)}
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900 text-sm">{review.name}</h4>
                        <p className="text-xs text-gray-400">{review.date}</p>
                      </div>
                    </div>
                    <div className="w-6 h-6">
                       <svg viewBox="0 0 24 24" className="w-full h-full">
                        <path
                          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                          fill="#4285F4"
                        />
                        <path
                          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                          fill="#34A853"
                        />
                        <path
                          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                          fill="#FBBC05"
                        />
                        <path
                          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                          fill="#EA4335"
                        />
                      </svg>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 mb-3">
                     {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400 border-none" strokeWidth={0} />
                      ))}
                      {review.verified && (
                        <CheckCircle className="w-4 h-4 text-blue-500 fill-blue-500" />
                      )}
                  </div>

                  <p className="text-gray-600 text-sm leading-relaxed mb-4 flex-grow">
                    {review.text}
                    {review.readMore && (
                      <span className="text-blue-600 ml-1 cursor-pointer font-medium hover:underline">Read more</span>
                    )}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* DOTS NAVIGATION */}
        <div className="flex justify-center items-center mt-8 gap-2">
          {Array.from({ length: googleReviews.length - itemsPerPage + 1 }).map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-2 h-2 rounded-full transition-all ${
                currentIndex === index ? 'bg-blue-600 w-4' : 'bg-gray-300 hover:bg-gray-400'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
