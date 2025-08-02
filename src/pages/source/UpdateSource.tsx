/*
  UpdateSource Component:
  This component allows updating a source by providing a form with a select input for the source name.
  It utilizes Chakra UI components for styling and form handling using react-hook-form.

  It does the following:
  - Imports necessary dependencies and components
  - Defines the interfaces for UpdateCities and FormData
  - Retrieves the source and sources data from Redux using the useSelector hook
  - Initializes the dispatch function from Redux using the useDispatch hook
  - Retrieves the "id" parameter from the URL using the useParams hook
  - Initializes the navigate function from react-router-dom for navigation purposes
  - Initializes the useToast hook for displaying toast messages
  - Defines the endpoint for API calls
  - Initializes the react-hook-form for form handling and sets default form values based on the source data
  - Fetches source data and the specific source by ID when the component mounts
  - Resets the form values when the source data changes
  - Handles form submission by dispatching the updateData action and fetching updated source data
  - Renders the form with a select input for source name and displays form validation errors if any
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

//interface for the update sources
interface UpdateSources {
  source: {
    SourceName: string;
    Description: string;
  };
  sources: {
    SourceName: string;
    _id: string;
  }[];
  loading: boolean;
}

//interface for the filled form values
interface FormValues {
  SourceName: string;
  Description: string;
}

const UpdateSource = () => {
  // Accessing form-related hooks and variables
  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<FormValues>();

  // Accessing the 'source', 'sources', and 'loading' state from the common reducer
  const { source, sources, loading } = useSelector(
    (state: { common: UpdateSources }) => state.common
  );

  // Accessing necessary hooks, variables, and parameters
  const { id } = useParams();
  const endpoint: string = "source";
  const dispatch: any = useDispatch();
  const navigate = useNavigate();
  const toast = useToast();

  // useEffect hook to fetch data when 'id' changes
  useEffect(() => {
    dispatch(getDataById(id, endpoint));
    dispatch(getData(endpoint));
  }, [id]);

  // useEffect hook to reset form values when 'source' changes
  useEffect(() => {
    if (source) {
      reset(source);
    }
  }, [source]);

  // Function to handle form submission
  const onSubmit = (data: FormValues) => {
    dispatch(updateData(id, endpoint, data, navigate, toast)).then(() => {
      dispatch(getData("source"));
    });
  };

  return (
    <Stack h="100%">
      {/* heading starts */}

      {/* heading end */}
      {/* inputs starts */}
      <form onSubmit={handleSubmit(onSubmit)}>
        <SimpleGrid columns={{md:1, lg:3}} px={10} py={1} gap={6}>
          <Box>
            <Text fontSize={"1rem"} ml="2" mb="0.5">
              Source Name
            </Text>
            <Input
              {...register("SourceName", { required: true })}
              size={"sm"}
              borderColor={errors.SourceName ? "red.500" : "gray.400"}
              borderRadius={"0.25rem"}
            />

            {errors.SourceName && (
              <Text color="red.500" fontSize="xs">
                Source name is required
              </Text>
            )}
          </Box>
          <Box>
            <Text fontSize={"1rem"} ml="2" mb="0.5">
              Description
            </Text>
            <Input
              {...register("Description", { required: true })}
              size={"sm"}
              borderColor={errors?.Description ? "red.500" : "gray.400"}
              borderRadius={"0.25rem"}
              placeholder=""
            />
            {errors.Description && (
              <Text color="red.500" fontSize="xs">
                Description is required.
              </Text>
            )}
          </Box>
          <Box
            display={"flex"}
            justifyContent={"flex-end"}
            alignItems={"center"}
          >
            <Button
            onClick={() => navigate("/source-list")}
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
              _hover={{ bg: "#FF9000" }}
              w="8.188rem"
              bg="#FF9000"
              borderRadius={"0.25rem"}
              color="whiteAlpha.900"
              fontWeight={"700"}
              fontSize={"1rem"}
            >
              Update Source
            </Button>
          </Box>
        </SimpleGrid>
      </form>
      {/* inputs end */}
      <DevTool control={control} />
    </Stack>
  );
};

export default UpdateSource;
