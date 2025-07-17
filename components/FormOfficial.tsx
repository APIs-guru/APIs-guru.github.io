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

export default function FormOfficial({ onChange, values }: FormOfficialProps) {
  const options = [
    { label: "Yes, by API owner", value: "true" },
    { label: "No, 3rd party", value: "false", checked: true },
  ];

  const handleRadioChange = (value: string) => {
    const syntheticEvent = {
      target: { name: "official", value },
    } as React.ChangeEvent<HTMLInputElement>;
    onChange(syntheticEvent);
  };

  return (
    <div className="mb-6">
      <h2 className="text-xl font-semibold mb-3">API Source</h2>
      <div>
        <Label htmlFor="official" className="font-medium block mb-2">
          Is the definition official? <span className="text-red-500">*</span>
        </Label>
        <RadioGroup
          value={values.official}
          onValueChange={handleRadioChange}
          className="flex flex-wrap gap-6"
        >
          {options.map((off) => (
            <div key={off.value} className="relative flex items-center gap-3">
              <RadioGroupItem
                value={off.value}
                id={`official-${off.value}`}
                className="w-5 h-5 rounded-full border-2 border-gray-300 bg-gray-100 
                  data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600
                  hover:bg-gray-200 hover:border-blue-600
                  focus:bg-gray-200 focus:border-blue-600"
              />
              <label
                htmlFor={`official-${off.value}`}
                className="font-medium text-gray-600 hover:text-gray-900 cursor-pointer"
              >
                {off.label}
              </label>
            </div>
          ))}
        </RadioGroup>
      </div>
    </div>
  );
}
