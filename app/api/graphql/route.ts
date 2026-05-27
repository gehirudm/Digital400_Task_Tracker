import { createYoga } from "graphql-yoga";

import { createContext } from "@/lib/graphql/context";
import { schema } from "@/lib/graphql/schema";

const yoga = createYoga({
  schema,
  context: createContext,
  graphqlEndpoint: "/api/graphql",
  fetchAPI: { Response },
});

async function handleRequest(request: Request) {
  return yoga.fetch(request);
}

export { handleRequest as GET, handleRequest as POST };
