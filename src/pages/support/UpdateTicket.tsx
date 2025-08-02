import {
  Box,
  Button,
  Checkbox,
  Divider,
  Flex,
  Grid,
  GridItem,
  Image,
  Spacer,
  Stack,
  Text,
  useToast,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import {
  getData,
  getDataById,
  getDataByIdSuperAdmin,
  updateData,
} from "../../redux/actions/common.action";
import { FiRefreshCcw } from "react-icons/fi";

interface TicketDetails {
  support: {
    success: boolean;
    Data: {
      _id: string;
      parentId: {
        _id: string;
        companyName: string;
        Name: string;
        UserName: string;
      };
      userId: {
        _id: string;
        Name: string;
        UserName: string;
      };
      raisedTime: string;
      ticketId: string;
      status: string;
      pageName: string;
      issueName: string;
      image: string;
      issueResolved: boolean;
      createdAt: string;
      updatedAt: string;
      __v: number;
    };
  };
}

const UpdateTicket: React.FC = () => {
  // Retrieve the details of the signed-in user from the Redux store
  //   const { signinuser } = useSelector(
  //     (state: { common: SigninUserDetails }) => state.common
  //   );

  // Accessing necessary hooks, variables, and parameters
  const { id } = useParams();

  const { support } = useSelector(
    (state: { common: TicketDetails }) => state.common
  );

  // Accessing the Redux dispatch function
  const dispatch: any = useDispatch();

  const Navigate = useNavigate();
  const toast = useToast();

  // Setting the endpoint for API requests
  const endpoint: string = "issue";

  // useEffect hook to fetch data when 'id' changes
  useEffect(() => {
    dispatch(getDataById(id, endpoint));
  }, [id]);

  const [status, setStatus] = useState<string>(support?.Data?.status);
  const [issueResolved, setIssueResolved] = useState<boolean | undefined>(
    support?.Data?.issueResolved
  );
  const [remark, setRemark] = useState<string>("");

  const payload = {
    status: status,
    issueResolved: issueResolved,
    remarks: remark,
  };

  console.log(payload);

  const handleChange = (type: string, value: string | boolean) => {
    // Update the state based on the type (status or issueResolved)
    if (type === "status") {
      setStatus(value as string);
    } else if (type === "issueResolved") {
      setIssueResolved(value as boolean);
    }
  };

  // Handling form submission
  const onSubmit = () => {
    dispatch(updateData(id, endpoint, payload, Navigate, toast)).then(() =>
      dispatch(getData(endpoint))
    );
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
        <Text color={"#000000"} fontSize={"1.25rem"} fontWeight={"600"}>
          Ticket Details
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
        p={1}
      >
        <GridItem rowSpan={4} colSpan={3} m={"auto"}>
          <Image
            boxSize="150px"
            width={"600px"}
            height={"240px"}
            src={support?.Data?.image}
            alt={support?.Data?.image}
          />
        </GridItem>

        <GridItem colSpan={1}>
          <Flex flexDir={"column"}>
            <Text color={"gray.800"} fontWeight={600}>
              Ticket Id
            </Text>
            <Text fontSize={"sm"}>{support?.Data?.ticketId}</Text>
          </Flex>
        </GridItem>
        <GridItem colSpan={1}>
          <Flex flexDir={"column"}>
            <Text color={"gray.800"} fontWeight={600}>
              Company Name
            </Text>
            {support?.Data?.parentId.companyName}
          </Flex>
        </GridItem>
        <GridItem colSpan={1}>
          <Flex flexDir={"column"}>
            <Text color={"gray.800"} fontWeight={600}>
              Admin Name
            </Text>
            {support?.Data?.parentId.Name}
          </Flex>
        </GridItem>
        <GridItem colSpan={1}>
          <Flex flexDir={"column"}>
            <Text color={"gray.800"} fontWeight={600}>
              Admin User Name
            </Text>
            {support?.Data?.parentId.UserName}
          </Flex>
        </GridItem>
        <GridItem colSpan={1}>
          <Flex flexDir={"column"}>
            <Text color={"gray.800"} fontWeight={600}>
              User Name
            </Text>
            {support?.Data?.userId.Name}
          </Flex>
        </GridItem>
        <GridItem colSpan={1}>
          <Flex flexDir={"column"}>
            <Text color={"gray.800"} fontWeight={600}>
              Raise Time
            </Text>
            {support?.Data?.raisedTime}
          </Flex>
        </GridItem>
        <GridItem colSpan={1}>
          <Flex flexDir={"column"}>
            <Text color={"gray.800"} fontWeight={600}>
              Status
            </Text>
            <Flex justifyContent="start" alignItems="center">
              <Checkbox
                type="radio"
                id="active"
                value={"Completed"}
                name="status"
                mx={2}
                isChecked={status === "Completed"}
                onChange={() => handleChange("status", "Completed")}
              >
                <Text>Completed</Text>
              </Checkbox>
              <Checkbox
                type="radio"
                id="inactive"
                value={"Pending"}
                name="status"
                isChecked={status === "Pending"}
                onChange={() => handleChange("status", "Pending")}
              >
                <Text>Pending</Text>
              </Checkbox>
            </Flex>
          </Flex>
        </GridItem>
        <GridItem colSpan={1}>
          <Flex flexDir={"column"}>
            <Text color={"gray.800"} fontWeight={600}>
              Issue Resolved
            </Text>
            <Flex justifyContent="start" alignItems="center">
              <Checkbox
                type="radio"
                id="active"
                value={"true"}
                name="issueResolved"
                mx={2}
                isChecked={issueResolved === true}
                onChange={() => handleChange("issueResolved", true)}
              >
                <Text>Yes</Text>
              </Checkbox>
              <Checkbox
                type="radio"
                id="inactive"
                value={"false"}
                name="issueResolved"
                isChecked={issueResolved === false}
                onChange={() => handleChange("issueResolved", false)}
              >
                <Text>No</Text>
              </Checkbox>
            </Flex>
          </Flex>
        </GridItem>
        <GridItem colSpan={1}>
          <Flex flexDir={"column"}>
            <Text color={"gray.800"} fontWeight={600}>
              Page Name
            </Text>
            {support?.Data?.pageName}
          </Flex>
        </GridItem>
        <GridItem colSpan={2}>
          <Flex flexDir={"column"}>
            <Text color={"gray.800"} fontWeight={600}>
              Issue Description
            </Text>
            {support?.Data?.issueName}
          </Flex>
        </GridItem>
        <GridItem colSpan={1}>
          <Flex flexDir={"column"}>
            <Text color={"gray.800"} fontWeight={600}>
              Remark
            </Text>
            <textarea
              placeholder="Enter Remark "
              onChange={(e) => setRemark(e.target.value)}
              style={{
                width: "100%",
                backgroundColor: "white",
                color: "black",
                fontFamily: "sans-serif",
                fontSize: "15px",
                borderRadius: "4px",
                padding: "2px",
                border: "1px solid #a0aec0",
                height: "32px",
                minHeight: "32px",
              }}
            />
          </Flex>
        </GridItem>
      </Grid>

      <Box display={"flex"} justifyContent={"flex-end"} alignItems={"center"}>
        <Button
          size={"sm"}
          mx={6}
          _hover={{ bg: "#FF9000" }}
          w="8.188rem"
          bg="#FF9000"
          borderRadius={"0.25rem"}
          color="whiteAlpha.900"
          fontWeight={"700"}
          fontSize={"1rem"}
          onClick={onSubmit}
        >
          Update Ticket
        </Button>
      </Box>
    </Stack>
  );
};

export default UpdateTicket;
