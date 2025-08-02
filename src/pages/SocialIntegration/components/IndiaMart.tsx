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
    IconButton,
  } from "@chakra-ui/react";
  import React, { useState } from "react";
  import { Image } from "@chakra-ui/react";
  import image from "../../../icons/indiamartLogo.jpeg";
  import axios from "axios";
  import { BASE_URL } from "../../../config/RequestMethod";
  import Cookies from "js-cookie";
  import { useSelector } from "react-redux";
  import { CheckIcon } from "@chakra-ui/icons";
  
  const IndiaMart: React.FC = () => {
    const token = Cookies.get("token");
    const { signinuser } = useSelector((state: any) => state.common);
  
    const [selectedKey, setSelectedKey] = useState<string>("");
    const { isOpen, onOpen, onClose } = useDisclosure();
    const cancelRef = React.useRef<HTMLButtonElement>(null);
  
    const postIndiaMartKey = async () => {
      try {
        const response = await axios.put(
          `${BASE_URL}user/crmKey`,
          { userId: signinuser.userId, crmKey: selectedKey },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log(response);
        onClose()
      } catch (error) {
        console.log(error);
      }
    };
  
    const isCrmKeyExists = signinuser && signinuser.crmKey;
  
    // Function to handle image click and open the modal conditionally
    const handleImageClick = () => {
      if (!isCrmKeyExists) {
        onOpen();
      }
    };
  
    return (
      <>
        <Box
          position="relative"
          width="200px"
          height="200px"
          onClick={handleImageClick} // Use the custom function to handle click
        >
          {/* Green Tick */}
          {isCrmKeyExists && (
        <Box
          position="absolute"
          top="5px"
          right="5px"
          width="30px"
          height="30px"
          borderRadius={"50%"}
          backgroundColor="green.500"
          display="flex"
          justifyContent="center"
          alignItems="center"
        >
          <CheckIcon color={'white'} />
        </Box>
      )}
  
          {/* Image */}
          <Image
            src={image}
            alt="Custom Image"
            width="100%"
            height="100%"
            borderRadius={"6%"}
          />
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
                  <Input
                    value={selectedKey}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setSelectedKey(e.target.value)
                    }
                  />
  
                  <FormLabel fontWeight={"400"} color={"gray.600"}>
                    Enter Your IndiaMart Key
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
                  onClick={() => postIndiaMartKey()}
                  ml={3}
                >
                  Add Key
                </Button>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialogOverlay>
        </AlertDialog>
      </>
    );
  };
  export default IndiaMart;
  