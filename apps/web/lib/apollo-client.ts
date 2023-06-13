import { ApolloClient, InMemoryCache } from "@apollo/client";

const client = new ApolloClient({
  ssrMode: true,
  uri: "/api/graphql",
  cache: new InMemoryCache(),
});

export default client;
