"use client";

import { createContext, useContext, useState } from "react";

const MessagesContext = createContext();

const initialState = { role: "user", content: "" };

export { MessagesContext };

function MessagesProvider({ children }) {
  const [messages, setMessages] = useState(initialState);

  return (
    <MessagesContext.Provider value={{ messages, setMessages }}>
      {children}
    </MessagesContext.Provider>
  );
}

function useMessages() {
  const context = useContext(MessagesContext);

  if (context === undefined)
    throw new Error("Context was used outside of provider.");

  return context;
}

export { MessagesProvider, useMessages };
