import { Html, Head, Main, NextScript } from "next/document";
import { ColorModeScript } from '@chakra-ui/react';
// 1. Import the extendTheme function
import { extendTheme } from '@chakra-ui/react'

// 2. Extend the theme to include custom colors, fonts, etc
const colors = {
  brand: {
    900: '#1a365d',
    800: '#153e75',
    700: '#2a69ac',
  },
}

const theme = extendTheme({ colors })

export default function Document() {
  return (
    <Html>
      <Head />
      <body>
        <ColorModeScript initialColorMode={theme.config.initialColorMode}/>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}

// import { Html, Head, Main, NextScript } from "next/document";
// import { CacheProvider } from '@chakra-ui/next-js';
// import { ChakraProvider } from '@chakra-ui/react';

// 'use client'

// export default function Document() {
//   return (
//     <Html data-theme="corporate">
//       <Head />
//       <body>
//         <CacheProvider>
//           <ChakraProvider>
//             <Main />
//             <NextScript />
//           </ChakraProvider>
//         </CacheProvider>
//       </body>
//     </Html>
//   );
// }