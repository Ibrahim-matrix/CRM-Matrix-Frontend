/*
  StatusList Component:
  This component displays a list of status fetched from the API. It provides the ability to add, update, and delete cities.
  It utilizes Chakra UI components for the table layout and styling.

  It does the following:
  - Imports necessary dependencies and components
  - Defines the interface for status lists
  - Retrieves the contacts and loading state from Redux using the useSelector hook
  - Initializes the dispatch function from Redux using the useDispatch hook
  - Initializes the navigate function from react-router-dom for navigation purposes
  - Defines the endpoint for API calls
  - Initializes the useToast hook for displaying toast messages
  - Fetches status data when the component mounts, only if there are no contacts present
  - Handles the delete operation for a status by dispatching the deleteData action and fetching updated status data
  - Renders the status list table using Chakra UI components, including table headers and rows
  - Displays a loader while data is being fetched
  - Provides buttons for adding a new status, refreshing the status list, and deleting a status with a confirmation dialog
*/
import React, { useEffect, useState } from "react";

import {
  Box,
  Button,
  Divider,
  Popover,
  PopoverArrow,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
  Spacer,
  Stack,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import Loader from "../../components/Loader";
import { FiRefreshCcw } from "react-icons/fi";
import axios from "axios";
import Cookies from "js-cookie";
import { BiDotsVertical } from "react-icons/bi";
import AssignIndiaMartLead from "./components/AssignIndiaMartLead";
import { BASE_URL } from "../../config/RequestMethod";
import { useSelector } from "react-redux";

//interface for the status lists
interface IndiaMart {
  loading: boolean;
  contacts: {
    serialNumber: number;
    phoneNumber: string;
    callType: string;
    duration: number;

    _id: number;
  }[];
}

// Interface for the details of the signed-in user
interface SigninUserDetails {
  signinuser: {
    _id: string;
    Name: string;
    userId: string;
  };
}

const IndiaMart: React.FC = () => {
  const token = Cookies.get("token");

  // Retrieve the details of the signed-in user from the Redux store
  const { signinuser } = useSelector(
    (state: { common: SigninUserDetails }) => state.common
  );
  console.log(signinuser.userId);

  const [loading, setLoading] = useState<boolean>(false);
  const [indiaMart, setIndiaMart] = useState<any[]>([]);
  const [selectedLeadId, setSelectedLeadId] = useState<string | null>(null); // State to track the selected lead ID

  const getAllLeads = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${BASE_URL}lead/getAllUserLeads/${signinuser.userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Pass the token in the headers
          },
        }
      );
      console.log(response.data);
      setIndiaMart(response?.data?.Data);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    getAllLeads();
  }, []);

  const [popoverOpen, setPopoverOpen] = useState<string | null>(null);

  // Function to handle opening/closing of popover
  const togglePopover = (uniqueId: string) => {
    if (popoverOpen === uniqueId) {
      // If the same popover is clicked again, close it and clear the selectedLeadId
      setPopoverOpen(null);
      setSelectedLeadId(null);
    } else {
      // Otherwise, open the clicked popover and set the selectedLeadId
      setPopoverOpen(uniqueId);
      setSelectedLeadId(uniqueId);
    }
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
          Status List
        </Text> */}
        <Spacer />
        <Box mt="2" ml="3">
          <Button
            size={"xs"}
            borderRadius={"full"}
            // onClick={() => dispatch(getData(endpoint))}
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
            <Thead bg={"gray.100"} position={"sticky"} top="0">
              <Tr>
                <Th>#</Th>
                <Th>UNIQUE_QUERY_ID</Th>
                <Th>SENDER_NAME</Th>
                <Th>SENDER_MOBILE</Th>
                <Th>SENDER_EMAIL</Th>
                <Th>SENDER_COMPANY</Th>
                <Th>View</Th>
              </Tr>
            </Thead>
            {loading ? (
              <Loader />
            ) : (
              <Tbody>
                {indiaMart?.map((el, i) => (
                  <Tr key={el._id}>
                    <Td>{i + 1}</Td>
                    <Td>{el.UNIQUE_QUERY_ID}</Td>
                    <Td>{el.SENDER_NAME}</Td>
                    <Td>{el.SENDER_MOBILE}</Td>
                    <Td>{el.SENDER_EMAIL}</Td>
                    <Td>{el.SENDER_COMPANY}</Td>
                    <Td sx={{ position: "relative" }}>
                      <Popover
                        placement="right"
                        isOpen={popoverOpen === el._id}
                        onOpen={() => togglePopover(el._id)}
                        onClose={() => togglePopover("")}
                      >
                        <PopoverTrigger>
                          <BiDotsVertical />
                        </PopoverTrigger>
                        <PopoverContent
                          style={{ marginLeft: "-84px", marginTop: "20px" }} // Inline CSS for offsets
                          w="100px"
                          maxW="100"
                          outline={"none"}
                          rounded={4}
                        >
                          <PopoverArrow />
                          <PopoverHeader>
                            <Box gap={6}>
                              {/* Add the AssignIndiaMartLead component here */}
                              <AssignIndiaMartLead
                                leadId={selectedLeadId} // Pass the lead ID as a prop
                              />
                              {/* <Link to={"/indiaMart-view"}>
                  <Button
                    fontSize={"10px"}
                    fontWeight={"medium"}
                    size="xs"
                    colorScheme="blue"
                    variant="outline"
                    color="blue.500"
                    px="2"
                    mt={2} 
                  >
          View Lead
        </Button>
                  </Link> */}
                            </Box>
                          </PopoverHeader>
                        </PopoverContent>
                      </Popover>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            )}
          </Table>
        </Box>
      </TableContainer>
    </Stack>
  );
};

export default IndiaMart;
