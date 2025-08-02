import React, { ChangeEvent, useEffect, useMemo, useState } from "react";
import {
  Avatar,
  Box,
  Button,
  Divider,
  Input,
  InputGroup,
  InputLeftElement,
  Spacer,
  Stack,
  Switch,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useToast,
} from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  getDataSuperAdmin,
  updateData,
  updateDataSuperAdmin,
} from "../../redux/actions/common.action";
import Loader from "../../components/Loader";
import { CiEdit } from "react-icons/ci";
import { FiRefreshCcw } from "react-icons/fi";
import { TfiEye } from "react-icons/tfi";
import { SearchIcon } from "@chakra-ui/icons";
import Pagination from "../../helpers/Pagination";

interface adminLists {
  admins: {
    image: any;
    Name: string;
    Email: string;
    Phone: number;
    UserName: string;
    Address: string;
    teamSize: number;
    UserType: number;
    companyName: string;
    webURL: string;
    validupTo: number;
    numberOfUsers: number;
    serialNumber: number;
    _id: string;
    active: boolean;
  }[];
  loading: boolean;
}

const AdminList: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(10);
  const navigate = useNavigate();
  const toast = useToast();

  const { admins, loading } = useSelector(
    (state: { common: adminLists }) => state.common
  );

  const dispatch: any = useDispatch();
  const Navigate = useNavigate();
  const endpoint: string = "";

  const filteredAdmins = useMemo(() => {
    return admins.filter((admin) =>
      admin.Name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [admins, searchTerm]);

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredAdmins.slice(indexOfFirstUser, indexOfLastUser);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  useEffect(() => {
    if (admins.length === 0) {
      dispatch(getDataSuperAdmin(endpoint));
    }
  }, [dispatch, endpoint, admins.length]);

  const handleSwitchToggle = (
    event: ChangeEvent<HTMLInputElement>,
    id: string
  ) => {
    const isChecked = event.target.checked;
    dispatch(
      updateDataSuperAdmin(
        id,
        "adminUsers",
        { active: isChecked },
        navigate,
        toast
      )
    ).then(() => dispatch(getDataSuperAdmin(endpoint)));
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
        <Box>
          <InputGroup>
            <InputLeftElement pointerEvents="none">
              <SearchIcon color="gray.400" mb="4" />
            </InputLeftElement>
            <Input
              w="400px"
              borderRadius={"0.25rem"}
              borderColor="gray.400"
              size="xs"
              type="text"
              placeholder="Search here..."
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </InputGroup>
        </Box>
        <Spacer />
        <Button
          onClick={() => Navigate("/addnewadmin")}
          size={"sm"}
          _hover={{ bg: "#FF9000" }}
          w="7.188rem"
          bg="#FF9000"
          mt={2}
          borderRadius={"0.25rem"}
          color="whiteAlpha.900"
          fontWeight={"700"}
          fontSize={"1rem"}
        >
          Add Admin
        </Button>
        <Box mt="2" ml="3">
          <Button
            size={"xs"}
            borderRadius={"full"}
            onClick={() => dispatch(getDataSuperAdmin(endpoint))}
          >
            <FiRefreshCcw />
          </Button>
        </Box>
      </Box>
      <Divider bg="gray.300" height="2px" />

      <TableContainer px="2">
        <Box overflowY="auto" height={480} maxHeight="480px">
          <Table variant="simple" size="sm">
            <Thead bg={"gray.100"}>
              <Tr>
                <Th>Photo</Th>
                <Th>Name</Th>
                <Th>Username</Th>
                <Th>Phone No.</Th>
                <Th>Email-ID</Th>
                <Th>Team Size</Th>
                <Th>Company Name</Th>
                <Th>Number Of Users</Th>
                <Th>Action</Th>
              </Tr>
            </Thead>
            {loading ? (
              <Loader />
            ) : (
              <Tbody>
                {currentUsers.map((el) => (
                  <Tr key={el._id}>
                    <Td>
                      <Avatar
                        size="sm"
                        bg="blue.500"
                        color="whiteAlpha.900"
                        name={el.Name}
                        src={el.image}
                      />
                    </Td>
                    <Td>{el.Name}</Td>
                    <Td>{el.UserName}</Td>
                    <Td>{el.Phone}</Td>
                    <Td>{el.Email}</Td>
                    <Td>{el.teamSize}</Td>
                    <Td>{el.companyName}</Td>
                    <Td>{el.numberOfUsers}</Td>
                    <Td display={"flex"} alignItems={"center"}>
                      <Box cursor={"pointer"} mr="3">
                        <Switch
                          isChecked={el.active}
                          size="sm"
                          onChange={(event) =>
                            handleSwitchToggle(event, el._id)
                          }
                        />
                      </Box>
                      <Box
                        cursor={"pointer"}
                        mr={"5"}
                        onClick={() => Navigate(`/update-admin/${el._id}`)}
                      >
                        <CiEdit color="blue" size={19} />
                      </Box>
                      <Box
                        cursor={"pointer"}
                        mr={"5"}
                        onClick={() => Navigate(`/admin-details/${el._id}`)}
                      >
                        <TfiEye color="blue" size={19} />
                      </Box>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            )}
          </Table>
        </Box>
      </TableContainer>
      <div>
        {filteredAdmins.length > usersPerPage && (
          <Pagination
            usersPerPage={usersPerPage}
            totalUsers={filteredAdmins.length}
            paginate={paginate}
            currentPage={currentPage} // Add this line
          />
        )}
      </div>
    </Stack>
  );
};

export default AdminList;
