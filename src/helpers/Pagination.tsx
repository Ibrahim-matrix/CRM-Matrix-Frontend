import { Box, Button, Text } from "@chakra-ui/react";

interface PaginationProps {
  usersPerPage: number;
  totalUsers: number;
  paginate: (pageNumber: number) => void;
  currentPage: number;
}

const Pagination: React.FC<PaginationProps> = ({
  usersPerPage,
  totalUsers,
  paginate,
  currentPage,
}: PaginationProps) => {
  const totalPages = Math.ceil(totalUsers / usersPerPage);

  const handlePageChange = (pageNumber: number) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      paginate(pageNumber);
    }
  };

  return (
    <Box
      display={"flex"}
      justifyContent={"flex-end"}
      gap={"3"}
      px={3}
      borderTop={"1px gray.500"}
    >
      <Button
        size={"xs"}
        onClick={() => handlePageChange(currentPage - 1)}
        colorScheme="gray"
        disabled={currentPage === 1}
        borderRadius={"50%"}
        p={"0.5rem 0"}
      >
        &lt;
      </Button>
      {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNumber) => {
        if (
          pageNumber <= 3 ||
          (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1) ||
          pageNumber > totalPages - 3
        ) {
          return (
            <Button
              size={"xs"}
              borderRadius={"50%"}
              p={"0.5rem 0"}
              key={pageNumber}
              onClick={() => handlePageChange(pageNumber)}
              disabled={currentPage === pageNumber}
              colorScheme={currentPage === pageNumber ? "orange" : "gray"}
            >
              {pageNumber}
            </Button>
          );
        } else if (pageNumber === 4 || pageNumber === totalPages - 2) {
          return <Text key={pageNumber}>...</Text>;
        } else {
          return null;
        }
      })}

      <Button
        size={"xs"}
        borderRadius={"50%"}
        p={"0.5rem 0"}
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        &gt;
      </Button>
    </Box>
  );
};

export default Pagination;
