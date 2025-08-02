import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
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
  useToast,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getData, getDataById, postData } from "../../redux/actions/common.action";
import { useForm, useWatch } from "react-hook-form";
import { DevTool } from "@hookform/devtools";
import Loader from "../../components/Loader";
import axios from "axios";
import { BASE_URL } from "../../config/RequestMethod";
import Cookies from "js-cookie";

interface LeadFormData {
  owner: string;
  Name: string;
  EnquiryDate: string;
  courseId: string;
  CoursePrice: string;
  Phone1: number;
  Phone2: number;
  Email: string;
  FollowupDate: string;
  statusId: string;
  branchId: string;
  cityId: string;
  sourceId: string;
  assignId: string;
  location: string;

  Remarks: string;
  lfd: string;
  days: string;
}

interface imageData {
  image: any;
}
const initialImage = {
  image: null,
};

const initialState: LeadFormData = {
  owner: "",
  Name: "",
  EnquiryDate: "",
  courseId: "",
  CoursePrice: "",
  Phone1: 0,
  Phone2: 0,
  Email: "",
  FollowupDate: "",
  statusId: "",
  branchId: "",
  cityId: "",
  sourceId: "",
  assignId: "",
  location: "",
  Remarks: "",
  lfd: "hi",
  days: "5",
};

type DataItem = {
  email: any;
  Phone1: any;
};

interface City {
  _id: string;
  cityName: string;
  branchId: string;
}

interface User {
  _id: string;
  Name: string;
  Branch: string[];
  City: string;
}

const AddNewLead: React.FC = () => {
  const [image, setImage] = useState<imageData>(initialImage);
  const [duplicate, setDuplicate] = useState<DataItem[]>([]);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
    watch,
  } = useForm<LeadFormData>();

  const selectedBranchId = useWatch({ control, name: 'branchId' })
  console.log(selectedBranchId)
  const selectedCityId = useWatch({ control, name: 'cityId' })

  useEffect(() => {
    // Reset city and assignId when branch changes
    setValue("cityId", "");
    setValue("assignId", "");
  }, [selectedBranchId]);

  useEffect(() => {
    // Reset assignId when city changes
    setValue("assignId", "");
  }, [selectedCityId]);

  console.log("branch : ", selectedBranchId)
  console.log("city : ", selectedCityId)

  const {
    branches,
    users,
    courses,
    statuses,
    cities,
    sources,
    signinuser,
    user,
    loading,
  } = useSelector((state: any) => state.common);

  useEffect(() => {
    if (!signinuser?.userId) return
    dispatch(getDataById(signinuser?.userId, 'user'));
  }, [signinuser?.userId]);

  const email = watch("Email");
  const Phone1 = watch("Phone1");

  useEffect(() => {
    dispatch(getData("branch"));
    dispatch(getData("course"));
    dispatch(getData("user"));
    dispatch(getData("status"));
    dispatch(getData("city"));
    dispatch(getData("source"));
  }, []);

  useEffect(() => {
  const now = new Date();
  // Get current UTC time in ms
  const utc = now.getTime() + now.getTimezoneOffset() * 60000;
  // Convert to IST (UTC + 5:30)
  const istTime = new Date(utc + 5.5 * 60 * 60 * 1000);
  // Format to YYYY-MM-DDTHH:MM
  const pad = (n:any) => n.toString().padStart(2, '0');

  const year = istTime.getFullYear();
  const month = pad(istTime.getMonth() + 1);
  const date = pad(istTime.getDate());
  const hours = pad(istTime.getHours());
  const minutes = pad(istTime.getMinutes());

  const formattedIST = `${year}-${month}-${date}T${hours}:${minutes}`;

  setValue("EnquiryDate", formattedIST);
}, [setValue]);


  useEffect(() => {
    //setting fixed branch value for the userTpye = 3
    if (signinuser.UserType === 3 && user?.Branch && Array.isArray(user.Branch) && user.Branch.length > 0) {
      const userType3Branch = branches?.filter(
        (b: any) => b?.BranchName === user.Branch[0]
      );
      console.log(userType3Branch[0]?._id);
      setValue("branchId", userType3Branch[0]?._id)
    }

    if (user && user?.UserProfile === "User" && signinuser?.UserType === 3 && user?.City && user?.Name) {
      //setting city for userProfile = "User"
      const userType3City = cities?.filter((c: City) => c?.cityName === user?.City)
      setValue("cityId", userType3City[0]?._id)

      //setting Assign to for userProfile = "User"
      const userType3Name = users?.filter((u: User) => u?.Name === user?.Name)
      console.log('===============================++++++++++++++++++++++++++++++++++===========================')
      console.log(userType3Name)
      setValue("assignId", userType3Name[0]?._id)
    }
  }, [user, branches, cities, users]);

  const [isLoading, setLoading] = useState(false);
  useEffect(() => {
    let debounce: NodeJS.Timeout;

    const fetchData = async () => {
      clearTimeout(debounce); // Clear the previous timeout

      debounce = setTimeout(async () => {
        const token = Cookies.get("token"); // Get the token from the cookie

        try {
          setLoading(true);

          const phoneString = String(Phone1); // Convert to string

          if (phoneString.length >= 6) {
            // Make the API request for Phone1
            const resPhone1 = await axios.get(
              `${BASE_URL}/lead/search-duplicate-lead?keyword=${phoneString}`,
              {
                headers: {
                  Authorization: `Bearer ${token}`, // Pass the token in the headers
                },
              }
            );
            const dataPhone1 = resPhone1.data.Data;

            setDuplicate(dataPhone1);
          } else if (email.includes("@")) {
            // Make the API request for email
            const resEmail = await axios.get(
              `${BASE_URL}/lead/search-duplicate-lead?keyword=${email}`,
              {
                headers: {
                  Authorization: `Bearer ${token}`, // Pass the token in the headers
                },
              }
            );
            const dataEmail = resEmail.data.Data;

            setDuplicate(dataEmail);
          } else {
            setDuplicate([]); // No valid query, clear the duplicate data
          }

          setLoading(false);
        } catch (error) {
          console.error(error);
          setLoading(false);
        }
      }, 500);
    };

    fetchData();

    return () => clearTimeout(debounce);
  }, [Phone1, email]);

  const dispatch: any = useDispatch();
  const endpoint: string = "lead";
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    if (name === "courseId") {
      const selectedCourse = courses.find(
        (course: any) => course._id === value
      );
      const CoursePrice = selectedCourse ? selectedCourse.CourseValue : "";
      setValue("CoursePrice", CoursePrice); // Use the name "CourseValue" to set the value
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setImage({
      ...image,
      image: file || null, // store selected file in formData`
    });
  };

  const navigate = useNavigate();
  const toast = useToast();
  const onSubmit = (formData: LeadFormData) => {
    const formDataToSend = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      formDataToSend.append(key, value);
    });
    formDataToSend.append("file", image.image);

    dispatch(postData(formData, endpoint, navigate, toast)).then(() => {
      //  dispatch(getData("branch"));
      // Navigate("/branch-list");
      setValue("Name", initialState.Name);
      setValue("EnquiryDate", initialState.EnquiryDate);
      setValue("courseId", initialState.courseId);
      setValue("CoursePrice", initialState.CoursePrice);
      setValue("Phone1", initialState.Phone1);
      // setValue("Phone2", initialState.Phone2);
      setValue("Email", initialState.Email);
      setValue("FollowupDate", initialState.FollowupDate);
      setValue("statusId", initialState.statusId);
      setValue("branchId", initialState.branchId);
      setValue("cityId", initialState.cityId);
      setValue("sourceId", initialState.sourceId);
      setValue("assignId", initialState.assignId);
      setValue("location", initialState.location);
      setValue("Remarks", initialState.Remarks);

      console.log("ok");
    });
  };

  const branchoptions = branches?.map((branch: any) => (
    <option key={branch._id} value={branch._id}>
      {branch.BranchName}
    </option>
  ));

  //city options only when the branch is selected
  const filteredCities = cities?.filter((city: any) => city?.branchId === selectedBranchId)
  const cityoptions = filteredCities?.map((el: any) => (
    <option key={el._id} value={el._id}>
      {el.cityName}
    </option>
  ));

  //user options only when the city is selected
  const selectedCity = cities?.find((city: any) => city._id === selectedCityId)
  const selectedCityName = selectedCity?.cityName

  const filteredUsers = users?.filter((user: any) => user.UserType === 3 && user?.City === selectedCityName)
  console.log(filteredUsers)
  const useroptions = filteredUsers?.map((user: any) =>
    <option key={user._id} value={user._id}>
      {user.Name}
    </option>
  );

  const courseoptions = courses?.map((course: any) => (
    <option key={course._id} value={course._id}>
      {course.CourseName}
    </option>
  ));

  // const useroptions = users?.map((user: any) => (
  //   <option key={user._id} value={user._id}>
  //     {user.Name}
  //   </option>
  // ));

  const statusoptions = statuses?.map((el: any) => (
    <option key={el._id} value={el._id}>
      {el.StatusName}
    </option>
  ));

  const sourceoptions = sources?.map((el: any) => (
    <option key={el._id} value={el._id}>
      {el.SourceName}
    </option>
  ));

  return (
    <Stack h="100%">
      {/* inputs starts */}
      <form onSubmit={handleSubmit(onSubmit)}>
        <SimpleGrid
          columns={[1, 1, 2, 3]} // Set the number of columns for different screen sizes
          autoFlow="row" // Set the flow of the grid items to row
          gap={5}
          px={[2, 5]} // Set the horizontal padding for different screen sizes
          py={[2, 5]} // Set the vertical padding for different screen sizes
          minWidth="250px"
        >
          <Box>
            <FormControl variant="floating" id="owner">
              <Input
                disabled
                autoComplete="off"
                {...register("owner")}
                borderColor={"gray.400"}
                borderRadius={"0.25rem"}
                size="sm"
                placeholder=" "
                value={signinuser.Name}
              />
              <FormLabel fontWeight={"400"} color={"gray.600"}>
                Owner
              </FormLabel>
            </FormControl>
          </Box>
          <Box>
            <FormControl variant="floating" id="name">
              <Input
                autoComplete="off"
                {...register("Name", {
                  required: "name is required",
                })}
                borderColor={errors?.Name ? "red.500" : "gray.400"}
                borderRadius={"0.25rem"}
                size="sm"
                placeholder=" "
              />
              <FormLabel fontWeight={"400"} color={"gray.600"}>
                Enter Name
              </FormLabel>
              {errors.Name && (
                <Text color="red.500" fontSize="xs">
                  name is required
                </Text>
              )}
            </FormControl>
          </Box>
          <Box>
            <FormControl variant="floating" id="EnquiryDate">
              <Input
                autoComplete="off"
                {...register("EnquiryDate", {
                  required: "EnquiryDate is required",
                })}
                borderColor={errors?.EnquiryDate ? "red.500" : "gray.400"}
                borderRadius={"0.25rem"}
                size="sm"
                type="datetime-local"
                placeholder=" "
              />
              <FormLabel fontWeight={"400"} color={"gray.600"}>
                Enquiry Date
              </FormLabel>
              {errors.EnquiryDate && (
                <Text color="red.500" fontSize="xs">
                  EnquiryDate is required
                </Text>
              )}
            </FormControl>
          </Box>
          <Box>
            <FormControl variant="floating" id="courseId">
              <Select
                autoComplete="off"
                {...register("courseId")}
                onChange={handleChange}
                size="sm"
                borderColor={errors?.courseId ? "red.500" : "gray.400"}
                borderRadius={"0.25rem"}
                placeholder=""
              >
                <option value="" selected disabled>
                  Select Product
                </option>
                {courseoptions}
              </Select>

              <FormLabel fontWeight={"400"} color={"gray.600"}>
                Enquiry Product
              </FormLabel>
            </FormControl>
          </Box>
          <Box>
            <FormControl variant="floating" id="CoursePrice">
              <Input
                autoComplete="off"
                {...register("CoursePrice")}
                onChange={handleChange}
                borderColor={"gray.400"}
                borderRadius={"0.25rem"}
                size="sm"
                placeholder=" "
              />
              <FormLabel fontWeight={"400"} color={"gray.600"}>
                Product Price
              </FormLabel>
              {errors.CoursePrice && (
                <Text color="red.500" fontSize="xs">
                  Product is required
                </Text>
              )}
            </FormControl>
          </Box>
          <Box>
            <FormControl variant="floating" id="Phone1">
              <Input
                maxLength={10}
                {...register("Phone1", {
                  required: "Phone1  is required",
                })}
                autoComplete="off"
                borderColor={errors?.Phone1 ? "red.500" : "gray.400"}
                borderRadius={"0.25rem"}
                size="sm"
                placeholder=" "
                type="number"
              />
              <FormLabel fontWeight={"400"} color={"gray.600"}>
                Enter Phone No. 1
              </FormLabel>
              {errors.Phone1 && (
                <Text color="red.500" fontSize="xs">
                  mobile number is required
                </Text>
              )}
            </FormControl>
          </Box>
          <Box>
            <FormControl variant="floating" id="Phone2">
              <Input
                maxLength={10}
                {...register("Phone2")}
                // borderColor={errors?.Phone2 ? "red.500" : "gray.400"}
                autoComplete="off"
                type="number"
                borderRadius={"0.25rem"}
                size="sm"
                placeholder=" "
              />

              <FormLabel fontWeight={"400"} color={"gray.600"}>
                Enter Phone No. 2
              </FormLabel>
              {/* {errors.Phone2 && (
                <Text color="red.500" fontSize="xs">
                  mobile number 2 is required
                </Text>
              )} */}
            </FormControl>
          </Box>
          <Box>
            <FormControl variant="floating" id="Email">
              <Input
                {...register("Email", {
                  required: "Email is required",
                })}
                borderColor={errors?.Email ? "red.500" : "gray.400"}
                name="Email"
                autoComplete="off"
                borderRadius={"0.25rem"}
                size="sm"
                placeholder=" "
              />
              <FormLabel fontWeight={"400"} color={"gray.600"}>
                Enter Email ID *
              </FormLabel>
              {errors.Email && (
                <Text color="red.500" fontSize="xs">
                  Email ID is required
                </Text>
              )}
            </FormControl>
          </Box>
          <Box>
            <FormControl variant="floating" id="FollowupDate">
              <Input
                {...register("FollowupDate", {
                  required: "FollowupDate date is required",
                })}
                borderColor={errors?.FollowupDate ? "red.500" : "gray.400"}
                autoComplete="off"
                size="sm"
                type="datetime-local"
                borderRadius={"0.25rem"}
              />
              <FormLabel fontWeight={"400"} color={"gray.600"}>
                Follow Up Date
              </FormLabel>
              {errors.FollowupDate && (
                <Text color="red.500" fontSize="xs">
                  FollowupDate date is required
                </Text>
              )}
            </FormControl>
          </Box>
          <Box>
            <FormControl variant="floating" id="statusId">
              <Select
                {...register("statusId", {
                  required: "Status is required",
                })}
                autoComplete="off"
                borderColor={errors?.statusId ? "red.500" : "gray.400"}
                size="sm"
                borderRadius={"0.25rem"}
                placeholder=""
              >
                {" "}
                <option value="" disabled selected>
                  Select Status
                </option>
                {statusoptions}
              </Select>
              <FormLabel fontWeight={"400"} color={"gray.600"}>
                Status
              </FormLabel>
              {errors.statusId && (
                <Text color="red.500" fontSize="xs">
                  Status is required
                </Text>
              )}
            </FormControl>
          </Box>
          <Box>
            <FormControl variant="floating" id="branchId">
              <Select
                isDisabled={signinuser?.UserType === 3}
                autoComplete="off"
                {...register("branchId", {
                  required: "Branch is required",
                })}
                size="sm"
                borderColor={errors?.branchId ? "red.500" : "gray.400"}
                borderRadius={"0.25rem"}
                placeholder=""
              >
                {" "}
                <option value="" disabled selected>
                  Select Branch
                </option>
                {branchoptions}
              </Select>
              <FormLabel fontWeight={"400"} color={"gray.600"}>
                Branch
              </FormLabel>
              {errors.branchId && (
                <Text color="red.500" fontSize="xs">
                  Branch is required
                </Text>
              )}
            </FormControl>
          </Box>
          <Box>
            <FormControl variant="floating" id="cityId">
              <Select
                disabled={!selectedBranchId || user?.UserProfile === "User"}
                autoComplete="off"
                {...register("cityId", {
                  required: "City is required",
                })}
                size="sm"
                borderColor={errors?.cityId ? "red.500" : "gray.400"}
                borderRadius={"0.25rem"}
                placeholder=""
              >
                {" "}
                <option value="" disabled selected>
                  {selectedBranchId ? "Select City" : 'Please Select Branch'}
                </option>
                {cityoptions}
              </Select>
              <FormLabel fontWeight={"400"} color={"gray.600"}>
                City
              </FormLabel>
              {errors.cityId && (
                <Text color="red.500" fontSize="xs">
                  City is required
                </Text>
              )}
            </FormControl>
          </Box>
          <Box>
            <FormControl variant="floating" id="sourceId">
              <Select
                autoComplete="off"
                {...register("sourceId", {
                  required: "Source is required",
                })}
                size="sm"
                borderColor={errors?.sourceId ? "red.500" : "gray.400"}
                borderRadius={"0.25rem"}
                placeholder=""
              >
                {" "}
                <option value="" disabled selected>
                  Select Source
                </option>
                {sourceoptions}
              </Select>
              <FormLabel fontWeight={"400"} color={"gray.600"}>
                Source
              </FormLabel>
              {errors.sourceId && (
                <Text color="red.500" fontSize="xs">
                  Source is required
                </Text>
              )}
            </FormControl>
          </Box>
          <Box>
            <FormControl variant="floating" id="assignId">
              <Select
                disabled={!selectedCityId || user?.UserProfile === "User"}
                autoComplete="off"
                {...register("assignId", {
                  required: "AssignTo is required",
                })}
                size="sm"
                borderColor={errors?.assignId ? "red.500" : "gray.400"}
                borderRadius={"0.25rem"}
                placeholder=""
              >
                {" "}
                <option value="" disabled selected>
                  {selectedCityId ? 'Select Assigned To' : 'Please Select city'}
                </option>
                {useroptions}
              </Select>
              <FormLabel fontWeight={"400"} color={"gray.600"}>
                Assign To
              </FormLabel>
              {errors.assignId && (
                <Text color="red.500" fontSize="xs">
                  Assigned To is required
                </Text>
              )}
            </FormControl>
          </Box>
          <Box>
            <FormControl variant="floating" id="location">
              <Input
                autoComplete="off"
                {...register("location", {
                  required: "location is required",
                })}
                size="sm"
                borderColor={errors?.location ? "red.500" : "gray.400"}
                borderRadius={"0.25rem"}
                placeholder=" "
              />
              <FormLabel fontWeight={"400"} color={"gray.600"}>
                Location
              </FormLabel>
              {errors.location && (
                <Text color="red.500" fontSize="xs">
                  location is required
                </Text>
              )}
            </FormControl>
          </Box>
          <Box>
            <Input
              autoComplete="off"
              onChange={handleImageChange}
              size="sm"
              type="file"
              name="image"
              borderColor={"gray.400"}
              borderRadius="0.25rem"
              placeholder="Enter User Profile"
              sx={{
                "::file-selector-button": {
                  bg: "gray.500",
                  color: "white",
                  ml: -5,
                  mt: 0.4,
                  py: 1.4,
                  px: 12,
                  mr: 15,

                  borderRadius: "0.25rem",
                  _hover: {
                    bg: "blue.600",
                  },
                },
              }}
              flexGrow={1}
            // onChange={handleFileChange}
            />
          </Box>
          <Box>
            <FormControl variant="floating" id="Remarks">
              <textarea
                {...register("Remarks", {
                  required: "Remarks is required",
                })}
                autoComplete="off"
                // onChange={handleChange}
                // size="xs"
                // borderColor={"gray.400"}
                // borderRadius={"0.25rem"}
                placeholder=" "
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

                  borderColor: errors?.location ? "red" : "#a0aec0",
                }}
              />
              <FormLabel fontWeight={"400"} color={"gray.600"}>
                Remarks
              </FormLabel>
              {errors.Remarks && (
                <Text color="red.500" fontSize="xs">
                  Remarks is required
                </Text>
              )}
            </FormControl>
          </Box>
          <Box
            display={"flex"}
            justifyContent={"flex-end"}
            alignItems={"center"}
          >
            <Button
              isLoading={loading}
              loadingText="Please wait..."
              type="submit"
              size={"sm"}
              _hover={{ bg: "#FF9000" }}
              w="8.188rem"
              bg="#FF9000"
              borderRadius={"0.25rem"}
              color="whiteAlpha.900"
              fontWeight={"700"}
              fontSize={"1rem"}
            >
              Submit
            </Button>
          </Box>{" "}
        </SimpleGrid>
        {/* inputs end */}
      </form>
      <SimpleGrid>
        <TableContainer className="tarun" whiteSpace={"nowrap"}>
          <Box overflowY="auto" height={200} maxHeight="200px">
            <Table variant="striped" colorScheme="gray" size="sm">
              <Thead
                bg={"blue.600"}
                color={"whiteAlpha.900"}
                position={"sticky"}
                borderRadius={"20px"}
                top="0"
              >
                <Tr>
                  <Th
                    p="2"
                    w="15"
                    fontSize={"0.65rem"}
                    color={"whiteAlpha.900"}
                  >
                    #
                  </Th>
                  <Th
                    p="2"
                    w="15"
                    fontSize={"0.65rem"}
                    color={"whiteAlpha.900"}
                  >
                    Ass To
                  </Th>
                  <Th
                    p="2"
                    w="15"
                    fontSize={"0.65rem"}
                    color={"whiteAlpha.900"}
                  >
                    Source
                  </Th>
                  <Th
                    p="2"
                    w="15"
                    fontSize={"0.65rem"}
                    color={"whiteAlpha.900"}
                  >
                    City
                  </Th>
                  <Th
                    p="2"
                    w="15"
                    fontSize={"0.65rem"}
                    color={"whiteAlpha.900"}
                  >
                    Name
                  </Th>
                  <Th
                    p="2"
                    w="15"
                    fontSize={"0.65rem"}
                    color={"whiteAlpha.900"}
                  >
                    Mob 1
                  </Th>
                  <Th
                    p="2"
                    w="15"
                    fontSize={"0.65rem"}
                    color={"whiteAlpha.900"}
                  >
                    Mob 2
                  </Th>

                  <Th
                    p="2"
                    w="15"
                    fontSize={"0.65rem"}
                    color={"whiteAlpha.900"}
                  >
                    Email
                  </Th>
                  <Th
                    p="2"
                    w="15"
                    fontSize={"0.65rem"}
                    color={"whiteAlpha.900"}
                  >
                    Product
                  </Th>
                  <Th
                    p="2"
                    w="15"
                    fontSize={"0.65rem"}
                    color={"whiteAlpha.900"}
                  >
                    Price
                  </Th>
                  <Th
                    p="2"
                    w="15"
                    fontSize={"0.65rem"}
                    color={"whiteAlpha.900"}
                  >
                    Days
                  </Th>
                  <Th
                    p="2"
                    w="15"
                    fontSize={"0.65rem"}
                    color={"whiteAlpha.900"}
                  >
                    FollowUp
                  </Th>
                </Tr>
              </Thead>
              {isLoading ? (
                <Loader />
              ) : (
                <Tbody>
                  {duplicate?.length === 0 ? (
                    <Tr>
                      <Td colSpan={14} textAlign="center" fontWeight={700}></Td>
                    </Tr>
                  ) : (
                    duplicate?.map((el: any) => (
                      <Tr key={el._id} fontSize={"0.5rem"}>
                        <Td fontSize={"0.8rem"} p="2" w="15">
                          {el.UID}
                        </Td>
                        <Td fontSize={"0.8rem"} p="2" w="15">
                          {el.AssignTo}
                        </Td>
                        <Td fontSize={"0.8rem"} p="2" w="15">
                          {el.Source}
                        </Td>
                        <Td fontSize={"0.8rem"} p="2" w="15">
                          {el.City}
                        </Td>
                        <Td fontSize={"0.8rem"} p="2" w="15">
                          {el.Name}
                        </Td>
                        <Td fontSize={"0.8rem"} p="2" w="15">
                          {el.Phone1}
                        </Td>
                        <Td
                          fontSize={"0.8rem"}
                          textAlign={"center"}
                          p="2"
                          w="15"
                        >
                          {el.Phone2}
                        </Td>

                        <Td fontSize={"0.8rem"} p="2" w="15">
                          {el.Email}
                        </Td>
                        <Td
                          fontSize={"0.8rem"}
                          p="2"
                          w="15"
                          textOverflow={"ellipsis"}
                          overflow={"hidden"}
                          whiteSpace={"nowrap"}
                        >
                          {/* {el.Course.length > 10 ? `${el.Course.slice(0, 10)}...` : el.Course} */}
                          {el.Course}
                        </Td>

                        <Td fontSize={"0.8rem"} p="2" w="15">
                          {" "}
                          {el.CoursePrice}
                        </Td>
                        <Td fontSize={"0.8rem"} p="2" w="15">
                          {el.Days2}
                        </Td>
                        <Td fontSize={"0.8rem"} p="2" w="15">
                          {new Date(el.FollowupDate).toLocaleDateString()}
                        </Td>
                        <Td
                          textAlign={"center"}
                          fontSize={"0.8rem"}
                          p="2"
                          w="15"
                        >
                          {" "}
                        </Td>
                      </Tr>
                    ))
                  )}
                </Tbody>
              )}
            </Table>
          </Box>
        </TableContainer>
      </SimpleGrid>
      <DevTool control={control} />
    </Stack>
  );
};

export default AddNewLead;
