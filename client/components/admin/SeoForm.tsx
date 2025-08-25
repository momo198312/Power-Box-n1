import { useState, useEffect } from "react";
import {
  TextField,
  TextAreaField,
  ActionButtons,
  FormSection,
} from "./FormComponents";
import { SectionHeader, SuccessToast } from "./AdminLayout";
import {
  getAdminData,
  saveSection,
  SeoData,
} from "@/lib/admin-storage-supabase";
import { Search } from "lucide-react";

export function SeoForm() {
  const [seoData, setSeoData] = useState<SeoData>({
    metaTitle: "",
    metaDescription: "",
    metaKeywords: "",
  });
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Load data on mount
  useEffect(() => {
    const loadData = async () => {
      const adminData = await getAdminData();
      setSeoData(adminData.seo);
    };
    loadData();
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await saveSection("seo", seoData);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);

      // Update the actual document head
      updateDocumentHead(seoData);
    } catch (error) {
      console.error("Error saving SEO data:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = async () => {
    const adminData = await getAdminData();
    setSeoData(adminData.seo);
  };

  const updateField = (field: keyof SeoData, value: string) => {
    setSeoData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <>
      <SectionHeader
        title="SEO Settings"
        description="Configure meta tags and SEO information for your landing page. These changes will be applied immediately to the page head."
        actions={
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Search className="h-4 w-4" />
            <span>Search Engine Optimization</span>
          </div>
        }
      />

      <FormSection
        title="Meta Tags Configuration"
        description="Set up the essential meta tags that control how your page appears in search results and social media."
      >
        <div className="space-y-6">
          <TextField
            label="Meta Title"
            value={seoData.metaTitle}
            onChange={(value) => updateField("metaTitle", value)}
            placeholder="Enter the page title (recommended: 50-60 characters)"
            required
          />

          <div className="text-sm text-gray-600">
            <strong>Current length:</strong> {seoData.metaTitle.length}{" "}
            characters
            {seoData.metaTitle.length > 60 && (
              <span className="text-orange-600 ml-2">
                ⚠ Consider shortening for better SEO
              </span>
            )}
          </div>

          <TextAreaField
            label="Meta Description"
            value={seoData.metaDescription}
            onChange={(value) => updateField("metaDescription", value)}
            placeholder="Enter a compelling description for search results (recommended: 150-160 characters)"
            rows={4}
            required
          />

          <div className="text-sm text-gray-600">
            <strong>Current length:</strong> {seoData.metaDescription.length}{" "}
            characters
            {seoData.metaDescription.length > 160 && (
              <span className="text-orange-600 ml-2">
                ⚠ Consider shortening for better SEO
              </span>
            )}
          </div>

          <TextField
            label="Meta Keywords"
            value={seoData.metaKeywords}
            onChange={(value) => updateField("metaKeywords", value)}
            placeholder="Enter keywords separated by commas (e.g., snack box, healthy snacks, gift box)"
          />

          <div className="text-sm text-gray-500">
            Separate keywords with commas. While less important for modern SEO,
            some search engines still use this.
          </div>
        </div>

        <ActionButtons
          onSave={handleSave}
          onReset={handleReset}
          isSaving={isSaving}
          saveText="Save SEO Settings"
          resetText="Reset to Saved"
        />
      </FormSection>

      {/* Preview Section */}
      <FormSection
        title="Search Result Preview"
        description="Here's how your page might appear in Google search results:"
      >
        <div className="border rounded-lg p-4 bg-gray-50">
          <div className="space-y-1">
            <div className="text-blue-600 text-lg font-medium hover:underline cursor-pointer">
              {seoData.metaTitle || "Page Title"}
            </div>
            <div className="text-green-700 text-sm">https://yoursite.com</div>
            <div className="text-gray-700 text-sm leading-relaxed">
              {seoData.metaDescription ||
                "Page description will appear here..."}
            </div>
          </div>
        </div>

        {seoData.metaKeywords && (
          <div className="mt-4 p-3 bg-blue-50 rounded-lg">
            <div className="text-sm font-medium text-blue-900 mb-1">
              Keywords:
            </div>
            <div className="flex flex-wrap gap-1">
              {seoData.metaKeywords.split(",").map((keyword, index) => (
                <span
                  key={index}
                  className="inline-block bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs"
                >
                  {keyword.trim()}
                </span>
              ))}
            </div>
          </div>
        )}
      </FormSection>

      <SuccessToast
        show={showSuccess}
        message="SEO settings saved successfully!"
        onClose={() => setShowSuccess(false)}
      />
    </>
  );
}

// Function to update the actual document head
function updateDocumentHead(seoData: SeoData) {
  // Update title
  if (seoData.metaTitle) {
    document.title = seoData.metaTitle;
  }

  // Update or create meta description
  let metaDescription = document.querySelector('meta[name="description"]');
  if (!metaDescription) {
    metaDescription = document.createElement("meta");
    metaDescription.setAttribute("name", "description");
    document.head.appendChild(metaDescription);
  }
  metaDescription.setAttribute("content", seoData.metaDescription);

  // Update or create meta keywords
  let metaKeywords = document.querySelector('meta[name="keywords"]');
  if (!metaKeywords) {
    metaKeywords = document.createElement("meta");
    metaKeywords.setAttribute("name", "keywords");
    document.head.appendChild(metaKeywords);
  }
  metaKeywords.setAttribute("content", seoData.metaKeywords);

  // Update Open Graph tags
  updateOpenGraphTags(seoData);
}

function updateOpenGraphTags(seoData: SeoData) {
  const ogTags = [
    { property: "og:title", content: seoData.metaTitle },
    { property: "og:description", content: seoData.metaDescription },
    { property: "og:type", content: "website" },
    { property: "twitter:card", content: "summary_large_image" },
    { property: "twitter:title", content: seoData.metaTitle },
    { property: "twitter:description", content: seoData.metaDescription },
  ];

  ogTags.forEach(({ property, content }) => {
    if (!content) return;

    let meta = document.querySelector(`meta[property="${property}"]`);
    if (!meta) {
      meta = document.createElement("meta");
      meta.setAttribute("property", property);
      document.head.appendChild(meta);
    }
    meta.setAttribute("content", content);
  });
}
