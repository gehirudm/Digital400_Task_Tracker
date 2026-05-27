import SchemaBuilder from "@pothos/core";
import { GraphQLScalarType, Kind } from "graphql";

const DateTimeScalar = new GraphQLScalarType({
  name: "DateTime",
  description: "ISO 8601 date-time string",
  serialize(value) {
    if (value instanceof Date) return value.toISOString();
    return value;
  },
  parseValue(value) {
    if (typeof value === "string") return new Date(value);
    return value;
  },
  parseLiteral(ast) {
    if (ast.kind === Kind.STRING) return new Date(ast.value);
    return null;
  },
});

export const builder = new SchemaBuilder<{
  Context: {
    userId: string | null;
  };
  Scalars: {
    DateTime: {
      Input: Date;
      Output: Date;
    };
  };
}>({});

builder.addScalarType("DateTime", DateTimeScalar);

builder.queryType({});
builder.mutationType({});
