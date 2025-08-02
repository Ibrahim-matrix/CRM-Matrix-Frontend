import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Grid,
  GridItem,
  Image,
  Input,
  SimpleGrid,
  Stack,
  Text,
  useToast,
  Heading,
  useColorModeValue,
} from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { updateData } from "../../redux/actions/common.action";
import { useNavigate } from "react-router-dom";
import profile from "../../icons/logo.jpg";

interface permission {
  name: string;
  access: "Viewer" | "Editor";
}

interface FormValues {
  Name: string;
  UserName: string;
  UserType: string;
  UserProfile: string;
  Email: string;
  Phone: string;
  role: string;
  Branch: string;
  permissionAccess: permission[];
  Permission: string;
  City: string;
  image: string;
  serialNumber: number;
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
  userId: string;
}

const Profile = () => {
  const { signinuser } = useSelector((state: any) => state.common);
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<FormValues>();

  const toast = useToast();
  const dispatch: any = useDispatch();
  const navigate = useNavigate();

  const bgColor = useColorModeValue("white", "gray.900");
  const inputBg = useColorModeValue("gray.100", "gray.800");

  useEffect(() => {
    if (signinuser) {
      reset(signinuser);
      if (signinuser?.UserType === 2) {
        setValue("UserProfile", "Admin");
      }
    }
  }, [reset, signinuser]);

  const onsubmit = (data: FormValues) => {
    if (data.newPassword !== data.confirmPassword) {
      toast({
        title: "Passwords do not match.",
        status: "error",
        position: "top-right",
        isClosable: true,
      });
      return;
    }

    const payload = {
      currentPassword: data.currentPassword,
      Password: data.newPassword,
    };

    dispatch(updateData(data?.userId, "user", payload, navigate, toast)).then(
      () => {
        navigate("profile");
      }
    );
  };

  return (
    <Box
      minH={"89vh"}
      bgGradient="linear(to-r, #f8fafc, #e2e8f0)"
      py={10}
      px={[4, 6, 12]}
    >
      <Box
        maxW="5xl"
        mx="auto"
        bg={bgColor}
        boxShadow="0 12px 40px rgba(0,0,0,0.1)"
        borderRadius="2xl"
        overflow="hidden"
        p={[6, 10]}
        backdropFilter="blur(10px)"
        border="1px solid rgba(255,255,255,0.2)"
        transition="all 0.3s ease"
        _hover={{ boxShadow: "0 12px 48px rgba(0,0,0,0.15)" }}
      >
        <Flex
          direction={["column", "row"]}
          alignItems="center"
          justifyContent="space-between"
          mb={10}
        >
          <Heading
            fontSize={["2xl", "3xl"]}
            color="gray.700"
            textAlign={["center", "left"]}
          >
            🔒 Account Settings
          </Heading>
          <Image
            src={signinuser?.image}
            boxSize={["100px", "120px"]}
            borderRadius="full"
            mt={[6, 0]}
            objectFit="cover"
            border="3px solid #FF9000"
          />
        </Flex>

        <form onSubmit={handleSubmit(onsubmit)}>
          <Stack spacing={8}>
            <SimpleGrid columns={[1, 2, 3]} spacing={6}>
              {[
                { label: "Name", key: "Name", isDisabled: true },
                { label: "User Profile", key: "UserProfile", isDisabled: true },
                { label: "Email", key: "Email", isDisabled: true },
                { label: "Current Password", key: "currentPassword" },
                { label: "New Password", key: "newPassword" },
                { label: "Confirm Password", key: "confirmPassword" },
              ].map(({ label, key, isDisabled }) => (
                <FormControl
                  isInvalid={!!errors[key as keyof FormValues]}
                  key={key}
                >
                  <FormLabel fontWeight="600" color="gray.600">
                    {label}
                  </FormLabel>
                  <Input
                    type={
                      key.toLowerCase().includes("password")
                        ? "password"
                        : "text"
                    }
                    {...register(key as keyof FormValues, {
                      required: `${label} is required`,
                    })}
                    bg={inputBg}
                    isDisabled={isDisabled}
                    _focus={{ borderColor: "#FF9000", bg: "white" }}
                  />
                  {errors?.[key as keyof FormValues] && (
                    <Text mt={1} color="red.500" fontSize="xs">
                      {label} is required
                    </Text>
                  )}
                </FormControl>
              ))}
            </SimpleGrid>

            <Flex justify="flex-end">
              <Button
                type="submit"
                bgGradient="linear(to-r, #FF9000, #ffb347)"
                color="white"
                _hover={{ bgGradient: "linear(to-r, #e67e00, #ffa726)" }}
                px={8}
                py={6}
                fontSize="md"
                rounded="lg"
                boxShadow="lg"
                transition="all 0.2s"
              >
                Save Changes
              </Button>
            </Flex>
          </Stack>
        </form>
      </Box>
    </Box>
  );
};

export default Profile;
