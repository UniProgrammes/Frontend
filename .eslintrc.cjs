/**
 * @type {import("eslint").Linter.Config}
 */
const config = {
  root: true,
  env: {
    browser: true,
    es2021: true
  },
  extends: ["plugin:@typescript-eslint/recommended", "prettier"],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: 2021,
    project: ["tsconfig.json"],
    sourceType: "module"
  },
  plugins: ["react", "@typescript-eslint", "react-hooks", "import", "unicorn"],
  rules: {
    "react-hooks/rules-of-hooks": "error",
    "react-hooks/exhaustive-deps": "warn",
    "react/jsx-curly-brace-presence": ["error", { props: "never", children: "ignore" }],
    "react/react-in-jsx-scope": "off",
    "no-console": ["error"],
    "import/order": [
      "error",
      {
        groups: [["builtin", "external"], ["internal"], ["parent", "sibling", "index"]],
        "newlines-between": "always",
        pathGroups: [
          {
            pattern: "react",
            group: "external",
            position: "before"
          }
        ],
        pathGroupsExcludedImportTypes: ["builtin"],
        alphabetize: {
          order: "asc",
          caseInsensitive: true
        }
      }
    ],
    "@typescript-eslint/no-unused-vars": [
      "error",
      {
        argsIgnorePattern: "^_"
      }
    ],
    "@typescript-eslint/ban-ts-comment": 2,
    "@typescript-eslint/ban-tslint-comment": 2,
    "@typescript-eslint/ban-types": 2,
    "@typescript-eslint/class-literal-property-style": 2,
    "@typescript-eslint/consistent-indexed-object-style": 2,
    "@typescript-eslint/no-misused-new": 2,
    "@typescript-eslint/no-namespace": 2,
    "@typescript-eslint/no-non-null-asserted-nullish-coalescing": 2,
    "@typescript-eslint/no-non-null-asserted-optional-chain": 2,
    "@typescript-eslint/no-non-null-assertion": 0,
    "@typescript-eslint/no-require-imports": 2,
    "@typescript-eslint/no-unnecessary-type-constraint": 2,
    "@typescript-eslint/no-unsafe-member-access": 2,
    "@typescript-eslint/no-unsafe-return": 2,
    "@typescript-eslint/no-var-requires": 2,
    "@typescript-eslint/prefer-includes": 2,
    "@typescript-eslint/prefer-namespace-keyword": 2,
    "@typescript-eslint/prefer-reduce-type-parameter": 2,
    "@typescript-eslint/prefer-return-this-type": 2,
    "@typescript-eslint/prefer-string-starts-ends-with": 2,
    "@typescript-eslint/prefer-ts-expect-error": 2,
    "@typescript-eslint/promise-function-async": 2,
    "@typescript-eslint/typedef": 2,
    "@typescript-eslint/default-param-last": 2,
    "@typescript-eslint/no-redeclare": 2,
    "@typescript-eslint/no-unused-expressions": 2,
    "@typescript-eslint/no-empty-interface": 0,
    "@typescript-eslint/no-shadow": 0
  }
};

module.exports = config;
