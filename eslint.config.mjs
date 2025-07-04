import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    rules: {
      "@typescript-eslint/no-explicit-any": "off", // Disable the error for any types
      "react-hooks/exhaustive-deps": "warn", // Downgrade missing dependency warnings to warnings
           // FIXME
      "react/no-unescaped-entities": "warn" ,
   
      "react/no-unescaped-entities": "off",
      "@typescript-eslint/no-unused-vars":"off", // Disable 
    }
  }
];

export default eslintConfig;
