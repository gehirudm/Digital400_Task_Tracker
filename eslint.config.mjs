import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import js from "@eslint/js";
import gqlEslint from "@graphql-eslint/eslint-plugin";
import tseslint from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";
import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import prettierConfig from "eslint-config-prettier";
import prettierPlugin from "eslint-plugin-prettier";
import promisePlugin from "eslint-plugin-promise";
import securityPlugin from "eslint-plugin-security";
import sonarjs from "eslint-plugin-sonarjs";
import unusedImports from "eslint-plugin-unused-imports";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname);

// ---------------------------------------------------------------------------
// GraphQL schema SDL — loaded from schema.graphql for validation
// ---------------------------------------------------------------------------
const schemaPath = path.resolve(projectRoot, "schema.graphql");
let schemaSDL = "";
try {
  schemaSDL = fs.readFileSync(schemaPath, "utf-8");
} catch {
  // Schema file not found — graphql-eslint will skip schema-dependent checks.
}

// ---------------------------------------------------------------------------
// Final flat config
// ---------------------------------------------------------------------------
const eslintConfig = defineConfig([
  // ====================================================================
  // GLOBAL IGNORES
  // ====================================================================
  globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    "node_modules/**",
    "generated/**",
    "prisma/migrations/**",
    ".pnpm-store/**",
    "coverage/**",
    "instrumentation-client.ts",
    "instrumentation.ts",
    "sentry.client.config.ts",
    "sentry.edge.config.ts",
    "sentry.server.config.ts",
  ]),

  // ====================================================================
  // CORE JAVASCRIPT
  // ====================================================================
  js.configs.recommended,

  // ====================================================================
  // NEXT.JS — core-web-vitals + typescript
  //   Registers plugins: react, react-hooks, import, jsx-a11y, @next/next,
  //   @typescript-eslint
  // ====================================================================
  ...nextVitals,
  ...nextTs,

  // ====================================================================
  // TYPESCRIPT — parser + strict flat config + custom rules
  // ====================================================================
  {
    name: "typescript/parser",
    files: ["**/*.{ts,tsx,mts}"],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        projectService: {
          allowDefaultProject: ["eslint.config.mjs"],
          defaultProject: "tsconfig.json",
        },
        tsconfigRootDir: projectRoot,
      },
    },
  },
  tseslint.configs["flat/recommended"],
  {
    name: "typescript/custom-rules",
    files: ["**/*.{ts,tsx,mts}"],
    plugins: {
      "@typescript-eslint": tseslint,
    },
    rules: {
      "@typescript-eslint/consistent-type-imports": [
        "error",
        { prefer: "type-imports", fixStyle: "separate-type-imports" },
      ],
      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/no-floating-promises": "error",
      "@typescript-eslint/no-unused-vars": "off",
      "@typescript-eslint/prefer-optional-chain": "warn",
      "@typescript-eslint/prefer-nullish-coalescing": "warn",
      "@typescript-eslint/array-type": ["warn", { default: "array-simple" }],
      "@typescript-eslint/consistent-type-assertions": [
        "warn",
        { assertionStyle: "as", objectLiteralTypeAssertions: "never" },
      ],
    },
  },

  // ====================================================================
  // IMPORTS — rules only (plugin registered by Next.js)
  // ====================================================================
  {
    name: "import/rules",
    files: ["**/*.{js,jsx,mjs,ts,tsx,mts,cts}"],
    rules: {
      "import/no-unresolved": "error",
      "import/named": "error",
      "import/namespace": "error",
      "import/default": "error",
      "import/export": "error",
      "import/no-named-as-default": "warn",
      "import/no-named-as-default-member": "warn",
      "import/no-duplicates": "warn",
      "import/order": [
        "error",
        {
          groups: [
            "builtin",
            "external",
            "internal",
            ["parent", "sibling"],
            "index",
            "type",
          ],
          pathGroups: [
            { pattern: "@/**", group: "internal", position: "after" },
          ],
          pathGroupsExcludedImportTypes: ["builtin"],
          "newlines-between": "always",
          alphabetize: { order: "asc", caseInsensitive: true },
        },
      ],
      "import/no-extraneous-dependencies": [
        "error",
        {
          devDependencies: [
            "**/*.test.{ts,tsx}",
            "**/*.spec.{ts,tsx}",
            "**/test/**",
            "eslint.config.mjs",
            "prisma.config.ts",
            "graphql.config.ts",
            "next.config.ts",
            "postcss.config.mjs",
          ],
        },
      ],
    },
    settings: {
      "import/resolver": {
        typescript: { alwaysTryTypes: true, project: "tsconfig.json" },
        node: true,
      },
    },
  },

  // ====================================================================
  // ACCESSIBILITY — supplementary rules (plugin registered by Next.js)
  // ====================================================================
  {
    name: "jsx-a11y/rules",
    files: ["**/*.{jsx,tsx}"],
    rules: {
      "jsx-a11y/anchor-is-valid": [
        "error",
        {
          components: ["Link"],
          specialLink: ["hrefLeft", "hrefRight"],
          aspects: ["invalidHref", "preferButton"],
        },
      ],
      "jsx-a11y/interactive-supports-focus": "error",
      "jsx-a11y/label-has-associated-control": "error",
    },
  },

  // ====================================================================
  // SONARJS — code quality rules
  // ====================================================================
  sonarjs.configs.recommended,
  {
    name: "sonarjs/custom-rules",
    rules: {
      // Relax cognitive complexity slightly (default is 15)
      "sonarjs/cognitive-complexity": ["warn", 20],
      // Allow common patterns like switch without default (use with caution)
      "sonarjs/no-duplicate-string": "warn",
    },
  },

  // ====================================================================
  // PROMISES
  // ====================================================================
  {
    name: "promise",
    plugins: {
      promise: promisePlugin,
    },
    rules: {
      "promise/catch-or-return": "error",
      "promise/always-return": "warn",
      "promise/no-return-wrap": "error",
      "promise/param-names": "error",
      "promise/no-new-statics": "error",
      "promise/valid-params": "error",
      "promise/no-promise-in-callback": "warn",
      "promise/no-callback-in-promise": "warn",
      "promise/no-nesting": "warn",
      "promise/no-return-in-finally": "error",
    },
  },

  // ====================================================================
  // UNUSED IMPORTS — auto-removal on --fix
  // ====================================================================
  {
    name: "unused-imports",
    files: ["**/*.{ts,tsx,mts,js,jsx,mjs}"],
    plugins: {
      "unused-imports": unusedImports,
    },
    rules: {
      "unused-imports/no-unused-imports": "error",
      "unused-imports/no-unused-vars": [
        "error",
        {
          vars: "all",
          varsIgnorePattern: "^_",
          args: "after-used",
          argsIgnorePattern: "^_",
        },
      ],
    },
  },

  // ====================================================================
  // SECURITY
  // ====================================================================
  {
    name: "security",
    files: ["**/*.{ts,tsx,mts,js,jsx,mjs}"],
    plugins: {
      security: securityPlugin,
    },
    rules: {
      "security/detect-eval-with-expression": "error",
      "security/detect-child-process": "warn",
      "security/detect-non-literal-fs-filename": "warn",
      "security/detect-non-literal-require": "warn",
      "security/detect-new-buffer": "error",
      "security/detect-buffer-noassert": "warn",
      "security/detect-disable-mustache-escape": "warn",
      "security/detect-no-csrf-before-method-override": "error",
      "security/detect-possible-timing-attacks": "warn",
      "security/detect-pseudoRandomBytes": "warn",
      "security/detect-unsafe-regex": "warn",
    },
  },

  // ====================================================================
  // GRAPHQL — .graphql files (validated against schema)
  // ====================================================================
  {
    name: "graphql/schema-files",
    files: ["**/*.graphql"],
    plugins: {
      "@graphql-eslint": gqlEslint,
    },
    languageOptions: {
      parser: gqlEslint.parser,
      parserOptions: {
        graphQLConfig: {
          schema: schemaSDL,
        },
      },
    },
    rules: {
      ...gqlEslint.configs["flat/schema-recommended"].rules,
      "@graphql-eslint/require-description": "off",
      "@graphql-eslint/strict-id-in-types": "warn",
      "@graphql-eslint/unique-enum-value-names": "error",
    },
  },

  // ====================================================================
  // GRAPHQL — operations in .ts/.tsx
  // ====================================================================
  {
    name: "graphql/operations-in-code",
    files: ["**/*.{ts,tsx}"],
    plugins: {
      "@graphql-eslint": gqlEslint,
    },
    processor: gqlEslint.processor,
    rules: {
      "@graphql-eslint/no-anonymous-operations": "error",
      "@graphql-eslint/unique-operation-name": "error",
      "@graphql-eslint/match-document-filename": "off",
    },
  },

  // ====================================================================
  // PRETTIER — format-on-lint
  // ====================================================================
  {
    name: "prettier",
    plugins: {
      prettier: prettierPlugin,
    },
    rules: {
      "prettier/prettier": "error",
      "arrow-body-style": "off",
      "prefer-arrow-callback": "off",
    },
  },

  // ====================================================================
  // PRETTIER CONFIG — disables rules that conflict with Prettier
  //   (MUST be last so these overrides take precedence)
  // ====================================================================
  prettierConfig,

  // ====================================================================
  // GLOBAL OVERRIDES
  // ====================================================================
  {
    name: "global/overrides",
    rules: {
      "no-console": ["warn", { allow: ["warn", "error", "info"] }],
    },
  },

  // ====================================================================
  // GENERATED FILES — suppress all rules
  // ====================================================================
  {
    name: "generated/ignore",
    files: ["generated/**", "**/*.generated.*", "next-env.d.ts"],
    rules: {
      ...Object.fromEntries(
        Object.keys(js.configs.recommended.rules ?? {}).map((r) => [r, "off"]),
      ),
      ...Object.fromEntries(
        Object.keys(tseslint.configs["flat/recommended"].rules ?? {}).map(
          (r) => [r, "off"],
        ),
      ),
    },
  },

  // ====================================================================
  // SHADCN ATOMS — relax rules for auto-generated shadcn/ui components
  // ====================================================================
  {
    name: "shadcn/atoms",
    files: ["components/atoms/**"],
    rules: {
      "sonarjs/prefer-read-only-props": "off",
    },
  },
]);

export default eslintConfig;
