import js from "@eslint/js";
import globals from "globals";

export default [
  {
    ignores: [
      "**/node_modules/**",
      "frontend/public/archive/**",
      "frontend/public/print-forms/**"
    ]
  },
  js.configs.recommended,
  {
    rules: {
      "no-unused-vars": ["warn", { argsIgnorePattern: "^_", varsIgnorePattern: "^_" }],
      "no-empty": ["error", { allowEmptyCatch: true }]
    }
  },
  {
    files: ["backend/**/*.js", "backend/**/*.mjs"],
    languageOptions: {
      ecmaVersion: 2024,
      sourceType: "module",
      globals: globals.node
    }
  },
  {
    files: ["frontend/public/**/*.js"],
    languageOptions: {
      ecmaVersion: 2024,
      sourceType: "module",
      globals: globals.browser
    }
  }
];
