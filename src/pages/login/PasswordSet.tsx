import {
  Box,
  Button,
  HStack,
  Image,
  Input,
  InputGroup,
  InputRightElement,
  SimpleGrid,
  Text,
  VStack,
  useToast,
} from "@chakra-ui/react";
import React, { useState, useEffect } from "react";
import screen from "../login/images/loginscreen.svg";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import { useForm } from "react-hook-form";
import { postData } from "../../redux/actions/common.action";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { DevTool } from "@hookform/devtools";
import { useLocation } from "react-router-dom";
import { FaUserAlt } from "react-icons/fa";

interface FormData {
  Password: string;
  ConfirmPassword: string;
  type: string;
}
// "proxy": "https://crm-new.toppersmaterial.com/v1/admin",
const PasswordSet: React.FC = () => {
  interface Loading {
    loading: boolean;
  }
  const { loading } = useSelector((state: { common: Loading }) => state.common);
  const [show, setShow] = useState<boolean>(false);

  const location = useLocation();

  const searchParams = new URLSearchParams(location.search);
  const token = searchParams.get("token");
  const id = searchParams.get("id");

  console.log("Token:", token);
  console.log("ID:", id);

  const dispatch: any = useDispatch();
  const endpoint = "/auth/forgot-password";
  const navigate = useNavigate();
  const toast = useToast();
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<FormData>();

  const onSubmit = (data: FormData) => {
    if (data.Password !== data.ConfirmPassword) {
      toast({
        title: "Warning",
        description: "Password and Confirm Password do not match.",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return; // Stop form submission if passwords don't match
    }

    console.log({ ...data, type: "web" }, "hello");
    dispatch(
      postData(
        { Password: data.Password, token, id, type: "web" },
        endpoint,
        navigate,
        toast
      )
    );
  };

  return (
    <SimpleGrid
      columns={{ base: 1, sm: 1, md: 2, lg: 2 }}
      boxShadow={
        "rgba(50, 50, 93, 0.25) 0px 2px 5px -1px, rgba(0, 0, 0, 0.3) 0px 1px 3px -1px"
      }
      h="100%"
      my={10}
      borderRadius={10}
      mx={20}
      px={20}
    >
      <HStack display={{ sm: "none", md: "none", lg: "flex" }}>
        <Image src={screen} alt="err" />
      </HStack>
      <Box
        display={"flex"}
        justifyContent={"center"}
        m={"auto"}
        w={"full"}
        height={"500px"}
        bg="rgba(44, 130, 201, 0.6)"
      >
        <VStack
          margin={"auto"}
          height={"450px"}
          w={"fit-content"}
          py={5}
          px={10}
          bg={
            "linear-gradient(138.21deg, rgba(44, 130, 201, 0.6) -1.66%, rgba(44, 130, 201, 0.1) 103.91%)"
          }
          boxShadow={"rgba(0, 0, 0, 0.24) 0px 3px 8px"}
          borderRadius={20}
        >
          <Box mb="5" w="full">
            <Text fontWeight={"500"} fontSize={"2xl"} color={"white"}>
              Forget Password
            </Text>
          </Box>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Box>
              <Text
                fontWeight={"500"}
                fontSize={"sm"}
                mt={6}
                mb="0"
                ml="3"
                color={"white"}
              >
                Enter Password
              </Text>

              <InputGroup>
                <Input
                  autoComplete="off"
                  {...register("Password", {
                    required: "Password is required",
                  })}
                  borderColor={errors?.Password ? "red.500" : "gray.100"}
                  background={"#FFFFFF"}
                  borderRadius={"full"}
                  size={"md"}
                  w={300}
                  type={show ? "text" : "password"}
                />
                <InputRightElement h={"full"}>
                  <Button
                    size={"sm"}
                    borderRadius={"full"}
                    variant={"ghost"}
                    onClick={() => setShow((show) => !show)}
                  >
                    {show ? <ViewIcon /> : <ViewOffIcon />}
                  </Button>
                </InputRightElement>
              </InputGroup>
              {errors.Password && (
                <Text as={"span"} fontSize="sm" ml="3" color="red.500">
                  {errors.Password.message}
                </Text>
              )}
            </Box>
            <Box>
              <Text
                fontWeight={"500"}
                fontSize={"sm"}
                mt={6}
                mb="0"
                ml="3"
                color={"white"}
              >
                Enter Confirm Password
              </Text>

              <InputGroup>
                <Input
                  autoComplete="off"
                  {...register("ConfirmPassword", {
                    required: "ConfirmPassword is required",
                  })}
                  borderColor={errors?.ConfirmPassword ? "red.500" : "gray.100"}
                  background={"#FFFFFF"}
                  borderRadius={"full"}
                  size={"md"}
                  w={300}
                  type={show ? "text" : "ConfirmPassword"}
                />
                <InputRightElement h={"full"}>
                  <Button
                    size={"sm"}
                    borderRadius={"full"}
                    variant={"ghost"}
                    onClick={() => setShow((show) => !show)}
                  >
                    {show ? <ViewIcon /> : <ViewOffIcon />}
                  </Button>
                </InputRightElement>
              </InputGroup>
              {errors.ConfirmPassword && (
                <Text as={"span"} fontSize="sm" ml="3" color="red.500">
                  {errors.ConfirmPassword.message}
                </Text>
              )}
            </Box>

            <Box pt={10} pb={8} w="full">
              <Button
                isLoading={loading}
                loadingText="Please Wait..."
                type="submit"
                fontWeight={"500"}
                w="full"
                color={"whiteAlpha.900"}
                letterSpacing={1}
                size={"md"}
                bg="#2980B9"
                borderRadius={"full"}
                _hover={{ bg: "orange" }}
                boxShadow={"0px 4px 4px rgba(0, 0, 0, 0.5)"}
              >
                Create Now
              </Button>
            </Box>
          </form>
          <DevTool control={control} />
        </VStack>
      </Box>
    </SimpleGrid>
  );
};

export default PasswordSet;
