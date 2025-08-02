import React, { useState } from "react";
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
  Input,
} from "@chakra-ui/react";
import { FaEdit } from "react-icons/fa";
import axios from "axios";
import Cookies from "js-cookie";
import { BASE_URL_SUPERADMIN } from "../../config/RequestMethod";

interface Props {
  menuItem: string;
  fetchData: () => void;
}

const token = Cookies.get("token");
export const updateMenuItem = (menuItem: any) => {
  return axios.put(`${BASE_URL_SUPERADMIN}sideMenu`, menuItem, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

const UpdateSideMenu: React.FC<Props> = ({ menuItem, fetchData }) => {
  console.log(menuItem);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = React.useRef<HTMLButtonElement>(null);

  const [selectedMenu, setSelectedMenu] = useState<string>(menuItem); // Initialize with the current menu item
  console.log(selectedMenu);

  const handleUpdate = () => {
    // Perform the update logic using the updateMenuItem function
    updateMenuItem({
      oldMenuItem: menuItem,
      newMenuItem: selectedMenu,
    })
      .then(() => {
        fetchData();
        onClose(); // Close the dialog on success
      })
      .catch((error) => {
        console.error("Error updating menu item:", error);
      });
  };

  return (
    <>
      <Box onClick={onOpen}>
        <Button ml={2} colorScheme="yellow" size="sm" color={"white"}>
          <FaEdit />
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
              Edit SideMenu Item
            </AlertDialogHeader>

            <AlertDialogBody>
              <FormControl variant="floating" id="MenuItem">
                <Input
                  value={selectedMenu}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setSelectedMenu(e.target.value)
                  }
                />

                <FormLabel fontWeight={"400"} color={"gray.600"}>
                  New SideMenu Item
                </FormLabel>
              </FormControl>
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
                colorScheme="green"
                ml={3}
                onClick={handleUpdate}
              >
                Update
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
};

export default UpdateSideMenu;
