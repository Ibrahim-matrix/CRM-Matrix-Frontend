// Loader Component: Displays a loader spinner within a table row using react-loader-spinner and Chakra UI.
import { Box, Center, Spinner, Td, Tr } from "@chakra-ui/react";
import {
  Skeleton,
  SkeletonCircle,
  SkeletonText,
  Stack,
} from "@chakra-ui/react";
// import React from "react";

const Loader = () => {
  return (
    <Tr height={400} maxHeight="400px">
      <Td colSpan={25}>
        <Center h="100%">
          {/* <Spinner
            speed="0.3s"
            thickness="3px"
            emptyColor="gray.200"
            color="orange.300"
            size="xl"
          /> */}
          {/* <Box>Heyyyyy</Box> */}
          <Box>
            <SkeletonText
              mt="4"
              noOfLines={12}
              spacing="4"
              skeletonHeight="4"
              width="84rem"
              borderRadius="2rem"
            />
          </Box>
        </Center>
      </Td>
    </Tr>
  );
};

export default Loader;
