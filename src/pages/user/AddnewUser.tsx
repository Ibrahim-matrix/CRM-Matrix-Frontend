/*
  AddnewUser Component:
  This component is a form for adding a new user. It provides the following functionalities:
  - Input fields for capturing user details such as name, phone number, email, branch, city, username,
    user type, and password.
  - An option to upload an image for the user.
  - A dropdown for selecting permissions.
  - Validation for required fields and password length.
  - Dispatching Redux actions to fetch branch, user, and city data.
  - Submitting the form data to the server using Redux actions.
  - Navigating to the "team-list" page upon successful submission.

  The form data is handled using the react-hook-form library, and Chakra UI components are used for styling.
*/

import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Select as ChakraSelect,
  SimpleGrid,
  Stack,
  Text,
  Grid,
  GridItem,
  HStack,
  Checkbox,
  Wrap,
  WrapItem,
  Tag,
  TagLabel,
  TagCloseButton,
  Menu,
  MenuButton,
  MenuList,
  VStack,
  Progress,
  Flex,
  Spinner,
  Image,
} from "@chakra-ui/react";
import { Select as ChakraReactSelect } from "chakra-react-select";

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getData, postData } from "../../redux/actions/common.action";
import Select from "react-select";
// import Select from "react-select";
import makeAnimated from "react-select/animated";
import { useForm, useWatch } from "react-hook-form";
import { DevTool } from "@hookform/devtools";
import { useToast } from "@chakra-ui/react";
import { FaEdit, FaEye } from "react-icons/fa";
import { ChevronDownIcon } from "@chakra-ui/icons";
import Cookies from "js-cookie";
import axios from "axios";
import { BASE_URL } from "../../config/RequestMethod";

interface AddUsers {
  Email: string;
  Name: string;
  UserName: string;
  UserProfile: string;
  UserType: number;
  Phone: number;
  MacAddress: string;
  City: string;
  Branch: string;
  Password: string;
  assignId: string;
  image: any;
  // selectedUsers: Array<string>;
}

// const initialState: AddUsers = {
//   Email: "",
//   Name: "",
//   UserName: "",
//   UserType: "",
//   Phone: 0,
//   City: "",
//   MacAddress: "",
//   Password: "",
//   Branch: "",
//   Password: "",
//   image: null,
// };
interface imageData {
  file: any;
}
const initialImage = {
  file: null,
};

interface SigninUser {
  signinuser: {
    UserType: number;
    menuPermissions: [string];
  };
}

interface User {
  _id: string;
  Name: string;
  Branch: string[];
  City: string;
}

const AddnewUser: React.FC = () => {
  // const [formData, setFormdata] = useState(null);
  const [image, setImage] = useState<imageData>(initialImage);
  const [selectedMenus, setSelectedMenus] = useState<string[]>([]);
  const [permissionAccess, setPermissionAccess] = useState<
    { name: string; access: "Viewer" | "Editor" }[]
  >([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [permission, setPermission] = useState<any[]>([]);

  //getting the values of branch ,users and city using  the useSelector hook from common reducer.
  const { branches, users, cities, loading } = useSelector(
    (state: any) => state.common
  );

  // Destructuring the methods and properties from the useForm hook
  const {
    register,
    handleSubmit,
    control,
    setValue,
    // setValue,
    formState: { errors },
  } = useForm<AddUsers>();

  const selectedBranchName = useWatch({ control, name: "Branch" });
  const selectedCityName = useWatch({ control, name: "City" });

  console.log(selectedCityName);

  const selectedProfile = useWatch({ control, name: "UserProfile" });

  const { signinuser } = useSelector(
    (state: { common: SigninUser }) => state.common
  );
  const { menuPermissions } = signinuser;

  useEffect(() => {
    setValue("City", "");
    setPermission([]);
  }, [selectedBranchName]);

  const profileMenuMap: Record<string, string[]> = {
    User: ["Dashboard", "Lead List"],
    Manager: ["Dashboard", "Lead List", "Team List"],
    Custom: menuPermissions, // all allowed
  };

  useEffect(() => {
    if (selectedProfile === "Custom") return;

    const allowed = profileMenuMap[selectedProfile] || [];

    // Filter selectedMenus to only include allowed items
    setSelectedMenus((prevSelected) =>
      prevSelected.filter((menu) => allowed.includes(menu))
    );

    // Optionally also remove from permissionAccess
    setPermissionAccess((prevAccess) =>
      prevAccess.filter((item) => allowed.includes(item.name))
    );
  }, [selectedProfile]);

  // Extract the permissions from the signinuser object

  console.log(menuPermissions);

  const userMenus = ["Dashboard", "Lead List", "Proposal List"];
  const managerMenus = ["Dashboard", "Lead List", "Team List", "Proposal List"];

  let allowedMenus: string[] = [];

  if (selectedProfile === "User") {
    allowedMenus = userMenus;
  } else if (selectedProfile === "Manager") {
    allowedMenus = managerMenus;
  } else if (selectedProfile === "Custom") {
    allowedMenus = menuPermissions;
  }

  // Fetch branch, user, and city data when the component mounts
  useEffect(() => {
    dispatch(getData("branch")); // Fetch branch data
    dispatch(getData("user")); // Fetch user data
    dispatch(getData("city")); // Fetch city data
  }, [getData]);

  const endpoint: string = "user"; // API endpoint for posting user data
  const dispatch: any = useDispatch();
  const Navigate = useNavigate();

  // const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const file = e.target.files?.[0];
  //   setImage({
  //     ...image,
  //     file: file || null, // Store the selected file in the formData
  //   });
  // };

  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [uploading, setUploading] = useState<boolean>(false);

  console.log(uploadedImageUrl);
  // const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const file = e.target.files?.[0];
  //   if (!file) return;

  //   const formData = new FormData();
  //   formData.append("file", file);
  //   formData.append("upload_preset", "unsigned_profile_uploads"); // ⬅️ from Cloudinary

  //   try {
  //     const response = await fetch(
  //       "https://api.cloudinary.com/v1_1/dyvp4cxgd/image/upload",
  //       {
  //         method: "POST",
  //         body: formData,
  //       }
  //     );

  //     const data = await response.json();
  //     setUploadedImageUrl(data.secure_url); // store URL
  //     toast({
  //       title: "Image uploaded",
  //       status: "success",
  //       duration: 2000,
  //       isClosable: true,
  //     });
  //   } catch (err) {
  //     console.error("Cloudinary Upload Error", err);
  //     toast({
  //       title: "Upload failed",
  //       status: "error",
  //       duration: 2000,
  //       isClosable: true,
  //     });
  //   }
  // };

  const handleImageChange = async (e: any) => {
    const token = Cookies.get("token");
    const formData = new FormData();
    formData.append("file", e.target.files[0]);

    try {
      setUploading(true);
      const res = await axios.post(`${BASE_URL}upload-image`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          // Don't manually set Content-Type when sending FormData
        },
        onUploadProgress: (progressEvent: any) => {
          const percent = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setUploadProgress(percent);
        },
      });

      console.log("Image URL:", res.data.imageUrl);

      if (res.data?.imageUrl) {
        setUploadedImageUrl(res.data.imageUrl);
      }
    } catch (error: any) {
      console.error("Upload failed:", error.response?.data || error.message);
      toast({
        title: "Upload failed",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const toast = useToast();

  const handleAccessChange = (
    permissionName: string,
    newAccess: "Viewer" | "Editor"
  ) => {
    setPermissionAccess((prev) =>
      prev.map((p) =>
        p.name === permissionName ? { ...p, access: newAccess } : p
      )
    );
  };

  const handleCheckboxChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    value: string
  ) => {
    if (e.target.checked) {
      setSelectedMenus((prevPermissions) => [...prevPermissions, value]);
      setPermissionAccess((prev) => [
        ...prev,
        { name: value, access: "Viewer" },
      ]);
    } else {
      setSelectedMenus((prevPermissions) =>
        prevPermissions.filter((permission) => permission !== value)
      );
      setPermissionAccess((prev) => prev.filter((p) => p.name !== value));
    }
  };

  console.log(permissionAccess);

  const transformedPermissions = permission.map((item) => ({
    userName: item.label,
    userId: item.value,
  }));
  console.log(transformedPermissions);

  const onSubmit = (formData: AddUsers) => {
    console.log(formData);
    const requestData = {
      ...formData,
      UserType: 2,
      // file: image.file,
      menuPermissions: selectedMenus,
      permissionAccess: permissionAccess,
      Permission: transformedPermissions,
      image: uploadedImageUrl,
    };

    const selectedPermissions = selectedUsers.map((user: any) => user.label);
    // requestData.selectedUsers = selectedPermissions;

    dispatch(postData(requestData, endpoint, Navigate, toast)).then(() => {
      dispatch(getData(endpoint)); // Fetch updated user data after successful submission
      Navigate("/user-list"); // Navigate to the "team-list" page
      console.log("ok");
    });
  };

  // Create option elements for each branch
  const branchoptions = branches?.map((branch: any) => (
    <option key={branch._id} value={branch.BranchName}>
      {branch.BranchName}
    </option>
  ));

  console.log(branchoptions);

  // Create option elements for each city
  const selectedBranchId = branches?.filter(
    (branch: any) => branch?.BranchName === selectedBranchName
  )[0]?._id;
  console.log(selectedBranchId);
  const filteredCities = cities?.filter(
    (city: any) => city?.branchId === selectedBranchId
  );
  const cityoptions = filteredCities?.map((city: any) => (
    <option key={city._id} value={city.cityName}>
      {city.cityName}
    </option>
  ));

  // const selectedCity = cities?.find((city: any) => city._id === selectedCityName)
  // const selectedCityName = selectedCity?.cityName

  useEffect(() => {
    setFilteredUsers(
      users?.filter((user: any) => {
        if (selectedBranchName) {
          if (selectedCityName) {
            return (
              user?.City === selectedCityName &&
              user?.Branch?.[0] === selectedBranchName
            );
          } else {
            return user?.Branch?.[0] === selectedBranchName;
          }
        }
      })
    );
  }, [selectedBranchName, selectedCityName]);
  console.log(filteredUsers);
  const useroptions = filteredUsers?.map((user: any) => (
    <option
      key={user._id}
      value={user._id}
      style={{
        backgroundColor: permission.some((p) => p._id === user._id)
          ? "#c7c7c7ff" // Chakra's gray.100
          : "white",
      }}
    >
      {user.Name}
    </option>
  ));

  const animatedComponents = makeAnimated();
  const [selectedUsers, setSelectedUsers] = useState([]);

  const handleSelectChange = (selectedOptions: any) => {
    setSelectedUsers(selectedOptions);
  };

  // Create options for each user
  // const userOptions = users?.map((user: any) => ({
  //   value: user._id,
  //   label: user.Name,
  // }));

  const userOptions = filteredUsers.map((user) => ({
    label: user.Name,
    value: user._id,
  }));

  // const permission = selectedUsers.map(user => ({
  //   label: user.Name,
  //   value: user._id
  // }));

  return (
    <Stack h="100%">
      {/* inputs starts */}
      <form onSubmit={handleSubmit(onSubmit)}>
        <SimpleGrid
          columns={{ sm: 1, md: 2, lg: 3 }} // Set the number of columns for different screen sizes
          autoFlow="row" // Set the flow of the grid items to row
          gap={7}
          px={[2, 5]} // Set the horizontal padding for different screen sizes
          py={[2, 5]} // Set the vertical padding for different screen sizes
          minWidth="250px"
        >
          <Box>
            <FormControl variant="floating" id="Name">
              <Input
                autoComplete="off"
                {...register("Name", {
                  required: "name is required",
                })}
                borderColor={errors?.Name ? "red.500" : "gray.400"}
                borderRadius={"0.25rem"}
                size="sm"
                placeholder=" "
                className="autocomplete-input"
              />
              <FormLabel fontWeight={"400"} color={"gray.600"}>
                Enter Name
              </FormLabel>
              {errors.Name && (
                <Text color="red.500" fontSize="xs">
                  {errors.Name?.message}
                </Text>
              )}
            </FormControl>
          </Box>
          <Box>
            <FormControl variant="floating" id="Phone">
              <Input
                autoComplete="off"
                {...register("Phone", {
                  required: "mobile no is required",
                })}
                borderColor={errors?.Phone ? "red.500" : "gray.400"}
                borderRadius={"0.25rem"}
                size="sm"
                placeholder=" "
                type="number"
              />
              <FormLabel fontWeight={"400"} color={"gray.600"}>
                Enter Phone No.
              </FormLabel>
              {errors.Phone && (
                <Text color="red.500" fontSize="xs">
                  mobile no is required
                </Text>
              )}
            </FormControl>
          </Box>
          <Box>
            <FormControl variant="floating" id="Email">
              <Input
                autoComplete="off"
                {...register("Email", {
                  required: "email ID is required",
                })}
                borderColor={errors?.Email ? "red.500" : "gray.400"}
                borderRadius={"0.25rem"}
                size="sm"
                placeholder=" "
              />
              <FormLabel fontWeight={"400"} color={"gray.600"}>
                Enter Email ID
              </FormLabel>
              {errors.Email && (
                <Text color="red.500" fontSize="xs">
                  email ID is required
                </Text>
              )}
            </FormControl>
          </Box>
          <Box>
            <FormControl variant="floating" id="Branch">
              <ChakraSelect
                {...register("Branch", {
                  required: "Branch is required",
                })}
                borderColor={errors?.Branch ? "red.500" : "gray.400"}
                size="sm"
                borderRadius={"0.25rem"}
                placeholder=""
              >
                {" "}
                <option value="" disabled selected>
                  {loading ? " the Branches..." : "Select Branch"}
                </option>
                {branchoptions}
              </ChakraSelect>
              <FormLabel fontWeight={"400"} color={"gray.600"}>
                Branch
              </FormLabel>
              {errors.Branch && (
                <Text color="red.500" fontSize="xs">
                  branch is required
                </Text>
              )}
            </FormControl>
          </Box>
          <Box>
            <FormControl variant="floating" id="City">
              <ChakraSelect
                disabled={!selectedBranchName}
                {...register("City", {
                  required: "City is required",
                })}
                borderColor={errors?.City ? "red.500" : "gray.400"}
                size="sm"
                borderRadius={"0.25rem"}
                placeholder=""
              >
                <option value="" disabled selected>
                  {selectedBranchName
                    ? "Select City"
                    : "Please Select the Branch"}
                </option>
                {cityoptions}
              </ChakraSelect>
              <FormLabel fontWeight={"400"} color={"gray.600"}>
                City
              </FormLabel>
              {errors.City && (
                <Text color="red.500" fontSize="xs">
                  City is required
                </Text>
              )}
            </FormControl>
          </Box>

          <Box>
            <FormControl variant="floating" id="UserName">
              <Input
                autoComplete="off"
                {...register("UserName", {
                  required: "UserName is required",
                })}
                borderColor={errors?.UserName ? "red.500" : "gray.400"}
                borderRadius={"0.25rem"}
                size="sm"
                placeholder=" "
              />
              <FormLabel fontWeight={"400"} color={"gray.600"}>
                Enter Unique Username
              </FormLabel>
              {errors.UserName && (
                <Text color="red.500" fontSize="xs">
                  username is required
                </Text>
              )}
            </FormControl>
          </Box>
          <Box>
            <FormControl variant="floating" id="UserProfile">
              <ChakraSelect
                {...register("UserProfile", {
                  required: "User Profile is Requeired",
                })}
                borderColor={errors?.UserProfile ? "red.500" : "gray.400"}
                size="sm"
                mt={6}
                borderRadius={"0.25rem"}
                placeholder=""
                onChange={(e) => {
                  const value = e.target.value;
                  setValue("UserProfile", value); // <- Manually update form state
                }}
              >
                <option value="" disabled selected>
                  Select the User Profile
                </option>
                <option value="Custom">Custom</option>
                <option value="Manager">Manager</option>
                <option value="User">User</option>
              </ChakraSelect>
              <FormLabel fontWeight={"400"} color={"gray.600"}>
                User Profile
              </FormLabel>
              {errors.UserProfile && (
                <Text color="red.500" fontSize="xs">
                  user Profile is required.
                </Text>
              )}
            </FormControl>
          </Box>

          {/* Assign To */}
          {/* <Box>
            <FormControl isInvalid={!!errors?.assignId}>
              <FormLabel fontWeight="semibold" color="gray.700">Assign To</FormLabel>
              <ChakraSelect
                size="sm"
                placeholder={selectedBranchName ? "Select Assigned To" : "Please Select Branch First"}
                isDisabled={!selectedBranchName}
                borderColor="gray.300"
                {...register("assignId", { required: "Assigned To is required." })}
              >
                {useroptions}
              </ChakraSelect>
              {errors.assignId && (
                <Text color="red.500" fontSize="xs" mt={1}>
                  {errors.assignId.message}
                </Text>
              )}
            </FormControl>
          </Box> */}
          <GridItem colSpan={1}>
            <Box>
              <Text fontSize={"0.9rem"} ml="2" mb="0.5">
                User Image
              </Text>
              <Input
                {...register("image", {
                  required: "image is required",
                })}
                borderColor={"gray.400"}
                size="sm"
                type="file"
                accept="image/*"
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
                onChange={handleImageChange}
              />
              {/* Upload Spinner */}
              {uploading && (
                <Flex mt={2} align="center" gap={2}>
                  <Spinner size="sm" />
                  <Text fontSize="sm">{uploadProgress}% uploading...</Text>
                </Flex>
              )}

              {/* Show Uploaded Image Preview */}
              {uploadedImageUrl && !uploading && (
                <Flex mt={3} alignItems={"center"}>
                  <Image
                    src={uploadedImageUrl}
                    alt="Uploaded"
                    boxSize="60px"
                    objectFit="cover"
                    borderRadius="full"
                  />
                  <Text fontSize="sm" color="green.500">
                    Uploaded successfully!
                  </Text>
                </Flex>
              )}
              {errors.image && (
                <Text color="red.500" fontSize="xs">
                  User Image is required
                </Text>
              )}
            </Box>
          </GridItem>

          <Box></Box>

          {/* <FormControl isInvalid={!!errors?.assignId}>
            <FormLabel    fontSize="sm"
              fontWeight="semibold" color="gray.700">Assign To</FormLabel>
            <ChakraSelect
              size="sm"
              placeholder={selectedBranchName ? "Select Assigned To" : "Please Select Branch First"}
              isDisabled={!selectedBranchName}
              borderColor="gray.300"
              onChange={(e) => {
                const selectedUser = users.find((u: any) => u._id === e.target.value);
                if (selectedUser && !permission.find((p) => p._id === selectedUser._id)) {
                  setPermission((prev) => [...prev, selectedUser]);
                }
              }}
            >
              {useroptions}
            </ChakraSelect>
            {errors.assignId && (
              <Text color="red.500" fontSize="xs" mt={1}>
                {errors.assignId.message}
              </Text>
            )}
          </FormControl> */}
          {/* {(selectedBranchName && (selectedProfile === "Manager" || selectedProfile === "Custom")) && <FormControl>
            <FormLabel fontSize="sm" fontWeight="semibold" color="gray.700">
              Assign To
            </FormLabel>

            <Box w={"full"}>
              <Menu closeOnSelect={false} matchWidth>
                <MenuButton as={Button} size="sm" rightIcon={<ChevronDownIcon />} w="full">
                  Select Assigned To
                </MenuButton>

                <MenuList maxH="180px" overflowY="auto">
                  <VStack align="start" spacing={1} px={2} py={1}>
                    {filteredUsers.map((user) => (
                      <Checkbox
                        key={user._id}
                        isChecked={permission.some((p) => p._id === user._id)}
                        onChange={(e) => {
                          const checked = e.target.checked;
                          if (checked) {
                            if (!permission.find((p) => p._id === user._id)) {
                              setPermission((prev) => [...prev, user]);
                            }
                          } else {
                            setPermission((prev) =>
                              prev.filter((p) => p._id !== user._id)
                            );
                          }
                        }}
                      >
                        {user.Name}
                      </Checkbox>
                    ))}
                  </VStack>
                </MenuList>
              </Menu>
            </Box>

            {permission.length === 0 && (
              <Text color="red.500" fontSize="xs" mt={1}>
                Assign To is required.
              </Text>
            )}
          </FormControl>} */}

          {/* assign to Display */}
          {/* {(selectedBranchName && (selectedProfile === "Manager" || selectedProfile === "Custom")) && <Box>
            <Text
              fontSize="sm"
              fontWeight="semibold"
              color="gray.600"
              my={2}
              bg="white"
              zIndex={1}
            >
              Assigned Users
            </Text>
            <Box
              bg="white"
              p={4}
              borderRadius="lg"
              boxShadow="sm"
              border="1px solid"
              borderColor="gray.200"
              h="150px" // You can adjust height as per your grid
              overflowY="auto"
              position="relative"
            >


              {permission.length > 0 ? (
                <Wrap spacing={2}>
                  {permission.map((user) => (
                    <WrapItem key={user._id}>
                      <Tag
                        size="md"
                        borderRadius="full"
                        variant="solid"
                        colorScheme="blue"
                        px={3}
                        py={1}
                        boxShadow="xs"
                        transition="transform 0.2s ease"
                        _hover={{
                          transform: "scale(1.03)",
                          boxShadow: "md",
                        }}
                        cursor={"pointer"}
                      >
                        <TagLabel fontWeight="medium">{user.Name}</TagLabel>
                        <TagCloseButton
                          onClick={() =>
                            setPermission((prev) => prev.filter((u) => u._id !== user._id))
                          }
                        />
                      </Tag>
                    </WrapItem>
                  ))}
                </Wrap>
              ) : (
                <Text fontSize="xs" color="gray.400">
                  No users assigned yet.
                </Text>
              )}
            </Box>

          </Box>} */}

          {selectedBranchName &&
            (selectedProfile === "Manager" || selectedProfile === "Custom") && (
              <Box>
                <Text>Select Users for Assigning to {selectedProfile}</Text>
                <ChakraReactSelect
                  isMulti
                  tagVariant="solid"
                  options={userOptions}
                  value={permission}
                  onChange={(selected: any) => setPermission(selected)}
                  placeholder="Select Assigned To"
                  closeMenuOnSelect={false}
                  chakraStyles={{
                    menu: (provided: any) => ({
                      ...provided,
                      boxShadow: "lg",
                      borderRadius: "md",
                      border: "1px solid #E2E8F0",
                      mt: 1,
                    }),
                  }}
                />
              </Box>
            )}
        </SimpleGrid>
        <Grid
          templateColumns="repeat(3, 1fr)"
          gap={4}
          autoFlow="row" // Set the flow of the grid items to row
          px={[2, 5]} // Set the horizontal padding for different screen sizes
          minWidth="250px"
        >
          <GridItem colSpan={3}>
            <Box className="inputSection">
              <Text className="inputLabel">Permissions</Text>
              <HStack
                spacing={2}
                align="stretch"
                className="mb-2 items-center w-full text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg sm:flex dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                wrap={"wrap"}
              >
                {/* {menuPermissions?.map((data, index) => {
                  const isAllowed = selectedProfile === "Custom" || allowedMenus.includes(data)
                  return (
                    // <Box
                    //   key={index}
                    //   className="w-full"
                    //   display="flex"
                    //   alignItems="center"
                    //   px={3}
                    //   border="1px solid"
                    //   borderColor="gray.500"
                    //   borderRadius="md"
                    // >
                    //   <HStack>
                    //     <Checkbox
                    //       isDisabled={!isAllowed}
                    //       id="vue-checkbox-list"
                    //       value={data}
                    //       size="sm"
                    //       colorScheme="blue"
                    //       bg="gray.100"
                    //       border="gray.300"
                    //       borderRadius="md"
                    //       checked={selectedMenus.includes(data)} // Add this line
                    //       onChange={(e) => handleCheckboxChange(e, data)} // Add this line
                    //     />

                    //     <Text
                    //       py={3}
                    //       ml={2}
                    //       fontSize="sm"
                    //       fontWeight="medium"
                    //       color={isAllowed ? "gray.800" : "gray.400"}
                    //     >
                    //       {data}
                    //     </Text>
                    //   </HStack>
                    //   <ChakraSelect
                    //     size="sm"
                    //     width="100px"
                    //     value={permissionAccess.find((p) => p.name === data)?.access || "Viewer"}
                    //     onChange={(e) =>
                    //       handleAccessChange(data, e.target.value as "Viewer" | "Editor")
                    //     }
                    //     isDisabled={!selectedMenus.includes(data)}
                    //   >
                    //     <option value="Viewer">Viewer</option>
                    //     <option value="Editor">Editor</option>
                    //   </ChakraSelect>
                    // </Box>
                  )
                })} */}
                <SimpleGrid columns={{ md: 2, lg: 3 }} spacing={4}>
                  {menuPermissions?.map((data, index) => {
                    const isAllowed =
                      selectedProfile === "Custom" ||
                      allowedMenus.includes(data);
                    const isChecked = selectedMenus.includes(data);
                    const currentAccess =
                      permissionAccess.find((p) => p.name === data)?.access ||
                      "Viewer";

                    return (
                      <Box
                        key={index}
                        p={4}
                        bg="white"
                        border="1px solid"
                        borderColor="gray.200"
                        borderRadius="xl"
                        boxShadow="sm"
                        transition="all 0.2s"
                        _hover={{ boxShadow: "md", borderColor: "blue.300" }}
                        display="flex"
                        alignItems="center"
                        justifyContent="space-between"
                      >
                        <HStack spacing={4}>
                          <Checkbox
                            isDisabled={!isAllowed}
                            value={data}
                            size="md"
                            colorScheme="blue"
                            isChecked={isChecked}
                            onChange={(e) => handleCheckboxChange(e, data)}
                          />
                          <Text
                            fontSize="md"
                            fontWeight="semibold"
                            color={isAllowed ? "gray.700" : "gray.400"}
                          >
                            {data}
                          </Text>
                        </HStack>

                        <ChakraSelect
                          ml={2}
                          size="sm"
                          w="130px"
                          value={currentAccess}
                          onChange={(e) =>
                            handleAccessChange(
                              data,
                              e.target.value as "Viewer" | "Editor"
                            )
                          }
                          isDisabled={!isChecked}
                          variant="filled"
                          bg="gray.50"
                          borderRadius="md"
                          _hover={{ bg: "gray.100" }}
                        >
                          <option value="Viewer">
                            <Box>
                              Viewer <FaEye />
                            </Box>
                          </option>
                          <option value="Editor">Editor</option>
                        </ChakraSelect>
                      </Box>
                    );
                  })}
                </SimpleGrid>
              </HStack>
            </Box>
          </GridItem>
        </Grid>
        <Box
          display={"flex"}
          justifyContent={"flex-end"}
          alignItems={"center"}
          mx={4}
        >
          <Button
            onClick={() => Navigate("/user-list")}
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
            Submit
          </Button>
        </Box>{" "}
      </form>
      {/* inputs end */}
      <DevTool control={control} />
    </Stack>
  );
};

export default AddnewUser;
