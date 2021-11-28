import React from "react";

export type User = {
  email: string;
  permissions: string[];
  roles: string[];
};

export type SessionResponse = {
  permissions: string[];
  roles: string[];
  refreshToken: string;
  token: string;
};

export type MeResponse = {
  email: string;
  permissions: string[];
  roles: string[];
};

export type AuthContextData = {
  signIn(credentials: SignInCredentials): Promise<void>;
  user: User;
  isAuthenticated: boolean;
};

export type AuthContextProvider = {
  children: React.ReactNode;
};

export type SignInCredentials = {
  email: string;
  password: string;
};
