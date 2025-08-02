// LazyLoader Component: Displays a lazy loader spinner using react-loader-spinner and Chakra UI.
import { Center, HStack, Spinner } from "@chakra-ui/react";
import React from "react";


const LazyLoader = () => {
  return (
    <HStack justifyContent="center" alignItems="center" h="100%">
      <Center h='100%'>
        <Spinner
          speed="0.3s"
          emptyColor="gray.200"
          thickness="3px"
          color="orange.300"
          size="xl"
        />
      </Center>
    </HStack>
  );
};

export default LazyLoader;
