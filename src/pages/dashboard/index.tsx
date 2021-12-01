import { useAuth } from "hooks";
import { useEffect } from "react";
import { HttpClient, setupHttpClient } from "infra/http";

import { withSSRAuth } from "helpers";

export default function Dashboar() {
  const { user } = useAuth();

  useEffect(() => {
    HttpClient.get("/me")
      .then((res) => {})
      .catch((err: any) => {
        console.log(err.message);
      });
  }, []);

  return <h1>User logged {user?.email}</h1>;
}

export const getServerSideProps = withSSRAuth(async (ctx) => {
  const HttpRequest = setupHttpClient(ctx);

  const response = await HttpRequest.get("/me");

  console.log(response.data);

  return {
    props: {},
  };
});
