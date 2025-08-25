import { useState, useEffect } from "react";
import {
  TextField,
  TextAreaField,
  ImageUpload,
  ColorSelect,
  IconSelect,
  ActionButtons,
  FormSection,
} from "./FormComponents";
import { SectionHeader, SuccessToast } from "./AdminLayout";
import {
  getAdminData,
  saveSection,
  FeatureData,
} from "@/lib/admin-storage-supabase";
import {
  Star,
  Package,
  Gift,
  Zap,
  Users,
  Heart,
  BadgeCheck,
  Shield,
  Clock,
  Truck,
  Plus,
  Trash2,
  GripVertical,
} from "lucide-react";
import { Button } from "@/components/ui/button";

// Available icons for features
const availableIcons = [
  { value: "Package", label: "Package", icon: Package },
  { value: "Gift", label: "Gift", icon: Gift },
  { value: "Zap", label: "Lightning", icon: Zap },
  { value: "Users", label: "Users", icon: Users },
  { value: "Heart", label: "Heart", icon: Heart },
  { value: "BadgeCheck", label: "Badge Check", icon: BadgeCheck },
  { value: "Shield", label: "Shield", icon: Shield },
  { value: "Clock", label: "Clock", icon: Clock },
  { value: "Truck", label: "Truck", icon: Truck },
  { value: "Star", label: "Star", icon: Star },
];

// Available colors for features
const availableColors = [
  { value: "blue", label: "Blue", className: "bg-blue-500" },
  { value: "purple", label: "Purple", className: "bg-purple-500" },
  { value: "green", label: "Green", className: "bg-green-500" },
  { value: "orange", label: "Orange", className: "bg-orange-500" },
  { value: "red", label: "Red", className: "bg-red-500" },
  { value: "indigo", label: "Indigo", className: "bg-indigo-500" },
  { value: "pink", label: "Pink", className: "bg-pink-500" },
  { value: "yellow", label: "Yellow", className: "bg-yellow-500" },
];

export function FeaturesForm() {
  const [featuresSection, setFeaturesSection] = useState<{
    title: string;
    features: FeatureData[];
  }>({
    title: "",
    features: [],
  });
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Load data on mount
  useEffect(() => {
    const loadData = async () => {
      const adminData = await getAdminData();
      setFeaturesSection(adminData.featuresSection);
    };
    loadData();
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await saveSection("featuresSection", featuresSection);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (error) {
      console.error("Error saving features data:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = async () => {
    const adminData = await getAdminData();
    setFeaturesSection(adminData.featuresSection);
  };

  const updateSectionTitle = (title: string) => {
    setFeaturesSection((prev) => ({ ...prev, title }));
  };

  const updateFeature = (
    index: number,
    field: keyof FeatureData,
    value: string,
  ) => {
    setFeaturesSection((prev) => ({
      ...prev,
      features: prev.features.map((feature, i) =>
        i === index ? { ...feature, [field]: value } : feature,
      ),
    }));
  };

  const addFeature = () => {
    const newFeature: FeatureData = {
      id: `feature-${Date.now()}`,
      icon: "Package",
      title: "New Feature",
      description: "Feature description goes here",
      color: "blue",
      image: "",
    };
    setFeaturesSection((prev) => ({
      ...prev,
      features: [...prev.features, newFeature],
    }));
  };

  const removeFeature = (index: number) => {
    setFeaturesSection((prev) => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index),
    }));
  };

  const moveFeature = (fromIndex: number, toIndex: number) => {
    setFeaturesSection((prev) => {
      const newFeatures = [...prev.features];
      const [movedFeature] = newFeatures.splice(fromIndex, 1);
      newFeatures.splice(toIndex, 0, movedFeature);
      return { ...prev, features: newFeatures };
    });
  };

  const getIconComponent = (iconName: string) => {
    const iconData = availableIcons.find((icon) => icon.value === iconName);
    return iconData ? iconData.icon : Package;
  };

  return (
    <>
      <SectionHeader
        title="Features Section"
        description="Manage the feature cards that highlight your product's key benefits. Each feature includes an icon, title, description, and image."
        actions={
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Star className="h-4 w-4" />
            <span>{featuresSection.features.length} Features</span>
          </div>
        }
      />

      {/* Section Title */}
      <FormSection
        title="Section Title"
        description="Set the main title for the features section."
      >
        <TextField
          label="Section Title"
          value={featuresSection.title}
          onChange={updateSectionTitle}
          placeholder="Why Choose Our Nutritious Snack Box?"
          required
        />
      </FormSection>

      {/* Features List */}
      <div className="space-y-6">
        {featuresSection.features.map((feature, index) => {
          const IconComponent = getIconComponent(feature.icon);

          return (
            <FormSection
              key={feature.id}
              title={`Feature ${index + 1}: ${feature.title}`}
              description={`Configure this feature card's content and appearance.`}
            >
              <div className="space-y-6">
                {/* Feature Controls */}
                <div className="flex items-center justify-between pb-4 border-b">
                  <div className="flex items-center gap-3">
                    <GripVertical className="h-5 w-5 text-gray-400" />
                    <div className={`p-2 rounded-lg bg-${feature.color}-100`}>
                      <IconComponent
                        className={`h-5 w-5 text-${feature.color}-600`}
                      />
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">
                        {feature.title}
                      </div>
                      <div className="text-sm text-gray-500">
                        Feature {index + 1}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {index > 0 && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => moveFeature(index, index - 1)}
                      >
                        ↑
                      </Button>
                    )}
                    {index < featuresSection.features.length - 1 && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => moveFeature(index, index + 1)}
                      >
                        ↓
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => removeFeature(index)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Feature Form Fields */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-6">
                    <TextField
                      label="Feature Title"
                      value={feature.title}
                      onChange={(value) => updateFeature(index, "title", value)}
                      placeholder="Enter feature title"
                      required
                    />

                    <TextAreaField
                      label="Feature Description"
                      value={feature.description}
                      onChange={(value) =>
                        updateFeature(index, "description", value)
                      }
                      placeholder="Describe this feature's benefit"
                      rows={3}
                      required
                    />

                    <IconSelect
                      label="Feature Icon"
                      value={feature.icon}
                      onChange={(value) => updateFeature(index, "icon", value)}
                      options={availableIcons}
                    />

                    <ColorSelect
                      label="Feature Color"
                      value={feature.color}
                      onChange={(value) => updateFeature(index, "color", value)}
                      options={availableColors}
                    />
                  </div>

                  <div>
                    <ImageUpload
                      label="Feature Image"
                      value={feature.image}
                      onChange={(value) => updateFeature(index, "image", value)}
                      placeholder="Upload feature image"
                      required
                    />
                  </div>
                </div>

                {/* Feature Preview */}
                <div className="mt-6 p-4 border rounded-lg bg-gray-50">
                  <div className="text-sm font-medium text-gray-700 mb-3">
                    Preview:
                  </div>
                  <div className="bg-white rounded-lg shadow-lg border-2 border-blue-200 overflow-hidden max-w-sm">
                    {/* Image */}
                    <div className="relative h-32 group overflow-hidden">
                      {feature.image ? (
                        <img
                          src={feature.image}
                          alt={feature.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                          <span className="text-gray-500 text-sm">
                            No image
                          </span>
                        </div>
                      )}

                      {/* Icon overlay */}
                      <div className="absolute top-2 right-2 bg-white bg-opacity-90 rounded-full w-8 h-8 flex items-center justify-center">
                        <IconComponent
                          className={`h-4 w-4 text-${feature.color}-600`}
                        />
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-4 text-center">
                      <h3 className="font-semibold text-gray-900 mb-2 text-sm">
                        {feature.title}
                      </h3>
                      <p className="text-gray-600 text-xs leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </FormSection>
          );
        })}

        {/* Add Feature Button */}
        <FormSection
          title="Add New Feature"
          description="Add another feature card to highlight more benefits."
        >
          <Button
            variant="outline"
            onClick={addFeature}
            className="w-full py-6 border-dashed border-2"
          >
            <Plus className="h-5 w-5 mr-2" />
            Add New Feature Card
          </Button>

          <div className="text-sm text-gray-600 text-center mt-3">
            Recommended: 3-6 features for optimal display
          </div>
        </FormSection>
      </div>

      {/* Global Actions */}
      <div className="sticky bottom-4 bg-white border border-gray-200 rounded-lg p-4 shadow-lg">
        <ActionButtons
          onSave={handleSave}
          onReset={handleReset}
          isSaving={isSaving}
          saveText="Save Features Section"
          resetText="Reset to Saved"
        />
      </div>

      <SuccessToast
        show={showSuccess}
        message="Features section saved successfully!"
        onClose={() => setShowSuccess(false)}
      />
    </>
  );
}
