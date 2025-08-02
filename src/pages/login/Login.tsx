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
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import screen from "../login/images/loginscreen.svg";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import { FaUserAlt } from "react-icons/fa";
import { useForm } from "react-hook-form";
import { postData } from "../../redux/actions/common.action";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { DevTool } from "@hookform/devtools";

interface FormData {
  Email: string;
  Password: string;
  type: string;
}

interface FormData2 {
  Email: string;
  type: string;
}

const Login: React.FC = () => {
  interface Loading {
    loading: boolean;
  }

  const { loading } = useSelector((state: { common: Loading }) => state.common);
  const [show, setShow] = useState<boolean>(false);
  const [forgotPassword, setForgotPassword] = useState<boolean>(false); // State to track if "Forgot password?" is clicked
  const [loginNow, setLoginNow] = useState<boolean>(false); // State to track if "Login Now" is clicked

  const dispatch: any = useDispatch();
  const endpoint = "auth/signin";
  const endpoint2 = "auth/request-forgot-password";

  const navigate = useNavigate();
  const toast = useToast();

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      Email: "",
      Password: "",
      type: "",
    },
  });

  useEffect(() => {
    // Reset form values when component mounts
    reset({
      Email: "",
      Password: "",
      type: "",
    });
  }, [reset]);

  const {
    register: register2,
    handleSubmit: handleSubmit2,
    reset: reset2,
    formState: { errors: errors2 },
  } = useForm<FormData2>();

  const onSubmit = (data: FormData) => {
    console.log({ ...data, type: "web" }, "hello");
    dispatch(postData({ ...data, type: "web" }, endpoint, navigate, toast));
  };

  const onSubmit2 = (data: FormData2) => {
    console.log({ ...data, type: "web" }, "hello Submit 2");
    dispatch(postData({ ...data, type: "web" }, endpoint2, navigate, toast)).then(() => { setForgotPassword(false); reset2() })
  };

  // Function to handle "Forgot password?" click
  const handleForgotPasswordClick = () => {
    setForgotPassword(true);
  };

  // Function to handle "Go Back" click
  const handleGoBackClick = () => {
    setForgotPassword(false);
    setLoginNow(false);
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
        bg="rgba(255, 144, 0, 0.57)"
      >
        <VStack
          margin={"auto"}
          height={"450px"}
          w={"fit-content"}
          py={5}
          px={10}
          bg={
            " linear-gradient(138.21deg, rgba(255, 255, 255, 0.6) -1.66%, rgba(255, 255, 255, 0.1) 103.91%)"
          }
          boxShadow={"rgba(0, 0, 0, 0.24) 0px 3px 8px"}
          borderRadius={20}
        >
          <Box mb="5" w="full">
            <Text fontWeight={"500"} fontSize={"2xl"}>
              {forgotPassword
                ? "Forgot Password..!"
                : loginNow
                  ? "Login Now"
                  : "Welcome Back...!"}
            </Text>
          </Box>
          <AnimatePresence custom={loginNow}>
            {!forgotPassword && !loginNow ? ( // Render the login form
              <motion.form
                key={forgotPassword ? "forgot-form" : "login-form"}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                onSubmit={handleSubmit(onSubmit)}
                autoComplete="off"
              >
                <Box>
                  <Text fontWeight={"500"} fontSize={"sm"} mt={3} mb="0" ml="3">
                    Enter Username
                  </Text>
                  <InputGroup>
                    <Input
                      autoComplete="new-email"
                      {...register("Email", {
                        required: "Email is required",
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                          message: "Invalid email address",
                        },
                      })}
                      borderColor={errors?.Email ? "red.500" : "gray.100"}
                      background={"#FFFFFF"}
                      borderRadius={"full"}
                      size={"md"}
                      w={300}
                      type={"text"}
                    />
                    <InputRightElement h={"full"}>
                      <Button
                        size={"sm"}
                        borderRadius={"full"}
                        variant={"ghost"}
                      // onClick={handleClick}
                      >
                        <FaUserAlt />
                      </Button>
                    </InputRightElement>
                  </InputGroup>
                  {errors.Email && (
                    <Text as={"span"} fontSize="sm" ml="3" color="red.500">
                      {errors.Email.message}
                    </Text>
                  )}
                </Box>
                <Box>
                  <Text fontWeight={"500"} fontSize={"sm"} mt={6} mb="0" ml="3">
                    Enter Password
                  </Text>

                  <InputGroup>
                    <Input
                      autoComplete="new-password"
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
                  <Box textAlign={"end"} mt="2">
                    <Text
                      fontSize={"0.8rem"}
                      onClick={handleForgotPasswordClick}
                      style={{ cursor: "pointer" }}
                    >
                      Forgot password?
                    </Text>
                  </Box>
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
                    bg={"#FF9000"}
                    borderRadius={"full"}
                    _hover={{ bg: "orange" }}
                    boxShadow={"0px 4px 4px rgba(0, 0, 0, 0.5)"}
                  >
                    Login
                  </Button>
                </Box>
              </motion.form>
            ) : forgotPassword ? ( // Render the "Forgot password" form
              <motion.form
                key="forgot-password-form"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                onSubmit={handleSubmit2(onSubmit2)}
              >
                <Box>
                  <Text fontWeight={"500"} fontSize={"sm"} mt={3} mb="0" ml="3">
                    Enter User Email
                  </Text>
                  <InputGroup>
                    <Input
                      autoComplete="off"
                      {...register2("Email", {
                        required: "Email is required",
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                          message: "Invalid email address",
                        },
                      })}
                      borderColor={errors2?.Email ? "red.500" : "gray.100"}
                      background={"#FFFFFF"}
                      borderRadius={"full"}
                      size={"md"}
                      w={300}
                      type={"text"}
                    />
                  </InputGroup>
                  {errors2.Email && (
                    <Text as={"span"} fontSize="sm" ml="3" color="red.500">
                      {errors2.Email.message}
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
                    bg={"#FF9000"}
                    borderRadius={"full"}
                    _hover={{ bg: "orange" }}
                    boxShadow={"0px 4px 4px rgba(0, 0, 0, 0.5)"}
                  >
                    Submit
                  </Button>
                </Box>
                <Box textAlign="center" mt={2}>
                  <Text
                    fontSize={"0.8rem"}
                    onClick={handleGoBackClick}
                    style={{ cursor: "pointer" }}
                  >
                    Go Back
                  </Text>
                </Box>
              </motion.form>
            ) : (
              // Render the "Login Now" form
              <motion.form
                key="login-now-form"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                onSubmit={handleSubmit(onSubmit)}
              >
                <Box>
                  <Text fontWeight={"500"} fontSize={"sm"} mt={3} mb="0" ml="3">
                    Enter Username
                  </Text>
                  <InputGroup>
                    <Input
                      autoComplete="off"
                      {...register("Email", {
                        required: "Email is required",
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                          message: "Invalid email address",
                        },
                      })}
                      borderColor={errors?.Email ? "red.500" : "gray.100"}
                      background={"#FFFFFF"}
                      borderRadius={"full"}
                      size={"md"}
                      w={300}
                      type={"text"}
                    />
                    <InputRightElement h={"full"}>
                      <Button
                        size={"sm"}
                        borderRadius={"full"}
                        variant={"ghost"}
                      // onClick={handleClick}
                      >
                        <FaUserAlt />
                      </Button>
                    </InputRightElement>
                  </InputGroup>
                  {errors.Email && (
                    <Text as={"span"} fontSize="sm" ml="3" color="red.500">
                      {errors.Email.message}
                    </Text>
                  )}
                </Box>
                <Box>
                  <Text fontWeight={"500"} fontSize={"sm"} mt={6} mb="0" ml="3">
                    Enter Password
                  </Text>

                  <InputGroup>
                    <Input
                      autoComplete="off"
                      // {...register("Password", {
                      //   required: "Password is required",
                      // })}
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
                  <Box textAlign={"end"} mt="2">
                    <Text
                      fontSize={"0.8rem"}
                      onClick={handleForgotPasswordClick}
                      style={{ cursor: "pointer" }}
                    >
                      Forgot password?
                    </Text>
                  </Box>
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
                    bg={"#FF9000"}
                    borderRadius={"full"}
                    _hover={{ bg: "orange" }}
                    boxShadow={"0px 4px 4px rgba(0, 0, 0, 0.5)"}
                  >
                    Login
                  </Button>
                </Box>
                <Box textAlign="center" mt={2}>
                  <Text
                    fontSize={"0.8rem"}
                    onClick={handleGoBackClick}
                    style={{ cursor: "pointer" }}
                  >
                    Go Back
                  </Text>
                </Box>
              </motion.form>
            )}
          </AnimatePresence>
          <DevTool control={control} />
        </VStack>
      </Box>
    </SimpleGrid>
  );
};

export default Login;
