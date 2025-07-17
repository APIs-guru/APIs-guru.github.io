import React from "react";
import FormAddApi from "@/components/FormAddApi";

export default function AddApiPage() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-5xl font-bold mb-8 text-center">Add API</h1>

      <div className="description mb-8 max-w-2xl mx-auto text-gray-700 text-lg">
        <p className="mb-6">
          This page helps you submit your API into the APIs.guru directory. The
          most important requirement is the presence of a machine-readable API
          definition in one of the popular formats, such as: OpenAPI (formerly
          known as Swagger), RAML, API Blueprint, etc.
        </p>
        <p className="mb-6">
          <strong>Important note:</strong> we only aggregate API definitions,
          not host them. So please, provide us with a stable URL to the
          definition. We will use it to keep your definition up to date: see our{" "}
          <a
            href="https://github.com/APIs-guru/openapi-directory#update-procedure"
            className="text-blue-600 hover:underline"
          >
            update procedure
          </a>
          .
        </p>
        <p>
          <strong>Note:</strong> If you enter a{" "}
          <code className="bg-gray-100 px-1.5 py-0.5 rounded text-base">
            .well-known/ai-plugin.json
          </code>{" "}
          URL in the{" "}
          <code className="bg-gray-100 px-1.5 py-0.5 rounded text-base">
            URL
          </code>{" "}
          field, the linked OpenAPI definition will be looked up and the name
          and logo fields automatically populated.
        </p>
      </div>

      <FormAddApi />
    </div>
  );
}
