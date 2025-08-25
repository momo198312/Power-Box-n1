import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Star,
  ShoppingCart,
  Check,
  Zap,
  Users,
  Clock,
  Shield,
  ChevronLeft,
  ChevronRight,
  Gift,
  Package,
  Heart,
  BadgeCheck,
  Truck,
  Facebook,
  Instagram,
  Twitter,
  Youtube,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogHeader,
  DialogDescription,
  DialogPortal,
  DialogOverlay,
} from "@/components/ui/dialog";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { PricingDisplay } from "@/components/PricingDisplay";
import { FloatingSnacks } from "@/components/FloatingSnacks";
import { StickyCTA } from "@/components/StickyCTA";
import { CustomerReviews } from "@/components/CustomerReviews";
import { ExitIntentPopup } from "@/components/ExitIntentPopup";
import { useExitIntent } from "@/hooks/use-exit-intent";
import { useRealtimeAdminData } from "@/hooks/use-realtime-admin-data";
import { AdminData } from "@/lib/admin-storage-supabase";
import { RealtimeUpdateNotification } from "@/components/RealtimeUpdateNotification";

// Icon mapping for features
const iconMap: Record<string, React.ComponentType<any>> = {
  Package,
  Gift,
  Zap,
  Users,
  Heart,
  BadgeCheck,
  Shield,
  Clock,
  Truck,
  Star,
};

export default function DynamicIndex() {
  const {
    adminData,
    isLoading,
    error,
    updateReceived,
    clearUpdateNotification,
  } = useRealtimeAdminData();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showExitIntent, setShowExitIntent] = useState(false);
  const [showViewDetailsPopup, setShowViewDetailsPopup] = useState(false);

  const walmartUrl =
    "https://www.walmart.com/ip/Healthy-Snack-Box-Tasty-Nutrient-Rich-Variety-42-Count-by-Gift-A-Snack/14479818419?selectedSellerId=16964&selectedOfferId=BEA9DA42A8853A4C927EECB4D702F303&clickid=3PE2sMyDBxycW1s0QQThKWW7Ukp2AmR-AQ%3AGxo0&irgwc=1&sourceid=imp_3PE2sMyDBxycW1s0QQThKWW7Ukp2AmR-AQ%3AGxo0&veh=aff&wmlspartner=imp_5610446&affiliates_ad_id=565706&campaign_id=9383&sharedid=mp_16964_2016489964_knpf1_4mtlu49_BEA9DA42A8853A4C927EECB4D702F303&utm_source=landing&utm_medium=cta&utm_campaign=snackbox";

  // Update SEO meta tags when admin data changes
  useEffect(() => {
    if (adminData) {
      // Update SEO meta tags
      if (adminData.seo.metaTitle) {
        document.title = adminData.seo.metaTitle;
      }

      updateMetaTag("description", adminData.seo.metaDescription);
      updateMetaTag("keywords", adminData.seo.metaKeywords);
    }
  }, [adminData]);

  const updateMetaTag = (name: string, content: string) => {
    let meta = document.querySelector(`meta[name="${name}"]`);
    if (!meta) {
      meta = document.createElement("meta");
      meta.setAttribute("name", name);
      document.head.appendChild(meta);
    }
    meta.setAttribute("content", content);
  };

  const handleBuyClick = (location: string) => {
    console.log(`Buy clicked from: ${location}`);
    handleProceedToWalmart();
  };

  // Exit intent detection
  useExitIntent({
    enabled: !showExitIntent && !isModalOpen,
    sensitivity: 20,
    delayInMs: 100,
    onExitIntent: () => {
      setShowExitIntent(true);
    },
  });

  const handleCloseExitIntent = () => {
    setShowExitIntent(false);
  };

  const handleSubscribe = (email?: string) => {
    console.log("Newsletter subscription", { email });
    setShowExitIntent(false);
  };

  const handleProceedToWalmart = () => {
    console.log("Proceeding to Walmart checkout");
    const link = document.createElement("a");
    link.href = walmartUrl;
    link.target = "_blank";
    link.rel = "noopener noreferrer nofollow";
    link.click();
  };

  const handleCardClick = () => {
    console.log("Card clicked - opening modal");
    setIsModalOpen(true);
  };

  const handleViewDetailsClick = () => {
    console.log("View details clicked - opening popup");
    setShowViewDetailsPopup(true);
  };


  const scrollToProduct = () => {
    document
      .getElementById("product-section")
      ?.scrollIntoView({ behavior: "smooth" });
  };

  const nextImage = () => {
    if (!adminData) return;
    setCurrentImageIndex(
      (prev) => (prev + 1) % adminData.hero.productImages.length,
    );
  };

  const prevImage = () => {
    if (!adminData) return;
    setCurrentImageIndex(
      (prev) =>
        (prev - 1 + adminData.hero.productImages.length) %
        adminData.hero.productImages.length,
    );
  };

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsModalOpen(false);
    };
    if (isModalOpen) {
      document.addEventListener("keydown", handleEsc);
      return () => document.removeEventListener("keydown", handleEsc);
    }
  }, [isModalOpen]);

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-lg text-gray-600">Loading content...</p>
          <p className="text-sm text-gray-500 mt-2">
            Setting up real-time updates...
          </p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-pink-100">
        <div className="text-center p-8 bg-white rounded-lg shadow-lg max-w-md">
          <div className="text-red-500 text-xl mb-4">
            ⚠️ Error Loading Content
          </div>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors"
          >
            Reload Page
          </button>
        </div>
      </div>
    );
  }

  // Show no data state
  if (!adminData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center">
          <p className="text-lg text-gray-600">No content available</p>
          <p className="text-sm text-gray-500 mt-2">
            Please check your connection and try again
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 relative overflow-hidden">
        {/* Floating Snack Animations */}
        <FloatingSnacks />

        {/* Professional Hero Section */}
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8"
        >
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
              {/* Left Column - Content */}
              <div>
                <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 sm:mb-6 leading-tight">
                  {adminData.hero.title}
                </h1>

                {/* Rating */}
                <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 sm:h-5 sm:w-5 ${i < Math.floor(adminData.hero.rating) ? "text-yellow-400 fill-current" : "text-gray-300"}`}
                      />
                    ))}
                  </div>
                  <span className="text-base sm:text-lg font-semibold text-gray-700">
                    {adminData.hero.rating} ⭐
                  </span>
                  <span className="text-sm sm:text-base text-gray-600">
                    from {adminData.hero.reviewCount} reviews
                  </span>
                </div>

                {/* Price Section */}
                <div className="mb-6 sm:mb-8 p-4 sm:p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border border-blue-200">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 mb-3 sm:mb-4">
                    <PricingDisplay
                      salePrice={adminData.hero.salePrice}
                      size="lg"
                      className="[&>div:first-child]:flex-col sm:[&>div:first-child]:flex-row [&>div:first-child]:items-start sm:[&>div:first-child]:items-center [&>div:first-child]:gap-2 sm:[&>div:first-child]:gap-3"
                    />
                    <div className="flex flex-col">
                      <span className="text-xs sm:text-sm text-green-600 font-medium">
                        {adminData.hero.subscribeText}
                      </span>
                      <span className="text-xs sm:text-sm text-blue-600 font-medium">
                        {adminData.hero.walmartText}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Urgency/Delivery Section */}
                <div className="mb-6 sm:mb-8 p-3 sm:p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                    <div className="flex items-center gap-2">
                      <Truck className="h-4 w-4 sm:h-5 sm:w-5 text-green-600" />
                      <span className="text-sm sm:text-base font-semibold text-green-800">
                        Arrives by {adminData.hero.deliveryDate}
                      </span>
                    </div>
                    <span className="text-sm sm:text-base text-red-600 font-medium sm:ml-auto">
                      {adminData.hero.stockText}
                    </span>
                  </div>
                </div>

                {/* Primary CTA */}
                <Button
                  onClick={handleCardClick}
                  size="lg"
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-3 sm:py-4 text-lg sm:text-xl font-bold rounded-2xl shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300 mb-3 sm:mb-4 touch-manipulation"
                >
                  {adminData.hero.primaryButtonText}
                  <ShoppingCart className="ml-2 sm:ml-3 h-5 w-5 sm:h-6 sm:w-6" />
                </Button>

                <Button
                  onClick={scrollToProduct}
                  variant="outline"
                  size="lg"
                  className="w-full py-3 sm:py-4 text-base sm:text-lg font-semibold rounded-2xl border-2 border-blue-600 text-blue-600 hover:bg-blue-50 touch-manipulation"
                >
                  {adminData.hero.secondaryButtonText}
                </Button>

              </div>

              {/* Right Column - Product Image */}
              <div className="relative">
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.4, duration: 1 }}
                  whileHover={{ scale: 1.05 }}
                  className="relative"
                >
                  <div className="backdrop-blur-xl bg-white/20 rounded-3xl p-8 shadow-2xl border border-white/30">
                    {adminData.hero.productImages[0] && (
                      <img
                        src={adminData.hero.productImages[0]}
                        alt={adminData.hero.title}
                        className="w-full h-auto rounded-2xl shadow-lg"
                        loading="eager"
                      />
                    )}
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Benefits Section */}
        <motion.section
          id="product-section"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="relative z-10 py-12 sm:py-16 lg:py-20 bg-gradient-to-r from-gray-50 to-slate-50 px-4 sm:px-6 lg:px-8"
        >
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center text-gray-900 mb-8 sm:mb-12 lg:mb-16">
              {adminData.featuresSection.title}
            </h2>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {adminData.featuresSection.features.map((feature, index) => {
                const IconComponent = iconMap[feature.icon] || Package;

                return (
                  <motion.div
                    key={feature.id}
                    whileHover={{ scale: 1.02 }}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.6 }}
                    className="relative bg-white rounded-2xl shadow-lg border-2 hover:shadow-2xl transition-all duration-500 overflow-hidden"
                    style={{ borderColor: "#007BFF" }}
                  >
                    {/* Product Image */}
                    <div className="relative h-64 group overflow-hidden">
                      <img
                        src={feature.image}
                        alt={feature.title}
                        className="w-full h-full object-cover transition-all duration-500 group-hover:scale-110"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-25 transition-all duration-500"></div>

                      {/* Icon positioned in top-right corner on image */}
                      <div className="absolute top-4 right-4 bg-white bg-opacity-90 backdrop-blur-sm rounded-full w-12 h-12 flex items-center justify-center shadow-lg z-10">
                        <IconComponent
                          className={`h-6 w-6 ${
                            feature.color === "blue"
                              ? "text-blue-600"
                              : feature.color === "purple"
                                ? "text-purple-600"
                                : feature.color === "green"
                                  ? "text-green-600"
                                  : feature.color === "orange"
                                    ? "text-orange-600"
                                    : feature.color === "red"
                                      ? "text-red-600"
                                      : "text-indigo-600"
                          }`}
                        />
                      </div>
                    </div>

                    {/* Text content at bottom */}
                    <div className="p-6 text-center">
                      <h3 className="text-lg font-semibold text-gray-900 mb-3 leading-tight">
                        {feature.title}
                      </h3>
                      <p className="text-gray-600 leading-relaxed text-sm">
                        {feature.description}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* CTA after Benefits */}
            <div className="text-center mt-8 sm:mt-12">
              <Button
                onClick={handleCardClick}
                size="lg"
                className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-bold rounded-2xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 touch-manipulation"
              >
                {adminData.hero.primaryButtonText}
                <ShoppingCart className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
              </Button>
            </div>
          </div>
        </motion.section>

        {/* Trust Section */}
        <motion.section
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="relative z-10 py-20 px-4 sm:px-6 lg:px-8"
        >
          <div className="max-w-6xl mx-auto">
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-3xl p-8 shadow-2xl text-white">
              <div className="grid md:grid-cols-3 gap-8 items-center">
                {/* Walmart Logo & Trust */}
                <div className="text-center">
                  <div className="bg-white rounded-xl p-4 mb-4 inline-block">
                    <div className="text-blue-600 font-bold text-2xl">
                      Walmart
                    </div>
                  </div>
                  <h3 className="text-xl font-bold mb-2">
                    Official Walmart Seller
                  </h3>
                  <p className="text-blue-100">
                    Secure checkout and fast delivery
                  </p>
                </div>

                {/* Seller Rating */}
                <div className="text-center">
                  <div className="bg-white/20 backdrop-blur rounded-xl p-6">
                    <h3 className="text-2xl font-bold mb-2">Pro Seller</h3>
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <div className="flex">
                        {[...Array(4)].map((_, i) => (
                          <Star
                            key={i}
                            className="h-5 w-5 text-yellow-400 fill-current"
                          />
                        ))}
                        <Star className="h-5 w-5 text-yellow-400" />
                      </div>
                      <span className="font-semibold">
                        {adminData.trust.sellerRating}
                      </span>
                    </div>
                    <p className="text-blue-100">
                      from {adminData.trust.sellerReviewCount} reviews
                    </p>
                  </div>
                </div>

                {/* Returns Policy */}
                <div className="text-center">
                  <div className="bg-green-500 rounded-full p-4 mb-4 inline-block">
                    <Shield className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">
                    Free {adminData.trust.returnsDays}-Day Returns
                  </h3>
                  <p className="text-blue-100">{adminData.trust.returnsText}</p>
                </div>
              </div>

              {/* CTA after Trust */}
              <div className="text-center mt-8">
                <Button
                  onClick={handleCardClick}
                  size="lg"
                  className="bg-white text-blue-600 hover:bg-gray-50 px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-bold rounded-2xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 touch-manipulation"
                >
                  {adminData.hero.primaryButtonText}
                  <ShoppingCart className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
                </Button>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Visual Gallery Section */}
        <motion.section
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="relative z-10 py-20 bg-gradient-to-r from-gray-50 to-slate-50 px-4 sm:px-6 lg:px-8"
        >
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-bold text-center text-gray-900 mb-16">
              {adminData.gallery.title}
            </h2>

            <div className="grid md:grid-cols-3 gap-8">
              {adminData.gallery.images.map((image, index) => (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.05 }}
                  onClick={handleCardClick}
                  className="group relative overflow-hidden rounded-2xl shadow-xl cursor-pointer"
                >
                  <img
                    src={image.url}
                    alt={image.title}
                    className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                  <div className="absolute bottom-4 left-4 text-white">
                    <h3 className="font-semibold text-lg">{image.title}</h3>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* CTA after Gallery */}
            <div className="text-center mt-8 sm:mt-12">
              <Button
                onClick={handleCardClick}
                size="lg"
                className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-bold rounded-2xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 touch-manipulation"
              >
                {adminData.hero.primaryButtonText}
                <ShoppingCart className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
              </Button>
            </div>
          </div>
        </motion.section>

        {/* Customer Reviews Section */}
        <CustomerReviews />

        {/* Final CTA Section */}
        <motion.section
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
          viewport={{ once: true }}
          className="relative z-10 py-16 sm:py-20 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 px-4 sm:px-6 lg:px-8"
        >
          <div className="max-w-6xl mx-auto">
            {/* Header Section */}
            <div className="text-center mb-12">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="inline-flex items-center gap-2 bg-orange-100 text-orange-700 px-4 py-2 rounded-full text-sm font-semibold mb-4"
              >
                <span>🔥</span>
                <span>Bestseller - Limited Time Offer</span>
              </motion.div>

              <motion.h2
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-4 leading-tight"
              >
                Ready to Fuel Your Day?
              </motion.h2>

              <motion.p
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.8 }}
                className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto"
              >
                Get your 42-count nutritious snack box today!
              </motion.p>
            </div>

            {/* Main Content Grid */}
            <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
              {/* Product Image */}
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 1 }}
                className="text-center lg:text-left"
              >
                {adminData.hero.productImages[0] && (
                  <img
                    src={adminData.hero.productImages[0]}
                    alt="Nutritious Snack Box"
                    className="w-full max-w-md mx-auto lg:mx-0 rounded-2xl shadow-2xl"
                    loading="lazy"
                  />
                )}
              </motion.div>

              {/* Pricing and CTA */}
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 1.2 }}
                className="text-center lg:text-left"
              >
                {/* Enhanced Pricing Card */}
                <div className="bg-white rounded-3xl shadow-2xl border-2 border-blue-200 p-8 mb-8 hover:shadow-3xl transition-all duration-300">
                  {/* Price at Top */}
                  <div className="text-center mb-6">
                    <PricingDisplay
                      salePrice={adminData.hero.salePrice}
                      size="lg"
                      className="[&>div:first-child>span:last-child]:text-4xl sm:[&>div:first-child>span:last-child]:text-5xl [&>div:first-child>span:last-child]:font-bold [&>div:first-child>span:last-child]:text-green-600"
                    />
                  </div>

                  {/* Benefits with Checkmarks */}
                  <div className="space-y-3">
                    {[
                      "42 premium snacks included",
                      "Subscribe & Save available",
                      `Free ${adminData.trust.returnsDays}-day returns`,
                      `Arrives by ${adminData.hero.deliveryDate}`,
                      "Beautiful gift packaging",
                      "Greeting card included",
                    ].map((benefit, index) => (
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

                {/* Enhanced CTA Button */}
                <Button
                  onClick={handleCardClick}
                  size="lg"
                  className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-8 py-6 text-xl font-bold rounded-2xl shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300 touch-manipulation mb-6"
                >
                  Get Your Snack Box Now
                  <ShoppingCart className="ml-3 h-6 w-6" />
                </Button>

                {/* Trust Bar */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <Shield className="h-5 w-5 text-green-600" />
                    <span className="font-medium">Secure Payment</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Truck className="h-5 w-5 text-blue-600" />
                    <span className="font-medium">Fast Shipping</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <BadgeCheck className="h-5 w-5 text-purple-600" />
                    <span className="font-medium">Satisfaction Guaranteed</span>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.section>

        {/* Admin Access Button - Fixed position */}
        <div className="fixed bottom-4 left-4 z-50">
          <Button
            onClick={() => (window.location.href = "/admin")}
            variant="outline"
            size="sm"
            className="bg-white/90 backdrop-blur border-gray-300 text-gray-700 hover:bg-white shadow-lg"
          >
            🔧 Admin
          </Button>
        </div>

        {/* Simple Footer */}
        <footer className="bg-slate-800 py-8">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-center items-center gap-8">
              {/* Social Media Icons */}
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transform hover:scale-110 transition-all duration-300"
                aria-label="Follow us on Facebook"
              >
                <Facebook className="h-8 w-8" />
              </a>

              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-pink-400 transform hover:scale-110 transition-all duration-300"
                aria-label="Follow us on Instagram"
              >
                <Instagram className="h-8 w-8" />
              </a>

              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-blue-400 transform hover:scale-110 transition-all duration-300"
                aria-label="Follow us on Twitter"
              >
                <Twitter className="h-8 w-8" />
              </a>

              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-red-400 transform hover:scale-110 transition-all duration-300"
                aria-label="Subscribe to our YouTube channel"
              >
                <Youtube className="h-8 w-8" />
              </a>
            </div>
          </div>
        </footer>

        {/* Enhanced Product Modal */}
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogPortal>
            <DialogOverlay />
            <DialogPrimitive.Content className="fixed inset-4 z-[1001] mx-auto my-auto w-auto h-auto max-w-[calc(100vw-2rem)] max-h-[calc(100vh-2rem)] sm:inset-auto sm:left-1/2 sm:top-1/2 sm:w-full sm:max-w-[640px] sm:h-[90vh] sm:max-h-[800px] sm:translate-x-[-50%] sm:translate-y-[-50%] bg-white border-0 rounded-2xl sm:rounded-2xl shadow-2xl p-0 overflow-hidden data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 duration-200">
              <DialogPrimitive.Close className="absolute right-3 top-3 z-50 p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors shadow-md sm:hidden">
                <X className="h-5 w-5 text-gray-600" />
                <span className="sr-only">Close</span>
              </DialogPrimitive.Close>
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="h-full flex flex-col"
              >
                {/* HEADER - Fixed at top */}
                <div className="relative flex-shrink-0 bg-white border-b border-gray-200 p-3 sm:p-6">
                  <DialogHeader>
                    <DialogTitle className="text-lg sm:text-2xl font-bold text-gray-900 leading-tight pr-10 sm:pr-12">
                      {adminData.hero.title}
                    </DialogTitle>
                    <DialogDescription className="text-sm sm:text-sm text-gray-600 mt-2 pr-8 sm:pr-0">
                      View detailed product information, pricing, and purchase
                      options for this 42-piece snack collection.
                    </DialogDescription>
                  </DialogHeader>

                  {/* Close Button - Desktop only */}
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="hidden sm:block absolute top-4 right-4 p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors z-10 shadow-sm"
                    aria-label="Close modal"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>

                {/* BODY - Scrollable content */}
                <div
                  className="flex-1 overflow-y-auto px-3 py-4 sm:p-6"
                  style={{
                    maxHeight: "calc(100vh - 180px - 140px)",
                    WebkitOverflowScrolling: "touch",
                  }}
                >
                  {/* Product Image */}
                  <div className="relative mb-4 sm:mb-6">
                    <div className="relative overflow-hidden rounded-xl shadow-lg bg-gray-50 mx-auto max-w-[280px] sm:max-w-none">
                      {adminData.hero.productImages[currentImageIndex] && (
                        <img
                          src={adminData.hero.productImages[currentImageIndex]}
                          alt={adminData.hero.title}
                          className="w-full h-40 sm:h-64 object-contain"
                          loading="lazy"
                        />
                      )}
                    </div>

                    {adminData.hero.productImages.length > 1 && (
                      <>
                        <button
                          onClick={prevImage}
                          className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/90 rounded-full p-2 shadow-md hover:bg-white touch-manipulation"
                          aria-label="Previous image"
                        >
                          <ChevronLeft className="h-4 w-4" />
                        </button>
                        <button
                          onClick={nextImage}
                          className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/90 rounded-full p-2 shadow-md hover:bg-white touch-manipulation"
                        >
                          <ChevronRight className="h-4 w-4" />
                        </button>
                      </>
                    )}
                  </div>

                  {/* Rating */}
                  <div className="flex items-center justify-center sm:justify-start mb-4">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 sm:h-4 sm:w-4 ${i < Math.floor(adminData.hero.rating) ? "text-yellow-400 fill-current" : "text-gray-300"}`}
                        />
                      ))}
                    </div>
                    <span className="ml-2 text-sm sm:text-sm text-gray-700 font-medium">
                      {adminData.hero.rating} ⭐ ({adminData.hero.reviewCount}{" "}
                      reviews)
                    </span>
                  </div>

                  {/* Pricing Section */}
                  <div className="mb-4 p-3 sm:p-4 bg-blue-50 rounded-xl border border-blue-200">
                    <PricingDisplay
                      salePrice={adminData.hero.salePrice}
                      size="lg"
                      className="mb-2"
                    />
                    <div className="text-sm text-green-600 font-medium">
                      ✓ Subscribe & Save available
                    </div>
                    <div className="text-sm text-blue-600 font-medium">
                      ✓ Walmart+ offer eligible
                    </div>
                  </div>

                  {/* Pieces Count */}
                  <div className="mb-4 p-3 sm:p-4 bg-gray-50 rounded-xl">
                    <div className="flex items-center justify-center sm:justify-start gap-2">
                      <span className="font-semibold text-gray-900 text-sm sm:text-base">
                        Pieces Count:
                      </span>
                      <span className="text-lg font-bold text-blue-600">
                        42 Items
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1 text-center sm:text-left">
                      Perfect variety for extended enjoyment
                    </p>
                  </div>

                  {/* More Details Section */}
                  <div className="mb-4 sm:mb-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-3 text-center sm:text-left">
                      More Details
                    </h3>
                    <div className="space-y-2">
                      {[
                        "Ultimate snack experience in a beautifully designed high-end packaging box",
                        "Packed with a variety of breakfast bars and savory snacks for daily energy",
                        "Individually packaged snacks for convenient grab-and-go options",
                        "Ideal for adults, teens, and college students alike",
                        "Arrives with a heartwarming greeting card for a personal touch",
                      ].map((detail, index) => (
                        <div
                          key={index}
                          className="flex items-start gap-2 sm:gap-3"
                        >
                          <div className="bg-green-100 rounded-full p-1 mt-0.5 flex-shrink-0">
                            <Check className="h-3 w-3 text-green-600" />
                          </div>
                          <p className="text-gray-700 leading-relaxed text-sm">
                            {detail}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* FOOTER - Fixed at bottom */}
                <div className="flex-shrink-0 bg-white border-t border-gray-200 p-3 sm:p-6 sticky bottom-0 z-10 shadow-lg sm:shadow-none">
                  <div className="space-y-2 sm:space-y-3">
                    <Button
                      onClick={() => {
                        setIsModalOpen(false);
                        handleProceedToWalmart();
                      }}
                      size="lg"
                      className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-3 sm:py-4 text-base sm:text-lg font-bold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 touch-manipulation"
                    >
                      Buy Now on Walmart
                      <ShoppingCart className="ml-2 h-5 w-5" />
                    </Button>

                    <Button
                      onClick={() => setIsModalOpen(false)}
                      variant="outline"
                      size="lg"
                      className="w-full py-2 sm:py-3 text-sm sm:text-base font-semibold rounded-xl touch-manipulation border-2"
                    >
                      Continue Browsing
                    </Button>
                  </div>
                </div>
              </motion.div>
            </DialogPrimitive.Content>
          </DialogPortal>
        </Dialog>


        {/* Sticky CTA for Mobile */}
        <StickyCTA onClick={handleCardClick} />

        {/* Exit Intent Popup */}
        {showExitIntent && (
          <ExitIntentPopup
            onClose={handleCloseExitIntent}
            onSubscribe={handleSubscribe}
            title={
              adminData.popups.find((p) => p.type === "exit-intent")?.title
            }
            description={
              adminData.popups.find((p) => p.type === "exit-intent")
                ?.description
            }
            buttonText={
              adminData.popups.find((p) => p.type === "exit-intent")?.buttonText
            }
            buttonLink={
              adminData.popups.find((p) => p.type === "exit-intent")?.buttonLink
            }
            image={
              adminData.popups.find((p) => p.type === "exit-intent")?.image
            }
          />
        )}

        {/* Real-time Update Notification */}
        <RealtimeUpdateNotification
          show={updateReceived}
          onHide={clearUpdateNotification}
        />
      </div>

      {/* Enhanced Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org/",
            "@type": "Product",
            name: adminData.hero.title,
            brand: {
              "@type": "Brand",
              name: "Gift-A-Snack",
            },
            image: adminData.hero.productImages,
            description: adminData.seo.metaDescription,
            sku: "GAS-42-NUTRITIOUS",
            aggregateRating: {
              "@type": "AggregateRating",
              ratingValue: adminData.hero.rating.toString(),
              reviewCount: adminData.hero.reviewCount.toString(),
              bestRating: "5",
              worstRating: "1",
            },
            offers: {
              "@type": "Offer",
              url: walmartUrl,
              priceCurrency: "USD",
              price: adminData.hero.salePrice.toString(),
              availability: "https://schema.org/InStock",
              seller: {
                "@type": "Organization",
                name: "Walmart",
                url: "https://www.walmart.com",
              },
            },
          }),
        }}
      />
    </>
  );
}
