import React, { useEffect, useMemo, useState } from "react";
import { Tooltip, useToast } from "@chakra-ui/react";
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
  Tr,
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

interface StatusLists {
  loading: boolean;
  statuses: {
    serialNumber: number;
    createdAt: string;
    StatusName: string;
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

const StatusList: React.FC = () => {
  const [selectedAdmin, setSelectedAdmin] = useState<any>("");
  const { signinuser } = useSelector(
    (state: { common: SigninUserDetails }) => state.common
  );

  const { statuses, loading } = useSelector(
    (state: { common: StatusLists; signinuser: { UserType: number } }) =>
      state.common
  );

  const istViewerOnly = signinuser?.permissionAccess?.some(
    (p) => p.name === "Status List" && p.access === "Viewer"
  );

  const filteredStatus =
    signinuser.UserType === 1 && selectedAdmin
      ? statuses
      : signinuser.UserType !== 1
        ? statuses
        : null;

  const dispatch: any = useDispatch();
  const Navigate = useNavigate();
  const endpoint: string = "status";
  const toast = useToast();
  const memoizedStatus = useMemo(() => statuses, [statuses]);

  useEffect(() => {
    if (memoizedStatus.length === 0 && signinuser.UserType !== 1) {
      dispatch(getData(endpoint));
    }
  }, [dispatch, endpoint, memoizedStatus.length, signinuser.UserType]);

  useEffect(() => {
    if (memoizedStatus.length === 0 && selectedAdmin) {
      dispatch(getDataSuperAdmin(`status?parentId=${selectedAdmin}`));
    }
  }, [dispatch, endpoint, memoizedStatus.length, selectedAdmin]);

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
          <Spacer />
          <Tooltip label={istViewerOnly ? "Not Authorized" : "Add Status"} hasArrow placement="top">
            <Button
            isDisabled={istViewerOnly}
              onClick={() => Navigate("/add-status")}
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
              {" "}
              Add Status
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
                <Th>Status Name</Th>
                <Th>Action</Th>
              </Tr>
            </Thead>
            {loading ? (
              <Loader />
            ) : (
              <Tbody>
                {filteredStatus?.map((el, i) => (
                  <Tr key={el._id}>
                    <Td>{i + 1}</Td>
                    <Td>{new Date(el.createdAt).toLocaleDateString()}</Td>
                    <Td>{el.StatusName}</Td>
                    <Td display={"flex"} alignItems={"center"}>
                      <Tooltip label={istViewerOnly ? "Not Authorized" : "Update"} hasArrow placement="top">
                        <Box
                          opacity={istViewerOnly ? 0.4 : 1}
                          cursor={istViewerOnly ? "not-allowed" : "pointer"}
                          mr={"5"}
                        >
                          <Box pointerEvents={istViewerOnly ? "none" : "auto"}>
                            <CiEdit color="blue" size={19}
                              onClick={() => Navigate(`/update-status/${el._id}`)}
                            />
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
                ))}
              </Tbody>
            )}
          </Table>
        </Box>
      </TableContainer>
    </Stack>
  );
};

export default StatusList;
