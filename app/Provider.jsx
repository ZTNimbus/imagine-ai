"use client";

import Header from "@/components/Header";
import { MessagesProvider } from "@/context/MessagesContext";
import { ThemeProvider as NextThemesProvider } from "next-themes";

function ThemeProvider({ children }) {
  return (
    <div>
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
    </div>
  );
}

export default ThemeProvider;
