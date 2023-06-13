import { ApolloClient, InMemoryCache } from "@apollo/client";

const client = new ApolloClient({
  ssrMode: true,
  uri: `${process.env.NEXT_PUBLIC_LOCAL_HOST}/api/graphql`,
  cache: new InMemoryCache(),
});

export default client;
