import React, { useEffect, useMemo, useState } from "react";
import {
  Stack,
  Box,
  useToast,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  InputGroup,
  InputLeftElement,
  Input,
  Spacer,
  Button,
  Divider,
} from "@chakra-ui/react";

import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getData, postData } from "../../redux/actions/common.action";
import Loader from "../../components/Loader";
import { TfiEye } from "react-icons/tfi";
import { SearchIcon } from "@chakra-ui/icons";
import { FiRefreshCcw } from "react-icons/fi";

interface Support {
  pageName: string;
  issueName: string;
}

interface imageData {
  file: any;
}
const initialImage = {
  file: null,
};

interface SupportLists {
  loading: boolean;
  supports: {
    _id: string;
    parentId: {
      companyName: string;
      Name: string;
      UserName: string;
    };
    userId: {
      Name: string;
      UserName: string;
    };
    raisedTime: string;
    ticketId: string;
    status: string;
    issueResolved: boolean;
  }[];
}

const Support: React.FC = () => {
  const [image, setImage] = useState<imageData>(initialImage);

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<Support>();

  const endpoint: string = "issue";
  const dispatch: any = useDispatch();
  const Navigate = useNavigate();
  const toast = useToast();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setImage({
      ...image,
      file, // Store the selected file in the formData
    });
  };

  const onSubmit = (formData: Support) => {
    const formDataToSend = new FormData();

    // Add form data fields to the FormData object
    formDataToSend.append("pageName", formData.pageName);
    formDataToSend.append("issueName", formData.issueName);

    // Add the image file to the FormData object
    if (image.file) {
      formDataToSend.append("image", image.file);
    }

    dispatch(postData(formDataToSend, endpoint, Navigate, toast)).then(() => {
      dispatch(getData(endpoint));
      reset();
      // Navigate("/issue");
      console.log("ok");
    });
  };

  const { supports, loading } = useSelector(
    (state: { common: SupportLists }) => state.common
  );
  const [searchTerm, setSearchTerm] = useState("");

  const memoizedSupports = useMemo(() => supports, [supports]);

  useEffect(() => {
    if (memoizedSupports.length === 0) {
      // Fetch city data when the component mounts, only if there are no cities present
      dispatch(getData(endpoint));
    }
  }, [dispatch, endpoint, memoizedSupports.length]);

  const filteredSupports = useMemo(() => {
    return supports.filter((admin) =>
      admin.ticketId.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [supports, searchTerm]);

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
      <Divider bg="gray.300" height="2px" />
      <TableContainer px="2">
        <Box overflowY="auto" height={480} maxHeight="480px">
          <Table variant="simple" size="sm">
            {/* Table Headers */}
            <Thead bg={"gray.100"} position="sticky" top="0">
              <Tr>
                <Th>#</Th>
                <Th>Ticket Id</Th>
                <Th>Company Name</Th>
                <Th>Admin Name</Th>
                <Th>Admin User Name</Th>
                <Th>User Name</Th>
                <Th>Raise Time</Th>
                <Th>Status</Th>
                <Th>Issue Resolved</Th>
                <Th>Action</Th>
              </Tr>
            </Thead>
            <Tbody>
              {/* Render city rows */}
              {loading ? (
                <Loader />
              ) : (
                filteredSupports?.map((el, i) => (
                  <Tr key={el._id}>
                    <Td>{i + 1}</Td>
                    <Td>{el.ticketId}</Td>
                    <Td>{el.parentId?.companyName || "N/A"}</Td>
                    <Td>{el.parentId?.Name || "N/A"}</Td>
                    <Td>{el.parentId?.UserName || "N/A"}</Td>
                    <Td>{el.userId?.Name || "N/A"}</Td>
                    <Td>{el.raisedTime}</Td>
                    <Td>{el.status}</Td>
                    <Td>{el.issueResolved ? "Yes" : "No"}</Td>
                    <Box
                      cursor={"pointer"}
                      mr={"5"}
                      onClick={() => Navigate(`/update-ticket/${el._id}`)}
                    >
                      <TfiEye color="blue" size={19} />
                    </Box>
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

export default Support;
