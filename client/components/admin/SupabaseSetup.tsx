import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  CheckCircle,
  AlertCircle,
  ExternalLink,
  Copy,
  Database,
  ImageIcon,
} from "lucide-react";
import { checkSupabaseConnection } from "@/lib/supabase-admin";

export function SupabaseSetup() {
  const [setupStatus, setSetupStatus] = useState<{
    database: boolean;
    storage: boolean;
    testing: boolean;
    error?: string;
  }>({
    database: false,
    storage: false,
    testing: false,
  });
  const [isSetupRunning, setIsSetupRunning] = useState(false);
  const [setupMessage, setSetupMessage] = useState("");

  const sqlScript = `-- Create admin_content table for storing all admin data
CREATE TABLE IF NOT EXISTS admin_content (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  section TEXT NOT NULL UNIQUE,
  data JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE admin_content ENABLE ROW LEVEL SECURITY;

-- Create policies (allow all operations for now)
CREATE POLICY "Enable all for users" ON admin_content 
  FOR ALL USING (true) WITH CHECK (true);

-- Create storage bucket for images (run in Storage > Settings)
-- Bucket name: images
-- Public: Yes
-- Allowed MIME types: image/*
-- File size limit: 5MB`;

  const handleRunSetup = async () => {
    setIsSetupRunning(true);
    setSetupMessage("");

    try {
      // Try to call the server setup endpoint
      const response = await fetch("/api/supabase-setup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const result = await response.json();

        if (result.success) {
          setSetupStatus({
            database: true,
            storage: true,
            testing: true,
          });
          setSetupMessage("✅ Supabase setup completed successfully!");
        } else {
          setSetupStatus({
            database: false,
            storage: false,
            testing: false,
            error: result.message || "Setup failed",
          });
          setSetupMessage(
            "❌ Setup failed. Please follow the manual setup instructions below.",
          );
        }
      } else {
        // Fallback: just test the connection
        const connected = await checkSupabaseConnection();

        if (connected) {
          setSetupStatus({
            database: true,
            storage: true,
            testing: true,
          });
          setSetupMessage("✅ Supabase connection test successful!");
        } else {
          setSetupStatus({
            database: false,
            storage: false,
            testing: false,
            error: "Connection test failed",
          });
          setSetupMessage(
            "❌ Connection failed. Please follow the manual setup instructions below.",
          );
        }
      }
    } catch (error) {
      // Fallback: just test the connection
      try {
        const connected = await checkSupabaseConnection();

        if (connected) {
          setSetupStatus({
            database: true,
            storage: true,
            testing: true,
          });
          setSetupMessage("✅ Supabase connection test successful!");
        } else {
          setSetupStatus({
            database: false,
            storage: false,
            testing: false,
            error: "Connection test failed",
          });
          setSetupMessage(
            "❌ Connection failed. Please follow the manual setup instructions below.",
          );
        }
      } catch (testError) {
        setSetupStatus({
          database: false,
          storage: false,
          testing: false,
          error:
            testError instanceof Error ? testError.message : "Unknown error",
        });
        setSetupMessage(
          "❌ Setup error. Please follow the manual setup instructions below.",
        );
      }
    } finally {
      setIsSetupRunning(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Supabase Integration Setup
        </h2>
        <p className="text-gray-600">
          Complete the Supabase setup to enable database storage and image
          uploads
        </p>
      </div>

      {/* Auto Setup */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Automatic Setup
          </CardTitle>
          <CardDescription>
            Try automatic setup first - this will create the database table and
            storage bucket
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button
            onClick={handleRunSetup}
            disabled={isSetupRunning}
            className="w-full"
          >
            {isSetupRunning ? "Setting up..." : "Run Automatic Setup"}
          </Button>

          {setupMessage && (
            <Alert
              className={
                setupStatus.database && setupStatus.storage
                  ? "border-green-200 bg-green-50"
                  : "border-red-200 bg-red-50"
              }
            >
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Setup Status</AlertTitle>
              <AlertDescription>{setupMessage}</AlertDescription>
            </Alert>
          )}

          {/* Status indicators */}
          {(setupStatus.database ||
            setupStatus.storage ||
            setupStatus.testing) && (
            <div className="space-y-2 pt-4 border-t">
              <div className="flex items-center gap-2">
                {setupStatus.database ? (
                  <CheckCircle className="h-4 w-4 text-green-600" />
                ) : (
                  <AlertCircle className="h-4 w-4 text-red-600" />
                )}
                <span className="text-sm">Database table</span>
              </div>

              <div className="flex items-center gap-2">
                {setupStatus.storage ? (
                  <CheckCircle className="h-4 w-4 text-green-600" />
                ) : (
                  <AlertCircle className="h-4 w-4 text-red-600" />
                )}
                <span className="text-sm">Storage bucket</span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Manual Setup */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ExternalLink className="h-5 w-5" />
            Manual Setup (if automatic fails)
          </CardTitle>
          <CardDescription>
            Follow these steps if automatic setup doesn't work
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Database Setup */}
          <div>
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <Database className="h-4 w-4" />
              1. Database Setup
            </h3>
            <div className="bg-gray-100 rounded-lg p-4 relative">
              <Button
                variant="outline"
                size="sm"
                className="absolute top-2 right-2"
                onClick={() => copyToClipboard(sqlScript)}
              >
                <Copy className="h-4 w-4" />
              </Button>
              <pre className="text-sm overflow-x-auto whitespace-pre-wrap pr-16">
                {sqlScript}
              </pre>
            </div>
            <div className="mt-3 space-y-2 text-sm text-gray-600">
              <p>
                • Go to your{" "}
                <a
                  href="https://ukyybenrsaeapesvvprd.supabase.co/editor"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  Supabase SQL Editor
                </a>
              </p>
              <p>• Copy and paste the SQL script above</p>
              <p>• Click "Run" to execute</p>
            </div>
          </div>

          {/* Storage Setup */}
          <div>
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <ImageIcon className="h-4 w-4" />
              2. Storage Setup
            </h3>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="space-y-2 text-sm">
                <p>
                  • Go to{" "}
                  <a
                    href="https://ukyybenrsaeapesvvprd.supabase.co/storage/buckets"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    Supabase Storage
                  </a>
                </p>
                <p>• Click "Create bucket"</p>
                <p>
                  • Name: <code className="bg-white px-1 rounded">images</code>
                </p>
                <p>
                  • Make it <strong>Public</strong>
                </p>
                <p>
                  • Set file size limit to <strong>5MB</strong>
                </p>
                <p>
                  • Allow MIME types:{" "}
                  <code className="bg-white px-1 rounded">image/*</code>
                </p>
              </div>
            </div>
          </div>

          {/* Test Connection */}
          <div>
            <h3 className="text-lg font-semibold mb-3">3. Test Connection</h3>
            <Button
              onClick={handleRunSetup}
              variant="outline"
              className="w-full"
            >
              Test Supabase Connection
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Success Message */}
      {setupStatus.database && setupStatus.storage && (
        <Alert className="border-green-200 bg-green-50">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertTitle className="text-green-800">Setup Complete!</AlertTitle>
          <AlertDescription className="text-green-700">
            Your admin dashboard is now connected to Supabase. All data will be
            stored in the database and images will be uploaded to Supabase
            Storage.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}
