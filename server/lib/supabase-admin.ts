import { createClient } from "@supabase/supabase-js";
import type { Database } from "../../client/lib/supabase";

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Check if admin client can be initialized
const canInitializeAdmin = !!(supabaseUrl && supabaseServiceKey);

// Admin client with service role key for server-side operations
export const supabaseAdmin = canInitializeAdmin
  ? createClient<Database>(supabaseUrl!, supabaseServiceKey!, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    })
  : null;

// Helper function to check if admin client is available
export function isAdminClientAvailable(): boolean {
  return supabaseAdmin !== null;
}

// Helper function to get admin client or throw error
export function requireAdminClient() {
  if (!supabaseAdmin) {
    throw new Error(
      "Supabase admin client not available. Please set SUPABASE_SERVICE_ROLE_KEY environment variable.",
    );
  }
  return supabaseAdmin;
}

// Database migration and setup functions
export async function createDatabaseSchema() {
  try {
    if (!isAdminClientAvailable()) {
      return {
        success: false,
        message:
          "Supabase admin client not configured. Please set SUPABASE_SERVICE_ROLE_KEY environment variable.",
      };
    }

    const admin = requireAdminClient();

    // Create the table using direct SQL
    const { error: tableError } = await admin
      .from("admin_content")
      .select("id")
      .limit(1);

    // If table doesn't exist, we'll get an error
    if (
      tableError &&
      tableError.message.includes('relation "admin_content" does not exist')
    ) {
      console.log("Creating admin_content table...");

      // Table needs to be created via SQL in Supabase dashboard or using migrations
      // For now, we'll try to check if it exists and report status
      return {
        success: false,
        message:
          'Table admin_content needs to be created in Supabase dashboard. Please run this SQL:\n\nCREATE TABLE admin_content (\n  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,\n  section TEXT NOT NULL UNIQUE,\n  data JSONB NOT NULL,\n  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),\n  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()\n);\n\nALTER TABLE admin_content ENABLE ROW LEVEL SECURITY;\n\nCREATE POLICY "Enable all for authenticated users" ON admin_content USING (true) WITH CHECK (true);',
      };
    }

    console.log("Database schema verified successfully");
    return { success: true };
  } catch (error) {
    console.error("Error checking database schema:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

export async function createStorageBucket() {
  try {
    if (!isAdminClientAvailable()) {
      return {
        success: false,
        error:
          "Supabase admin client not configured. Please set SUPABASE_SERVICE_ROLE_KEY environment variable.",
      };
    }

    const admin = requireAdminClient();

    // Check if bucket already exists
    const { data: buckets, error: listError } =
      await admin.storage.listBuckets();

    if (listError) {
      console.error("Error listing buckets:", listError);
      return { success: false, error: listError.message };
    }

    const bucketExists = buckets?.some((bucket) => bucket.name === "images");

    if (!bucketExists) {
      console.log("Creating images bucket...");
      const { error } = await admin.storage.createBucket("images", {
        public: true,
        allowedMimeTypes: ["image/*"],
        fileSizeLimit: 5242880, // 5MB
      });

      if (error) {
        console.error("Error creating storage bucket:", error);
        return { success: false, error: error.message };
      }

      console.log("Images bucket created successfully");
    } else {
      console.log("Images bucket already exists");
    }

    return { success: true };
  } catch (error) {
    console.error("Error in createStorageBucket:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
