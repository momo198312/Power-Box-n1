import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";
import { getAdminData, ReviewData } from "@/lib/admin-storage-supabase";

// Fallback data if admin data is not available
const fallbackReviews: ReviewData[] = [
  {
    id: "fallback-1",
    name: "Sarah Johnson",
    photo:
      "https://images.unsplash.com/photo-1494790108755-2616b612b1-1b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80",
    rating: 5,
    review:
      "Amazing variety of snacks! Perfect for my office team. The breakfast bars are especially delicious and the packaging is so professional.",
  },
  {
    id: "fallback-2",
    name: "Michael Chen",
    photo:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
    rating: 5,
    review:
      "Great value for 42 snacks! My college daughter loves these. Fast delivery and everything arrived in perfect condition.",
  },
  {
    id: "fallback-3",
    name: "Emily Rodriguez",
    photo:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=688&q=80",
    rating: 5,
    review:
      "The perfect gift! Sent this to my brother in college and he was thrilled. Quality snacks and beautiful presentation with the greeting card.",
  },
  {
    id: "fallback-4",
    name: "David Thompson",
    photo:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80",
    rating: 5,
    review:
      "Ordered for my team at work. Everyone loved the variety - from healthy options to tasty treats. Will definitely order again!",
  },
  {
    id: "fallback-5",
    name: "Jessica Martinez",
    photo:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
    rating: 5,
    review:
      "Exceeded my expectations! The box is beautifully packaged and the snacks are high quality. Perfect for busy days when I need quick energy.",
  },
  {
    id: "fallback-6",
    name: "Robert Wilson",
    photo:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80",
    rating: 5,
    review:
      "Fantastic service from start to finish. The snacks arrived quickly and were exactly as described. Great for keeping in the car for long trips!",
  },
];

export function CustomerReviews() {
  const [reviewsData, setReviewsData] = useState({
    sectionTitle: "What Our Customers Say",
    sectionDescription:
      "Join thousands of satisfied customers who love our nutritious snack boxes",
    reviews: fallbackReviews,
    trustIndicatorText: "Based on verified customer reviews",
  });

  // Load dynamic data from admin on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        const adminData = await getAdminData();
        if (adminData.reviews && adminData.reviews.reviews.length > 0) {
          setReviewsData(adminData.reviews);
        }
      } catch (error) {
        console.error("Failed to load reviews data:", error);
        // Keep fallback data if loading fails
      }
    };
    loadData();
  }, []);
  return (
    <section className="relative py-16 sm:py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            {reviewsData.sectionTitle}
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {reviewsData.sectionDescription}
          </p>
        </div>

        {/* Scrolling Container */}
        <div className="relative overflow-hidden">
          {/* Gradient overlays for smooth fade effect */}
          <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-gray-50 to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-gray-50 to-transparent z-10 pointer-events-none" />

          {/* Scrolling Animation */}
          <motion.div
            className="flex gap-4 w-max"
            animate={{
              x: [0, -1500], // Adjusted for smaller card width
            }}
            transition={{
              duration: 35,
              repeat: Infinity,
              ease: "linear",
            }}
          >
            {/* First set of cards */}
            {reviewsData.reviews.map((review) => (
              <div
                key={review.id}
                className="flex-shrink-0 w-72 bg-gradient-to-br from-white to-blue-50 rounded-2xl shadow-xl p-5 border-2 hover:shadow-2xl transition-all duration-300"
                style={{ borderColor: "#007BFF" }}
              >
                {/* Quotation Mark Icon */}
                <div className="flex justify-center mb-3">
                  <div className="bg-blue-100 rounded-full p-2">
                    <Quote className="h-5 w-5 text-blue-600" />
                  </div>
                </div>

                {/* Customer Photo */}
                <div className="flex justify-center mb-4">
                  <img
                    src={review.photo}
                    alt={review.name}
                    className="w-14 h-14 rounded-full object-cover border-3 border-white shadow-md"
                    loading="lazy"
                  />
                </div>

                {/* Customer Name and Rating */}
                <div className="text-center mb-4">
                  <h3 className="font-semibold text-gray-900 text-base mb-2">
                    {review.name}
                  </h3>
                  <div className="flex justify-center gap-1">
                    {[...Array(review.rating)].map((_, i) => (
                      <Star
                        key={i}
                        className="h-4 w-4 text-yellow-500 fill-current drop-shadow-sm"
                      />
                    ))}
                  </div>
                </div>

                {/* Review Text */}
                <p className="text-gray-700 text-center leading-relaxed text-sm font-medium">
                  {review.review}
                </p>
              </div>
            ))}

            {/* Duplicate set for seamless loop */}
            {reviewsData.reviews.map((review) => (
              <div
                key={`duplicate-${review.id}`}
                className="flex-shrink-0 w-72 bg-gradient-to-br from-white to-blue-50 rounded-2xl shadow-xl p-5 border-2 hover:shadow-2xl transition-all duration-300"
                style={{ borderColor: "#007BFF" }}
              >
                {/* Quotation Mark Icon */}
                <div className="flex justify-center mb-3">
                  <div className="bg-blue-100 rounded-full p-2">
                    <Quote className="h-5 w-5 text-blue-600" />
                  </div>
                </div>

                {/* Customer Photo */}
                <div className="flex justify-center mb-4">
                  <img
                    src={review.photo}
                    alt={review.name}
                    className="w-14 h-14 rounded-full object-cover border-3 border-white shadow-md"
                    loading="lazy"
                  />
                </div>

                {/* Customer Name and Rating */}
                <div className="text-center mb-4">
                  <h3 className="font-semibold text-gray-900 text-base mb-2">
                    {review.name}
                  </h3>
                  <div className="flex justify-center gap-1">
                    {[...Array(review.rating)].map((_, i) => (
                      <Star
                        key={i}
                        className="h-4 w-4 text-yellow-500 fill-current drop-shadow-sm"
                      />
                    ))}
                  </div>
                </div>

                {/* Review Text */}
                <p className="text-gray-700 text-center leading-relaxed text-sm font-medium">
                  {review.review}
                </p>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Trust Indicator */}
        <div className="text-center mt-8">
          <div className="inline-flex items-center gap-2 bg-yellow-50 border border-yellow-200 rounded-full px-4 py-2">
            <div className="flex gap-1">
              <Star className="h-4 w-4 text-yellow-500 fill-current" />
              <Star className="h-4 w-4 text-yellow-500 fill-current" />
              <Star className="h-4 w-4 text-yellow-500 fill-current" />
              <Star className="h-4 w-4 text-yellow-500 fill-current" />
              <Star className="h-4 w-4 text-yellow-500 fill-current" />
            </div>
            <span className="text-sm font-medium text-gray-700">
              {reviewsData.trustIndicatorText}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
