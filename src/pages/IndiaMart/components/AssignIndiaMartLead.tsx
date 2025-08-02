import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  useDisclosure,
  Button,
  Box,
  FormControl,
  FormLabel,
  // useToast,
  Input,
  Select,
  useToast,
  Divider,
  Spacer,
  Stack,
  Text,
  SimpleGrid,
} from "@chakra-ui/react";
import React, { useEffect, useState, useMemo } from "react";
import { getData, postData } from "../../../redux/actions/common.action";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import axios from "axios";
import Cookies from "js-cookie";
import { FiRefreshCcw } from "react-icons/fi";
import { BASE_URL } from "../../../config/RequestMethod";

// import { useNavigate } from "react-router-dom";
interface Props {
  leadId: any;
}

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

const AssignIndiaMartLead: React.FC<Props> = ({ leadId }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [leadData, setLeadData] = useState<any>({});
  const [singleleadId, setSingleleadId] = useState<any>("");

  const dispatch: any = useDispatch();

  const {
    branches,
    users,
    courses,
    statuses,
    cities,
    sources,
    // signinuser,
    loading,
  } = useSelector((state: any) => state.common);
  const {
    register,
    handleSubmit,
    // control,
    setValue,
    formState: { errors },
  } = useForm<LeadFormData>();

  useEffect(() => {
    dispatch(getData("branch"));
    dispatch(getData("course"));
    dispatch(getData("user"));
    dispatch(getData("status"));
    dispatch(getData("city"));
    dispatch(getData("source"));
  }, []);

  // const toast = useToast();

  // const navigate = useNavigate();
  const cancelRef = React.useRef<HTMLButtonElement>(null);
  console.log("leadid ---------------", leadId);

  const getSingleLeads = async () => {
    // Check if leadId is not null before making the API call
    if (leadId !== null) {
      console.log(leadId);

      try {
        const response = await axios.get(
          `${BASE_URL}lead/getUserLead/${leadId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`, // Pass the token in the headers
            },
          }
        );
        console.log(response.data);
        setLeadData(response?.data?.Data);
        setSingleleadId(leadId);
      } catch (error) {
        console.log(error);
      }
    }
  };

  useEffect(() => {
    getSingleLeads();
    // Set initial form field values based on leadData
    setValue("Name", leadData.SENDER_NAME || ""); // Set Name to leadData.SENDER_NAME, or an empty string if SENDER_NAME is undefined
    setValue("Phone1", leadData.SENDER_MOBILE || ""); // Set Phone1 to leadData.SENDER_MOBILE, or an empty string if SENDER_MOBILE is undefined
    setValue("Email", leadData.SENDER_EMAIL || "");
    setValue("Phone2", leadData.SENDER_PHONE_ALT || "");
    setValue("location", leadData.SENDER_ADDRESS || "");
    setValue("Remarks", leadData.QUERY_MESSAGE || "");
    setValue("EnquiryDate", leadData.QUERY_TIME || "");
  }, [leadId]); // Fetch data when leadId changes

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    if (name === "EnquiryCourse") {
      const selectedCourse = courses.find(
        (course: any) => course.CourseName === value
      );

      const CoursePrice = selectedCourse ? selectedCourse.CourseValue : "";
      setValue("CoursePrice", CoursePrice); // Use the name "CourseValue" to set the value
    }
  };

  const endpoint = "lead/assign-to-user";
  const navigate = useNavigate();
  const toast = useToast();
  const onSubmit = (formData: LeadFormData, leadId: any) => {
    dispatch(
      postData({ ...formData, leadId: singleleadId }, endpoint, navigate, toast)
    ).then(() => {
      setValue("Name", initialState.Name);
      setValue("EnquiryDate", initialState.EnquiryDate);
      setValue("courseId", initialState.courseId);
      setValue("CoursePrice", initialState.CoursePrice);
      setValue("Phone1", initialState.Phone1);
      setValue("Phone2", initialState.Phone2);
      setValue("Email", initialState.Email);
      setValue("FollowupDate", initialState.FollowupDate);
      setValue("statusId", initialState.statusId);
      setValue("branchId", initialState.branchId);
      setValue("cityId", initialState.cityId);
      setValue("sourceId", initialState.sourceId);
      setValue("assignId", initialState.assignId);
      setValue("location", initialState.location);
      setValue("Remarks", initialState.Remarks);
    });
  };

  const branchoptions = useMemo(
    () =>
      branches?.map((branch: any) => (
        <option key={branch._id} value={branch._id}>
          {branch.BranchName}
        </option>
      )),
    [branches]
  );

  const courseoptions = useMemo(
    () =>
      courses?.map((course: any) => (
        <option key={course._id} value={course._id}>
          {course.CourseName}
        </option>
      )),
    [courses]
  );

  const useroptions = useMemo(
    () =>
      users?.map((user: any) => (
        <option key={user._id} value={user._id}>
          {user.Name}
        </option>
      )),
    [users]
  );

  const statusoptions = useMemo(
    () =>
      statuses?.map((el: any) => (
        <option key={el._id} value={el._id}>
          {el.StatusName}
        </option>
      )),
    [statuses]
  );

  const cityoptions = useMemo(
    () =>
      cities?.map((el: any) => (
        <option key={el._id} value={el._id}>
          {el.cityName}
        </option>
      )),
    [cities]
  );

  const sourceoptions = useMemo(
    () =>
      sources?.map((el: any) => (
        <option key={el._id} value={el._id}>
          {el.SourceName}
        </option>
      )),
    [sources]
  );

  const token = Cookies.get("token");

  return (
    <>
      <Box onClick={onOpen}>
        <Button
          size="xs"
          fontSize={"10px"}
          fontWeight={"medium"}
          mr="4"
          colorScheme="orange"
          variant="outline"
          color="orange.500"
          px="2"
        >
          Assign Lead
        </Button>
      </Box>

      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
      >
        <AlertDialogOverlay
          bg="blackAlpha.300"
          backdropFilter="blur(5px) hue-rotate(90deg)"
        >
          <form
            onSubmit={handleSubmit((formData) => onSubmit(formData, leadId))}
          >
            <AlertDialogContent maxW="60rem">
              <AlertDialogHeader fontSize="lg" fontWeight="bold">
                {/* Update Price */}
              </AlertDialogHeader>

              <AlertDialogBody>
                <Stack h="100%" mt={1}>
                  <Box
                    px={2}
                    display={"flex"}
                    justifyContent={"space-between"}
                    alignItems={"center"}
                  >
                    <Text
                      color={"#000000"}
                      fontSize={"1.25rem"}
                      fontWeight={"600"}
                    >
                      Lead Details
                    </Text>
                    <Spacer />
                    <Box mt="2" ml="3">
                      <Button
                        size={"xs"}
                        borderRadius={"full"}
                        // onClick={() => dispatch(getData(endpoint))}
                      >
                        <FiRefreshCcw />
                      </Button>
                    </Box>
                  </Box>
                  <Divider
                    bg="gray.300" // Set the background color to dark gray
                    height="2px" // Set the height of the divider
                  />
                </Stack>
                <SimpleGrid
                  columns={[1, 1, 2, 3]} // Set the number of columns for different screen sizes
                  autoFlow="row" // Set the flow of the grid items to row
                  gap={5}
                  px={[2, 5]} // Set the horizontal padding for different screen sizes
                  mt={8}
                >
                  <Box>
                    <FormControl variant="floating" id="assignId">
                      <Select
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
                          Select Assigned To
                        </option>
                        {useroptions}
                      </Select>
                      <FormLabel fontWeight={"400"} color={"gray.600"}>
                        Assigned To
                      </FormLabel>
                      {errors.assignId && (
                        <Text color="red.500" fontSize="xs">
                          Assigned To is required
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
                    <FormControl variant="floating" id="branchId">
                      <Select
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
                    <FormControl variant="floating" id="cityId">
                      <Select
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
                          Select City
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
                    <FormControl variant="floating" id="Email">
                      <Input
                        name="Email"
                        autoComplete="off"
                        borderRadius={"0.25rem"}
                        size="sm"
                        value={leadData.SENDER_EMAIL}
                      />
                      <FormLabel fontWeight={"400"} color={"gray.600"}>
                        Email ID
                      </FormLabel>
                    </FormControl>
                  </Box>
                  <Box>
                    <FormControl variant="floating" id="EnquiryDate">
                      <Input
                        autoComplete="off"
                        borderRadius={"0.25rem"}
                        size="sm"
                        type="datetime-local"
                        value={leadData.QUERY_TIME}
                      />
                      <FormLabel fontWeight={"400"} color={"gray.600"}>
                        Enquiry Date
                      </FormLabel>
                    </FormControl>
                  </Box>
                  <Box>
                    <FormControl variant="floating" id="FollowupDate">
                      <Input
                        {...register("FollowupDate", {
                          required: "FollowupDate date is required",
                        })}
                        borderColor={
                          errors?.FollowupDate ? "red.500" : "gray.400"
                        }
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
                    <FormControl variant="floating" id="Name">
                      <Input
                        autoComplete="off"
                        name="Name"
                        borderColor={errors?.Name ? "red.500" : "gray.400"}
                        borderRadius={"0.25rem"}
                        size="sm"
                        value={leadData.SENDER_NAME}
                      />
                      <FormLabel fontWeight={"400"} color={"gray.600"}>
                        Name
                      </FormLabel>
                    </FormControl>
                  </Box>

                  <Box>
                    <FormControl variant="floating" id="Phone1">
                      <Input
                        maxLength={10}
                        autoComplete="off"
                        borderColor={errors?.Phone1 ? "red.500" : "gray.400"}
                        borderRadius={"0.25rem"}
                        size="sm"
                        value={leadData.SENDER_MOBILE}
                      />
                      <FormLabel fontWeight={"400"} color={"gray.600"}>
                        Phone No. 1
                      </FormLabel>
                    </FormControl>
                  </Box>

                  <Box>
                    <FormControl variant="floating" id="Phone2">
                      <Input
                        maxLength={10}
                        borderColor={errors?.Phone2 ? "red.500" : "gray.400"}
                        autoComplete="off"
                        borderRadius={"0.25rem"}
                        size="sm"
                        value={leadData.SENDER_MOBILE_ALT}
                      />

                      <FormLabel fontWeight={"400"} color={"gray.600"}>
                        Phone No. 2
                      </FormLabel>
                    </FormControl>
                  </Box>

                  <Box>
                    <FormControl variant="floating" id="location">
                      <Input
                        autoComplete="off"
                        size="sm"
                        borderColor={errors?.location ? "red.500" : "gray.400"}
                        borderRadius={"0.25rem"}
                        value={leadData.SENDER_ADDRESS}
                      />
                      <FormLabel fontWeight={"400"} color={"gray.600"}>
                        Location
                      </FormLabel>
                    </FormControl>
                  </Box>
                  <Box>
                    <FormControl variant="floating" id="location">
                      <Input
                        autoComplete="off"
                        size="sm"
                        borderColor={errors?.location ? "red.500" : "gray.400"}
                        borderRadius={"0.25rem"}
                        value={leadId}
                      />
                      <FormLabel fontWeight={"400"} color={"gray.600"}>
                        Location
                      </FormLabel>
                    </FormControl>
                  </Box>

                  <Box>
                    <FormControl variant="floating" id="Remarks">
                      <textarea
                        autoComplete="off"
                        value={leadData.QUERY_MESSAGE}
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
                    </FormControl>
                  </Box>
                </SimpleGrid>
                {/* inputs end */}
              </AlertDialogBody>

              <AlertDialogFooter>
                <Button
                  ref={cancelRef}
                  onClick={onClose}
                  fontSize={"1rem"}
                  fontWeight={"700"}
                  borderRadius={"0.25rem"}
                  size={"sm"}
                  w="8.188rem"
                  mx={4}
                >
                  Cancel
                </Button>

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
                    // onClick={onSubmit}
                  >
                    Assign Now
                  </Button>
                </Box>
              </AlertDialogFooter>
            </AlertDialogContent>
          </form>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
};
export default AssignIndiaMartLead;
