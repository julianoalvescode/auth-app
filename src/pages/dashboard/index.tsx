import { useAuth, useCan } from "presentation/hooks";
import { Can } from "presentation/components";
import { useEffect } from "react";
import { HttpClient, setupHttpClient } from "infra/http";

import { withSSRAuth } from "presentation/helpers";

export default function Dashboard() {
  const { user } = useAuth();

  const useCanSeeMetrics = useCan({
    permissions: ["metrics.list"],
  });

  useEffect(() => {
    HttpClient.get("/me")
      .then((res) => {})
      .catch((err: any) => {
        console.log(err.message);
      });
  }, []);

  return (
    <>
      <h1>User logged {user?.email}</h1>
      <Can permissions={user?.permissions} roles={user?.roles}>
        <div>Métricas</div>
      </Can>
    </>
  );
}

export const getServerSideProps = withSSRAuth(async (ctx) => {
  const HttpRequest = setupHttpClient(ctx);

  const response = await HttpRequest.get("/me");

  return {
    props: {},
  };
});
