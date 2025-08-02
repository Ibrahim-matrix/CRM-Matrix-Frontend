// declare module "react-date-range";
import {
  Alert,
  AlertIcon,
  AlertTitle,
  Box,
  Button,
  Input,
  InputGroup,
  InputLeftElement,
  Select,
  SimpleGrid,
  Stack,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { DateRange } from "react-date-range";

import format from "date-fns/format";

import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import React, {
  useState,
  useEffect,
  useMemo,
  useRef,
  useCallback,
} from "react";

import { useDispatch, useSelector } from "react-redux";
import {
  deleteData,
  getData,
  getDataById,
  getDataSuperAdmin,
  postData,
} from "../../redux/actions/common.action";
import { MultiSelect } from "react-multi-select-component";
import Loader from "../../components/Loader";
import { SearchIcon } from "@chakra-ui/icons";
import axios from "axios";

import AlertDialogDelete from "../../components/AlertDialouge";

import { TfiEye } from "react-icons/tfi";
import { useFetcher, useNavigate } from "react-router-dom";
import { FaSortAlphaDownAlt, FaSortAlphaUp } from "react-icons/fa";
import { BASE_URL, BASE_URL_SUPERADMIN } from "../../config/RequestMethod";
import HoverBox from "./components/HoverBox";

import Cookies from "js-cookie";
import LeadModal from "./components/LeadModal";
import LeadFilter from "./components/LeadFilter";

//interface for the usersLists
interface adminLists {
  admins: {
    Name: string;
    _id: string;
    active: boolean;
  }[];
  loading: boolean;
}

const LeadList = ({ isSideBar }: { isSideBar: boolean }) => {
  const {
    cities,
    signinuser,
    sources,
    statuses,
    branches,
    courses,
    users,
    user,
    error,
  } = useSelector((state: any) => state.common);

  console.log(branches)

  useEffect(() => {
    if (!signinuser?.userId) return
    dispatch(getDataById(signinuser?.userId, 'user'));
  }, [signinuser?.userId]);

  console.log(users)

  const dispatch: any = useDispatch();
  const navigate = useNavigate();

  const [city, setCities] = useState<Option[]>([]);
  const [citylist, setCityList] = useState<string>("");
  console.log(city)
  console.log(citylist)


  const [source, setSource] = useState<Option[]>([]);
  const [sourcelist, setSourceList] = useState<string>("");

  const [status, setStatus] = useState<Option[]>([]);
  const [statuslist, setStatusList] = useState<string>("");

  const [branch, setBranch] = useState<Option[]>([]);
  const [branchlist, setBranchList] = useState<string>("");


  const [course, setCourse] = useState<Option[]>([]);
  const [courselist, setCourseList] = useState<string>("");

  const [userd, setUsers] = useState<Option[]>([]);
  const [userlist, setUserList] = useState<string>("");

  const [filteredData, setFilteredData] = useState([]);
  console.log(filteredData)
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  const [search, setSearch] = useState<string>("");

  const [limit, setLimit] = useState<number>(100);

  const [sortOrder, setSortOrder] = useState<"asc" | "desc" | "">("");
  const [sortColumn, setSortColumn] = useState("");

  const [followUpStart, setfollowUpStart] = useState([
    {
      startDate: null,
      endDate: null,
      key: "selection",
    },
  ]);
  const [enquiryDate, setEnqDate] = useState([
    {
      startDate: null,
      endDate: null,
      key: "selection",
    },
  ]);

  const [{ startDate: followUpStartDate, endDate: followUpEndDate }] =
    followUpStart;
  const [{ startDate: enquiryStartDate, endDate: enquiryEndDate }] =
    enquiryDate;

  console.log(enquiryDate)

  // open close
  const [open, setOpen] = useState(false);
  const [openenq, setOpenenq] = useState(false);

  // get the target element to toggle
  const refOne = useRef<HTMLDivElement>(null);
  const refTwo = useRef<HTMLDivElement>(null);
  interface Option {
    value: string;
    label: string;
  }

  const hideOnEscape = (e: KeyboardEvent) => {
    if (e.key === "Escape") {
      setOpen(false);
      setOpenenq(false);
    }
  };

  //memoized cities - filtered with branchId
  const filteredCities = useMemo(() => {
    const filteredId = branch.map(b => b.value)
    if (filteredId.length === 0) return
    return cities?.filter((city: City) => filteredId.includes(city?.branchId)) || []
  }, [branch, cities])

  // 
  const filteredUsers = useMemo(() => {
    const selectedBranchNames = city.map(b => b?.label); // branch.label = BranchName
    console.log(selectedBranchNames)
    if (selectedBranchNames.length === 0) return [];
    console.log(users)
    const all = users?.filter((user: User) => selectedBranchNames.includes(user.City))
    console.log(all, '----------------------------------------------------------- -------------------------------')

    return users?.filter((user: User) => selectedBranchNames.includes(user.City)) || []
  }, [city, users]);

  const fetchData = async () => {
    if (signinuser.UserType !== 1) {
      try {
        dispatch(getData("branch"));
        dispatch(getData("user"));
        dispatch(getData("source"));
        dispatch(getData("city"));
        dispatch(getData("status"));
        dispatch(getData("course"));
      } catch (error) {
        console.error(error);
      }
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (signinuser.UserType === 3 && user?.Branch && Array.isArray(user.Branch) && user.Branch.length > 0) {
      const userType3Branch = branches?.filter(
        (b: any) => b?.BranchName === user.Branch[0]
      );
      console.log(userType3Branch[0]?._id);
      setBranch([{
        value: userType3Branch[0]?._id,
        label: userType3Branch[0]?.BranchName,
      }])
      setBranchList(userType3Branch[0]?._id)
    }
    if (user && user?.UserProfile === "User" && signinuser?.UserType === 3 && user?.City && user?.Name) {
      //setting city for userProfile = "User"
      const userType3City = cities?.filter((c: City) => c?.cityName === user?.City)
      console.log('===============================++++++++++++++++++++++++++++++++++===========================')
      setCities([{
        value: userType3City[0]?._id,
        label: userType3City[0]?.cityName
      }])
      setCityList(userType3City[0]?._id)

      //setting Assign to for userProfile = "User"
      const userType3Name = users?.filter((u: User) => u?.Name === user?.Name)
      console.log(userType3Name)
      setUsers([{
        value: userType3Name[0]?._id,
        label: userType3Name[0]?.Name
      }])
      setUserList(userType3Name[0]?._id)
    }
  }, [user, branches, cities, users]);

  // useEffect(() => {
  //   if (branchlist && signinuser.UserType !== 1) {
  //     console.log('effect')
  //     dispatch(getData(`city?branchId=${branchlist}`));
  //     dispatch(getData(`user?branchId=${branchlist}`));
  //   }
  //   console.log(branchlist)
  // }, [signinuser, dispatch, branchlist]);

  //Hide on outside click
  useEffect(() => {
    const handleEvents = (event: Event) => {
      if (event instanceof KeyboardEvent && event.key === "Escape") {
        setOpen(false);
        setOpenenq(false);
      } else if (event instanceof MouseEvent) {
        if (refOne.current && !refOne.current.contains(event.target as Node)) {
          setOpen(false);
        }
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

  interface City {
    _id: string;
    cityName: string;
    branchId: string;
  }

  interface Source {
    _id: string;
    SourceName: string;
  }

  interface Status {
    _id: string;
    StatusName: string;
  }
  interface Branch {
    _id: string;
    BranchName: string;
  }
  interface Course {
    _id: string;
    CourseName: string;
  }
  interface User {
    _id: string;
    Name: string;
    Branch: string[];
    City: string;
  }

  const cityOptions: Option[] = filteredCities?.map((city: City) => ({
    value: city._id,
    label: city.cityName,
  }));
  const sourceOptions: Option[] = sources?.map((source: Source) => ({
    value: source._id,
    label: source.SourceName,
  }));
  const statusOptions: Option[] = statuses?.map((status: Status) => ({
    value: status._id,
    label: status.StatusName,
  }));
  const branchOptions: Option[] = branches?.map((branch: Branch) => ({
    value: branch._id,
    label: branch.BranchName,
  }));
  const courseOptions: Option[] = courses?.map((course: Course) => ({
    value: course._id,
    label: course.CourseName,
  }));
  const userOptions: Option[] = filteredUsers?.map((user: User) => ({
    value: user._id,
    label: user.Name,
  }));

  // function debounce(func: Function, delay: number) {
  //   let timeoutId: ReturnType<typeof setTimeout>;
  //   return (...args: any[]) => {
  //     clearTimeout(timeoutId);
  //     timeoutId = setTimeout(() => func(...args), delay);
  //   };
  // }

  const [selectedAdmin, setSelectedAdmin] = useState<any>(null);
  const [url, setUrl] = useState("");

  const handleFilterSubmit = useCallback(async (): Promise<void> => {
    try {
      setIsLoading(true);
      const token = Cookies.get("token"); // Get the token from the cookie
      const newUrl =
        signinuser.UserType === 1 && selectedAdmin
          ? `${BASE_URL}lead?parentId=${selectedAdmin}&cityId=${citylist}&sourceId=${sourcelist}&statusId=${statuslist}&branchId=${branchlist}&assignId=${userlist}&courseId=${courselist}&FollowupStartDate=${followUpStartDate || ""
          }&FollowupEndDate=${followUpEndDate || ""}&EnquiryStartDate=${enquiryStartDate || ""
          }&EnquiryEndDate=${enquiryEndDate || ""
          }&limit=${limit}&page=${page}&keyword=${search}`
          : `${BASE_URL}lead?cityId=${citylist}&sourceId=${sourcelist}&statusId=${statuslist}&branchId=${branchlist}&assignId=${userlist}&courseId=${courselist}&FollowupStartDate=${followUpStartDate || ""
          }&FollowupEndDate=${followUpEndDate || ""}&EnquiryStartDate=${enquiryStartDate || ""
          }&EnquiryEndDate=${enquiryEndDate || ""
          }&limit=${limit}&page=${page}&keyword=${search}`;
      setUrl(newUrl);

      const res = await axios.get(newUrl, {
        headers: {
          Authorization: `Bearer ${token}`, // Pass the token in the headers
        },
      });
      setFilteredData(res.data.Data);
      // console.log("+++++++++++++++++++++", res?.data?.Data?.filter((u: any) => u?.BranchInfo?.BranchName === "kolkata"))
      setTotalPages(res.data.totalPages);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.error(error);
    }
  }, [
    signinuser.UserType,
    selectedAdmin,
    citylist,
    sourcelist,
    statuslist,
    branchlist,
    userlist,
    courselist,
    followUpStartDate,
    followUpEndDate,
    enquiryStartDate,
    enquiryEndDate,
    limit,
    page,
    search
  ])

  // Debounce the handleFilterSubmit function by 1 second
  // const debouncedHandleFilterSubmit = debounce(handleFilterSubmit, 1000);
  // useEffect(() => {
  //   debouncedHandleFilterSubmit();
  // }, [
  //   citylist,
  //   sourcelist,
  //   statuslist,
  //   branchlist,
  //   userlist,
  //   courselist,
  //   page,
  //   limit,
  //   followUpStart,
  //   enquiryDate,
  // ]);

  // const debouncedHandleFilterSubmit = debounce(handleFilterSubmit, 1000);
  useEffect(() => {
    const timeId = setTimeout(() => {
      handleFilterSubmit()
    }, 1000);

    return () => clearTimeout(timeId)
  }, [
    citylist,
    sourcelist,
    statuslist,
    branchlist,
    userlist,
    courselist,
    page,
    limit,
    followUpStart,
    enquiryDate,
    search
  ]);
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
    // debouncedHandleFilterSubmit();
  };
  const handlePageChange = (pageNumber: number) => {
    if (pageNumber < 1 || pageNumber > totalPages) {
      return;
    }
    setPage(pageNumber);
  };
  const endpoint: string = "lead";
  const toast = useToast();
  const handleDelete = async (id: number) => {
    await dispatch(deleteData(id, endpoint, toast));
    handleFilterSubmit();
  };

  useEffect(() => {
    handleFilterSubmit();
  }, [selectedAdmin]);

  //sorting for the table
  const handleSort = (column: string) => {
    if (column === sortColumn) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortOrder("asc");
      setSortColumn(column);
    }
    //  console.log("Sort Column:", sortColumn);
    //  console.log("Sort Order:", sortOrder);
  };

  const sortedData = useMemo(() => {
    if (sortColumn === "") {
      return filteredData;
    }

    const sorted = [...filteredData].sort((a, b) => {
      const valueA = getProperty(a, sortColumn);
      const valueB = getProperty(b, sortColumn);

      if (typeof valueA === "string" && typeof valueB === "string") {
        return sortOrder === "asc"
          ? valueA.localeCompare(valueB)
          : valueB.localeCompare(valueA);
      }

      return 0;
    });

    return sorted;
  }, [filteredData, sortColumn, sortOrder]);

  // Function to get nested or direct property value
  // Function to get nested or direct property value
  function getProperty(obj: any, path: string) {
    let value = obj;
    let properties = path.split(".");

    for (const property of properties) {
      if (value && typeof value === "object" && property in value) {
        value = value[property];
      } else {
        return undefined;
      }
    }

    return value;
  }

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [size, setSize] = React.useState("full");

  const handleSizeClick = (newSize: any) => {
    setSize(newSize);
    onOpen();
  };

  const { loading, lead, logs, leadLogss, prevCourses, prevStatusHistory, prevFollowups } =
    useSelector((state: any) => state.common);

  console.log(prevFollowups)

  const [remarks, setRemarks] = useState<string>("");
  const [logtype, setLogtype] = useState<string>("");
  const [log_id, setlogid] = useState<string>("");
  // console.log(log_id, "id form element");
  // const { id } = useParams<string>();

  const AddLog = () => {
    if (logtype === "" || remarks === "") {
      // Display an error message if logtype or remarks is empty
      return;
    }

    const formData = {
      leadId: log_id,
      Remarks: remarks,
      LogType: logtype,
    };

    // If logtype and remarks are not empty, make the API call
    dispatch(postData(formData, "lead/logs", navigate, toast)).then(() => {
      dispatch(getDataById(log_id, endpoint));
      setRemarks("");
      setLogtype("");
    });
  };

  // const [hoveredIndex, setHoveredIndex] = useState<null | boolean>(null);
  const [hoveredIndex, setHoveredIndex] = useState<null | number | -1>(null);
  const [isHoveringHoverBox, setIsHoveringHoverBox] = useState(false);
  const handleMouseEnter = (index: number, id: number) => {
    setHoveredIndex(index);
    dispatch(getDataById(id, endpoint));
  };

  const handleMouseLeave = () => {
    setHoveredIndex(null);
  };

  const handleHoverBoxMouseEnter = () => {
    setIsHoveringHoverBox(true);
  };

  const handleHoverBoxMouseLeave = () => {
    setIsHoveringHoverBox(false);
  };

  // Calculate the position for each HoverBox
  const calculateHoverBoxPosition = useCallback((index: number) => {
    // Function body...
    const targetElement = document.getElementById(`eye-${index}`);
    if (targetElement) {
      const { top, right } = targetElement.getBoundingClientRect();
      return { top, right };
    }
    return { top: 0, right: 20 };
  }, []);

  const { admins } = useSelector(
    (state: { common: adminLists }) => state.common
  );

  const endpointAdmin = "";

  // Fetching user data if it is not already available
  useEffect(() => {
    if (signinuser.UserType === 1) {
      dispatch(getDataSuperAdmin(endpointAdmin));
    }
  }, []);

  useEffect(() => {
    if (selectedAdmin && signinuser.UserType === 1) {
      dispatch(getDataSuperAdmin(`branch?parentId=${selectedAdmin}`));
      dispatch(getDataSuperAdmin(`source?parentId=${selectedAdmin}`));
      dispatch(getDataSuperAdmin(`status?parentId=${selectedAdmin}`));
      dispatch(getDataSuperAdmin(`course?parentId=${selectedAdmin}`));
    }
  }, [signinuser, dispatch, selectedAdmin]);

  useEffect(() => {
    if (branchlist && signinuser.UserType === 1) {
      console.log('-----------------------------user1-------------------------------------')
      dispatch(getData(`city?branchId=${branchlist}`));
      dispatch(getData(`assignTo?branchId=${branchlist}`));
    }
  }, [signinuser, dispatch, branchlist]);

  const adminOptions = admins?.map((admin: any) => (
    <option key={admin._id} value={admin._id}>
      {admin.Name}
    </option>
  ));

  return (
    <>
      <Stack height='88vh' display={'flex'} flexDirection={'column'}>
        {signinuser.UserType === 1 ? (
          <Box px={10} py={3}>
            <Select
              placeholder="Select Admin"
              width={"14rem"}
              onChange={(e) => {
                setSelectedAdmin(e.target.value);
              }}
              value={selectedAdmin || ""}
            >
              {adminOptions}
            </Select>
          </Box>
        ) : null}

        {isOpen && (
          <Box
            position="absolute"
            top="4.5rem" // height of header
            left={isSideBar ? "175px" : "415px"} // based on sidebar state
            width={isSideBar ? "calc(100vw - 175px)" : "calc(100vw - 415px)"}
            height="calc(100vh - 4.5rem)"
            zIndex={1000}
            pointerEvents="none" // allow outside clicks to pass through
          >
            <Box pointerEvents="auto" width="100%" height="100%">
              <LeadModal
                isSideBar={isSideBar}
                onClose={onClose}
                isOpen={isOpen} // still pass to LeadModal for internal logic
                lead={lead}
                logtype={logtype}
                setLogtype={setLogtype}
                remarks={remarks}
                setRemarks={setRemarks}
                AddLog={AddLog}
                leadLogss={leadLogss}
                prevCourses={prevCourses}
                prevStatusHistory={prevStatusHistory}
                prevFollowups={prevFollowups}
              />
            </Box>
          </Box>
        )}

        <Stack py="1" bg="whiteAlpha.900" borderRadius={"0.25rem"}>
          <SimpleGrid
            columns={{ sm: 2, md: 3, lg: 4 }}
            gap="0.5rem"
            px="2"
            zIndex={4}
          >
            <Box>
              <Text
                fontSize={"0.8rem"}
                ml="2"
                mb="0.1"
                fontWeight="500"
                color="black.600"
              >
                Branch
              </Text>
              <MultiSelect
                disabled={signinuser?.UserType === 3}
                className="rmsc"
                options={branchOptions}
                value={branch}
                onChange={(value: Option[]) => {
                  setBranch(value);
                  setBranchList(
                    value?.map((branch: Option) => branch.value).join(",")
                  );
                }}
                labelledBy="Select Source"
              />
            </Box>
            <Box>
              <Text
                fontSize={"0.8rem"}
                ml="2"
                mb="0.1"
                fontWeight="500"
                color="black.600"
              >
                City
              </Text>
              <MultiSelect
                disabled={branch.length === 0 || user?.UserProfile === "User"}
                className="rmsc"
                options={cityOptions || []}
                value={city}
                onChange={(value: Option[]) => {
                  setCities(value);
                  setCityList(
                    value?.map((city: Option) => city.value).join(",")
                  );
                }}
                labelledBy="Select City"
                overrideStrings={{
                  selectSomeItems: branch.length === 0 ? "Please select a branch first" : "Select City",
                }}
              />
            </Box>
            <Box>
              <Text
                fontSize={"0.8rem"}
                ml="2"
                mb="0.1"
                fontWeight="500"
                color="black.600"
              >
                Source
              </Text>
              <MultiSelect
                className="rmsc"
                options={sourceOptions || []}
                value={source}
                onChange={(value: Option[]) => {
                  setSource(value);
                  setSourceList(
                    value?.map((source: Option) => source.value).join(",")
                  );
                }}
                labelledBy="Select Source"
              />
            </Box>
            <Box>
              <Text
                fontSize={"0.8rem"}
                ml="2"
                mb="0.1"
                fontWeight="500"
                color="black.600"
              >
                Status
              </Text>
              <MultiSelect
                className="rmsc"
                options={statusOptions || []}
                value={status}
                onChange={(value: Option[]) => {
                  setStatus(value);
                  setStatusList(
                    value?.map((status: Option) => status.value).join(",")
                  );
                }}
                labelledBy="Select Source"
              />
            </Box>

            <Box>
              <Text
                fontSize={"0.8rem"}
                ml="2"
                mb="0.1"
                fontWeight="500"
                color="black.600"
              >
                Product
              </Text>
              <MultiSelect
                className="rmsc"
                options={courseOptions || []}
                value={course}
                onChange={(value: Option[]) => {
                  setCourse(value);
                  setCourseList(
                    value?.map((branch: Option) => branch.value).join(",")
                  );
                }}
                labelledBy="Select course"
              />
            </Box>
            <Box>
              <Text
                fontSize={"0.8rem"}
                ml="2"
                mb=""
                fontWeight="500"
                color="black.600"
              >
                Assign To
              </Text>
              <MultiSelect
                disabled={city.length === 0 || user?.UserProfile === "User"}
                className="rmsc"
                options={userOptions || []}
                value={userd}
                onChange={(value: Option[]) => {
                  setUsers(value);
                  setUserList(
                    value?.map((user: Option) => user.value).join(",")
                  );
                }}
                labelledBy="Select user"
                overrideStrings={{
                  selectSomeItems: city.length === 0 ? "Please select a city first" : "Select Assign user",
                }}
              />
            </Box>
            <Box>
              <div className="calendarWrap">
                <Text
                  fontSize={"0.8rem"}
                  ml="2"
                  mb=""
                  fontWeight="500"
                  color="black.600"
                >
                  Follow Up Date
                </Text>
                <Input
                  borderColor={"#A0AEC0"}
                  size="sm"
                  borderRadius={"0.25rem"}
                  w="full"
                  h="27px"
                  placeholder="Select date"
                  value={
                    followUpStart[0].startDate && followUpStart[0].endDate
                      ? `${format(
                        followUpStart[0].startDate,
                        "dd/MM/yyyy"
                      )} to ${format(followUpStart[0].endDate, "dd/MM/yyyy")}`
                      : ""
                  }
                  readOnly
                  onClick={() => setOpen((open) => !open)}
                />

                <div ref={refOne}>
                  {open && (
                    <DateRange
                      onChange={(item: any) =>
                        setfollowUpStart([item.selection])
                      }
                      editableDateInputs={true}
                      moveRangeOnFirstSelection={false}
                      ranges={followUpStart.map((r) => ({
                        ...r,
                        startDate: r.startDate || undefined,
                        endDate: r.endDate || undefined,
                      }))}
                      direction="horizontal"
                      className="calendarElement"
                    />
                  )}
                </div>
              </div>
            </Box>
            <Box>
              <div className="calendarWrap">
                <Text
                  fontSize={"0.8rem"}
                  ml="2"
                  mb=""
                  fontWeight="500"
                  color="black.600"
                >
                  Enquiry Date
                </Text>
                <Input
                  borderColor={"#A0AEC0"}
                  size="sm"
                  borderRadius={"0.25rem"}
                  w="full"
                  h="27px"
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
                  onClick={() => setOpenenq((openenq) => !openenq)}
                />

                <div ref={refTwo}>
                  {openenq && (
                    <DateRange
                      onChange={(item: any) => setEnqDate([item.selection])}
                      editableDateInputs={true}
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
                </div>
              </div>
            </Box>
          </SimpleGrid>
        </Stack>

        <Stack>
          {/* <LeadFilter /> */}
        </Stack>

        <Stack py="1" bg="whiteAlpha.900" borderRadius={"0.25rem"} display={'flex'} flexDirection={'column'} height="100%">
          <Box
            px="4"
            display={"flex"}
            justifyContent={"space-between"}
            alignItems={"center"}
          >
            <Box>
              <Select
                borderRadius={"0.25rem"}
                borderColor={"gray.400"}
                size="xs"
                value={limit}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                  setLimit(parseInt(e.target.value, 10))
                }
              >
                <option value={5}>5</option>
                <option value={20}>20</option>
                <option value={30}>30</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </Select>
            </Box>
            <Box>
              <InputGroup>
                <InputLeftElement pointerEvents="none">
                  <SearchIcon color="gray.400" mb="4" />
                </InputLeftElement>
                <Input
                  w="400px"
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
          <Box overflow="auto" className="shrinkable-table" flex='1'>
            <TableContainer className="tarun" whiteSpace={"nowrap"}>
              <Box overflowY="auto" height={400} maxHeight="400px">
                <Table size="sm">
                  <Thead
                    bg={"blue.600"}
                    color={"whiteAlpha.900"}
                    position={"sticky"}
                    borderRadius={"20px"}
                    top="0"
                    zIndex={1}
                  >
                    <Tr>
                      <Th
                        onClick={() => handleSort("UID")}
                        padding={2}
                        w={15}
                        fontSize={"0.65rem"}
                        color={"whiteAlpha.900"}
                      >
                        <Text display="flex" justifyContent="start" gap="1">
                          {" "}
                          <span> UID </span>
                          <span>
                            {sortColumn === "UID" && sortOrder === "asc" && (
                              <FaSortAlphaUp
                                style={{ marginTop: "1px", cursor: "pointer" }}
                                size={13}
                              />
                            )}
                            {sortColumn === "UID" && sortOrder === "desc" && (
                              <FaSortAlphaDownAlt
                                size={13}
                                style={{ marginTop: "1px", cursor: "pointer" }}
                              />
                            )}
                            {sortColumn !== "UID" && (
                              <FaSortAlphaUp
                                size={13}
                                style={{ marginTop: "1px", cursor: "pointer" }}
                              />
                            )}
                          </span>
                        </Text>
                      </Th>
                      <Th
                        onClick={() => handleSort("AssignInfo.Name")}
                        padding={2}
                        w={15}
                        fontSize={"0.65rem"}
                        color={"whiteAlpha.900"}
                      >
                        <Text display="flex" justifyContent="start" gap="1">
                          {" "}
                          <span> Assign To </span>
                          <span>
                            {sortColumn === "AssignInfo.Name" &&
                              sortOrder === "asc" && (
                                <FaSortAlphaUp
                                  style={{
                                    marginTop: "1px",
                                    cursor: "pointer",
                                  }}
                                  size={13}
                                />
                              )}
                            {sortColumn === "AssignInfo.Name" &&
                              sortOrder === "desc" && (
                                <FaSortAlphaDownAlt
                                  size={13}
                                  style={{
                                    marginTop: "1px",
                                    cursor: "pointer",
                                  }}
                                />
                              )}
                            {sortColumn !== "AssignInfo.Name" && (
                              <FaSortAlphaUp
                                size={13}
                                style={{ marginTop: "1px", cursor: "pointer" }}
                              />
                            )}
                          </span>
                        </Text>
                      </Th>
                      <Th
                        onClick={() => handleSort("SourceInfo.SourceName")}
                        padding={2}
                        w={15}
                        fontSize={"0.65rem"}
                        color={"whiteAlpha.900"}
                      >
                        <Text display="flex" justifyContent="start" gap="1">
                          <span> Source </span>
                          <span>
                            {sortColumn === "SourceInfo.SourceName" &&
                              sortOrder === "asc" && (
                                <FaSortAlphaUp
                                  style={{
                                    marginTop: "1px",
                                    cursor: "pointer",
                                  }}
                                  size={13}
                                />
                              )}
                            {sortColumn === "SourceInfo.SourceName" &&
                              sortOrder === "desc" && (
                                <FaSortAlphaDownAlt
                                  size={13}
                                  style={{
                                    marginTop: "1px",
                                    cursor: "pointer",
                                  }}
                                />
                              )}
                            {sortColumn !== "SourceInfo.SourceName" && (
                              <FaSortAlphaUp
                                size={13}
                                style={{ marginTop: "1px", cursor: "pointer" }}
                              />
                            )}
                          </span>
                        </Text>
                      </Th>
                      <Th
                        onClick={() => handleSort("CityInfo.cityName")}
                        padding={2}
                        w={15}
                        fontSize={"0.65rem"}
                        color={"whiteAlpha.900"}
                      >
                        <Text display="flex" justifyContent="start" gap="1">
                          {" "}
                          <span> City </span>
                          <span>
                            {sortColumn === "CityInfo.cityName" &&
                              sortOrder === "asc" && (
                                <FaSortAlphaUp
                                  style={{
                                    marginTop: "1px",
                                    cursor: "pointer",
                                  }}
                                  size={13}
                                />
                              )}
                            {sortColumn === "CityInfo.cityName" &&
                              sortOrder === "desc" && (
                                <FaSortAlphaDownAlt
                                  size={13}
                                  style={{
                                    marginTop: "1px",
                                    cursor: "pointer",
                                  }}
                                />
                              )}
                            {sortColumn !== "CityInfo.cityName" && (
                              <FaSortAlphaUp
                                size={13}
                                style={{ marginTop: "1px", cursor: "pointer" }}
                              />
                            )}
                          </span>
                        </Text>
                      </Th>
                      <Th
                        onClick={() => handleSort("StatusInfo.StatusName")}
                        padding={2}
                        w={15}
                        fontSize={"0.65rem"}
                        color={"whiteAlpha.900"}
                      >
                        <Text display="flex" justifyContent="start" gap="1">
                          {" "}
                          <span> Status </span>
                          <span>
                            {sortColumn === "StatusInfo.StatusName" &&
                              sortOrder === "asc" && (
                                <FaSortAlphaUp
                                  style={{
                                    marginTop: "1px",
                                    cursor: "pointer",
                                  }}
                                  size={13}
                                />
                              )}
                            {sortColumn === "StatusInfo.StatusName" &&
                              sortOrder === "desc" && (
                                <FaSortAlphaDownAlt
                                  size={13}
                                  style={{
                                    marginTop: "1px",
                                    cursor: "pointer",
                                  }}
                                />
                              )}
                            {sortColumn !== "StatusInfo.StatusName" && (
                              <FaSortAlphaUp
                                size={13}
                                style={{ marginTop: "1px", cursor: "pointer" }}
                              />
                            )}
                          </span>
                        </Text>
                      </Th>
                      <Th
                        onClick={() => handleSort("BranchInfo.BranchName")}
                        padding={2}
                        w={15}
                        fontSize={"0.65rem"}
                        color={"whiteAlpha.900"}
                      >
                        <Text display="flex" justifyContent="start" gap="1">
                          {" "}
                          <span> Branch </span>
                          <span>
                            {sortColumn === "BranchInfo.BranchName" &&
                              sortOrder === "asc" && (
                                <FaSortAlphaUp
                                  style={{
                                    marginTop: "1px",
                                    cursor: "pointer",
                                  }}
                                  size={13}
                                />
                              )}
                            {sortColumn === "BranchInfo.BranchName" &&
                              sortOrder === "desc" && (
                                <FaSortAlphaDownAlt
                                  size={13}
                                  style={{
                                    marginTop: "1px",
                                    cursor: "pointer",
                                  }}
                                />
                              )}
                            {sortColumn !== "BranchInfo.BranchName" && (
                              <FaSortAlphaUp
                                size={13}
                                style={{ marginTop: "1px", cursor: "pointer" }}
                              />
                            )}
                          </span>
                        </Text>
                      </Th>
                      <Th
                        onClick={() => handleSort("EnquiryDate")}
                        padding={2}
                        w={15}
                        fontSize={"0.65rem"}
                        color={"whiteAlpha.900"}
                      >
                        <Text display="flex" justifyContent="start" gap="1">
                          <span> Enq. Date </span>
                          <span>
                            {sortColumn === "EnquiryDate" &&
                              sortOrder === "asc" && (
                                <FaSortAlphaUp
                                  style={{
                                    marginTop: "1px",
                                    cursor: "pointer",
                                  }}
                                  size={13}
                                />
                              )}
                            {sortColumn === "EnquiryDate" &&
                              sortOrder === "desc" && (
                                <FaSortAlphaDownAlt
                                  size={13}
                                  style={{
                                    marginTop: "1px",
                                    cursor: "pointer",
                                  }}
                                />
                              )}
                            {sortColumn !== "EnquiryDate" && (
                              <FaSortAlphaUp
                                size={13}
                                style={{ marginTop: "1px", cursor: "pointer" }}
                              />
                            )}
                          </span>
                        </Text>
                      </Th>
                      <Th
                        onClick={() => handleSort("Name")}
                        padding={2}
                        w={15}
                        fontSize={"0.65rem"}
                        color={"whiteAlpha.900"}
                      >
                        <Text display="flex" justifyContent="start" gap="1">
                          {" "}
                          <span> Name</span>
                          <span>
                            {sortColumn === "Name" && sortOrder === "asc" && (
                              <FaSortAlphaUp
                                style={{ marginTop: "1px", cursor: "pointer" }}
                                size={13}
                              />
                            )}
                            {sortColumn === "Name" && sortOrder === "desc" && (
                              <FaSortAlphaDownAlt
                                size={13}
                                style={{ marginTop: "1px", cursor: "pointer" }}
                              />
                            )}
                            {sortColumn !== "Name" && (
                              <FaSortAlphaUp
                                size={13}
                                style={{ marginTop: "1px", cursor: "pointer" }}
                              />
                            )}
                          </span>
                        </Text>
                      </Th>
                      <Th
                        onClick={() => handleSort("Phone1")}
                        padding={2}
                        w={15}
                        fontSize={"0.65rem"}
                        color={"whiteAlpha.900"}
                      >
                        <Text display="flex" justifyContent="start" gap="1">
                          {" "}
                          <span> Mob 1</span>
                          <span>
                            {sortColumn === "Phone1" && sortOrder === "asc" && (
                              <FaSortAlphaUp
                                style={{ marginTop: "1px", cursor: "pointer" }}
                                size={13}
                              />
                            )}
                            {sortColumn === "Phone1" &&
                              sortOrder === "desc" && (
                                <FaSortAlphaDownAlt
                                  size={13}
                                  style={{
                                    marginTop: "1px",
                                    cursor: "pointer",
                                  }}
                                />
                              )}
                            {sortColumn !== "Phone1" && (
                              <FaSortAlphaUp
                                size={13}
                                style={{ marginTop: "1px", cursor: "pointer" }}
                              />
                            )}
                          </span>
                        </Text>
                      </Th>
                      <Th
                        onClick={() => handleSort("CourseInfo.CourseName")}
                        padding={2}
                        w={15}
                        fontSize={"0.65rem"}
                        color={"whiteAlpha.900"}
                      >
                        <Text display="flex" justifyContent="start" gap="1">
                          {" "}
                          <span> Product</span>
                          <span>
                            {sortColumn === "CourseInfo.CourseName" &&
                              sortOrder === "asc" && (
                                <FaSortAlphaUp
                                  style={{
                                    marginTop: "1px",
                                    cursor: "pointer",
                                  }}
                                  size={13}
                                />
                              )}
                            {sortColumn === "CourseInfo.CourseName" &&
                              sortOrder === "desc" && (
                                <FaSortAlphaDownAlt
                                  size={13}
                                  style={{
                                    marginTop: "1px",
                                    cursor: "pointer",
                                  }}
                                />
                              )}
                            {sortColumn !== "CourseInfo.CourseName" && (
                              <FaSortAlphaUp
                                size={13}
                                style={{ marginTop: "1px", cursor: "pointer" }}
                              />
                            )}
                          </span>
                        </Text>
                      </Th>

                      <Th
                        onClick={() => handleSort("CoursePrice")}
                        padding={2}
                        w={15}
                        fontSize={"0.65rem"}
                        color={"whiteAlpha.900"}
                      >
                        <Text display="flex" justifyContent="start" gap="1">
                          {" "}
                          <span> Price</span>
                          <span>
                            {sortColumn === "CoursePrice" &&
                              sortOrder === "asc" && (
                                <FaSortAlphaUp
                                  style={{
                                    marginTop: "1px",
                                    cursor: "pointer",
                                  }}
                                  size={13}
                                />
                              )}
                            {sortColumn === "CoursePrice" &&
                              sortOrder === "desc" && (
                                <FaSortAlphaDownAlt
                                  size={13}
                                  style={{
                                    marginTop: "1px",
                                    cursor: "pointer",
                                  }}
                                />
                              )}
                            {sortColumn !== "CoursePrice" && (
                              <FaSortAlphaUp
                                size={13}
                                style={{ marginTop: "1px", cursor: "pointer" }}
                              />
                            )}
                          </span>
                        </Text>
                      </Th>
                      <Th
                        onClick={() => handleSort("Days")}
                        padding={2}
                        w={15}
                        fontSize={"0.65rem"}
                        color={"whiteAlpha.900"}
                      >
                        <Text display="flex" justifyContent="start" gap="1">
                          {" "}
                          <span> Days</span>
                          <span>
                            {sortColumn === "Days" && sortOrder === "asc" && (
                              <FaSortAlphaUp
                                style={{ marginTop: "1px", cursor: "pointer" }}
                                size={13}
                              />
                            )}
                            {sortColumn === "Days" && sortOrder === "desc" && (
                              <FaSortAlphaDownAlt
                                size={13}
                                style={{ marginTop: "1px", cursor: "pointer" }}
                              />
                            )}
                            {sortColumn !== "Days" && (
                              <FaSortAlphaUp
                                size={13}
                                style={{ marginTop: "1px", cursor: "pointer" }}
                              />
                            )}
                          </span>
                        </Text>
                      </Th>
                      <Th
                        onClick={() => handleSort("FollowupDate")}
                        padding={2}
                        w={15}
                        fontSize={"0.65rem"}
                        color={"whiteAlpha.900"}
                      >
                        <Text display="flex" justifyContent="start" gap="1">
                          {" "}
                          <span> Follow Up</span>
                          <span>
                            {sortColumn === "FollowupDate" &&
                              sortOrder === "asc" && (
                                <FaSortAlphaUp
                                  style={{
                                    marginTop: "1px",
                                    cursor: "pointer",
                                  }}
                                  size={13}
                                />
                              )}
                            {sortColumn === "FollowupDate" &&
                              sortOrder === "desc" && (
                                <FaSortAlphaDownAlt
                                  size={13}
                                  style={{
                                    marginTop: "1px",
                                    cursor: "pointer",
                                  }}
                                />
                              )}
                            {sortColumn !== "FollowupDate" && (
                              <FaSortAlphaUp
                                size={13}
                                style={{ marginTop: "1px", cursor: "pointer" }}
                              />
                            )}
                          </span>
                        </Text>
                      </Th>
                      <Th
                        padding={2}
                        w={15}
                        fontSize={"0.65rem"}
                        color={"whiteAlpha.900"}
                      >
                        Action
                      </Th>
                      {/* <Tr>
                        <Td
                          color="whiteAlpha.900"
                          bg="red.500"
                          colSpan={14}
                          textAlign="center"
                          fontWeight={700}
                        >
                          Something went wrong. Please try again later.
                        </Td>
                      </Tr> */}
                    </Tr>
                  </Thead>
                  <Tbody>
                    {isLoading ? (
                      <Loader />
                    ) : isLoading ? (
                      <Tr>
                        <Td
                          color="whiteAlpha.900"
                          bg="red.500"
                          colSpan={14}
                          textAlign="center"
                          fontWeight={700}
                        >
                          Something went wrong. Please try again later.
                        </Td>
                      </Tr>
                    ) : !isLoading && filteredData?.length === 0 ? (
                      <Tr>
                        {selectedAdmin === null ? (
                          <Td
                            color="whiteAlpha.900"
                            bg="yellow.500"
                            colSpan={14}
                            textAlign="center"
                            fontWeight={700}
                          >
                            First Select Admin
                          </Td>
                        ) : (
                          <Td
                            color="whiteAlpha.900"
                            bg="red.500"
                            colSpan={14}
                            textAlign="center"
                            fontWeight={700}
                          >
                            No Data Found
                          </Td>
                        )}
                      </Tr>
                    ) : (
                      sortedData?.map((el: any, index: any) => (
                        <Tr
                          key={el._id}
                          fontSize={"0.5rem"}
                          style={{ position: "relative" }}
                          bg={
                            el.Status === "Hot Lead"
                              ? "yellow.300"
                              : el.Status === "Final Lead"
                                ? "green.300"
                                : el.Status === "Unsubscribe"
                                  ? "red.500"
                                  : el.Status === "Open"
                                    ? "gray.50"
                                    : ""
                          }
                        >
                          <Td
                            fontWeight="500"
                            fontSize={"0.8rem"}
                            padding={2}
                            w={15}
                          >
                            {el.UID}
                          </Td>
                          <Td
                            fontWeight="500"
                            fontSize={"0.8rem"}
                            padding={2}
                            w={15}
                          >
                            {el?.AssignInfo?.Name}
                          </Td>
                          <Td
                            fontWeight="500"
                            fontSize={"0.8rem"}
                            padding={2}
                            w={15}
                          >
                            {el?.SourceInfo?.SourceName}
                          </Td>
                          <Td
                            fontWeight="500"
                            fontSize={"0.8rem"}
                            padding={2}
                            w={15}
                          >
                            {el?.CityInfo?.cityName}
                          </Td>

                          <Td
                            fontWeight="500"
                            fontSize={"0.8rem"}
                            padding={2}
                            w={15}
                          >
                            {el?.StatusInfo?.StatusName}
                          </Td>
                          <Td
                            fontWeight="500"
                            fontSize={"0.8rem"}
                            padding={2}
                            w={15}
                          >
                            {el?.BranchInfo?.BranchName}
                          </Td>
                          <Td
                            fontWeight="500"
                            fontSize={"0.8rem"}
                            padding={2}
                            w={15}
                          >
                            {new Date(el.EnquiryDate).toLocaleDateString()}
                          </Td>

                          <Td
                            fontWeight="500"
                            fontSize={"0.8rem"}
                            padding={2}
                            w={15}
                          >
                            {el.Name}
                          </Td>
                          <Td
                            fontWeight="500"
                            fontSize={"0.8rem"}
                            padding={2}
                            w={15}
                          >
                            {el.Phone1}
                          </Td>
                          <Td
                            fontWeight="500"
                            fontSize={"0.8rem"}
                            padding={2}
                            w={15}
                            textOverflow={"ellipsis"}
                            overflow={"hidden"}
                            whiteSpace={"nowrap"}
                          >
                            {/* {el.Course.length > 10 ? `${el.Course.slice(0, 10)}...` : el.Course} */}
                            {el?.CourseInfo?.CourseName}
                          </Td>

                          <Td
                            fontWeight="500"
                            fontSize={"0.8rem"}
                            padding={2}
                            w={15}
                          >
                            {el.CoursePrice}
                          </Td>
                          <Td
                            fontWeight="500"
                            fontSize={"0.8rem"}
                            padding={2}
                            w={15}
                          >
                            {" "}
                            {el.Days}
                          </Td>
                          <Td
                            fontWeight="500"
                            fontSize={"0.8rem"}
                            padding={2}
                            w={15}
                          >
                            {new Date(el.FollowupDate).toLocaleDateString()}
                          </Td>

                          <Td
                            textAlign={"center"}
                            fontSize={"0.8rem"}
                            // padding={2}
                            w={15}
                          >
                            {/* <Box>
                            {logs?.map((remark: any, index: any) => (
                              <div>
                                <Flex justify={"start"} alignItems={"center"}>
                                  <span>{1}</span>
                                  <span>{"Remarks"}</span>
                                </Flex>
                                <Flex>
                                  <span>{1}</span>
                                  <span>{"Remarks"}</span>
                                </Flex>
                              </div>
                            ))}
                          </Box> */}
                            <Box display={"flex"} gap="2">
                              <TfiEye
                                // id={`eye-${index}`}
                                color="#2b6cb0"
                                size={16}
                                cursor={"pointer"}
                                onClick={() => {
                                  handleSizeClick(size);
                                  setlogid(el._id);
                                  dispatch(getDataById(el._id, endpoint));
                                }}
                                onMouseEnter={() =>
                                  handleMouseEnter(index, el._id)
                                }
                                onMouseLeave={handleMouseLeave}

                              // onClick={() => navigate(`/log/${el._id}`)}
                              />

                              {/* {hoveredIndex === index && <HoverBox />} */}
                              {hoveredIndex === index || isHoveringHoverBox ? (
                                <HoverBox
                                  loading={loading}
                                  logs={logs}
                                  position={calculateHoverBoxPosition(index)}
                                  onMouseEnter={handleHoverBoxMouseEnter}
                                  onMouseLeave={handleHoverBoxMouseLeave}
                                />
                              ) : null}

                              {signinuser?.UserType === 2 && 3 && (
                                <AlertDialogDelete
                                  id={el?._id}
                                  handleDelete={handleDelete}
                                />
                              )}
                            </Box>
                          </Td>
                        </Tr>
                      ))
                    )}
                  </Tbody>
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
            justifySelf={'flex-end'}
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
      </Stack>
    </>
  );
};

export default LeadList;
