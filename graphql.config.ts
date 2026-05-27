import type { IGraphQLConfig } from "graphql-config";

const config: IGraphQLConfig = {
  schema: [
    // Local schema file (generated from Pothos)
    "schema.graphql",
  ],
  documents: [
    // All GraphQL operations in the project
    "app/**/*.{ts,tsx}",
    "components/**/*.{ts,tsx}",
    "lib/**/*.{ts,tsx}",
    "hooks/**/*.{ts,tsx}",
  ],
};

export default config;
