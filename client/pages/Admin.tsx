import { useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { SeoForm } from "@/components/admin/SeoForm";
import { HeroForm } from "@/components/admin/HeroForm";
import { FeaturesForm } from "@/components/admin/FeaturesForm";
import { TrustForm } from "@/components/admin/TrustForm";
import { GalleryForm } from "@/components/admin/GalleryForm";
import { ReviewsForm } from "@/components/admin/ReviewsForm";
import { FinalCtaForm } from "@/components/admin/FinalCtaForm";
import { FooterForm } from "@/components/admin/FooterForm";
import { PopupsForm } from "@/components/admin/PopupsForm";
type AdminSection =
  | "seo"
  | "hero"
  | "features"
  | "trust"
  | "gallery"
  | "reviews"
  | "finalcta"
  | "footer"
  | "popups";

export default function Admin() {
  const [currentSection, setCurrentSection] = useState<AdminSection>("seo");

  const renderSection = () => {
    switch (currentSection) {
      case "seo":
        return <SeoForm />;
      case "hero":
        return <HeroForm />;
      case "features":
        return <FeaturesForm />;
      case "trust":
        return <TrustForm />;
      case "gallery":
        return <GalleryForm />;
      case "reviews":
        return <ReviewsForm />;
      case "finalcta":
        return <FinalCtaForm />;
      case "footer":
        return <FooterForm />;
      case "popups":
        return <PopupsForm />;
      default:
        return <SeoForm />;
    }
  };

  return (
    <AdminLayout
      currentSection={currentSection}
      onSectionChange={(section) => setCurrentSection(section as AdminSection)}
    >
      {renderSection()}
    </AdminLayout>
  );
}
