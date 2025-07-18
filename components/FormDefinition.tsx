import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface FormDefinitionProps {
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => void;
  values: {
    url: string;
    "spec-format": string;
  };
}

export default function FormDefinition({
  onChange,
  values,
}: FormDefinitionProps) {
  const formatOptions = [
    {
      name: "openapi",
      label: "OpenAPI/Swagger",
      url: "https://www.openapis.org/",
      checked: true,
    },
    {
      name: "api_blueprint",
      label: "API Blueprint",
      url: "https://apiblueprint.org/",
    },
    { name: "raml", label: "RAML", url: "https://raml.org/" },
    { name: "wadl", label: "WADL", url: "http://www.w3.org/Submission/wadl/" },
    {
      name: "google",
      label: "Google Discovery",
      url: "https://developers.google.com/discovery",
    },
    { name: "other", label: "Other", url: "#" },
  ];

  const handleRadioChange = (value: string) => {
    const syntheticEvent = {
      target: { name: "spec-format", value },
    } as React.ChangeEvent<HTMLInputElement>;
    onChange(syntheticEvent);
  };

  return (
    <div className="mb-6">
      <h2 className="text-lg md:text-xl font-semibold mb-3">API Definition</h2>
      <div className="space-y-5">
        <div>
          <Label htmlFor="url" className="font-medium block mb-2">
            URL <span className="text-red-500">*</span>
          </Label>
          <Input
            id="url"
            name="url"
            placeholder="URL to API definition"
            required
            value={values.url}
            onChange={onChange}
            className="text-base md:text-lg"
          />
        </div>

        <div>
          <Label className="font-medium block mb-2">
            Format of the definition: <span className="text-red-500">*</span>
          </Label>
          <RadioGroup
            value={values["spec-format"]}
            onValueChange={handleRadioChange}
            className="grid grid-cols-1 md:grid-cols-2 gap-y-3 gap-x-4"
          >
            {formatOptions.map((format) => (
              <div key={format.name} className="relative flex items-center">
                <RadioGroupItem
                  value={format.name}
                  id={`format-${format.name}`}
                  className="w-5 h-5 rounded-full border-2 border-gray-300 bg-gray-100 
                    data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600
                    hover:bg-gray-200 hover:border-blue-600
                    focus:bg-gray-200 focus:border-blue-600"
                />
                <label
                  htmlFor={`format-${format.name}`}
                  className="ml-3 text-gray-600 hover:text-gray-900 cursor-pointer flex items-center text-base md:text-lg"
                >
                  {format.label}{" "}
                  <a
                    href={format.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline ml-1 text-sm"
                    title={`${format.label} definition details`}
                  >
                    details
                  </a>
                </label>
              </div>
            ))}
          </RadioGroup>
        </div>
      </div>
    </div>
  );
}
