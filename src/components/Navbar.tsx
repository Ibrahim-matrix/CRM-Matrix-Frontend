// Navbar Component: Displays a navigation bar with various options such as menu toggle, notifications, user profile, and logout.
// Props:
// - isCollapsed: Indicates whether the menu is collapsed or expanded.
// - handleToggleCollapse: Function to handle the toggle of the menu collapse.

import {
  Avatar,
  Box,
  Button,
  Flex,
  Icon,
  Popover,
  PopoverArrow,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
  Spacer,
  Text,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import React from "react";
import { AiOutlineMenuFold, AiOutlineMenuUnfold } from "react-icons/ai";
import profile from "../icons/user.jpg";
import bell from "../icons/bell.jpeg";

import Menus from "../utils/Menus";
import { FaSignOutAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { postData } from "../redux/actions/common.action";
import { QuestionIcon, SettingsIcon } from "@chakra-ui/icons";
import Cookies from "js-cookie";
import { Link } from "react-router-dom";

// Interface for the details of the signed-in user
interface SigninUserDetails {
  signinuser: {
    Name: string;
    Email: string;
    menuPermissions: [string];
    UserType: number;
    image: string;
  };
}

// Interface for the Navbar Props
interface NavbarProps {
  isCollapsed: boolean;
  handleToggleCollapse: () => void;
}

const Navbar: React.FC<NavbarProps> = ({
  isCollapsed,
  handleToggleCollapse,
}) => {
  // const [timer, setTimer] = useState<NodeJS.Timeout | null>(null);
  const dispatch: any = useDispatch(); // Redux hook for dispatching actions
  const toast = useToast(); // Chakra UI hook for displaying toast messages
  const endpoint: string = "auth/signout"; // API endpoint for signing out
  const navigate = useNavigate(); // React Router hook for navigation

  // Retrieve the details of the signed-in user from the Redux store
  const { signinuser } = useSelector(
    (state: { common: SigninUserDetails }) => state.common
  );

  const { isOpen, onOpen, onClose } = useDisclosure();

  // const [logoutTimer, setLogoutTimer] = useState<NodeJS.Timeout | null>(null);

  // Function to handle the logout
  const handleLogout = () => {
    dispatch(postData({ type: "web" }, endpoint, navigate, toast));
    Cookies.remove("token");
    navigate("/login");
  };

  // const resetTimer = () => {
  //   if (logoutTimer) {
  //     clearTimeout(logoutTimer);
  //   }

  //   const timer = setTimeout(() => {
  //     handleLogout();
  //   }, 6000); // 10 minutes in milliseconds

  //   setLogoutTimer(timer);
  // };

  // useEffect(() => {
  //   const onActivity = () => {
  //     resetTimer();
  //   };

  //   window.addEventListener("mousedown", onActivity);
  //   window.addEventListener("keydown", onActivity);

  //   resetTimer();

  //   return () => {
  //     if (logoutTimer) {
  //       clearTimeout(logoutTimer);
  //     }

  //     window.removeEventListener("mousedown", onActivity);
  //     window.removeEventListener("keydown", onActivity);
  //   };
  // }, []);

  return (
    <>
      <Box
        pos="sticky"
        top="0"
        zIndex="sticky"
        bg="white"
        boxShadow="sm"
        width={"full"}
      >
        <Flex align="center" p={4}>
          {isCollapsed ? (
            <AiOutlineMenuUnfold
              cursor="pointer"
              size={"1.5rem"}
              onClick={handleToggleCollapse}
            />
          ) : (
            <AiOutlineMenuFold
              cursor={"pointer"}
              size={"1.5rem"}
              onClick={handleToggleCollapse}
            />
          )}

          <Menus />

          <Spacer />
          {signinuser?.UserType !== 1 &&
            signinuser?.menuPermissions?.includes("Lead List") && (
              <Button
                onClick={() => navigate("/add-lead")}
                size="sm"
                _hover={{ bg: "#FF9000" }}
                bg="#2AA90A"
                borderRadius={"full"}
                color="whiteAlpha.900"
              >
                Add Lead
              </Button>
            )}

          <Box
            ml={5}
            display={"flex"}
            justifyContent={"space-between"}
            alignItems={"center"}
            gap="5"
          >
            <Popover>
              <PopoverTrigger>
                <Avatar
                  cursor={"pointer"}
                  size="xs"
                  name="Kola Tioluwani"
                  src={bell}
                />
              </PopoverTrigger>
              <PopoverContent
                w="220px"
                maxW="400px"
                mx={6}
                outline={"none"}
                rounded={4}
              >
                <PopoverArrow />
                <PopoverHeader>No Notification</PopoverHeader>
              </PopoverContent>
            </Popover>

            <Popover isOpen={isOpen} onOpen={onOpen} onClose={onClose}>
              <PopoverTrigger>
                <Avatar
                  cursor={"pointer"}
                  size="sm"
                  name="Kola Tioluwani"
                  src={signinuser?.image}
                />
              </PopoverTrigger>
              <PopoverContent
                w="fit-content"
                maxW="400px"
                mx={6}
                outline={"none"}
                rounded={4}
              >
                <PopoverArrow />
                {/* <PopoverCloseButton m={2} /> */}
                <PopoverHeader>
                  <Link to={"/profile"} onClick={onClose}>
                    <Box outline={"none"} p={2} cursor={"pointer"}>
                      <Flex justifyContent="start" alignItems={"center"}>
                        <Avatar src={signinuser?.image} size="sm" mr="2" />

                        <Box>
                          <Text fontWeight={500} fontSize={"0.9rem"}>
                            {signinuser?.Name}
                          </Text>
                          <Text fontWeight={400} fontSize={"0.8rem"}>
                            {signinuser?.Email}
                          </Text>
                        </Box>
                      </Flex>
                    </Box>
                  </Link>
                </PopoverHeader>
                <Flex
                  onClick={onClose}
                  _hover={{
                    bg: "gray.50",
                    cursor: "pointer",
                  }}
                  px="2"
                  py="1"
                  justifyContent={"start"}
                  textAlign={"center"}
                  alignItems={"center"}
                  m="1"
                >
                  <SettingsIcon />

                  <Link to={"/profile"}>
                    <Text ml={2} fontSize={"0.8rem"}>
                      Profile
                    </Text>
                  </Link>
                </Flex>

                <Flex
                  onClick={onClose}
                  _hover={{
                    bg: "gray.50",
                    cursor: "pointer",
                  }}
                  px="2"
                  py="1"
                  justifyContent={"start"}
                  textAlign={"center"}
                  alignItems={"center"}
                  m="1"
                >
                  <QuestionIcon />
                  <Link
                    to={`${
                      signinuser?.UserType === 1 ? "/super-support" : "/support"
                    }`}
                  >
                    <Text ml={2} fontSize={"0.8rem"}>
                      Help & Support
                    </Text>
                  </Link>
                </Flex>

                <Flex
                  onClick={handleLogout}
                  _hover={{
                    bg: "gray.50",
                    cursor: "pointer",
                  }}
                  px="2"
                  py="1"
                  justifyContent={"start"}
                  textAlign={"center"}
                  alignItems={"center"}
                  m="1"
                >
                  <FaSignOutAlt />

                  <Text ml={2} fontSize={"0.8rem"}>
                    Logged Out
                  </Text>
                </Flex>
                {/* <PopoverFooter>
                  <Box
                    onClick={handleLogout}
                    _hover={{
                      bg: "gray.200",
                      cursor: "pointer",
                    }}
                    px="4"
                    display={"flex"}
                    justifyContent={"start"}
                    textAlign={"start"}
                    alignItems={"center"}
                  >
                    <FaSignOutAlt />
                    <Text
                      color={"rgba(0, 0, 0, 0.7)"}
                      mr="6"
                      ml="3"
                      textAlign={"start"}
                    >
                      Sign Out
                    </Text>
                  </Box>
                </PopoverFooter> */}
              </PopoverContent>
            </Popover>
          </Box>
        </Flex>
      </Box>
    </>
  );
};

export default Navbar;
