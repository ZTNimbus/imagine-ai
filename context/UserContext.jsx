"use client";

import { createContext, useContext, useState } from "react";

const UserContext = createContext();

const initialState = "";

function UserProvider({ children }) {
  const [user, setUser] = useState(initialState);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
}

function useUser() {
  const context = useContext(UserContext);

  if (context === undefined)
    throw new Error("Context was used outside of provider.");

  return context;
}

export { UserProvider, useUser };
