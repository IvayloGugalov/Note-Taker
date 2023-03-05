import React from 'react'
import { Box, useColorModeValue } from '@chakra-ui/react';
import { useSession } from 'next-auth/react';

import { api, type RouterOutputs } from "~/utils/api";
import { NoteCard } from './NoteCard';
import { NoteEditor } from './NoteEditor';
import { useSetAlert, Alert } from '~/store/alertStore';

interface NotesPanelProps {
  selectedTopic: Topic | null
}

type Topic = RouterOutputs["topic"]["getAll"][0];

export const NotesPanel = ({ selectedTopic }: NotesPanelProps) => {

  const { data: sessionData } = useSession();
  const setAlert = useSetAlert();

  const { data: notes, refetch: refetchNotes } = api.note.getAll.useQuery(
    {
      topicId: selectedTopic?.id ?? "",
    },
    {
      enabled: sessionData?.user !== undefined && selectedTopic !== null,
    }
  );

  const createNote = api.note.create.useMutation({
    onSuccess: () => {
      void refetchNotes();
      const alert: Alert = {
        showAlert: true,
        alertType: 'SUCCESS',
        alertMessage: "Successfully created a new note"
      }
      setAlert(alert);
    },
  });

  const deleteNote = api.note.delete.useMutation({
    onSuccess: () => {
      void refetchNotes();
      const alert: Alert = {
        showAlert: true,
        alertType: 'WARNING',
        alertMessage:  "Successfully deleted a note 🗑️"
      }
      setAlert(alert);
    },
  });

  return (
    <>
      <Box width='full' mb='2.5'>
        <NoteEditor
          onSave={({ title, content }) => {
            void createNote.mutate({
              title,
              content,
              topicId: selectedTopic?.id ?? "",
            });
          }}
        />
      </Box>

      <Box
        width='full'
        display={'grid'}
        gridTemplateColumns={{ base: 'repeat(1, 1fr)', lg: 'repeat(2, 1fr)' }}
        gridAutoFlow={'dense'}
        columnGap={'10px'}
        maxH='30rem'
        border='2px'
        rounded='xl'
        p='4'
        overflowY='auto'
        borderColor={useColorModeValue('gray.200', 'gray.400')}
      >
        {notes?.map((note) => (
          <NoteCard
            key={note.id}
            note={note}
            onDelete={() => void deleteNote.mutate({ id: note.id })}
          />
        ))}
      </Box>
    </>
  )
}
