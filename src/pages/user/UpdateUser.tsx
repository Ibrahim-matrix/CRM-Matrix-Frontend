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
  FormControl,
  FormLabel,
  GridItem,
  Input,
  SimpleGrid,
  Stack,
  Text,
  Toast,
  Select as ChakraSelect,
  HStack,
  Checkbox,
  useToast,
  Flex,
  Image,
  Tag,
  Spinner,
} from "@chakra-ui/react";
import { Select as ChakraReactSelect } from "chakra-react-select";
import React, { useEffect, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import {
  getData,
  getDataById,
  updateData,
} from "../../redux/actions/common.action";
import { useNavigate, useParams } from "react-router-dom";
import { DevTool } from "@hookform/devtools";
import UpdatePassword from "./UpdatePassword";
import { FaEdit, FaEye } from "react-icons/fa";
import Cookies from "js-cookie";
import axios from "axios";
import { BASE_URL } from "../../config/RequestMethod";

interface permission {
  name: string;
  access: "Viewer" | "Editor";
}
interface permission2 {
  userName: string;
  userId: string;
}

//interface for the updating user
interface UpdateUsers {
  user: {
    Name: string;
    UserName: string;
    UserType: string;
    UserProfile: string;
    Email: string;
    Phone: string;
    role: string;
    Branch: string;
    permissionAccess: permission[];
    Permission: permission2[];
    City: string;
    image: string;
    serialNumber: number;
    _id: string;
  };
}

interface User {
  _id: string;
  Name: string;
  Branch: string[];
  City: string;
}

//interface for the prefilled form values
interface FormValues {
  Name: string;
  UserName: string;
  UserType: string;
  UserProfile: string;
  Email: string;
  Phone: string;
  role: string;
  Branch: string;
  permissionAccess: permission[];
  Permission: permission2[];
  City: string;
  image: string;
  serialNumber: number;
  _id: string;
}

const UpdateUser = () => {
  // Accessing the user state from the Redux store
  const { user, branches, cities, signinuser, loading, users } = useSelector(
    (state: any) => state.common
  );
  console.log(user?.permissionAccess);

  // Initializing form and error handling using react-hook-form
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    control,
    formState: { errors },
  } = useForm<FormValues>();

  const selectedProfile = useWatch({ control, name: "UserProfile" });
  const selesctedBranchName = useWatch({ control, name: "Branch" });
  const selectedCityName = useWatch({ control, name: "City" });

  const [initialPermission, setInitialPermission] = useState<any[]>([]);
  const [initialPermissionAccess, setInitialPermissionAccess] = useState<
    permission[]
  >([]);
  const [initialProfile, setInitialProfile] = useState<string | null>(null);
  const [initialBranch, setInitialBranch] = useState<string | null>(null);

  const [selectedMenus, setSelectedMenus] = useState<string[]>([]);
  const [permissionAccess, setPermissionAccess] = useState<permission[]>([]);
  const { menuPermissions } = signinuser;
  const [permission, setPermission] = useState<any[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);

  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [uploading, setUploading] = useState<boolean>(false);
  const [isImageChanged, setIsImageChanged] = useState<boolean>(false);

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
      setIsImageChanged(true);

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

  console.log(permission);
  console.log(filteredUsers);
  console.log(users);

  useEffect(() => {
    setValue("City", "");
  }, [selesctedBranchName]);

  const profileMenuMap: Record<string, string[]> = {
    User: ["Dashboard", "Lead List", "Proposal List"],
    Manager: ["Dashboard", "Lead List", "Team List", "Proposal List"],
    Custom: menuPermissions, // all allowed
  };
  useEffect(() => {
    setFilteredUsers(
      users?.filter((user: any) => {
        if (selesctedBranchName) {
          if (selectedCityName) {
            return (
              user?.City === selectedCityName &&
              user?.Branch?.[0] === selesctedBranchName
            );
          } else {
            return user?.Branch?.[0] === selesctedBranchName;
          }
        }
      })
    );
  }, [selesctedBranchName, selectedCityName]);

  useEffect(() => {
    if (!selesctedBranchName) return;

    if (selesctedBranchName === initialBranch) {
      // Restore original permission
      setPermission(initialPermission);
    } else {
      // Clear selections when different branch is selected
      setPermission([]);
    }
  }, [selesctedBranchName, initialBranch]);

  useEffect(() => {
    if (!selectedProfile || !initialProfile || !initialPermissionAccess.length)
      return;

    if (selectedProfile === initialProfile) {
      setPermissionAccess([...initialPermissionAccess]);
      setSelectedMenus(initialPermissionAccess.map((p) => p.name)); // 🧠 restore menu selection too
    } else {
      const allowed = profileMenuMap[selectedProfile] || [];
      setPermissionAccess((prev) =>
        prev.filter((perm) => allowed.includes(perm.name))
      );
      setSelectedMenus((prev) => prev.filter((menu) => allowed.includes(menu)));
    }
  }, [selectedProfile, initialProfile, initialPermissionAccess]);

  console.log(permissionAccess);

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

  useEffect(() => {
    dispatch(getData("branch"));
    dispatch(getData("city"));
    dispatch(getData("user"));
  }, []);

  const userMenus = ["Dashboard", "Lead List"];
  const managerMenus = ["Dashboard", "Lead List", "Team List"];

  let allowedMenus: string[] = [];

  if (selectedProfile === "User") {
    allowedMenus = userMenus;
  } else if (selectedProfile === "Manager") {
    allowedMenus = managerMenus;
  } else if (selectedProfile === "Custom") {
    allowedMenus = menuPermissions;
  }

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

  const userBranchName = Array.isArray(user?.Branch)
    ? user.Branch[0]
    : user?.Branch;

  const branchoptions = branches?.map((branch: any) => (
    <option
      key={branch?._id}
      value={branch?.BranchName}
      style={{
        backgroundColor:
          branch?.BranchName === userBranchName ? "#e2e8f0" : "white",
      }}
    >
      {branch?.BranchName}
    </option>
  ));

  const selectedBranchObj = branches.find((branch: any) =>
    selesctedBranchName?.includes(branch.BranchName)
  );
  const filteredCities = cities?.filter(
    (city: any) => city.branchId === selectedBranchObj?._id
  );

  const cityoptions = filteredCities?.map((city: any) => (
    <option
      key={city._id}
      value={city?.cityName}
      style={{
        backgroundColor: city?.cityName === user?.City ? "#e2e8f0" : "white",
      }}
    >
      {city?.cityName}
    </option>
  ));

  const [updatePassword, setUpdatePassword] = useState<boolean>(true);

  // Accessing the ID parameter from the URL
  const { id } = useParams();

  // Setting the endpoint for API requests
  const endpoint: string = "user";

  // Accessing the Redux dispatch function
  const dispatch: any = useDispatch();

  // Accessing the navigation function from react-router-dom
  const Navigate = useNavigate();

  const toast = useToast();

  // Fetching the user data by ID
  useEffect(() => {
    dispatch(getDataById(id, endpoint));
  }, [id]);

  // Resetting the form fields with user data when available
  useEffect(() => {
    if (user) {
      const updatedUser = {
        ...user,
        Branch: Array.isArray(user.Branch) ? user.Branch[0] : user.Branch,
      };
      reset(updatedUser);

      setSelectedMenus(user?.menuPermissions || []);
      if (user?.permissionAccess?.length) {
        setPermissionAccess(user?.permissionAccess);
        setInitialPermissionAccess(user?.permissionAccess);
      }
      setInitialBranch(updatedUser.Branch || null);
      setInitialProfile(updatedUser.UserProfile || null);

      // Match saved Permission with the userOptions for pre-fill
      const mappedPermissions =
        user?.Permission?.map((perm: any) =>
          users.find((u: any) => u._id === perm.userId)
        )
          ?.filter(Boolean)
          .map((u: any) => ({
            label: u.Name,
            value: u._id,
          })) || [];

      setPermission(mappedPermissions);
      setInitialPermission(mappedPermissions); // Save initial
    }
  }, [user, reset]);

  const userOptions = filteredUsers.map((user) => ({
    label: user.Name,
    value: user._id,
  }));

  console.log(filteredUsers);
  console.log(userOptions);

  const transformedPermissions = permission.map((item) => ({
    userName: item.label,
    userId: item.value,
  }));

  // Handling form submission
  const onSubmit = (data: FormValues) => {
    const payload = {
      ...data,
      menuPermissions: selectedMenus,
      permissionAccess: permissionAccess,
      Permission: transformedPermissions,
      image: uploadedImageUrl ? uploadedImageUrl : user?.image,
    };
    dispatch(updateData(id, endpoint, payload, Navigate, toast)).then(() => {
      dispatch(getData("user"));
      Navigate("/user-list");
    });
  };
  return (
    <Stack h="100%">
      {/* heading starts */}
      {/* <Box
        px={10}
        h="50px"
        display={"flex"}
        justifyContent={"flex-start"}
        alignItems={"center"}
      >
        {" "}
        <Text fontSize={"1.25rem"} fontWeight={"600"}>
         Update User
        </Text>
      </Box> */}
      {/* heading end */}
      {/* inputs starts */}
      <GridItem boxShadow="md" p="4" rounded="md" m={4} area={"header"}>
        <Button
          size={"sm"}
          _hover={{ bg: "#8f57b5", color: "whiteAlpha.900" }}
          w="8.188rem"
          bg={`${updatePassword === true ? "#8f57b5" : "#e7c7fc"}`}
          borderRadius={"0.25rem"}
          color={`${updatePassword === true ? "whiteAlpha.900" : "black.900"}`}
          fontWeight={"700"}
          fontSize={"1rem"}
          onClick={() => setUpdatePassword(true)}
        >
          Update User
        </Button>
        <Button
          size={"sm"}
          _hover={{ bg: "#8f57b5", color: "whiteAlpha.900" }}
          w="12.188rem"
          bg={`${updatePassword === false ? "#8f57b5" : "#e7c7fc"}`}
          borderRadius={"0.25rem"}
          color={`${updatePassword === false ? "whiteAlpha.900" : "black.900"}`}
          fontWeight={"700"}
          fontSize={"1rem"}
          mx={6}
          onClick={() => setUpdatePassword(false)}
        >
          Update User Password
        </Button>
      </GridItem>
      <>
        {updatePassword === true ? (
          <form onSubmit={handleSubmit(onSubmit)}>
            <SimpleGrid
              columns={{ sm: 1, md: 2, lg: 3 }}
              px={10}
              py={1}
              gap={6}
            >
              <Box>
                <Text fontSize={"1rem"} ml="2" mb="0.5">
                  Name
                </Text>
                <Input
                  {...register("Name", { required: true })}
                  size={"sm"}
                  borderColor={errors?.Name ? "red.500" : "gray.400"}
                  borderRadius={"0.25rem"}
                  placeholder={loading ? "Loading Name..." : ""}
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
                  placeholder={loading ? "Loading Phone Number..." : ""}
                />
                {errors.Phone && (
                  <Text color="red.500" fontSize="xs">
                    phone no is required.
                  </Text>
                )}
              </Box>
              <Box>
                <Text fontSize={"1rem"} ml="2" mb="0.5">
                  Email ID
                </Text>
                <Input
                  {...register("Email", { required: true })}
                  size={"sm"}
                  borderColor={errors?.Email ? "red.500" : "gray.400"}
                  borderRadius={"0.25rem"}
                  placeholder={loading ? "Loading Email ID..." : ""}
                />
                {errors.Email && (
                  <Text color="red.500" fontSize="xs">
                    email is required.
                  </Text>
                )}
              </Box>

              {/* <Box>
                <Text fontSize={"1rem"} ml="2" mb="0.5">
                  Enter Branch
                </Text>
                <Input
                  {...register("Branch", { required: true })}
                  size={"sm"}
                  borderColor={errors?.Branch ? "red.500" : "gray.400"}
                  borderRadius={"0.25rem"}
                  placeholder=""
                />
                {errors.Branch && (
                  <Text color="red.500" fontSize="xs">
                    Branch is required.
                  </Text>
                )}
              </Box> */}
              <Box>
                <FormControl variant="floating" id="Branch">
                  <Text fontSize={"1rem"} ml="2" mb="0.5">
                    Select Branch
                  </Text>
                  <ChakraSelect
                    {...register("Branch", {
                      required: "Branch is required",
                    })}
                    borderColor={errors?.Branch ? "red.500" : "gray.400"}
                    size="sm"
                    borderRadius={"0.25rem"}
                    placeholder={loading ? "Loading Branch..." : ""}
                  >
                    {branchoptions}
                  </ChakraSelect>
                  {/* <FormLabel fontWeight={"400"} color={"gray.600"}>
                    Branch
                  </FormLabel> */}
                  {errors.Branch && (
                    <Text color="red.500" fontSize="xs">
                      branch is required
                    </Text>
                  )}
                </FormControl>
              </Box>

              {/* <Box>
                <Text fontSize={"1rem"} ml="2" mb="0.5">
                  Enter City
                </Text>
                <Input
                  {...register("City", { required: true })}
                  size={"sm"}
                  borderColor={errors?.City ? "red.500" : "gray.400"}
                  borderRadius={"0.25rem"}
                  placeholder=""
                />
                {errors.City && (
                  <Text color="red.500" fontSize="xs">
                    City is required.
                  </Text>
                )}
              </Box> */}
              <Box>
                <FormControl variant="floating" id="City">
                  <Text fontSize={"1rem"} ml="2" mb="0.5">
                    Select City
                  </Text>
                  <ChakraSelect
                    disabled={!selesctedBranchName}
                    {...register("City", {
                      required: "City is required",
                    })}
                    borderColor={errors?.City ? "red.500" : "gray.400"}
                    size="sm"
                    borderRadius={"0.25rem"}
                    placeholder={loading ? "Loading City..." : ""}
                  >
                    <option value="" disabled selected>
                      Select City
                    </option>
                    {cityoptions}
                  </ChakraSelect>
                  {/* <FormLabel fontWeight={"400"} color={"gray.600"}>
                    City
                  </FormLabel> */}
                  {errors.City && (
                    <Text color="red.500" fontSize="xs">
                      City is required
                    </Text>
                  )}
                </FormControl>
              </Box>

              <Box>
                <Text fontSize={"1rem"} ml="2" mb="0.5">
                  Enter UserName
                </Text>
                <Input
                  {...register("UserName", { required: true })}
                  size={"sm"}
                  borderColor={errors?.UserName ? "red.500" : "gray.400"}
                  borderRadius={"0.25rem"}
                  placeholder={loading ? "Loading User Name..." : ""}
                />
                {errors.UserName && (
                  <Text color="red.500" fontSize="xs">
                    UserName is required.
                  </Text>
                )}
              </Box>
              <Box>
                <Text fontSize={"1rem"} ml="2" mb="0.5">
                  User Type
                </Text>
                <Input
                  {...register("UserType", { required: true })}
                  size={"sm"}
                  borderColor={errors?.UserType ? "red.500" : "gray.400"}
                  borderRadius={"0.25rem"}
                  placeholder={loading ? "Loading User Type..." : ""}
                  isDisabled={true}
                />
                {errors?.UserType && (
                  <Text color="red.500" fontSize="xs">
                    User Type is required.
                  </Text>
                )}
              </Box>

              <Box>
                <FormControl variant="floating" id="UserProfile">
                  <Text fontSize={"1rem"} ml="2" mb="0.5">
                    Select User Profile
                  </Text>
                  <ChakraSelect
                    {...register("UserProfile", {
                      required: "User Profile is Requeired",
                    })}
                    borderColor={errors?.UserProfile ? "red.500" : "gray.400"}
                    size="sm"
                    borderRadius={"0.25rem"}
                    placeholder={loading ? "Loading User Profile..." : ""}
                    onChange={(e) => {
                      const value = e.target.value;
                      setValue("UserProfile", value); // <- Manually update form state
                    }}
                  >
                    <option value="" disabled selected>
                      Select the User Profile
                    </option>
                    <option
                      value="Custom"
                      style={{
                        backgroundColor:
                          user?.UserProfile === "Custom" ? "#e2e8f0" : "",
                      }}
                    >
                      Custom
                    </option>
                    <option
                      value="Manager"
                      style={{
                        backgroundColor:
                          user?.UserProfile === "Manager" ? "#e2e8f0" : "",
                      }}
                    >
                      Manager
                    </option>
                    <option
                      value="User"
                      style={{
                        backgroundColor:
                          user?.UserProfile === "User" ? "#e2e8f0" : "",
                      }}
                    >
                      User
                    </option>
                  </ChakraSelect>
                  {errors.UserProfile && (
                    <Text color="red.500" fontSize="xs">
                      user Profile is required.
                    </Text>
                  )}
                </FormControl>
              </Box>

              {/* <Box>
                <Text fontSize={"1rem"} ml="2" mb="0.5">
                  Enter User Profile
                </Text>
                <Input
                  {...register("UserProfile", { required: true })}
                  size={"sm"}
                  borderColor={errors?.UserProfile ? "red.500" : "gray.400"}
                  borderRadius={"0.25rem"}
                  placeholder=""
                />
                {errors.UserProfile && (
                  <Text color="red.500" fontSize="xs">
                    user profile is required.
                  </Text>
                )}
              </Box> */}

              <Box>
                <Text fontSize={"1rem"} ml="2" mb="0.5">
                  Choose Image
                </Text>
                <Input
                  {...register("image")}
                  borderColor={errors?.image ? "red.500" : "gray.400"}
                  size="sm"
                  type="file"
                  accept="image/*"
                  borderRadius="0.25rem"
                  onChange={handleImageChange}
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

                {/* Upload Spinner */}
                {uploading && (
                  <Flex mt={2} align="center" gap={2}>
                    <Spinner size="sm" />
                    <Text fontSize="sm">uploading...</Text>
                  </Flex>
                )}
                {uploadedImageUrl && (
                  <Flex
                    mt={3}
                    alignItems={"center"}
                    gap={2}
                    opacity={uploading ? "0.5" : "1"}
                  >
                    <Image
                      src={uploadedImageUrl}
                      alt="Uploaded"
                      boxSize="60px"
                      objectFit="cover"
                      borderRadius="full"
                    />
                    <Tag fontSize="sm" color="green.500">
                      Uploaded successfully!
                    </Tag>
                  </Flex>
                )}
                {!isImageChanged && (
                  <Flex
                    mt={3}
                    alignItems={"center"}
                    gap={2}
                    opacity={uploading ? "0.5" : "1"}
                  >
                    <Image
                      src={user?.image}
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
                {errors.image && (
                  <Text color="red.500" fontSize="xs">
                    image is required.
                  </Text>
                )}
              </Box>

              {selesctedBranchName &&
                (selectedProfile === "Manager" ||
                  selectedProfile === "Custom") && (
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
            <SimpleGrid
              columns={{ sm: 1, md: 2, lg: 3 }}
              px={10}
              py={1}
              gap={6}
            >
              <GridItem colSpan={2}>
                <Box className="inputSection">
                  <Text className="inputLabel">Permissions</Text>
                  <HStack
                    spacing={2}
                    align="stretch"
                    className="mb-2 items-center w-full text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg sm:flex dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    wrap={"wrap"}
                  ></HStack>
                  <SimpleGrid columns={{ md: 2, lg: 3 }} spacing={4}>
                    {menuPermissions?.map((data: any, index: number) => {
                      const isAllowed =
                        selectedProfile === "Custom" ||
                        profileMenuMap[selectedProfile]?.includes(data);
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
                            size="sm"
                            w="130px"
                            icon={
                              currentAccess === "Viewer" ? (
                                <FaEye />
                              ) : (
                                <FaEdit />
                              )
                            }
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
                            <option value="Viewer">Viewer</option>
                            <option value="Editor">Editor</option>
                          </ChakraSelect>
                        </Box>
                      );
                    })}
                  </SimpleGrid>
                </Box>
              </GridItem>
              <Box
                display={"flex"}
                justifyContent={"flex-end"}
                alignItems={"center"}
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
                  type="submit"
                  size={"sm"}
                  isLoading={loading}
                  loadingText={"Updating..."}
                  mt={6}
                  _hover={{ bg: "#E67E00" }}
                  w="8.188rem"
                  bg="#FF9000"
                  borderRadius={"0.25rem"}
                  color="whiteAlpha.900"
                  fontWeight={"700"}
                  fontSize={"1rem"}
                >
                  Update User
                </Button>
              </Box>
            </SimpleGrid>
          </form>
        ) : (
          <UpdatePassword />
        )}
      </>
      {/* inputs end */}
      <DevTool control={control} />
    </Stack>
  );
};

export default UpdateUser;
