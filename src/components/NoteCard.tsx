import { useRef, useState } from "react";

import {
  Heading,
  Box,
  Stack,
  Button,
  Collapse,
  useColorModeValue,
  HStack,
} from '@chakra-ui/react';
import {
  ChevronDownIcon,
  ChevronUpIcon
} from '@chakra-ui/icons';

import ReactMarkdown from "react-markdown";
import { type RouterOutputs } from "../utils/api";

type Note = RouterOutputs["note"]["getAll"][0];

export const NoteCard = ({
  note,
  onDelete,
}: {
  note: Note;
  onDelete: () => void;
}) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const obj = useRef(null);

  return (
    <Box
      ref={obj}
      mb={'4'}
      border='1px'
      borderColor={'gray.200'}
      bg={useColorModeValue('white', 'gray.900')}
      boxShadow={'2xl'}
      rounded={'lg'}
      px={6}
      py={4}
    >
      <Stack p={'0'} m={'0'}>
        <HStack
          justifyContent={'space-between'}
          cursor='pointer'
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <Button
            size={'md'}
            w='full'
            py={'7'}
            justifyContent={'space-between'}
            rightIcon={isExpanded ? <ChevronUpIcon boxSize={'6'} /> : <ChevronDownIcon boxSize={'6'} />}
            aria-label={'Open Note card'}
            transitionDuration="200ms"
            bg={isExpanded
              ? useColorModeValue('blackAlpha', 'whiteAlpha.300')
              : useColorModeValue('blackAlpha', 'whiteAlpha.200')}
            color={useColorModeValue('blackAlpha', 'whiteAlpha.800')}
          >
            <Heading as='h3' size={'lg'}>{note.title}</Heading>
          </Button>
        </HStack>

        <Collapse
          in={isExpanded}
          animateOpacity
        >
          <Box
            rounded={'md'}
            my={'2'}
            p={'4'}
            bg={useColorModeValue('blackAlpha.200', 'whiteAlpha.200')}
          >
            <article>
              <ReactMarkdown>{note.content}</ReactMarkdown>
            </article>
          </Box>
        </Collapse>

        <Box display={'flex'} justifyContent={'end'}>
          <Button
            px='5'
            mt={'2'}
            size={'sm'}
            fontSize='md'
            onClick={onDelete}
            colorScheme="yellow"
          >
            Delete
          </Button>
        </Box>
      </Stack>
    </Box>
  );
};