import { useCan } from "presentation/hooks";
import * as I from "./types";
export function Can({ permissions = [], roles = [], children }: I.CanProps) {
  const userCanSeeComponent = useCan({ permissions, roles });

  if (!userCanSeeComponent) {
    return null;
  }

  return <>{children}</>;
}
