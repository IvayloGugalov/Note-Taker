import React, { useEffect } from 'react'
import { ALERT_TYPE } from '~/types/alert-types';

import { Alert as ChakraAlert, AlertIcon, Box, CloseButton, Flex } from '@chakra-ui/react';
import { Alert as AlertInterface, useAlert, useSetAlert } from '~/store/alertStore';

export const Alert = () => {
  const alert = useAlert();
  const setAlert = useSetAlert();

  // useEffect(() => {
  //   const timeout = setTimeout(() => {
  //     console.log('in')
  //     const emtpyAlert: AlertInterface = {
  //       showAlert: false,
  //       alertType: "INFO",
  //       alertMessage: ""
  //     }
  //     setAlert(emtpyAlert);
  //    }, 5000);

  //   return () => {
  //     clearTimeout(timeout);
  //   }
  // }, [])

  if (!alert?.showAlert) {
    return null;
  }

  return (
    <Box position='absolute' bottom={{ base: '-2', lg: '6' }} left={'2'} w='350px'>
      <ChakraAlert status={ALERT_TYPE[alert?.alertType ?? "INFO"]} transition='all 1s' dropShadow='lg' rounded='xl' justifyContent={'space-between'}>
        <Flex>
          <AlertIcon />
          {alert?.alertMessage}
        </Flex>
        <CloseButton
          alignSelf='flex-start'
          position='relative'
          right={-3}
          top={-3}
          onClick={() => {
            const emtpyAlert: AlertInterface = {
              showAlert: false,
              alertType: "INFO",
              alertMessage: ""
            }
            setAlert(emtpyAlert);
          }}
        />
      </ChakraAlert>
    </Box>
  );
}