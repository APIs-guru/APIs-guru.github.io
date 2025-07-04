import React from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function BlogBanner() {
  return (
    <Alert className="bg-blue-100 border border-blue-400 text-blue-900 rounded-lg px-4 py-3 flex items-center gap-2">
      <AlertDescription>
        <a
          href="https://blog.apis.guru/"
          className="font-semibold underline hover:text-blue-700 transition-colors"
        >
          Our blog has migrated to <strong>blog.apis.guru</strong>
        </a>
      </AlertDescription>
    </Alert>
  );
}
