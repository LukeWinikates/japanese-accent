import babelParser from "@babel/eslint-parser";
import jest from 'eslint-plugin-jest';
import react from 'eslint-plugin-react';
import sonarjs from 'eslint-plugin-sonarjs'
import testingLibrary from 'eslint-plugin-testing-library'
import a11y from 'eslint-plugin-jsx-a11y'
import ts from '@typescript-eslint/eslint-plugin'
import { fixupPluginRules } from "@eslint/compat";
export default [{
  ignores: ["web/build/*"],
  files:["web/**/*.js"],
  languageOptions: {
    parser: babelParser,
    parserOptions: {
      requireConfigFile: false,
      babelOptions: {
        babelrc: false,
        configFile: false,
        presets: ["@babel/preset-env"]
      }
    }
  },
  plugins: {jest, react, sonarjs, 'testing-library': fixupPluginRules(testingLibrary), a11y, '@typescript-eslint': ts},
  // "extends": [
  //   "eslint:recommended",
  //   "plugin:react/jsx-runtime",
  //   "plugin:react/recommended",
  //   "plugin:jsx-a11y/recommended",
  //   "plugin:@typescript-eslint/recommended",
  //   "plugin:sonarjs/recommended-legacy"
  // ],
  "rules": {
    "no-undef": "off",
    "no-unused-vars": "off",
    "@typescript-eslint/no-unused-vars": ["error"],
    "@typescript-eslint/no-explicit-any": "off",
    "@typescript-eslint/ban-types": "off",
    "jest/no-conditional-expect": "error",
    "jest/no-identical-title": "error",
    "jest/no-interpolation-in-snapshots": "error",
    "jest/no-jasmine-globals": "error",
    "jest/no-mocks-import": "error",
    "jest/valid-describe-callback": "error",
    "jest/valid-expect": "error",
    "jest/valid-expect-in-promise": "error",
    "jest/valid-title": "warn",
    "testing-library/await-async-utils": "error",
    "testing-library/no-container": "error",
    "testing-library/no-debugging-utils": "error",
    "testing-library/no-dom-import": [
      "error",
      "react"
    ],
    "testing-library/no-node-access": "error",
    "testing-library/no-promise-in-fire-event": "error",
    "testing-library/no-unnecessary-act": "error",
    "testing-library/no-wait-for-multiple-assertions": "error",
    "testing-library/no-wait-for-side-effects": "error",
    "testing-library/no-wait-for-snapshot": "error",
    "testing-library/prefer-find-by": "error",
    "testing-library/prefer-presence-queries": "error",
    "testing-library/prefer-query-by-disappearance": "error",
    "testing-library/prefer-screen-queries": "error",
    "testing-library/render-result-naming-convention": "error"
  }
}]