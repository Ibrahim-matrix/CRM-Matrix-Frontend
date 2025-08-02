import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  useDisclosure,
  Button,
  Box,
  FormControl,
  FormLabel,
  Image,
} from "@chakra-ui/react";
import React from "react";

interface Props {
  image: string;
}


const AttachmentPopup: React.FC<Props> = ({ image }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const cancelRef = React.useRef<HTMLButtonElement>(null);

  return (
    <>
      <Box onClick={onOpen}>
        <Button
          size="xs"
          fontWeight={"medium"}
          mr="4"
          colorScheme="gray"
          background={"none"}
          color="orange.500"
          px="2"
        >
          Click Here
        </Button>
      </Box>

      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
      >
        <AlertDialogOverlay
          bg="blackAlpha.300"
          backdropFilter="blur(5px) hue-rotate(90deg)"
        >
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              {/* Update Price */}
            </AlertDialogHeader>

            <AlertDialogBody>
              <FormControl variant="floating" id="SourceName">
                <Image src={image} alt="No-image" />

                <FormLabel fontWeight={"400"} color={"gray.600"}>
                  Attachments
                </FormLabel>
              </FormControl>
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button
                ref={cancelRef}
                onClick={onClose}
                fontWeight={"medium"}
                size="sm"
                colorScheme="red"
                ml={3}
              >
                Close
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
};
export default AttachmentPopup;
