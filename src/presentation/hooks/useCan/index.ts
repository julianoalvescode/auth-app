import { validateUserPermissions } from "presentation/helpers/validateUserPermissions";
import { useAuth } from "presentation/hooks";
import * as I from "./types";

export function useCan({ roles = [], permissions = [] }: I.UseCanParams) {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return false;
  }

  const userHasValidPermissions = validateUserPermissions({
    user,
    permissions,
    roles,
  });

  return userHasValidPermissions;
}
