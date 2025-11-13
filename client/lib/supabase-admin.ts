import { supabase } from "./supabase";
import type { AdminData } from "./admin-storage";

// Check if Supabase is properly configured
export async function checkSupabaseConnection(): Promise<boolean> {
  try {
    // Simple test to see if we can connect to Supabase
    const { error } = await supabase
      .from("admin_content")
      .select("count")
      .limit(1);

    if (error) {
      console.error("Supabase connection error:", error);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Supabase connection test failed:", error);
    return false;
  }
}

// Upload image to Supabase Storage with improved error handling
export async function uploadImage(
  file: File,
  path: string,
): Promise<string | null> {
  try {
    console.log(
      "Starting upload for file:",
      file.name,
      "size:",
      file.size,
      "type:",
      file.type,
    );

    // Validate file type
    if (!file.type.startsWith("image/")) {
      throw new Error("File must be an image");
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      throw new Error("File size must be less than 5MB");
    }

    const fileExt = file.name.split(".").pop()?.toLowerCase();
    if (!fileExt || !["jpg", "jpeg", "png", "gif", "webp"].includes(fileExt)) {
      throw new Error("Unsupported file format. Use JPG, PNG, GIF, or WebP");
    }

    const fileName = `${path}.${fileExt}`;
    console.log("Generated filename:", fileName);

    // Try to upload with upsert to replace existing files
    const { data, error } = await supabase.storage
      .from("images")
      .upload(fileName, file, {
        cacheControl: "public, max-age=3600", // 1 hour cache
        upsert: true, // Replace existing files
      });

    if (error) {
      console.error("Supabase upload error:", error);
      console.error("Error details:", {
        message: error.message,
        statusCode: error.statusCode,
        error: error,
      });

      // Provide specific error messages
      if (error.message.includes("The resource already exists")) {
        // Try with a different filename
        const uniqueFileName = `${path}_${Date.now()}.${fileExt}`;
        return uploadImage(file, uniqueFileName.replace(`.${fileExt}`, ""));
      }

      throw new Error(`Upload failed: ${error.message}`);
    }

    console.log("Upload successful, data:", data);

    // Get public URL with cache busting
    const { data: urlData } = supabase.storage
      .from("images")
      .getPublicUrl(data.path);

    if (!urlData.publicUrl) {
      throw new Error("Failed to generate public URL");
    }

    console.log("Generated public URL:", urlData.publicUrl);
    return urlData.publicUrl;
  } catch (error) {
    console.error("Upload failed with exception:", error);
    throw error; // Re-throw to allow proper error handling
  }
}

// Delete image from Supabase Storage
export async function deleteImage(url: string): Promise<boolean> {
  try {
    // Extract file path from URL
    const urlParts = url.split("/");
    const fileName = urlParts[urlParts.length - 1];

    const { error } = await supabase.storage.from("images").remove([fileName]);

    if (error) {
      console.error("Delete error:", error);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Delete failed:", error);
    return false;
  }
}

// Get admin data from Supabase
export async function getSupabaseAdminData(): Promise<AdminData | null> {
  try {
    const { data, error } = await supabase
      .from("admin_content")
      .select("*")
      .order("section");

    if (error) {
      console.error("Error fetching admin data:", error.message || error);
      return null;
    }

    if (!data || data.length === 0) {
      console.log("No admin data found in Supabase");
      return null;
    }

    // Reconstruct AdminData object from database rows
    const adminData: Partial<AdminData> = {};

    data.forEach((row) => {
      try {
        adminData[row.section as keyof AdminData] = row.data;
      } catch (parseError) {
        console.error(
          `Error parsing data for section ${row.section}:`,
          parseError,
        );
      }
    });

    return adminData as AdminData;
  } catch (error) {
    console.error(
      "Failed to fetch admin data:",
      error instanceof Error ? error.message : error,
    );
    return null;
  }
}

// Save admin data to Supabase
export async function saveSupabaseAdminData(
  data: Partial<AdminData>,
): Promise<boolean> {
  try {
    // Save each section separately
    const promises = Object.entries(data).map(
      async ([section, sectionData]) => {
        if (section === "lastUpdated") return true; // Skip lastUpdated as it's handled automatically

        const { error } = await supabase.from("admin_content").upsert(
          {
            section,
            data: sectionData,
          },
          {
            onConflict: "section",
          },
        );

        if (error) {
          console.error(`Error saving ${section}:`, error.message || error);
          return false;
        }
        return true;
      },
    );

    const results = await Promise.all(promises);
    return results.every((result) => result === true);
  } catch (error) {
    console.error(
      "Failed to save admin data:",
      error instanceof Error ? error.message : error,
    );
    return false;
  }
}

// Save specific section to Supabase
export async function saveSupabaseSection<K extends keyof AdminData>(
  section: K,
  data: AdminData[K],
): Promise<boolean> {
  try {
    const { error } = await supabase.from("admin_content").upsert(
      {
        section: section as string,
        data: data,
      },
      {
        onConflict: "section",
      },
    );

    if (error) {
      console.error(`Error saving section ${section}:`, error.message || error);
      return false;
    }

    return true;
  } catch (error) {
    console.error(
      `Failed to save section ${section}:`,
      error instanceof Error ? error.message : error,
    );
    return false;
  }
}

// Migrate data from localStorage to Supabase
export async function migrateLocalStorageToSupabase(): Promise<boolean> {
  try {
    const localData = localStorage.getItem("snackbox_admin_data");
    if (!localData) {
      console.log("No localStorage data to migrate");
      return true;
    }

    const parsedData = JSON.parse(localData);
    const success = await saveSupabaseAdminData(parsedData);

    if (success) {
      console.log("Successfully migrated localStorage data to Supabase");
      // Optionally remove localStorage data after successful migration
      // localStorage.removeItem('snackbox_admin_data');
    } else {
      console.warn("Failed to migrate localStorage data to Supabase");
    }

    return success;
  } catch (error) {
    console.error(
      "Migration failed:",
      error instanceof Error ? error.message : error,
    );
    return false;
  }
}
