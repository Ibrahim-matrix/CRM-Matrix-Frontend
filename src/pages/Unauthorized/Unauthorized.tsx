import React from "react";
import {
  Box,
  Flex,
  Text,
  Icon,
  useColorModeValue,
  Button,
} from "@chakra-ui/react";
import { BiError } from "react-icons/bi";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

interface Signinuser {
  signinuser: {
    UserType: number;
  };
}

const Unauthorized = () => {
  const { signinuser } = useSelector(
    (state: { common: Signinuser }) => state.common
  );

  const navigate = useNavigate();

  const cardBg = useColorModeValue("white", "gray.800");
  const textColor = useColorModeValue("gray.800", "gray.100");

  const handleHome = () => {
    if (signinuser?.UserType === 2) {
      navigate("/admin-dashboard");
    } else if (signinuser?.UserType === 3) {
      navigate("/");
    }
  };

  return (
    <Box
      w="100%"
      h="89vh"
      bg={useColorModeValue("gray.100", "gray.900")}
      position="relative"
      display="flex"
      alignItems="center"
      justifyContent="center"
      px={4}
    >
      {/* Small background icon/image */}
      <Box
        position="absolute"
        bottom="20px"
        right="20px"
        opacity={0.2}
        zIndex={0}
      >
        <img
          src="https://cdn-icons-png.flaticon.com/512/564/564619.png" // lock icon
          alt="Unauthorized icon"
          style={{ width: "120px", height: "120px" }}
        />
      </Box>

      <Box
        bg={cardBg}
        p={10}
        borderRadius="2xl"
        boxShadow="2xl"
        textAlign="center"
        zIndex={1}
        maxW="md"
        w="full"
      >
        <Icon as={BiError} boxSize={14} color="yellow.400" />
        <Text fontSize="2xl" fontWeight="bold" mt={4} color={textColor}>
          Unauthorized Access
        </Text>
        <Text fontSize="md" mt={2} color="gray.500">
          Sorry, you don’t have permission to view this page.
        </Text>
        <Button
          mt={6}
          size="lg"
          bg="#FF9000"
          color={"white"}
          _hover={{
            bg: "#ffba61ff",
          }}
          onClick={handleHome}
          rounded="full"
          px={8}
        >
          Go Back to Home
        </Button>
      </Box>
    </Box>
  );
};

export default Unauthorized;
