import React, { useEffect, useState } from "react";
import {
  Box,
  Text,
  Heading,
  Stack,
  HStack,
  VStack,
  IconButton,
  Button,
  Divider,
  Badge,
  useColorModeValue,
  useToast,
  Tooltip,
  Skeleton,
  SkeletonText,
  SkeletonCircle,
} from "@chakra-ui/react";
import { DeleteIcon, CheckIcon } from "@chakra-ui/icons";
import { useDispatch, useSelector } from "react-redux";
import format from "date-fns/format";
import { deleteData, getData, getDataById, updateData } from "../../../redux/actions/common.action";
import { useNavigate } from "react-router-dom";
import AlertDialogDelete from "../../../components/AlertDialouge";
import { isValid } from "date-fns/esm";
import UpdateTodoWithComment from "./UpdateTodoWithComment";

interface Todo {
  _id: string;
  note: string;
  status: "Pending" | "Completed";
  parentId: string;
  assignId: string;
  createdBy: string;
  createrName?: string;
  Branch: string;
  dueDate: Date;
  completedComment: string;
  createdAt: Date; // or Date if you parse it
  updatedAt: Date;
  timeStatus: string; // or Date
}

interface Todos {
  todos: Todo[];
}

interface TodoItem {
  // todos: Todo[];
  users: any;
  signinuser: any;
  user: any;
  loading: boolean;
}

const TodoDemo = () => {
  const { users, signinuser, user, loading } = useSelector((state: { common: TodoItem }) => state.common)
  const { todos } = useSelector((state: { common: Todos }) => state.common)
  console.log(users)
  const navigate = useNavigate();
  const toast = useToast();
  const dispatch: any = useDispatch();
  const endpoint = "todo";

  const [todoShow, setTodoShow] = useState<Todo[]>()

  const cardBg = useColorModeValue("white", "gray.700");
  const containerBg = useColorModeValue("gray.50", "gray.800");
  const completedTextColor = useColorModeValue("gray.500", "gray.400");
  const activeTextColor = useColorModeValue("black", "white");

  const handleTodos = (status: string) => {
    if (status === "Total") {
      setTodoShow(todos)
    } else if (status === "Completed") {
      const filteredT = todos?.filter((todo: Todo) => todo?.status === status)
      setTodoShow(filteredT)
    } else if (status === "Pending") {
      const filteredT = todos?.filter((todo: Todo) => todo?.status === status)
      setTodoShow(filteredT)
    }
  }

  useEffect(() => {
    if (todos?.length > 0) {
      setTodoShow(todos)
    }
  }, [todos])

  console.log(todoShow)

  useEffect(() => {
    if (!signinuser?.userId) return
    dispatch(getDataById(signinuser?.userId, 'user'));
  }, [signinuser?.userId]);

  const handleMarkComplete = (id: number, completedComment: string) => {
    console.log("hi")
    dispatch(updateData(id, endpoint, { status: "Completed", completedComment: completedComment }, navigate, toast)).then(() => {
      dispatch(getData(endpoint))
    })
  };

  const handleDelete = (id: any) => {
    dispatch(deleteData(id, endpoint, toast)).then(() => {
      dispatch(getData(endpoint))
    })
  }

  const totalCount = todos?.length;
  const completedCount = todos?.filter((t: any) => t?.status === "Completed").length;
  const pendingCount = todos?.filter((t: any) => t?.status === "Pending").length;

  return (
    <Box
      p={6}
      maxW="800px"
      mx="auto"
      bg={containerBg}
      borderRadius="xl"
      shadow="md"
      h="calc(88vh - 72px)" // Adjust as needed
      display="flex"
      flexDirection="column"
    >
      <Heading size="lg" mb={4}>
        Task List
      </Heading>

      <HStack spacing={4} mb={4}>
        <Badge colorScheme="blue" px={2} py={1} borderRadius="md" cursor={"pointer"} onClick={() => handleTodos("Total")}>
          Total: {totalCount}
        </Badge>
        <Badge colorScheme="green" px={2} py={1} borderRadius="md" cursor={"pointer"} onClick={() => handleTodos("Completed")}>
          Completed: {completedCount}
        </Badge>
        <Badge colorScheme="red" px={2} py={1} borderRadius="md" cursor={"pointer"} onClick={() => handleTodos("Pending")}>
          Pending: {pendingCount}
        </Badge>
      </HStack>

      {/* Scrollable VStack */}
      <Box
        flex="1"
        overflowY="auto"
        pr={1}
        css={{
          '&::-webkit-scrollbar': {
            width: '6px',
          },
          '&::-webkit-scrollbar-thumb': {
            background: '#A0AEC0',
            borderRadius: '8px',
          },
        }}
      >
        <VStack spacing={4} align="stretch">
          {loading ? (
            Array.from({ length: 3 }).map((_, index) => (
              <Box
                bg="white"
                p={4}
                borderRadius="md"
                shadow="sm"
                position="relative"
              >

                <Box display="flex" alignItems="center" justifyContent="space-between">
                  {/* Left Side: Note & Status */}
                  <Box>
                    <Skeleton height="20px" width="200px" mb={2} />
                    <Skeleton height="16px" width="60px" />
                  </Box>

                  {/* Right Side: Action Buttons */}
                  <HStack spacing={2}>
                    <SkeletonCircle size="8" />
                    <SkeletonCircle size="8" />
                  </HStack>
                </Box>

                <Box mt={4} display="flex" justifyContent="space-between">
                  <VStack align="start" spacing={2}>
                    <Skeleton height="12px" width="160px" />
                    <Skeleton height="12px" width="180px" />
                    <Skeleton height="12px" width="140px" />
                  </VStack>
                  <VStack align="end" spacing={2}>
                    <Skeleton height="12px" width="200px" />
                    <Skeleton height="12px" width="180px" />
                  </VStack>
                </Box>
              </Box>
            ))
          ) : todos?.length === 0 ? (
            <Text textAlign="center" color="gray.500">
              No Todos Added yet.
            </Text>
          ) : (
            todoShow?.map((todo: any) => (
              <Box
                key={todo._id}
                bg={cardBg}
                p={4}
                borderRadius="md"
                shadow="sm"
                position="relative"
              >
                {/* Badge for time status */}
                <Box
                  position="absolute"
                  top="0"
                  right="0"
                  bg={todo?.timeStatus === "With in time" ? "green" : "red.500"}
                  color="white"
                  px="2"
                  py="0.5"
                  fontSize="xs"
                  fontWeight="bold"
                  borderBottomLeftRadius="md"
                  zIndex="1"
                  textTransform="uppercase"
                  boxShadow="md"
                >
                  {todo?.timeStatus}
                </Box>

                {/* Main todo item */}
                <Box display="flex" alignItems="center" justifyContent="space-between">
                  <Box>
                    <Text
                      fontSize="md"
                      textDecoration={
                        todo.status === "Completed" ? "line-through" : "none"
                      }
                      color={
                        todo.status === "Completed"
                          ? completedTextColor
                          : activeTextColor
                      }
                    >
                      {todo.note}
                    </Text>
                    <Badge
                      mt={1}
                      colorScheme={todo.status === "Completed" ? "green" : "red"}
                    >
                      {todo.status}
                    </Badge>
                  </Box>

                  {/* Action Buttons */}
                  <HStack spacing={2}>
                    {todo?.status !== "Completed" &&
                      (() => {
                        const isUnauthorized =
                          user?.UserType === 3 &&
                          user?._id !== todo?.createdBy &&
                          user?._id !== todo?.assignId;

                        const box = (
                          <Box
                            cursor={isUnauthorized ? "not-allowed" : "pointer"}
                            pointerEvents={isUnauthorized ? "none" : "auto"}
                            opacity={isUnauthorized ? 0.5 : 1}
                          >
                            <UpdateTodoWithComment
                              id={todo?._id}
                              handleUpdate={handleMarkComplete}
                            />
                          </Box>
                        );

                        return (
                          <Tooltip
                            label={isUnauthorized ? "Not Authorised" : "Update status"}
                            hasArrow
                            placement="top"
                          >
                            <Box as="span">{box}</Box>
                          </Tooltip>
                        );
                      })()}

                    {user?.UserType === 3 && user?._id !== todo?.createdBy ? (
                      <Tooltip label="Not Authorised" hasArrow placement="top">
                        <span>
                          <Box
                            cursor="not-allowed"
                            pointerEvents="none"
                            opacity={0.5}
                            boxSize="30px"
                            border="1px"
                            borderRadius="md"
                            display="flex"
                            alignItems="center"
                            justifyContent="center"
                            bg="red.100"
                          >
                            <AlertDialogDelete
                              handleDelete={handleDelete}
                              id={todo?._id}
                            />
                          </Box>
                        </span>
                      </Tooltip>
                    ) : (
                      <Tooltip label="Delete" hasArrow placement="top">
                        <Box
                          boxSize="30px"
                          border="1px"
                          borderRadius="md"
                          display="flex"
                          alignItems="center"
                          justifyContent="center"
                          bg="red.100"
                          cursor="pointer"
                        >
                          <AlertDialogDelete
                            handleDelete={handleDelete}
                            id={todo?._id}
                          />
                        </Box>
                      </Tooltip>
                    )}
                  </HStack>
                </Box>

                {/* Footer Info */}
                <Box
                  mt={2}
                  display={"flex"}
                  justifyContent={"space-between"}
                  alignItems={"center"}
                  fontSize="0.75rem"
                >
                  <Box>
                    <Text>
                      Assigned to{" "}
                      {users?.find((u: any) => u?._id === todo?.assignId)?.Name}
                    </Text>
                    {todo?.status === "Completed" && (
                      <>
                        <Text>
                          Completed At{" "}
                          {format(new Date(todo?.updatedAt), "dd/MM/yyyy HH:mm")}
                        </Text>
                        <Text>Comment: {todo?.completedComment}</Text>
                      </>
                    )}
                  </Box>
                  <Box
                    display={"flex"}
                    flexDirection={"column"}
                    alignItems={"flex-end"}
                  >
                    <Text>
                      Created By {todo?.createrName} at{" "}
                      {format(new Date(todo?.createdAt), "dd/MM/yyyy HH:mm")}
                    </Text>
                    <Text
                      color={
                        new Date(todo?.dueDate) < new Date()
                          ? "red.500"
                          : "gray.700"
                      }
                    >
                      {isValid(new Date(todo?.dueDate))
                        ? `Due upto ${format(
                          new Date(todo.dueDate),
                          "dd/MM/yyyy HH:mm"
                        )}`
                        : "Invalid date"}
                    </Text>
                  </Box>
                </Box>
              </Box>
            ))
          )}
        </VStack>
      </Box>
    </Box>

  );
};

export default TodoDemo;
