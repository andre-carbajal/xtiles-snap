const globals = require("globals");
const pluginJs = require("@eslint/js");
const tseslint = require("typescript-eslint");

/** @type {import('eslint').Linter.Config[]} */
module.exports = [
  {
    ignores: ["dist/**", "node_modules/**", "test-results/**", "playwright-report/**"],
  },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ["**/*.js", "**/*.ts"],
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.browser,
        __dirname: "readonly",
      },
      ecmaVersion: "latest",
      sourceType: "commonjs",
    },
    rules: {
      "no-unused-vars": "warn",
      "no-console": "off",
    },
  },
  {
    files: ["eslint.config.js"],
    rules: {
      "@typescript-eslint/no-require-imports": "off",
    },
  },
];
