import React, { useEffect } from "react";
import {
  Box,
  Button,
  Input,
  SimpleGrid,
  Text,
  useToast,
} from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { getDataById, updateData } from "../../redux/actions/common.action";
import { useNavigate, useParams } from "react-router-dom";
import { DevTool } from "@hookform/devtools";

// Interface for the template data used in the component
interface UpdateTemplates {
  whatsapp: {
    type: string;
    title: string;
    content: string;
  };
}

// Interface for form data submitted by the user
interface FormData {
  type: string;
  title: string;
  content: string;
}

const UpdateTemplate: React.FC = () => {
  const dispatch: any = useDispatch();
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const endpoint: string = "template";
  const { whatsapp } = useSelector(
    (state: { common: UpdateTemplates }) => state.common
  );

  // Form handling using react-hook-form
  const {
    handleSubmit,
    register,
    formState: { errors },
    reset,
    control,
  } = useForm<FormData>({
    defaultValues: {
      type: whatsapp?.type || "",
      title: whatsapp?.title || "",
      content: whatsapp?.content || "",
    },
  });

  useEffect(() => {
    // Fetch the specific template data when the component mounts
    dispatch(getDataById(id, endpoint));
  }, [id, dispatch]);

  useEffect(() => {
    if (whatsapp) {
      reset({
        type: whatsapp.type,
        title: whatsapp.title,
        content: whatsapp.content,
      });
    }
  }, [whatsapp, reset]);

  const onSubmit = (data: FormData) => {
    // Handle form submission by dispatching the updateData action
    dispatch(updateData(id, endpoint, data, navigate, toast));
    window.location.reload()
  };

  return (
    <Box>
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Type Input */}
        <SimpleGrid columns={3} px={10} py={1} gap={6}>
        <Box>
          <Text>Type</Text>
          <Input
            {...register("type", { required: true })}
            borderColor={errors.type ? "red.500" : "gray.400"}
            borderRadius={"0.25rem"}
          />
          {errors.type && (
            <Text color="red.500" fontSize="xs">
              Type is required
            </Text>
          )}
        </Box>

        {/* Title Input */}
        <Box>
          <Text>Title</Text>
          <Input
            {...register("title", { required: true })}
            borderColor={errors.title ? "red.500" : "gray.400"}
            borderRadius={"0.25rem"}
          />
          {errors.title && (
            <Text color="red.500" fontSize="xs">
              Title is required
            </Text>
          )}
        </Box>

        {/* Content Input */}
        <Box>
          <Text>Content</Text>
          <Input
            {...register("content", { required: true })}
            borderColor={errors.content ? "red.500" : "gray.400"}
            borderRadius={"0.25rem"}
          />
          {errors.content && (
            <Text color="red.500" fontSize="xs">
              Content is required
            </Text>
          )}
        </Box>
        </SimpleGrid>

        {/* Update Template Button */}
        <Button
          type="submit"
          mt={4}
          _hover={{ bg: "#FF9000" }}
          bg="#FF9000"
          borderRadius={"0.25rem"}
          color="whiteAlpha.900"
          fontWeight={"700"}
          fontSize={"1rem"}
        >
          Update Template
        </Button>
      </form>

      <DevTool control={control} />
    </Box>
  );
};

export default UpdateTemplate;
