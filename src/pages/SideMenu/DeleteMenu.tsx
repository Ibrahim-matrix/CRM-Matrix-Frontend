import React from "react";
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
import axios from "axios";
import Cookies from "js-cookie";
import { BsFillTrashFill } from "react-icons/bs";
import { BASE_URL_SUPERADMIN } from "../../config/RequestMethod";

interface Props {
  menuItem: string;
  fetchData: () => void;
}

const token = Cookies.get("token");
const deleteMenuItem = (menuItem: any) => {
  console.log(menuItem);
  return axios.delete(`${BASE_URL_SUPERADMIN}sideMenu?menuItem=${menuItem}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

const DeleteMenu: React.FC<Props> = ({ menuItem, fetchData }) => {
  console.log(menuItem);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = React.useRef<HTMLButtonElement>(null);

  const handleDelete = () => {
    // Perform the update logic using the updateMenuItem function
    deleteMenuItem(menuItem)
      .then(() => {
        fetchData();
        onClose(); // Close the dialog on success
      })
      .catch((error) => {
        console.error("Error updating menu item:", error);
      });
    //   window.location.reload()
  };

  return (
    <>
      <Box onClick={onOpen}>
        <Button ml={2} colorScheme="red" size="sm" color={"white"}>
          <BsFillTrashFill />
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
              Delete SideMenu Item
            </AlertDialogHeader>

            <AlertDialogBody>
              <Box>{`Are you sure! You want to delete`}</Box>
              <Box fontWeight={"bold"}>({menuItem})</Box>
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button
                ref={cancelRef}
                onClick={onClose}
                size="sm"
                fontWeight={"medium"}
              >
                Cancel
              </Button>
              <Button
                fontWeight={"medium"}
                size="sm"
                loadingText="Please wait..."
                colorScheme="red"
                ml={3}
                onClick={() => handleDelete()}
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

export default DeleteMenu;
