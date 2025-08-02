import {
  Box,
  Skeleton,
  SkeletonText,
  SkeletonCircle,
  VStack,
  HStack,
  Image,
} from "@chakra-ui/react";

const ProposalInfoSkeleton = () => {
  return (
    <VStack spacing={6} align="flex-start">
      {/* Company Image Skeleton */}
      <Skeleton w="40%" h="120px" borderRadius="md" />

      {/* Text Info Skeleton */}
      <VStack align="flex-start" spacing={3} flex={1}>
        <Skeleton height="20px" width="150px" />
        <Skeleton height="16px" width="250px" />
        <Skeleton height="16px" width="250px" />
        <SkeletonText noOfLines={3} spacing="2" width="300px" />
      </VStack>
    </VStack>
  );
};

export default ProposalInfoSkeleton;
