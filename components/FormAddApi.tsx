"use client";

import React, { FormEvent, useState } from "react";

import { Button } from "@/components/ui/button";
import FormCategory from "./FormCategory";
import FormFields from "./FormFields";
import FormDefinition from "./FormDefinition";
import FormOfficial from "./FormOfficial";
import { FormField } from "./FormFields";

export default function FormAddApi() {
  const [formData, setFormData] = useState({
    url: "",
    "spec-format": "openapi",
    official: "false",
    name: "",
    category: "",
    logo: "",
  });

  // Define the fields for FormFields component
  const apiFields: FormField[] = [
    {
      name: "name",
      label: "API Name",
      type: "text",
      placeholder: "API Name as you want to see it in the directory",
      required: true,
    },
    {
      name: "logo",
      label: "API Logo URL",
      type: "url",
      placeholder: "URL to API logo (optional)",
      note: "Square SVG or PNG preferred. Will be displayed at 100x100px max.",
      hintId: "logo-hint",
    },
  ];

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    try {
      const up = new URL(formData.url);
      if (!up.pathname || up.pathname === "/") {
        alert(
          "Please specify a machine-readable API definition location, not a website root URL",
        );
        return false;
      }
      if (up.pathname.endsWith(".html")) {
        alert(
          "Please specify a machine-readable API definition location, not an html page",
        );
        return false;
      }
      if (
        up.hostname.indexOf("localhost") >= 0 ||
        up.hostname.indexOf("127.0.0.1") >= 0
      ) {
        alert("Please specify a non-localhost URL");
        return false;
      }
    } catch (ex) {
      alert((ex as Error).message);
      return false;
    }

    try {
      const res = await fetch(`https://cors.redoc.ly/${formData.url}`, {
        method: "get",
        headers: { Origin: "https://apis.guru", Accept: "application/json" },
      });
      const ct = res.headers.get("content-type");
      if (res.status >= 400) {
        alert(`Error ${res.status} accessing that URL`);
        return false;
      }
      if (res.ok && ct && ct.startsWith("text/html")) {
        alert(
          "That looks like a web-page, not a machine-readable API definition",
        );
        return false;
      }
      if (res.ok && formData.url.endsWith("ai-plugin.json")) {
        const content = await res.json();
        console.log(content);
        setFormData((prev) => ({
          ...prev,
          name: content.name_for_human,
          category: "machine_learning",
          logo: content.logo_url,
          url: content.api.url,
        }));
        alert("AI Plugin detected, please select Add API again");
        return false;
      }
    } catch (ex) {
      console.log((ex as Error).message);
    }

    // Build GitHub issue URL
    const details = {
      format: formData["spec-format"],
      official: formData.official,
      url: formData.url,
      name: formData.name,
      category: formData.category,
      logo: formData.logo,
    };

    let body = "";
    for (const [key, value] of Object.entries(details)) {
      body += `**${capitalizeFirstLetter(key)}**: ${value}\n`;
    }

    const issueUrl = `https://github.com/APIs-guru/openapi-directory/issues/new?labels=add%20API&title=Add "${encodeURIComponent(details.name)}" API&body=${encodeURIComponent(body)}`;

    window.location.href = issueUrl;
    return false;
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Helper function to capitalize the first letter
  const capitalizeFirstLetter = (string: string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  return (
    <form
      id="add_api_form"
      className="space-y-8 bg-white rounded-lg shadow p-8 max-w-2xl mx-auto text-lg"
      onSubmit={handleSubmit}
    >
      <FormDefinition onChange={handleInputChange} values={formData} />
      <FormOfficial onChange={handleInputChange} values={formData} />
      <FormFields
        fields={apiFields}
        onChange={handleInputChange}
        values={formData}
      />
      <FormCategory onChange={handleInputChange} values={formData} />
      <div>
        <Button type="submit" className="w-full text-lg py-6" variant="cta">
          Add API
        </Button>
      </div>
    </form>
  );
}
