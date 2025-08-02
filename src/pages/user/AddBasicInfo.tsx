import {
  Box,
  Button,
  Input,
  
  SimpleGrid,
  Stack,
  Text,
} from "@chakra-ui/react";
import React from "react";

const AddNewLead:React.FC = () => {
  return (
    <Stack h="100%">
      {/* heading starts */}
      <Box
        px={10}
        h="50px"
        display={"flex"}
        justifyContent={"flex-start"}
        alignItems={"center"}
      >
        {" "}
        <Text fontSize={"1.25rem"} fontWeight={"600"}>
          Basic Information
        </Text>
      </Box>
      {/* heading end */}

      {/* inputs starts */}
      <SimpleGrid columns={2} px={10} py={1} gap={6}>
        <Box>
          <Text fontSize={"1rem"} ml="2" mb="0.5">
            Owner
          </Text>
          <Input
            borderColor={"gray.400"}
            borderRadius={"0.25rem"}
            placeholder="Testing"
          />
        </Box>
        <Box>
          <Text fontSize={"1rem"} ml="2" mb="0.5">
            Name
          </Text>
          <Input
            borderColor={"gray.400"}
            borderRadius={"0.25rem"}
            placeholder=""
          />
        </Box>
        <Box>
          <Text fontSize={"1rem"} ml="2" mb="0.5">
            Email
          </Text>
          <Input
            type="email"
            borderColor={"gray.400"}
            borderRadius={"0.25rem"}
            defaultValue=""
          />
        </Box>
     
        <Box>
          <Text fontSize={"1rem"} ml="2" mb="0.5">
            Phone
          </Text>
          <Input
            type="number"
            borderColor={"gray.400"}
            borderRadius={"0.25rem"}
          />
        </Box>
        <Box>
          <Text fontSize={"1rem"} ml="2" mb="0.5">
            Password
          </Text>
          <Input
            type="password"
            borderColor={"gray.400"}
            borderRadius={"0.25rem"}
          />
        </Box>
        <Box>
          <Text fontSize={"1rem"} ml="2" mb="0.5">
            Confirm Password
          </Text>
          <Input
            type="password"
            borderColor={"gray.400"}
            borderRadius={"0.25rem"}
          />
        </Box>
        <Box></Box>
        <Box display={"flex"} justifyContent={"flex-end"} alignItems={"center"}>
          <Button
            _hover={{ bg: "#FF9000" }}
            w="8.188rem"
            h="2.813rem"
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
    </Stack>
  );
};

export default AddNewLead;
