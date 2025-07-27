import { Input } from "./ui/input";
import { Label } from "./ui/label";
import React from "react";

export type FormField = {
  name: string;
  label: string;
  type: string;
  placeholder?: string;
  required?: boolean;
  note?: string;
  hintId?: string;
};

interface FormFieldsProps {
  fields: FormField[];
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  values: { [key: string]: string };
  nameRef?: React.RefObject<HTMLInputElement | null>;
  errors?: Record<string, string>;
}

export function FormFields({
  fields,
  onChange,
  values,
  nameRef,
  errors = {},
}: FormFieldsProps) {
  return (
    <div className="space-y-4 rounded-lg border border-gray-200 p-6">
      <h2 className="text-xl font-semibold text-gray-900">API Details</h2>
      <div className="space-y-4">
        {fields.map((field) => (
          <div key={field.name} className="space-y-3">
            <Label
              htmlFor={field.name}
              className="text-base font-medium text-gray-700"
            >
              {field.label}{" "}
              {field.required && <span className="text-red-500">*</span>}
            </Label>
            {field.note && (
              <p id={field.hintId} className="text-sm text-gray-500">
                {field.note}
              </p>
            )}
            <Input
              id={field.name}
              name={field.name}
              type={field.type}
              placeholder={field.placeholder}
              required={field.required}
              value={values[field.name]}
              onChange={onChange}
              className={`w-full rounded-md border-gray-300 text-base ${errors[field.name] ? "border-red-500" : ""}`}
              ref={field.name === "name" ? nameRef : undefined}
            />
            {errors[field.name] && (
              <p className="mt-1 text-sm text-red-500">{errors[field.name]}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
