import { useState, useEffect } from "react";
import {
  TextField,
  TextAreaField,
  NumberField,
  ImageUpload,
  ActionButtons,
  FormSection,
} from "./FormComponents";
import { SectionHeader, SuccessToast } from "./AdminLayout";
import {
  getAdminData,
  saveSection,
  ReviewsData,
  ReviewData,
} from "@/lib/admin-storage-supabase";
import { Star, Plus, Trash2, Quote } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ReviewsForm() {
  const [reviewsData, setReviewsData] = useState<ReviewsData>({
    sectionTitle: "",
    sectionDescription: "",
    reviews: [],
    trustIndicatorText: "",
  });
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Load data on mount
  useEffect(() => {
    const loadData = async () => {
      const adminData = await getAdminData();
      setReviewsData(adminData.reviews);
    };
    loadData();
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await saveSection("reviews", reviewsData);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (error) {
      console.error("Error saving reviews data:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = async () => {
    const adminData = await getAdminData();
    setReviewsData(adminData.reviews);
  };

  const updateSectionField = (
    field: keyof Omit<ReviewsData, "reviews">,
    value: string,
  ) => {
    setReviewsData((prev) => ({ ...prev, [field]: value }));
  };

  const addReview = () => {
    const newReview: ReviewData = {
      id: `review-${Date.now()}`,
      name: "Customer Name",
      photo: "",
      rating: 5,
      review: "Great product review goes here...",
    };
    setReviewsData((prev) => ({
      ...prev,
      reviews: [...prev.reviews, newReview],
    }));
  };

  const updateReview = (
    index: number,
    field: keyof ReviewData,
    value: string | number,
  ) => {
    setReviewsData((prev) => ({
      ...prev,
      reviews: prev.reviews.map((review, i) =>
        i === index ? { ...review, [field]: value } : review,
      ),
    }));
  };

  const removeReview = (index: number) => {
    setReviewsData((prev) => ({
      ...prev,
      reviews: prev.reviews.filter((_, i) => i !== index),
    }));
  };

  const moveReview = (fromIndex: number, toIndex: number) => {
    setReviewsData((prev) => {
      const newReviews = [...prev.reviews];
      const [movedReview] = newReviews.splice(fromIndex, 1);
      newReviews.splice(toIndex, 0, movedReview);
      return { ...prev, reviews: newReviews };
    });
  };

  return (
    <>
      <SectionHeader
        title="Customer Reviews Section"
        description="Manage customer testimonials, ratings, and the reviews section configuration."
        actions={
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Star className="h-4 w-4" />
            <span>{reviewsData.reviews.length} Reviews</span>
          </div>
        }
      />

      {/* Section Configuration */}
      <FormSection
        title="Reviews Section Configuration"
        description="Configure the main title, description, and trust indicator for the reviews section."
      >
        <div className="space-y-6">
          <TextField
            label="Section Title"
            value={reviewsData.sectionTitle}
            onChange={(value) => updateSectionField("sectionTitle", value)}
            placeholder="What Our Customers Say"
            required
          />

          <TextField
            label="Section Description"
            value={reviewsData.sectionDescription}
            onChange={(value) =>
              updateSectionField("sectionDescription", value)
            }
            placeholder="Join thousands of satisfied customers who love our nutritious snack boxes"
            required
          />

          <TextField
            label="Trust Indicator Text"
            value={reviewsData.trustIndicatorText}
            onChange={(value) =>
              updateSectionField("trustIndicatorText", value)
            }
            placeholder="Based on verified customer reviews"
            required
          />
        </div>
      </FormSection>

      {/* Customer Reviews */}
      <div className="space-y-6">
        {reviewsData.reviews.map((review, index) => (
          <FormSection
            key={review.id}
            title={`Customer Review ${index + 1}: ${review.name}`}
            description={`Configure customer review #${index + 1} with photo, rating, and testimonial.`}
          >
            <div className="space-y-6">
              {/* Review Controls */}
              <div className="flex items-center justify-between pb-4 border-b">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-yellow-100">
                    <Quote className="h-5 w-5 text-yellow-600" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">
                      {review.name}
                    </div>
                    <div className="text-sm text-gray-500 flex items-center gap-1">
                      {[...Array(review.rating)].map((_, i) => (
                        <Star
                          key={i}
                          className="h-3 w-3 text-yellow-400 fill-current"
                        />
                      ))}
                      <span className="ml-1">({review.rating} stars)</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {index > 0 && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => moveReview(index, index - 1)}
                    >
                      ↑
                    </Button>
                  )}
                  {index < reviewsData.reviews.length - 1 && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => moveReview(index, index + 1)}
                    >
                      ↓
                    </Button>
                  )}
                  {reviewsData.reviews.length > 1 && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => removeReview(index)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>

              {/* Review Form Fields */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-6">
                  <TextField
                    label="Customer Name"
                    value={review.name}
                    onChange={(value) => updateReview(index, "name", value)}
                    placeholder="Sarah Johnson"
                    required
                  />

                  <NumberField
                    label="Rating (1-5 stars)"
                    value={review.rating}
                    onChange={(value) => updateReview(index, "rating", value)}
                    min={1}
                    max={5}
                    step={1}
                    placeholder="5"
                    required
                  />

                  <TextAreaField
                    label="Review Text"
                    value={review.review}
                    onChange={(value) => updateReview(index, "review", value)}
                    placeholder="Amazing variety of snacks! Perfect for my office team..."
                    rows={4}
                    required
                  />
                </div>

                <div>
                  <ImageUpload
                    label="Customer Photo"
                    value={review.photo}
                    onChange={(value) => updateReview(index, "photo", value)}
                    placeholder="Upload customer photo"
                    required
                  />
                </div>
              </div>

              {/* Review Preview */}
              <div className="mt-6 p-4 border rounded-lg bg-gray-50">
                <div className="text-sm font-medium text-gray-700 mb-3">
                  Preview:
                </div>
                <div
                  className="flex-shrink-0 w-72 bg-gradient-to-br from-white to-blue-50 rounded-2xl shadow-xl p-5 border-2"
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
                    {review.photo ? (
                      <img
                        src={review.photo}
                        alt={review.name}
                        className="w-14 h-14 rounded-full object-cover border-3 border-white shadow-md"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-14 h-14 rounded-full bg-gray-200 flex items-center justify-center border-3 border-white shadow-md">
                        <span className="text-gray-500 text-xs">No photo</span>
                      </div>
                    )}
                  </div>

                  {/* Customer Name and Rating */}
                  <div className="text-center mb-4">
                    <h3 className="font-semibold text-gray-900 text-base mb-2">
                      {review.name || "Customer Name"}
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
                    {review.review || "Review text goes here..."}
                  </p>
                </div>
              </div>
            </div>
          </FormSection>
        ))}

        {/* Add Review Button */}
        <FormSection
          title="Add New Review"
          description="Add another customer review to the testimonials section."
        >
          <Button
            variant="outline"
            onClick={addReview}
            className="w-full py-6 border-dashed border-2"
          >
            <Plus className="h-5 w-5 mr-2" />
            Add New Customer Review
          </Button>

          <div className="text-sm text-gray-600 text-center mt-3">
            Recommended: 6 reviews for optimal display and credibility
          </div>
        </FormSection>
      </div>

      {/* Full Section Preview */}
      <FormSection
        title="Reviews Section Preview"
        description="Preview how the complete reviews section will look."
      >
        <div className="bg-gray-50 rounded-2xl p-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              {reviewsData.sectionTitle || "Reviews Section Title"}
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {reviewsData.sectionDescription ||
                "Section description goes here"}
            </p>
          </div>

          {/* Scrolling Container Preview */}
          <div className="flex gap-4 overflow-x-auto pb-4">
            {reviewsData.reviews.slice(0, 6).map((review, index) => (
              <div
                key={index}
                className="flex-shrink-0 w-72 bg-gradient-to-br from-white to-blue-50 rounded-2xl shadow-xl p-5 border-2"
                style={{ borderColor: "#007BFF" }}
              >
                <div className="flex justify-center mb-3">
                  <div className="bg-blue-100 rounded-full p-2">
                    <Quote className="h-5 w-5 text-blue-600" />
                  </div>
                </div>

                <div className="flex justify-center mb-4">
                  {review.photo ? (
                    <img
                      src={review.photo}
                      alt={review.name}
                      className="w-14 h-14 rounded-full object-cover border-3 border-white shadow-md"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-14 h-14 rounded-full bg-gray-200 flex items-center justify-center border-3 border-white shadow-md">
                      <span className="text-gray-500 text-xs">No photo</span>
                    </div>
                  )}
                </div>

                <div className="text-center mb-4">
                  <h3 className="font-semibold text-gray-900 text-base mb-2">
                    {review.name}
                  </h3>
                  <div className="flex justify-center gap-1">
                    {[...Array(review.rating)].map((_, i) => (
                      <Star
                        key={i}
                        className="h-4 w-4 text-yellow-500 fill-current"
                      />
                    ))}
                  </div>
                </div>

                <p className="text-gray-700 text-center leading-relaxed text-sm font-medium">
                  {review.review}
                </p>
              </div>
            ))}
          </div>

          {/* Trust Indicator */}
          <div className="text-center mt-8">
            <div className="inline-flex items-center gap-2 bg-yellow-50 border border-yellow-200 rounded-full px-4 py-2">
              <div className="flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className="h-4 w-4 text-yellow-500 fill-current"
                  />
                ))}
              </div>
              <span className="text-sm font-medium text-gray-700">
                {reviewsData.trustIndicatorText || "Trust indicator text"}
              </span>
            </div>
          </div>
        </div>
      </FormSection>

      {/* Global Actions */}
      <div className="sticky bottom-4 bg-white border border-gray-200 rounded-lg p-4 shadow-lg">
        <ActionButtons
          onSave={handleSave}
          onReset={handleReset}
          isSaving={isSaving}
          saveText="Save Reviews Section"
          resetText="Reset to Saved"
        />
      </div>

      <SuccessToast
        show={showSuccess}
        message="Reviews section saved successfully!"
        onClose={() => setShowSuccess(false)}
      />
    </>
  );
}
