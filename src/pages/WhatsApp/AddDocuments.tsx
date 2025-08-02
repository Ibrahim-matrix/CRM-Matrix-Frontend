import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Stack,
  Heading,
  Box,
  Input,
  Button,
  useToast,
  SimpleGrid,
  FormControl,
  FormLabel,
  Text,
} from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {  getData, postData } from "../../redux/actions/common.action";
import { DevTool } from "@hookform/devtools";
import { useState } from "react";

// Interface for cities
interface WhatsAppDocs {
  title: string;
  content : string;
}

// Interface for loading state
interface Loading {
  loading: boolean;
}

interface docsData {
  image: any;
}
const initialImage = {
  image: null,
};

const AddDocument: React.FC = () => {
  const { loading } = useSelector((state: { common: Loading }) => state.common);
  const [image, setImage] = useState<docsData>(initialImage);
  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<WhatsAppDocs>();
  const dispatch: any = useDispatch();
  const endpoint: string = "template";
  const navigate = useNavigate();
  const toast = useToast();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setImage({
      ...image,
      image: file || null, // store selected file in formData`
    });
  };
  const onSubmit = (formData: WhatsAppDocs) => {
    const formDataToSend = new FormData();
    formDataToSend.append("title", formData.title);
    formDataToSend.append("content", formData.content);
    formDataToSend.append("document", image.image);
  
    // Create a separate object for 'type'
    const typeData = {
      type: '3', // Update with the desired type
    };
  
    // Merge 'typeData' with 'formDataToSend' into a new FormData
    const payload = new FormData();
  
    // Append formDataToSend entries
    const formDataEntries = Array.from(formDataToSend.entries());
    for (const [key, value] of formDataEntries) {
      payload.append(key, value);
    }
  
    // Append typeData entries
    for (const [key, value] of Object.entries(typeData)) {
      payload.append(key, value);
    }
  
    // Handle form submission by dispatching the postData action and retrieving city data
    dispatch(postData(payload, endpoint, navigate, toast)).then(() => {
      dispatch(getData("template"));
      reset();
    });
  };
  
  
  


  return (
    <Stack h="100%" mt={1} align="center" justify="center">
       <form onSubmit={handleSubmit(onSubmit)}>
        <SimpleGrid columns={1} px={2} py={5} gap={6} mt={3}>
          <Box>
            <FormControl variant="floating" id="title">
              {/* City Name Input */}
              <Input
                autoComplete="off"
                {...register("title", {
                  required: "Title is required",
                })}
                borderColor={errors?.title ? "red.500" : "gray.400"}
                borderRadius={"0.25rem"}
                size="sm"
                placeholder=" "
              />
              <FormLabel fontWeight={"400"} color={"gray.600"}>
              Title
              </FormLabel>
              {errors.title && (
                <Text as="span" fontSize="sm" color="red.500">
                  {errors.title.message}
                </Text>
              )}
            </FormControl>
          </Box>
          <Box>
            <FormControl variant="floating" id="content">
              <textarea
                {...register("content", {
                  required: "content is required",
                })}
                autoComplete="off"
                placeholder=" "
                style={{
                  width: "100%",
                  backgroundColor: "white",
                  color: "black",
                  fontFamily: "sans-serif",
                  fontSize: "15px",
                  borderRadius: "4px",
                  padding: "2px",
                  border: "1px solid #a0aec0",
                  height: "32px",
                  minHeight: "32px",

                  borderColor: errors?.content ? "red" : "#a0aec0",
                }}
              />
              <FormLabel fontWeight={"400"} color={"gray.600"}>
              Content
              </FormLabel>
              {errors.content && (
                <Text color="red.500" fontSize="xs">
                  Content is required
                </Text>
              )}
            </FormControl>
          </Box>
          <Box>
            <Input
              autoComplete="off"
              onChange={handleImageChange}
              size="sm"
              type="file"
              name="image"
              borderColor={"gray.400"}
              borderRadius="0.25rem"
              placeholder="Enter User Profile"
              sx={{
                "::file-selector-button": {
                  bg: "gray.500",
                  color: "white",
                  ml: -5,
                  mt: 0.4,
                  py: 1.4,
                  px: 12,
                  mr: 15,

                  borderRadius: "0.25rem",
                  _hover: {
                    bg: "blue.600",
                  },
                },
              }}
              flexGrow={1}
            />
          </Box>
          <Box
            mb={errors.content ? "6" : 0}
            display={"flex"}
            justifyContent={"flex-start"}
            alignItems={"center"}
          >
            {/* Add City Button */}
            <Button
              isLoading={loading}
              loadingText="Please wait..."
              type="submit"
              size={"sm"}
              _hover={{ bg: "#FF9000" }}
              w="8.188rem"
              bg="#FF9000"
              borderRadius={"0.25rem"}
              color="whiteAlpha.900"
              fontWeight={"700"}
              fontSize={"1rem"}
            >
              Add Template
            </Button>
          </Box>
        </SimpleGrid>
      </form>
      {/* DevTool (optional) */}
      <DevTool control={control} />
      <Heading as="h4" size="md" textAlign={"center"} my={4}>
        Whatsapp Rules
      </Heading>
      <TableContainer
        style={{
          margin: "auto",
          border: "1px solid gray",
          textAlign: "center",
        }}
      >
        <Table size="sm">
          <Thead>
            <Tr>
              <Th style={{ borderBottom: "1px dotted #000000" }}>S.no</Th>
              <Th style={{ borderBottom: "1px dotted #000000" }}>Meaning</Th>
              <Th style={{ borderBottom: "1px dotted #000000" }}>Code</Th>
            </Tr>
          </Thead>
          <Tbody>
            {data?.map((el, i) => {
              return (
                <Tr key={i}>
                  <Td style={{ borderBottom: "1px dotted #000000" }}>
                    {el.sn}
                  </Td>
                  <Td style={{ borderBottom: "1px dotted #000000" }}>
                    {el.code}
                  </Td>
                  <Td style={{ borderBottom: "1px dotted #000000" }}>
                    {el.msg}
                  </Td>
                </Tr>
              );
            })}
          </Tbody>
        </Table>
      </TableContainer>
    </Stack>
  );
};

export default AddDocument;

const data = [
  { sn: "1", code: "{{user}}", msg: "Name from the Lead" },
  {
    sn: "2",
    code: "{{userName}}",
    msg: "Name of the user who is sending the message",
  },
  {
    sn: "3",
    code: "{{userPhone}}",
    msg: "Phone Number of the user who is sending the message",
  },
  {
    sn: "4",
    code: "*text*",
    msg: "To bold the text wrap the text with a asterisk(*)",
  },
  {
    sn: "5",
    code: "_text_",
    msg: "To italicize your message, place an underscore on both sides ",
  },
  {
    sn: "6",
    code: "text",
    msg: "To monospace your message, place three backticks on both ",
  },
  {
    sn: "7",
    code: "~text~",
    msg: "To strikethrough your message, place a tilde on both sides of ",
  },
];
