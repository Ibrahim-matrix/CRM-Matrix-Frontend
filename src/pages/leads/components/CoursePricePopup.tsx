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
  useToast,
  Input,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";

import { RiDeleteBinLine } from "react-icons/ri";
import { useDispatch, useSelector } from "react-redux";
import { getData, updateData } from "../../../redux/actions/common.action";
import { useNavigate } from "react-router-dom";
interface Props {
  coursePrice: number;
  id: string;
  getDataById: (enpoint: string, id: string) => void;
}

interface CourseLists {
  loading: boolean;
}

const CoursePricePopup: React.FC<Props> = ({
  coursePrice,
  id,
  getDataById,
}) => {
  const [selectedPrice, setSelectedPrice] = useState<number>();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const dispatch: any = useDispatch();
  const toast = useToast();

  const endpoint: string = "lead";
  const navigate = useNavigate();
  const cancelRef = React.useRef<HTMLButtonElement>(null);
  const { loading } = useSelector(
    (state: { common: CourseLists }) => state.common
  );
  const onUpdatePrice = () => {
    dispatch(
      updateData(id, endpoint, { CoursePrice: selectedPrice }, navigate, toast)
    ).then(() => dispatch(getDataById(id, endpoint)));
    onClose();
  };

  useEffect(() => {
    setSelectedPrice(coursePrice); // Update selectedPrice when the coursePrice prop changes
  }, [coursePrice]);

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
          Update Price
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
                  type="number"
                  value={selectedPrice}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setSelectedPrice(+e.target.value)
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
                onClick={onUpdatePrice}
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
export default CoursePricePopup;
