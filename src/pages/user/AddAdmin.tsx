import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  SimpleGrid,
  Stack,
  Text,
  Checkbox,
  HStack,
  Grid,
  GridItem,
  useToast,
  Flex,
  Spinner,
  Image,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  getDataSuperAdmin,
  postData,
  postDataSuperAdmin,
} from "../../redux/actions/common.action";
// import makeAnimated from "react-select/animated";
import { useForm } from "react-hook-form";
import { DevTool } from "@hookform/devtools";
import Cookies from "js-cookie";
import { BASE_URL, BASE_URL_SUPERADMIN } from "../../config/RequestMethod";
import axios from "axios";
import ImageUpload from "../../helpers/ImageUpload";

interface AddAdmins {
  Name: string;
  Email: string;
  Phone: number;
  UserName: string;
  State: string;
  Pincode: string;
  Address: string;
  teamSize: number;
  UserType: number;
  companyName: string;
  webURL: string;
  validupTo: number;
  numberOfUsers: number;
  menuPermissions: string[];
  CompanyImageOne: string;
  CompanyImageTwo: string;

  // image: any;
  selectedUsers: string[];
}

const AddAdmin: React.FC = () => {
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
  const [selectedIntegration, setSelectedIntegration] = useState<string[]>([]);
  const [ComapanyImageOne, setCompanyImageOne] = useState<string>("");
  const [ComapanyImageTwo, setCompanyImageTwo] = useState<string>("");
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [uploading, setUploading] = useState<boolean>(false);

  // const [selectedUsers, setSelectedUsers] = useState<string[]>([]);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<AddAdmins>();

  const endpoint: string = "auth/signup";
  const dispatch: any = useDispatch();
  const navigate = useNavigate();
  const toast = useToast();

  const handleCheckboxChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    value: string
  ) => {
    if (e.target.checked) {
      setSelectedPermissions((prevPermissions) => [...prevPermissions, value]);
    } else {
      setSelectedPermissions((prevPermissions) =>
        prevPermissions.filter((permission) => permission !== value)
      );
    }
  };

  const handleCheckboxChange2 = (
    e: React.ChangeEvent<HTMLInputElement>,
    value: string
  ) => {
    if (e.target.checked) {
      setSelectedIntegration((prevPermissions) => [...prevPermissions, value]);
    } else {
      setSelectedIntegration((prevPermissions) =>
        prevPermissions.filter((permission) => permission !== value)
      );
    }
  };

  const handleImageUpload = (imageUrl: any) => {
    setCompanyImageOne(imageUrl);
  };

  console.log(ComapanyImageOne);

  const handleImageUpload2 = (imageUrl: any) => {
    setCompanyImageTwo(imageUrl);
  };

  const onSubmit = (formData: AddAdmins) => {
    const requestData = {
      ...formData,
      UserType: 2,
      ComapanyImageOne,
      ComapanyImageTwo,
      menuPermissions: selectedPermissions,
      integrationPermissions: selectedIntegration,
      Password: "admin@123",
    };

    dispatch(postData(requestData, endpoint, navigate, toast)).then(() => {
      dispatch(getDataSuperAdmin(""));
      navigate("/admin-list");
      console.log("ok");
    });
  };

  const [menuItems, setMenuItems] = useState<string[]>([]);

  const getMenuItems = () => {
    return axios.get(`${BASE_URL_SUPERADMIN}/sideMenu`, {
      headers: {
        Authorization: `Bearer ${token}`, // Pass the token in the headers
      },
    });
  };
  const token = Cookies.get("token");

  useEffect(() => {
    // Fetch menu items when the component mounts
    getMenuItems()
      .then((response) => {
        setMenuItems(response.data?.Data?.menu);
      })
      .catch((error) => {
        console.error("Error fetching menu items:", error);
      });
  }, []);

  return (
    <Stack h="100%">
      {/* inputs starts */}
      <form onSubmit={handleSubmit(onSubmit)}>
        <SimpleGrid
          columns={[1, 1, 2, 3]} // Set the number of columns for different screen sizes
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
            <FormControl variant="floating" id="companyName">
              <Input
                autoComplete="off"
                {...register("companyName", {
                  required: "companyName is required",
                })}
                borderColor={errors?.companyName ? "red.500" : "gray.400"}
                borderRadius={"0.25rem"}
                size="sm"
                placeholder=" "
              />
              <FormLabel fontWeight={"400"} color={"gray.600"}>
                Enter Company Name
              </FormLabel>
              {errors.companyName && (
                <Text color="red.500" fontSize="xs">
                  companyName is required
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
                Company Email ID
              </FormLabel>
              {errors.Email && (
                <Text color="red.500" fontSize="xs">
                  email ID is required
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
                Company Phone No.
              </FormLabel>
              {errors.Phone && (
                <Text color="red.500" fontSize="xs">
                  mobile no is required
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
            <FormControl variant="floating" id="Address">
              <Input
                autoComplete="off"
                {...register("Address", {
                  required: "Address is required",
                })}
                borderColor={errors?.Address ? "red.500" : "gray.400"}
                borderRadius={"0.25rem"}
                size="sm"
                placeholder=" "
              />
              <FormLabel fontWeight={"400"} color={"gray.600"}>
                Company Address
              </FormLabel>
              {errors.Address && (
                <Text color="red.500" fontSize="xs">
                  Address is required
                </Text>
              )}
            </FormControl>
          </Box>
          <Box>
            <FormControl variant="floating" id="State">
              <Input
                autoComplete="off"
                {...register("State", {
                  required: "State is required",
                })}
                borderColor={errors?.State ? "red.500" : "gray.400"}
                borderRadius={"0.25rem"}
                size="sm"
                placeholder=" "
              />
              <FormLabel fontWeight={"400"} color={"gray.600"}>
                Enter State
              </FormLabel>
              {errors.State && (
                <Text color="red.500" fontSize="xs">
                  State is required
                </Text>
              )}
            </FormControl>
          </Box>
          <Box>
            <FormControl variant="floating" id="Pincode">
              <Input
                autoComplete="off"
                {...register("Pincode", {
                  required: "Pincode is required",
                })}
                borderColor={errors?.Pincode ? "red.500" : "gray.400"}
                borderRadius={"0.25rem"}
                size="sm"
                placeholder=" "
              />
              <FormLabel fontWeight={"400"} color={"gray.600"}>
                Enter Pincode
              </FormLabel>
              {errors.Pincode && (
                <Text color="red.500" fontSize="xs">
                  Pincode is required
                </Text>
              )}
            </FormControl>
          </Box>
          <Box>
            <FormControl variant="floating" id="webURL">
              <Input
                autoComplete="off"
                {...register("webURL", {
                  required: "webURL is required",
                })}
                borderColor={errors?.webURL ? "red.500" : "gray.400"}
                borderRadius={"0.25rem"}
                size="sm"
                placeholder=" "
              />
              <FormLabel fontWeight={"400"} color={"gray.600"}>
                Company webURL
              </FormLabel>
              {errors.webURL && (
                <Text color="red.500" fontSize="xs">
                  webURL is required
                </Text>
              )}
            </FormControl>
          </Box>
          <Box>
            <FormControl variant="floating" id="teamSize">
              <Input
                autoComplete="off"
                {...register("teamSize", {
                  required: "teamSize is required",
                })}
                borderColor={errors?.teamSize ? "red.500" : "gray.400"}
                borderRadius={"0.25rem"}
                size="sm"
                placeholder=" "
                type="number"
              />
              <FormLabel fontWeight={"400"} color={"gray.600"}>
                Enter Team Size
              </FormLabel>
              {errors.teamSize && (
                <Text color="red.500" fontSize="xs">
                  team size is required
                </Text>
              )}
            </FormControl>
          </Box>

          <Box>
            <FormControl variant="floating" id="validupTo">
              <Input
                autoComplete="off"
                {...register("validupTo", {
                  required: "validupTo is required",
                })}
                borderColor={errors?.validupTo ? "red.500" : "gray.400"}
                borderRadius={"0.25rem"}
                size="sm"
                type="date"
              />
              <FormLabel fontWeight={"400"} color={"gray.600"}>
                Valid Up to
              </FormLabel>
              {errors.validupTo && (
                <Text color="red.500" fontSize="xs">
                  validupTo is required
                </Text>
              )}
            </FormControl>
          </Box>
          <Box>
            <FormControl variant="floating" id="numberOfUsers">
              <Input
                autoComplete="off"
                {...register("numberOfUsers", {
                  required: "numberOfUsers is required",
                })}
                borderColor={errors?.numberOfUsers ? "red.500" : "gray.400"}
                borderRadius={"0.25rem"}
                size="sm"
                placeholder=" "
                type="number"
              />
              <FormLabel fontWeight={"400"} color={"gray.600"}>
                Number of user can create
              </FormLabel>
              {errors.numberOfUsers && (
                <Text color="red.500" fontSize="xs">
                  number of user create is required
                </Text>
              )}
            </FormControl>
          </Box>
        </SimpleGrid>
        <Grid
          templateColumns="repeat(3, 1fr)"
          gap={4}
          autoFlow="row" // Set the flow of the grid items to row
          px={[2, 5]} // Set the horizontal padding for different screen sizes
          minWidth="250px"
        >
          <GridItem colSpan={1}>
            <Box>
              <Text fontSize={"0.9rem"} ml="2" mb="0.5">
                Company Image One
              </Text>

              <ImageUpload onImageUpload={handleImageUpload} />
            </Box>
          </GridItem>
          <GridItem colSpan={1}>
            <Box>
              <Text fontSize={"0.9rem"} ml="2" mb="0.5">
                Company Image Two
              </Text>
              <ImageUpload onImageUpload={handleImageUpload2} />
            </Box>
          </GridItem>
          <GridItem colSpan={1}>
            <Box className="inputSection">
              <Text className="inputLabel">Integration Permission</Text>
              <HStack
                spacing={2}
                align="stretch"
                className="mb-2 items-center w-full text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg sm:flex dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                wrap={"wrap"}
              >
                {IntegrationPermission?.map((data, index) => (
                  <Box
                    key={index}
                    className="w-full border-b border-gray-200 sm:border-b-0 sm:border-r dark:border-gray-600"
                    display="flex"
                    alignItems="center"
                    pl={3}
                  >
                    <Checkbox
                      id="vue-checkbox-list"
                      value={data}
                      size="sm"
                      colorScheme="blue"
                      bg="gray.100"
                      border="gray.300"
                      borderRadius="md"
                      checked={selectedIntegration.includes(data)} // Add this line
                      onChange={(e) => handleCheckboxChange2(e, data)} // Add this line
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
          </GridItem>
          <GridItem colSpan={3}>
            <Box className="inputSection">
              <Text className="inputLabel">Menu Permissions</Text>
              <HStack
                spacing={2}
                align="stretch"
                className="mb-2 items-center w-full text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg sm:flex dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                wrap={"wrap"}
              >
                {menuItems?.map((data, index) => (
                  <Box
                    key={index}
                    className="w-full border-b border-gray-200 sm:border-b-0 sm:border-r dark:border-gray-600"
                    display="flex"
                    alignItems="center"
                    pl={3}
                  >
                    <Checkbox
                      id="vue-checkbox-list"
                      value={data}
                      size="sm"
                      colorScheme="blue"
                      bg="gray.100"
                      border="gray.300"
                      borderRadius="md"
                      checked={selectedPermissions.includes(data)} // Add this line
                      onChange={(e) => handleCheckboxChange(e, data)} // Add this line
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
          </GridItem>
        </Grid>
        <Box
          display={"flex"}
          justifyContent={"flex-end"}
          alignItems={"center"}
          mx={4}
        >
          <Button
            type="submit"
            mt={6}
            size={"sm"}
            _hover={{ bg: "#FF9000" }}
            w="8.188rem"
            bg="#FF9000"
            borderRadius={"0.25rem"}
            color="whiteAlpha.900"
            fontWeight={"700"}
            fontSize={"1rem"}
          >
            Submit
          </Button>
        </Box>
      </form>
      {/* inputs end */}
      <DevTool control={control} />
    </Stack>
  );
};

export default AddAdmin;

const IntegrationPermission = [
  "Indiamart",
  "Facebook",
  "Instagram",
  "Justdail",
];
