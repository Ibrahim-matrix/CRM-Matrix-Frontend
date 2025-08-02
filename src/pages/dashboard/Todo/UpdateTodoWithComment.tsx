import { CheckIcon } from "@chakra-ui/icons"
import { AlertDialog, AlertDialogBody, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogOverlay, Box, Button, FormControl, FormLabel, IconButton, Input, Text, useDisclosure } from "@chakra-ui/react"
import React from "react";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";

interface Props {
    handleUpdate: (id: number, completedComment: string) => void;
    id: number;
}

interface Loading {
    loading: boolean;
}

interface form {

    completedComment: string;
}

const UpdateTodoWithComment: React.FC<Props> = ({ handleUpdate, id }) => {
    const {
        register: register2,
        handleSubmit: handleSubmit2,
        formState: { errors }
    } = useForm<form>()
    const { isOpen, onOpen, onClose } = useDisclosure();
    const cancelRef = React.useRef<HTMLButtonElement>(null);
    const { loading } = useSelector((state: { common: Loading }) => state.common);

    const onsubmit = (data: any) => {
        handleUpdate(id, data.completedComment)
        onClose();
    }

    return (
        <>
            <IconButton
                size={"sm"}
                icon={<CheckIcon />}
                colorScheme="green"
                onClick={onOpen}
                aria-label="Mark as completed"
            />

            <AlertDialog
                isOpen={isOpen}
                leastDestructiveRef={cancelRef}
                onClose={onClose}
            >
                <AlertDialogOverlay
                    bg="blackAlpha.300"
                    backdropFilter="blur(5px) hue-rotate(90deg)"
                >
                    <AlertDialogContent>
                        <AlertDialogHeader fontSize="lg" fontWeight="bold">
                            Add Comment
                        </AlertDialogHeader>

                        <AlertDialogBody>
                            Are you sure? You can't undo this action afterwards.
                        </AlertDialogBody>

                        <Box
                            width={"90%"}
                            mx={"auto"}
                        >
                            <FormControl>
                                <Input
                                    {...register2("completedComment", { required: "Comment is required." })}
                                    size={"sm"}

                                    type="text"
                                    placeholder="Add Your Comment"
                                />
                                {errors?.completedComment && (
                                    <Text color={"red.500"} fontSize={"xs"}>
                                        Comment is required.
                                    </Text>
                                )}
                            </FormControl>
                        </Box>

                        <AlertDialogFooter>
                            <Button
                                size="sm"
                                fontWeight={"medium"}
                                ref={cancelRef}
                                onClick={onClose}
                            >
                                Cancel
                            </Button>
                            <Button
                                size="sm"
                                fontWeight={"medium"}
                                isLoading={loading}
                                loadingText="Updating..."
                                colorScheme="green"
                                onClick={handleSubmit2(onsubmit)}
                                ml={3}
                            >
                                Mark as Completed
                            </Button>
                        </AlertDialogFooter>

                    </AlertDialogContent>
                </AlertDialogOverlay>
            </AlertDialog>
        </>
    )
}

export default UpdateTodoWithComment