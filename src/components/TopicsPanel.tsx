import React, { ReactNode, Dispatch, SetStateAction } from 'react'
import { useSession } from 'next-auth/react';
import {
  useColorModeValue,
  Input,
  Tooltip,
  Box,
  FlexProps,
  Link,
  Flex,
  Select,
  Divider,
} from '@chakra-ui/react';

import { api, type RouterOutputs } from "~/utils/api";
import { CustomModal } from './Modal';
import { useWindowSize } from '~/hooks/useWindowSize';

import { useSetAlert, Alert } from '~/store/alertStore';

interface TopicsPanelProps {
  selectedTopic: Topic | null,
  setSelectedTopic: Dispatch<SetStateAction<Topic | null>>
}
type Topic = RouterOutputs["topic"]["getAll"][0];

interface TopicItemProps extends FlexProps {
  children: ReactNode;
}
const TopicItem = ({ children, ...props }: TopicItemProps) => {
  return (
    <Link
      href="#"
      style={{ textDecoration: 'none' }}
      py='4px'
      _focus={{ boxShadow: 'none',bg: useColorModeValue('cyan.400', 'cyan.900'), }}
    >
      <Flex
        h='10'
        bg={useColorModeValue('white', 'whiteAlpha.300')}
        align="center"
        p="4"
        borderRadius="lg"
        role="group"
        cursor="pointer"
        _hover={{
          bg: useColorModeValue('cyan.400', 'cyan.900'),
          color: 'white',
        }}
        {...props}>
        {children}
      </Flex>
    </Link>
  )
}

export const TopicsPanel = ({ selectedTopic, setSelectedTopic }: TopicsPanelProps) => {

  const { width } = useWindowSize();
  const { data: sessionData } = useSession();
  const setAlert = useSetAlert();

  const { data: topics, refetch: refetchTopics } = api.topic.getAll.useQuery(
    undefined, // no input
    {
      enabled: sessionData?.user !== undefined,
      onSuccess: (data) => {
        setSelectedTopic(selectedTopic ?? data[0] ?? null);
      },
    }
  );

  const createTopic = api.topic.create.useMutation({
    onSuccess: () => {
      void refetchTopics();
      const alert: Alert = {
        showAlert: true,
        alertType: 'SUCCESS',
        alertMessage:  "Successfully created a topic 🕯️"
      }
      setAlert(alert);
    },
  });

  return (
    <>
      <CustomModal
        header={'Create a New Topic'}
        body={
          <Tooltip hasArrow label="Press Enter to Save" bg="skyblue" placement="top" arrowSize={8} closeDelay={200}>
          <Input
            type="text"
            width='full'
            variant='filled'
            placeholder="New Topic ✏️"
            htmlSize={7}
            onKeyDown={(e) => {
              if (e.key === "Enter" && e.currentTarget.value.trim() != "") {
                createTopic.mutate({
                  title: e.currentTarget.value,
                });
                e.currentTarget.value = "";
              }
            }}
          />
          </Tooltip>
        }
      />
      {width && width >= 992
        ? (
        <>
          <Divider orientation='horizontal' backgroundColor='blackAlpha.400' height='0.5' />
          <Box
            bg={useColorModeValue('white', 'gray.900')}
            display='grid'
            maxHeight='30rem'
            overflowY='auto'
            p='4'
            w='full'
            border='2px'
            gap={'2'}
            rounded='xl'
            borderColor={useColorModeValue('gray.200', 'gray.500')}
          >
            {topics?.map((topic) => (
              <TopicItem
                key={topic.id}
                onClick={(evt) => {
                  evt.preventDefault();
                  setSelectedTopic(topic);
                }}
              >
                {topic.title}
              </TopicItem>
            ))}
          </Box>
        </>
      ) : (
        <>
          <Select
            maxWidth='20rem'>
            {topics?.map((topic) => (
              <option key={topic.id}>{topic.title}</option>
            ))}
          </Select>
        </>
      )
    }
    </>
  )
}
