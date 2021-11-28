import { AuthContext } from "context/Auth";
import { useContext } from "react";

export function useAuth() {
  const context = useContext(AuthContext);

  return context;
}
