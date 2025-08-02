/*
  CourseList Component:
  This component displays a list of courses fetched from the backend.
  It allows adding new courses, refreshing the course list, editing existing courses, and deleting courses.
  It utilizes Chakra UI components for styling.

  It does the following:
  - Imports necessary dependencies and components
  - Defines the interface for CourseLists
  - Initializes the useSelector hook to access the state from Redux
  - Initializes the useDispatch function from Redux
  - Initializes the useNavigate hook from react-router-dom for navigation purposes
  - Initializes the endpoint for API requests
  - Initializes the useToast hook for displaying toast messages
  - Uses the useMemo hook to memoize the courses data from the Redux state
  - Uses the useEffect hook to fetch the course data if it hasn't been fetched yet
  - Defines the handleDelete function to handle course deletion
  - Renders the course list table with columns for course information and action buttons
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
import AlertDialogDelete from "../../components/AlertDialouge";
import { CiEdit } from "react-icons/ci";

import Loader from "../../components/Loader";
import { FiRefreshCcw } from "react-icons/fi";
import AdminSelect from "../../helpers/AdminSelect";

// Interface for the course data structure
interface CourseLists {
  loading: boolean;
  courses: {
    serialNumber: number;
    createdAt: string;
    CourseValue: number;
    CourseName: string;
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
const CourseList: React.FC = () => {
  const [selectedAdmin, setSelectedAdmin] = useState<any>("");
  const { signinuser } = useSelector(
    (state: { common: SigninUserDetails }) => state.common
  );

  const { courses, loading } = useSelector(
    (state: { common: CourseLists; signinuser: { UserType: number } }) =>
      state.common
  );

  const istViewerOnly = signinuser?.permissionAccess?.some(
    (p) => p.name === "Product List" && p.access === "Viewer"
  );

  const filteredCourses =
    signinuser.UserType === 1 && selectedAdmin
      ? courses
      : signinuser.UserType !== 1
        ? courses
        : null;

  const dispatch: any = useDispatch();
  const navigate = useNavigate();
  const endpoint: string = "course";
  const toast = useToast();

  const memoizedCourses = useMemo(() => courses, [courses]);

  useEffect(() => {
    if (memoizedCourses.length === 0 && signinuser.UserType !== 1) {
      dispatch(getData(endpoint));
    }
  }, [dispatch, endpoint, memoizedCourses.length, signinuser.UserType]);

  useEffect(() => {
    if (memoizedCourses.length === 0 && selectedAdmin) {
      dispatch(getDataSuperAdmin(`course?parentId=${selectedAdmin}`));
    }
  }, [dispatch, endpoint, memoizedCourses.length, selectedAdmin]);

  // Handle course deletion
  const handleDelete = async (id: number) => {
    await dispatch(deleteData(id, endpoint, toast));
    dispatch(getData(endpoint));
  };

  return (
    <Stack h="100%" mt={1}>
      {/* Course List Header */}
      {signinuser.UserType !== 1 && (
        <Box
          px={10}
          h="40px"
          display={"flex"}
          justifyContent={"space-between"}
          alignItems={"center"}
        >
          <Spacer />
          {/* Add Course Button */}
          <Tooltip label={istViewerOnly ? "Not Authorized" : "Add Product"} hasArrow placement="top">
            <Button
            isDisabled={istViewerOnly}
              onClick={() => navigate("/add-course")}
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
              Add Product
            </Button>
          </Tooltip>
          <Box mt="2" ml="3">
            {/* Refresh Course List Button */}
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
            {/* Table Header */}
            <Thead bg={"gray.100"} position={"sticky"} top="0">
              <Tr>
                <Th>#</Th>
                <Th>Date Created</Th>
                <Th>Product Name</Th>
                <Th>Price</Th>
                <Th>Action</Th>
              </Tr>
            </Thead>

            {/* Table Body */}
            <Tbody>
              {loading ? (
                // Show loader if data is still loading
                <Tr>
                  <Td colSpan={5} textAlign="center">
                    <Loader />
                  </Td>
                </Tr>
              ) : (filteredCourses?.map((el, i) => (
                <Tr key={el._id}>
                  <Td>{i + 1}</Td>
                  <Td>{new Date(el.createdAt).toLocaleDateString()}</Td>
                  <Td>{el.CourseName}</Td>
                  <Td>{el.CourseValue}</Td>
                  <Td display={"flex"} alignItems={"center"}>
                    {/* Edit Course Button */}
                    <Tooltip label={istViewerOnly ? "Not Authorized" : "Update"} hasArrow placement="top">
                      <Box
                        opacity={istViewerOnly ? 0.4 : 1}
                        cursor={istViewerOnly ? "not-allowed" : "pointer"}
                        mr={"5"}
                      >
                        <Box pointerEvents={istViewerOnly ? "none" : "auto"}>
                          <CiEdit color="blue" size={19} onClick={() => navigate(`/update-course/${el._id}`)} />
                        </Box>
                      </Box>
                    </Tooltip>

                    {/* Delete Course Button */}
                    <Tooltip label={istViewerOnly ? "Not Authorized" : "Delete"} hasArrow placement="top">
                      <Box
                        opacity={istViewerOnly ? 0.4 : 1}
                        cursor={istViewerOnly ? "not-allowed" : "pointer"}
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

export default CourseList;
