import { useState, useEffect } from "react";
import {
  TextField,
  TextAreaField,
  ImageUpload,
  IconSelect,
  ColorSelect,
  ActionButtons,
  FormSection,
} from "./FormComponents";
import { SectionHeader, SuccessToast } from "./AdminLayout";
import {
  getAdminData,
  saveSection,
  FinalCtaData,
} from "@/lib/admin-storage-supabase";
import {
  Megaphone,
  Plus,
  Trash2,
  Shield,
  Truck,
  BadgeCheck,
  Star,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";

// Available icons for trust bar items
const availableIcons = [
  { value: "Shield", label: "Shield", icon: Shield },
  { value: "Truck", label: "Truck", icon: Truck },
  { value: "BadgeCheck", label: "Badge Check", icon: BadgeCheck },
  { value: "Star", label: "Star", icon: Star },
  { value: "Check", label: "Check", icon: Check },
];

// Available colors for trust bar items
const availableColors = [
  { value: "green", label: "Green", className: "bg-green-500" },
  { value: "blue", label: "Blue", className: "bg-blue-500" },
  { value: "purple", label: "Purple", className: "bg-purple-500" },
  { value: "orange", label: "Orange", className: "bg-orange-500" },
  { value: "red", label: "Red", className: "bg-red-500" },
  { value: "indigo", label: "Indigo", className: "bg-indigo-500" },
];

export function FinalCtaForm() {
  const [finalCtaData, setFinalCtaData] = useState<FinalCtaData>({
    badgeIcon: "",
    badgeText: "",
    mainTitle: "",
    description: "",
    image: "",
    benefits: [],
    ctaButtonText: "",
    trustBarItems: [],
  });
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Load data on mount
  useEffect(() => {
    const loadData = async () => {
      const adminData = await getAdminData();
      setFinalCtaData(adminData.finalCta);
    };
    loadData();
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await saveSection("finalCta", finalCtaData);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (error) {
      console.error("Error saving final CTA data:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = async () => {
    const adminData = await getAdminData();
    setFinalCtaData(adminData.finalCta);
  };

  const updateField = (
    field: keyof Omit<FinalCtaData, "benefits" | "trustBarItems">,
    value: string,
  ) => {
    setFinalCtaData((prev) => ({ ...prev, [field]: value }));
  };

  // Benefits management
  const addBenefit = () => {
    setFinalCtaData((prev) => ({
      ...prev,
      benefits: [...prev.benefits, "New benefit"],
    }));
  };

  const updateBenefit = (index: number, value: string) => {
    setFinalCtaData((prev) => ({
      ...prev,
      benefits: prev.benefits.map((benefit, i) =>
        i === index ? value : benefit,
      ),
    }));
  };

  const removeBenefit = (index: number) => {
    setFinalCtaData((prev) => ({
      ...prev,
      benefits: prev.benefits.filter((_, i) => i !== index),
    }));
  };

  // Trust bar items management
  const addTrustBarItem = () => {
    setFinalCtaData((prev) => ({
      ...prev,
      trustBarItems: [
        ...prev.trustBarItems,
        { icon: "Shield", text: "New trust item", color: "green" },
      ],
    }));
  };

  const updateTrustBarItem = (index: number, field: string, value: string) => {
    setFinalCtaData((prev) => ({
      ...prev,
      trustBarItems: prev.trustBarItems.map((item, i) =>
        i === index ? { ...item, [field]: value } : item,
      ),
    }));
  };

  const removeTrustBarItem = (index: number) => {
    setFinalCtaData((prev) => ({
      ...prev,
      trustBarItems: prev.trustBarItems.filter((_, i) => i !== index),
    }));
  };

  const getIconComponent = (iconName: string) => {
    const iconData = availableIcons.find((icon) => icon.value === iconName);
    return iconData ? iconData.icon : Shield;
  };

  return (
    <>
      <SectionHeader
        title="Final CTA Section"
        description="Configure the final call-to-action section with badge, title, benefits list, and trust indicators."
        actions={
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Megaphone className="h-4 w-4" />
            <span>Final Conversion</span>
          </div>
        }
      />

      {/* Header Section */}
      <FormSection
        title="Header Section"
        description="Configure the badge, main title, and description for the final CTA section."
      >
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <TextField
              label="Badge Icon (Emoji)"
              value={finalCtaData.badgeIcon}
              onChange={(value) => updateField("badgeIcon", value)}
              placeholder="🔥"
              required
            />

            <TextField
              label="Badge Text"
              value={finalCtaData.badgeText}
              onChange={(value) => updateField("badgeText", value)}
              placeholder="Bestseller - Limited Time Offer"
              required
            />
          </div>

          <TextField
            label="Main Title"
            value={finalCtaData.mainTitle}
            onChange={(value) => updateField("mainTitle", value)}
            placeholder="Ready to Fuel Your Day?"
            required
          />

          <TextAreaField
            label="Description"
            value={finalCtaData.description}
            onChange={(value) => updateField("description", value)}
            placeholder="Get your 42-count nutritious snack box today!"
            rows={2}
            required
          />

          <ImageUpload
            label="Product Image"
            value={finalCtaData.image}
            onChange={(value) => updateField("image", value)}
            placeholder="Upload product image for the final CTA section"
            required
          />
        </div>
      </FormSection>

      {/* Benefits List */}
      <FormSection
        title="Benefits List"
        description="Configure the list of benefits displayed with checkmarks."
      >
        <div className="space-y-4">
          {finalCtaData.benefits.map((benefit, index) => (
            <div key={index} className="flex items-center gap-3">
              <div className="flex-1">
                <TextField
                  label=""
                  value={benefit}
                  onChange={(value) => updateBenefit(index, value)}
                  placeholder="Enter benefit"
                  required
                />
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => removeBenefit(index)}
                className="text-red-600 hover:text-red-700 hover:bg-red-50 mt-2"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}

          <Button
            variant="outline"
            onClick={addBenefit}
            className="w-full border-dashed"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add New Benefit
          </Button>
        </div>
      </FormSection>

      {/* CTA Button */}
      <FormSection
        title="Call-to-Action Button"
        description="Configure the main CTA button text."
      >
        <TextField
          label="CTA Button Text"
          value={finalCtaData.ctaButtonText}
          onChange={(value) => updateField("ctaButtonText", value)}
          placeholder="Get Your Snack Box Now"
          required
        />
      </FormSection>

      {/* Trust Bar Items */}
      <FormSection
        title="Trust Bar Items"
        description="Configure the trust indicators displayed below the CTA button."
      >
        <div className="space-y-6">
          {finalCtaData.trustBarItems.map((item, index) => {
            const IconComponent = getIconComponent(item.icon);

            return (
              <div key={index} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg bg-${item.color}-100`}>
                      <IconComponent
                        className={`h-5 w-5 text-${item.color}-600`}
                      />
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">
                        {item.text}
                      </div>
                      <div className="text-sm text-gray-500">
                        Trust Item {index + 1}
                      </div>
                    </div>
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => removeTrustBarItem(index)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <TextField
                    label="Trust Item Text"
                    value={item.text}
                    onChange={(value) =>
                      updateTrustBarItem(index, "text", value)
                    }
                    placeholder="Secure Payment"
                    required
                  />

                  <IconSelect
                    label="Icon"
                    value={item.icon}
                    onChange={(value) =>
                      updateTrustBarItem(index, "icon", value)
                    }
                    options={availableIcons}
                  />

                  <ColorSelect
                    label="Color"
                    value={item.color}
                    onChange={(value) =>
                      updateTrustBarItem(index, "color", value)
                    }
                    options={availableColors}
                  />
                </div>
              </div>
            );
          })}

          <Button
            variant="outline"
            onClick={addTrustBarItem}
            className="w-full border-dashed"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add New Trust Item
          </Button>
        </div>
      </FormSection>

      {/* Full Section Preview */}
      <FormSection
        title="Final CTA Section Preview"
        description="Preview how the complete final CTA section will look."
      >
        <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-2xl p-8">
          {/* Main Content Grid */}
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Product Image */}
            <div className="text-center lg:text-left">
              {finalCtaData.image ? (
                <img
                  src={finalCtaData.image}
                  alt="Product Image"
                  className="w-full max-w-md mx-auto lg:mx-0 rounded-2xl shadow-2xl"
                />
              ) : (
                <div className="w-full max-w-md mx-auto lg:mx-0 h-64 bg-gray-200 rounded-2xl flex items-center justify-center">
                  <span className="text-gray-500">No image uploaded</span>
                </div>
              )}
            </div>

            {/* Content */}
            <div className="text-center lg:text-left">
              {/* Header Section */}
              <div className="mb-8">
                <div className="inline-flex items-center gap-2 bg-orange-100 text-orange-700 px-4 py-2 rounded-full text-sm font-semibold mb-4">
                  <span>{finalCtaData.badgeIcon || "🔥"}</span>
                  <span>{finalCtaData.badgeText || "Badge Text"}</span>
                </div>

                <h2 className="text-4xl font-bold text-gray-900 mb-4 leading-tight">
                  {finalCtaData.mainTitle || "Main Title"}
                </h2>

                <p className="text-lg text-gray-600">
                  {finalCtaData.description || "Description goes here"}
                </p>
              </div>

              {/* Benefits List */}
              <div className="bg-white rounded-3xl shadow-2xl border-2 border-blue-200 p-8 mb-8">
                <div className="space-y-3">
                  {finalCtaData.benefits.map((benefit, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <div className="bg-green-100 rounded-full p-1 flex-shrink-0">
                        <Check className="h-4 w-4 text-green-600" />
                      </div>
                      <span className="text-gray-700 font-medium">
                        {benefit}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* CTA Button */}
              <div className="text-center lg:text-left mb-6">
                <div className="bg-gradient-to-r from-green-600 to-green-700 text-white px-8 py-6 text-xl font-bold rounded-2xl shadow-2xl inline-block">
                  {finalCtaData.ctaButtonText || "CTA Button Text"}
                </div>
              </div>

              {/* Trust Bar */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 text-sm text-gray-600">
                {finalCtaData.trustBarItems.map((item, index) => {
                  const IconComponent = getIconComponent(item.icon);
                  return (
                    <div key={index} className="flex items-center gap-2">
                      <IconComponent
                        className={`h-5 w-5 text-${item.color}-600`}
                      />
                      <span className="font-medium">{item.text}</span>
                    </div>
                  );
                })}
              </div>
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
          saveText="Save Final CTA Section"
          resetText="Reset to Saved"
        />
      </div>

      <SuccessToast
        show={showSuccess}
        message="Final CTA section saved successfully!"
        onClose={() => setShowSuccess(false)}
      />
    </>
  );
}
