/*
  SourceList Component:
  This component displays a list of source fetched from the API. It provides the ability to add, update, and delete cities.
  It utilizes Chakra UI components for the table layout and styling.

  It does the following:
  - Imports necessary dependencies and components
  - Defines the interface for userlist lists
  - Retrieves the users and loading state from Redux using the useSelector hook
  - Initializes the dispatch function from Redux using the useDispatch hook
  - Initializes the navigate function from react-router-dom for navigation purposes
  - Defines the endpoint for API calls
  - Initializes the useToast hook for displaying toast messages
  - Fetches users data when the component mounts, only if there are no sources present
  - Handles the delete operation for a user by dispatching the deleteData action and fetching updated source data
  - Renders the users list table using Chakra UI components, including table headers and rows
  - Displays a loader while data is being fetched
  - Provides buttons for adding a new user, refreshing the users list, and deleting a user with a confirmation dialog
  - admin can toggle the switch for the active-status of the user he can disable the user if the switch is disabled and vice-versa
  */
import {
  Avatar,
  Box,
  Button,
  Divider,
  Spacer,
  Stack,
  Switch,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tooltip,
  Tr,
  useToast,
} from "@chakra-ui/react";
import React, { ChangeEvent, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getData, updateData } from "../../redux/actions/common.action";
import Loader from "../../components/Loader";
import { CiEdit } from "react-icons/ci";
import { FiRefreshCcw } from "react-icons/fi";
import { TfiEye } from "react-icons/tfi";

interface permission {
  name: string;
  access: "Viewer" | "Editor";
}

// Interface for the details of the signed-in user
interface SigninUserDetails {
  signinuser: {
    UserType: number;
    permissionAccess: permission[];
  };
}

//interface for the usersLists
interface userLists {
  users: {
    Name: string;
    UserName: string;
    UserType: number;
    Email: string;
    Phone: number;
    role: string;
    Branch: string;
    Permission: string;
    City: string;
    image: string;
    serialNumber: number;
    _id: string;
    active: boolean;
  }[];
  loading: boolean;
}

const TeamList: React.FC = () => {
  // Retrieve the details of the signed-in user from the Redux store
  const { signinuser } = useSelector(
    (state: { common: SigninUserDetails }) => state.common
  );

  console.log(signinuser?.permissionAccess);
  const istViewerOnly = signinuser?.permissionAccess?.some(
    (p) => p.name === "Team List" && p.access === "Viewer"
  );

  // Selecting the users and loading state from the Redux store
  const { users, loading } = useSelector(
    (state: { common: userLists }) => state.common
  );
  console.log(users);

  // Accessing the Redux dispatch function
  const dispatch: any = useDispatch();

  const navigate = useNavigate();

  const toast = useToast();

  // Accessing the navigation function from react-router-dom
  const Navigate = useNavigate();

  // Setting the endpoint for API requests
  const endpoint: string = "user";

  // Memoizing the users array to prevent unnecessary re-rendering
  // const memoizedBranches = useMemo(() => users, [users]);

  // Fetching user data if it is not already available
  useEffect(() => {
    dispatch(getData(endpoint));
  }, [dispatch, endpoint]);

  // Handling the toggle switch for user status
  const handleSwitchToggle = async (
    event: ChangeEvent<HTMLInputElement>,
    id: string
  ) => {
    const isChecked = event.target.checked;
    console.log(isChecked);
    try {
      await dispatch(
        updateData(id, endpoint, { active: isChecked }, navigate, toast)
      );
      dispatch(getData(endpoint));
    } catch (error: any) {
      console.error(`Error updating user ${id}: ${error.message}`);
    }
  };

  const handleToggle = (event: any, id: any) => {
    handleSwitchToggle(event, id);
    // dispatch(getData(endpoint));
  };

  return (
    <Stack h="100%" mt={1}>
      <Box
        px={10}
        h="40px"
        display={"flex"}
        justifyContent={"space-between"}
        alignItems={"center"}
      >
        {" "}
        {/* <Text color={"#000000"} fontSize={"1.25rem"} fontWeight={"600"}>
          Team List
        </Text> */}
        <Spacer />
        <Tooltip
          label={istViewerOnly ? "Not Authorized" : "Add User"}
          hasArrow
          placement="top"
        >
          <Button
            isDisabled={istViewerOnly}
            onClick={() => Navigate("/addnewuser")}
            size={"sm"}
            _hover={{ bg: "#FF9000" }}
            w="7.188rem"
            bg="#FF9000"
            mt={2}
            borderRadius={"0.25rem"}
            color="whiteAlpha.900"
            fontWeight={"700"}
            fontSize={"1rem"}
          >
            Add User
          </Button>
        </Tooltip>
        <Box mt="2" ml="3">
          <Button
            size={"xs"}
            borderRadius={"full"}
            onClick={() => dispatch(getData(endpoint))}
          >
            <FiRefreshCcw />
          </Button>
        </Box>
      </Box>
      <Divider
        bg="gray.300" // Set the background color to dark gray
        height="2px" // Set the height of the divider
      />
      <TableContainer px="2">
        <Box overflowY="auto" height={480} maxHeight="480px">
          <Table variant="simple" size="sm">
            <Thead bg={"gray.100"}>
              <Tr>
                <Th>Photo</Th>
                <Th>Name</Th>
                <Th>Username</Th>
                <Th>Phone No.</Th>
                <Th>Email-ID</Th>
                {/* <Th>UserType</Th> */}
                <Th>City</Th>
                <Th>Branch</Th>
                <Th>Action</Th>
              </Tr>
            </Thead>
            <Tbody>
              {loading ? (
                <Tr>
                  <Td colSpan={8} textAlign="center">
                    <Loader />
                  </Td>
                </Tr>
              ) : (
                users?.map((el) => (
                  <Tr key={el._id} _hover={{ bg: "#edededff" }}>
                    <Td>
                      {" "}
                      <Avatar
                        size="sm"
                        bg="blue.500"
                        color="whiteAlpha.900"
                        name={el.Name}
                        src={el.image}
                      />
                    </Td>
                    <Td>{el.Name}</Td>
                    <Td>{el.UserName}</Td>
                    <Td>{el.Phone}</Td>
                    <Td>{el.Email}</Td>
                    {/* <Td>{el.UserType}</Td> */}
                    <Td>{el.City}</Td>
                    <Td>{el.Branch}</Td>
                    <Td display={"flex"} alignItems={"center"} mt={"1rem"}>
                      <Box cursor={"pointer"} mr="3">
                        <Switch
                          isChecked={el.active}
                          size="sm"
                          onChange={(event) => handleToggle(event, el._id)}
                        />
                      </Box>
                      <Tooltip
                        label={istViewerOnly ? "Not Authorized" : "Update"}
                        hasArrow
                        placement="top"
                      >
                        <Box
                          opacity={istViewerOnly ? 0.4 : 1}
                          cursor={istViewerOnly ? "not-allowed" : "pointer"}
                          mr={"5"}
                        >
                          <Box pointerEvents={istViewerOnly ? "none" : "auto"}>
                            <CiEdit
                              color="blue"
                              size={19}
                              onClick={() => Navigate(`/update-user/${el._id}`)}
                            />
                          </Box>
                        </Box>
                      </Tooltip>
                      <Box
                        cursor={"pointer"}
                        mr={"5"}
                        onClick={() => Navigate(`/user-details/${el._id}`)}
                      >
                        <TfiEye color="blue" size={19} />
                      </Box>
                    </Td>
                  </Tr>
                ))
              )}
            </Tbody>
          </Table>
        </Box>
      </TableContainer>
    </Stack>
  );
};

export default TeamList;
