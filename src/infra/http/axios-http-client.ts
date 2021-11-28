import axios, { AxiosError } from "axios";
import { signOut } from "context/Auth";
import { parseCookies, setCookie } from "nookies";

let cookies = parseCookies();
let isRefreshing = false;
let failedRequestQueue: any = [];

export const HttpClient = axios.create({
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
        cookies = parseCookies();

        const { "nextauth.refresh-token": refreshToken } = cookies;
        const originalConfig = error.config;

        if (!isRefreshing) {
          isRefreshing = true;

          HttpClient.post("/refresh", {
            refreshToken,
          })
            .then((response) => {
              const { token } = response.data;

              setCookie(undefined, "nextauth.token", token, {
                maxAge: 60 * 60 * 24 * 30, // 30 days,
                path: "/",
              });
              setCookie(
                undefined,
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
            })
            .finally(() => {
              isRefreshing = false;
            });
        }

        return new Promise((resolve, reject) => {
          failedRequestQueue.push({
            onSuccess: (token: string) => {
              originalConfig.headers["Authorization"] = `Bearer ${token}`;

              resolve(HttpClient(originalConfig));
            },
            onFailure: (err: AxiosError) => {
              reject(err);
            },
          });
        });
      } else {
        signOut();
      }
    }
    return Promise.reject(error);
  }
);
