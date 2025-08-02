/*
  UpdateCourse Component:
  This component is used to update an existing course.
  It displays a form with inputs for the course name and price.
  It uses Chakra UI components for styling.

  It does the following:
  - Imports necessary dependencies and components
  - Defines the interface for UpdateCourses
  - Initializes the useSelector hook to access the state from Redux
  - Initializes the useParams hook from react-router-dom to get the course ID from the URL
  - Initializes the useDispatch function from Redux
  - Initializes the useNavigate hook from react-router-dom for navigation purposes
  - Initializes the useToast hook from Chakra UI for displaying toast messages
  - Initializes the useForm hook from react-hook-form for form handling
  - Fetches the course data and all courses on component mount
  - Resets the form with the fetched course data
  - Handles form submission and dispatches the updateData action
  - Renders the form with course name and price inputs
*/

import {
  Box,
  Button,
  Input,
  Select,
  SimpleGrid,
  Stack,
  Text,
  useToast,
} from "@chakra-ui/react";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { DevTool } from "@hookform/devtools";
import {
  getData,
  getDataById,
  updateData,
} from "../../redux/actions/common.action";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";

// Interface for the course update data structure
interface UpdateCourses {
  course: {
    CourseValue: string;
    CourseName: string;
  };
  courses: {
    CourseName: string;
    _id: string;
  }[];
  loading: boolean;
}

const UpdateCourse = () => {
  const { course, courses, loading } = useSelector(
    (state: { common: UpdateCourses }) => state.common
  );
  const { id } = useParams();
  const endpoint: string = "course";
  const dispatch: any = useDispatch();
  const navigate = useNavigate();
  const toast = useToast();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    control,
  } = useForm();

  useEffect(() => {
    // Fetch the course data by ID and all courses
    dispatch(getDataById(id, endpoint));
    dispatch(getData(endpoint));
  }, [dispatch, id, endpoint]);

  useEffect(() => {
    if (course) {
      // Reset the form with the fetched course data
      reset(course);
    }
  }, [course, reset]);

  const onSubmit = (data: any) => {
    // Handle form submission and dispatch the updateData action
    dispatch(updateData(id, endpoint, data, navigate, toast)).then(() => {
      dispatch(getData("course"));
    });
  };

  return (
    <Stack h="100%">
      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)}>
        <SimpleGrid columns={{md:1, lg:3}} px={10} py={1} gap={6}>
          {/* Course Name Input */}
          <Box>
            <Text fontSize={"1rem"} ml="2" mb="0.5">
              Product Name
            </Text>
            <Input
              {...register("CourseName", { required: true })}
              size={"sm"}
              borderColor={errors.CourseName ? "red.500" : "gray.400"}
              borderRadius={"0.25rem"}
            />
            {errors.CourseName && (
              <Text color="red.500" fontSize="xs">
                Product name is required
              </Text>
            )}
          </Box>

          {/* Course Price Input */}
          <Box>
            <Text fontSize={"1rem"} ml="2" mb="0.5">
              Product Price
            </Text>
            <Input
              type="number"
              size={"sm"}
              borderColor={errors?.CourseValue ? "red.500" : "gray.400"}
              borderRadius={"0.25rem"}
              placeholder=""
              {...register("CourseValue", { required: true })}
            />
            {errors.CourseValue && (
              <Text color="red.500" fontSize="xs">
                Course price is required
              </Text>
            )}
          </Box>

          {/* Update Course Button */}
          <Box
            display={"flex"}
            justifyContent={"flex-end"}
            alignItems={"center"}
          >
            <Button
              onClick={() => navigate("/product-list")}
              variant="outline"
              mt={6}
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
            <Button
              isLoading={loading}
              loadingText="Please wait..."
              type="submit"
              size={"sm"}
              mt={6}
              _hover={{ bg: "#E67E00" }}
              w="8.188rem"
              bg="#FF9000"
              borderRadius={"0.25rem"}
              color="whiteAlpha.900"
              fontWeight={"700"}
              fontSize={"1rem"}
            >
              Update Product
            </Button>
          </Box>
        </SimpleGrid>
      </form>

      {/* DevTool for form debugging */}
      <DevTool control={control} />
    </Stack>
  );
};

export default UpdateCourse;
