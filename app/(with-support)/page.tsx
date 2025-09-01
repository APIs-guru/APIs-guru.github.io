import React from "react";
import SearchClientComponent from "@/components/SearchClientComponent";

export const dynamic = "force-dynamic";

export default async function Home() {
  return (
    <div className="container mx-auto px-4 py-4 relative">
      <div className="relative z-10">
        <SearchClientComponent />
      </div>
    </div>
  );
}
