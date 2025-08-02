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
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";

import { RiDeleteBinLine } from "react-icons/ri";
import { useDispatch, useSelector } from "react-redux";
import { getData, updateData } from "../../../redux/actions/common.action";
import { useNavigate } from "react-router-dom";
interface Props {
  status: string;
  id: string;
  getDataById: (enpoint: string, id: string) => void;
}

interface StatusLists {
  statuses: {
    _id : string ;
    StatusName: string;

  }[];
  loading: boolean;
}

const StatusPopup: React.FC<Props> = ({ status, id, getDataById }) => {
  const [selectedStatus, setSelectedStatus] = useState<string>("");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const dispatch: any = useDispatch();
  const toast = useToast();
  const endpointc: string = "status";
  const endpoint: string = "lead";
  const navigate = useNavigate();
  const cancelRef = React.useRef<HTMLButtonElement>(null);
  const { loading, statuses } = useSelector(
    (state: { common: StatusLists }) => state.common
  );
  const onUpdatePrice = () => {
    dispatch(
      updateData(id, endpoint, { Status: selectedStatus }, navigate, toast)
    ).then(() => dispatch(getDataById(id, endpoint)));
    onClose();
  };

  useEffect(() => {
    dispatch(getData(endpointc));
  }, []);

  useEffect(() => {
    setSelectedStatus(status);
  }, [status]);

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
          Update Status
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
                <Select
                  value={selectedStatus}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                    setSelectedStatus(e.target.value)
                  }
                >
                  {/* <option value={selectedStatus}>{selectedStatus}</option> */}
                  {/* Set initial value */}
                  {statuses?.map((el, i) => (
                    <option value={el._id} key={i}>
                      {el.StatusName}
                    </option>
                  ))}
                </Select>
                <FormLabel fontWeight={"400"} color={"gray.600"}>
                  Status
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
export default StatusPopup;
