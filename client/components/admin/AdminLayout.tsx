import { useState, useEffect } from "react";
import {
  Settings,
  Home,
  Star,
  Search,
  Megaphone,
  Menu,
  X,
  LogOut,
  Save,
  Eye,
  Shield,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { getAdminData } from "@/lib/admin-storage-supabase";
import { supabase } from "@/lib/supabase";

interface AdminLayoutProps {
  children: React.ReactNode;
  currentSection: string;
  onSectionChange: (section: string) => void;
}

const sidebarItems = [
  {
    id: "seo",
    label: "SEO Settings",
    icon: Search,
    description: "Meta tags and SEO configuration",
  },
  {
    id: "hero",
    label: "Hero Section",
    icon: Home,
    description: "Main title, pricing, and buttons",
  },
  {
    id: "features",
    label: "Features Section",
    icon: Star,
    description: "Feature cards with images and text",
  },
  {
    id: "trust",
    label: "Trust Section",
    icon: Shield,
    description: "Walmart seller info and returns policy",
  },
  {
    id: "gallery",
    label: "Gallery Section",
    icon: Settings,
    description: "Product gallery images",
  },
  {
    id: "reviews",
    label: "Customer Reviews",
    icon: Star,
    description: "Customer testimonials and ratings",
  },
  {
    id: "finalcta",
    label: "Final CTA Section",
    icon: Megaphone,
    description: "Final call-to-action with benefits",
  },
  {
    id: "footer",
    label: "Footer",
    icon: Settings,
    description: "Social media links and footer content",
  },
  {
    id: "popups",
    label: "Popups",
    icon: Megaphone,
    description: "Button-triggered and exit-intent popups",
  },
];

export function AdminLayout({
  children,
  currentSection,
  onSectionChange,
}: AdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<string>("");

  useEffect(() => {
    const loadData = async () => {
      const adminData = await getAdminData();
      setLastUpdated(adminData.lastUpdated);
    };
    loadData();
  }, []);

  const handlePreviewSite = () => {
    // Open the main site in a new tab
    window.open("/", "_blank");
  };

  const handleExitAdmin = () => {
    // Navigate back to main site
    window.location.href = "/";
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      window.location.href = "/login";
    } catch (error) {
      console.error("Logout error:", error);
      // Force redirect anyway
      window.location.href = "/login";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <div>
              <h1 className="text-lg font-semibold text-gray-900">
                Admin Dashboard
              </h1>
              <p className="text-sm text-gray-600">Snack Box Site Editor</p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2">
            {sidebarItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentSection === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onSectionChange(item.id);
                    setSidebarOpen(false);
                  }}
                  className={cn(
                    "w-full flex items-start gap-3 p-3 rounded-lg text-left transition-colors",
                    isActive
                      ? "bg-blue-50 text-blue-700 border border-blue-200"
                      : "text-gray-700 hover:bg-gray-50",
                  )}
                >
                  <Icon
                    className={cn(
                      "h-5 w-5 mt-0.5 flex-shrink-0",
                      isActive ? "text-blue-600" : "text-gray-500",
                    )}
                  />
                  <div>
                    <div className="font-medium text-sm">{item.label}</div>
                    <div className="text-xs text-gray-500 mt-0.5">
                      {item.description}
                    </div>
                  </div>
                </button>
              );
            })}
          </nav>

          {/* Footer Actions */}
          <div className="p-4 border-t border-gray-200 space-y-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handlePreviewSite}
              className="w-full justify-start"
            >
              <Eye className="h-4 w-4 mr-2" />
              Preview Site
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleExitAdmin}
              className="w-full justify-start text-gray-600"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Exit Admin
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>

            {/* Last Updated */}
            <div className="text-xs text-gray-500 pt-2 border-t">
              Last updated:{" "}
              {lastUpdated
                ? new Date(lastUpdated).toLocaleString()
                : "Loading..."}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile Header */}
        <div className="lg:hidden bg-white border-b border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </Button>
            <h1 className="text-lg font-semibold text-gray-900">
              Admin Dashboard
            </h1>
            <Button variant="ghost" size="sm" onClick={handlePreviewSite}>
              <Eye className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Content Area */}
        <main className="flex-1 p-4 lg:p-8 overflow-auto">
          <div className="max-w-4xl mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
}

// Section Header Component
interface SectionHeaderProps {
  title: string;
  description: string;
  actions?: React.ReactNode;
}

export function SectionHeader({
  title,
  description,
  actions,
}: SectionHeaderProps) {
  return (
    <div className="mb-8">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">{title}</h2>
          <p className="text-gray-600">{description}</p>
        </div>
        {actions && <div className="ml-4">{actions}</div>}
      </div>
    </div>
  );
}

// Success Toast Component
interface SuccessToastProps {
  show: boolean;
  message: string;
  onClose: () => void;
}

export function SuccessToast({ show, message, onClose }: SuccessToastProps) {
  if (!show) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 bg-green-600 text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-2">
      <Save className="h-4 w-4" />
      <span className="font-medium">{message}</span>
      <button
        onClick={onClose}
        className="ml-2 text-green-200 hover:text-white"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}
