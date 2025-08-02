// AlertDialogDelete Component: Displays a delete confirmation dialog using Chakra UI.
// Props:
// - handleDelete: Function to handle the delete action when confirmed.
// - id: The identifier of the item to delete.
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
} from "@chakra-ui/react";
import React from "react";
import { RiDeleteBinLine } from "react-icons/ri";
import { useSelector } from "react-redux";
interface Props {
  handleDelete: (id: number) => void;
  id: number;
}

interface Loading {
  loading: boolean;
}

const AlertDialogDelete: React.FC<Props> = ({ handleDelete, id }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = React.useRef<HTMLButtonElement>(null);
  const { loading } = useSelector((state: { common: Loading }) => state.common);
  const onDeleteClick = () => {
    handleDelete(id);
    onClose();
  };

  return (
    <>
      <Box onClick={onOpen}>
        <RiDeleteBinLine color="red" size={18} cursor={"pointer"} />
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
              Delete
            </AlertDialogHeader>

            <AlertDialogBody>
              Are you sure? You can't undo this action afterwards.
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button
                size="sm"
                fontWeight={"medium"}
                ref={cancelRef}
                onClick={onClose}
              >
                Cancel
              </Button>
              <Button
                size="sm"
                fontWeight={"medium"}
                isLoading={loading}
                loadingText="Please wait..."
                colorScheme="red"
                onClick={onDeleteClick}
                ml={3}
              >
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
};
export default AlertDialogDelete;
