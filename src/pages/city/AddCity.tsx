/*
  AddCity Component:
  This component represents a form for adding a new city. It allows the user to enter a city name in an input field
  and submit the form to add the city. It utilizes Chakra UI components for the form layout and styling.
  The component dispatches actions for adding and retrieving city data.

  It does the following:
  - Imports necessary dependencies and components
  - Defines the interfaces for cities and loading state
  - Retrieves the loading state from Redux using the useSelector hook
  - Initializes the react-hook-form for form handling, including form submission and input validation
  - Retrieves the dispatch function from Redux using the useDispatch hook
  - Defines the endpoint for API calls
  - Initializes the navigate function from react-router-dom for navigation purposes
  - Initializes the useToast hook for displaying toast messages
  - Handles form submission by dispatching the postData action and retrieving city data
  - Renders the add city form using Chakra UI components, including the input field and submit button
  - Includes the DevTool component from @hookform/devtools for form debugging (optional)
*/

import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Select,
  SimpleGrid,
  Stack,
  Text,
  useToast,
} from "@chakra-ui/react";
import React, { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { getData, postData } from "../../redux/actions/common.action";
import { useNavigate } from "react-router-dom";
import { DevTool } from "@hookform/devtools";
import { MultiSelect } from "react-multi-select-component";

// Interface for cities
interface Cities {
  cityName: string;
}

// Interface for loading state
interface Loading {
  loading: boolean;
}

interface Option {
  value: string;
  label: string;
}

interface Branch {
  _id: string;
  BranchName: string;
}

interface FormData {
  cityName: string;
  branchId: string;
}

const AddCity: React.FC = () => {

  const {
    branches,
  } = useSelector((state: any) => state.common);
  console.log(branches)

  const [branch, setBranch] = useState<Option[]>([]);
  const [branchlist, setBranchList] = useState<string>("");
  const [branchError, setBranchError] = useState<string>('')


  const branchOptions: Option[] = branches?.map((branch: Branch) => ({
    value: branch._id,
    label: branch.BranchName,
  }));

  const { loading } = useSelector((state: { common: Loading }) => state.common);
  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<FormData>();

  const dispatch: any = useDispatch();
  const endpoint: string = "city";
  const endpoint2: string = "branch";
  const navigate = useNavigate();
  const toast = useToast();

  const memoizedBranches = useMemo(() => branches, [branches])

  useEffect(() => {
    if (!branches || branches.length === 0) {
      dispatch(getData(endpoint2))
    }
  }, [memoizedBranches.length])

  const onSubmit = (formData: FormData) => {
    console.log(formData)

    // Handle form submission by dispatching the postData action and retrieving city data
    dispatch(postData(formData, endpoint, navigate, toast)).then(() => {
      dispatch(getData("city"));
      reset();
    });
  };

  return (
    <Stack h="100%">
      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)}>
        <SimpleGrid columns={3} px={10} py={5} gap={6} mt={3}>
          {/* Branch Selector */}
          <Box>
            <Text fontSize={"1rem"} ml="2" mb="0.5">
              Select Branch
            </Text>
            <Select
              placeholder="Select a branch"
              {...register("branchId", { required: true })}
              size={"sm"}
              borderColor={errors.branchId ? "red.500" : "gray.400"}
              borderRadius="0.25rem"
            >
              {branches?.map((branch: Branch) => (
                <option key={branch._id} value={branch._id}>
                  {branch.BranchName}
                </option>
              ))}
            </Select>
            {errors.branchId && (
              <Text color="red.500" fontSize="xs">
                Branch is required
              </Text>
            )}
          </Box>

          <Box alignSelf='end'>
            <FormControl variant="floating" id="City-Name">
              {/* City Name Input */}
              <Input
                autoComplete="off"
                {...register("cityName", {
                  required: "City name is required",
                })}
                borderColor={errors?.cityName ? "red.500" : "gray.400"}
                borderRadius={"0.25rem"}
                size="sm"
                placeholder=" "
              />
              <FormLabel fontWeight={"400"} color={"gray.600"}>
                City Name
              </FormLabel>
              {errors.cityName && (
                <Text as="span" fontSize="xs" color="red.500">
                  {errors.cityName.message}
                </Text>
              )}
            </FormControl>
          </Box>
          {/* <Box/> */}
          <Box
            mb={errors.cityName ? "6" : 0}
            display={"flex"}
            justifyContent={"flex-end"}
            alignSelf={'end'}
            alignItems={"center"}
          >
            <Button
              onClick={() => navigate("/city-list")}
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
            {/* Add City Button */}
            <Button
              isLoading={loading}
              loadingText="Please wait..."
              type="submit"
               mt={6}
              size={"sm"}
              _hover={{ bg: "#E67E00" }}
              w="8.188rem"
              bg="#FF9000"
              borderRadius={"0.25rem"}
              color="whiteAlpha.900"
              fontWeight={"700"}
              fontSize={"1rem"}
            >
              Add City
            </Button>
          </Box>
        </SimpleGrid>
      </form>
      {/* DevTool (optional) */}
      <DevTool control={control} />
    </Stack>
  );
};

export default AddCity;
