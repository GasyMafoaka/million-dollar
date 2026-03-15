// https://docs.expo.dev/guides/using-eslint/
const { defineConfig } = require("eslint/config");
const expoConfig = require("eslint-config-expo/flat");
const jest = require("eslint-plugin-jest");

module.exports = defineConfig([
  expoConfig,
  {
    ignores: ["dist/*"],
  },
  {
    files: ["**/*.test.ts", "**/*.test.tsx", "jest.setup.js"],
    languageOptions: {
      globals: {
        ...jest.environments.globals.jest,
      },
    },
    plugins: {
      jest,
    },
  }
]);
