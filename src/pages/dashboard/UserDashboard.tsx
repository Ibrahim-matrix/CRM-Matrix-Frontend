import {
  Box,
  Button,
  Flex,
  HStack,
  Image,
  Input,
  InputGroup,
  InputLeftElement,
  SimpleGrid,
  Skeleton,
  Spacer,
  Stack,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";

import totalleads from "../../icons/totalleads.svg";
import openleads from "../../icons/openleads.svg";
import finalleads from "../../icons/finalleads.svg";
import hotleads from "../../icons/hotleads.svg";
import unsubscribe from "../../icons/unsubscribe.svg";
import wronglead from "../../icons/wronglead.svg";
import enrolled from "../../icons/enrolled.svg";

import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getData, getDataById } from "../../redux/actions/common.action";
import Loader from "../../components/Loader";
import { SearchIcon } from "@chakra-ui/icons";
import axios from "axios";

import { BASE_URL } from "../../config/RequestMethod";
import { TfiEye } from "react-icons/tfi";
import Cookies from "js-cookie";

import iconBadge from "../../icons/icons8-badge.png"
import iconCancelOne from "../../icons/icons8-cancel-1.png"
import iconCancel from "../../icons/icons8-cancel.png"
import iconCheck from "../../icons/icons8-check.png"
import iconChili from "../../icons/icons8-chili-pepper.png"
import iconClosed from "../../icons/icons8-closed.png"
import iconDoor from "../../icons/icons8-door.png"
import iconFinish from "../../icons/icons8-finish.png"
import iconHot from "../../icons/icons8-hot.png"
import iconLast from "../../icons/icons8-last.png"
import iconLock from "../../icons/icons8-lock.png"
import iconMedal from "../../icons/icons8-medal.png"
import iconOpen from "../../icons/icons8-open.png"
import iconPlay from "../../icons/icons8-play.png"
import iconPurchasedOne from "../../icons/icons8-purchase-1.png"
import iconPurchased from "../../icons/icons8-purchase.png"
import iconStartOne from "../../icons/icons8-start-1.png"
import iconStart from "../../icons/icons8-start.png"
import icontrophy from "../../icons/icons8-trophy.png"
import iconUnlock from "../../icons/icons8-unlock.png"
import TodoList from "./Todo/TodoList";

const UserDashboard = () => {
  const { leadscount, signinuser, user, loading } = useSelector((state: any) => state.common);

  console.log(signinuser)
  console.log(user)

  useEffect(() => {
    if (!signinuser?.userId) return
    dispatch(getDataById(signinuser?.userId, 'user'));
  }, [signinuser]);
  // console.log(user)

  console.log(
    leadscount && leadscount[0]?.totalLeads,
    "userdash",
    leadscount?.enrolledPrice
  );
  const leadsData = [
    {
      icons: totalleads,
      name: "Total Leads",
      amount: leadscount && leadscount?.totalPrice,
      numofLeads: leadscount && leadscount?.totalLeads,
      color: "#37AE00",
    },
    {
      icons: openleads,
      name: "Open Leads",
      amount: leadscount && leadscount?.openPrice,
      numofLeads: leadscount && leadscount?.openLeads,
      color: "#E27A00",
    },
    {
      icons: finalleads,
      name: "Final Leads",
      amount: leadscount && leadscount?.finalPrice,
      numofLeads: leadscount && leadscount?.finalLeads,
      color: "#1243A0",
    },
    {
      icons: hotleads,
      name: "Hot Leads",
      amount: leadscount && leadscount?.hotPrice,
      numofLeads: leadscount && leadscount?.hotLeads,
      color: "#5B5B60",
    },
    {
      icons: unsubscribe,
      name: "Unsubscribed",
      amount: leadscount && leadscount?.unsubscribePrice,
      numofLeads: 0,
      color: "#FFBF00",
    },
    {
      icons: wronglead,
      name: "Wrong Leads",
      amount: leadscount && leadscount?.wrongPrice,
      numofLeads: leadscount && leadscount?.wrongLeads,
      color: "#FF0000",
    },
    {
      icons: enrolled,
      name: "Enrolled",
      amount: leadscount && leadscount?.enrolledPrice,
      numofLeads: leadscount && leadscount?.enrolledLeads,
      color: "#8580C2",
    },
  ];

  const colors = [{
    color: "#37AE00",
  },
  {
    color: "#E27A00"
  },]

  const dispatch: any = useDispatch();
  useEffect(() => {
    dispatch(getData("dashboard/leads-count"));
  }, [dispatch]);

  const [filteredData, setFilteredData] = useState([]);
  console.log(filteredData)
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [search, setSearch] = useState<string>("");
  const [limit, setLimit] = useState<number>(20);
  //  console.log(filteredData,"ok")

  const url = `${BASE_URL}lead/follow-up-leads`;

  const handleFilterSubmit = async (): Promise<void> => {
    console.log('start')
    try {
      setIsLoading(true);
      const token = Cookies.get("token"); // Get the token from the cookie

      const res = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`, // Pass the token in the headers
        },
      });

      console.log(res?.data?.Data)

      // if (user?.UserProfile === 'Manager') {
      //   console.log('=============================================================')
      //   // const managerData = res?.data?.Data?.filter((u: any) => u?.BranchInfo[0]?.BranchName === user?.Branch[0]);
      //   // console.log(user?.Branch)
      //   setFilteredData(res?.data?.Data);

      // } else if (user?.UserProfile === 'User') {
      //   const currentUserData = res?.data?.Data?.filter((user: any) => user?.AssignInfo[0]?._id === signinuser?.userId)
      //   console.log('============================================+++++++++++++++++++++++', currentUserData)
      //   setFilteredData(currentUserData);
      // }
      setFilteredData(res?.data?.Data);
      setTotalPages(res.data.totalPages);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.error(error);
    }
  };

  useEffect(() => {
    handleFilterSubmit();
  }, [page, limit]);
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
  };
  const handlePageChange = (pageNumber: number) => {
    if (pageNumber < 1 || pageNumber > totalPages) {
      return;
    }
    setPage(pageNumber);
  };

  const charToIconMap: { [key: string]: string } = {
    'a': totalleads,
    'b': openleads,
    'c': unsubscribe,
    'd': hotleads,
    'e': unsubscribe,
    'f': finalleads,
    'g': enrolled,
    'h': totalleads,
    'i': openleads,
    'j': finalleads,
    'k': hotleads,
    'l': unsubscribe,
    'm': wronglead,
    'n': enrolled,
    'o': openleads,
    'p': openleads,
    'q': finalleads,
    'r': hotleads,
    's': unsubscribe,
    't': totalleads,
    'u': enrolled,
    'v': totalleads,
    'w': openleads,
    'x': finalleads,
    'y': hotleads,
    'z': unsubscribe,
  };

  const lightColors: { [key: string]: string } = {
    "a": "#FFB3BA", // light red
    "b": "#FFDFBA", // light orange
    "c": "#E0BBE4", // soft violet
    "d": "#BAFFC9", // light mint green
    "e": "#BAE1FF", // light blue
    "f": "#D5BAFF", // light purple
    "g": "#C6F1E7", // light teal
    "h": "#F0E68C", // khaki yellow-green
    "i": "#FFFFBA", // light yellow
    "j": "#B5EAD7", // mint aqua
    "k": "#FFDAC1", // peach (distinct from red/pink)
    "l": "#C1C8E4", // periwinkle
    "m": "#FFABAB", // watermelon pink (not same as "a")
    "n": "#E6E6FA", // lavender (unique, floral tone)
    "o": "#AED9E0", // ice blue
    "p": "#FFFACD", // lemon chiffon
    "q": "#F4C2C2", // baby pink (pale, but not coral)
    "r": "#E0FFFF", // pale cyan
    "s": "#F5DEB3", // wheat (brownish tone)
    "t": "#E6FFB3", // lime tint
    "u": "#D8BFD8", // thistle (soft magenta violet)
    "v": "#D3FFCE", // light pastel green
    "w": "#ADD8E6", // light blue-gray
    "x": "#FFE4E1", // misty rose (unique soft red)
    "y": "#AFEEEE", // pale turquoise
    "z": "#F0FFF0"  // honeydew (pastel green off-white)
  };

  const iconsArray = [
    { name: "Badge", value: iconBadge, local: "iconBadge" },
    { name: "Cancel", value: iconCancel, local: "iconCancel" },
    { name: "CancelOne", value: iconCancelOne, local: "iconCancelOne" },
    { name: "Check", value: iconCheck, local: "iconCheck" },
    { name: "Chili", value: iconChili, local: "iconChili" },
    { name: "Closed", value: iconClosed, local: "iconClosed" },
    { name: "Door", value: iconDoor, local: "iconDoor" },
    { name: "Finish", value: iconFinish, local: "iconFinish" },
    { name: "Hot", value: iconHot, local: "iconHot" },
    { name: "Last", value: iconLast, local: "iconLast" },
    { name: "Lock", value: iconLock, local: "iconLock" },
    { name: "Medal", value: iconMedal, local: "iconMedal" },
    { name: "Open", value: iconOpen, local: "iconOpen" },
    { name: "Play", value: iconPlay, local: "iconPlay" },
    { name: "Purchased", value: iconPurchased, local: "iconPurchased" },
    { name: "PurchasedOne", value: iconPurchasedOne, local: "iconPurchasedOne" },
    { name: "Start", value: iconStart, local: "iconStart" },
    { name: "StartOne", value: iconStartOne, local: "iconStartOne" },
    { name: "Unlock", value: iconUnlock, local: "iconUnlock" },
    { name: "trophy", value: icontrophy, local: "icontrophy" },
  ];


  return (
    <Stack>
      {(loading || leadscount?.length === 0) ? <SimpleGrid columns={{ sm: 1, md: 3, lg: 5 }} gap="0.5rem">
        {Array.from({ length: 9 }).map((_, i) => (
          <Box key={i} borderWidth="1px" borderRadius="md" boxShadow="sm">
            <Skeleton
              h="3.7rem"
              px="4"
              py="1"
              borderRadius={"1.1rem"}
              variant="pulse"
            />
          </Box>
        ))}
      </SimpleGrid> : <SimpleGrid columns={{ sm: 1, md: 3, lg: 5 }} gap="0.5rem">

        {leadscount?.map((el: any, i: any) => {

          const iconName = el.name.toLowerCase().charAt(0);
          const iconPath = charToIconMap[iconName] || totalleads;
          const bgColor = lightColors[iconName] || "#F8F8FF"

          return (
            <Box
              // w="19.188rem"
              h="3.7rem"
              px="4"
              py="1"
              borderRadius={"1.1rem"}
              bg={el?.color ? el?.color : bgColor}
            >
              <HStack>
                <Box>
                  <Text
                    fontSize={"0.9rem"}
                    padding={1}
                    // ml="1.125rem"
                    fontWeight={"800"}
                  // color={"#37AE00"}
                  >
                    ₹ {el?.price}
                  </Text>
                  <Text
                    fontSize={"0.95rem"}
                    // mt={"0.4rem"}
                    // ml="1.125rem"
                    fontWeight={600}
                  >
                    {el?.name}{" "}
                    <span style={{ fontWeight: "400", marginTop: "8px" }}>
                      {el?.count}
                    </span>{" "}
                  </Text>
                </Box>
                <Spacer />
                <Box mt="0">
                  <Image
                    mt={"0"}
                    borderRadius="full"
                    boxSize="40px"
                    src={el?.icon ? iconsArray?.find((i: any) => i?.local === el?.icon)?.value : iconPath}
                    alt="error Icons"
                  />
                </Box>
              </HStack>
            </Box>
          )
        })}
      </SimpleGrid>}

      <Stack py="1" bg="whiteAlpha.900" borderRadius={"0.25rem"}>
        <Box
          px="4"
          display={"flex"}
          justifyContent={"space-between"}
          alignItems={"center"}
        >
          <Flex w="100%" textAlign={"center"}>
            <Text mr="2" mt="0.5" fontWeight={700} fontSize={"1rem"}>
              Today’s Follow Up - {filteredData?.length}
            </Text>
          </Flex>
          <Box>
            <InputGroup>
              <InputLeftElement pointerEvents="none">
                <SearchIcon color="gray.400" mb="4" />
              </InputLeftElement>
              <Input
                value={search}
                onChange={handleSearchChange}
                borderRadius={"0.25rem"}
                borderColor="gray.400"
                size="xs"
                type="text"
                placeholder="Search here..."
              />
            </InputGroup>
          </Box>
        </Box>
        <Box overflowX="auto" className="shrinkable-table">
          <TableContainer className="tarun" whiteSpace={"nowrap"}>
            <Box overflowY="auto" height={350} maxHeight="350px">
              <Table colorScheme="gray" size="sm">
                <Thead
                  bg={"blue.600"}
                  color={"whiteAlpha.900"}
                  position={"sticky"}
                  borderRadius={"20px"}
                  top="0"
                >
                  <Tr>
                    <Th
                      padding={2}
                      w={15}
                      fontSize={"0.65rem"}
                      color={"whiteAlpha.900"}
                    >
                      UID
                    </Th>
                    <Th
                      padding={2}
                      w={15}
                      fontSize={"0.65rem"}
                      color={"whiteAlpha.900"}
                    >
                      Ass To
                    </Th>
                    <Th
                      padding={2}
                      w={15}
                      fontSize={"0.65rem"}
                      color={"whiteAlpha.900"}
                    >
                      Source
                    </Th>
                    <Th
                      padding={2}
                      w={15}
                      fontSize={"0.65rem"}
                      color={"whiteAlpha.900"}
                    >
                      City
                    </Th>
                    <Th
                      padding={2}
                      w={15}
                      fontSize={"0.65rem"}
                      color={"whiteAlpha.900"}
                    >
                      Status
                    </Th>
                    <Th
                      padding={2}
                      w={15}
                      fontSize={"0.65rem"}
                      color={"whiteAlpha.900"}
                    >
                      Enq. Date
                    </Th>
                    <Th
                      padding={2}
                      w={15}
                      fontSize={"0.65rem"}
                      color={"whiteAlpha.900"}
                    >
                      Lfd
                    </Th>
                    <Th
                      padding={2}
                      w={15}
                      fontSize={"0.65rem"}
                      color={"whiteAlpha.900"}
                    >
                      Name
                    </Th>
                    <Th
                      padding={2}
                      w={15}
                      fontSize={"0.65rem"}
                      color={"whiteAlpha.900"}
                    >
                      Mob_1
                    </Th>
                    <Th
                      padding={2}
                      w={15}
                      fontSize={"0.65rem"}
                      color={"whiteAlpha.900"}
                    >
                      Product
                    </Th>
                    <Th
                      padding={2}
                      w={15}
                      fontSize={"0.65rem"}
                      color={"whiteAlpha.900"}
                    >
                      Price
                    </Th>
                    <Th
                      padding={2}
                      w={15}
                      fontSize={"0.65rem"}
                      color={"whiteAlpha.900"}
                    >
                      Days
                    </Th>
                    <Th
                      padding={2}
                      w={15}
                      fontSize={"0.65rem"}
                      color={"whiteAlpha.900"}
                    >
                      follow up
                    </Th>
                    <Th
                      padding={2}
                      w={15}
                      fontSize={"0.65rem"}
                      color={"whiteAlpha.900"}
                    >
                      Action
                    </Th>
                  </Tr>
                </Thead>
                {isLoading ? (
                  <Tr>
                    <Td colSpan={5} textAlign="center">
                      <Loader />
                    </Td>
                  </Tr>
                ) : (
                  <Tbody>
                    {filteredData?.map((el: any) => {
                      const iconName = el?.StatusInfo[0]?.StatusName?.toLowerCase().charAt(0);
                      const bgColor = lightColors[iconName] || "#F8F8FF"
                      const bgColorDB = leadscount?.find((e: any) => e?.name === el?.StatusInfo[0]?.StatusName)?.color
                      return (
                        <Tr
                          key={el._id}
                          fontSize={"0.5rem"}
                          bg={bgColorDB ? bgColorDB : bgColor}
                        >
                          <Td fontSize={"0.8rem"} padding={2} w={15}>
                            {el.UID}
                          </Td>
                          <Td fontSize={"0.8rem"} padding={2} w={15}>
                            {el?.AssignInfo[0]?.Name}
                          </Td>
                          <Td fontSize={"0.8rem"} padding={2} w={15}>
                            {el?.SourceInfo[0]?.SourceName}
                          </Td>
                          <Td fontSize={"0.8rem"} padding={2} w={15}>
                            {el?.CityInfo[0]?.cityName}
                          </Td>
                          <Td fontSize={"0.8rem"} padding={2} w={15}>
                            {el?.StatusInfo[0]?.StatusName}
                          </Td>
                          <Td fontSize={"0.8rem"} padding={2} w={15}>
                            {new Date(el.EnquiryDate).toLocaleDateString()}
                          </Td>
                          <Td
                            fontSize={"0.8rem"}
                            textAlign={"center"}
                            padding={2}
                            w={15}
                          >
                            {el.Days2}
                          </Td>
                          <Td fontSize={"0.8rem"} padding={2} w={15}>
                            {el.Name}
                          </Td>
                          <Td fontSize={"0.8rem"} padding={2} w={15}>
                            {el.Phone1}
                          </Td>
                          <Td
                            fontSize={"0.8rem"}
                            padding={2}
                            w={15}
                            textOverflow={"ellipsis"}
                            overflow={"hidden"}
                            whiteSpace={"nowrap"}
                          >
                            {el?.CourseInfo[0]?.CourseName}
                          </Td>

                          <Td fontSize={"0.8rem"} padding={2} w={15}>
                            {el.CoursePrice}
                          </Td>
                          <Td fontSize={"0.8rem"} padding={2} w={15}>
                            {el?.Days}
                          </Td>
                          <Td fontSize={"0.8rem"} padding={2} w={15}>
                            {new Date(el.EnquiryDate).toLocaleDateString()}
                          </Td>
                          <Td
                            textAlign={"center"}
                            fontSize={"0.8rem"}

                            w={15}
                          >
                            {" "}
                            <TfiEye color="blue" size={18} />
                            {/* <AlertDialogDelete
                            id={el._id}
                            handleDelete={handleDelete}
                          /> */}
                          </Td>
                        </Tr>
                      )
                    })}
                  </Tbody>
                )}
              </Table>
            </Box>
          </TableContainer>
        </Box>
        <Box
          display={"flex"}
          justifyContent={"flex-end"}
          gap={"3"}
          px={3}
          borderTop={"1px gray.500"}
        >
          <Button
            size={"xs"}
            onClick={() => handlePageChange(page - 1)}
            colorScheme="gray"
            disabled={page === 1}
            borderRadius={"50%"}
            p={"0.5rem 0"}
          >
            &lt;
          </Button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(
            (pageNumber) => {
              if (
                pageNumber <= 3 ||
                (pageNumber >= page - 1 && pageNumber <= page + 1) ||
                pageNumber > totalPages - 3
              ) {
                return (
                  <Button
                    size={"xs"}
                    borderRadius={"50%"}
                    p={"0.5rem 0"}
                    key={pageNumber}
                    onClick={() => handlePageChange(pageNumber)}
                    disabled={page === pageNumber}
                    colorScheme={page === pageNumber ? "orange" : "gray"}
                  >
                    {pageNumber}
                  </Button>
                );
              } else if (pageNumber === 4 || pageNumber === totalPages - 2) {
                return <Text key={pageNumber}>...</Text>;
              } else {
                return null;
              }
            }
          )}

          <Button
            size={"xs"}
            borderRadius={"50%"}
            p={"0.5rem 0"}
            onClick={() => handlePageChange(page + 1)}
            disabled={page === totalPages}
          >
            &gt;
          </Button>
        </Box>
      </Stack>

      <Box>
        <TodoList />
      </Box>
    </Stack>
  );
};

export default UserDashboard;
