"use client";

import { useEffect } from "react";

interface VisitCounterProps {
  providerSlug: string;
  serviceSlug: string | null;
}

export default function VisitCounter({
  providerSlug,
  serviceSlug,
}: VisitCounterProps) {
  useEffect(() => {
    const countVisit = async () => {
      try {
        const apiName = serviceSlug
          ? `${providerSlug}:${serviceSlug}`
          : providerSlug;

        const response = await fetch("/api/count-visit", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name: apiName }),
        });

        if (!response.ok) {
          console.warn("Failed to count visit:", await response.text());
        }
      } catch (error) {
        console.warn("Error counting visit:", error);
      }
    };

    countVisit();
  }, [providerSlug, serviceSlug]);

  return null;
}
