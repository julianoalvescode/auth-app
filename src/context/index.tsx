import { ReactNode } from "react";
import { AuthContextProvider } from "./Auth";

export function ContextProvider({ children }: { children: ReactNode }) {
  return <AuthContextProvider>{children}</AuthContextProvider>;
}
