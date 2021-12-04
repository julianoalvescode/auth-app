import React from "react";
import { User } from "domain/models";

export type SessionResponse = {
  permissions: string[];
  roles: string[];
  refreshToken: string;
  token: string;
};

export type MeResponse = User;

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
