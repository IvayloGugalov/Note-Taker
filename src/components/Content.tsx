import { useState } from "react";
import { useSession } from "next-auth/react";

import { type RouterOutputs } from "~/utils/api";
import { NotesPanel } from "./NotesPanel";
import { TopicsPanel } from "./TopicsPanel";

import {
  Center,
  Heading,
  VStack,
  Flex,
  Divider,
  useBreakpointValue,
  DividerProps
} from '@chakra-ui/react'

type Topic = RouterOutputs["topic"]["getAll"][0];

export const Content: React.FC = () => {
  const { data: sessionData } = useSession();

  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);
  const centerDividerOrientation = useBreakpointValue<DividerProps["orientation"]>({ base:'vertical', lg:'horizontal' });

  if (!sessionData?.user) {
    return (
      <Center w="100%" height={'10rem'}>
        <Heading as='h1' size='2xl' fontWeight='semibold'>Please Sign in</Heading>
      </Center>
    )
  }

  return (
    <Flex p='5' w='full' h='full' position={'relative'} flexDirection={{ base: 'column', lg: 'row' }}>
      <VStack width={{ base: '100%', lg:'25%' }} pr='2'>
        <TopicsPanel selectedTopic={selectedTopic} setSelectedTopic={setSelectedTopic} />
      </VStack>
      <Divider
        my={3}
        backgroundColor='blackAlpha.400'
        height={centerDividerOrientation === 'horizontal' ? '85vh' : 0.5}
        width={centerDividerOrientation === 'vertical' ? '100vw' : 0.5}
        orientation={centerDividerOrientation}
      />
      <VStack width={{ base:'full', lg:'75%' }} px='4' height='full'>
        <NotesPanel selectedTopic={selectedTopic} />
      </VStack>
    </Flex>
  );
};
