import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Mail, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ExitIntentPopupProps {
  onClose: () => void;
  onSubscribe: (email?: string) => void;
  title?: string;
  description?: string;
  buttonText?: string;
  buttonLink?: string;
  image?: string;
}

export function ExitIntentPopup({
  onClose,
  onSubscribe,
  title = "👉 Subscribe now to be the first to know about our upcoming exclusive offers",
  description = "👉 Join our mailing list and get the latest news and special deals before anyone else.",
  buttonText = "👉 Subscribe Now",
  buttonLink,
  image,
}: ExitIntentPopupProps) {
  const [email, setEmail] = useState("");
  const [isEmailValid, setIsEmailValid] = useState(false);

  // Email validation
  useEffect(() => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    setIsEmailValid(emailRegex.test(email));
  }, [email]);

  const handleSubscribe = () => {
    if (email.trim() && isEmailValid) {
      onSubscribe(email);
    } else if (buttonLink) {
      // If no email validation needed, just redirect to the link
      window.open(buttonLink, "_blank");
      onClose();
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          onClick={onClose}
        />

        {/* Popup Content */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ duration: 0.3 }}
          className="relative bg-white rounded-3xl shadow-2xl max-w-md w-full mx-auto overflow-hidden"
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
            aria-label="Close popup"
          >
            <X className="h-5 w-5 text-gray-600" />
          </button>

          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 pb-4">
            <div className="flex items-center justify-center gap-2 mb-3">
              <Bell className="h-5 w-5 text-blue-200" />
              <span className="text-sm font-semibold uppercase tracking-wide">
                Stay Updated
              </span>
            </div>

            <h2 className="text-xl md:text-2xl font-bold text-center mb-2 leading-tight">
              {title}
            </h2>
          </div>

          {/* Main Content */}
          <div className="p-6">
            {/* Image */}
            {image && (
              <div className="text-center mb-4">
                <img
                  src={image}
                  alt="Popup Image"
                  className="w-20 h-20 object-cover rounded-full mx-auto shadow-lg"
                />
              </div>
            )}

            {/* Subtext */}
            <div className="text-center mb-6">
              <p className="text-gray-600 text-base leading-relaxed">
                {description}
              </p>
            </div>

            {/* Email Input */}
            <div className="mb-6">
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="👉 Enter your email here"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                />
              </div>
              {email && !isEmailValid && (
                <p className="text-red-500 text-xs mt-1">
                  Please enter a valid email address
                </p>
              )}
            </div>

            {/* CTA Button */}
            <div className="space-y-4">
              <Button
                onClick={handleSubscribe}
                disabled={!buttonLink && (!email || !isEmailValid)}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-4 text-lg font-bold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
              >
                <Bell className="mr-2 h-5 w-5" />
                {buttonText}
              </Button>

              <button
                onClick={onClose}
                className="w-full text-gray-500 hover:text-gray-700 text-sm font-medium py-2 transition-colors"
              >
                Maybe later
              </button>
            </div>

            {/* Trust Note */}
            <div className="mt-6 pt-4 border-t border-gray-100">
              <div className="text-center">
                <p className="text-xs text-gray-500">
                  👉 🔒 We will never send you spam. You can unsubscribe
                  anytime.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
