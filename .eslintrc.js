module.exports = {
  root: true,
  env: {
    browser: true,
    es2020: true,
    node: true,
    commonjs: true,
  },
  parser: "@typescript-eslint/parser",
  plugins: [
    "@typescript-eslint",
    "react",
    "standard",
    "react-hooks",
    "import",
    "simple-import-sort",
  ],
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:react/recommended",
    "plugin:react-hooks/recommended",
  ],
  rules: {
    "react/prop-types": 0,
    "@typescript-eslint/explicit-function-return-type": {
      allowExpressions: true,
    },
  },
  parserOptions: {
    project: "./tsconfig.json",
  },
  rules: {
    "react/prop-types": "off",
    "@typescript-eslint/explicit-function-return-type": "off",
    "@typescript-eslint/interface-name-prefix": "off",
    "@typescript-eslint/camelcase": "off",
    "@typescript-eslint/no-var-requires": "off",
    "import/no-relative-parent-imports": "error",
    "import/no-duplicates": "error",
    "import/no-unresolved": "off",
    "simple-import-sort/exports": "error",
    "simple-import-sort/imports": [
      "error",
      {
        groups: [
          // Node.js builtins. You could also generate this regex if you use a `.js` config.
          // For example: `^(${require("module").builtinModules.join("|")})(/|$)`
          [
            "^(assert|buffer|child_process|cluster|console|constants|crypto|dgram|dns|domain|events|fs|http|https|module|net|os|path|punycode|querystring|readline|repl|stream|string_decoder|sys|timers|tls|tty|url|util|vm|zlib|freelist|v8|process|async_hooks|http2|perf_hooks)(/.*|$)",
          ],
          // Packages. `react` related packages come first.
          ["^react", "^@?\\w"],
          // Internal packages.
          ["^(@|@company|@ui|components|utils|config|vendored-lib)(/.*|$)"],
          // Side effect imports.
          ["^\\u0000"],
          // Parent imports. Put `..` last.
          ["^\\.\\.(?!/?$)", "^\\.\\./?$"],
          // Other relative imports. Put same-folder imports and `.` last.
          ["^\\./(?=.*/)(?!/?$)", "^\\.(?!/?$)", "^\\./?$"],
          // Style imports.
          ["^.+\\.(s?css|less)$"],
        ],
      },
    ],
  },
};
