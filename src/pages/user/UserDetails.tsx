import {
  Avatar,
  Box,
  Button,
  Divider,
  Flex,
  Grid,
  GridItem,
  IconButton,
  Image,
  Input,
  Spacer,
  Stack,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import React, { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getData, getDataById } from "../../redux/actions/common.action";
import { FiRefreshCcw } from "react-icons/fi";
import { useNavigate, useParams } from "react-router-dom";
import Loader from "../../components/Loader";
import { BsFillTelephoneInboundFill, BsFillTelephoneOutboundFill } from "react-icons/bs";


//interface for the updating user
interface getSingleUsers {
  user: {
    Name: string;
    UserName: string;
    UserType: string;
    Email: string;
    Phone: string;
    role: string;
    Branch: string;
    Permission: string;
    City: string;
    image: string;
    serialNumber: number;
    _id: string;
  };
}

//interface for the status lists
interface StatusLists {
  loading: boolean;
  contacts: {
    serialNumber: number;
    phoneNumber: string;
    callType: string;
    duration: number;

    _id: number;
  }[];
}

const UserDetails: React.FC = () => {

  const navigate = useNavigate()

  // Accessing the user state from the Redux store
  const { user } = useSelector(
    (state: { common: getSingleUsers }) => state.common
  );
  console.log(user)

  // Accessing the ID parameter from the URL
  const { id } = useParams();

  // Setting the endpoint for API requests
  const endpoint2: string = "user";


  // Fetching the user data by ID
  useEffect(() => {
    dispatch(getDataById(id, endpoint2));
  }, [id]);


  // Accessing the contacts and loading state from the common reducer using the useSelector hook
  const { contacts, loading } = useSelector(
    (state: { common: StatusLists }) => state.common
  );

  // Obtaining the dispatch function using the useDispatch hook
  const dispatch: any = useDispatch();

  // Setting the endpoint to "status"
  const endpoint: string = "contact";

  // Memoizing the contacts array using the useMemo hook
  const memoizedContacts = useMemo(() => contacts, [contacts]);

  // Fetching the data if the memoized contacts array is empty
  useEffect(() => {
    if (!memoizedContacts || memoizedContacts?.length === 0) {
      dispatch(getData(endpoint));
    }
  }, [dispatch, endpoint, memoizedContacts?.length]);


  return (
    <Stack h="100%" mt={1}>
      <Box
        px={10}
        h="40px"
        display={"flex"}
        justifyContent={"space-between"}
        alignItems={"center"}
      >
        <Text color={"#000000"} fontSize={"1.25rem"} fontWeight={"600"}>
          User Details
        </Text>
        <Spacer />
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
      <Grid
        h="200px"
        templateRows="repeat(2, 1fr)"
        templateColumns="repeat(5, 1fr)"
        gap={8}
        p={8}
      >
        <GridItem rowSpan={2} colSpan={2} m={"auto"}>
          <Avatar
            size="2xl"
            bg="blue.500"
            color="whiteAlpha.900"
            name={user.Name}
            src={user.image}
          />
        </GridItem>
        <GridItem colSpan={1}>
          <Flex flexDir={"column"}>
            <Text color={"gray.500"}>Name</Text>
            <Text fontSize={"xl"}>{user.Name}</Text>
          </Flex>
        </GridItem>
        <GridItem colSpan={1}>
          <Flex flexDir={"column"}>
            <Text color={"gray.500"}>UserName</Text>
            <Text fontSize={"xl"}>{user.Name}</Text>
          </Flex>
        </GridItem>
        <GridItem colSpan={1}>
          <Flex flexDir={"column"}>
            <Text color={"gray.500"}>Phone Number</Text>
            <Text fontSize={"xl"}>{user.Phone}</Text>
          </Flex>
        </GridItem>
        <GridItem colSpan={1}>
          <Flex flexDir={"column"}>
            <Text color={"gray.500"}>Email Id</Text>
            <Text fontSize={"xl"}>{user.Email}</Text>
          </Flex>
        </GridItem>
        <GridItem colSpan={1}>
          <Flex flexDir={"column"}>
            <Text color={"gray.500"}>City</Text>
            <Text fontSize={"xl"}>{user.City}</Text>
          </Flex>
        </GridItem>
        <GridItem colSpan={1}>
          <Flex flexDir={"column"}>
            <Text color={"gray.500"}>Branch</Text>
            <Text fontSize={"xl"}>{user.Branch}</Text>
          </Flex>
        </GridItem>
      </Grid>
      <Box display={'flex'} justifyContent={'flex-end'}>
        <Button
          onClick={() => navigate("/user-list")}
          variant="outline"
          mt={6}
          mr={8}
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
      </Box>
      {/* <Stack h="100%" mt={1}>
      <Box
        px={10}
        h="40px"
        display={"flex"}
        justifyContent={"space-between"}
        alignItems={"center"}
      >
        <Stack spacing={3}>
    <Input placeholder="Select Date and Time"
   size="md"
   type="datetime-local" />
   </Stack>
        <Spacer />
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
            <Thead bg={"gray.100"} position={"sticky"} top="0">
              <Tr>
                <Th>#</Th>
                <Th>Name</Th>
                <Th>Phone Number</Th>
                <Th>Type</Th>
                <Th>Duration</Th>
              </Tr>
            </Thead>
            {loading ? (
              <Loader />
            ) : (
              <Tbody>
                {contacts?.map((el, i) => (
                  <Tr key={el._id}>
                    <Td>{i + 1}</Td>
                    <Td>
                      <IconButton
                        colorScheme={
                          el.callType === "Inbound" ? "green" : "red"
                        }
                        aria-label="Call Segun"
                        size="sm"
                        mx={2}
                        icon={
                          el.callType === "Inbound" ? (
                            <BsFillTelephoneInboundFill />
                          ) : (
                            <BsFillTelephoneOutboundFill />
                          )
                        }
                      />
                    </Td>
                    <Td>{el.phoneNumber}</Td>
                    <Td>{el.callType}</Td>
                    <Td>{el.duration}</Td>
                  </Tr>
                ))}
              </Tbody>
            )}
          </Table>
        </Box>
      </TableContainer>
    </Stack> */}
    </Stack>
  );
};

export default UserDetails;
