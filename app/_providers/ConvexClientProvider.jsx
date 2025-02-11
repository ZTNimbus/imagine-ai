"use client";

import { UserProvider } from "@/context/UserContext";
import { ConvexReactClient, ConvexProvider } from "convex/react";

const client = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL);

function ConvexClientProvider({ children }) {
  return (
    <ConvexProvider client={client}>
      <UserProvider>{children}</UserProvider>
    </ConvexProvider>
  );
}

export default ConvexClientProvider;
