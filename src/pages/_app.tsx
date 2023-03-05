import { type AppType } from "next/app";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { ChakraProvider, extendTheme  } from '@chakra-ui/react';

import { api } from "~/utils/api";
import "~/styles/globals.css";

const theme = extendTheme({
  shadows: { outline: '0 0 0 2px var(--chakra-colors-cyan-500)' },
  components: {
    VStack: {
      defaultProps: {
        focusBorderColor: 'cyan.500',
      }
    }
  }
})

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <SessionProvider session={session}>
      <ChakraProvider theme={theme}>
        <Component {...pageProps} />
      </ChakraProvider>
    </SessionProvider>
  );
};

export default api.withTRPC(MyApp);
