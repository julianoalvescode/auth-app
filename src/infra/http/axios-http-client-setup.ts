import axios, { AxiosError } from "axios";
import { signOut } from "presentation/context/Auth";
import { AuthTokenError } from "main/errors/auth-token";
import { GetServerSidePropsContext } from "next";
import { parseCookies, setCookie } from "nookies";

let isRefreshing = false;
let failedRequestQueue: any = [];
type Context = undefined | GetServerSidePropsContext;
export function setupHttpClient(ctx: Context) {
  let cookies = parseCookies(ctx);

  const HttpClient = axios.create({
    baseURL: "http://localhost:3333",
    headers: {
      Authorization: `Bearer ${cookies["nextauth.token"]}`,
    },
  });

  HttpClient.interceptors.response.use(
    (response) => {
      return response;
    },
    (error: AxiosError) => {
      if (error.response?.status === 401) {
        if (error.response?.data?.code === "token.expired") {
          cookies = parseCookies(ctx);

          const { "nextauth.refresh-token": refreshToken } = cookies;
          const originalConfig = error.config;

          if (!isRefreshing) {
            isRefreshing = true;

            HttpClient.post("/refresh", {
              refreshToken,
            })
              .then((response) => {
                const { token } = response.data;

                setCookie(ctx, "nextauth.token", token, {
                  maxAge: 60 * 60 * 24 * 30, // 30 days,
                  path: "/",
                });
                setCookie(
                  ctx,
                  "nextauth.refresh-token",
                  response.data.refreshToken,
                  {
                    maxAge: 60 * 60 * 24 * 30, // 30 days,
                    path: "/",
                  }
                );

                HttpClient.defaults.headers.common[
                  "Authorization"
                ] = `Bearer ${token}`;

                failedRequestQueue.forEach((request: any) =>
                  request.onSuccess(token)
                );
                failedRequestQueue = [];
              })
              .catch((err) => {
                failedRequestQueue.forEach((request: any) =>
                  request.onFailure(err)
                );
                failedRequestQueue = [];

                if (process.browser) {
                  signOut();
                }
              })
              .finally(() => {
                isRefreshing = false;
              });
          }

          return new Promise((resolve, reject) => {
            failedRequestQueue.push({
              onSuccess: (token: string) => {
                originalConfig.headers = {
                  Authorization: `Bearer ${token}`,
                };

                resolve(HttpClient(originalConfig));
              },
              onFailure: (err: AxiosError) => {
                reject(err);
              },
            });
          });
        } else {
          if (process.browser) {
            signOut();
          } else {
            return Promise.reject(new AuthTokenError());
          }
        }
      }
      return Promise.reject(error);
    }
  );

  return HttpClient;
}
