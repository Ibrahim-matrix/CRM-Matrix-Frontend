/*
  UpdateCity Component:
  This component allows updating a city by providing a form with a select input for the city name.
  It utilizes Chakra UI components for styling and form handling using react-hook-form.

  It does the following:
  - Imports necessary dependencies and components
  - Defines the interfaces for UpdateCities and FormData
  - Retrieves the city and cities data from Redux using the useSelector hook
  - Initializes the dispatch function from Redux using the useDispatch hook
  - Retrieves the "id" parameter from the URL using the useParams hook
  - Initializes the navigate function from react-router-dom for navigation purposes
  - Initializes the useToast hook for displaying toast messages
  - Defines the endpoint for API calls
  - Initializes the react-hook-form for form handling and sets default form values based on the city data
  - Fetches city data and the specific city by ID when the component mounts
  - Resets the form values when the city data changes
  - Handles form submission by dispatching the updateData action and fetching updated city data
  - Renders the form with a select input for city name and displays form validation errors if any
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

// Interface for the city data used in the component
interface UpdateCities {
  city: {
    cityName: string;
    branchId: string;
  };
  cities: {
    cityName: string;
    _id: string;
    branchId: string;
  }[];
  branches: Branch[];
  loading: boolean;
}

//interface for branch 
interface Branch {
  _id: string;
  BranchName: string;
}

// Interface for form data submitted by the user
interface FormData {
  CityName: string;
  branchId: string;
}

const UpdateCity: React.FC = () => {
  const dispatch: any = useDispatch();
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const endpoint: string = "city";
  const endpoint2: string = "branch";
  const { city, cities, branches, loading } = useSelector(
    (state: { common: UpdateCities }) => state.common
  );

  // Form handling using react-hook-form
  const {
    handleSubmit,
    register,
    formState: { errors },
    reset,
    control,
  } = useForm<FormData>({
    defaultValues: {
      CityName: city?.cityName || "",
      branchId: city?.branchId || ""
    },
  });

  useEffect(() => {
    // Fetch the specific city and all city data when the component mounts
    dispatch(getDataById(id, endpoint));
    dispatch(getData(endpoint));
    if (!branches || branches.length === 0) {
      dispatch(getData(endpoint2));
    }
  }, [id, dispatch]);

  useEffect(() => {
    // Reset the form values when the city data changes
    if (city) {
      reset({
        CityName: city.cityName,
        branchId: city.branchId,
      });
    }
  }, [city, reset]);

  const onSubmit = (data: FormData) => {
    console.log(data)
    // Handle form submission by dispatching the updateData action and fetching updated city data
    dispatch(
      updateData(id, endpoint, data, navigate, toast)
    ).then(() => {
      dispatch(getData("city"));
    });
  };

  return (
    <Stack h="100%">
      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)}>
        <SimpleGrid columns={{md:1, lg:3}} px={10} py={5} gap={6} mt={3}>
          {/* Branch Selector */}
          <Box>
            <Text fontSize={"1rem"} ml="2" mb="0.5">
              Select Branch
            </Text>
            <Select
              {...register("branchId", { required: true })}
              size={"sm"}
              borderColor={errors.branchId ? "red.500" : "gray.400"}
              borderRadius="0.25rem"
            >
              {branches?.map((branch: Branch) => (
                <option key={branch._id} value={branch._id} style={{
                  backgroundColor: branch._id === city.branchId ? "#e2e8f0" : "white",
                }}>
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
          <Box>
            {/* City Name Input */}
            <Text fontSize={"1rem"} ml="2" mb="0.5">
              City Name
            </Text>
            <Input
              {...register("CityName", { required: true })}
              size={"sm"}
              borderColor={errors.CityName ? "red.500" : "gray.400"}
              borderRadius={"0.25rem"}
            />
            {errors.CityName && (
              <Text color="red.500" fontSize="xs">
                City name is required
              </Text>
            )}
          </Box>
          {/* <Box /> */}

          <Box
            mt={6}
            display={"flex"}
            justifyContent={"flex-end"}
            alignItems={"center"}
          >
            <Button
              onClick={() => navigate("/city-list")}
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
            {/* Update City Button */}
            <Button
              isLoading={loading || branches?.length === 0 || city?.cityName?.length === 0}
              loadingText={branches?.length === 0 || city?.cityName?.length === 0 ? 'Getting data' : 'Updating..'}
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
              Update City
            </Button>
          </Box>
        </SimpleGrid>
      </form>

      <DevTool control={control} />
    </Stack>
  );
};

export default UpdateCity;
