import React from "react";
import { Label } from "@/components/ui/label";

interface FormCategoryProps {
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  values: {
    category: string;
  };
}

export default function FormCategory({ onChange, values }: FormCategoryProps) {
  const categories = [
    { value: "ai", name: "Artificial Intelligence" },
    { value: "analytics", name: "Analytics" },
    { value: "application_development", name: "Application Development" },
    { value: "cloud", name: "Cloud" },
    { value: "collaboration", name: "Collaboration" },
    { value: "communication", name: "Communication" },
    { value: "content", name: "Content" },
    { value: "crm", name: "CRM" },
    { value: "data", name: "Data" },
    { value: "database", name: "Database" },
    { value: "ecommerce", name: "eCommerce" },
    { value: "education", name: "Education" },
    { value: "email", name: "Email" },
    { value: "entertainment", name: "Entertainment" },
    { value: "events", name: "Events" },
    { value: "finance", name: "Finance" },
    { value: "financial", name: "Financial" },
    { value: "food", name: "Food" },
    { value: "forms", name: "Forms" },
    { value: "games", name: "Games" },
    { value: "health", name: "Health" },
    { value: "location", name: "Location" },
    { value: "machine_learning", name: "Machine Learning" },
    { value: "marketing", name: "Marketing" },
    { value: "media", name: "Media" },
    { value: "messaging", name: "Messaging" },
    { value: "music", name: "Music" },
    { value: "news", name: "News" },
    { value: "nfts", name: "NFTs & Blockchain" },
    { value: "other", name: "Other" },
    { value: "payments", name: "Payments" },
    { value: "photography", name: "Photography" },
    { value: "productivity", name: "Productivity" },
    { value: "project_management", name: "Project Management" },
    { value: "search", name: "Search" },
    { value: "social", name: "Social" },
    { value: "sports", name: "Sports" },
    { value: "storage", name: "Storage" },
    { value: "tickets", name: "Tickets" },
    { value: "time_tracking", name: "Time Tracking" },
    { value: "tools", name: "Tools" },
    { value: "transport", name: "Transport" },
    { value: "travel", name: "Travel" },
    { value: "video", name: "Video" },
    { value: "weather", name: "Weather" },
  ];

  return (
    <div>
      <h2 className="text-xl font-semibold mb-3">API Metadata</h2>
      <div className="space-y-4">
        <div>
          <Label htmlFor="category" className="font-medium">
            Category <span className="text-red-500">*</span>
          </Label>
          <p className="text-sm text-gray-500 mb-1">
            Choose a category that best describes your API
          </p>
          <select
            id="category"
            name="category"
            className="w-full border border-gray-300 rounded p-2"
            value={values.category}
            onChange={onChange}
            required
          >
            <option value=""></option>
            {categories.map((cat) => (
              <option key={cat.value} value={cat.value}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
