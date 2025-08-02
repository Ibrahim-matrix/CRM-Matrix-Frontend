/*
  BranchList Component:
  This component represents a list of branches. It displays a table with the branch details,
  including the serial number, creation date, branch name, and action buttons for editing and deleting branches.
  It utilizes Chakra UI components for the table layout and styling. The component retrieves branch data from Redux
  and dispatches actions for deleting and retrieving branch data.

  It does the following:
  - Imports necessary dependencies and components
  - Defines the interface for branch lists
  - Retrieves branch data and loading state from Redux using the useSelector hook
  - Initializes the navigate function from react-router-dom for navigation purposes
  - Defines the endpoint for API calls
  - Initializes the useToast hook for displaying toast messages
  - Memoizes the branches array for efficient rendering
  - Uses the useEffect hook to retrieve branch data if the memoized branches array is empty
  - Defines the handleDelete function to delete a branch and retrieve updated data
  - Renders the branch list table using Chakra UI components, including the table header and body
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
import {
  deleteData,
  getData,
  getDataSuperAdmin,
} from "../../redux/actions/common.action";
import { useNavigate } from "react-router-dom";
import { CiEdit } from "react-icons/ci";
import AlertDialogDelete from "../../components/AlertDialouge";
import Loader from "../../components/Loader";
import { FiRefreshCcw } from "react-icons/fi";
import AdminSelect from "../../helpers/AdminSelect";

// Define the interface for branch lists
interface BranchLists {
  loading: boolean;
  branches: {
    serialNumber: number;
    createdAt: string;
    BranchName: string;
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

const BranchList: React.FC = () => {
  const [selectedAdmin, setSelectedAdmin] = useState<any>("");
  const { signinuser } = useSelector(
    (state: { common: SigninUserDetails }) => state.common
  );

  const { branches, loading } = useSelector(
    (state: { common: BranchLists; signinuser: { UserType: number } }) =>
      state.common
  );

  const istViewerOnly = signinuser?.permissionAccess?.some(
    (p) => p.name === "Branch List" && p.access === "Viewer"
  );


  const filteredCourses =
    signinuser.UserType === 1 && selectedAdmin
      ? branches
      : signinuser.UserType !== 1
        ? branches
        : null;

  const dispatch: any = useDispatch();
  const Navigate = useNavigate();
  const endpoint: string = "branch";
  const toast = useToast();

  // Memoize the branches array for efficient rendering
  const memoizedBranches = useMemo(() => branches, [branches]);

  useEffect(() => {
    if (memoizedBranches.length === 0 && signinuser.UserType !== 1) {
      dispatch(getData(endpoint));
    }
  }, [dispatch, endpoint, memoizedBranches.length, signinuser.UserType]);

  useEffect(() => {
    if (memoizedBranches.length === 0 && selectedAdmin) {
      dispatch(getDataSuperAdmin(`branch?parentId=${selectedAdmin}`));
    }
  }, [dispatch, endpoint, memoizedBranches.length, selectedAdmin]);

  // Handle branch deletion
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
          {/* Heading and add branch button */}
          <Spacer />
          <Tooltip label={istViewerOnly ? "Not Authorized" : "Add Branch"} hasArrow placement="top">
            <Button
              isDisabled={istViewerOnly}
              onClick={() => Navigate("/add-branch")}
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
              Add Branch
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

      <Divider bg="gray.300" height="2px" />
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
            {/* Table header */}
            <Thead bg={"gray.100"} position={"sticky"} top="0">
              <Tr>
                <Th>#</Th>
                <Th>Date Created</Th>
                <Th>Branch Name</Th>
                <Th>Action</Th>
              </Tr>
            </Thead>

            <Tbody>
              {/* Table body */}
              {/* Display loader if loading is true, otherwise render the branch rows */}
              {loading ? (
                <Tr>
                  <Td colSpan={3}>
                    <Loader />
                  </Td>
                </Tr>
              ) : (
                filteredCourses?.map((el, i) => (
                  <Tr key={el._id}>
                    <Td>{i + 1}</Td>
                    <Td>{new Date(el.createdAt).toLocaleDateString()}</Td>
                    <Td>{el.BranchName}</Td>
                    {/* Action buttons */}
                    <Td display={"flex"} alignItems={"center"}>
                      {/* Edit button */}
                      <Tooltip label={istViewerOnly ? "Not Authorized" : "Update"} hasArrow placement="top">
                        <Box
                          opacity={istViewerOnly ? 0.4 : 1}
                          cursor={istViewerOnly ? "not-allowed" : "pointer"}
                          mr={"5"}
                        >
                          <Box pointerEvents={istViewerOnly ? "none" : "auto"}>
                            <CiEdit color="blue" size={19}
                              onClick={() => Navigate(`/update-branch/${el._id}`)}
                            />
                          </Box>
                        </Box>
                      </Tooltip>

                      {/* Delete button */}
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
                ))
              )}
            </Tbody>
          </Table>
        </Box>
      </TableContainer>
    </Stack>
  );
};

export default BranchList;
