import React, { useEffect, useMemo } from "react";
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
  useToast,
} from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { deleteData, getData } from "../../redux/actions/common.action";
import AlertDialogDelete from "../../components/AlertDialouge";
import { CiEdit } from "react-icons/ci";
import Loader from "../../components/Loader";
import { FiRefreshCcw } from "react-icons/fi";

// Interface for city lists
interface MessageList {
  loading: boolean;
  message: {
    serialNumber: number;
    createdAt: string;
    CityName: string;
    _id: number;
  }[];
}

const MessageList: React.FC = () => {
  const { message, loading } = useSelector(
    (state: { common: MessageList }) => state.common
  );
  const dispatch: any = useDispatch();
  const Navigate = useNavigate();
  const endpoint: string = "city";
  const toast = useToast();

  const memoizedMessage = useMemo(() => message, [message]);

  useEffect(() => {
    if (memoizedMessage?.length === 0) {
      // Fetch city data when the component mounts, only if there are no cities present
      dispatch(getData(endpoint));
    }
  }, [dispatch, endpoint, memoizedMessage?.length]);

  const handleDelete = async (id: number) => {
    // Handle the delete operation for a city by dispatching the deleteData action and fetching updated city data
    await dispatch(deleteData(id, endpoint, toast));
    dispatch(getData(endpoint));
  };

  return (
    <Stack h="100%" mt={1}>
      {/* City List Header */}
      <Box
        px={10}
        h="40px"
        display={"flex"}
        justifyContent={"space-between"}
        alignItems={"center"}
      >
        <Spacer />
        <Button
          onClick={() => Navigate("/add-document")}
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
          Add Template
        </Button>
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
      {/* Divider */}
      <Divider bg="gray.300" height="2px" />
      {/* City List Table */}
      <TableContainer px="2">
        <Box overflowY="auto" height={480} maxHeight="480px">
          <Table variant="simple" size="sm">
            {/* Table Headers */}
            <Thead bg={"gray.100"} position="sticky" top="0">
              <Tr>
                <Th>#</Th>
                <Th>Title</Th>
                <Th>Message</Th>
                <Th>Status</Th>
                <Th>Action</Th>
              </Tr>
            </Thead>
            <Tbody>
              {/* Render city rows */}
              {loading ? (
                <Loader />
              ) : (
                message?.map((el, i) => (
                  <Tr key={el._id}>
                    <Td>{i + 1}</Td>
                    <Td>{new Date(el.createdAt).toLocaleDateString()}</Td>
                    <Td>{el.CityName}</Td>
                    <Td display={"flex"} alignItems={"center"}>
                      <Box
                        cursor={"pointer"}
                        mr={"5"}
                        onClick={() => Navigate(`/update-city/${el._id}`)}
                      >
                        <CiEdit color="blue" size={19} />
                      </Box>
                      <Box cursor={"pointer"}>
                        <AlertDialogDelete
                          id={el._id}
                          handleDelete={handleDelete}
                        />
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

export default MessageList;
