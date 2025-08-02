/*
  AddSource Component:
  This component represents a form for adding a new source. It allows the user to enter a source name in an input field
  and submit the form to add the source. It utilizes Chakra UI components for the form layout and styling.
  The component dispatches actions for adding and retrieving source data.

  It does the following:
  - Imports necessary dependencies and components
  - Defines the interfaces for sources and loading state
  - Retrieves the loading state from Redux using the useSelector hook
  - Initializes the react-hook-form for form handling, including form submission and input validation
  - Retrieves the dispatch function from Redux using the useDispatch hook
  - Defines the endpoint for API calls
  - Initializes the navigate function from react-router-dom for navigation purposes
  - Initializes the useToast hook for displaying toast messages
  - Handles form submission by dispatching the postData action and retrieving source data
  - Renders the add source form using Chakra UI components, including the input field and submit button
  - Includes the DevTool component from @hookform/devtools for form debugging (optional)
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

import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getData, postData } from "../../redux/actions/common.action";
import { DevTool } from "@hookform/devtools";

// Interface for the form data
interface AddSources {
  SourceName: string;
  Description: string;
}

// Interface for the loading state
interface Loading {
  loading: boolean;
}

const AddSource = () => {
  // Accessing the 'loading' state from the common reducer
  const { loading } = useSelector((state: { common: Loading }) => state.common);

  // Initializing form methods from react-hook-form
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm<AddSources>();


  const dispatch: any = useDispatch();
  const navigate = useNavigate();
  const toast = useToast();

  // Function to handle form submission
  const onSubmit = (data: AddSources) => {
    const endpoint = "source";

    // Dispatching an action to post the form data
    dispatch(postData(data, endpoint, navigate, toast)).then(() => {
      // Dispatching an action to get updated source data
      dispatch(getData("source"));
    });
  };

  return (
    <Stack h="100%">
      {/* inputs starts */}
      <form onSubmit={handleSubmit(onSubmit)}>
        <SimpleGrid columns={{md:1, lg:3}} px={10} py={5} gap={6} mt={3}>
          <Box>
            <FormControl variant="floating" id="SourceName">
              <Input
                autoComplete="off"
                {...register("SourceName", { required: true })}
                borderColor={errors?.SourceName ? "red.500" : "gray.400"}
                borderRadius={"0.25rem"}
                size="sm"
                placeholder=" "
              />
              <FormLabel fontWeight={"400"} color={"gray.600"}>
                Source Name
              </FormLabel>
              {errors.SourceName && (
                <Text fontSize="sm" color="red.500">
                  Source name is required
                </Text>
              )}
            </FormControl>
          </Box>
          <Box>
            <FormControl variant="floating" id="Description">
              <Input
                autoComplete="off"
                {...register("Description", { required: true })}
                borderColor={errors?.Description ? "red.500" : "gray.400"}
                borderRadius={"0.25rem"}
                size="sm"
                placeholder=" "
              />
              <FormLabel fontWeight={"400"} color={"gray.600"}>
                Description
              </FormLabel>
              {errors.Description && (
                <Text fontSize="sm" color="red.500">
                  Description is required
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
              onClick={() => navigate("/source-list")}
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
            <Button
              isLoading={loading}
              loadingText="Please wait..."
              type="submit"
              size={"sm"}
              _hover={{ bg: "#FF9000" }}
              w="8.188rem"
              bg="#FF9000"
              borderRadius={"0.25rem"}
              color="whiteAlpha.900"
              fontWeight={"700"}
              fontSize={"1rem"}
            >
              Add Source
            </Button>
          </Box>
        </SimpleGrid>
      </form>
      {/* inputs end */}
      <DevTool control={control} />
    </Stack>
  );
};

export default AddSource;
