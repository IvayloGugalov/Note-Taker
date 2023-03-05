import React from 'react'
import { signIn, signOut, useSession } from "next-auth/react";

import {
  Box,
  useColorModeValue,
  useDisclosure,
  useColorMode,
  Flex,
  IconButton,
  HStack,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Button,
  Avatar,
  Stack,
  Heading
} from '@chakra-ui/react';
import { HamburgerIcon, CloseIcon, MoonIcon, SunIcon } from '@chakra-ui/icons';

export const Header = () => {
  const { data: sessionData}  = useSession();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { colorMode, toggleColorMode } = useColorMode();

  return (
    <Box bg={useColorModeValue('skyblue', 'blue.900')} px={4}>
      <Flex height={16} alignItems={'center'} justifyContent={'space-between'}>
        <IconButton
          size={'md'}
          icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
          aria-label={'Open Menu'}
          display={{ md: 'none' }}
          onClick={isOpen ? onClose : onOpen}
        />
        <HStack spacing={8} alignItems={'center'}>
          <HStack
            as={'nav'}
            spacing={4}
            display={{ base: 'none', md: 'flex' }}
          >
            {/* Add Navlinks here */}
          </HStack>
          <Heading as='h3' size={{ base: 'md', md:'xl'}} color={useColorModeValue('black', 'white')} >
              {sessionData?.user?.name ? `Notes for ${sessionData.user.name}` : ""}
          </Heading>
        </HStack>

        <Flex alignItems={'center'}>
          <Stack direction={'row'} spacing={8} alignItems='center'>
            <Button onClick={toggleColorMode}>
              {colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
            </Button>
            {sessionData?.user ? (
              <Menu isLazy>
                <MenuButton
                  as={Button}
                  rounded={'full'}
                  variant={'link'}
                  cursor={'pointer'}
                  _active={{ boxShadow: 'outline' }}
                  transition='all 0.2s'
                  minW={0}
                >
                  <Avatar
                    size={'md'}
                    name={sessionData?.user?.name ?? ""}
                    src={sessionData?.user?.image ?? ""}
                  />
                </MenuButton>
                <MenuList py='1' px='2'>
                  <MenuItem
                    w="100%"
                    _hover={{ bg: useColorModeValue('gray.200', 'gray.600') }}
                    rounded='md'
                    onClick={() => void signOut()}
                  >
                    Sign out
                  </MenuItem>
                </MenuList>
              </Menu>
            ) : (
              <Button
                onClick={() => void signIn()}
                rounded='xl'
                cursor={'pointer'}
                _hover={{
                  bg: useColorModeValue('white', 'gray.500'),
                  color: useColorModeValue('teal.400', 'teal.200')
                }}
              >
                Sign in
              </Button>
            )}
          </Stack>
        </Flex>
      </Flex>
      {isOpen ? (
        <Box pb={4} display={{ md: 'none' }}>
          <Stack as={'nav'} spacing={4}>
            {/* Add Navlinks here */}
          </Stack>
        </Box>
      ) : null}
    </Box>
  )
};