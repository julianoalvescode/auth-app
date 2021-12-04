import type { AppProps } from "next/app";

import { ContextProvider } from "presentation/context";
import { ChakraProvider } from "@chakra-ui/react";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider>
      <ContextProvider>
        <Component {...pageProps} />
      </ContextProvider>
    </ChakraProvider>
  );
}

export default MyApp;
