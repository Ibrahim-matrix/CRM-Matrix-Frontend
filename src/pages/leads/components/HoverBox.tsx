import React from "react";
import { Box, Text, Spinner, border } from "@chakra-ui/react";
import Loader from "../../../components/Loader";

interface HoverBoxProps {
  loading: boolean;
  logs: any;
  position: { top: number; right: number };
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}

const HoverBox: React.FC<HoverBoxProps> = ({
  loading,
  logs,
  position,
  onMouseEnter,
  onMouseLeave,
}) => {
  const { top, right } = position;

  return (
    <>
      {loading ? (
        <Box
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
          position="absolute"
          top={top}
          right={right}
          bg="white"
          rounded="md"
          borderWidth="2"
          padding={2}
          zIndex={10}
          boxShadow="md" // Add a shadow to the box
        >
          <Spinner
            thickness="4px"
            speed="0.65s"
            emptyColor="gray.200"
            color="blue.500"
            size="md"
          />
        </Box>
      ) : (
        <Box
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
          position="absolute"
          top={top}
          right={right}
          bg="white"
          fontSize="sm"
          rounded="md"
          borderWidth="2"
          padding={2}
          zIndex={10}
          // height="200px"
          width="260px" // Adjust the desired width
          overflowY="auto" // Add vertical scrollbar when content exceeds the height
          textAlign="start" // Align text to the start of the box
          boxShadow="md" // Add a shadow to the box
        >
          {/* Content */}
          {logs?.length <= 0 ? (
            <Box color={"red.400"} fontWeight={600}>
              There is no log history!
            </Box>
          ) : (
            <ul>
              {logs?.map((el: any, index: number) => (
                <li
                  key={index}
                  style={{
                    background: index % 2 === 0 ? "#F7FAFC" : "#EDF2F7", // Change background color of even/odd rows
                    transition: "background-color 0.3s", // Add animation to background color change on hover
                    padding: "4px", // Add padding to each list item
                    cursor: "pointer", // Show pointer cursor on hover
                  }}
                >
                  {el.Remarks}
                </li>
              ))}
            </ul>
          )}
        </Box>
      )}
    </>
  );
};

export default HoverBox;
