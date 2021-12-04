import { AuthTokenError } from "main/errors/auth-token";
import {
  GetServerSideProps,
  GetServerSidePropsContext,
  GetServerSidePropsResult,
} from "next";
import { destroyCookie, parseCookies } from "nookies";
import decode from "jwt-decode";
import { validateUserPermissions } from "./validateUserPermissions";
import { User } from "domain/models";

type WithSSROptions = {
  permissions: string[];
  roles: string[];
};

export function withSSRAuth<P>(
  fn: GetServerSideProps<P>,
  options?: WithSSROptions
) {
  return async (
    ctx: GetServerSidePropsContext
  ): Promise<GetServerSidePropsResult<P>> => {
    const cookies = parseCookies(ctx);
    const token = cookies["nextauth.token"];

    if (!token) {
      return {
        redirect: {
          destination: "/",
          permanent: false,
        },
      };
    }

    if (options) {
      const user = decode<User>(token);
      const { permissions, roles } = options;

      const userHasValidPermissions = validateUserPermissions({
        user,
        permissions,
        roles,
      });

      if (!userHasValidPermissions) {
        return {
          redirect: {
            permanent: false,
            destination: "/dashboard",
          },
        };
      }
    }

    try {
      return await fn(ctx);
    } catch (err) {
      if (err instanceof AuthTokenError) {
        destroyCookie(ctx, "nextauth.token");
        destroyCookie(ctx, "nextauth.refresh-token");

        return {
          redirect: {
            destination: "/",
            permanent: false,
          },
        };
      }

      return await fn(ctx);
    }
  };
}
