import React from "react";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

export type OfficialOption = {
  label: string;
  value: string;
  checked?: boolean;
};

interface FormOfficialProps {
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  values: {
    official: string;
  };
}

export function FormOfficial({ onChange, values }: FormOfficialProps) {
  const options: OfficialOption[] = [
    { label: "Yes, by API owner", value: "true" },
    { label: "No, 3rd party", value: "false" },
  ];

  const handleRadioChange = (value: string) => {
    const syntheticEvent = { target: { name: "official", value } } as React.ChangeEvent<HTMLInputElement>;
    onChange(syntheticEvent);
  };

  return (
    <div className="space-y-4 rounded-lg border border-gray-200 p-6">
      <h2 className="text-xl font-semibold text-gray-900">API Source</h2>
      <div className="space-y-3">
        <Label className="text-base font-medium text-gray-700">
          Is the definition official? <span className="text-red-500">*</span>
        </Label>
        <RadioGroup
          value={values.official}
          onValueChange={handleRadioChange}
          className="flex flex-col gap-3 md:flex-row md:gap-6"
        >
          {options.map((option) => (
            <div key={option.value} className="flex items-center space-x-3">
              <RadioGroupItem
                value={option.value}
                id={`official-${option.value}`}
                className="h-5 w-5 rounded-full border-2 border-gray-300 data-[state=checked]:border-blue-600 data-[state=checked]:bg-blue-600"
              />
              <Label
                htmlFor={`official-${option.value}`}
                className="text-base text-gray-700 hover:text-gray-900"
              >
                {option.label}
              </Label>
            </div>
          ))}
        </RadioGroup>
      </div>
    </div>
  );
}