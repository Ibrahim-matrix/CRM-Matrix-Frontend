import {
  Avatar,
  Box,
  Button,
  Center,
  Divider,
  Flex,
  Grid,
  GridItem,
  Image,
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
import { useNavigate, useParams } from "react-router-dom";
import {
  getData,
  getDataByIdSuperAdmin,
} from "../../redux/actions/common.action";
import Loader from "../../components/Loader";
import { FiRefreshCcw } from "react-icons/fi";
import { TfiEye } from "react-icons/tfi";

// Interface for the details of the signed-in user
interface SigninUserDetails {
  signinuser: {
    UserType: number;
  };
}

//interface for the usersLists
interface adminLists {
  user: {
    Data: {
      adminData: {
        ComapanyImageOne: string;
        Name: string;
        UserName: string;
        UserType: number;
        Email: string;
        Phone: number;
        companyName: string;
        Branch: string;
        Address: string;
        City: string;
        teamSize: string;
        numberOfUsers: string;
        webURL: string;
        State: string;
        Pincode: string;
        validupTo: string;
        image: string;
        serialNumber: number;
        integrationPermissions: [];
        menuPermissions: [];
        _id: string;
        active: boolean;
      };
      adminUsers: {
        Name: string;
        UserName: string;
        UserType: number;
        Email: string;
        Phone: number;
        companyName: string;
        Branch: string;
        Address: string;
        City: string;

        _id: string;
      }[];
    };
  };
  loading: boolean;
}

const AdminDetails: React.FC = () => {
  // Retrieve the details of the signed-in user from the Redux store
  //   const { signinuser } = useSelector(
  //     (state: { common: SigninUserDetails }) => state.common
  //   );

  // Accessing necessary hooks, variables, and parameters
  const { id } = useParams();

  // Selecting the users and loading state from the Redux store
  const { user, loading } = useSelector(
    (state: { common: adminLists }) => state.common
  );

  // Accessing the Redux dispatch function
  const dispatch: any = useDispatch();

  // Setting the endpoint for API requests
  const endpoint: string = `adminUsers`;

  // useEffect hook to fetch data when 'id' changes
  useEffect(() => {
    dispatch(getDataByIdSuperAdmin(id, endpoint));
  }, [id]);

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
          Admin Details
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
        // h="200px"
        templateRows="repeat(4, 1fr)"
        templateColumns="repeat(5, 1fr)"
        gap={2}
        p={4}
      >
        <GridItem rowSpan={3} colSpan={1} m={"auto"}>
          <Image
            borderRadius="full"
            boxSize="150px"
            src={user?.Data?.adminData?.ComapanyImageOne}
            alt={user?.Data?.adminData?.ComapanyImageOne}
          />
        </GridItem>
        <GridItem colSpan={1}>
          <Flex flexDir={"column"}>
            <Text color={"gray.800"} fontWeight={600}>
              Name
            </Text>
            <Text fontSize={"sm"}>{user?.Data?.adminData?.Name}</Text>
          </Flex>
        </GridItem>
        <GridItem colSpan={1}>
          <Flex flexDir={"column"}>
            <Text color={"gray.800"} fontWeight={600}>
              UserName
            </Text>
            <Text fontSize={"sm"}>{user?.Data?.adminData?.UserName}</Text>
          </Flex>
        </GridItem>
        <GridItem colSpan={1}>
          <Flex flexDir={"column"}>
            <Text color={"gray.800"} fontWeight={600}>
              Phone Number
            </Text>
            <Text fontSize={"sm"}>{user?.Data?.adminData?.Phone}</Text>
          </Flex>
        </GridItem>
        <GridItem colSpan={1}>
          <Flex flexDir={"column"}>
            <Text color={"gray.800"} fontWeight={600}>
              Email Id
            </Text>
            <Text fontSize={"sm"}>{user?.Data?.adminData?.Email}</Text>
          </Flex>
        </GridItem>
        <GridItem colSpan={1}>
          <Flex flexDir={"column"}>
            <Text color={"gray.800"} fontWeight={600}>
              Company Name
            </Text>
            <Text fontSize={"sm"}>{user?.Data?.adminData?.companyName}</Text>
          </Flex>
        </GridItem>
        <GridItem colSpan={1}>
          <Flex flexDir={"column"}>
            <Text color={"gray.800"} fontWeight={600}>
              Address
            </Text>
            <Text fontSize={"sm"}>{user?.Data?.adminData?.Address}</Text>
          </Flex>
        </GridItem>
        <GridItem colSpan={1}>
          <Flex flexDir={"column"}>
            <Text color={"gray.800"} fontWeight={600}>
              Team Size
            </Text>
            <Text fontSize={"sm"}>{user?.Data?.adminData?.teamSize}</Text>
          </Flex>
        </GridItem>
        <GridItem colSpan={1}>
          <Flex flexDir={"column"}>
            <Text color={"gray.800"} fontWeight={600}>
              No of Users
            </Text>
            <Text fontSize={"sm"}>{user?.Data?.adminData?.numberOfUsers}</Text>
          </Flex>
        </GridItem>
        <GridItem colSpan={1}>
          <Flex flexDir={"column"}>
            <Text color={"gray.800"} fontWeight={600}>
              Web URL
            </Text>
            <Text fontSize={"sm"}>{user?.Data?.adminData?.webURL}</Text>
          </Flex>
        </GridItem>
        <GridItem colSpan={1}>
          <Flex flexDir={"column"}>
            <Text color={"gray.800"} fontWeight={600}>
              State
            </Text>
            <Text fontSize={"sm"}>{user?.Data?.adminData?.State}</Text>
          </Flex>
        </GridItem>
        <GridItem colSpan={1}>
          <Flex flexDir={"column"}>
            <Text color={"gray.800"} fontWeight={600}>
              Pincode
            </Text>
            <Text fontSize={"sm"}>{user?.Data?.adminData?.Pincode}</Text>
          </Flex>
        </GridItem>

        <GridItem colSpan={1}>
          <Flex flexDir={"column"}>
            <Text color={"gray.800"} fontWeight={600}>
              Valid Up To
            </Text>
            <Text fontSize={"sm"}>{user?.Data?.adminData?.validupTo}</Text>
          </Flex>
        </GridItem>
        {/* <Text color={"gray.800"} fontWeight={600}></Text> */}
        <GridItem colSpan={4}>
          <Text color={"gray.800"} fontWeight={600}>
            Menu Permission
          </Text>
          <Flex gap={8} flexWrap={"wrap"}>
            {user?.Data?.adminData?.menuPermissions.map(
              (el: any, index: any) => {
                return (
                  <Text key={index} fontSize={"sm"}>
                    {`${index + 1}.`} {el}
                  </Text>
                );
              }
            )}
          </Flex>
        </GridItem>
        <GridItem colSpan={4}>
          <Text color={"gray.800"} fontWeight={600}>
            Integral Permission
          </Text>
          <Flex gap={8} flexWrap={"wrap"}>
            {user?.Data?.adminData?.integrationPermissions.map(
              (el: any, index: any) => {
                return (
                  <Text key={index} fontSize={"sm"}>
                    {`${index + 1}.`} {el}
                  </Text>
                );
              }
            )}
          </Flex>
        </GridItem>
      </Grid>

      <Divider
        bg="gray.300" // Set the background color to dark gray
        height="2px" // Set the height of the divider
      />
      <Box
        px={8}
        // h="40px"
        display={"flex"}
        justifyContent={"space-between"}
        alignItems={"center"}
      >
        <Text color={"#000000"} fontSize={"1.25rem"} fontWeight={"600"}>
          User List
        </Text>
        <Spacer />
      </Box>

      <TableContainer px="2">
        <Box overflowY="auto" height={480} maxHeight="480px">
          <Table variant="simple" size="sm">
            <Thead bg={"gray.100"}>
              <Tr>
                <Th>Name</Th>
                <Th>Username</Th>
                <Th>Phone No.</Th>
                <Th>Email-ID</Th>
                {/* <Th>UserType</Th> */}
                <Th>City</Th>
                <Th>Branch</Th>
                {/* <Th>Action</Th> */}
              </Tr>
            </Thead>
            {loading ? (
              <Loader />
            ) : (
              <Tbody>
                {user?.Data?.adminUsers?.map((el) => (
                  <Tr key={el._id}>
                    <Td>{el.Name}</Td>
                    <Td>{el.UserName}</Td>
                    <Td>{el.Phone}</Td>
                    <Td>{el.Email}</Td>
                    {/* <Td>{el.UserType}</Td> */}
                    <Td>{el.City}</Td>
                    <Td>{el.Branch}</Td>
                    {/* <Td display={"flex"} alignItems={"center"}>
                      <Box
                        cursor={"pointer"}
                        mr={"5"}
                        onClick={() => Navigate(`/user-details`)}
                      >
                        <TfiEye color="blue" size={19} />
                      </Box>
                    </Td> */}
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

export default AdminDetails;
