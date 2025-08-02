/*
  UpdateBranch Component:
  This component represents a form for updating a branch. It allows the user to select a branch name from a dropdown
  and submit the form to update the branch details. It utilizes Chakra UI components for the form layout and styling.
  The component retrieves the branch data and dispatches actions for updating and retrieving branch data.

  It does the following:
  - Imports necessary dependencies and components
  - Defines the interfaces for the update branches and form data
  - Retrieves the branch ID from the URL parameters using the useParams hook
  - Initializes the navigate function from react-router-dom for navigation purposes
  - Initializes the useToast hook for displaying toast messages
  - Defines the endpoint for API calls
  - Retrieves the branch and branches data from Redux using the useSelector hook
  - Initializes the react-hook-form for form handling, including form submission and input validation
  - Retrieves the branch data and all branches data from the server using the useEffect hook
  - Resets the form fields when the branch data is fetched
  - Handles form submission by dispatching the updateData action and retrieving updated branch data
  - Renders the update branch form using Chakra UI components, including the heading, input fields, and submit button
  - Includes the DevTool component from @hookform/devtools for form debugging (optional)
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
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import {
  getData,
  getDataById,
  updateData,
} from "../../redux/actions/common.action";
import { useNavigate, useParams } from "react-router-dom";
import { DevTool } from "@hookform/devtools";

// Interface for update branches
interface UpdateBranches {
  branch: {
    BranchName: string;
  };
  branches: {
    BranchName: string;
    _id: string;
  }[];
  loading: boolean
}

// Interface for form data
interface FormData {
  BranchName: string;
}

const UpdateBranch: React.FC = () => {
  const dispatch: any = useDispatch();
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const endpoint: string = "branch";
  const { branch, branches, loading } = useSelector(
    (state: { common: UpdateBranches }) => state.common
  );

  console.log(branch)

  // Initialize react-hook-form for form handling
  const {
    handleSubmit,
    register,
    formState: { errors },
    reset,
    control,
  } = useForm<FormData>({
    defaultValues: {
      BranchName: branch?.BranchName || "",
    },
  });

  useEffect(() => {
    // Fetch the branch and all branches data from the server
    dispatch(getDataById(id, endpoint));
    dispatch(getData(endpoint));
  }, [id, dispatch]);

  useEffect(() => {
    // Reset form fields when branch data is fetched
    if (branch) {
      reset({
        BranchName: branch.BranchName,
      });
    }
  }, [branch, reset]);

  const onSubmit = (data: FormData) => {
    // Handle form submission by dispatching the updateData action and retrieving updated branch data
    dispatch(
      updateData(id, endpoint, { BranchName: data.BranchName }, navigate, toast)
    ).then(() => {
      dispatch(getData("branch"));
    });
  };

  return (
    <Stack h="100%">
      {/* Heading */}

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)}>
        <SimpleGrid columns={{ md: 1, lg: 3 }} px={10} py={1} gap={6}>
          <Box>
            {/* Branch Name */}
            <Text fontSize={"1rem"} ml="2" mb="0.5">
              Branch Name
            </Text>
            <Input
              {...register("BranchName", { required: true })}
              size={"sm"}
              borderColor={errors.BranchName ? "red.500" : "gray.400"}
              borderRadius={"0.25rem"}
            />
            {errors.BranchName && (
              <Text color="red.500" fontSize="xs">
                Branch name is required
              </Text>
            )}
          </Box>

          <Box
            mt={6}
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
            {/* Update Branch Button */}
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
              Update Branch
            </Button>
          </Box>
        </SimpleGrid>
      </form>

      {/* DevTool (optional) */}
      <DevTool control={control} />
    </Stack>
  );
};

export default UpdateBranch;
