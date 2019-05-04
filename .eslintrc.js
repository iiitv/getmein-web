module.exports = {
  env: {
    browser: true,
    es6: true,
    node: true,
    commonjs: true,
    jquery: true
  },
  extends: "standard",
  globals: {
    Atomics: "readonly",
    SharedArrayBuffer: "readonly"
  },
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: "module"
  },
  rules: {
    quotes: ["error", "single"],
    "max-len": [
      "error",
      {
        code: 80,
        tabWidth: 2,
        ignoreComments: true,
        ignoreTrailingComments: true,
        ignoreUrls: true,
        ignoreStrings: true,
        ignoreTemplateLiterals: true
      }
    ],
    "prefer-const": "error"
  }
};
