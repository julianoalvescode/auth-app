import { createContext, useEffect, useState } from "react";
import { setCookie, parseCookies, destroyCookie } from "nookies";

import * as I from "./types";
import Router from "next/router";
import { HttpClient } from "infra/http/axios-http-client";
export const AuthContext = createContext({} as I.AuthContextData);

export function signOut(): void {
  destroyCookie(undefined, "nextauth.token");
  destroyCookie(undefined, "nextauth.refresh-token");

  Router.push("/");
}

export function AuthContextProvider({ children }: I.AuthContextProvider) {
  const [user, setUser] = useState<I.User>({} as I.User);
  const isAuthenticated = !!user;

  useEffect(() => {
    const { "nextauth.token": token } = parseCookies();

    if (token) {
      HttpClient.get("/me")
        .then((response) => {
          const { email, permissions, roles } = response.data;

          setUser({ email, permissions, roles });
        })
        .catch(() => {
          signOut();
        });
    }
  }, []);

  async function signIn({
    email,
    password,
  }: I.SignInCredentials): Promise<void> {
    try {
      const { data: response } = await HttpClient.post<I.SessionResponse>(
        "/sessions",
        {
          email,
          password,
        }
      );

      const { token, refreshToken } = response;

      setCookie(undefined, "nextauth.token", token, {
        maxAge: 60 * 60 * 24 * 30, // 30 days,
        path: "/",
      });
      setCookie(undefined, "nextauth.refresh-token", refreshToken, {
        maxAge: 60 * 60 * 24 * 30, // 30 days,
        path: "/",
      });

      setUser({ ...response, email });

      HttpClient.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      Router.push("/dashboard");
    } catch (e: any) {
      console.log(e?.message);
    }
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, signIn, user }}>
      {children}
    </AuthContext.Provider>
  );
}
