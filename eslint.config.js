import globals from "globals";
import pluginJs from "@eslint/js";
import tseslintParser from "@typescript-eslint/parser";
import tseslintPlugin from "@typescript-eslint/eslint-plugin";
import react from "eslint-plugin-react";
import reactHooksPlugin from "eslint-plugin-react-hooks";



export default [
  { files: ["**/*.{js,mjs,cjs,ts,jsx,tsx}"] },
  { languageOptions: { parserOptions: { ecmaFeatures: { jsx: true } } } },
  { languageOptions: { globals: globals.browser } },
  pluginJs.configs.recommended,

  {
    files: ["**/*.ts", "**/*.tsx"],
    languageOptions: {
      parser: tseslintParser,
      parserOptions: {
        project: "./tsconfig.json",
      },
    },
    plugins: {
      react: react,
      "@typescript-eslint": tseslintPlugin, // Register the TypeScript ESLint plugin
      "react-hooks": reactHooksPlugin, // Register the React Hooks plugin
    },
    settings: {
      react: {
        version: "detect",
      },
    },
    rules: {
      // Common TypeScript ESLint rules
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/explicit-module-boundary-types": "off",
      "@typescript-eslint/no-unused-vars": ["error", { "argsIgnorePattern": "^_", "varsIgnorePattern": "^_" }],

      // Common React rules
      "react/react-in-jsx-scope": "off", // Not needed with React 17+ JSX transform
      "react/jsx-uses-react": "off", // Not needed with React 17+ JSX transform
      "react/prop-types": "off", // Not needed with TypeScript
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",
      "no-unused-vars": "off", // Disable base ESLint no-unused-vars
    },
  },
];
