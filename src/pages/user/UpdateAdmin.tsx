/*
  UpdateUser Component:
  This component allows updating a user by providing a form with a select input for the user name.
  It utilizes Chakra UI components for styling and form handling using react-hook-form.

  It does the following:
  - Imports necessary dependencies and components
  - Defines the interfaces for UpdateUsers and FormData
  - Retrieves the user and users data from Redux using the useSelector hook
  - Initializes the dispatch function from Redux using the useDispatch hook
  - Retrieves the "id" parameter from the URL using the useParams hook
  - Initializes the navigate function from react-router-dom for navigation purposes
  - Initializes the useToast hook for displaying toast messages
  - Defines the endpoint for API calls
  - Initializes the react-hook-form for form handling and sets default form values based on the user data
  - Fetches user data and the specific user by ID when the component mounts
  - Resets the form values when the user data changes
  - Handles form submission by dispatching the updateData action and fetching updated user data
  - Renders the form with a select input for user name and displays form validation errors if any
*/
import {
  Box,
  Button,
  Checkbox,
  Flex,
  GridItem,
  HStack,
  Image,
  Input,
  SimpleGrid,
  Stack,
  Tag,
  Text,
  Toast,
  useToast,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import {
  getData,
  getDataById,
  getDataSuperAdmin,
  updateData,
  updateDataSuperAdmin,
} from "../../redux/actions/common.action";
import { useNavigate, useParams } from "react-router-dom";
import { DevTool } from "@hookform/devtools";
import UpdatePassword from "./UpdatePassword";

//interface for the updating user
interface UpdateAdmin {
  user: {
    Name: string;
    Phone: number;
    State: string;
    Pincode: string;
    Address: string;
    teamSize: number;
    UserType: number;
    companyName: string;
    webURL: string;
    validupTo: number;
    numberOfUsers: number;
    menuItems: string[];
    IntegrationPermission: string[];
    CompanyImageOne: string;
    _id: string;
  };
}

//interface for the prefilled form values
interface FormValues {
  Name: string;
  Phone: number;
  State: string;
  Pincode: string;
  Address: string;
  teamSize: number;
  UserType: number;
  companyName: string;
  webURL: string;
  validupTo: number;
  numberOfUsers: number;
  CompanyImageOne: string;
  integrationPermissions: [];
  menuPermissions: [];
  _id: string;
}

const UpdateAdmin = () => {
  // Initializing form and error handling using react-hook-form
  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<FormValues>();

  // Accessing the user state from the Redux store
  const { user } = useSelector(
    (state: { common: UpdateAdmin }) => state.common
  );

  const navigate = useNavigate();
  const toast = useToast();

  const [isImageChanged, setIsImageChanged] = useState<boolean>(false);
  const [imageOne, setImageOne] = useState<string>("");

  // Accessing the ID parameter from the URL
  const { id } = useParams();

  // Setting the endpoint for API requests
  const endpoint: string = "user";

  // Accessing the Redux dispatch function
  const dispatch: any = useDispatch();

  // Accessing the navigation function from react-router-dom

  // Fetching the user data by ID
  useEffect(() => {
    dispatch(getDataById(id, endpoint));
  }, [id]);

  // Resetting the form fields with user data when available
  useEffect(() => {
    if (user) {
      reset(user);
      setImageOne(user?.CompanyImageOne);
    }
  }, [user]);

  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  const handleCheckboxChange = (item: any) => {
    if (selectedItems.includes(item)) {
      // If item is already in the selectedItems array, remove it
      setSelectedItems(
        selectedItems.filter((selectedItem) => selectedItem !== item)
      );
    } else {
      // If item is not in the selectedItems array, add it
      setSelectedItems([...selectedItems, item]);
    }
  };

  // Handling form submission
  const onSubmit = (data: FormValues) => {
    dispatch(
      updateDataSuperAdmin(id, "adminUsers", data, navigate, toast)
    ).then(() => dispatch(getDataSuperAdmin("")));
    navigate("/admin-list");
  };

  return (
    <Stack h="100%">
      <form onSubmit={handleSubmit(onSubmit)}>
        <SimpleGrid columns={3} px={10} py={1} gap={6} mt={8}>
          <Box>
            <Text fontSize={"1rem"} ml="2" mb="0.5">
              Name
            </Text>
            <Input
              {...register("Name", { required: true })}
              size={"sm"}
              borderColor={errors?.Name ? "red.500" : "gray.400"}
              borderRadius={"0.25rem"}
            />
            {errors.Name && (
              <Text color="red.500" fontSize="xs">
                name is required.
              </Text>
            )}
          </Box>

          <Box>
            <Text fontSize={"1rem"} ml="2" mb="0.5">
              Phone No
            </Text>
            <Input
              {...register("Phone", { required: true })}
              size={"sm"}
              borderColor={errors?.Phone ? "red.500" : "gray.400"}
              borderRadius={"0.25rem"}
              placeholder=""
            />
            {errors.Phone && (
              <Text color="red.500" fontSize="xs">
                phone no is required.
              </Text>
            )}
          </Box>

          <Box>
            <Text fontSize={"1rem"} ml="2" mb="0.5">
              Company Name
            </Text>
            <Input
              {...register("companyName", { required: true })}
              size={"sm"}
              borderColor={errors?.companyName ? "red.500" : "gray.400"}
              borderRadius={"0.25rem"}
              placeholder=""
            />
            {errors.companyName && (
              <Text color="red.500" fontSize="xs">
                companyName no is required.
              </Text>
            )}
          </Box>

          <Box>
            <Text fontSize={"1rem"} ml="2" mb="0.5">
              Address
            </Text>
            <Input
              {...register("Address", { required: true })}
              size={"sm"}
              borderColor={errors?.Address ? "red.500" : "gray.400"}
              borderRadius={"0.25rem"}
              placeholder=""
            />
            {errors.Address && (
              <Text color="red.500" fontSize="xs">
                Address is required.
              </Text>
            )}
          </Box>

          <Box>
            <Text fontSize={"1rem"} ml="2" mb="0.5">
              Team Size
            </Text>
            <Input
              {...register("teamSize", { required: true })}
              size={"sm"}
              borderColor={errors?.teamSize ? "red.500" : "gray.400"}
              borderRadius={"0.25rem"}
              placeholder=""
            />
            {errors.teamSize && (
              <Text color="red.500" fontSize="xs">
                Team Size no is required.
              </Text>
            )}
          </Box>

          <Box>
            <Text fontSize={"1rem"} ml="2" mb="0.5">
              No of Users
            </Text>
            <Input
              {...register("numberOfUsers", { required: true })}
              size={"sm"}
              borderColor={errors?.numberOfUsers ? "red.500" : "gray.400"}
              borderRadius={"0.25rem"}
              placeholder=""
            />
            {errors.numberOfUsers && (
              <Text color="red.500" fontSize="xs">
                numberOfUsers no is required.
              </Text>
            )}
          </Box>

          <Box>
            <Text fontSize={"1rem"} ml="2" mb="0.5">
              Web URL
            </Text>
            <Input
              {...register("webURL", { required: true })}
              size={"sm"}
              borderColor={errors?.webURL ? "red.500" : "gray.400"}
              borderRadius={"0.25rem"}
              placeholder=""
            />
            {errors.webURL && (
              <Text color="red.500" fontSize="xs">
                webURL no is required.
              </Text>
            )}
          </Box>

          <Box>
            <Text fontSize={"1rem"} ml="2" mb="0.5">
              State
            </Text>
            <Input
              {...register("State", { required: true })}
              size={"sm"}
              borderColor={errors?.State ? "red.500" : "gray.400"}
              borderRadius={"0.25rem"}
              placeholder=""
            />
            {errors.State && (
              <Text color="red.500" fontSize="xs">
                State no is required.
              </Text>
            )}
          </Box>

          <Box>
            <Text fontSize={"1rem"} ml="2" mb="0.5">
              Pincode
            </Text>
            <Input
              {...register("Pincode", { required: true })}
              size={"sm"}
              borderColor={errors?.Pincode ? "red.500" : "gray.400"}
              borderRadius={"0.25rem"}
              placeholder=""
            />
            {errors.Pincode && (
              <Text color="red.500" fontSize="xs">
                Pincode no is required.
              </Text>
            )}
          </Box>

          <Box>
            <Text fontSize={"1rem"} ml="2" mb="0.5">
              Valid Up To
            </Text>
            <Input
              {...register("validupTo", { required: true })}
              size={"sm"}
              borderColor={errors?.validupTo ? "red.500" : "gray.400"}
              borderRadius={"0.25rem"}
              placeholder=""
            />
            {errors.validupTo && (
              <Text color="red.500" fontSize="xs">
                validupTo no is required.
              </Text>
            )}
          </Box>

          {/* <Box>
            <Text fontSize={"1rem"} ml="2" mb="0.5">
              Integration Permission
            </Text>
            <HStack
              spacing={2}
              align="stretch"
              className="mb-2 items-center w-full text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg sm:flex dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              wrap={"wrap"}
            >
              {integrationPermissions?.map((data: any, index: number) => (
                <Box
                  key={index}
                  className="w-full border-b border-gray-200 sm:border-b-0 sm:border-r dark:border-gray-600"
                  display="flex"
                  alignItems="center"
                  pl={3}
                >
                  <Checkbox
                    id={`integration-checkbox-${index}`}
                    value={data}
                    size="sm"
                    colorScheme="blue"
                    bg="gray.100"
                    border="gray.300"
                    borderRadius="md"
                    checked={selectedItems.includes(data)}
                    onChange={(e) => handleCheckboxChange(data)}
                  />

                  <Text
                    py={3}
                    ml={2}
                    fontSize="sm"
                    fontWeight="medium"
                    color="gray.900"
                    _dark={{ color: "gray.300" }}
                  >
                    {data}
                  </Text>
                </Box>
              ))}
            </HStack>
          </Box>

          <Box>
            <Text fontSize={"1rem"} ml="2" mb="0.5">
              Menu Permissions
            </Text>
            <HStack
              spacing={2}
              align="stretch"
              className="mb-2 items-center w-full text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg sm:flex dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              wrap={"wrap"}
            >
              {menuPermissions?.map((data: any, index: number) => (
                <Box
                  key={index}
                  className="w-full border-b border-gray-200 sm:border-b-0 sm:border-r dark:border-gray-600"
                  display="flex"
                  alignItems="center"
                  pl={3}
                >
                  <Checkbox
                    id={`menu-checkbox-${index}`}
                    value={data}
                    size="sm"
                    colorScheme="blue"
                    bg="gray.100"
                    border="gray.300"
                    borderRadius="md"
                    checked={selectedItems.includes(data)}
                    onChange={(e) => handleCheckboxChange(data)}
                  />

                  <Text
                    py={3}
                    ml={2}
                    fontSize="sm"
                    fontWeight="medium"
                    color="gray.900"
                    _dark={{ color: "gray.300" }}
                  >
                    {data}
                  </Text>
                </Box>
              ))}
            </HStack>
          </Box> */}

          <Box>
            <Text fontSize={"1rem"} ml="2" mb="0.5">
              Choose Image
            </Text>
            <Input
              {...register("CompanyImageOne")}
              borderColor={errors?.CompanyImageOne ? "red.500" : "gray.400"}
              size="sm"
              type="file"
              borderRadius="0.25rem"
              sx={{
                "::file-selector-button": {
                  bg: "gray.500",
                  color: "white",
                  ml: -6,
                  mt: 0.7,
                  py: 1.45,
                  px: 12,
                  mr: 15,
                  borderRadius: "0.25rem",
                  _hover: {
                    bg: "blue.600",
                  },
                },
              }}
              flexGrow={1}
            />
            {errors.CompanyImageOne && (
              <Text color="red.500" fontSize="xs">
                image is required.
              </Text>
            )}
       
            {!isImageChanged && (
              <Flex
                mt={3}
                alignItems={"center"}
                gap={2}
                // opacity={uploading ? "0.5" : "1"}
              >
                <Image
                  src={user?.CompanyImageOne}
                  alt="Uploaded"
                  boxSize="60px"
                  objectFit="cover"
                  borderRadius="full"
                />
                <Tag fontSize="sm" colorScheme="green">
                  User Image
                </Tag>
              </Flex>
            )}
          </Box>
          <Box
            display={"flex"}
            justifyContent={"flex-end"}
            alignItems={"center"}
          >
            <Button
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
              Update Admin
            </Button>
          </Box>
        </SimpleGrid>
      </form>
      {/* inputs end */}
      <DevTool control={control} />
    </Stack>
  );
};

export default UpdateAdmin;
