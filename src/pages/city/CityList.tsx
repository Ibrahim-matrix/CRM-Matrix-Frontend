/*
  CityList Component:
  This component displays a list of cities fetched from the API. It provides the ability to add, update, and delete cities.
  It utilizes Chakra UI components for the table layout and styling.

  It does the following:
  - Imports necessary dependencies and components
  - Defines the interface for city lists
  - Retrieves the cities and loading state from Redux using the useSelector hook
  - Initializes the dispatch function from Redux using the useDispatch hook
  - Initializes the navigate function from react-router-dom for navigation purposes
  - Defines the endpoint for API calls
  - Initializes the useToast hook for displaying toast messages
  - Fetches city data when the component mounts, only if there are no cities present
  - Handles the delete operation for a city by dispatching the deleteData action and fetching updated city data
  - Renders the city list table using Chakra UI components, including table headers and rows
  - Displays a loader while data is being fetched
  - Provides buttons for adding a new city, refreshing the city list, and deleting a city with a confirmation dialog
*/

import React, { useEffect, useMemo, useState } from "react";
import {
  Box,
  Button,
  Divider,
  Spacer,
  Stack,
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
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  deleteData,
  getData,
  getDataSuperAdmin,
} from "../../redux/actions/common.action";
import AlertDialogDelete from "../../components/AlertDialouge";
import { CiEdit } from "react-icons/ci";
import Loader from "../../components/Loader";
import { FiRefreshCcw } from "react-icons/fi";
import AdminSelect from "../../helpers/AdminSelect";

// Interface for city lists
interface CityLists {
  loading: boolean;
  cities: {
    serialNumber: number;
    createdAt: string;
    cityName: string;
    _id: number;
    branchId: string;
  }[];
}

interface permission {
  name: string;
  access: "Viewer" | "Editor"
}
// Interface for the details of the signed-in user
interface SigninUserDetails {
  signinuser: {
    UserType: number;
    permissionAccess: permission[]
  };
}

interface Branch {
  _id: string;
  BranchName: string;
}

const CityList: React.FC = () => {
  const [selectedAdmin, setSelectedAdmin] = useState<any>("");
  const { signinuser } = useSelector(
    (state: { common: SigninUserDetails }) => state.common
  );

  const {
    branches,
  } = useSelector((state: any) => state.common);

  const istViewerOnly = signinuser?.permissionAccess?.some(
    (p) => p.name === "Source List" && p.access === "Viewer"
  );
  console.log(branches)

  const { cities, loading } = useSelector(
    (state: { common: CityLists; signinuser: { UserType: number } }) =>
      state.common
  );

  console.log(cities)

  const filteredCourses =
    signinuser.UserType === 1 && selectedAdmin
      ? cities
      : signinuser.UserType !== 1
        ? cities
        : null;

  console.log(filteredCourses)

  const dispatch: any = useDispatch();
  const Navigate = useNavigate();
  const endpoint: string = "city";
  const endpoint2: string = "branch";
  const toast = useToast();

  const memoizedCities = useMemo(() => cities, [cities]);

  // Memoize the branches array for efficient rendering
  const memoizedBranches = useMemo(() => branches, [branches]);

  console.log(cities)

  useEffect(() => {
    if (memoizedBranches.length === 0 && signinuser.UserType !== 1) {
      dispatch(getData(endpoint2));
    }
    if (memoizedCities.length === 0 && signinuser.UserType !== 1) {
      dispatch(getData(endpoint));
    }
  }, [dispatch, endpoint, memoizedCities.length, memoizedBranches.length, signinuser.UserType]);

  useEffect(() => {
    if (memoizedCities.length === 0 && selectedAdmin) {
      dispatch(getDataSuperAdmin(`city?parentId=${selectedAdmin}`));
    }
  }, [dispatch, endpoint, memoizedCities.length, selectedAdmin]);

  const handleDelete = async (id: number) => {
    await dispatch(deleteData(id, endpoint, toast));
    dispatch(getData(endpoint));
  };

  return (
    <Stack h="100%" mt={1}>
      {/* City List Header */}
      {signinuser.UserType !== 1 && (
        <Box
          px={10}
          h="40px"
          display={"flex"}
          justifyContent={"space-between"}
          alignItems={"center"}
        >
          <Spacer />
          <Tooltip label={istViewerOnly ? "Not Authorized" : "Add City"} hasArrow placement="top">
            <Button
              isDisabled={istViewerOnly}
              onClick={() => Navigate("/add-city")}
              mt={2}
              size={"sm"}
              _hover={{ bg: "#FF9000" }}
              w="7.188rem"
              bg="#FF9000"
              borderRadius={"0.25rem"}
              color="whiteAlpha.900"
              fontWeight={"700"}
              fontSize={"1rem"}
            >
              Add City
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
      )}

      {/* Divider */}
      <Divider bg="gray.300" height="2px" />
      {/* City List Table */}
      {signinuser.UserType === 1 ? (
        <Box px={10} py={3}>
          <AdminSelect
            setSelectedAdmin={setSelectedAdmin}
            selectedAdmin={selectedAdmin}
            endpoint={endpoint}
          />
        </Box>
      ) : null}
      <TableContainer px="2">
        <Box overflowY="auto" height={480} maxHeight="480px">
          <Table variant="simple" size="sm">
            {/* Table Headers */}
            <Thead bg={"gray.100"} position="sticky" top="0">
              <Tr>
                <Th>#</Th>
                <Th>Date Created</Th>
                <Th>Branch Name</Th>
                <Th>City Name</Th>
                <Th>Action</Th>
              </Tr>
            </Thead>
            <Tbody>
              {/* Render city rows */}
              {loading ? (
                <Loader />
              ) : (
                filteredCourses?.map((el, i) =>
                (

                  <Tr key={el._id}>

                    <Td>{i + 1}</Td>
                    <Td>{new Date(el.createdAt).toLocaleDateString()}</Td>
                    <Td>{branches.filter((branch: Branch) => branch._id === el.branchId)[0]?.BranchName}</Td>
                    <Td>{el.cityName}</Td>
                    <Td display={"flex"} alignItems={"center"}>
                      <Tooltip label={istViewerOnly ? "Not Authorized" : "Update"} hasArrow placement="top">
                        <Box
                          opacity={istViewerOnly ? 0.4 : 1}
                          cursor={istViewerOnly ? "not-allowed" : "pointer"}
                          mr={"5"}

                        >
                          <Box pointerEvents={istViewerOnly ? "none" : "auto"}>
                            <CiEdit color="blue" size={19} onClick={() => Navigate(`/update-city/${el._id}`)} />
                          </Box>
                        </Box>
                      </Tooltip>
                      <Tooltip label={istViewerOnly ? "Not Authorized" : "Delete"} hasArrow placement="top">
                        <Box
                          cursor={istViewerOnly ? "not-allowed" : "pointer"}
                          opacity={istViewerOnly ? 0.4 : 1}
                        >
                          <Box pointerEvents={istViewerOnly ? "none" : "auto"}>
                            <AlertDialogDelete
                              id={el._id}
                              handleDelete={handleDelete}
                            />
                          </Box>
                        </Box>
                      </Tooltip>

                    </Td>
                  </Tr>
                )
                )
              )}
            </Tbody>
          </Table>
        </Box>
      </TableContainer>
    </Stack>
  );
};

export default CityList;
