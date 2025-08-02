/*
  AddCourse Component:
  This component allows adding a new course by providing a form with inputs for course name and course price.
  It utilizes Chakra UI components for styling and form handling using react-hook-form.

  It does the following:
  - Imports necessary dependencies and components
  - Defines the interface for AddCourses
  - Initializes the react-hook-form for form handling and sets form validation rules
  - Initializes the useDispatch function from Redux
  - Initializes the navigate function from react-router-dom for navigation purposes
  - Initializes the useToast hook for displaying toast messages
  - Defines the onSubmit function to handle form submission
  - Renders the form with inputs for course name and course price, and displays form validation errors if any
*/

import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  SimpleGrid,
  Stack,
  Text,
  useToast,
} from "@chakra-ui/react";
import { DevTool } from "@hookform/devtools";
import { useDispatch } from "react-redux";
import { getData, postData } from "../../redux/actions/common.action";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";

// Interface for the form data submitted by the user
interface AddCourses {
  CourseName: string;
  CourseValue: string;
}

const AddCourse = () => {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<AddCourses>();
  const dispatch: any = useDispatch();
  const navigate = useNavigate();
  const toast = useToast();

  const onSubmit = (data: AddCourses) => {
    const endpoint = "course";
    // Dispatch the postData action to add a new course and fetch the updated course data
    dispatch(postData(data, endpoint, navigate, toast)).then(() => {
      dispatch(getData("course"));
      navigate("/product-list")
    });
  };

  return (
    <Stack h="100%">
      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)}>
        <SimpleGrid columns={{md:1, lg:3}} px={10} py={5} gap={6} mt={3}>
          <Box>
            {/* Course Name Input */}
            <FormControl variant="floating" id="CourseName">
              <Input
                autoComplete="off"
                {...register("CourseName", {
                  required: "Product name is required",
                })}
                borderColor={errors?.CourseName ? "red.500" : "gray.400"}
                borderRadius={"0.25rem"}
                size="sm"
                placeholder=" "
              />
              <FormLabel fontWeight={"400"} color={"gray.600"}>
                Product Name
              </FormLabel>
              {errors.CourseName && (
                <Text as={"span"} fontSize="sm" color="red.500">
                  {errors.CourseName.message}
                </Text>
              )}
            </FormControl>
          </Box>
          <Box>
            {/* Course Value Input */}
            <FormControl variant="floating" id="CourseValue">
              <Input
                autoComplete="off"
                {...register("CourseValue", {
                  required: "Course price is required",
                })}
                borderColor={errors?.CourseValue ? "red.500" : "gray.400"}
                borderRadius={"0.25rem"}
                size="sm"
                type="number"
                placeholder=" "
              />
              <FormLabel fontWeight={"400"} color={"gray.600"}>
                Product Price
              </FormLabel>
              {errors.CourseValue && (
                <Text as={"span"} fontSize="sm" color="red.500">
                  {errors.CourseValue.message}
                </Text>
              )}
            </FormControl>
          </Box>
          <Box
            display={"flex"}
            justifyContent={"flex-end"}
            alignItems={"center"}
          >
            <Button
              onClick={() => navigate("/product-list")}
              variant="outline"
              mr={2}
              size="sm"
              w="8.188rem"
              borderRadius="0.25rem"
              color="#FF9000"
              borderColor="#FF9000"
              fontWeight="700"
              fontSize="1rem"
              _hover={{ bg: "#FF9000", color: "white" }}
            >
              Back
            </Button>
            {/* Add Course Button */}
            <Button
              type="submit"
              size={"sm"}
              _hover={{ bg: "#E67E00" }}
              w="8.188rem"
              bg="#FF9000"
              borderRadius={"0.25rem"}
              color="whiteAlpha.900"
              fontWeight={"700"}
              fontSize={"1rem"}
            >
              Add Product
            </Button>
          </Box>
        </SimpleGrid>
      </form>
      {/* React Hook Form DevTool */}
      <DevTool control={control} />
    </Stack>
  );
};

export default AddCourse;
