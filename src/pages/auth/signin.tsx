"use client";

import React, { useState } from "react";
import { useSession } from "next-auth/react"
import { SignInPanel } from "~/components/SignInPanel";
import { SignUpPanel } from "~/components/SignUpPanel";
import { useRouter } from 'next/router';
import { Flex, Stack, Image } from "@chakra-ui/react";

export default function SignIn(): JSX.Element {
  const session = useSession();
  const router = useRouter();
  const [showSignUp, setShowSignUp] = useState<boolean>(false);

  function onChange(data: boolean) {
    setShowSignUp(data)
  }

  if (session?.data?.user) {
    router.back();
    router.back();
  }

  return (
    <Stack minH={'100vh'} direction={{ base: 'column', md: 'row' }}>
      <Flex p={8} flex={1} align={'center'} justify={'center'} overflow={'hidden'} >
        {showSignUp ? (
          <SignUpPanel onChange={onChange} />
        ) : (
          <SignInPanel onChange={onChange} />
        )}
      </Flex>

      <Flex flex={1}>
        <Image
          alt={'Login Image'}
          objectFit={'cover'}
          src={
            'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1352&q=80'
          }
        />
      </Flex>
    </Stack>
  )

}
