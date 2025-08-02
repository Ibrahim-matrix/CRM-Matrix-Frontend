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
  Select,
  FormControl,
  FormLabel,
  useToast,
  Input,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";

import { useDispatch, useSelector } from "react-redux";
import { updateData } from "../../../redux/actions/common.action";
import { useNavigate } from "react-router-dom";
interface Props {
  date: string;
  id: string;
  getDataById: (enpoint: string, id: string) => void;
}

interface UpdateDate {
  loading: boolean;
}

const UpdateDatePopup: React.FC<Props> = ({ date, id, getDataById }) => {
  const [selectedDate, setSelectedDate] = useState<string>();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const dispatch: any = useDispatch();
  const toast = useToast();

  const endpoint: string = "lead";
  const navigate = useNavigate();
  const cancelRef = React.useRef<HTMLButtonElement>(null);
  const { loading } = useSelector(
    (state: { common: UpdateDate }) => state.common
  );
  const onUpdateDate = () => {
    dispatch(
      updateData(id, endpoint, { FollowupDate: selectedDate }, navigate, toast)
    ).then(() => dispatch(getDataById(id, endpoint)));
    onClose();
  };
  useEffect(() => {
    //    const formattedDate = new Date(date).toLocaleDateString("en-GB");
    setSelectedDate(date); // Update selectedDate when the date prop changes
  }, [date]);

  return (
    <>
      <Box onClick={onOpen}>
        <Button
          size="xs"
          fontSize={"10px"}
          fontWeight={"medium"}
          mr="4"
          colorScheme="orange"
          variant="outline"
          color="orange.500"
          px="2"
        >
          Update Date
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
                <Input
                  type="date"
                  value={
                    selectedDate
                      ? new Date(selectedDate).toISOString().substr(0, 10)
                      : ""
                  }
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setSelectedDate(e.target.value)
                  }
                />

                <FormLabel fontWeight={"400"} color={"gray.600"}>
                  Product Price
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
                isLoading={loading}
                loadingText="Please wait..."
                colorScheme="green"
                onClick={onUpdateDate}
                ml={3}
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
export default UpdateDatePopup;
