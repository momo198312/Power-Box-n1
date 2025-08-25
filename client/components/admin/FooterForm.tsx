import { useState, useEffect } from "react";
import { TextField, ActionButtons, FormSection } from "./FormComponents";
import { SectionHeader, SuccessToast } from "./AdminLayout";
import {
  getAdminData,
  saveSection,
  FooterData,
} from "@/lib/admin-storage-supabase";
import {
  Settings,
  Plus,
  Trash2,
  Facebook,
  Instagram,
  Twitter,
  Youtube,
} from "lucide-react";
import { Button } from "@/components/ui/button";

// Available social platforms with their icons
const availablePlatforms = [
  {
    value: "Facebook",
    label: "Facebook",
    icon: Facebook,
    defaultHover: "hover:text-white",
  },
  {
    value: "Instagram",
    label: "Instagram",
    icon: Instagram,
    defaultHover: "hover:text-pink-400",
  },
  {
    value: "Twitter",
    label: "Twitter",
    icon: Twitter,
    defaultHover: "hover:text-blue-400",
  },
  {
    value: "Youtube",
    label: "YouTube",
    icon: Youtube,
    defaultHover: "hover:text-red-400",
  },
];

export function FooterForm() {
  const [footerData, setFooterData] = useState<FooterData>({
    socialLinks: [],
  });
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Load data on mount
  useEffect(() => {
    const loadData = async () => {
      const adminData = await getAdminData();
      setFooterData(adminData.footer);
    };
    loadData();
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await saveSection("footer", footerData);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (error) {
      console.error("Error saving footer data:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = async () => {
    const adminData = await getAdminData();
    setFooterData(adminData.footer);
  };

  const addSocialLink = () => {
    setFooterData((prev) => ({
      ...prev,
      socialLinks: [
        ...prev.socialLinks,
        {
          platform: "Facebook",
          url: "",
          icon: "Facebook",
          hoverColor: "hover:text-white",
        },
      ],
    }));
  };

  const updateSocialLink = (index: number, field: string, value: string) => {
    setFooterData((prev) => ({
      ...prev,
      socialLinks: prev.socialLinks.map((link, i) =>
        i === index ? { ...link, [field]: value } : link,
      ),
    }));
  };

  const removeSocialLink = (index: number) => {
    setFooterData((prev) => ({
      ...prev,
      socialLinks: prev.socialLinks.filter((_, i) => i !== index),
    }));
  };

  const moveSocialLink = (fromIndex: number, toIndex: number) => {
    setFooterData((prev) => {
      const newLinks = [...prev.socialLinks];
      const [movedLink] = newLinks.splice(fromIndex, 1);
      newLinks.splice(toIndex, 0, movedLink);
      return { ...prev, socialLinks: newLinks };
    });
  };

  const getIconComponent = (iconName: string) => {
    const platformData = availablePlatforms.find(
      (platform) => platform.value === iconName,
    );
    return platformData ? platformData.icon : Facebook;
  };

  const handlePlatformChange = (index: number, platform: string) => {
    const platformData = availablePlatforms.find((p) => p.value === platform);
    if (platformData) {
      updateSocialLink(index, "platform", platform);
      updateSocialLink(index, "icon", platform);
      updateSocialLink(index, "hoverColor", platformData.defaultHover);
    }
  };

  return (
    <>
      <SectionHeader
        title="Footer Section"
        description="Configure the footer section with social media links and platform settings."
        actions={
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Settings className="h-4 w-4" />
            <span>{footerData.socialLinks.length} Social Links</span>
          </div>
        }
      />

      {/* Social Media Links */}
      <div className="space-y-6">
        {footerData.socialLinks.map((link, index) => {
          const IconComponent = getIconComponent(link.icon);

          return (
            <FormSection
              key={index}
              title={`${link.platform} Social Link`}
              description={`Configure the ${link.platform} social media link and settings.`}
            >
              <div className="space-y-6">
                {/* Social Link Controls */}
                <div className="flex items-center justify-between pb-4 border-b">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-gray-100">
                      <IconComponent className="h-5 w-5 text-gray-600" />
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">
                        {link.platform}
                      </div>
                      <div className="text-sm text-gray-500">
                        Social Link {index + 1}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {index > 0 && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => moveSocialLink(index, index - 1)}
                      >
                        ↑
                      </Button>
                    )}
                    {index < footerData.socialLinks.length - 1 && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => moveSocialLink(index, index + 1)}
                      >
                        ↓
                      </Button>
                    )}
                    {footerData.socialLinks.length > 1 && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => removeSocialLink(index)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>

                {/* Social Link Form Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Social Platform
                      </label>
                      <select
                        value={link.platform}
                        onChange={(e) =>
                          handlePlatformChange(index, e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                        required
                      >
                        {availablePlatforms.map((platform) => (
                          <option key={platform.value} value={platform.value}>
                            {platform.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <TextField
                      label="Platform URL"
                      value={link.url}
                      onChange={(value) =>
                        updateSocialLink(index, "url", value)
                      }
                      placeholder="https://facebook.com/yourpage"
                      required
                    />
                  </div>

                  <div className="space-y-6">
                    <TextField
                      label="Hover Color Class"
                      value={link.hoverColor}
                      onChange={(value) =>
                        updateSocialLink(index, "hoverColor", value)
                      }
                      placeholder="hover:text-white"
                      required
                    />

                    <div className="p-4 border rounded-lg bg-gray-50">
                      <div className="text-sm font-medium text-gray-700 mb-3">
                        Preview:
                      </div>
                      <div className="flex justify-center">
                        <a
                          href={link.url || "#"}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`text-gray-400 ${link.hoverColor} transform hover:scale-110 transition-all duration-300`}
                          aria-label={`Follow us on ${link.platform}`}
                        >
                          <IconComponent className="h-8 w-8" />
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </FormSection>
          );
        })}

        {/* Add Social Link Button */}
        <FormSection
          title="Add New Social Link"
          description="Add another social media platform to the footer."
        >
          <Button
            variant="outline"
            onClick={addSocialLink}
            className="w-full py-6 border-dashed border-2"
          >
            <Plus className="h-5 w-5 mr-2" />
            Add New Social Media Link
          </Button>

          <div className="text-sm text-gray-600 text-center mt-3">
            Common platforms: Facebook, Instagram, Twitter, YouTube, TikTok,
            LinkedIn
          </div>
        </FormSection>
      </div>

      {/* Full Footer Preview */}
      <FormSection
        title="Footer Section Preview"
        description="Preview how the complete footer will look on the frontend."
      >
        <div className="bg-slate-800 rounded-2xl py-8">
          <div className="max-w-4xl mx-auto px-4">
            <div className="flex justify-center items-center gap-8">
              {footerData.socialLinks.map((link, index) => {
                const IconComponent = getIconComponent(link.icon);
                return (
                  <a
                    key={index}
                    href={link.url || "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`text-gray-400 ${link.hoverColor} transform hover:scale-110 transition-all duration-300`}
                    aria-label={`Follow us on ${link.platform}`}
                  >
                    <IconComponent className="h-8 w-8" />
                  </a>
                );
              })}
            </div>

            {footerData.socialLinks.length === 0 && (
              <div className="text-center text-gray-500">
                No social links configured
              </div>
            )}
          </div>
        </div>
      </FormSection>

      {/* Global Actions */}
      <div className="sticky bottom-4 bg-white border border-gray-200 rounded-lg p-4 shadow-lg">
        <ActionButtons
          onSave={handleSave}
          onReset={handleReset}
          isSaving={isSaving}
          saveText="Save Footer Section"
          resetText="Reset to Saved"
        />
      </div>

      <SuccessToast
        show={showSuccess}
        message="Footer section saved successfully!"
        onClose={() => setShowSuccess(false)}
      />
    </>
  );
}
