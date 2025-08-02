// ProposalListPage.tsx
import {
  Box,
  Flex,
  Input,
  Text,
  Select,
  Avatar,
  VStack,
  Button,
  useColorModeValue,
  SimpleGrid,
  GridItem,
  Badge,
  Menu,
  MenuButton,
  IconButton,
  MenuList,
  MenuItem,
  HStack,
  Circle,
} from "@chakra-ui/react";
import { SearchIcon } from "@chakra-ui/icons";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getData, getDataById } from "../../redux/actions/common.action";
import {
  FiCheckCircle,
  FiEdit,
  FiEye,
  FiMoreVertical,
  FiSend,
  FiXCircle,
} from "react-icons/fi";
import ProposalCardSkeleton from "./components/ProposalCardSkeleton ";

interface ProposalList {
  proposals: {
    name: string;
    total: number;
    validTillDate: Date;
    proposalName: string;
    items: {
      productId: string;
      quantity: 1;
    }[];
    createdBY: {
      name: string;
      userId: string;
    };
  }[];

  courses: {
    CourseName: string;
  }[];
  users: {
    Name: string;
  }[];
  proposal: {};
  loading: boolean;
}

export default function ProposalList() {
  const { proposals, courses, users, proposal, loading } = useSelector(
    (state: { common: ProposalList }) => state.common
  );

  console.log(proposal);

  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const cardBg = useColorModeValue("white", "gray.700");

  const dispatch: any = useDispatch();

  useEffect(() => {
    dispatch(getData("proposal"));
    dispatch(getData("course"));
    dispatch(getData("user"));
  }, []);

  const getDaysLeft = (date: string | Date) => {
    const msDiff = new Date(date).getTime() - new Date().getTime();
    return Math.max(0, Math.ceil(msDiff / (1000 * 60 * 60 * 24)));
  };

  const handleSend = (id: string) => {
    navigate("/proposal-view?proposalId=" + id + "&sendId=" + id);
  };

  const handleView = (id: string) => {
    navigate("/proposal-view?proposalId=" + id);
  };

  const handleEdit = (id: string) => {
    navigate("/proposal?proposalId=" + id);
  };

  const markAsSent = (proposal: any) => {
    console.log("Marked as sent", proposal);
    // Update status in DB
  };

  const cancelProposal = (proposal: any) => {
    console.log("Cancelled proposal", proposal);
    // Update status in DB or remove it
  };

  // Count total and paid EMIs
  const emiPercentages = [
    { percentage: 10, isPaid: true },
    { percentage: 30, isPaid: true },
    { percentage: 20, isPaid: false },
    { percentage: 40, isPaid: false },
  ];

  const totalEmis = emiPercentages.length;
  const paidEmis = emiPercentages.filter((emi) => emi.isPaid).length;
  const paidPercentage = emiPercentages.reduce((acc, emi) => {
    return acc + (emi.isPaid ? emi.percentage : 0);
  }, 0);

  const emiSteps = [
    { label: "First", isPaid: true },
    { label: "Second", isPaid: true },
    { label: "Third", isPaid: false },
    { label: "Forth", isPaid: false },
  ];

  return (
    <Flex direction="column" p={6} w="full">
      {/* Top Filter Bar */}
      <SimpleGrid columns={{ md: 3, lg: 5 }} mb={4} gap={3}>
        <GridItem colSpan={2}>
          <Input
            placeholder="Search Documents"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            //   leftIcon={<SearchIcon />}
          />
        </GridItem>
        <Select placeholder="All users" />
        {/* <Select placeholder="Create Date - New" maxW="200px" /> */}
        {/* <Select placeholder="25" maxW="100px" /> */}
        <Button colorScheme="green" onClick={() => navigate("/proposal")}>
          + CREATE PROPOSAL
        </Button>
        <Button
          colorScheme="green"
          onClick={() => navigate("/proposal-greeting")}
        >
          + CREATE GREETING TEMPLATE
        </Button>
      </SimpleGrid>

      {/* Proposal Cards */}
      <VStack spacing={4} align="stretch">
        {loading ? (
          <ProposalCardSkeleton />
        ) : proposals?.length === 0 ? (
          // No proposals case
          <Box textAlign="center" py={10} px={6}>
            <Box fontSize="2xl" fontWeight="bold" color="gray.600">
              No proposals added yet.
            </Box>
          </Box>
        ) : (
          proposals?.map((proposal: any) => (
            <VStack
              alignItems={"stretch"}
              key={proposal._id}
              bg={cardBg}
              p={4}
              rounded="2xl"
              border="1px solid"
              borderColor="gray.200"
              boxShadow="sm"
              _hover={{ boxShadow: "md", borderColor: "gray.300" }}
              transition={"all 0.2s"}
            >
              <Flex>
                {/* Left Side: Days & Status */}
                <Flex
                  direction="column"
                  align="center"
                  justify="center"
                  bg="gray.50"
                  px={4}
                  py={3}
                  borderRadius="xl"
                  minW="100px"
                  textAlign="center"
                  mr={4}
                  position="relative"
                  overflow="visible" // <-- important
                >
                  {/* Show 'Run Out of Time' badge if date is past */}
                  {new Date(proposal?.validTillDate) < new Date() && (
                    <Badge
                      colorScheme="red"
                      fontSize="0.7rem"
                      variant="solid"
                      position="absolute"
                      top="-12px"
                    >
                      Run Out of Time
                    </Badge>
                  )}
                  <Text fontSize="lg" fontWeight="bold" color="gray.700">
                    {getDaysLeft(proposal?.validTillDate)}
                  </Text>
                  <Text fontSize="sm" color="gray.500">
                    Days Left
                  </Text>

                  <Badge
                    mt={2}
                    colorScheme={
                      proposal?.status === "NOT SENT" ||
                      proposal?.status === "DECLINED"
                        ? "red"
                        : proposal?.status === "SENT PENDING"
                        ? "facebook"
                        : proposal?.status === "ACCEPTED"
                        ? "green"
                        : "red"
                    }
                    variant="solid"
                    fontSize="0.75rem"
                  >
                    {proposal?.status}
                  </Badge>
                </Flex>

                {/* Right Section */}
                <Flex
                  flex="1"
                  direction="row"
                  justify="space-between"
                  align="center"
                  flexWrap="wrap"
                  w="100%"
                >
                  {/* Proposal Info */}
                  <Box flex="1">
                    <Text fontSize="lg" fontWeight="bold">
                      {proposal?.proposalName}
                    </Text>

                    <Flex flexDirection={"column"}>
                      <Flex alignItems={"center"}>
                        <Text
                          fontSize="sm"
                          color="gray.600"
                          mt={1}
                          noOfLines={1}
                          mr={2}
                        >
                          Name: {proposal?.name}
                        </Text>
                      </Flex>
                      <Text fontSize="sm" color="gray.600" mt={1} noOfLines={1}>
                        Products:{" "}
                        {proposal.items
                          ?.map(
                            (item: any) =>
                              courses?.find(
                                (product: any) =>
                                  product?._id === item?.productId
                              )?.CourseName
                          )
                          .join(", ")}
                      </Text>
                    </Flex>
                  </Box>

                  {/* emi options*/}
                  <Flex w="25%" alignItems="center" justify="center">
                    {proposal?.emiSteps?.map((step: any, index: any) => {
                      const isFirst = index === 0;

                      return (
                        <Flex
                          key={index}
                          flex="1"
                          position="relative"
                          justifyContent={"center"}
                        >
                          {/* Circle & Label */}
                          <Flex direction="column" align="center">
                            {/* Connector line */}
                            {!isFirst && (
                              <Box
                                position="absolute"
                                top="12px" // Half of the circle (24px / 2)
                                left="-50%" // center of circle
                                width="100%" // full width of the flex
                                transform="translateX(12px)" // push the start to the right edge of circle
                                height="2px"
                                bg={
                                  emiSteps[index + 1]?.isPaid
                                    ? "green.500"
                                    : step.isPaid
                                    ? "green.500"
                                    : "gray.300"
                                }
                                zIndex={0}
                              />
                            )}
                            <Circle
                              size="24px"
                              bg={step.isPaid ? "green.500" : "gray.300"}
                              color="white"
                              fontSize="xs"
                              position={"relative"}
                              zIndex={2}
                            >
                              {index + 1}
                            </Circle>
                            <Text
                              fontSize="xs"
                              mt={1}
                              color={step.isPaid ? "black" : "gray.500"}
                            >
                              {step.label}
                            </Text>
                          </Flex>
                        </Flex>
                      );
                    })}
                  </Flex>

                  {/* Price and User Info */}
                  <Flex
                    direction="column"
                    align="flex-end"
                    justify="space-between"
                  >
                    <Flex align="center" gap={3}>
                      <Avatar
                        bg="blue.500"
                        name={proposal.name}
                        size="sm"
                        color="white"
                      />
                      <Text fontWeight="bold" fontSize="lg">
                        ₹{proposal.total}
                      </Text>
                      {/* Three-dot menu */}
                      <Menu>
                        <MenuButton
                          as={IconButton}
                          aria-label="Options"
                          icon={<FiMoreVertical />}
                          variant="ghost"
                          size="sm"
                        />
                        <MenuList>
                          <MenuItem
                            icon={<FiEye />}
                            onClick={() => handleView(proposal?._id)}
                          >
                            View
                          </MenuItem>
                          <MenuItem
                            icon={<FiEdit />}
                            onClick={() => handleEdit(proposal?._id)}
                          >
                            Edit
                          </MenuItem>
                          <MenuItem
                            icon={<FiSend />}
                            onClick={() => handleSend(proposal?._id)}
                          >
                            Send
                          </MenuItem>
                          <MenuItem
                            icon={<FiCheckCircle />}
                            onClick={() => markAsSent(proposal)}
                          >
                            Mark as Sent
                          </MenuItem>
                          <MenuItem
                            icon={<FiXCircle />}
                            color="red.500"
                            onClick={() => cancelProposal(proposal)}
                          >
                            Cancel Proposal
                          </MenuItem>
                        </MenuList>
                      </Menu>
                    </Flex>

                    {/* Created Info */}
                    <Flex
                      fontSize="xs"
                      color="gray.500"
                      gap={2}
                      mt={2}
                      align="flex-end"
                    >
                      <Text>
                        Created By{" "}
                        {users?.find(
                          (u: any) => u?._id === proposal?.createdBY?.userId
                        )?.Name || proposal?.createdBY?.name}
                      </Text>
                      <Text>
                        At:{" "}
                        {new Date(proposal.createdAt).toLocaleString("en-IN", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                          hour12: true,
                        })}
                      </Text>
                    </Flex>
                    <Text fontSize="xs" color="gray.500">
                      Vlid Till{" "}
                      {new Date(proposal?.validTillDate).toLocaleString(
                        "en-IN",
                        {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        }
                      )}
                    </Text>
                  </Flex>
                </Flex>
              </Flex>
            </VStack>
          ))
        )}
      </VStack>
    </Flex>
  );
}
