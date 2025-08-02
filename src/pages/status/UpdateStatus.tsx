/*
  UpdateStatus Component:
  This component allows updating a status by providing a form with a select input for the status name.
  It utilizes Chakra UI components for styling and form handling using react-hook-form.

  It does the following:
  - Imports necessary dependencies and components
  - Defines the interfaces for UpdateStatus and FormData
  - Retrieves the status and statuses data from Redux using the useSelector hook
  - Initializes the dispatch function from Redux using the useDispatch hook
  - Retrieves the "id" parameter from the URL using the useParams hook
  - Initializes the navigate function from react-router-dom for navigation purposes
  - Initializes the useToast hook for displaying toast messages
  - Defines the endpoint for API calls
  - Initializes the react-hook-form for form handling and sets default form values based on the status data
  - Fetches status data and the specific status by ID when the component mounts
  - Resets the form values when the status data changes
  - Handles form submission by dispatching the updateData action and fetching updated status data
  - Renders the form with a select input for status name and displays form validation errors if any
*/

import {
  Box,
  Button,
  GridItem,
  HStack,
  Image,
  Input,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Select,
  SimpleGrid,
  Stack,
  Text,
  useToast,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import {
  getData,
  getDataById,
  updateData,
} from "../../redux/actions/common.action";
import { useNavigate, useParams } from "react-router-dom";
import { DevTool } from "@hookform/devtools";
import { ChevronDownIcon } from "@chakra-ui/icons";
import iconBadge from "../../icons/icons8-badge.png"
import iconCancelOne from "../../icons/icons8-cancel-1.png"
import iconCancel from "../../icons/icons8-cancel.png"
import iconCheck from "../../icons/icons8-check.png"
import iconChili from "../../icons/icons8-chili-pepper.png"
import iconClosed from "../../icons/icons8-closed.png"
import iconDoor from "../../icons/icons8-door.png"
import iconFinish from "../../icons/icons8-finish.png"
import iconHot from "../../icons/icons8-hot.png"
import iconLast from "../../icons/icons8-last.png"
import iconLock from "../../icons/icons8-lock.png"
import iconMedal from "../../icons/icons8-medal.png"
import iconOpen from "../../icons/icons8-open.png"
import iconPlay from "../../icons/icons8-play.png"
import iconPurchasedOne from "../../icons/icons8-purchase-1.png"
import iconPurchased from "../../icons/icons8-purchase.png"
import iconStartOne from "../../icons/icons8-start-1.png"
import iconStart from "../../icons/icons8-start.png"
import icontrophy from "../../icons/icons8-trophy.png"
import iconUnlock from "../../icons/icons8-unlock.png"


//interface for the updatedata
interface UpdateStatus {
  status: {
    StatusName: string;
    StatusIcon: string;
    StatusColor: string;
  };
  statuses: {
    StatusName: string;
    _id: string;
  }[];
  loading: boolean;
}

//interface for filled pre formdata
interface FormData {
  StatusName: string;
}

const UpdateStatus: React.FC = () => {
  // Obtaining the dispatch function using the useDispatch hook
  const dispatch: any = useDispatch();

  // Accessing the id parameter from the URL using the useParams hook
  const { id } = useParams();

  // Accessing the useNavigate hook and assigning it to the navigate variable
  const navigate = useNavigate();

  // Accessing the useToast hook and assigning it to the toast variable
  const toast = useToast();

  // Setting the endpoint to "status"
  const endpoint: string = "status";

  // Accessing the status and statuses variables from the common reducer using the useSelector hook
  const { status, statuses, loading } = useSelector(
    (state: { common: UpdateStatus }) => state.common
  );

  const [selectedIcon, setSelectedIcon] = useState('')
  console.log(selectedIcon)
  const [selectedColor, setSelectedColor] = useState('')

  // Setting up form validation and state management using the useForm hook
  const {
    handleSubmit,
    register,
    formState: { errors },
    reset,
    control,
  } = useForm<FormData>({
    defaultValues: {
      StatusName: status?.StatusName || "", // Setting the default value for the StatusName field based on the status data
    },
  });

  // Fetching the data for the specified status and all statuses
  useEffect(() => {
    dispatch(getDataById(id, endpoint)); // Fetching the specific status data by ID
    dispatch(getData(endpoint)); // Fetching all statuses
  }, [id, dispatch]);

  // Resetting the form fields when the status data changes
  useEffect(() => {
    if (status) {
      reset({
        StatusName: status?.StatusName, // Resetting the StatusName field with the updated value
      });
      setSelectedIcon(status?.StatusIcon)
      setSelectedColor(status?.StatusColor)
    }
  }, [status, reset]);

  // Handling form submission
  const onSubmit = (data: FormData) => {

    const payload = {
      ...data,
      StatusIcon: selectedIcon,
      StatusColor: selectedColor,
    }
    dispatch(
      updateData(id, endpoint, payload, navigate, toast)
    ).then(() => {
      dispatch(getData("status")); // Fetching the updated status data after successful submission
    });
  };

  const iconsArray = [
    { name: "Badge", value: iconBadge, local: "iconBadge" },
    { name: "Cancel", value: iconCancel, local: "iconCancel" },
    { name: "CancelOne", value: iconCancelOne, local: "iconCancelOne" },
    { name: "Check", value: iconCheck, local: "iconCheck" },
    { name: "Chili", value: iconChili, local: "iconChili" },
    { name: "Closed", value: iconClosed, local: "iconClosed" },
    { name: "Door", value: iconDoor, local: "iconDoor" },
    { name: "Finish", value: iconFinish, local: "iconFinish" },
    { name: "Hot", value: iconHot, local: "iconHot" },
    { name: "Last", value: iconLast, local: "iconLast" },
    { name: "Lock", value: iconLock, local: "iconLock" },
    { name: "Medal", value: iconMedal, local: "iconMedal" },
    { name: "Open", value: iconOpen, local: "iconOpen" },
    { name: "Play", value: iconPlay, local: "iconPlay" },
    { name: "Purchased", value: iconPurchased, local: "iconPurchased" },
    { name: "PurchasedOne", value: iconPurchasedOne, local: "iconPurchasedOne" },
    { name: "Start", value: iconStart, local: "iconStart" },
    { name: "StartOne", value: iconStartOne, local: "iconStartOne" },
    { name: "Unlock", value: iconUnlock, local: "iconUnlock" },
    { name: "trophy", value: icontrophy, local: "icontrophy" },
  ];


  const lightColorsArray: any = [
    { name: "light red", value: "#FFCCCC" },
    { name: "light orange", value: "#FFE0B2" },
    { name: "light yellow", value: "#FFFFCC" },
    { name: "light green", value: "#CCFFCC" },
    { name: "light cyan", value: "#CCFFFF" },
    { name: "light blue", value: "#CCCCFF" },
    { name: "light purple", value: "#E0CCFF" },
    { name: "khaki", value: "#F0E68C" },
    { name: "light goldenrod yellow", value: "#FAFAD2" },
    { name: "light mint", value: "#D3FFCE" },
    { name: "peach puff", value: "#FFDAB9" },
    { name: "lavender", value: "#E6E6FA" },
    { name: "lavender blush", value: "#FFF0F5" },
    { name: "mint cream", value: "#F5FFFA" },
    { name: "lemon chiffon", value: "#FFFACD" },
    { name: "honeydew", value: "#F0FFF0" },
    { name: "beige", value: "#F5F5DC" },
    { name: "ghost white", value: "#F8F8FF" },
    { name: "old lace", value: "#FDF5E6" },
    { name: "ivory", value: "#FFFFF0" },
    { name: "azure", value: "#F0FFFF" },
    { name: "misty rose", value: "#FFE4E1" },
    { name: "alice blue", value: "#F0F8FF" },
    { name: "seashell", value: "#FFF5EE" },
    { name: "wheat", value: "#F5DEB3" },
    { name: "light cyan 2", value: "#E0FFFF" }
  ];

  return (
    <Stack h="100%">
      {/* heading starts */}

      {/* heading end */}
      {/* inputs starts */}
      <form onSubmit={handleSubmit(onSubmit)}>
        <SimpleGrid columns={{ md: 1, lg: 3 }} px={10} py={1} gap={6}>
          <Box>
            <Text fontSize={"1rem"} ml="2" mb="0.5">
              Status Name
            </Text>
            <Input
              {...register("StatusName", { required: true })}
              size={"sm"}
              borderColor={errors.StatusName ? "red.500" : "gray.400"}
              borderRadius={"0.25rem"}
              height={"40px"}
            />
            {errors.StatusName && (
              <Text color="red.500" fontSize="xs">
                Status name is required
              </Text>
            )}
          </Box>
          <GridItem width={"full"}>
            <Text fontSize={"1rem"} ml="2" mb="0.5">
              Status Icon
            </Text>
            <Menu matchWidth>
              <MenuButton w={"full"} as={Button} rightIcon={<ChevronDownIcon />} variant="outline" borderRadius="md">
                <HStack gap={2}>
                  {selectedIcon && <Image src={iconsArray?.find((i: any) => i?.local === selectedIcon)?.value} alt="icon" boxSize="30px" borderRadius="full" />}
                  <Text>{selectedIcon ? iconsArray?.find((i: any) => i?.local === selectedIcon)?.name : "Select Icon"}</Text>
                </HStack>
              </MenuButton>
              <MenuList
                borderRadius="md"
                boxShadow="md"
                maxH="300px"
                overflowY="auto"
              >
                <Box px="3" py="2" fontWeight="bold" color="gray.600" fontSize="sm">
                  Select Icon
                </Box>
                {iconsArray?.map((icon) => {
                  return (
                    <MenuItem
                      key={icon?.name}
                      onClick={() => setSelectedIcon(icon?.local)}
                      _hover={{ bg: "gray.100" }}
                      bg={icon?.local === status?.StatusIcon ? "gray.200" : ''}
                    >
                      <HStack spacing="3">
                        <Image src={icon?.value} alt="icon" boxSize="30px" borderRadius="full" />
                        <Text>{icon?.name}</Text>
                      </HStack>
                    </MenuItem>
                  );
                })}
              </MenuList>
            </Menu>
          </GridItem >

          <Box w="full" >
            <Text fontSize={"1rem"} ml="2" mb="0.5">
              Status Color
            </Text>
            <Menu matchWidth>
              <MenuButton as={Button} rightIcon={<ChevronDownIcon />} w="full" bg={
                selectedColor || "gray.100"
              }>
                {selectedColor ? lightColorsArray.find((c: any) => c.value === selectedColor)?.name : "Select Color"}
              </MenuButton>
              <MenuList maxH="300px" overflowY="auto">
                <Box px="3" py="2" fontWeight="bold" color="gray.600" fontSize="sm">
                  Select Icon
                </Box>
                {lightColorsArray.map((color: any) => (
                  <MenuItem
                    key={color.name}
                    onClick={() => setSelectedColor(color?.value)}
                    _hover={{ bg: "gray.100" }}
                    bg={color?.value === status?.StatusColor ? "gray.200" : ''}
                  >
                    <HStack>
                      <Box
                        boxSize="20px"
                        bg={color.value}
                        border="1px solid #ccc"
                        borderRadius="full"
                      />
                      <Text>{color.name}</Text>
                    </HStack>
                  </MenuItem>
                ))}
              </MenuList>
            </Menu>
          </Box>
          <Box></Box>
          <Box></Box>

          <Box
            mt={6}
            display={"flex"}
            justifyContent={"flex-end"}
            alignItems={"center"}
          >
            <Button
              onClick={() => navigate("/status-list")}
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
              _hover={{ bg: "#E67E00" }}
              w="8.188rem"
              bg="#FF9000"
              borderRadius={"0.25rem"}
              color="whiteAlpha.900"
              fontWeight={"700"}
              fontSize={"1rem"}
            >
              Update Status
            </Button>
          </Box>
        </SimpleGrid>
      </form>
      {/* inputs end */}

      <DevTool control={control} />
    </Stack>
  );
};

export default UpdateStatus;
