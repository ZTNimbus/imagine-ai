"use client";

import Header from "@/components/Header";
import { MessagesProvider } from "@/context/MessagesContext";
import { UserProvider } from "@/context/UserContext";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { ThemeProvider as NextThemesProvider } from "next-themes";

function ThemeProvider({ children }) {
  return (
    <div>
      <GoogleOAuthProvider
        clientId={process.env.NEXT_PUBLIC_GOOGLE_AUTH_CLIENT_ID}
      >
        <UserProvider>
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
        </UserProvider>
      </GoogleOAuthProvider>
    </div>
  );
}

export default ThemeProvider;
