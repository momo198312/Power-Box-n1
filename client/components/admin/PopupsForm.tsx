import { useState, useEffect } from "react";
import {
  TextField,
  TextAreaField,
  ImageUpload,
  ActionButtons,
  FormSection,
} from "./FormComponents";
import { SectionHeader, SuccessToast } from "./AdminLayout";
import {
  getAdminData,
  saveSection,
  PopupData,
} from "@/lib/admin-storage-supabase";
import { Megaphone, MousePointer, ExternalLink, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function PopupsForm() {
  const [popups, setPopups] = useState<PopupData[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [previewPopup, setPreviewPopup] = useState<string | null>(null);

  // Load data on mount
  useEffect(() => {
    const loadData = async () => {
      const adminData = await getAdminData();
      // Ensure we have both required popup types
      const popupsData = adminData.popups || [];

      // Check if we have required popup types, if not create them
      const buttonPopup = popupsData.find((p) => p.type === "button-triggered");
      const exitPopup = popupsData.find((p) => p.type === "exit-intent");

      const requiredPopups = [];

      if (!buttonPopup) {
        requiredPopups.push({
          id: "button-popup",
          title: "Special Offer!",
          description:
            "Get 10% off your first order when you subscribe to our newsletter.",
          buttonText: "Get My Discount",
          buttonLink:
            "mailto:subscribe@example.com?subject=Newsletter%20Subscription",
          image: "",
          type: "button-triggered" as const,
        });
      } else {
        requiredPopups.push(buttonPopup);
      }

      if (!exitPopup) {
        requiredPopups.push({
          id: "exit-popup",
          title: "Wait! Don't Miss Out!",
          description:
            "Join our newsletter for exclusive snack deals and new product alerts.",
          buttonText: "Subscribe Now",
          buttonLink:
            "mailto:newsletter@example.com?subject=Newsletter%20Subscription",
          image: "",
          type: "exit-intent" as const,
        });
      } else {
        requiredPopups.push(exitPopup);
      }

      setPopups(requiredPopups);
    };
    loadData();
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await saveSection("popups", popups);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (error) {
      console.error("Error saving popups data:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = async () => {
    const adminData = await getAdminData();
    setPopups(adminData.popups);
  };

  const updatePopup = (
    popupId: string,
    field: keyof PopupData,
    value: string,
  ) => {
    setPopups((prev) =>
      prev.map((popup) =>
        popup.id === popupId ? { ...popup, [field]: value } : popup,
      ),
    );
  };

  const getPopupByType = (type: "button-triggered" | "exit-intent") => {
    return popups.find((popup) => popup.type === type);
  };

  const buttonPopup = getPopupByType("button-triggered");
  const exitPopup = getPopupByType("exit-intent");

  const PopupPreview = ({ popup }: { popup: PopupData }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl p-6 max-w-md w-full max-h-[80vh] overflow-y-auto">
        <div className="text-center space-y-4">
          {popup.image && (
            <img
              src={popup.image}
              alt={popup.title}
              className="w-24 h-24 object-cover rounded-lg mx-auto"
            />
          )}

          <h3 className="text-xl font-bold text-gray-900">{popup.title}</h3>

          <p className="text-gray-600">{popup.description}</p>

          <div className="space-y-3">
            <button className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
              {popup.buttonText}
            </button>

            <button
              onClick={() => setPreviewPopup(null)}
              className="w-full text-gray-500 py-2 px-6 rounded-lg hover:bg-gray-50 transition-colors"
            >
              No thanks, close
            </button>
          </div>

          <div className="text-xs text-gray-400 pt-2 border-t">
            Link: {popup.buttonLink}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <SectionHeader
        title="Popups Management"
        description="Configure your marketing popups: button-triggered popups for engagement and exit-intent popups for retention."
        actions={
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Megaphone className="h-4 w-4" />
            <span>2 Popup Types</span>
          </div>
        }
      />

      <Tabs defaultValue="button-triggered" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger
            value="button-triggered"
            className="flex items-center gap-2"
          >
            <MousePointer className="h-4 w-4" />
            Button-Triggered Popup
          </TabsTrigger>
          <TabsTrigger value="exit-intent" className="flex items-center gap-2">
            <ExternalLink className="h-4 w-4" />
            Exit-Intent Popup
          </TabsTrigger>
        </TabsList>

        {/* Button-Triggered Popup */}
        <TabsContent value="button-triggered">
          <FormSection
            title="Button-Triggered Popup"
            description="This popup appears when users click a specific button or trigger. Great for special offers, newsletter signups, or detailed information."
          >
            {buttonPopup && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <MousePointer className="h-4 w-4" />
                    <span>Triggered by button clicks</span>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPreviewPopup("button-triggered")}
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    Preview
                  </Button>
                </div>

                <TextField
                  label="Popup Title"
                  value={buttonPopup.title}
                  onChange={(value) =>
                    updatePopup(buttonPopup.id, "title", value)
                  }
                  placeholder="Special Offer!"
                  required
                />

                <TextAreaField
                  label="Popup Description"
                  value={buttonPopup.description}
                  onChange={(value) =>
                    updatePopup(buttonPopup.id, "description", value)
                  }
                  placeholder="Get 10% off your first order when you subscribe to our newsletter."
                  rows={3}
                  required
                />

                <TextField
                  label="Button Text"
                  value={buttonPopup.buttonText}
                  onChange={(value) =>
                    updatePopup(buttonPopup.id, "buttonText", value)
                  }
                  placeholder="Get My Discount"
                  required
                />

                <TextField
                  label="Button Link/Action"
                  value={buttonPopup.buttonLink}
                  onChange={(value) =>
                    updatePopup(buttonPopup.id, "buttonLink", value)
                  }
                  placeholder="mailto:subscribe@example.com or https://signup-page.com"
                  required
                />

                <ImageUpload
                  label="Popup Image (Optional)"
                  value={buttonPopup.image || ""}
                  onChange={(value) =>
                    updatePopup(buttonPopup.id, "image", value)
                  }
                  placeholder="Upload an image for the popup"
                />

                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="text-sm font-medium text-blue-900 mb-2">
                    Usage Tips:
                  </div>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• Use compelling titles that create urgency</li>
                    <li>• Keep descriptions concise but persuasive</li>
                    <li>
                      • For email links, use format: mailto:email@domain.com
                    </li>
                    <li>• For web links, include full URL with https://</li>
                  </ul>
                </div>
              </div>
            )}
          </FormSection>
        </TabsContent>

        {/* Exit-Intent Popup */}
        <TabsContent value="exit-intent">
          <FormSection
            title="Exit-Intent Popup"
            description="This popup appears when users try to leave the page. Perfect for last-minute offers, newsletter subscriptions, or customer retention."
          >
            {exitPopup && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <ExternalLink className="h-4 w-4" />
                    <span>Triggered when leaving the page</span>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPreviewPopup("exit-intent")}
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    Preview
                  </Button>
                </div>

                <TextField
                  label="Popup Title"
                  value={exitPopup.title}
                  onChange={(value) =>
                    updatePopup(exitPopup.id, "title", value)
                  }
                  placeholder="Wait! Don't Miss Out!"
                  required
                />

                <TextAreaField
                  label="Popup Description"
                  value={exitPopup.description}
                  onChange={(value) =>
                    updatePopup(exitPopup.id, "description", value)
                  }
                  placeholder="Join our newsletter for exclusive snack deals and new product alerts."
                  rows={3}
                  required
                />

                <TextField
                  label="Button Text"
                  value={exitPopup.buttonText}
                  onChange={(value) =>
                    updatePopup(exitPopup.id, "buttonText", value)
                  }
                  placeholder="Subscribe Now"
                  required
                />

                <TextField
                  label="Button Link/Action"
                  value={exitPopup.buttonLink}
                  onChange={(value) =>
                    updatePopup(exitPopup.id, "buttonLink", value)
                  }
                  placeholder="mailto:newsletter@example.com or https://newsletter-signup.com"
                  required
                />

                <ImageUpload
                  label="Popup Image (Optional)"
                  value={exitPopup.image || ""}
                  onChange={(value) =>
                    updatePopup(exitPopup.id, "image", value)
                  }
                  placeholder="Upload an image for the popup"
                />

                <div className="bg-orange-50 p-4 rounded-lg">
                  <div className="text-sm font-medium text-orange-900 mb-2">
                    Exit-Intent Tips:
                  </div>
                  <ul className="text-sm text-orange-800 space-y-1">
                    <li>
                      • Create urgency with phrases like "Wait!" or "Last
                      chance"
                    </li>
                    <li>
                      • Offer something valuable (discount, free shipping, etc.)
                    </li>
                    <li>
                      • Keep it simple - users are already trying to leave
                    </li>
                    <li>• Test different offers to see what works best</li>
                  </ul>
                </div>
              </div>
            )}
          </FormSection>
        </TabsContent>
      </Tabs>

      {/* Global Actions */}
      <div className="sticky bottom-4 bg-white border border-gray-200 rounded-lg p-4 shadow-lg">
        <ActionButtons
          onSave={handleSave}
          onReset={handleReset}
          isSaving={isSaving}
          saveText="Save Popup Settings"
          resetText="Reset to Saved"
        />
      </div>

      {/* Popup Preview Modal */}
      {previewPopup && (
        <PopupPreview
          popup={
            previewPopup === "button-triggered" ? buttonPopup! : exitPopup!
          }
        />
      )}

      <SuccessToast
        show={showSuccess}
        message="Popup settings saved successfully!"
        onClose={() => setShowSuccess(false)}
      />
    </>
  );
}
