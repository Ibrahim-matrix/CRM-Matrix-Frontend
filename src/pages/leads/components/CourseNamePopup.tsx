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
  course: string;
  id: string;
  coursePrice: string;
  getDataById: (enpoint: string, id: string) => void;
}

interface CourseLists {
  courses: {
    _id : string
    CourseName: string;
  }[];
  loading: boolean;
}

const CourseNamePopup: React.FC<Props> = ({
  course,
  coursePrice,
  id,
  getDataById,
}) => {
  const [selectedCourse, setSelectedCourse] = useState<string>("");
  console.log(course, coursePrice, selectedCourse, id)
  const { isOpen, onOpen, onClose } = useDisclosure();
  const dispatch: any = useDispatch();
  const toast = useToast();
  const endpointc: string = "course";
  const endpoint: string = "lead";
  const navigate = useNavigate();
  const cancelRef = React.useRef<HTMLButtonElement>(null);
  const { loading, courses } = useSelector(
    (state: { common: CourseLists }) => state.common
  );
  const onUpdatePrice = () => {
    dispatch(
      updateData(
        id,
        endpoint,
        { EnquiryCourse: selectedCourse, CoursePrice: coursePrice },
        navigate,
        toast
      )
    );
    dispatch(getDataById(id, endpoint));
    onClose();
  };

  useEffect(() => {
    dispatch(getData(endpointc));
  }, []);

  useEffect(() => {
    setSelectedCourse(course);
  }, [course]);

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
          Update Product
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
                  value={selectedCourse}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                    setSelectedCourse(e.target.value)
                  }
                >
                  {/* Set initial value */}
                  {courses?.map((el, i) => (
                    <option value={el._id} key={i}>
                      {el.CourseName}
                    </option>
                  ))}
                </Select>
                <FormLabel fontWeight={"400"} color={"gray.600"}>
                Product Name
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
export default CourseNamePopup;
