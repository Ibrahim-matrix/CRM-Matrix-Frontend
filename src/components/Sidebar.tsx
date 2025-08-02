/*
  Sidebar Component:
  This component displays a collapsible sidebar menu with navigation links.
  It receives the following props:
  - isCollapsed: a boolean indicating whether the sidebar is collapsed or expanded
  - handleToggleCollapse: a function to handle the toggle of the sidebar's collapse state
*/
import {
  Box,
  Button,
  Flex,
  Image,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
  Tooltip,
  VStack,
} from "@chakra-ui/react";
import logo from "../icons/collogo.png";
import collogo from "../icons/logo.jpg";
import Chart from "../icons/Chart.svg";
import Vector from "../icons/Vector.svg";
import source from "../icons/source.svg";
import branch from "../icons/branch.svg";
import city from "../icons/city.svg";
import status from "../icons/status.svg";
import callhistory from "../icons/callhistoy.svg";
import team from "../icons/team.svg";
import indiaMart from "../icons/indiamart.svg";
import course from "../icons/course.svg";
import addlead from "../whiteicons/addlead.svg";
import team2 from "../whiteicons/team.svg";
import source2 from "../whiteicons/source.svg";
import course2 from "../whiteicons/course.svg";
import branch2 from "../whiteicons/branch.svg";
import status2 from "../whiteicons/status.svg";
import whatsApp from "../icons/whatsapp.svg";
import city2 from "../whiteicons/city.svg";
import callhistory2 from "../whiteicons/callhistory.svg";
import indiamart2 from "../whiteicons/indiamart.svg";

import dashboard from "../whiteicons/dashboard.svg";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { ChevronDownIcon } from "@chakra-ui/icons";
import { BsWhatsapp } from "react-icons/bs";
import { BiMessageDetail } from "react-icons/bi";
import { FiImage } from "react-icons/fi";
import { GrDocumentTransfer } from "react-icons/gr";

//interfaces
interface SidebarProps {
  isCollapsed: boolean;
  handleToggleCollapse: () => void;
}

//sidebar component start
const Sidebar: React.FC<SidebarProps> = ({
  isCollapsed,
  handleToggleCollapse,
}) => {
  interface SigninUser {
    signinuser: {
      UserType: number;
      menuPermissions: [string];
    };
  }
  const { signinuser } = useSelector(
    (state: { common: SigninUser }) => state.common
  );

  // Extract the permissions from the signinuser object
  const { menuPermissions } = signinuser || {};

  const location = useLocation();
  const Navigate = useNavigate();

  const menu = [
    {
      icons: Chart,
      icon2: dashboard,
      link:
        signinuser?.UserType === 3
          ? "/"
          : signinuser?.UserType === 2
          ? "/admin-dashboard"
          : signinuser?.UserType === 1
          ? "/super-dashboard"
          : "",
      text: "Dashboard",
    },
    {
      icons: Vector,
      icon2: addlead,
      link: "/lead-list",
      text: "Lead List",
    },
    {
      icons: team,
      icon2: team2,
      link: signinuser?.UserType === 1 ? "/admin-list" : "/user-list",
      text: signinuser?.UserType === 1 ? "Admin List" : "Team List",
    },
    {
      icons: city,
      icon2: city2,
      link: "/proposal-list",
      text: "Proposal List",
    },
    {
      icons: source,
      icon2: source2,
      link: "/source-list",
      text: "Source List",
    },
    {
      icons: course,
      icon2: course2,
      link: "/product-list",
      text: "Product List",
    },
    {
      icons: branch,
      icon2: branch2,
      link: "/branch-list",
      text: "Branch List",
    },
    {
      icons: city,
      icon2: city2,
      link: "/city-list",
      text: "City List",
    },
    {
      icons: status,
      icon2: status2,
      link: "/status-list",
      text: "Status List",
    },
    {
      icons: indiaMart,
      icon2: indiamart2,
      link: "/india-mart",
      text: "India Mart",
    },
    {
      icons: callhistory,
      icon2: callhistory2,
      link: "/sidemenu",
      text: "SideMenu",
    },
    {
      icons: callhistory,
      icon2: callhistory2,
      link: "/integration",
      text: "Integration",
    },
  ];
  //for navigation
  const handleNavigate = (el: any) => {
    Navigate(el);
  };
  const filteredMenu = menu?.filter((el) => {
    if (signinuser?.UserType === 1) {
      return true;
    }
    // If permissions exist and the menu item text is included in the permissions, show the item
    else if (menuPermissions && menuPermissions?.includes(el.text)) {
      return true;
    }
    // Otherwise, hide the item
    return false;
  });

  return (
    <Box
      pos="fixed"
      left={0}
      top={0}
      bottom={0}
      w={isCollapsed ? "80px" : "200px"}
      bg=""
      p={4}
      transition="width 0.4s"
    >
      <VStack spacing={4} align="stretch">
        {/* Sidebar items */}
        {isCollapsed ? (
          <>
            <Image src={collogo} alt="XL-Academy" />
            {filteredMenu?.map((el, i) =>
              el.icons ? (
                <Tooltip
                  hasArrow
                  label={el.text}
                  placement={"right"}
                  bg="orange.300"
                  color={"blackAlpha.900"}
                  key={i}
                >
                  <Box
                    onClick={() => handleNavigate(el.link)}
                    cursor={"pointer"}
                    h="30px"
                    w="50px"
                    bg={location.pathname === el.link ? "#FF9000" : "gray.200"}
                    borderRadius="full"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                  >
                    <Box
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                      boxSize={5}
                    >
                      <Image
                        w="30px"
                        src={
                          location.pathname === el.link ? el.icon2 : el.icons
                        }
                      />
                    </Box>
                  </Box>
                </Tooltip>
              ) : null
            )}
          </>
        ) : (
          <>
            {/* Sidebar content */}
            <VStack spacing={3} align="stretch">
              <Image src={logo} alt="XL-Academy" mb={"2"} h={"40px"} />
              {filteredMenu?.map((el, i) => (
                <Flex
                  justify={"center"}
                  justifyContent={"space-evenly"}
                  alignItems={"center"}
                  onClick={() => handleNavigate(el.link)}
                  key={i}
                  cursor={"pointer"}
                  h="32px"
                  //  bg="gray.300"
                  bg={location.pathname === el.link ? "#FF9000" : ""}
                  borderRadius="md"
                  textAlign={"center"}
                  px="3"
                >
                  <Image
                    color={"black"}
                    src={location.pathname === el.link ? el.icon2 : el.icons}
                  />

                  <Text
                    mr={el.text === "City List" ? "20px" : "0"}
                    color={
                      location.pathname === el.link
                        ? "whiteAlpha.900"
                        : "blackAlpha.900"
                    }
                    fontSize={"1rem"}
                  >
                    {el.text}
                  </Text>
                </Flex>
              ))}
            </VStack>
          </>
        )}
      </VStack>
      {/* Drop Down */}

      {menuPermissions?.includes("WhatsApp") ? (
        isCollapsed ? (
          <Tooltip
            hasArrow
            label={"WhatsApp"}
            placement={"right"}
            bg="orange.300"
            color={"blackAlpha.900"}
          >
            <Box
              onClick={() => handleToggleCollapse()}
              cursor={"pointer"}
              h="30px"
              w="50px"
              mt={4}
              bg="gray.300"
              borderRadius="full"
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              <Box
                display="flex"
                alignItems="center"
                justifyContent="center"
                boxSize={5}
              >
                <Image w="30px" src={whatsApp} />
              </Box>
            </Box>
          </Tooltip>
        ) : (
          <Menu>
            <MenuButton
              as={Button}
              rightIcon={<ChevronDownIcon />}
              bg={"white"}
              borderWidth="1px"
              _hover={{ bg: "#FF9000", color: "white" }}
              _focus={{ bg: "#FF9000", color: "white" }}
              cursor={"pointer"}
              h="32px"
              borderRadius="md"
              textAlign={"center"}
              px="3"
            >
              <Flex
                justify={"center"}
                justifyContent={"space-evenly"}
                alignItems={"center"}
              >
                <Box mr={"12px"}>
                  <BsWhatsapp />
                </Box>
                <Text fontSize={"1rem"}>WhatsApp</Text>
              </Flex>
            </MenuButton>
            <MenuList minWidth="10rem">
              <Link to="/template">
                <MenuItem height={"2rem"} _hover={{ bg: "" }}>
                  <Flex
                    justify={"center"}
                    justifyContent={"space-evenly"}
                    alignItems={"center"}
                    cursor={"pointer"}
                    borderRadius="md"
                    textAlign={"center"}
                  >
                    <Box mr={"10px"}>
                      <BiMessageDetail />
                    </Box>
                    <Text color={"blackAlpha.900"} fontSize={"1rem"}>
                      Message
                    </Text>
                  </Flex>
                </MenuItem>
              </Link>
              <Link to="/whatsapp-image">
                <MenuItem height={"2rem"} _hover={{ bg: "" }}>
                  <Flex
                    justify={"center"}
                    justifyContent={"space-evenly"}
                    alignItems={"center"}
                    cursor={"pointer"}
                    borderRadius="md"
                    textAlign={"center"}
                  >
                    <Box mr={"10px"}>
                      <FiImage />
                    </Box>
                    <Text color={"blackAlpha.900"} fontSize={"1rem"}>
                      Image
                    </Text>
                  </Flex>
                </MenuItem>
              </Link>
              <Link to="/whatsapp-document">
                <MenuItem height={"2rem"} _hover={{ bg: "" }}>
                  <Flex
                    justify={"center"}
                    justifyContent={"space-evenly"}
                    alignItems={"center"}
                    cursor={"pointer"}
                    borderRadius="md"
                    textAlign={"center"}
                  >
                    <Box mr={"10px"}>
                      <GrDocumentTransfer />
                    </Box>
                    <Text color={"blackAlpha.900"} fontSize={"1rem"}>
                      Documents
                    </Text>
                  </Flex>
                </MenuItem>
              </Link>
            </MenuList>
          </Menu>
        )
      ) : null}
    </Box>
  );
};

export default Sidebar;
