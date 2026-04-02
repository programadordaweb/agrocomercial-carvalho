"use client";

import dynamic from "next/dynamic";

const SiteContent = dynamic(() => import("@/components/SiteContent"), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen bg-brand-cream flex items-center justify-center">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-green-200 border-t-green-700 rounded-full animate-spin mx-auto mb-4" />
      </div>
    </div>
  ),
});

export default function Home() {
  return <SiteContent />;
}
