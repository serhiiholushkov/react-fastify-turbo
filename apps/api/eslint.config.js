import nodeConfig from "@repo/eslint-config/node";

export default [
  ...nodeConfig,
  {
    ignores: ["drizzle.config.ts"],
  },
];
