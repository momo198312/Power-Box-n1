import { useState, useEffect } from "react";
import {
  TextField,
  ImageUpload,
  ActionButtons,
  FormSection,
} from "./FormComponents";
import { SectionHeader, SuccessToast } from "./AdminLayout";
import {
  getAdminData,
  saveSection,
  GalleryData,
} from "@/lib/admin-storage-supabase";
import { Settings, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export function GalleryForm() {
  const [galleryData, setGalleryData] = useState<GalleryData>({
    title: "",
    images: [],
  });
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Load data on mount
  useEffect(() => {
    const loadData = async () => {
      const adminData = await getAdminData();
      setGalleryData(adminData.gallery);
    };
    loadData();
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await saveSection("gallery", galleryData);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (error) {
      console.error("Error saving gallery data:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = async () => {
    const adminData = await getAdminData();
    setGalleryData(adminData.gallery);
  };

  const updateTitle = (title: string) => {
    setGalleryData((prev) => ({ ...prev, title }));
  };

  const addImage = () => {
    setGalleryData((prev) => ({
      ...prev,
      images: [...prev.images, { url: "", title: "", description: "" }],
    }));
  };

  const updateImage = (index: number, field: string, value: string) => {
    setGalleryData((prev) => ({
      ...prev,
      images: prev.images.map((img, i) =>
        i === index ? { ...img, [field]: value } : img,
      ),
    }));
  };

  const removeImage = (index: number) => {
    setGalleryData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const moveImage = (fromIndex: number, toIndex: number) => {
    setGalleryData((prev) => {
      const newImages = [...prev.images];
      const [movedImage] = newImages.splice(fromIndex, 1);
      newImages.splice(toIndex, 0, movedImage);
      return { ...prev, images: newImages };
    });
  };

  return (
    <>
      <SectionHeader
        title="Gallery Section"
        description="Manage the product gallery section with title and multiple product images that showcase different views."
        actions={
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Settings className="h-4 w-4" />
            <span>{galleryData.images.length} Images</span>
          </div>
        }
      />

      {/* Section Title */}
      <FormSection
        title="Gallery Title"
        description="Set the main title for the gallery section."
      >
        <TextField
          label="Section Title"
          value={galleryData.title}
          onChange={updateTitle}
          placeholder="See What's Inside Your Box"
          required
        />
      </FormSection>

      {/* Gallery Images */}
      <div className="space-y-6">
        {galleryData.images.map((image, index) => (
          <FormSection
            key={index}
            title={`Gallery Image ${index + 1}`}
            description={`Configure gallery image ${index + 1} with URL, title, and description.`}
          >
            <div className="space-y-6">
              {/* Image Controls */}
              <div className="flex items-center justify-between pb-4 border-b">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-blue-100">
                    <Settings className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">
                      {image.title || `Gallery Image ${index + 1}`}
                    </div>
                    <div className="text-sm text-gray-500">
                      Position {index + 1}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {index > 0 && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => moveImage(index, index - 1)}
                    >
                      ↑
                    </Button>
                  )}
                  {index < galleryData.images.length - 1 && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => moveImage(index, index + 1)}
                    >
                      ↓
                    </Button>
                  )}
                  {galleryData.images.length > 1 && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => removeImage(index)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>

              {/* Image Form Fields */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-6">
                  <TextField
                    label="Image Title"
                    value={image.title}
                    onChange={(value) => updateImage(index, "title", value)}
                    placeholder="Complete Collection"
                    required
                  />

                  <TextField
                    label="Image Description"
                    value={image.description}
                    onChange={(value) =>
                      updateImage(index, "description", value)
                    }
                    placeholder="Full view of all 42 snacks"
                    required
                  />
                </div>

                <div>
                  <ImageUpload
                    label="Gallery Image"
                    value={image.url}
                    onChange={(value) => updateImage(index, "url", value)}
                    placeholder="Upload gallery image"
                    required
                  />
                </div>
              </div>

              {/* Image Preview */}
              {image.url && (
                <div className="mt-6 p-4 border rounded-lg bg-gray-50">
                  <div className="text-sm font-medium text-gray-700 mb-3">
                    Preview:
                  </div>
                  <div className="group relative overflow-hidden rounded-2xl shadow-xl cursor-pointer max-w-sm">
                    <img
                      src={image.url}
                      alt={image.title}
                      className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                    <div className="absolute bottom-4 left-4 text-white">
                      <h3 className="font-semibold text-lg">
                        {image.title || "Image Title"}
                      </h3>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </FormSection>
        ))}

        {/* Add Image Button */}
        <FormSection
          title="Add New Image"
          description="Add another image to the gallery section."
        >
          <Button
            variant="outline"
            onClick={addImage}
            className="w-full py-6 border-dashed border-2"
          >
            <Plus className="h-5 w-5 mr-2" />
            Add New Gallery Image
          </Button>

          <div className="text-sm text-gray-600 text-center mt-3">
            Recommended: 3-6 images for optimal display
          </div>
        </FormSection>
      </div>

      {/* Full Section Preview */}
      <FormSection
        title="Gallery Section Preview"
        description="Preview how the complete gallery section will look."
      >
        <div className="bg-gradient-to-r from-gray-50 to-slate-50 rounded-2xl p-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">
            {galleryData.title || "Gallery Title"}
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            {galleryData.images.slice(0, 3).map((image, index) => (
              <div
                key={index}
                className="group relative overflow-hidden rounded-2xl shadow-xl"
              >
                {image.url ? (
                  <img
                    src={image.url}
                    alt={image.title}
                    className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                    loading="lazy"
                  />
                ) : (
                  <div className="w-full h-64 bg-gray-200 flex items-center justify-center">
                    <span className="text-gray-500 text-sm">No image</span>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 text-white">
                  <h3 className="font-semibold text-lg">
                    {image.title || `Image ${index + 1}`}
                  </h3>
                </div>
              </div>
            ))}
          </div>

          {galleryData.images.length > 3 && (
            <div className="text-center mt-4 text-sm text-gray-600">
              + {galleryData.images.length - 3} more images
            </div>
          )}
        </div>
      </FormSection>

      {/* Global Actions */}
      <div className="sticky bottom-4 bg-white border border-gray-200 rounded-lg p-4 shadow-lg">
        <ActionButtons
          onSave={handleSave}
          onReset={handleReset}
          isSaving={isSaving}
          saveText="Save Gallery Section"
          resetText="Reset to Saved"
        />
      </div>

      <SuccessToast
        show={showSuccess}
        message="Gallery section saved successfully!"
        onClose={() => setShowSuccess(false)}
      />
    </>
  );
}
