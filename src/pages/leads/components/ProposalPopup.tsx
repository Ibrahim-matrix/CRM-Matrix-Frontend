import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Box,
  Button,
  Text,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import React from "react";
import { useDispatch } from "react-redux";
import { postData } from "../../../redux/actions/common.action";
import { useNavigate } from "react-router-dom";

const ProposalPopup = ({ leadId }: { leadId: string }) => {
  const dispatch: any = useDispatch();
  const endpoint = "proposal";
  const navigate = useNavigate();
  const toast = useToast();
  const { onOpen, onClose, isOpen } = useDisclosure();
  const cancelRef = React.useRef<HTMLButtonElement>(null);

  const handleProposal = (id: string) => {
    // const payload = {
    //   leadId: id,
    // };
    // dispatch(postData(payload, endpoint, navigate, toast));
    navigate("/proposal?leadId="+id)
  };
  return (
    <Box w={"90%"}>
      <Box onClick={onOpen}>
        <Button
          size="xs"
          fontSize={"10px"}
          fontWeight={"medium"}
          mr="4"
          w={"100%"}
          colorScheme="green"
          variant="solid"
          px="2"
        >
          SEND PROPOSAL
        </Button>
      </Box>

      <AlertDialog
        isOpen={isOpen}
        onClose={onClose}
        leastDestructiveRef={cancelRef}
      >
        <AlertDialogOverlay
          bg="blackAlpha.300"
          backdropFilter="blur(5px) hue-rotate(90deg)"
        >
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
           
            </AlertDialogHeader>

            <AlertDialogBody textAlign={"center"}>
               You will be redirected to Proposal page.
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
                // isLoading={loading}
                loadingText="Please wait..."
                colorScheme="green"
                onClick={() => handleProposal(leadId)}
                ml={3}
              >
                GO TO PROPOSAL PAGE
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Box>
  );
};

export default ProposalPopup;
