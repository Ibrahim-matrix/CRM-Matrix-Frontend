/**
 * AdminDashboard Component:
 * Renders the admin dashboard with various analytics and statistics.
 * Fetches data related to leads count, source analytics, and course analytics.
 * Displays charts and visual representations of the data using ApexCharts.
 * Provides information about different types of leads and their counts.
 * Shows top courses purchased and calls made using bar and line charts.
 * Presents source analytics in a bar chart.
 */

import {
  Box,
  Button,
  Divider,
  Flex,
  HStack,
  Image,
  Input,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Select,
  SimpleGrid,
  Skeleton,
  Spacer,
  Stack,
  Text,
} from "@chakra-ui/react";
import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import totalleads from "../../icons/totalleads.svg";
import openleads from "../../icons/openleads.svg";
import finalleads from "../../icons/finalleads.svg";
import hotleads from "../../icons/hotleads.svg";
import unsubscribe from "../../icons/unsubscribe.svg";
import wronglead from "../../icons/wronglead.svg";
import enrolled from "../../icons/enrolled.svg";

import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getData } from "../../redux/actions/common.action";
import { ChevronDownIcon } from "@chakra-ui/icons";
import { FiUsers } from "react-icons/fi";
import format from "date-fns/format";
import { DateRange } from "react-date-range";

import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import Cookies from "js-cookie";
import { BASE_URL } from "../../config/RequestMethod";
import axios from "axios";

import iconBadge from "../../icons/icons8-badge.png";
import iconCancelOne from "../../icons/icons8-cancel-1.png";
import iconCancel from "../../icons/icons8-cancel.png";
import iconCheck from "../../icons/icons8-check.png";
import iconChili from "../../icons/icons8-chili-pepper.png";
import iconClosed from "../../icons/icons8-closed.png";
import iconDoor from "../../icons/icons8-door.png";
import iconFinish from "../../icons/icons8-finish.png";
import iconHot from "../../icons/icons8-hot.png";
import iconLast from "../../icons/icons8-last.png";
import iconLock from "../../icons/icons8-lock.png";
import iconMedal from "../../icons/icons8-medal.png";
import iconOpen from "../../icons/icons8-open.png";
import iconPlay from "../../icons/icons8-play.png";
import iconPurchasedOne from "../../icons/icons8-purchase-1.png";
import iconPurchased from "../../icons/icons8-purchase.png";
import iconStartOne from "../../icons/icons8-start-1.png";
import iconStart from "../../icons/icons8-start.png";
import icontrophy from "../../icons/icons8-trophy.png";
import iconUnlock from "../../icons/icons8-unlock.png";
import TodoList from "./Todo/TodoList";

// Define the shape of the analytics data
interface Analytics {
  leadscount: [
    {
      name: string;
      count: number;
      price: number;
    }
  ];
  sourceanalytics: {
    _id: string;
    leads: number;
  }[];
  courseanalytics: {
    _id: string;
    count: number;
  }[];
  statuses: {
    serialNumber: number;
    createdAt: string;
    StatusName: string;
    _id: number;
  }[];
  signinuser: any;
  loading: boolean;
}

const AdminDashboard = () => {
  // Retrieve data from the Redux store
  const {
    leadscount,
    sourceanalytics,
    courseanalytics,
    statuses,
    signinuser,
    loading,
  } = useSelector((state: { common: Analytics }) => state.common);

  console.log(sourceanalytics);

  const dispatch: any = useDispatch();

  // Fetch data from the API on component mount
  useEffect(() => {
    dispatch(getData("dashboard/leads-count"));
    dispatch(getData("dashboard/source"));
  }, [dispatch]);

  const refTwo = useRef<HTMLDivElement>(null);

  const [selectedStatus, setSelectedStatus] = useState("");

  const [callAnalytics, setCallAnalytics] = useState([]);

  const [openenq, setOpenenq] = useState(false);

  const today = new Date();
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(today.getDate() - 29);
  const [enquiryDate, setEnqDate] = useState([
    {
      startDate: thirtyDaysAgo,
      endDate: today,
      key: "selection",
    },
  ]);

  const [{ startDate: enquiryStartDate, endDate: enquiryEndDate }] =
    enquiryDate;

  console.log(enquiryDate);

  useEffect(() => {
    const token = Cookies.get("token");
    const newURL =
      signinuser?.UserType === 2
        ? `${BASE_URL}dashboard/calls?startDate=${enquiryStartDate}&endDate=${enquiryEndDate}`
        : "";

    const getCalls = async () => {
      const res = await axios.get(newURL, {
        headers: {
          Authorization: `Bearer ${token}`, // Pass the token in the headers
        },
      });

      console.log(res?.data?.Data);
      setCallAnalytics(res?.data?.Data);
    };

    getCalls();
  }, [enquiryDate]);

  useEffect(() => {
    const handleEvents = (event: Event) => {
      if (event instanceof KeyboardEvent && event.key === "Escape") {
        setOpenenq(false);
      } else if (event instanceof MouseEvent) {
        if (refTwo.current && !refTwo.current.contains(event.target as Node)) {
          setOpenenq(false);
        }
      }
    };

    document.addEventListener("keydown", handleEvents);
    document.addEventListener("mousedown", handleEvents);

    return () => {
      document.removeEventListener("keydown", handleEvents);
      document.removeEventListener("mousedown", handleEvents);
    };
  }, []);

  useEffect(() => {
    dispatch(getData("status"));
    dispatch(getData("dashboard/analytics"));
  }, [dispatch, selectedStatus]);

  useEffect(() => {
    if (statuses?.length > 0 && !selectedStatus) {
      setSelectedStatus(statuses[0]?.StatusName);
    }
  }, [statuses]);

  // Extract categories and data for course analytics
  const categoriestoshow = courseanalytics
    ?.map((item) => item._id)
    .filter((id) => id !== null);
  const categoriesdatacourse = courseanalytics?.map((item) => item.count);

  // Extract categories and data for source analytics
  const categoriestoshowSource = sourceanalytics
    ?.map((item) => item._id)
    .filter((id) => id !== null);
  const categoriesdatasource = sourceanalytics?.map((item) => item.leads);

  // Calculate the total count for course analytics
  const totalCount = categoriesdatacourse?.reduce(
    (total, count) => total + count,
    0
  );

  // Calculate the percentage for each count value in course analytics
  const percentages = categoriesdatacourse?.map(
    (count) => (count / totalCount) * 100
  );

  const [product, setProduct] = useState([
    { Product1: 14 },
    { Product2: 28 },
    { Product3: 45 },
    { Product4: 55 },
    { Product5: 15 },
    { Product6: 25 },
    { Product7: 85 },
    { Product8: 45 },
    { Product9: 35 },
    { Product10: 65 },
  ]);

  const [call, setCall] = useState([
    { Call1: 14 },
    { Call2: 28 },
    { Call3: 45 },
    { Call4: 55 },
    { Call5: 15 },
    { Call6: 25 },
    { Call7: 85 },
    { Call8: 45 },
    { Call9: 35 },
    { Call10: 65 },
  ]);

  const [source, setSource] = useState([
    { Source1: 14 },
    { Source2: 28 },
    { Source3: 45 },
    { Source4: 55 },
    { Source5: 15 },
    { Source6: 25 },
    { Source7: 85 },
    { Source8: 45 },
    { Source9: 35 },
    { Source10: 65 },
  ]);

  const transformedData = product.map((item: any) => {
    const key = Object.keys(item)[0]; // Get the key (e.g., 'Product1')
    const value = item[key]; // Get the value (e.g., 78)
    return { name: key, data: value };
  });

  const transformedSource = source.map((item: any) => {
    const key = Object.keys(item)[0]; // Get the key (e.g., 'Product1')
    const value = item[key]; // Get the value (e.g., 78)
    return { name: key, data: value };
  });

  const transformedCall = call.map((item: any) => {
    const key = Object.keys(item)[0]; // Get the key (e.g., 'Product1')
    const value = item[key]; // Get the value (e.g., 78)
    return { name: key, data: value };
  });

  const [categories, setCategories] = useState([]);

  const colors: any = ["#ff6666", "#66ff66", "#6666ff", "#ffff66", "#ff66ff"];

  const series = [
    {
      name: `${selectedStatus} Leads `,
      data: courseanalytics?.map((course: any) =>
        selectedStatus === "Total Leads"
          ? course?.totalLeads
          : course?.[selectedStatus]?.leads || 0
      ),
    },
  ];

  const options = {
    chart: {
      id: "horizontal-bar",
      toolbar: {
        show: false,
      },
    },
    plotOptions: {
      bar: {
        horizontal: true,
        distributed: true,
      },
    },
    xaxis: {
      // categories: transformedData.map((item) => "ibrahim"),
      categories: courseanalytics?.map((c: any) => c?.courseName),
    },
    yaxis: {
      type: "logarithmic",
      labels: {
        style: {
          fontWeight: "bold",
        },
      },
    },
    colors: [
      "#33b2df",
      "#546E7A",
      "#d4526e",
      "#13d8aa",
      "#A5978B",
      "#2b908f",
      "#f9a3a4",
      "#90ee7e",
      "#f48024",
      "#69d2e7",
    ],
  };

  const series_calls = [
    {
      name: ` Leads `,
      data: callAnalytics?.map((c: any) => c?.totalLeads),
    },
  ];

  const options_calls = {
    chart: {
      id: "horizontal-bar",
      toolbar: {
        show: false,
      },
    },
    plotOptions: {
      bar: {
        horizontal: true,
        distributed: true,
      },
    },
    xaxis: {
      // categories: transformedData.map((item) => "ibrahim"),
      categories: callAnalytics?.map((c: any) => c?.userName),
    },
    yaxis: {
      type: "logarithmic",
      labels: {
        style: {
          fontWeight: "bold",
        },
      },
    },
    colors: colors,
  };

  const series_source = [
    {
      name: "Call", // Name for the second chart
      data: transformedData.map((item) => item.data), // Data for the second chart
    },
  ];

  const options2: ApexOptions = {
    chart: {
      type: "line",
      height: 350,
      toolbar: {
        show: false,
      },
    },
    stroke: {
      width: 3,
      curve: "smooth",
      colors: ["#ff9800"], // Orange color
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "55%",
        colors: colors,
      },
    },
    dataLabels: {
      enabled: false,
    },
    xaxis: {
      categories: transformedCall.map((item) => item.name),
    },
    yaxis: {
      labels: {
        style: {
          fontWeight: "bold",
        },
      },
    },
  };

  const series3 = [
    {
      name: "Source", // Name for the second chart
      data: sourceanalytics?.map((s: any) => s?.count), // Data for the second chart
    },
  ];

  const options3: ApexOptions = {
    chart: {
      type: "bar",
      height: 350,
      toolbar: {
        show: false,
      },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "40%",
        distributed: true,
      },
    },
    dataLabels: {
      enabled: false,
    },
    xaxis: {
      categories: sourceanalytics?.map((s: any) => s?.sourceName),
    },
    yaxis: {
      labels: {
        style: {
          fontWeight: "bold",
        },
      },
    },
    colors: [
      "#d4526e",
      "#546E7A",
      "#13d8aa",
      "#A5978B",
      "#2b908f",
      "#33b2df",
      "#90ee7e",
      "#f48024",
      "#f9a3a4",
      "#69d2e7",
    ],
  };

  const charToIconMap: { [key: string]: string } = {
    a: totalleads,
    b: openleads,
    c: unsubscribe,
    d: hotleads,
    e: unsubscribe,
    f: finalleads,
    g: enrolled,
    h: totalleads,
    i: openleads,
    j: finalleads,
    k: hotleads,
    l: unsubscribe,
    m: wronglead,
    n: enrolled,
    o: openleads,
    p: openleads,
    q: finalleads,
    r: hotleads,
    s: unsubscribe,
    t: totalleads,
    u: enrolled,
    v: totalleads,
    w: openleads,
    x: finalleads,
    y: hotleads,
    z: unsubscribe,
  };

  const lightColors: { [key: string]: string } = {
    a: "#FFCCCC", // light red
    b: "#FFE0B2", // light orange
    c: "#FFFFCC", // light yellow
    d: "#CCFFCC", // light green
    e: "#CCFFFF", // light cyan
    f: "#CCCCFF", // light blue
    g: "#E0CCFF", // light purple
    h: "#F0E68C", // khaki
    i: "#FAFAD2", // light goldenrod yellow
    j: "#D3FFCE", // light mint
    k: "#FFDAB9", // peach puff
    l: "#E6E6FA", // lavender
    m: "#FFF0F5", // lavender blush
    n: "#F5FFFA", // mint cream
    o: "#FFFACD", // lemon chiffon
    p: "#F0FFF0", // honeydew
    q: "#F5F5DC", // beige
    r: "#F8F8FF", // ghost white
    s: "#FDF5E6", // old lace
    t: "#FFFFF0", // ivory
    u: "#F0FFFF", // azure
    v: "#FFE4E1", // misty rose
    w: "#F0F8FF", // alice blue
    x: "#FFF5EE", // seashell
    y: "#F5DEB3", // wheat
    z: "#E0FFFF", // light cyan 2
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
    {
      name: "PurchasedOne",
      value: iconPurchasedOne,
      local: "iconPurchasedOne",
    },
    { name: "Start", value: iconStart, local: "iconStart" },
    { name: "StartOne", value: iconStartOne, local: "iconStartOne" },
    { name: "Unlock", value: iconUnlock, local: "iconUnlock" },
    { name: "trophy", value: icontrophy, local: "icontrophy" },
  ];

  return (
    <Stack>
      {/* Displaying the leads data */}
      {loading || leadscount?.length < 1 ? (
        <SimpleGrid
          columns={{ base: 2, sm: 1, md: 3, lg: 5 }}
          gap="0.5rem"
          pb="2"
        >
          {Array.from({ length: 9 }).map((_, i) => (
            <Box key={i} borderRadius="md" boxShadow="sm">
              <Skeleton
                h="3.7rem"
                px="4"
                py="1"
                borderRadius={"1.1rem"}
                variant="pulse"
              />
            </Box>
          ))}
        </SimpleGrid>
      ) : (
        <SimpleGrid
          columns={{ base: 2, sm: 1, md: 4, lg: 5 }}
          gap="0.5rem"
          bg="gray.100"
          pb="2"
        >
          {leadscount?.map((el: any, i) => {
            const iconName = el?.name.toLowerCase().charAt(0);
            const iconPath = charToIconMap[iconName] || totalleads;
            const bgColor = lightColors[iconName] || "#F8F8FF";
            return (
              <Box
                h="3.7rem"
                px="4"
                py="1"
                borderRadius={"1.1rem"}
                bg={el?.color ? el?.color : bgColor}
                key={i}
              >
                <HStack>
                  <Box>
                    <Text fontSize={"0.9rem"} padding={1} fontWeight={"800"}>
                      ₹ {el?.price}
                    </Text>
                    <Text fontSize={"0.95rem"} fontWeight={400}>
                      {el?.name}{" "}
                      <span style={{ fontWeight: "600", marginTop: "8px" }}>
                        {el?.count}
                      </span>
                    </Text>
                  </Box>
                  <Spacer />
                  <Box mt="0">
                    <Image
                      mt={"0"}
                      borderRadius="full"
                      boxSize="40px"
                      src={
                        el?.icon
                          ? iconsArray?.find((i: any) => i?.local === el?.icon)
                              ?.value
                          : iconPath
                      }
                      alt="error Icons"
                    />
                  </Box>
                </HStack>
              </Box>
            );
          })}
        </SimpleGrid>
      )}

      {/* Displaying the charts*/}
      <Stack py="1" mt="2" bg="whiteAlpha.900" borderRadius={"0.25rem"}>
        <SimpleGrid columns={{ sm: 1, md: 3 }} gap="0.8rem" p="1" bg="gray.50">
          <Box
            bg="white"
            p={6}
            borderRadius="2xl"
            border="1px solid"
            borderColor="gray.200"
            transition="all 0.3s ease"
            _hover={{
              boxShadow: "0 8px 24px rgba(0, 0, 0, 0.1)",
              transform: "translateY(-2px)",
            }}
          >
            <Flex align="center" justify="start" flexWrap="wrap" gap={4} mb={4}>
              <Box
                bg="gray.100"
                color="gray.700"
                fontWeight="medium"
                fontSize="sm"
                px={3}
                py={1}
                borderRadius="md"
                whiteSpace="nowrap"
              >
                Top Product
              </Box>

              <Menu>
                <MenuButton
                  as={Button}
                  rightIcon={<ChevronDownIcon />}
                  variant="outline"
                  size="sm"
                  borderRadius="md"
                  fontWeight="medium"
                  color="gray.700"
                  _hover={{ bg: "gray.50" }}
                >
                  {selectedStatus}
                </MenuButton>
                <MenuList borderRadius="md" boxShadow="lg" zIndex={10}>
                  <MenuItem
                    key="Total Leads"
                    onClick={() => setSelectedStatus("Total Leads")}
                  >
                    <HStack spacing={2}>
                      <Box as={FiUsers} boxSize="20px" color="blue.500" />
                      <Text fontWeight="500">Total Leads</Text>
                    </HStack>
                  </MenuItem>

                  {statuses?.map((status) => {
                    const name = status?.StatusName || "";
                    const iconKey = name.toLowerCase().charAt(0);
                    const icon = charToIconMap[iconKey] || totalleads;

                    return (
                      <MenuItem
                        key={name}
                        onClick={() => setSelectedStatus(name)}
                        _hover={{ bg: "gray.50" }}
                      >
                        <HStack spacing={3}>
                          <Image
                            src={icon}
                            alt="icon"
                            boxSize="24px"
                            borderRadius="full"
                          />
                          <Text>{name}</Text>
                        </HStack>
                      </MenuItem>
                    );
                  })}
                </MenuList>
              </Menu>
            </Flex>

            <Chart
              options={options}
              series={series}
              type="bar"
              height={370}
              width="100%"
            />
          </Box>

          <Box
            bg="white"
            p={6}
            borderRadius="2xl"
            border="1px solid"
            borderColor="gray.200"
            transition="all 0.3s ease"
            _hover={{
              boxShadow: "0 8px 24px rgba(0, 0, 0, 0.1)",
              transform: "translateY(-2px)",
            }}
          >
            <Flex
              direction={"row"}
              align="center"
              gap={4}
              mb={4}
              justify="space-between"
            >
              <Box
                bg="gray.100"
                color="gray.700"
                fontWeight="medium"
                fontSize="sm"
                px={3}
                py={1}
                borderRadius="md"
                whiteSpace="nowrap"
              >
                Total Calls Made From
              </Box>

              <Box className="calendarWrap" minW="250px">
                <Input
                  borderColor="gray.300"
                  size="sm"
                  cursor="pointer"
                  borderRadius="md"
                  h="32px"
                  placeholder="Select date"
                  value={
                    enquiryDate[0].startDate && enquiryDate[0].endDate
                      ? `${format(
                          enquiryDate[0].startDate,
                          "dd/MM/yyyy"
                        )} to ${format(enquiryDate[0].endDate, "dd/MM/yyyy")}`
                      : ""
                  }
                  readOnly
                  onClick={() => setOpenenq((prev) => !prev)}
                  _hover={{ borderColor: "blue.400" }}
                  _focus={{
                    borderColor: "blue.500",
                    boxShadow: "0 0 0 1px #3182ce",
                  }}
                />

                <Box ref={refTwo}>
                  {openenq && (
                    <DateRange
                      onChange={(item: any) => setEnqDate([item.selection])}
                      editableDateInputs
                      moveRangeOnFirstSelection={false}
                      ranges={enquiryDate.map((r) => ({
                        ...r,
                        startDate: r.startDate || undefined,
                        endDate: r.endDate || undefined,
                      }))}
                      direction="horizontal"
                      className="calendarElement"
                    />
                  )}
                </Box>
              </Box>
            </Flex>

            <Chart
              options={options_calls}
              series={series_calls}
              type="bar"
              height={370}
              width="100%"
            />
          </Box>

          <Box
            bg="white"
            p={6}
            borderRadius="2xl"
            border="1px solid"
            borderColor="gray.200"
            transition="all 0.3s ease"
            _hover={{
              boxShadow: "0 8px 24px rgba(0, 0, 0, 0.1)",
              transform: "translateY(-2px)",
            }}
          >
            <Flex align="center" justify="space-between" mb={4}>
              <Box
                bg="gray.100"
                color="gray.700"
                fontWeight="medium"
                fontSize="sm"
                px={3}
                py={1}
                borderRadius="md"
              >
                Source Analytics
              </Box>
            </Flex>

            <Chart
              options={options3}
              series={series3}
              type="bar"
              height={360}
              width="100%"
            />
          </Box>
        </SimpleGrid>
      </Stack>

      <Box>
        <TodoList />
      </Box>
    </Stack>
  );
};

export default AdminDashboard;
