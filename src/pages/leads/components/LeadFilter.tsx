import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Box, Input, SimpleGrid, Stack, Text } from "@chakra-ui/react";
import { DateRange } from "react-date-range";
import { MultiSelect } from "react-multi-select-component";
import format from "date-fns/format";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getData, getDataById } from "../../../redux/actions/common.action";
import Cookies from "js-cookie";
import { BASE_URL } from "../../../config/RequestMethod";
import axios from "axios";

interface Props {
  // setFilteredData: any;
  // cityOptions: any;
  // city: any[];
  // setCities: any;
  // setCityList: any;
  // sourceOptions: any;
  // source: any[];
  // setSource: any;
  // setSourceList: any;
  // statusOptions: any;
  // status: any[];
  // setStatus: any;
  // setStatusList: any;
  // branchOptions: any;
  // branch: any[];
  // setBranch: any;
  // setBranchList: any;
  // courseOptions: any;
  // course: any[];
  // setCourse: any;
  // setCourseList: any;
  // userOptions: any;
  // user: any[];
  // setUser: any;
  // setUserList: any;
  // followUpStart: any;
  // setOpen: any;
  // setOpenenq: any;
  // setfollowUpStart: any;
  // refOne: any;
  // refTwo: any;
  // open: any;
  // openenq: any;
  // enquiryDate: any;
  // setEnqDate: any;
}

interface Option {
  value: string;
  label: string;
}

interface Option {
  value: string;
  label: string;
}

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

const LeadFilter: React.FC<Props> = (
  //   {
  //   cityOptions,
  //   city = [],
  //   setCities,
  //   setCityList,
  //   sourceOptions,
  //   source = [],
  //   setSource,
  //   setSourceList,
  //   statusOptions,
  //   status = [],
  //   setStatus,
  //   setStatusList,
  //   branchOptions,
  //   branch = [],
  //   setBranch,
  //   setBranchList,
  //   courseOptions,
  //   course = [],
  //   setCourse,
  //   setCourseList,
  //   userOptions,
  //   // user = [],
  //   setUser,
  //   setUserList,
  //   followUpStart,
  //   setOpen,
  //   setOpenenq,
  //   setfollowUpStart,
  //   refOne,
  //   refTwo,
  //   open,
  //   openenq,
  //   enquiryDate,
  //   setEnqDate,
  // }
) => {

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

  const dispatch: any = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (!signinuser?.userId) return
    dispatch(getDataById(signinuser?.userId, 'user'));
  }, [signinuser?.userId]);

  const fetchData = async () => {
    if (signinuser?.UserType !== 1) {
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

  const [city, setCities] = useState<Option[]>([]);
  const [citylist, setCityList] = useState<string>("");

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
  // console.log(filteredData)
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

  // open close
  const [open, setOpen] = useState(false);
  const [openenq, setOpenenq] = useState(false);

  // get the target element to toggle
  const refOne = useRef<HTMLDivElement>(null);
  const refTwo = useRef<HTMLDivElement>(null);


  useEffect(() => {
    if (signinuser?.UserType === 3 && user?.Branch && Array.isArray(user?.Branch) && user?.Branch?.length > 0) {
      const userType3Branch = branches?.filter(
        (b: any) => b?.BranchName === user?.Branch[0]
      );
      console.log(userType3Branch[0]?._id);
      if (userType3Branch?.length > 0) {
        setBranch([{
          value: userType3Branch[0]?._id,
          label: userType3Branch[0]?.BranchName,
        }])
        setBranchList(userType3Branch[0]?._id)
      }
    }
    if (user && user?.UserProfile === "User" && signinuser?.UserType === 3 && user?.City && user?.Name) {
      //setting city for userProfile = "User"
      const userType3City = cities?.filter((c: City) => c?.cityName === user?.City)
      console.log('===============================++++++++++++++++++++++++++++++++++===========================')
      if (userType3City?.length > 0) {
        setCities([{
          value: userType3City[0]?._id,
          label: userType3City[0]?.cityName
        }])
        setCityList(userType3City[0]?._id)
      }

      //setting Assign to for userProfile = "User"
      const userType3Name = users?.filter((u: User) => u?.Name === user?.Name)
      console.log(userType3Name)
      if (userType3Name?.length > 0) {
        setUsers([{
          value: userType3Name[0]?._id,
          label: userType3Name[0]?.Name
        }])
        setUserList(userType3Name[0]?._id)
      }
    }
  }, [user, branches, cities, users]);


  //memoized cities - filtered with branchId
  const filteredCities = useMemo(() => {
    const filteredId = branch?.map(b => b?.value)
    if (filteredId?.length === 0) return
    return cities?.filter((city: City) => filteredId?.includes(city?.branchId)) || []
  }, [branch, cities])

  // 
  const filteredUsers = useMemo(() => {
    const selectedBranchNames = city?.map(b => b?.label); // branch.label = BranchName
    console.log(selectedBranchNames)
    if (selectedBranchNames?.length === 0) return [];
    console.log(users)
    const all = users?.filter((user: User) => selectedBranchNames?.includes(user?.City))
    console.log(all, '----------------------------------------------------------- -------------------------------')

    return users?.filter((user: User) => selectedBranchNames?.includes(user?.City)) || []
  }, [city, users]);


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


  const cityOptions: Option[] = filteredCities?.map((city: City) => ({
    value: city?._id,
    label: city?.cityName,
  }));
  const sourceOptions: Option[] = sources?.map((source: Source) => ({
    value: source?._id,
    label: source?.SourceName,
  }));
  const statusOptions: Option[] = statuses?.map((status: Status) => ({
    value: status?._id,
    label: status?.StatusName,
  }));
  const branchOptions: Option[] = branches?.map((branch: Branch) => ({
    value: branch?._id,
    label: branch?.BranchName,
  }));
  const courseOptions: Option[] = courses?.map((course: Course) => ({
    value: course?._id,
    label: course?.CourseName,
  }));
  const userOptions: Option[] = filteredUsers?.map((user: User) => ({
    value: user?._id,
    label: user?.Name,
  }));


  const [selectedAdmin, setSelectedAdmin] = useState<any>(null);
  const [url, setUrl] = useState("");

  const handleFilterSubmit = useCallback(async (): Promise<void> => {
    try {
      setIsLoading(true);
      const token = Cookies.get("token"); // Get the token from the cookie
      const newUrl =
        signinuser?.UserType === 1 && selectedAdmin
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
      setFilteredData(res?.data?.Data);
      // console.log("+++++++++++++++++++++", res?.data?.Data?.filter((u: any) => u?.BranchInfo?.BranchName === "kolkata"))
      setTotalPages(res?.data?.totalPages);
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


  return (

    // <Stack py="1" bg="whiteAlpha.900" borderRadius={"0.25rem"}>
    //   <SimpleGrid
    //     columns={{ sm: 2, md: 3, lg: 4 }}
    //     gap="0.5rem"
    //     px="2"
    //     zIndex={4}
    //   >
    //     <Box>
    //       <Text
    //         fontSize={"0.8rem"}
    //         ml="2"
    //         mb="0.1"
    //         fontWeight="500"
    //         color="black.600"
    //       >
    //         City
    //       </Text>
    //       <MultiSelect
    //         className="rmsc"
    //         options={cityOptions}
    //         value={city}
    //         onChange={(value: Option[]) => {
    //           setCities(value);
    //           setCityList(value?.map((city: Option) => city.value).join(","));
    //         }}
    //         labelledBy="Select City"
    //       />
    //     </Box>
    //     <Box>
    //       <Text
    //         fontSize={"0.8rem"}
    //         ml="2"
    //         mb="0.1"
    //         fontWeight="500"
    //         color="black.600"
    //       >
    //         Source
    //       </Text>
    //       <MultiSelect
    //         className="rmsc"
    //         options={sourceOptions}
    //         value={source}
    //         onChange={(value: Option[]) => {
    //           setSource(value);
    //           setSourceList(
    //             value?.map((source: Option) => source.value).join(",")
    //           );
    //         }}
    //         labelledBy="Select Source"
    //       />
    //     </Box>
    //     <Box>
    //       <Text
    //         fontSize={"0.8rem"}
    //         ml="2"
    //         mb="0.1"
    //         fontWeight="500"
    //         color="black.600"
    //       >
    //         Status
    //       </Text>
    //       <MultiSelect
    //         className="rmsc"
    //         options={statusOptions}
    //         value={status}
    //         onChange={(value: Option[]) => {
    //           setStatus(value);
    //           setStatusList(
    //             value?.map((status: Option) => status.value).join(",")
    //           );
    //         }}
    //         labelledBy="Select Source"
    //       />
    //     </Box>
    //     <Box>
    //       <Text
    //         fontSize={"0.8rem"}
    //         ml="2"
    //         mb="0.1"
    //         fontWeight="500"
    //         color="black.600"
    //       >
    //         Branch
    //       </Text>
    //       <MultiSelect
    //         className="rmsc"
    //         options={branchOptions}
    //         value={branch}
    //         onChange={(value: Option[]) => {
    //           setBranch(value);
    //           setBranchList(
    //             value?.map((branch: Option) => branch.value).join(",")
    //           );
    //         }}
    //         labelledBy="Select Source"
    //       />
    //     </Box>

    //     <Box>
    //       <Text
    //         fontSize={"0.8rem"}
    //         ml="2"
    //         mb="0.1"
    //         fontWeight="500"
    //         color="black.600"
    //       >
    //         Product
    //       </Text>
    //       <MultiSelect
    //         className="rmsc"
    //         options={courseOptions}
    //         value={course}
    //         onChange={(value: Option[]) => {
    //           setCourse(value);
    //           setCourseList(
    //             value?.map((branch: Option) => branch.value).join(",")
    //           );
    //         }}
    //         labelledBy="Select course"
    //       />
    //     </Box>
    //     <Box>
    //       <Text
    //         fontSize={"0.8rem"}
    //         ml="2"
    //         mb=""
    //         fontWeight="500"
    //         color="black.600"
    //       >
    //         Assign To
    //       </Text>
    //       <MultiSelect
    //         className="rmsc"
    //         options={userOptions}
    //         value={userd}
    //         onChange={(value: Option[]) => {
    //           setUsers(value);
    //           setUserList(value?.map((user: Option) => user.value).join(","));
    //         }}
    //         labelledBy="Select user"
    //       />
    //     </Box>
    //     <Box>
    //       <div className="calendarWrap">
    //         <Text
    //           fontSize={"0.8rem"}
    //           ml="2"
    //           mb=""
    //           fontWeight="500"
    //           color="black.600"
    //         >
    //           Follow Up Date
    //         </Text>
    //         <Input
    //           borderColor={"#A0AEC0"}
    //           size="sm"
    //           borderRadius={"0.25rem"}
    //           w="full"
    //           h="27px"
    //           placeholder="Select date"
    //           value={
    //             followUpStart[0].startDate && followUpStart[0].endDate
    //               ? `${format(
    //                 followUpStart[0].startDate,
    //                 "dd/MM/yyyy"
    //               )} to ${format(followUpStart[0].endDate, "dd/MM/yyyy")}`
    //               : ""
    //           }
    //           readOnly
    //           onClick={() => setOpen((open: any) => !open)}
    //         />

    //         <div ref={refOne}>
    //           {open && (
    //             <DateRange
    //               onChange={(item: any) => setfollowUpStart([item.selection])}
    //               editableDateInputs={true}
    //               moveRangeOnFirstSelection={false}
    //               ranges={followUpStart.map((r: any) => ({
    //                 ...r,
    //                 startDate: r.startDate || undefined,
    //                 endDate: r.endDate || undefined,
    //               }))}
    //               direction="horizontal"
    //               className="calendarElement"
    //             />
    //           )}
    //         </div>
    //       </div>
    //     </Box>
    //     <Box>
    //       <div className="calendarWrap">
    //         <Text
    //           fontSize={"0.8rem"}
    //           ml="2"
    //           mb=""
    //           fontWeight="500"
    //           color="black.600"
    //         >
    //           Enquiry Date
    //         </Text>
    //         <Input
    //           borderColor={"#A0AEC0"}
    //           size="sm"
    //           borderRadius={"0.25rem"}
    //           w="full"
    //           h="27px"
    //           placeholder="Select date"
    //           value={
    //             enquiryDate[0].startDate && enquiryDate[0].endDate
    //               ? `${format(
    //                 enquiryDate[0].startDate,
    //                 "dd/MM/yyyy"
    //               )} to ${format(enquiryDate[0].endDate, "dd/MM/yyyy")}`
    //               : ""
    //           }
    //           readOnly
    //           onClick={() => setOpenenq((openenq: any) => !openenq)}
    //         />

    //         <div ref={refTwo}>
    //           {openenq && (
    //             <DateRange
    //               onChange={(item: any) => setEnqDate([item.selection])}
    //               editableDateInputs={true}
    //               moveRangeOnFirstSelection={false}
    //               ranges={enquiryDate.map((r: any) => ({
    //                 ...r,
    //                 startDate: r.startDate || undefined,
    //                 endDate: r.endDate || undefined,
    //               }))}
    //               direction="horizontal"
    //               className="calendarElement"
    //             />
    //           )}
    //         </div>
    //       </div>
    //     </Box>
    //   </SimpleGrid>
    // </Stack>
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
  );
};

export default LeadFilter;

// <LeadFilter
//           cityOptions={cityOptions}
//           city={city}
//           setCities={setCities}
//           setCityList={setCityList}
//           sourceOptions={sourceOptions}
//           source={source}
//           setSource={setSource}
//           setSourceList={setSourceList}
//           statusOptions={statusOptions}
//           status={status}
//           setStatus={setStatus}
//           setStatusList={setStatusList}
//           branchOptions={branchOptions}
//           branch={branch}
//           setBranch={setBranch}
//           setBranchList={setBranchList}
//           courseOptions={courselist}
//           course={course}
//           setCourse={setCourse}
//           setCourseList={setCourseList}
//           userOptions={userOptions}
//           user={user}
//           setUser={setUser}
//           setUserList={setUserList}
//           followUpStart={followUpStart}
//           setOpen={setOpen}
//           setOpenenq={setOpenenq}
//           setfollowUpStart={setfollowUpStart}
//           refOne={refOne}
//           refTwo={refTwo}
//           open={open}
//           openenq={openenq}
//           enquiryDate={enquiryDate}
//           setEnqDate={setEnqDate}
//         />
