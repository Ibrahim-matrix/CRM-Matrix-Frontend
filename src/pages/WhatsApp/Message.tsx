import React, { useEffect, useMemo } from "react";
import {
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
interface WhatsAppMessage {
  loading: boolean;
  whatsapps: {
    title: string;
    content: string;
    active: string;
    _id: number;
  }[];
}

const MessageList: React.FC = () => {
  const { whatsapps, loading } = useSelector(
    (state: { common: WhatsAppMessage }) => state.common
  );
  const dispatch: any = useDispatch();
  const Navigate = useNavigate();
  const endpoint: string = "template";
  const toast = useToast();

  const memoizedMessage = useMemo(() => whatsapps, [whatsapps]);

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
          onClick={() => Navigate("/add-message")}
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
                whatsapps?.map((el : any , i : number) => (
                  <Tr key={i}>
                    <Td>{i + 1}</Td>
                    <Td>{el.title}</Td>
                    <Td>{el.content}</Td>
                    <Td><Box cursor={"pointer"} mr="3">
                        <Switch
                          isChecked={true}
                          size="sm"
                          // onChange={(event) =>
                          //   handleToggle(event, el._id)
                          // }
                        />
                      </Box></Td>
                    <Td display={"flex"} alignItems={"center"}>
                      <Box
                        cursor={"pointer"}
                        mr={"5"}
                        onClick={() => Navigate(`/update-template/${el._id}`)}
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
