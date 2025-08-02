/*
  AddStatus Component:
  This component represents a form for adding a new status. It allows the user to enter a status name in an input field
  and submit the form to add the status. It utilizes Chakra UI components for the form layout and styling.
  The component dispatches actions for adding and retrieving status data.

  It does the following:
  - Imports necessary dependencies and components
  - Defines the interfaces for statuses and loading state
  - Retrieves the loading state from Redux using the useSelector hook
  - Initializes the react-hook-form for form handling, including form submission and input validation
  - Retrieves the dispatch function from Redux using the useDispatch hook
  - Defines the endpoint for API calls
  - Initializes the navigate function from react-router-dom for navigation purposes
  - Initializes the useToast hook for displaying toast messages
  - Handles form submission by dispatching the postData action and retrieving status data
  - Renders the add status form using Chakra UI components, including the input field and submit button
  - Includes the DevTool component from @hookform/devtools for form debugging (optional)
*/
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  GridItem,
  HStack,
  Image,
  Input,
  InputGroup,
  InputRightElement,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  SimpleGrid,
  Stack,
  Text,
  useToast,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getData, postData } from "../../redux/actions/common.action";
import { useForm } from "react-hook-form";
import { DevTool } from "@hookform/devtools";
import * as Icons from "@chakra-ui/icons";
import { Search2Icon } from "@chakra-ui/icons";
import { FiUsers } from "react-icons/fi";
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


//interface for the statusinput
interface Status {
  StatusName: string;
  IconName?: string;
}

// const iconList = Object.keys(Icons).filter((key) => key.endsWith("Icon"));
const iconList = Object.entries(Icons).map(([name, Component]) => ({
  name,
  Component,
}));



const AddStatus = () => {
  // Setting the endpoint to "status"
  const endpoint: string = "status";

  // Accessing necessary hooks, variables, and parameters
  const dispatch: any = useDispatch();
  const navigate = useNavigate();
  const toast = useToast();
  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { errors },
  } = useForm<Status>();

  const [query, setQuery] = useState("");
  const [searchIcon, setSearchIcon] = useState("");
  // const selectedIcon = watch("IconName");

  const [selectedIcon, setSelectedIcon] = useState('')
  const [selectedColor, setSelectedColor] = useState('')

  // const iconsArray = [iconBadge, iconCancel, iconCancelOne, iconCheck, iconChili, iconClosed, iconDoor, iconFinish, iconHot, iconLast, iconLock, iconMedal, iconOpen, iconPlay, iconPurchased, iconPurchasedOne, iconStart, iconStartOne, iconUnlock, icontrophy]

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

  // Function to handle form submission
  const onSubmit = (data: Status) => {

    const payload = {
      ...data,
      StatusIcon: selectedIcon,
      StatusColor: selectedColor,
    }

    console.log(payload)
    // Dispatching the postData action to save the form data
    dispatch(postData(payload, endpoint, navigate, toast)).then(() => {
      // Dispatching the getData action to fetch updated status data
      dispatch(getData("status"));
    });
  };


  const filteredIcons = iconList.filter((icon) =>
    icon.name.toLowerCase().includes(query.toLowerCase())
  );


  return (
    <Stack h="100%">
      {/* inputs starts */}
      <form onSubmit={handleSubmit(onSubmit)}>
        <SimpleGrid columns={{ md: 1, lg: 3 }} px={10} py={5} gap={6} mt={3}>
          <Box>
            <FormControl variant="floating" id="StatusName">
              <Input
                {...register("StatusName", { required: true })}
                borderColor={errors?.StatusName ? "red.500" : "gray.400"}
                borderRadius={"0.25rem"}
                size="sm"
                placeholder=" "
                height={"40px"}
              />
              <FormLabel fontWeight={"400"} color={"gray.600"}>
                Status
              </FormLabel>
              {errors.StatusName && (
                <Text color="red.500" fontSize="sm">
                  This field is required
                </Text>
              )}
            </FormControl>
          </Box>
          {/* Icon Picker */}
          {/* <Box>
            <FormControl variant="floating" id="IconName">
              <InputGroup size="sm">
                <Input
                  placeholder="Search Icons"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  borderColor="gray.400"
                  borderRadius="0.25rem"
                />
                <InputRightElement pointerEvents="none">
                  <Search2Icon color="gray.500" />
                </InputRightElement>
              </InputGroup>
              <FormLabel fontWeight="400" color="gray.600">
                Search Icon
              </FormLabel>

            </FormControl>
            <Box>
              <SimpleGrid columns={[2, 3, 5]} spacing={6}>
                {filteredIcons?.slice(0, filteredIcons?.length - 1)?.map(({ name, Component }: { name: any, Component: any }) => (
                  <div key={name}>
                    <Component boxSize={6} />
                  </div>

                ))}
              </SimpleGrid>

            </Box>
          </Box> */}

          <GridItem width={"full"}>
            <Menu matchWidth>
              <MenuButton w={"full"} as={Button} rightIcon={<Icons.ChevronDownIcon />} variant="outline" borderRadius="md">
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
            <Menu matchWidth>
              <MenuButton as={Button} rightIcon={<Icons.ChevronDownIcon />} w="full" bg={
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

          <Box display={'flex'} justifyContent={'flex-end'}>
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
              Add Status
            </Button>
            {errors.StatusName && (
              <Text color="whiteAlpha.500" fontSize="sm">
                This field is required
              </Text>
            )}
          </Box>
        </SimpleGrid>
      </form>
      {/* inputs end */}
      <DevTool control={control} />
    </Stack>
  );
};

export default AddStatus;
