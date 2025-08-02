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
    Text,
  } from "@chakra-ui/react";
  import React, {  useState } from "react";
import {  Image } from "@chakra-ui/react";
import image from '../../../icons/justdial.jpg'
import axios from "axios";
import { BASE_URL } from "../../../config/RequestMethod";
import Cookies from "js-cookie";
import { useSelector } from "react-redux";

  const JustDial: React.FC = () => {

    const token = Cookies.get('token')
    const {
        signinuser,
      } = useSelector((state: any) => state.common);
      console.log(signinuser)

    const [selectedKey, setSelectedKey] = useState<string>("");
    const { isOpen, onOpen, onClose } = useDisclosure();
    const cancelRef = React.useRef<HTMLButtonElement>(null);

     const postIndiaMartKey = async () => {
        try {
            const response = await axios.post(`${BASE_URL}user/crmKey`, {userId : signinuser.userId , crmKey : selectedKey} , {
                headers: {
                  Authorization: `Bearer ${token}`, 
                },
              });
              console.log(response)
        } catch (error) {
            console.log(error)
        }
      };

      const [hovered, setHovered] = useState(false);

    return (
      <>
     <Box
      position="relative"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      overflow="hidden"
      width="200px"
      height="200px"
    >
      <Image
        src={image}
        alt="Custom Image"
        width="100%"
        height="100%"
        transition="transform 0.3s"
        transform={hovered ? "scale(1.1)" : "scale(1)"}
        borderRadius={'6%'}
      />
      {hovered && (
        <Box
          position="absolute"
          top="0"
          left="0"
          width="100%"
          height="100%"
          backgroundColor="rgba(0, 0, 0, 0.5)"
          display="flex"
          justifyContent="center"
          alignItems="center"
        >
          <Text color="white" fontSize="lg">
            Coming Soon
          </Text>
        </Box>
      )}
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
  export default JustDial;
  