import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { getAdminData, type AdminData } from "@/lib/admin-storage-supabase";

export function useRealtimeAdminData() {
  const [adminData, setAdminData] = useState<AdminData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updateReceived, setUpdateReceived] = useState(false);

  useEffect(() => {
    let mounted = true;

    // Initial load
    const loadInitialData = async () => {
      try {
        setIsLoading(true);
        const data = await getAdminData();
        if (mounted) {
          setAdminData(data);
          setError(null);
        }
      } catch (err) {
        console.error("Error loading admin data:", err);
        if (mounted) {
          setError(err instanceof Error ? err.message : "Failed to load data");
        }
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    loadInitialData();

    // Set up real-time subscription
    const channel = supabase
      .channel("admin_content_changes")
      .on(
        "postgres_changes",
        {
          event: "*", // Listen to all events (INSERT, UPDATE, DELETE)
          schema: "public",
          table: "admin_content",
        },
        async (payload) => {
          console.log("Real-time update detected:", payload);

          try {
            // Reload all admin data when any change occurs
            const updatedData = await getAdminData();
            if (mounted) {
              setAdminData(updatedData);
              setUpdateReceived(true); // Trigger notification
              console.log("Admin data updated via real-time subscription");
            }
          } catch (err) {
            console.error("Error refreshing data after real-time update:", err);
            if (mounted) {
              setError(
                err instanceof Error ? err.message : "Failed to refresh data",
              );
            }
          }
        },
      )
      .subscribe((status) => {
        console.log("Real-time subscription status:", status);
      });

    // Cleanup function
    return () => {
      mounted = false;
      supabase.removeChannel(channel);
    };
  }, []);

  const refreshData = async () => {
    try {
      setIsLoading(true);
      const data = await getAdminData();
      setAdminData(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to refresh data");
    } finally {
      setIsLoading(false);
    }
  };

  const clearUpdateNotification = () => {
    setUpdateReceived(false);
  };

  return {
    adminData,
    isLoading,
    error,
    updateReceived,
    refreshData,
    clearUpdateNotification,
  };
}
