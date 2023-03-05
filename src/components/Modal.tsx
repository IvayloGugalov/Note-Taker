import React from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalCloseButton,
  ModalHeader,
  ModalBody,
  Button,
  ModalFooter,
  useDisclosure
} from "@chakra-ui/react";

interface ModalPros {
  header: string | null,
  body: string | React.ReactNode | null,
  footer?: typeof ModalFooter
}

export const CustomModal = ({ header, body, footer}: ModalPros) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <Button onClick={() => onOpen()}>New Topic ✏️</Button>
      <Modal
        isCentered
        onClose={onClose}
        isOpen={isOpen}
        motionPreset='scale'
      >
        <ModalOverlay bg='blackAlpha.400' backdropFilter='blur(5px)' />
        <ModalContent>
          <ModalHeader my={2} textAlign='center'>{header}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {body}
          </ModalBody>
          {footer ?? (
            <ModalFooter>
              <Button colorScheme='blue' mr={3} onClick={onClose}>
                Close
              </Button>
            </ModalFooter>
          )}
        </ModalContent>
      </Modal>
    </>
  )
}
