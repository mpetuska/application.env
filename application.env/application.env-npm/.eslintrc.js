module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: ["google", "plugin:prettier/recommended"],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: 12,
    sourceType: "module",
    project: `${__dirname}/tsconfig.json`,
  },
  plugins: ["@typescript-eslint"],
  rules: {},
};
