import { Input } from "./ui/input";
import { Label } from "./ui/label";

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
}

export function FormFields({ fields, onChange, values }: FormFieldsProps) {
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
              className="w-full rounded-md border-gray-300 text-base"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
