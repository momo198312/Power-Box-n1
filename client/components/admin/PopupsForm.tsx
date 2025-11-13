import { useState, useEffect } from "react";
import {
  TextField,
  TextAreaField,
  ImageUpload,
  ActionButtons,
  FormSection,
  SwitchField,
  ArrayField,
  NumberField,
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
      const viewDetailsPopup = popupsData.find(
        (p) => p.type === "view-product-details",
      );
      const exitPopup = popupsData.find((p) => p.type === "exit-intent");

      const requiredPopups = [];

      if (!viewDetailsPopup) {
        requiredPopups.push({
          id: "view-details-popup",
          title: "Product Details",
          description:
            "View detailed product information, pricing, and purchase options for this 42-piece snack collection.",
          buttonText: "Buy Now on Walmart",
          buttonLink:
            "https://www.walmart.com/ip/Healthy-Snack-Box-Tasty-Nutrient-Rich-Variety-42-Count-by-Gift-A-Snack/14479818419",
          image: "",
          type: "view-product-details" as const,
          useHeroTitle: true,
          showImages: true,
          showRating: true,
          showPricing: true,
          showPiecesCount: true,
          piecesCount: 42,
          piecesCountTitle: "Pieces Count:",
          piecesCountSubtitle: "Perfect variety for extended enjoyment",
          showMoreDetails: true,
          moreDetailsTitle: "More Details",
          moreDetails: [
            "Ultimate snack experience in a beautifully designed high-end packaging box",
            "Packed with a variety of breakfast bars and savory snacks for daily energy",
            "Individually packaged snacks for convenient grab-and-go options",
            "Ideal for adults, teens, and college students alike",
            "Arrives with a heartwarming greeting card for a personal touch",
          ],
          primaryButtonText: "Buy Now on Walmart",
          primaryButtonLink:
            "https://www.walmart.com/ip/Healthy-Snack-Box-Tasty-Nutrient-Rich-Variety-42-Count-by-Gift-A-Snack/14479818419",
          secondaryButtonText: "Continue Browsing",
          subscribeText: "✓ Subscribe & Save available",
          walmartText: "✓ Walmart+ offer eligible",
        });
      } else {
        requiredPopups.push(viewDetailsPopup);
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

  const updatePopup = (popupId: string, field: keyof PopupData, value: any) => {
    setPopups((prev) =>
      prev.map((popup) =>
        popup.id === popupId ? { ...popup, [field]: value } : popup,
      ),
    );
  };

  const getPopupByType = (type: "view-product-details" | "exit-intent") => {
    return popups.find((popup) => popup.type === type);
  };

  const viewDetailsPopup = getPopupByType("view-product-details");
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
        description="Configure your marketing popups: view product details popup for product information and exit-intent popups for retention."
        actions={
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Megaphone className="h-4 w-4" />
            <span>2 Popup Types</span>
          </div>
        }
      />

      <Tabs defaultValue="view-product-details" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger
            value="view-product-details"
            className="flex items-center gap-2"
          >
            <Eye className="h-4 w-4" />
            View Product Details Popup
          </TabsTrigger>
          <TabsTrigger value="exit-intent" className="flex items-center gap-2">
            <ExternalLink className="h-4 w-4" />
            Exit-Intent Popup
          </TabsTrigger>
        </TabsList>

        {/* View Product Details Popup */}
        <TabsContent value="view-product-details">
          <FormSection
            title="View Product Details Popup"
            description="This popup appears when users click the 'View Product Details' button. Shows comprehensive product information, pricing, and purchase options."
          >
            {viewDetailsPopup && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Eye className="h-4 w-4" />
                    <span>Triggered by 'View Product Details' button</span>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPreviewPopup("view-product-details")}
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    Preview
                  </Button>
                </div>

                {/* Header Configuration */}
                <FormSection
                  title="Header Configuration"
                  description="Configure the popup header content."
                >
                  <SwitchField
                    label="Use Hero Title"
                    description="If enabled, uses the main product title from the hero section instead of the custom title below"
                    value={viewDetailsPopup.useHeroTitle || false}
                    onChange={(value) =>
                      updatePopup(viewDetailsPopup.id, "useHeroTitle", value)
                    }
                  />

                  <TextField
                    label="Custom Popup Title"
                    value={viewDetailsPopup.title}
                    onChange={(value) =>
                      updatePopup(viewDetailsPopup.id, "title", value)
                    }
                    placeholder="Product Details"
                    required={!viewDetailsPopup.useHeroTitle}
                  />

                  <TextAreaField
                    label="Popup Description"
                    value={viewDetailsPopup.description}
                    onChange={(value) =>
                      updatePopup(viewDetailsPopup.id, "description", value)
                    }
                    placeholder="View detailed product information, pricing, and purchase options for this 42-piece snack collection."
                    rows={2}
                    required
                  />
                </FormSection>

                {/* Content Sections */}
                <FormSection
                  title="Content Sections"
                  description="Choose which sections to display in the popup."
                >
                  <SwitchField
                    label="Show Product Images"
                    description="Display product images with gallery navigation"
                    value={viewDetailsPopup.showImages || false}
                    onChange={(value) =>
                      updatePopup(viewDetailsPopup.id, "showImages", value)
                    }
                  />

                  <SwitchField
                    label="Show Rating"
                    description="Display star rating and review count"
                    value={viewDetailsPopup.showRating || false}
                    onChange={(value) =>
                      updatePopup(viewDetailsPopup.id, "showRating", value)
                    }
                  />

                  <SwitchField
                    label="Show Pricing"
                    description="Display sale price, original price, and special offers"
                    value={viewDetailsPopup.showPricing || false}
                    onChange={(value) =>
                      updatePopup(viewDetailsPopup.id, "showPricing", value)
                    }
                  />

                  {viewDetailsPopup.showPricing && (
                    <div className="ml-6 space-y-4 border-l-2 border-blue-200 pl-4">
                      <TextField
                        label="Subscribe & Save Text"
                        value={viewDetailsPopup.subscribeText || ""}
                        onChange={(value) =>
                          updatePopup(
                            viewDetailsPopup.id,
                            "subscribeText",
                            value,
                          )
                        }
                        placeholder="✓ Subscribe & Save available"
                      />

                      <TextField
                        label="Walmart+ Text"
                        value={viewDetailsPopup.walmartText || ""}
                        onChange={(value) =>
                          updatePopup(viewDetailsPopup.id, "walmartText", value)
                        }
                        placeholder="✓ Walmart+ offer eligible"
                      />
                    </div>
                  )}

                  <SwitchField
                    label="Show Pieces Count"
                    description="Display the number of items in the package"
                    value={viewDetailsPopup.showPiecesCount || false}
                    onChange={(value) =>
                      updatePopup(viewDetailsPopup.id, "showPiecesCount", value)
                    }
                  />

                  {viewDetailsPopup.showPiecesCount && (
                    <div className="ml-6 space-y-4 border-l-2 border-blue-200 pl-4">
                      <NumberField
                        label="Pieces Count"
                        value={viewDetailsPopup.piecesCount || 42}
                        onChange={(value) =>
                          updatePopup(viewDetailsPopup.id, "piecesCount", value)
                        }
                        min={1}
                        placeholder="42"
                      />

                      <TextField
                        label="Pieces Count Title"
                        value={viewDetailsPopup.piecesCountTitle || ""}
                        onChange={(value) =>
                          updatePopup(
                            viewDetailsPopup.id,
                            "piecesCountTitle",
                            value,
                          )
                        }
                        placeholder="Pieces Count:"
                      />

                      <TextField
                        label="Pieces Count Subtitle"
                        value={viewDetailsPopup.piecesCountSubtitle || ""}
                        onChange={(value) =>
                          updatePopup(
                            viewDetailsPopup.id,
                            "piecesCountSubtitle",
                            value,
                          )
                        }
                        placeholder="Perfect variety for extended enjoyment"
                      />
                    </div>
                  )}

                  <SwitchField
                    label="Show More Details"
                    description="Display a detailed list of product features"
                    value={viewDetailsPopup.showMoreDetails || false}
                    onChange={(value) =>
                      updatePopup(viewDetailsPopup.id, "showMoreDetails", value)
                    }
                  />

                  {viewDetailsPopup.showMoreDetails && (
                    <div className="ml-6 space-y-4 border-l-2 border-blue-200 pl-4">
                      <TextField
                        label="More Details Title"
                        value={viewDetailsPopup.moreDetailsTitle || ""}
                        onChange={(value) =>
                          updatePopup(
                            viewDetailsPopup.id,
                            "moreDetailsTitle",
                            value,
                          )
                        }
                        placeholder="More Details"
                      />

                      <ArrayField
                        label="Detail Items"
                        value={viewDetailsPopup.moreDetails || []}
                        onChange={(value) =>
                          updatePopup(viewDetailsPopup.id, "moreDetails", value)
                        }
                        placeholder="Enter detail"
                        addButtonText="Add Detail"
                      />
                    </div>
                  )}
                </FormSection>

                {/* Button Configuration */}
                <FormSection
                  title="Button Configuration"
                  description="Configure the action buttons at the bottom of the popup."
                >
                  <TextField
                    label="Primary Button Text"
                    value={
                      viewDetailsPopup.primaryButtonText ||
                      viewDetailsPopup.buttonText
                    }
                    onChange={(value) =>
                      updatePopup(
                        viewDetailsPopup.id,
                        "primaryButtonText",
                        value,
                      )
                    }
                    placeholder="Buy Now on Walmart"
                    required
                  />

                  <TextField
                    label="Primary Button Link"
                    value={
                      viewDetailsPopup.primaryButtonLink ||
                      viewDetailsPopup.buttonLink
                    }
                    onChange={(value) =>
                      updatePopup(
                        viewDetailsPopup.id,
                        "primaryButtonLink",
                        value,
                      )
                    }
                    placeholder="https://www.walmart.com/ip/product-page"
                    required
                  />

                  <TextField
                    label="Secondary Button Text"
                    value={viewDetailsPopup.secondaryButtonText || ""}
                    onChange={(value) =>
                      updatePopup(
                        viewDetailsPopup.id,
                        "secondaryButtonText",
                        value,
                      )
                    }
                    placeholder="Continue Browsing"
                  />
                </FormSection>

                {/* Legacy Fields (for compatibility) */}
                <FormSection
                  title="Legacy Compatibility"
                  description="These fields are maintained for compatibility with the simple popup fallback."
                >
                  <TextField
                    label="Legacy Button Text"
                    value={viewDetailsPopup.buttonText}
                    onChange={(value) =>
                      updatePopup(viewDetailsPopup.id, "buttonText", value)
                    }
                    placeholder="Buy Now on Walmart"
                    required
                  />

                  <TextField
                    label="Legacy Button Link"
                    value={viewDetailsPopup.buttonLink}
                    onChange={(value) =>
                      updatePopup(viewDetailsPopup.id, "buttonLink", value)
                    }
                    placeholder="https://www.walmart.com/ip/product-page"
                    required
                  />

                  <ImageUpload
                    label="Legacy Popup Image (Optional)"
                    value={viewDetailsPopup.image || ""}
                    onChange={(value) =>
                      updatePopup(viewDetailsPopup.id, "image", value)
                    }
                    placeholder="Upload an image for the popup"
                  />
                </FormSection>

                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="text-sm font-medium text-blue-900 mb-2">
                    Configuration Tips:
                  </div>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>
                      • Enable "Use Hero Title" to automatically use the main
                      product title
                    </li>
                    <li>
                      • Toggle content sections to match the frontend modal
                      exactly
                    </li>
                    <li>
                      • More Details section supports multiple bullet points
                    </li>
                    <li>
                      • Primary button leads to purchase, secondary button
                      closes popup
                    </li>
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
            previewPopup === "view-product-details"
              ? viewDetailsPopup!
              : exitPopup!
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
