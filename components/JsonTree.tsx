"use client";

import { JSONTree } from "react-json-tree";
import { ReactNode, useState, useEffect } from "react";

// Define the theme for JSONTree
const theme = {
  scheme: "monokai",
  author: "wimer hazenberg[](http://www.monokai.nl)",
  base00: "#272822",
  base01: "#383830",
  base02: "#49483e",
  base03: "#75715e",
  base04: "#a59f85",
  base05: "#f8f8f2",
  base06: "#f5f4f1",
  base07: "#f9f8f5",
  base08: "#f92672",
  base09: "#fd971f",
  base0A: "#f4bf75",
  base0B: "#a6e22e",
  base0C: "#a1efe4",
  base0D: "#66d9ef",
  base0E: "#ae81ff",
  base0F: "#cc6633",
};

export function JsonTree({ jsonData }: { jsonData: any }) {
  if (!jsonData) {
    return <div className="text-gray-500">Loading...</div>;
  }

  return (
    <div className="bg-[#272822] p-4 rounded-lg max-h-[600px] overflow-auto json-tree-container">
      <JSONTree
        data={jsonData}
        theme={theme}
        invertTheme={false}
        hideRoot
        shouldExpandNodeInitially={(keyPath, data, level) => level < 1}
        getItemString={(type, data, itemType, itemString) => (
          <span className="text-gray-400">
            {type}: {itemString}
          </span>
        )}
        labelRenderer={([key]) => (
          <span className="text-[#f8f8f2] font-semibold">{key}</span>
        )}
        valueRenderer={(raw: unknown): ReactNode => (
          <span className="text-[#a6e22e]">{String(raw)}</span>
        )}
      />
    </div>
  );
}

export default function JsonTreeContainer({
  swaggerUrl,
}: {
  swaggerUrl: string;
}) {
  const [jsonData, setJsonData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchJson() {
      if (!swaggerUrl) {
        setError("No Swagger URL available");
        return;
      }

      try {
        const response = await fetch(swaggerUrl, {
          cache: "force-cache",
        });

        if (!response.ok) {
          throw new Error("Failed to fetch OpenAPI JSON");
        }

        const data = await response.json();
        setJsonData(data);
      } catch (err) {
        console.error("Error fetching OpenAPI JSON:", err);
        setError("Unable to load OpenAPI JSON");
      }
    }

    fetchJson();
  }, [swaggerUrl]);

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return <JsonTree jsonData={jsonData} />;
}
