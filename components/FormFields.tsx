import React, { ChangeEvent } from "react";

export type FormField = {
  name: string;
  label: string;
  type: string;
  note?: string;
  hintId?: string;
  placeholder?: string;
  required?: boolean;
  error?: string;
};

type FormFieldsProps = {
  fields?: FormField[];
  onChange?: (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  values?: Record<string, string>;
};

export default function FormFields({
  fields = [],
  onChange,
  values = {},
}: FormFieldsProps) {
  return (
    <>
      {fields.map((field) => (
        <div className="space-y-1" key={field.name}>
          <label
            htmlFor={field.name}
            className={
              field.required
                ? "font-semibold text-sm text-gray-700"
                : "text-sm text-gray-700"
            }
          >
            {field.label}
            {field.required && <span className="text-red-500 ml-1">*</span>}
          </label>
          {field.note && (
            <p className="text-xs text-gray-500" id={field.hintId}>
              {field.note}
              {field.error && (
                <span className="text-red-500 ml-2">{field.error}</span>
              )}
            </p>
          )}
          <input
            name={field.name}
            id={field.name}
            type={field.type}
            aria-describedby={field.note ? field.hintId : undefined}
            placeholder={field.placeholder}
            required={field.required}
            value={values[field.name] || ""}
            onChange={onChange}
            className="block w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 bg-white"
          />
        </div>
      ))}
    </>
  );
}
