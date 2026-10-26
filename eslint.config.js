import js from "@eslint/js";
import tseslint from "typescript-eslint";

const nodeGlobals = {
  process: "readonly",
  console: "readonly",
  Buffer: "readonly",
  URL: "readonly",
  URLSearchParams: "readonly",
  setTimeout: "readonly",
  clearTimeout: "readonly",
  setInterval: "readonly",
  clearInterval: "readonly",
  fetch: "readonly",
  AbortSignal: "readonly",
  WebSocket: "readonly",
  __dirname: "readonly",
  __filename: "readonly",
  module: "readonly",
  require: "readonly",
};

export default tseslint.config(
  {
    ignores: [
      "**/node_modules/**",
      "**/dist/**",
      "**/build/**",
      "**/coverage/**",
      "**/.react-router/**",
      "**/playwright-report/**",
      "**/test-results/**",
      "**/.lighthouseci/**",
      "client/public/**",
    ],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ["**/*.{js,mjs,cjs}"],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: "module",
      globals: nodeGlobals,
    },
  },
  {
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: "module",
    },
    rules: {
      "@typescript-eslint/consistent-type-imports": "error",
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
    },
  },
);
