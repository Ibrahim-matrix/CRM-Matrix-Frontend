/*
  SourceList Component:
  This component displays a list of source fetched from the API. It provides the ability to add, update, and delete cities.
  It utilizes Chakra UI components for the table layout and styling.

  It does the following:
  - Imports necessary dependencies and components
  - Defines the interface for source lists
  - Retrieves the sources and loading state from Redux using the useSelector hook
  - Initializes the dispatch function from Redux using the useDispatch hook
  - Initializes the navigate function from react-router-dom for navigation purposes
  - Defines the endpoint for API calls
  - Initializes the useToast hook for displaying toast messages
  - Fetches source data when the component mounts, only if there are no sources present
  - Handles the delete operation for a source by dispatching the deleteData action and fetching updated source data
  - Renders the source list table using Chakra UI components, including table headers and rows
  - Displays a loader while data is being fetched
  - Provides buttons for adding a new source, refreshing the source list, and deleting a source with a confirmation dialog
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
import { useNavigate } from "react-router-dom";
import {
  deleteData,
  getData,
  getDataSuperAdmin,
} from "../../redux/actions/common.action";
import { useDispatch, useSelector } from "react-redux";
import AlertDialogDelete from "../../components/AlertDialouge";
import { CiEdit } from "react-icons/ci";
import Loader from "../../components/Loader";
import { FiRefreshCcw } from "react-icons/fi";
import AdminSelect from "../../helpers/AdminSelect";
interface SourceLists {
  loading: boolean;
  sources: {
    serialNumber: number;
    createdAt: string;
    SourceName: number;
    Description: string;
    _id: number;
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
const SourceList: React.FC = () => {
  const [selectedAdmin, setSelectedAdmin] = useState<any>("");

  const { signinuser } = useSelector(
    (state: { common: SigninUserDetails }) => state.common
  );

  const { sources, loading } = useSelector(
    (state: { common: SourceLists; signinuser: { UserType: number } }) =>
      state.common
  );

  const istViewerOnly = signinuser?.permissionAccess?.some(
    (p) => p.name === "Source List" && p.access === "Viewer"
  );


  const filteredSources =
    signinuser.UserType === 1 && selectedAdmin
      ? sources
      : signinuser.UserType !== 1
        ? sources
        : null;

  // Accessing necessary hooks and variables
  const dispatch: any = useDispatch();
  const Navigate = useNavigate();
  const endpoint: string = "source";
  const toast = useToast();

  const memoizedSources = useMemo(() => sources, [sources]);

  useEffect(() => {
    if (memoizedSources.length === 0 && signinuser.UserType !== 1) {
      dispatch(getData(endpoint));
    }
  }, [dispatch, endpoint, memoizedSources.length, signinuser.UserType]);

  useEffect(() => {
    if (memoizedSources.length === 0 && selectedAdmin) {
      // dispatch(getData(endpoint));
      dispatch(getDataSuperAdmin(`source?parentId=${selectedAdmin}`));
    }
  }, [dispatch, endpoint, memoizedSources.length, selectedAdmin]);

  // Function to handle delete action
  const handleDelete = async (id: number) => {
    await dispatch(deleteData(id, endpoint, toast));
    dispatch(getData(endpoint));
  };

  return (
    <Stack h="100%" mt={1}>
      {signinuser.UserType !== 1 && (
        <Box
          px={10}
          h="40px"
          display={"flex"}
          justifyContent={"space-between"}
          alignItems={"center"}
        >
          {" "}
          {/* <Text color={"#000000"} fontSize={"1.25rem"} fontWeight={"600"}>
           Source List
         </Text> */}
          <Spacer />
          <Tooltip label={istViewerOnly ? "Not Authorized" : "Add Source"} hasArrow placement="top">
            <Button
              isDisabled={istViewerOnly}
              mt={2}
              onClick={() => Navigate("/add-source")}
              size={"sm"}
              _hover={{ bg: "#FF9000" }}
              w="7.188rem"
              bg="#FF9000"
              borderRadius={"0.25rem"}
              color="whiteAlpha.900"
              fontWeight={"700"}
              fontSize={"1rem"}
            >
              {" "}
              Add Source
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

      <Divider
        bg="gray.300" // Set the background color to dark gray
        height="2px" // Set the height of the divider
      />
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
            <Thead bg={"gray.100"} position={"sticky"} top="0">
              <Tr>
                <Th>#</Th>
                <Th>Date Created</Th>
                <Th>Source Name</Th>
                <Th>Description</Th>
                <Th>Action</Th>
              </Tr>
            </Thead>
            {loading ? (
              <Tr>
                <Td colSpan={5}>
                  <Loader />
                </Td>
              </Tr>
            ) : (
              <Tbody>
                {filteredSources?.map((el, i) => (
                  <Tr key={el._id}>
                    <Td>{i + 1}</Td>
                    <Td>{new Date(el.createdAt).toLocaleDateString()}</Td>
                    <Td>{el.SourceName}</Td>
                    <Td>{el.Description}</Td>
                    {/* onClick={() => handleDelete(el._id)} */}
                    <Td display={"flex"} alignItems={"center"}>
                      <Tooltip label={istViewerOnly ? "Not Authorized" : "Update"} hasArrow placement="top">
                        <Box
                          opacity={istViewerOnly ? 0.4 : 1}
                          cursor={istViewerOnly ? "not-allowed" : "pointer"}
                          mr={"5"}
                        >
                          <Box pointerEvents={istViewerOnly ? "none" : "auto"}>
                            <CiEdit color="blue" size={19}
                              onClick={() => Navigate(`/update-source/${el._id}`)}
                            />
                          </Box>
                        </Box>
                      </Tooltip>

                      <Tooltip label={istViewerOnly ? "Not Authorized" : "Delete"} hasArrow placement="top">
                        <Box
                          // KEEP the pointerEvents active for the Tooltip trigger
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
                ))}
              </Tbody>
            )}
          </Table>
        </Box>
      </TableContainer>
    </Stack>
  );
};

export default SourceList;
