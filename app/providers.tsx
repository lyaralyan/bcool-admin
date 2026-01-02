"use client";

import client from "@/apollo-client";
// import { ThemeProvider } from "@/components/theme-provider";

import { ApolloProvider } from "@apollo/client/react";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ApolloProvider client={client}>
      {/* <ThemeProvider
        attribute="class"
        defaultTheme="light"
        enableSystem
        disableTransitionOnChange> */}
      {children}
      {/* </ThemeProvider> */}
    </ApolloProvider>
  );
}
