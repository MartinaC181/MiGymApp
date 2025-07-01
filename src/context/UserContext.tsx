import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { ClientUser, GymUser } from "../data/Usuario";
import { getCurrentUser, saveSession } from "../utils/storage";

export type UserType = ClientUser | GymUser | null;

interface UserContextProps {
  user: UserType;
  setUser: (user: UserType) => void;
  refreshUser: () => Promise<void>;
}

const UserContext = createContext<UserContextProps | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserType>(null);

  const refreshUser = async () => {
    const current = await getCurrentUser();
    setUser(current);
  };

  useEffect(() => {
    refreshUser();
  }, []);

  // Cuando el usuario cambia, guardar sesión
  useEffect(() => {
    if (user) saveSession(user);
  }, [user]);

  return (
    <UserContext.Provider value={{ user, setUser, refreshUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) throw new Error("useUser debe usarse dentro de UserProvider");
  return context;
};
