import { useAuth } from "presentation/hooks";
import { setupHttpClient } from "infra/http";

import { withSSRAuth } from "presentation/helpers";
import decode from "jwt-decode";

export default function Metrics() {
  const { user } = useAuth();

  return (
    <>
      <h1>Metric</h1>
    </>
  );
}

export const getServerSideProps = withSSRAuth(
  async (ctx) => {
    const HttpRequest = setupHttpClient(ctx);

    const { data } = await HttpRequest.get("/me");

    return {
      props: {},
    };
  },
  {
    permissions: ["metrics.list"],
    roles: ["administrator"],
  }
);
