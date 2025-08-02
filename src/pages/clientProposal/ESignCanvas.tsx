import React, { useRef, useState } from "react";
import SignatureCanvas from "react-signature-canvas";
import {
  Box,
  Button,
  VStack,
  Heading,
  Text,
  HStack,
  useColorModeValue,
  Icon,
  useToast,
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
} from "@chakra-ui/react";
import { FaSignature } from "react-icons/fa";
import axios from "axios";
import { BASE_URL, CLOUDINARY_CLOUD_NAME } from "../../config/RequestMethod";
import { useNavigate, useSearchParams } from "react-router-dom";

const ESignCanvas = () => {
  const sigCanvas = useRef<SignatureCanvas>(null);
  const cancelRef = useRef(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const [searchParams] = useSearchParams();
  const proposalId = searchParams.get("proposalId");

  const bg = useColorModeValue("white", "gray.800");
  const border = useColorModeValue("gray.300", "gray.600");
  const toast = useToast();
  const navigate = useNavigate();

  const clear = () => {
    sigCanvas.current?.clear();
  };

  const openConfirmModal = () => {
    if (sigCanvas.current?.isEmpty()) {
      toast({
        title: "Signature required",
        status: "warning",
        duration: 2000,
        isClosable: true,
      });
      return;
    }
    setIsDialogOpen(true);
  };

  const handleConfirm = async () => {
    setIsDialogOpen(false);

    const dataUrl = sigCanvas?.current?.toDataURL("image/png");
    const blob = await (await fetch(dataUrl ? dataUrl : "")).blob();

    const formData = new FormData();
    formData.append("file", blob);
    formData.append("upload_preset", "CRMMatrix");

    try {
      const res = await axios.post(
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
        formData
      );
      console.log("Uploaded URL:", res.data.secure_url);

      const payload = {
        esign: res?.data?.secure_url,
      };

      const res2 = await axios.put(
        `${BASE_URL}client-proposal/${proposalId}`,
        payload
      );

      toast({
        title: res2?.data?.message,
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      // Optionally send res.data.secure_url to your backend
    } catch (error) {
      console.error("Cloudinary upload failed:", error);
      toast({
        title: "Upload failed",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <>
      <VStack
        spacing={6}
        p={6}
        maxW="600px"
        mx="auto"
        bg={bg}
        boxShadow="xl"
        borderRadius="2xl"
        border={`1px solid ${border}`}
      >
        <HStack spacing={2}>
          <Icon as={FaSignature} w={6} h={6} color="blue.500" />
          <Heading fontSize="2xl">Sign Below</Heading>
        </HStack>

        <Text fontSize="sm" color="gray.500" textAlign="center">
          Use your finger or mouse to draw your signature
        </Text>

        <Box
          border={`2px dashed ${border}`}
          borderRadius="md"
          bg={useColorModeValue("gray.50", "gray.700")}
          w="100%"
          h="200px"
          overflow="hidden"
          position="relative"
        >
          <SignatureCanvas
            ref={sigCanvas}
            penColor="black"
            canvasProps={{
              width: 580,
              height: 200,
              className: "sigCanvas",
              style: { padding: "8px" },
            }}
          />
        </Box>

        <HStack spacing={4}>
          <Button colorScheme="green" onClick={openConfirmModal}>
            PROCEED AND ACCEPT
          </Button>
          <Button onClick={clear} variant="outline" colorScheme="gray">
            CLEAR
          </Button>
        </HStack>
      </VStack>

      {/* Confirmation Modal */}
      <AlertDialog
        isOpen={isDialogOpen}
        leastDestructiveRef={cancelRef}
        onClose={() => setIsDialogOpen(false)}
        isCentered
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Confirm Signature
            </AlertDialogHeader>

            <AlertDialogBody>
              This process is <strong>not reversible</strong>. Are you sure you
              want to proceed?
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button colorScheme="green" onClick={handleConfirm} ml={3}>
                Yes, Proceed
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
};

export default ESignCanvas;
