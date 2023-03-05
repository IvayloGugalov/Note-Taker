import { useState } from "react";

import {
  Box,
  Button,
  Heading,
  Input,
  VStack,
  useColorModeValue
} from '@chakra-ui/react';
import CodeMirror from "@uiw/react-codemirror";
import { markdown, markdownLanguage } from "@codemirror/lang-markdown";
import { languages } from "@codemirror/language-data";

export const NoteEditor = ({
  onSave,
}: {
  onSave: (note: { title: string; content: string }) => void;
}) => {
  const [code, setCode] = useState<string>("");
  const [title, setTitle] = useState<string>("");

  return (
    <VStack
      width='100%'
      display='flex'
      px='8'
      py='4'
      flexDirection='column'
      position='relative'
      border='2px'
      borderColor={useColorModeValue('gray.200', 'gray.400')}
      rounded='xl'
      shadow='xl'
      _focus={{ outline: '2px solid transparent', outlineOffset: '2px'}}
    >
      <Box
        width='full'
        display='flex'
        flex='1 1 auto'
        flexDirection='column'
        gap='4'
      >
        <Heading
          as='h2'
          gap='4'
          fontWeight='600'
        >
          <Input
            type="text"
            placeholder="Note title"
            value={title}
            onChange={(e) => setTitle(e.currentTarget.value)}
          />
        </Heading>
        <CodeMirror
          value={code}
          minWidth="100%"
          minHeight="10rem"
          extensions={[
            markdown({ base: markdownLanguage, codeLanguages: languages }),
          ]}
          onChange={(value) => setCode(value)}
          theme={useColorModeValue('light', 'dark')}
        />
      </Box>
      <Box
        width='100%'
        justifyContent='flex-start'
        display='flex'
        flexWrap='wrap'
        alignItems='flex-start'
        gap='0.5rem'
      >
        <Button
          width='24'
          mt='2'
          display='inline-flex'
          cursor='pointer'
          justifyContent='center'
          alignItems='center'
          colorScheme='cyan'
          variant='outline'
          onClick={() => {
            if (title.trim().length > 0) {
              onSave({
                title,
                content: code,
              });
              setCode("");
              setTitle("");
            }
          }}
          isDisabled={title.trim().length === 0 || code.trim().length === 0}
        >
          Save
        </Button>
      </Box>
    </VStack>
  );
};
