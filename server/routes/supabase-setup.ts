import { RequestHandler } from "express";
import {
  createDatabaseSchema,
  createStorageBucket,
} from "../lib/supabase-admin";

export const handleSupabaseSetup: RequestHandler = async (req, res) => {
  try {
    console.log("Setting up Supabase database schema...");
    const schemaResult = await createDatabaseSchema();

    console.log("Setting up Supabase storage bucket...");
    const storageResult = await createStorageBucket();

    const success = schemaResult.success && storageResult.success;
    const messages = [];

    if (!schemaResult.success) {
      messages.push(`Database: ${schemaResult.message || schemaResult.error}`);
    } else {
      messages.push("Database: ✓ Ready");
    }

    if (!storageResult.success) {
      messages.push(`Storage: ${storageResult.error}`);
    } else {
      messages.push("Storage: ✓ Ready");
    }

    res.json({
      success,
      message: messages.join("\n"),
      details: {
        database: schemaResult,
        storage: storageResult,
      },
    });
  } catch (error) {
    console.error("Supabase setup error:", error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};
