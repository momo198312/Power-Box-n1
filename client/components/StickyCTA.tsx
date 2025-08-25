import { motion } from "framer-motion";
import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";

interface StickyCTAProps {
  onClick: () => void;
}

export function StickyCTA({ onClick }: StickyCTAProps) {
  return (
    <motion.div
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      className="fixed bottom-4 left-4 right-4 z-50 md:left-auto md:right-4 md:bottom-4 md:w-auto"
    >
      {/* Mobile: Full width bottom bar */}
      <div className="md:hidden">
        <div className="bg-gradient-to-t from-white via-white/95 to-transparent backdrop-blur-sm p-4 rounded-t-2xl">
          <Button
            onClick={onClick}
            size="lg"
            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-4 text-lg font-bold rounded-2xl shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300"
          >
            View Product Details
            <ShoppingCart className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Desktop: Floating button */}
      <div className="hidden md:block">
        <Button
          onClick={onClick}
          size="lg"
          className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-3 font-bold rounded-full shadow-2xl hover:shadow-3xl transform hover:scale-110 transition-all duration-300"
        >
          <ShoppingCart className="mr-2 h-5 w-5" />
          Quick View
        </Button>
      </div>
    </motion.div>
  );
}
