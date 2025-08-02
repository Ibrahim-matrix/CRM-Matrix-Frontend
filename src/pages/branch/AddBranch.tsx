/*
  AddBranch Component:
  This component represents a form for adding a branch. It allows the user to input the branch name
  and submit the form to add the branch to the system. It utilizes Chakra UI components for the form layout
  and validation. The component also dispatches actions to handle form submission, data retrieval, and navigation.

  It does the following:
  - Imports necessary dependencies and components
  - Defines the interfaces for form data and loading state
  - Retrieves loading state and dispatch function from Redux using the useSelector and useDispatch hooks
  - Defines the endpoint for API calls
  - Initializes React Hook Form for form validation and data retrieval
  - Handles form submission by dispatching the postData action, which adds the branch and retrieves updated data
  - Renders the form using Chakra UI components with appropriate validation and error messages
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
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { getData, postData } from "../../redux/actions/common.action";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";

// Define the interface for form data
interface FormData {
  BranchName: string;
}

// Define the interface for loading state
interface Loading {
  loading: boolean;
}

const AddBranch: React.FC = () => {
  // Retrieve loading state from Redux using useSelector hook
  const { loading } = useSelector((state: { common: Loading }) => state.common);
  const dispatch: any = useDispatch();
  const endpoint = "branch";
  const navigate = useNavigate();
  const toast = useToast();

  // Initialize React Hook Form for form validation and data retrieval
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  // Handle form submission
  const onSubmit = (data: FormData) => {
    console.log(data)
    // Dispatch the postData action to add the branch and retrieve updated data
    dispatch(postData(data, endpoint, navigate, toast)).then(() => {
      dispatch(getData("branch"));
    });
  };

  return (
    <Stack h="100%">
      {/* Form starts */}
      <form onSubmit={handleSubmit(onSubmit)}>
        <SimpleGrid columns={{md:1, lg:3}} px={10} py={5} gap={6} mt={3}>
          <Box>
            <FormControl variant="floating" id="Branch-Name">
              <Input
                autoComplete="off"
                {...register("BranchName", { required: true })}
                borderColor={errors?.BranchName ? "red.500" : "gray.400"}
                borderRadius={"0.25rem"}
                size="sm"
                placeholder=" "
              />
              <FormLabel fontWeight={"400"} color={"gray.600"}>
                Branch Name
              </FormLabel>
              {errors.BranchName && (
                <Text color="red.500" fontSize="sm">
                  Branch name is required
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
              onClick={() => navigate("/branch-list")}
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
            {/* Submit button */}
            <Button
              isLoading={loading}
              loadingText="Please wait..."
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
              Add Branch
            </Button>
          </Box>
        </SimpleGrid>
      </form>
      {/* Form ends */}
    </Stack>
  );
};

export default AddBranch;
