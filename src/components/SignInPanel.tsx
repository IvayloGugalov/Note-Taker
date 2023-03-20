import React, { useState } from 'react'
import { signIn } from "next-auth/react";

import {
  Button,
  Checkbox,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Heading,
  Input,
  Link,
  Stack,
} from '@chakra-ui/react';
import { FormErrors, validateLoginForm } from 'services/validation/validateForm';

interface SignInPanelProps {
  onChange: (data: boolean) => void
}

export const SignInPanel = ({ onChange }: SignInPanelProps) => {
  const [email, setEmail] = useState<string>("ivoto995@abv.bg")
  const [password, setPassword] = useState<string>("123456")
  const [errors, setErrors] = useState<FormErrors | null>();

  const handleCredentialsSubmit = async () => {
    const loginErrors = validateLoginForm({email, password})

    if (!errors) {
      setErrors(loginErrors);
    } else {
      signIn("credentials", { email, password, callbackUrl: '/' })
    }
  }

  return (
    <Stack id='signIn' spacing={4} w={'full'} maxW={'md'} className='slide-in-right'>
      <Heading fontSize={'2xl'}>Sign in to your account</Heading>
      <FormControl id="email" isInvalid={errors?.email ? true : false}>
        <FormLabel>Email address</FormLabel>
        <Input type="email" value={email} onChange={e => setEmail(e.target.value)} />
        {errors?.email && (<FormErrorMessage>{errors?.email}</FormErrorMessage>)}
      </FormControl>
      <FormControl id="password" isInvalid={errors?.password ? true : false}>
        <FormLabel>Password</FormLabel>
        <Input type="password" value={password} onChange={e => setPassword(e.target.value)} />
        {errors?.password && (<FormErrorMessage>{errors?.password}</FormErrorMessage>)}
      </FormControl>
      <Stack spacing={6}>
        <Stack
          direction={{ base: 'column', sm: 'row' }}
          align={'start'}
          justify={'space-between'}>
          <Checkbox>Remember me</Checkbox>
          <Link color={'blue.500'}>Forgot password?</Link>
        </Stack>
        <Button
          type='submit'
          colorScheme={'blue'}
          variant={'solid'}
          onClick={handleCredentialsSubmit}
        >
          Sign in
        </Button>

        <Button
          colorScheme={'whatsapp'}
          variant={'outline'}
          leftIcon={githubImage()}
          onClick={() => signIn('github', { callbackUrl: "/"})}
        >
          Sign in with github
        </Button>
      </Stack>
      <Stack
        w={'full'}
        align={'center'}
      >
        <Link onClick={() => onChange(true)} color={'blue.500'}>Register with email</Link>
      </Stack>
    </Stack>
  )
}


const githubImage = () => {
  return (
    <svg height={'24px'} width={'24px'} viewBox='0 0 16 16'>
      <path fillRule="evenodd" d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"></path>
    </svg>
  )
}