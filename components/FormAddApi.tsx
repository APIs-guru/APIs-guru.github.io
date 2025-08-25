"use client";

import React, { FormEvent, useState, useRef } from "react";
import { z } from "zod";
import { Button } from "@/components/ui/button";

import FormDefinition from "./FormDefinition";
import { FormField, FormFields } from "./FormFields";
import { FormOfficial } from "./FormOfficial";
import { FormCategory } from "./FormCategory";

// Define validation schema
const formSchema = z.object({
  url: z.string().url("Please enter a valid URL").min(1, "URL is required"),
  "spec-format": z.string().min(1, "Format is required"),
  official: z.string().min(1, "Please select if the API is official"),
  name: z.string().min(1, "API name is required"),
  category: z.string().min(1, "Category is required"),
  logo: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

export default function FormAddApi() {
  const [formData, setFormData] = useState<FormData>({
    url: "",
    "spec-format": "openapi",
    official: "false",
    name: "",
    category: "",
    logo: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Create refs for form fields with proper typings
  const urlRef = useRef<HTMLInputElement>(null);
  const nameRef = useRef<HTMLInputElement>(null);
  const categoryRef = useRef<HTMLDivElement>(null);

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

  // Function to validate form with Zod and scroll to first error
  const validateFormAndScroll = (): boolean => {
    const result = formSchema.safeParse(formData);

    if (!result.success) {
      const formattedErrors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        const path = issue.path[0] as string;
        formattedErrors[path] = issue.message;
      });

      setErrors(formattedErrors);

      // Scroll to first error
      if (formattedErrors.url && urlRef.current) {
        urlRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
        urlRef.current.focus();
        return false;
      }

      if (formattedErrors.name && nameRef.current) {
        nameRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
        nameRef.current.focus();
        return false;
      }

      if (formattedErrors.category && categoryRef.current) {
        categoryRef.current.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
        categoryRef.current.focus();
        return false;
      }

      return false;
    }

    setErrors({});
    return true;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    // Validate form with Zod and scroll to errors
    if (!validateFormAndScroll()) {
      return false;
    }

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

    // Clear error when field is edited
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  // Helper function to capitalize the first letter
  const capitalizeFirstLetter = (string: string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  return (
    <form
      id="add_api_form"
      className="space-y-8 bg-white rounded-lg shadow p-4 md:p-8 max-w-2xl mx-auto text-base md:text-lg"
      onSubmit={handleSubmit}
      noValidate
    >
      <FormDefinition
        onChange={handleInputChange}
        values={formData}
        urlRef={urlRef}
        error={errors.url}
      />
      <FormOfficial
        onChange={handleInputChange}
        values={formData}
        error={errors.official}
      />
      <FormFields
        fields={apiFields}
        onChange={handleInputChange}
        values={formData}
        nameRef={nameRef}
        errors={errors}
      />
      <FormCategory
        onChange={handleInputChange}
        values={formData}
        categoryRef={categoryRef}
        error={errors.category}
      />
      <div>
        <Button
          type="submit"
          className="w-full text-base md:text-lg py-4 md:py-6"
          variant="cta"
        >
          Add API
        </Button>
      </div>
    </form>
  );
}
