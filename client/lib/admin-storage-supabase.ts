import {
  getSupabaseAdminData,
  saveSupabaseAdminData,
  saveSupabaseSection,
  checkSupabaseConnection,
  migrateLocalStorageToSupabase,
} from "./supabase-admin";

// Re-export types from the original admin-storage
export type {
  SeoData,
  HeroData,
  FeatureData,
  TrustData,
  GalleryData,
  ReviewData,
  ReviewsData,
  FinalCtaData,
  FooterData,
  PopupData,
  AdminData,
} from "./admin-storage";

import { defaultAdminData, type AdminData } from "./admin-storage";

// Track connection status
let connectionChecked = false;
let isConnected = false;

// Check Supabase connection
async function ensureConnection(): Promise<boolean> {
  if (connectionChecked) return isConnected;

  try {
    console.log("Checking Supabase connection...");
    isConnected = await checkSupabaseConnection();
    connectionChecked = true;

    if (isConnected) {
      console.log("Supabase connected successfully");
      // Try to migrate localStorage data if connection is working
      try {
        await migrateLocalStorageToSupabase();
      } catch (migrationError) {
        console.warn(
          "Data migration failed, but continuing with Supabase:",
          migrationError,
        );
      }
    } else {
      console.warn(
        "Supabase connection failed, will use localStorage fallback",
      );
    }

    return isConnected;
  } catch (error) {
    console.error("Supabase connection check error:", error);
    connectionChecked = true;
    isConnected = false;
    return false;
  }
}

// Get admin data with fallback to localStorage
export async function getAdminData(): Promise<AdminData> {
  try {
    const connected = await ensureConnection();

    if (!connected) {
      console.warn("Supabase not connected, using localStorage");
      return getLocalStorageData();
    }

    // Try to get data from Supabase
    const supabaseData = await getSupabaseAdminData();

    if (supabaseData) {
      // Merge with defaults to ensure all fields exist
      return {
        ...defaultAdminData,
        ...supabaseData,
        seo: { ...defaultAdminData.seo, ...supabaseData.seo },
        hero: { ...defaultAdminData.hero, ...supabaseData.hero },
        featuresSection: {
          ...defaultAdminData.featuresSection,
          ...supabaseData.featuresSection,
          features:
            supabaseData.featuresSection?.features ||
            defaultAdminData.featuresSection.features,
        },
        trust: { ...defaultAdminData.trust, ...supabaseData.trust },
        gallery: { ...defaultAdminData.gallery, ...supabaseData.gallery },
        reviews: {
          ...defaultAdminData.reviews,
          ...supabaseData.reviews,
          reviews:
            supabaseData.reviews?.reviews || defaultAdminData.reviews.reviews,
        },
        finalCta: {
          ...defaultAdminData.finalCta,
          ...supabaseData.finalCta,
          benefits:
            supabaseData.finalCta?.benefits ||
            defaultAdminData.finalCta.benefits,
          trustBarItems:
            supabaseData.finalCta?.trustBarItems ||
            defaultAdminData.finalCta.trustBarItems,
        },
        footer: {
          ...defaultAdminData.footer,
          ...supabaseData.footer,
          socialLinks:
            supabaseData.footer?.socialLinks ||
            defaultAdminData.footer.socialLinks,
        },
        lastUpdated: supabaseData.lastUpdated || new Date().toISOString(),
      };
    } else {
      // Fallback to localStorage if Supabase data not found
      console.log("No Supabase data found, using localStorage fallback");
      return getLocalStorageData();
    }
  } catch (error) {
    console.error(
      "Error fetching admin data:",
      error instanceof Error ? error.message : error,
    );
    return getLocalStorageData();
  }
}

// Fallback to localStorage
function getLocalStorageData(): AdminData {
  try {
    const stored = localStorage.getItem("snackbox_admin_data");
    if (stored) {
      const parsed = JSON.parse(stored);
      return {
        ...defaultAdminData,
        ...parsed,
        seo: { ...defaultAdminData.seo, ...parsed.seo },
        hero: { ...defaultAdminData.hero, ...parsed.hero },
        featuresSection: {
          ...defaultAdminData.featuresSection,
          ...parsed.featuresSection,
        },
        trust: { ...defaultAdminData.trust, ...parsed.trust },
        gallery: { ...defaultAdminData.gallery, ...parsed.gallery },
        reviews: { ...defaultAdminData.reviews, ...parsed.reviews },
        finalCta: { ...defaultAdminData.finalCta, ...parsed.finalCta },
        footer: { ...defaultAdminData.footer, ...parsed.footer },
      };
    }
  } catch (error) {
    console.error("Error loading admin data from localStorage:", error);
  }
  return defaultAdminData;
}

// Save admin data with fallback to localStorage
export async function saveAdminData(data: Partial<AdminData>): Promise<void> {
  try {
    const connected = await ensureConnection();

    if (!connected) {
      console.warn("Supabase not connected, saving to localStorage");
      saveToLocalStorage(data);
      return;
    }

    // Save to Supabase
    const success = await saveSupabaseAdminData(data);

    if (!success) {
      console.warn("Failed to save to Supabase, falling back to localStorage");
      saveToLocalStorage(data);
      throw new Error("Failed to save to Supabase");
    }

    console.log("Successfully saved data to Supabase");
  } catch (error) {
    console.error(
      "Error saving admin data:",
      error instanceof Error ? error.message : error,
    );
    // Fallback to localStorage
    saveToLocalStorage(data);
    throw new Error("Failed to save data");
  }
}

// Save to localStorage as fallback
function saveToLocalStorage(data: Partial<AdminData>): void {
  try {
    const current = getLocalStorageData();
    const updated = {
      ...current,
      ...data,
      lastUpdated: new Date().toISOString(),
    };
    localStorage.setItem("snackbox_admin_data", JSON.stringify(updated));
  } catch (error) {
    console.error(
      "Error saving to localStorage:",
      error instanceof Error ? error.message : error,
    );
  }
}

// Save specific section
export async function saveSection<K extends keyof AdminData>(
  section: K,
  data: AdminData[K],
): Promise<void> {
  try {
    const connected = await ensureConnection();

    if (!connected) {
      console.warn("Supabase not connected, saving to localStorage");
      saveToLocalStorage({ [section]: data } as Partial<AdminData>);
      return;
    }

    // Save to Supabase
    const success = await saveSupabaseSection(section, data);

    if (!success) {
      console.warn(
        "Failed to save section to Supabase, falling back to localStorage",
      );
      saveToLocalStorage({ [section]: data } as Partial<AdminData>);
      throw new Error("Failed to save section to Supabase");
    }

    console.log(`Successfully saved ${section} to Supabase`);
  } catch (error) {
    console.error(
      `Error saving section ${section}:`,
      error instanceof Error ? error.message : error,
    );
    // Fallback to localStorage
    saveToLocalStorage({ [section]: data } as Partial<AdminData>);
    throw new Error("Failed to save section");
  }
}

// Reset to defaults (for development)
export function resetAdminData(): void {
  localStorage.removeItem("snackbox_admin_data");
  // Note: This doesn't clear Supabase data - would need admin endpoint for that
}

// Check if data exists
export function hasAdminData(): boolean {
  return localStorage.getItem("snackbox_admin_data") !== null;
}

// Manual migration function (for development)
export async function migrateToSupabase(): Promise<boolean> {
  return await migrateLocalStorageToSupabase();
}
