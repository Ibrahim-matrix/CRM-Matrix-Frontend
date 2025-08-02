import {
  Box,
  Button,
  Input,
  SimpleGrid,
  Stack,
  Text,
  useToast,
} from "@chakra-ui/react";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import {
  getData,
  getDataById,
  getDataSuperAdmin,
  updateData,
  updateDataSuperAdmin,
} from "../../redux/actions/common.action";
import { useNavigate, useParams } from "react-router-dom";
import { DevTool } from "@hookform/devtools";

interface UpdateUsers {
  user: {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
    _id: string;
  };
}

interface FormValues {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
  _id: string;
}

const UpdatePassword = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<FormValues>();

  // Accessing the ID parameter from the URL
  const { id } = useParams();

  // Accessing the Redux dispatch function
  const dispatch: any = useDispatch();

  const { user } = useSelector(
    (state: { common: UpdateUsers }) => state.common
  );

  console.log(user)

  const onSubmit = (data: FormValues) => {
    // Convert UserType to a number
    // data.UserType = parseInt(data.UserType, 10);

    // Validate password length
    // if (data.Password && data.Password.length < 8) {
    //   alert("Password must be at least 8 characters long.");
    //   return;
    // }

    // Build the request body with only updated fields
    const requestBody: any = {};
    if (data.newPassword !== data.confirmPassword) {

      toast({
        title: "Passwords do not match.",
        status: "error",
        position: "top-right",
        isClosable: true,
      });
      return;
    } else {
      requestBody.newPassword = data.newPassword;
    }

    if (Object.keys(requestBody).length === 0) {
      console.log("No fields updated");
      return;
    }

    const payload = {
      currentPassword: data.currentPassword,
      Password: data.newPassword
    }

    // dispatch(
    //   updateDataSuperAdmin(id, "adminUsers", data, navigate, toast)
    // ).then(() => dispatch(getDataSuperAdmin("")));
    dispatch(updateData(id, 'user', payload, navigate, toast)).then(() => {
      dispatch(getData("user"))
      navigate("/user-list")
    })

  };

  return (
    <Stack h="100%">
      <form onSubmit={handleSubmit(onSubmit)}>
        <SimpleGrid columns={{md:1, lg:3}} px={10} py={1} gap={6}>
          <Box>
            <Text fontSize={"1rem"} ml="2" mb="0.5">
              Current Password
            </Text>
            <Input
              {...register("currentPassword", { required: true })}
              size={"sm"}
              borderColor={errors?.currentPassword ? "red.500" : "gray.400"}
              borderRadius={"0.25rem"}
            />
            {errors.currentPassword && (
              <Text color="red.500" fontSize="xs">
                Current Password is required.
              </Text>
            )}
          </Box>
          <Box>
            <Text fontSize={"1rem"} ml="2" mb="0.5">
              New Password
            </Text>
            <Input
              {...register("newPassword", { required: true })}
              size={"sm"}
              borderColor={errors?.newPassword ? "red.500" : "gray.400"}
              borderRadius={"0.25rem"}
              placeholder=""
            />
            {errors.newPassword && (
              <Text color="red.500" fontSize="xs">
                New Password is required.
              </Text>
            )}
          </Box>
          <Box>
            <Text fontSize={"1rem"} ml="2" mb="0.5">
              Confirm Password
            </Text>
            <Input
              {...register("confirmPassword", { required: true })}
              size={"sm"}
              borderColor={errors?.confirmPassword ? "red.500" : "gray.400"}
              borderRadius={"0.25rem"}
              placeholder=""
            />
            {errors.confirmPassword && (
              <Text color="red.500" fontSize="xs">
                Confirm Password is required.
              </Text>
            )}
          </Box>
        </SimpleGrid>
        <Box display={"flex"} justifyContent={"flex-end"} alignItems={"center"} px={10}>
          <Button
            onClick={() => navigate("/user-list")}
            variant="outline"
            mt={6}
            mr={2}
            size="sm"
            w="8.188rem"
            borderRadius="0.25rem"
            color="#FF9000"
            borderColor="#FF9000"
            fontWeight="700"
            fontSize="1rem"
            _hover={{ bg: "#FF9000", color: "white" }}
          >
            Back
          </Button>
          <Button
            type="submit"
            size={"sm"}
            mt={6}
           
            _hover={{ bg: "#FF9000" }}
            w="9.188rem"
            bg="#FF9000"
            borderRadius={"0.25rem"}
            color="whiteAlpha.900"
            fontWeight={"700"}
            fontSize={"1rem"}
          >
            Change Password
          </Button>
        </Box>
      </form>
      <DevTool control={control} />
    </Stack>
  );
};

export default UpdatePassword;
