"use client";

import "./globals.scss";
import { PropsWithChildren } from "react";
import client from "@/lib/apollo-client";
import { ApolloProvider } from "@apollo/client";

export const App = ({ children }: PropsWithChildren) => (
  <ApolloProvider client={client}>{children}</ApolloProvider>
);
