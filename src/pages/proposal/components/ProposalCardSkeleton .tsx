import {
  VStack,
  Flex,
  Box,
  Skeleton,
  SkeletonCircle,
  SkeletonText,
  Circle,
} from "@chakra-ui/react";

const ProposalCardSkeleton = ({ count = 3 }) => {
  return (
    <VStack spacing={4} align="stretch">
      {Array.from({ length: count }).map((_, index) => (
        <VStack
          key={index}
          alignItems={"stretch"}
          bg="white"
          p={4}
          rounded="2xl"
          border="1px solid"
          borderColor="gray.200"
          boxShadow="sm"
        >
          <Flex>
            {/* Left Days & Status */}
            <Flex
              direction="column"
              align="center"
              justify="center"
              bg="gray.50"
              px={4}
              py={3}
              borderRadius="xl"
              minW="100px"
              textAlign="center"
              mr={4}
              position="relative"
            >
              <Skeleton height="20px" width="40px" mb={2} />
              <Skeleton height="14px" width="60px" mb={2} />
              <Skeleton height="18px" width="80px" />
            </Flex>

            {/* Right Section */}
            <Flex
              flex="1"
              direction="row"
              justify="space-between"
              align="center"
              flexWrap="wrap"
              w="100%"
              gap={4}
            >
              {/* Proposal Info */}
              <Box flex="1">
                <Skeleton height="20px" width="70%" mb={2} />
                <SkeletonText mt="2" noOfLines={2} spacing="2" width="90%" />
              </Box>

              {/* EMI Steps */}
              <Flex w="25%" align="center" justify="space-between">
                {Array.from({ length: 3 }).map((_, idx) => (
                  <Flex key={idx} align="center" flex="1" position="relative">
                    <Flex direction="column" align="center" zIndex={1}>
                      <SkeletonCircle size="6" />
                      <Skeleton height="12px" width="40px" mt={1} />
                    </Flex>
                    {idx < 2 && (
                      <Box
                        position="absolute"
                        top="12px"
                        left="0%"
                        width="100%"
                        transform="translateX(12px)"
                        height="2px"
                        bg="gray.200"
                        zIndex={0}
                      />
                    )}
                  </Flex>
                ))}
              </Flex>

              {/* Price + Avatar + Menu */}
              <Flex direction="column" align="flex-end">
                <Flex align="center" gap={3}>
                  <SkeletonCircle size="8" />
                  <Skeleton height="20px" width="60px" />
                  <SkeletonCircle size="6" />
                </Flex>
                <SkeletonText mt={2} noOfLines={2} spacing="1" width="140px" />
              </Flex>
            </Flex>
          </Flex>
        </VStack>
      ))}
    </VStack>
  );
};

export default ProposalCardSkeleton;
