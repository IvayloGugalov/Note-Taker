import React, { useState } from 'react'
import { api } from "~/utils/api";

import {
  Button,
  Flex,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Heading,
  Input,
  Link,
  Stack,
} from '@chakra-ui/react';
import { FormErrors, RegistrationForm, validateRegistrationForm } from 'services/validation/validateForm';

interface SignUpPanelProps {
  onChange: (data: boolean) => void
}

export const SignUpPanel = ({ onChange }: SignUpPanelProps) => {

  const [registrationForm, setRegistrationForm] = useState<RegistrationForm>({
    email: 'test-mail@abv.bg',
    password: '123456',
    password2: '123456',
    username: 'Maslotopz'
  });
  const [errors, setErrors] = useState<FormErrors | null>();

  const createUser = api.user.create.useMutation({
    onError: (error) => {
      alert(`${error.message}`)
    }
  });

  const handleRegistrationSubmit = () => {
    const registerErrors = validateRegistrationForm(registrationForm);
    if (Object.keys(registerErrors).length > 0) {
      setErrors(registerErrors);
    } else {
      void createUser.mutateAsync({
        name: registrationForm.username,
        email: registrationForm.email,
        password: registrationForm.password,
        password2: registrationForm.password2
      })
    }
  }

  return (
    <Flex
      id='signUp'
      p={8}
      flex={1}
      align={'center'}
      justify={'center'}
      className='slide-in-right'
    >
      <Stack spacing={4} w={'full'} maxW={'md'}>
        <Heading fontSize={'2xl'}>Sign up</Heading>
        <FormControl id="email" isInvalid={errors?.username ? true : false}>
          <FormLabel>Username</FormLabel>
          <Input type="text" value={registrationForm.username} onChange={e => setRegistrationForm({...registrationForm, username: e.target.value})} />
          {errors?.username && (<FormErrorMessage>{errors?.username}</FormErrorMessage>)}
        </FormControl>
        <FormControl id="email" isInvalid={errors?.email ? true : false}>
          <FormLabel>Email address</FormLabel>
          <Input type="email" value={registrationForm.email} onChange={e => setRegistrationForm({...registrationForm, email: e.target.value})} />
          {errors?.email && (<FormErrorMessage>{errors?.email}</FormErrorMessage>)}
        </FormControl>
        <FormControl id="password" isInvalid={errors?.password ? true : false}>
          <FormLabel>Password</FormLabel>
          <Input type="password" value={registrationForm.password} onChange={e => setRegistrationForm({...registrationForm, password: e.target.value})} />
          {errors?.password && (<FormErrorMessage>{errors?.password}</FormErrorMessage>)}
        </FormControl>
        <FormControl id="password" isInvalid={errors?.password ? true : false}>
          <FormLabel>Repeat password</FormLabel>
          <Input type="password" value={registrationForm.password2} onChange={e => setRegistrationForm({...registrationForm, password2: e.target.value})} />
          {errors?.password2 && (<FormErrorMessage>{errors?.password2}</FormErrorMessage>)}
        </FormControl>
        <Stack spacing={6}>
          <Button
            type='submit'
            colorScheme={'blue'}
            variant={'solid'}
            onClick={handleRegistrationSubmit}
          >
            Sign up
          </Button>
        </Stack>
        <Stack
          w={'full'}
          align={'center'}
        >
          <Link onClick={() => onChange(false)} color={'blue.500'}>Register with email</Link>
        </Stack>
      </Stack>
    </Flex>
  )
}