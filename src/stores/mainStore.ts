import { create } from "zustand";
import { persist } from "zustand/middleware";

import { User } from "~/types/users";

type SetterProps = {
  isLoggedIn?: boolean;
  accessToken?: string;
  user?: User | null;
}

type StoreType = (set: (data: SetterProps) => void) => {
  isLoggedIn: boolean;
  accessToken: string;
  user: User | null;
  setUser: (user: User | null) => void;
  setAccessToken: (accessToken: string) => void;
  setIsLoggedIn: (isLoggedIn: boolean) => void;
};

const store: StoreType = (set) => ({
  isLoggedIn: false,
  accessToken: "",
  user: null,
  setAccessToken: (accessToken) => set({ accessToken }),
  setUser: (user) => set({ user }),
  setIsLoggedIn: (isLoggedIn) => set({ isLoggedIn }),
});

const persistentStore = persist(store, { name: "mainStore" });
const useMainStore = create(persistentStore);

export default useMainStore;
