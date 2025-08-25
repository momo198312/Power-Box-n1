import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, Wifi } from "lucide-react";

interface RealtimeUpdateNotificationProps {
  show: boolean;
  onHide: () => void;
}

export function RealtimeUpdateNotification({
  show,
  onHide,
}: RealtimeUpdateNotificationProps) {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        onHide();
      }, 3000); // Hide after 3 seconds

      return () => clearTimeout(timer);
    }
  }, [show, onHide]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: -50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -50, scale: 0.9 }}
          transition={{ duration: 0.3 }}
          className="fixed top-4 right-4 z-[9999] bg-green-600 text-white px-4 py-3 rounded-lg shadow-lg max-w-sm"
        >
          <div className="flex items-center gap-3">
            <div className="flex-shrink-0">
              <CheckCircle className="h-5 w-5" />
            </div>
            <div>
              <div className="font-medium text-sm">Content Updated</div>
              <div className="text-xs text-green-100 flex items-center gap-1 mt-1">
                <Wifi className="h-3 w-3" />
                <span>Real-time sync active</span>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
