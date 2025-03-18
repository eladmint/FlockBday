import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { ReactNode } from "react";

interface CampaignPageLayoutProps {
  children: ReactNode;
}

/**
 * Shared layout component for campaign pages to reduce duplication
 */
export function CampaignPageLayout({ children }: CampaignPageLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8">{children}</main>
      <Footer />
    </div>
  );
}
