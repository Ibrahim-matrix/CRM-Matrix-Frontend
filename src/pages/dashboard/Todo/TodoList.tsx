// TodoList.tsx

import React, { useEffect, useState } from "react";
import {
  Box,
  Input,
  Button,
  SimpleGrid,
  Flex,
  Heading,
  useToast,
  FormControl,
  Select,
  FormLabel,
  Text,
  GridItem,
  VStack,
} from "@chakra-ui/react";
import Todo from "./Todo";
import TextareaAutosize from "react-textarea-autosize";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteDataSuperAdmin,
  getData,
  getDataById,
  getDataSuperAdmin,
  postData,
  postDataSuperAdmin,
  updateDataSuperAdmin,
} from "../../../redux/actions/common.action";
import { useNavigate } from "react-router-dom";
import TodoDemo from "./TodoDemo";
import { useForm, useWatch } from "react-hook-form";

interface TodoItem {
  todos: {
    _id: number;
    note: string;
    status: string;
  }[];
  branches: any;
  cities: any;
  users: any;
  signinuser: any;
  user: any;
  loading: boolean;
}

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

interface TodoFormData {
  assignId: string;
  todoText: string;
  branchId: string;
  cityId: string;
  dueDate: Date;
}

const TodoList: React.FC = () => {
  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors }
  } = useForm<TodoFormData>()

  const { todos, branches, cities, users, signinuser, user, loading } = useSelector((state: { common: TodoItem }) => state.common);
  console.log(todos)
  const navigate = useNavigate();
  const toast = useToast();
  const dispatch: any = useDispatch();
  const endpoint = "todo";

  const selectedBranchId = useWatch({ control, name: "branchId" })
  const selectedCityId = useWatch({ control, name: "cityId" })
  const selectedUserId = useWatch({ control, name: "assignId" })

  const [filteredUsers, setFilteredUsers] = useState<User[]>([])
  const [filteredCities, setFilteredCities] = useState<City[]>([])

  useEffect(() => {
    setFilteredCities(cities)
  }, [cities])


  useEffect(() => {
    // Reset city and assignId when branch changes
    setValue("cityId", "");
    setValue("assignId", "");
    // setFilteredCities(cities?.filter((city: any) => city?.branchId === selectedBranchId))
  }, [selectedBranchId]);

  useEffect(() => {
    // Reset assignId when city changes
    setValue("assignId", "");
  }, [selectedCityId]);

  // Fetch data from the API on component mount
  useEffect(() => {
    dispatch(getData("todo"))
    dispatch(getData("branch"));
    dispatch(getData("user"));
    dispatch(getData("city"));
  }, []);

  useEffect(() => {
    if (!signinuser?.userId) return
    dispatch(getDataById(signinuser?.userId, 'user'));
  }, [signinuser?.userId]);

  useEffect(() => {
    //setting fixed branch value for the userTpye = 3
    if (signinuser.UserType === 3 && user?.Branch && Array.isArray(user.Branch) && user.Branch.length > 0) {
      const userType3Branch = branches?.filter(
        (b: any) => b?.BranchName === user.Branch[0]
      );
      setValue("branchId", userType3Branch[0]?._id)
    }

    if (user && user?.UserProfile === "User" && signinuser?.UserType === 3 && user?.City && user?.Name) {
      //setting city for userProfile = "User"
      const userType3City = cities?.filter((c: City) => c?.cityName === user?.City)
      setValue("cityId", userType3City[0]?._id)

      //setting Assign to for userProfile = "User"
      const userType3Name = users?.filter((u: User) => u?.Name === user?.Name)
      setValue("assignId", userType3Name[0]?._id)
    }
  }, [user, branches, cities, users]);

  const branchoptions = branches?.map((branch: any) => (
    <option key={branch._id} value={branch._id}>
      {branch.BranchName}
    </option>
  ));

  useEffect(() => {
    setFilteredCities(cities?.filter((city: any) => city?.branchId === selectedBranchId))
  }, [selectedBranchId])

  //city options only when the branch is selected
  // const filteredCities = cities?.filter((city: any) => city?.branchId === selectedBranchId)
  const cityoptions = filteredCities?.map((el: any) => (
    <option key={el._id} value={el._id}>
      {el.cityName}
    </option>
  ));

  //user options only when the city is selected
  const selectedCity = cities?.find((city: any) => city._id === selectedCityId)
  const selectedCityName = selectedCity?.cityName

  const selectedBranch = branches?.find((branch: any) => branch?._id === selectedBranchId)
  const selectedBranchName = selectedBranch?.BranchName

  // user.UserType === 3 && (user?.City === selectedCityName || user?.Branch?.[0] === selectedBranchName)

  useEffect(() => {
    setFilteredUsers(users?.filter((user: any) => {
      if (user.UserType === 3) {
        if (selectedBranchId) {
          if (selectedCityId) {
            return user?.City === selectedCityName && user?.Branch?.[0] === selectedBranchName
          } else {
            return user?.Branch?.[0] === selectedBranchName
          }
        }
      }
    }))
  }, [selectedBranchId, selectedCityId])
  console.log(filteredUsers)
  const useroptions = filteredUsers?.map((user: any) =>
    <option key={user?._id} value={user?._id}>
      {user?.Name === signinuser?.Name ? "Self" : user?.Name}
    </option>
  );

  const onsubmit = (data: any) => {
    const payload = {
      note: data.todoText,
      assignId: data.assignId,
      dueDate: data.dueDate
    };

    dispatch(postData(payload, endpoint, navigate, toast)).then(() => {
      dispatch(getData(endpoint))
    })
    setValue("assignId", '')
    setValue("branchId", '')
    setValue("cityId", '')
    setValue("todoText", '')
  }

  return (
    <form onSubmit={handleSubmit(onsubmit)}>
      <SimpleGrid
        columns={{ base: 1, md: 1, lg: 5 }}
        gap={6}
        p={6}
        h={{ md: "178vh", lg: "89vh" }}
        bg="gray.50"
        borderRadius="lg"
        boxShadow="md"
        mx="auto"
      >
        {/* left Panel (Form) */}
        <GridItem colSpan={2} minH="100%">
          <Box
            bg="white"
            borderRadius="2xl"
            boxShadow="xl"
            p={{ base: 6, md: 6 }}
            h="full"
            overflow={"auto"}
            display="flex"
            flexDirection="column"
            justifyContent="flex-start"
          >
            {/* Header */}
            <Box mb={1}>
              <Heading
                as="h2"
                size="lg"
                mb={2}
                color="blue.600"
                fontWeight="bold"
                letterSpacing="wide"
              >
                Create Task
              </Heading>
              <Text fontSize="sm" color="gray.500">
                Easily manage and assign tasks using the form below.
              </Text>
            </Box>

            {/* Form Fields */}
            <VStack spacing={0} align="stretch" mb={5}>
              {/* Branch Select */}
              <FormControl isInvalid={!!errors?.branchId}>
                <FormLabel fontWeight="semibold" color="gray.700">Branch</FormLabel>
                <Select
                  size="sm"
                  placeholder={loading ? "loading Branch..." : "Select Branch"}
                  isDisabled={signinuser?.UserType === 3}
                  borderColor="gray.300"
                  {...register("branchId", { required: "Branch is required." })}
                >
                  {branchoptions}
                </Select>
                {errors.branchId && (
                  <Text color="red.500" fontSize="xs" mt={1}>
                    {errors.branchId.message}
                  </Text>
                )}
              </FormControl>

              {/* City Select */}
              <FormControl>
                <FormLabel fontWeight="semibold" color="gray.700">City</FormLabel>
                <Select
                  size="sm"
                  placeholder={selectedBranchId ? "Select City" : "Please Select Branch First"}
                  isDisabled={user?.UserProfile === "User"}
                  borderColor="gray.300"
                  {...register("cityId")}
                >
                  {cityoptions}
                </Select>
              </FormControl>

              {/* Assign To */}
              <FormControl isInvalid={!!errors?.assignId}>
                <FormLabel fontWeight="semibold" color="gray.700">Assign To</FormLabel>
                <Select
                  size="sm"
                  placeholder={selectedBranchId ? "Select Assigned To" : "Please Select Branch First"}
                  isDisabled={!selectedBranchId || user?.UserProfile === "User"}
                  borderColor="gray.300"
                  {...register("assignId", { required: "Assigned To is required." })}
                >
                  {useroptions}
                </Select>
                {errors.assignId && (
                  <Text color="red.500" fontSize="xs" mt={1}>
                    {errors.assignId.message}
                  </Text>
                )}
              </FormControl>

              {/* Due Date */}
              <FormControl isInvalid={!!errors?.dueDate}>
                <FormLabel fontWeight="semibold" color="gray.700">Due Date</FormLabel>
                <Input
                  type="datetime-local"
                  size="sm"
                  borderColor="gray.300"
                  {...register("dueDate", { required: "Due Date is required." })}
                />
                {errors.dueDate && (
                  <Text color="red.500" fontSize="xs" mt={1}>
                    {errors.dueDate.message}
                  </Text>
                )}
              </FormControl>
            </VStack>

            {/* Todo Input + Submit Button */}
            <Flex direction={{ base: "column", md: "row" }} gap={4}>
              {/* <FormControl isInvalid={!!errors?.todoText} flex={1}>
                <FormLabel fontWeight="semibold" color="gray.700">Task Description</FormLabel>
                <Input
                  size="sm"
                  placeholder="Enter task here..."
                  borderColor="gray.300"
                  {...register("todoText", { required: "Todo is required." })}
                />
                {errors.todoText && (
                  <Text color="red.500" fontSize="xs" mt={1}>
                    {errors.todoText.message}
                  </Text>
                )}
              </FormControl> */}
              <FormControl isInvalid={!!errors?.todoText} flex={1}>
                <FormLabel fontWeight="semibold" color="gray.700">
                  Task Description
                </FormLabel>
                <TextareaAutosize
                  minRows={4}
                  maxRows={6}
                  placeholder="Enter task here..."
                  style={{
                    width: "100%",
                    padding: "8px",
                    fontSize: "0.875rem",
                    borderRadius: "6px",
                    border: "1px solid #CBD5E0", // gray.300
                    outlineColor: "#3182ce", // blue.500 on focus
                    fontFamily: "inherit",
                  }}
                  {...register("todoText", { required: "Todo is required." })}
                />
                {errors.todoText && (
                  <Text color="red.500" fontSize="xs" mt={1}>
                    {errors.todoText.message}
                  </Text>
                )}
              </FormControl>
              <Button
                type="submit"
                size="sm"
                colorScheme="blue"
                px={8}
                fontWeight="medium"
                boxShadow="md"
                alignSelf={{ base: "stretch", md: "flex-end" }}
                mt={{ base: 2, md: 0 }}
                mb={errors.todoText ? "20px" : "0px"}
                h={9}
              >
                Add Task
              </Button>
            </Flex>
          </Box>
        </GridItem>



        {/* right Panel (Todo List Display) */}
        <GridItem colSpan={3} minH="100%" >
          <Box
            bg="white"
            borderRadius="2xl"
            boxShadow="xl"
            p={4}
          >
            <TodoDemo />
          </Box>

        </GridItem>

      </SimpleGrid>
    </form>

  );
};

export default TodoList;
