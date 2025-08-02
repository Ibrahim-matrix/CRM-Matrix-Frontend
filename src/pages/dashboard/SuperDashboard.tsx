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
  Flex,
  HStack,
  Image,
  Select,
  SimpleGrid,
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

import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getDataByIdSuperAdmin,
  getDataSuperAdmin,
} from "../../redux/actions/common.action";
import { Calendar } from "react-calendar";
import "react-calendar/dist/Calendar.css";
import TodoList from "./Todo/TodoList";

// Define the shape of the analytics data
interface Analytics {
  supertiles: {
    activeAdminsCount: number;
    allAdminsCount: number;
    inactiveAdminsCount: number;
    totalRevenue: number;
  };

  sourceanalytics: {
    _id: string;
    leads: number;
  }[];
  courseanalytics: {
    _id: string;
    count: number;
  }[];
  adminsrevenue: {}[];
  particularadminrevnue: {
    Data: {
      name: string;
      revenue: number;
    }[];
  };
}

const SuperDashboard = () => {
  // Retrieve data from the Redux store
  const { supertiles, adminsrevenue, particularadminrevnue } = useSelector(
    (state: { common: Analytics }) => state.common
  );

  const dispatch: any = useDispatch();

  // Fetch data from the API on component mount
  useEffect(() => {
    dispatch(getDataSuperAdmin("dashboard"));
    dispatch(getDataSuperAdmin("dashboardAdminsRevenue"));
  }, []);

  const transformedData =
    adminsrevenue?.map((item: any) => {
      const key = Object.keys(item)[0];
      const value = item[key];
      return { name: key, data: value };
    }) || [];

  const transformedSource =
    adminsrevenue?.map((item: any) => {
      const key = Object.keys(item)[0];
      const value = item[key];
      return { name: key, data: value };
    }) || [];

  const transformedData2 =
    particularadminrevnue?.Data?.map((item: any) => ({
      name: item.name,
      data: item.revenue,
    })) || [];

  const transformedSource2 =
    particularadminrevnue?.Data?.map((item: any) => ({
      name: item.name,
      data: item.revenue,
    })) || [];

  const series = [
    {
      name: "Product", // Name for the second chart
      data: transformedData.map((item) => item.data), // Data for the second chart
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
      categories: transformedSource.map((item: any) => item.name),
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

  const pieChartData = {
    series: transformedData.map((item) => item.data), // Sample data
    options: {
      chart: {
        type: "pie",
        height: 350,
      },
      labels: transformedSource.map((item) => item.name), // Sample labels
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
      ], // Sample colors
    } as ApexOptions, // Explicitly type options with ApexOptions
  };

  const pieChartData2 = {
    series: transformedData2?.map((item: any) => item.data), // Sample data
    options: {
      chart: {
        type: "pie",
        height: 350,
      },
      labels: transformedSource2?.map((item) => item.name), // Sample labels
      colors: ["#F22F5E", "#E77A89", "#D963B1", "#CA2CD8"], // Sample colors
    } as ApexOptions, // Explicitly type options with ApexOptions
  };

  // Define a type for user types
  interface SigninUserDetails {
    signinuser: {
      UserType: number;
    };
  }

  //interface for the usersLists
  interface adminLists {
    admins: {
      Name: string;
      _id: string;
      active: boolean;
    }[];
    loading: boolean;
  }

  const { signinuser } = useSelector(
    (state: { common: SigninUserDetails }) => state.common
  );
  const { admins } = useSelector(
    (state: { common: adminLists }) => state.common
  );

  const memoizedAdmins = useMemo(() => admins, [admins]);
  const endpointAdmin = "";

  const [selectedAdmin, setSelectedAdmin] = useState<any>("");

  // Fetching user data if it is not already available
  useEffect(() => {
    if (memoizedAdmins && memoizedAdmins.length === 0) {
      dispatch(getDataSuperAdmin(endpointAdmin));
    }
  }, [dispatch, endpointAdmin, memoizedAdmins?.length]);

  const adminOptions =
    admins &&
    admins.map((admin: any) => (
      <option key={admin._id} value={admin._id}>
        {admin.Name}
      </option>
    ));

  useEffect(() => {
    dispatch(
      getDataByIdSuperAdmin(
        selectedAdmin || "64afa5186760084b3466b9fa",
        "adminProductRevenues"
      )
    );
  }, [selectedAdmin]);

  return (
    <Stack>
      {/* Displaying the leads data */}
      <Flex justifyContent={"space-around"}>
        <SimpleGrid
          columns={{ base: 2, sm: 2, md: 3, lg: 2 }}
          gap="1rem"
          px="1rem"
          bg="gray.100"
          pb="2"
          width={"100vw"}
        >
          <Box
            h="5rem"
            px="4"
            py="4"
            borderRadius={"1.1rem"}
            bg="whiteAlpha.900"
          >
            <HStack>
              <Box>
                <Text fontSize={"0.9rem"} padding={1} fontWeight={"800"}>
                  {supertiles?.allAdminsCount || 0}
                </Text>
                <Text fontSize={"0.95rem"} fontWeight={400}>
                  Total Admin
                </Text>
              </Box>
              <Spacer />
              <Box mt="0">
                <Image
                  mt={"0"}
                  borderRadius="full"
                  boxSize="40px"
                  src={totalleads}
                  alt="error Icons"
                />
              </Box>
            </HStack>
          </Box>
          <Box
            h="5rem"
            px="4"
            py="4"
            borderRadius={"1.1rem"}
            bg="whiteAlpha.900"
          >
            <HStack>
              <Box>
                <Text fontSize={"0.9rem"} padding={1} fontWeight={"800"}>
                  {supertiles?.activeAdminsCount || 0}
                </Text>
                <Text fontSize={"0.95rem"} fontWeight={400}>
                  Active Admin
                </Text>
              </Box>
              <Spacer />
              <Box mt="0">
                <Image
                  mt={"0"}
                  borderRadius="full"
                  boxSize="40px"
                  src={hotleads}
                  alt="error Icons"
                />
              </Box>
            </HStack>
          </Box>
          <Box
            h="5rem"
            px="4"
            py="4"
            borderRadius={"1.1rem"}
            bg="whiteAlpha.900"
          >
            <HStack>
              <Box>
                <Text fontSize={"0.9rem"} padding={1} fontWeight={"800"}>
                  {supertiles?.inactiveAdminsCount || 0}
                </Text>
                <Text fontSize={"0.95rem"} fontWeight={400}>
                  Inactive Admin
                </Text>
              </Box>
              <Spacer />
              <Box mt="0">
                <Image
                  mt={"0"}
                  borderRadius="full"
                  boxSize="40px"
                  src={finalleads}
                  alt="error Icons"
                />
              </Box>
            </HStack>
          </Box>
          <Box
            h="5rem"
            px="4"
            py="4"
            borderRadius={"1.1rem"}
            bg="whiteAlpha.900"
          >
            <HStack>
              <Box>
                <Text fontSize={"0.9rem"} padding={1} fontWeight={"800"}>
                  ₹{supertiles?.totalRevenue || 0}
                </Text>
                <Text fontSize={"0.95rem"} fontWeight={400}>
                  Total Revenue
                </Text>
              </Box>
              <Spacer />
              <Box mt="0">
                <Image
                  mt={"0"}
                  borderRadius="full"
                  boxSize="40px"
                  src={openleads}
                  alt="error Icons"
                />
              </Box>
            </HStack>
          </Box>
        </SimpleGrid>
        <Box>
          <Image
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSB3yoFRy5nL2GooqZfVClQs6hH6tJyCJosYw&usqp=CAU"
            alt="error Icons"
            width={"50rem"}
            height={"11rem"}
            px={4}
          />
        </Box>
      </Flex>

      {/* Displaying top courses purchased */}
      <Stack py="1" mt="2" bg="whiteAlpha.900" borderRadius={"0.25rem"}>
        <SimpleGrid columns={{ sm: 1, md: 3 }} gap="0.8rem" p="1">
          <Box
            bg="gray.100"
            p="1"
            borderRadius={5}
            w={{ sm: "100%", md: "194%" }}
          >
            <Text ml="4" mb="-2" fontSize={"1rem"} fontWeight={700}>
              Source
            </Text>
            <Chart
              options={options3}
              series={series}
              type="bar"
              height="330"
              width="100%"
            />
          </Box>
          <Box
            bg={"gray.100"}
            position={"relative"}
            left={"24.4rem"}
            width={"27rem"}
            p={2}
          >
            {/* <TodoList /> */}
          </Box>
        </SimpleGrid>
      </Stack>
      <SimpleGrid
        columns={{ sm: 1, md: 3 }}
        gap="0.8rem"
        p="1"
        justifyContent={"space-evenly"}
      >
        <Box bg="gray.100" p="1" borderRadius={"5"}>
          <Chart
            options={pieChartData.options}
            series={pieChartData.series}
            type="pie"
            height="330"
          />
        </Box>
        <Box p="1" borderRadius={"5"} alignSelf={"center"}>
          <Calendar />
        </Box>
        <Box
          bg="gray.100"
          p="1"
          borderRadius={"5"}
          position={"absolute"}
          left={"56.4rem"}
          width={"27rem"}
        >
          {signinuser.UserType === 1 ? (
            <Box px={10} py={3}>
              <Select
                placeholder="Select Admin"
                width={"14rem"}
                onChange={(e) => {
                  const newAdminId = e.target.value;
                  setSelectedAdmin(newAdminId);
                }}
                value={selectedAdmin || ""}
              >
                {adminOptions}
              </Select>
            </Box>
          ) : null}

          <Chart
            options={pieChartData2.options}
            series={pieChartData2.series}
            type="pie"
          />
        </Box>
      </SimpleGrid>
    </Stack>
  );
};

export default SuperDashboard;
