import { useAuth } from "hooks";
import { useEffect } from "react";
import { HttpClient } from "infra/http/axios-http-client";

export default function Dashboar() {
  const { user } = useAuth();

  useEffect(() => {
    HttpClient.get("/me")
      .then((res) => console.log(res))
      .catch((err: any) => {
        console.log(err.message);
      })
      .finally((e: any) => console.log(e?.message));
  }, []);

  return <h1>User logged {user?.email}</h1>;
}
