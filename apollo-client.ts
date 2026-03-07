import { ApolloClient, InMemoryCache } from "@apollo/client";
import UploadHttpLink from "apollo-upload-client/UploadHttpLink.mjs";

const client = new ApolloClient({
  link: new UploadHttpLink({
    uri: process.env.NEXT_PUBLIC_GRAPHQL_URI ?? "https://api.bcool.am/graphql",
    // credentials: "include",
  }),
  cache: new InMemoryCache(),
});

export default client;
