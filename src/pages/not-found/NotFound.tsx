import { Box, Button, Text, useColorModeValue } from "@chakra-ui/react";
import React from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

interface Signinuser {
  signinuser: {
    UserType: number;
  };
}

const NotFound = () => {
  const { signinuser } = useSelector(
    (state: { common: Signinuser }) => state.common
  );

  const navigate = useNavigate();

  const handleHome = () => {
    if (signinuser?.UserType === 2) {
      navigate("/admin-dashboard");
    } else if (signinuser?.UserType === 3) {
      navigate("/");
    }
  };

  const cardBg = useColorModeValue("white", "gray.800");
  const textColor = useColorModeValue("gray.800", "gray.100");

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
      {/* Small background image positioned in the bottom right */}
      <Box
        position="absolute"
        bottom="20px"
        right="20px"
        opacity={0.3}
        zIndex={0}
      >
        <img
          src="https://cdn-icons-png.flaticon.com/512/7486/7486800.png"
          alt="Decorative 404 image"
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
        <Text fontSize="5rem" fontWeight="500" color="red.500">
          404
        </Text>
        <Text fontSize="xl" fontWeight="semibold" color={textColor} mt={2}>
          Page Not Found
        </Text>
        <Text fontSize="md" mt={2} color="gray.500">
          Sorry, we couldn't find the page you're looking for.
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

export default NotFound;
