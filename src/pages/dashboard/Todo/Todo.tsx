// Todo.tsx

import React, { useState } from "react";
import { Box, Flex, Text, Input, IconButton, Spacer } from "@chakra-ui/react";
import { CheckIcon, CloseIcon } from "@chakra-ui/icons";

interface TodoProps {
  id: number;
  text: string;
  status: string;
  onToggle: (id: number) => void;
  onDelete: (id: number) => void;
}

const Todo: React.FC<TodoProps> = ({
  id,
  text,
  status,
  onToggle,
  onDelete,
}) => {
  return (
    <Flex
      align="center"
      borderBottom="1px"
      borderColor="gray.200"
      py="2"
      key={id}
    >
      <Box flex="1">
        <Text
          fontSize="md"
          textDecoration={status === "Completed" ? "line-through" : "none"}
          color={status === "Completed" ? "gray.500" : "black"}
          pl={2}
        >
          {text}
        </Text>
      </Box>
      <Spacer />
      <IconButton
        size={"xs"}
        aria-label="Toggle Completion"
        icon={<CheckIcon />}
        colorScheme="green"
        onClick={() => onToggle(id)}
        mr="2"
      />
      <IconButton
        size={"xs"}
        aria-label="Delete Todo"
        icon={<CloseIcon />}
        colorScheme="red"
        onClick={() => onDelete(id)}
      />
    </Flex>
  );
};

export default Todo;
