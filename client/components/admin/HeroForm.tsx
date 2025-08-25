import { useState, useEffect } from "react";
import {
  TextField,
  NumberField,
  ImageUpload,
  ActionButtons,
  FormSection,
} from "./FormComponents";
import { SectionHeader, SuccessToast } from "./AdminLayout";
import {
  getAdminData,
  saveSection,
  HeroData,
} from "@/lib/admin-storage-supabase";
import { Home, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export function HeroForm() {
  const [heroData, setHeroData] = useState<HeroData>({
    title: "",
    rating: 0,
    reviewCount: 0,
    salePrice: 0,
    originalPrice: 0,
    subscribeText: "",
    walmartText: "",
    deliveryDate: "",
    stockText: "",
    primaryButtonText: "",
    secondaryButtonText: "",
    specialOfferButtonText: "",
    productImages: [],
  });
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Load data on mount
  useEffect(() => {
    const loadData = async () => {
      const adminData = await getAdminData();
      setHeroData(adminData.hero);
    };
    loadData();
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await saveSection("hero", heroData);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (error) {
      console.error("Error saving hero data:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = async () => {
    const adminData = await getAdminData();
    setHeroData(adminData.hero);
  };

  const updateField = <K extends keyof HeroData>(
    field: K,
    value: HeroData[K],
  ) => {
    setHeroData((prev) => ({ ...prev, [field]: value }));
  };

  const addProductImage = () => {
    updateField("productImages", [...heroData.productImages, ""]);
  };

  const updateProductImage = (index: number, url: string) => {
    const newImages = [...heroData.productImages];
    newImages[index] = url;
    updateField("productImages", newImages);
  };

  const removeProductImage = (index: number) => {
    const newImages = heroData.productImages.filter((_, i) => i !== index);
    updateField("productImages", newImages);
  };

  return (
    <>
      <SectionHeader
        title="Hero Section"
        description="Configure the main hero section including title, pricing, delivery information, and call-to-action buttons."
        actions={
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Home className="h-4 w-4" />
            <span>Main Landing Section</span>
          </div>
        }
      />

      {/* Basic Information */}
      <FormSection
        title="Basic Information"
        description="Set the main title and core product information."
      >
        <div className="space-y-6">
          <TextField
            label="Hero Title"
            value={heroData.title}
            onChange={(value) => updateField("title", value)}
            placeholder="Enter the main product title"
            required
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <NumberField
              label="Product Rating"
              value={heroData.rating}
              onChange={(value) => updateField("rating", value)}
              min={0}
              max={5}
              step={0.1}
              placeholder="4.6"
              required
            />

            <NumberField
              label="Review Count"
              value={heroData.reviewCount}
              onChange={(value) => updateField("reviewCount", value)}
              min={0}
              placeholder="23"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <NumberField
              label="Sale Price ($)"
              value={heroData.salePrice}
              onChange={(value) => updateField("salePrice", value)}
              min={0}
              step={0.01}
              placeholder="31.95"
              required
            />

            <NumberField
              label="Original Price ($)"
              value={heroData.originalPrice}
              onChange={(value) => updateField("originalPrice", value)}
              min={0}
              step={0.01}
              placeholder="43.19"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <TextField
              label="Subscribe & Save Text"
              value={heroData.subscribeText}
              onChange={(value) => updateField("subscribeText", value)}
              placeholder="✓ Subscribe & Save available"
              required
            />

            <TextField
              label="Walmart+ Text"
              value={heroData.walmartText}
              onChange={(value) => updateField("walmartText", value)}
              placeholder="✓ Walmart+ offer eligible"
              required
            />
          </div>
        </div>
      </FormSection>

      {/* Delivery & Urgency */}
      <FormSection
        title="Delivery & Urgency"
        description="Set delivery information and urgency messaging."
      >
        <div className="space-y-6">
          <TextField
            label="Delivery Date"
            value={heroData.deliveryDate}
            onChange={(value) => updateField("deliveryDate", value)}
            placeholder="Thu, Aug 21"
            required
          />

          <TextField
            label="Stock/Urgency Text"
            value={heroData.stockText}
            onChange={(value) => updateField("stockText", value)}
            placeholder="⚡ Limited stock available"
            required
          />
        </div>
      </FormSection>

      {/* Call-to-Action Buttons */}
      <FormSection
        title="Call-to-Action Buttons"
        description="Configure the text for your main action buttons."
      >
        <div className="space-y-6">
          <TextField
            label="Primary Button Text"
            value={heroData.primaryButtonText}
            onChange={(value) => updateField("primaryButtonText", value)}
            placeholder="View Product Details"
            required
          />

          <TextField
            label="Secondary Button Text"
            value={heroData.secondaryButtonText}
            onChange={(value) => updateField("secondaryButtonText", value)}
            placeholder="Learn More About This Product"
            required
          />

          <TextField
            label="Special Offer Button Text"
            value={heroData.specialOfferButtonText}
            onChange={(value) => updateField("specialOfferButtonText", value)}
            placeholder="🎁 Special Offer Available"
            required
          />
        </div>
      </FormSection>

      {/* Product Images */}
      <FormSection
        title="Product Images"
        description="Add and manage product images for the hero section. First image will be the primary display image."
      >
        <div className="space-y-6">
          {heroData.productImages.map((image, index) => (
            <div key={index} className="relative">
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium text-gray-700">
                  Product Image {index + 1}
                  {index === 0 && (
                    <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                      Primary
                    </span>
                  )}
                </label>
                {heroData.productImages.length > 1 && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => removeProductImage(index)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
              <ImageUpload
                label=""
                value={image}
                onChange={(url) => updateProductImage(index, url)}
                placeholder={`Product image ${index + 1} URL`}
                required={index === 0}
              />
            </div>
          ))}

          <Button
            variant="outline"
            onClick={addProductImage}
            className="w-full"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Another Product Image
          </Button>

          <div className="text-sm text-gray-600 bg-blue-50 p-3 rounded-lg">
            <strong>Tip:</strong> The first image will be used as the primary
            hero image. Additional images will be available in the product
            gallery and modal.
          </div>
        </div>
      </FormSection>

      {/* Preview */}
      <FormSection
        title="Hero Section Preview"
        description="Preview how your hero section will look with the current settings."
      >
        <div className="border rounded-lg p-6 bg-gradient-to-br from-slate-50 via-white to-blue-50">
          <div className="space-y-4">
            <h1 className="text-2xl font-bold text-gray-900 leading-tight">
              {heroData.title || "Hero Title"}
            </h1>

            <div className="flex items-center gap-3">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <span
                    key={i}
                    className={`text-lg ${i < Math.floor(heroData.rating) ? "text-yellow-400" : "text-gray-300"}`}
                  >
                    ★
                  </span>
                ))}
              </div>
              <span className="text-lg font-semibold text-gray-700">
                {heroData.rating} ⭐
              </span>
              <span className="text-base text-gray-600">
                from {heroData.reviewCount} reviews
              </span>
            </div>

            <div className="space-y-2">
              <div className="text-2xl font-bold text-green-600">
                ${heroData.salePrice.toFixed(2)}
              </div>
              {heroData.originalPrice > 0 && (
                <div className="text-lg text-gray-500 line-through">
                  ${heroData.originalPrice.toFixed(2)}
                </div>
              )}
              <div className="text-sm text-green-600">
                {heroData.subscribeText}
              </div>
              <div className="text-sm text-blue-600">
                {heroData.walmartText}
              </div>
            </div>

            <div className="text-green-800 font-semibold">
              Arrives by {heroData.deliveryDate || "Date"}
            </div>

            <div className="text-red-600 font-medium">
              {heroData.stockText || "Stock text"}
            </div>

            <div className="space-y-3">
              <div className="bg-blue-600 text-white px-6 py-3 rounded-lg text-center font-bold">
                {heroData.primaryButtonText || "Primary Button"}
              </div>
              <div className="border-2 border-blue-600 text-blue-600 px-6 py-3 rounded-lg text-center font-semibold">
                {heroData.secondaryButtonText || "Secondary Button"}
              </div>
              <div className="text-blue-600 text-sm text-center font-medium">
                {heroData.specialOfferButtonText || "Special Offer Button"}
              </div>
            </div>

            {heroData.productImages[0] && (
              <div className="mt-4">
                <img
                  src={heroData.productImages[0]}
                  alt="Product preview"
                  className="w-full max-w-sm mx-auto rounded-lg shadow-lg"
                />
              </div>
            )}
          </div>
        </div>
      </FormSection>

      <ActionButtons
        onSave={handleSave}
        onReset={handleReset}
        isSaving={isSaving}
        saveText="Save Hero Section"
        resetText="Reset to Saved"
      />

      <SuccessToast
        show={showSuccess}
        message="Hero section saved successfully!"
        onClose={() => setShowSuccess(false)}
      />
    </>
  );
}
