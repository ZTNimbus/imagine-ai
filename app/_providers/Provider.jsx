"use client";

import Header from "@/components/Header";
import { MessagesProvider } from "@/context/MessagesContext";
import { UserProvider, useUser } from "@/context/UserContext";
import { api } from "@/convex/_generated/api";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { useConvex } from "convex/react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { useEffect } from "react";

function Provider({ children }) {
  const convex = useConvex();
  const { user, setUser } = useUser();

  async function isAuthenticated() {
    if (typeof window !== undefined) {
      const user = JSON.parse(localStorage.getItem("user"));

      if (!user) return;

      const result = await convex.query(api.users.GetUser, {
        email: user?.email,
      });

      setUser(result);
    }
  }

  useEffect(() => {
    isAuthenticated();
  }, []);

  return (
    <div>
      <GoogleOAuthProvider
        clientId={process.env.NEXT_PUBLIC_GOOGLE_AUTH_CLIENT_ID}
      >
        <MessagesProvider>
          <NextThemesProvider
            attribute="class"
            enableSystem
            defaultTheme="dark"
            disableTransitionOnChange
          >
            <Header />
            {children}
          </NextThemesProvider>
        </MessagesProvider>
      </GoogleOAuthProvider>
    </div>
  );
}

export default Provider;
