import globals from "globals";
import tseslint from "typescript-eslint";
import { config as baseConfig } from "./base.js";

/** @type {import("typescript-eslint").Config} */
export default tseslint.config(
  ...baseConfig,
  {
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
  },
  {
    files: ["**/*.ts"],
    languageOptions: {
      parserOptions: {
        project: true,
      },
    },
    rules: {
      "@typescript-eslint/no-floating-promises": "error", // critical for async Fastify handlers
      "@typescript-eslint/no-unsafe-argument": "warn",
    },
  },
);
