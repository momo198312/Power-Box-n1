import { useState, useEffect } from "react";
import {
  TextField,
  NumberField,
  ActionButtons,
  FormSection,
} from "./FormComponents";
import { SectionHeader, SuccessToast } from "./AdminLayout";
import {
  getAdminData,
  saveSection,
  TrustData,
} from "@/lib/admin-storage-supabase";
import { Shield } from "lucide-react";

export function TrustForm() {
  const [trustData, setTrustData] = useState<TrustData>({
    walmartTitle: "",
    walmartSubtext: "",
    sellerTitle: "",
    sellerRating: 0,
    sellerReviewCount: 0,
    returnsTitle: "",
    returnsDays: 0,
    returnsText: "",
    ctaButtonText: "",
  });
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Load data on mount
  useEffect(() => {
    const loadData = async () => {
      const adminData = await getAdminData();
      setTrustData(adminData.trust);
    };
    loadData();
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await saveSection("trust", trustData);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (error) {
      console.error("Error saving trust data:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = async () => {
    const adminData = await getAdminData();
    setTrustData(adminData.trust);
  };

  const updateField = (field: keyof TrustData, value: string | number) => {
    setTrustData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <>
      <SectionHeader
        title="Trust Section"
        description="Configure the trust indicators including Walmart seller information, seller ratings, and returns policy."
        actions={
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Shield className="h-4 w-4" />
            <span>Trust & Credibility</span>
          </div>
        }
      />

      {/* Walmart Seller Information */}
      <FormSection
        title="Walmart Seller Information"
        description="Configure the Walmart seller trust indicators and messaging."
      >
        <div className="space-y-6">
          <TextField
            label="Walmart Title"
            value={trustData.walmartTitle}
            onChange={(value) => updateField("walmartTitle", value)}
            placeholder="Official Walmart Seller"
            required
          />

          <TextField
            label="Walmart Subtext"
            value={trustData.walmartSubtext}
            onChange={(value) => updateField("walmartSubtext", value)}
            placeholder="Secure checkout and fast delivery"
            required
          />
        </div>
      </FormSection>

      {/* Seller Rating Information */}
      <FormSection
        title="Seller Rating Information"
        description="Configure seller rating and review information."
      >
        <div className="space-y-6">
          <TextField
            label="Seller Title"
            value={trustData.sellerTitle}
            onChange={(value) => updateField("sellerTitle", value)}
            placeholder="Pro Seller"
            required
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <NumberField
              label="Seller Rating"
              value={trustData.sellerRating}
              onChange={(value) => updateField("sellerRating", value)}
              min={0}
              max={5}
              step={0.1}
              placeholder="4.1"
              required
            />

            <NumberField
              label="Seller Review Count"
              value={trustData.sellerReviewCount}
              onChange={(value) => updateField("sellerReviewCount", value)}
              min={0}
              placeholder="570"
              required
            />
          </div>
        </div>
      </FormSection>

      {/* Returns Policy */}
      <FormSection
        title="Returns Policy"
        description="Configure the returns policy information and messaging."
      >
        <div className="space-y-6">
          <TextField
            label="Returns Policy Title"
            value={trustData.returnsTitle}
            onChange={(value) => updateField("returnsTitle", value)}
            placeholder="Free 90-Day Returns"
            required
          />

          <NumberField
            label="Returns Period (Days)"
            value={trustData.returnsDays}
            onChange={(value) => updateField("returnsDays", value)}
            min={0}
            placeholder="90"
            required
          />

          <TextField
            label="Returns Description"
            value={trustData.returnsText}
            onChange={(value) => updateField("returnsText", value)}
            placeholder="Shop with confidence - easy returns"
            required
          />
        </div>
      </FormSection>

      {/* Call to Action */}
      <FormSection
        title="Trust Section CTA"
        description="Configure the call-to-action button in the trust section."
      >
        <div className="space-y-6">
          <TextField
            label="CTA Button Text"
            value={trustData.ctaButtonText}
            onChange={(value) => updateField("ctaButtonText", value)}
            placeholder="View Product Details"
            required
          />
        </div>
      </FormSection>

      {/* Preview */}
      <FormSection
        title="Trust Section Preview"
        description="Preview how your trust section will look with the current settings."
      >
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-3xl p-8 shadow-2xl text-white">
          <div className="grid md:grid-cols-3 gap-8 items-center">
            {/* Walmart Logo & Trust */}
            <div className="text-center">
              <div className="bg-white rounded-xl p-4 mb-4 inline-block">
                <div className="text-blue-600 font-bold text-2xl">Walmart</div>
              </div>
              <h3 className="text-xl font-bold mb-2">
                {trustData.walmartTitle || "Walmart Title"}
              </h3>
              <p className="text-blue-100">
                {trustData.walmartSubtext || "Walmart subtext"}
              </p>
            </div>

            {/* Seller Rating */}
            <div className="text-center">
              <div className="bg-white/20 backdrop-blur rounded-xl p-6">
                <h3 className="text-2xl font-bold mb-2">
                  {trustData.sellerTitle || "Seller Title"}
                </h3>
                <div className="flex items-center justify-center gap-2 mb-2">
                  <div className="flex">
                    {[...Array(4)].map((_, i) => (
                      <span key={i} className="text-yellow-400 text-lg">
                        ★
                      </span>
                    ))}
                    <span className="text-yellow-400 text-lg">☆</span>
                  </div>
                  <span className="font-semibold">
                    {trustData.sellerRating}
                  </span>
                </div>
                <p className="text-blue-100">
                  from {trustData.sellerReviewCount} reviews
                </p>
              </div>
            </div>

            {/* Returns Policy */}
            <div className="text-center">
              <div className="bg-green-500 rounded-full p-4 mb-4 inline-block">
                <Shield className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-2">
                {trustData.returnsTitle ||
                  `Free ${trustData.returnsDays}-Day Returns`}
              </h3>
              <p className="text-blue-100">
                {trustData.returnsText || "Returns description"}
              </p>
            </div>
          </div>

          {/* CTA Button */}
          <div className="text-center mt-8">
            <div className="bg-white text-blue-600 px-6 py-3 rounded-2xl font-bold inline-block">
              {trustData.ctaButtonText || "CTA Button Text"}
            </div>
          </div>
        </div>
      </FormSection>

      <ActionButtons
        onSave={handleSave}
        onReset={handleReset}
        isSaving={isSaving}
        saveText="Save Trust Section"
        resetText="Reset to Saved"
      />

      <SuccessToast
        show={showSuccess}
        message="Trust section saved successfully!"
        onClose={() => setShowSuccess(false)}
      />
    </>
  );
}
