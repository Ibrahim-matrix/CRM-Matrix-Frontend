import React, { useEffect, useMemo, useState } from "react";
import {
  Grid,
  GridItem,
  Stack,
  Box,
  Heading,
  FormControl,
  Input,
  FormLabel,
  Text,
  Button,
  useToast,
  Flex,
  Table,
} from "@chakra-ui/react";
import { DevTool } from "@hookform/devtools";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getData, postData } from "../../redux/actions/common.action";
import Loader from "../../components/Loader";

interface Support {
  pageName: string;
  issueName: string;
}

interface imageData {
  file: any;
}
const initialImage = {
  file: null,
};

// Interface for Support lists
interface SupportLists {
  loading: boolean;
  supports: {
    pageName: string;
    issueName: string;
    timing: number;
    _id: number;
  }[];
}

const Support: React.FC = () => {
  const [image, setImage] = useState<imageData>(initialImage);

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<Support>();

  const endpoint: string = "issue";
  const dispatch: any = useDispatch();
  const Navigate = useNavigate();
  const toast = useToast();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setImage({
      ...image,
      file, // Store the selected file in the formData
    });
  };

  const onSubmit = (formData: Support) => {
    const formDataToSend = new FormData();

    // Add form data fields to the FormData object
    formDataToSend.append("pageName", formData.pageName);
    formDataToSend.append("issueName", formData.issueName);

    // Add the image file to the FormData object
    if (image.file) {
      formDataToSend.append("image", image.file);
    }

    dispatch(postData(formDataToSend, endpoint, Navigate, toast)).then(() => {
      dispatch(getData(endpoint));
      reset();
      // Navigate("/issue");
      console.log("ok");
    });
  };

  const { supports, loading } = useSelector(
    (state: { common: SupportLists }) => state.common
  );
  const memoizedSupports = useMemo(() => supports, [supports]);

  useEffect(() => {
    if (memoizedSupports.length === 0) {
      // Fetch city data when the component mounts, only if there are no cities present
      dispatch(getData(endpoint));
    }
  }, [dispatch, endpoint, memoizedSupports.length]);

  return (
    <Stack h="100%" mt={1}>
      <Grid templateColumns="repeat(2, 1fr)" gap={6} p={4}>
        <GridItem w="100%" shadow="lg">
          <form onSubmit={handleSubmit(onSubmit)}>
            <Box>
              <Heading as="h3" size="lg" textAlign="center" pb={2}>
                Raise Issue
              </Heading>
              <Box px={8} py={4}>
                <FormControl variant="floating" id="Name">
                  <Input
                    autoComplete="off"
                    {...register("pageName", {
                      required: "Page Name is required",
                    })}
                    borderColor={errors?.pageName ? "red.500" : "gray.400"}
                    borderRadius="0.25rem"
                    size="sm"
                    placeholder=" "
                    className="autocomplete-input"
                  />
                  <FormLabel fontWeight="400" color="gray.600">
                    Enter Page Name
                  </FormLabel>
                  {errors.pageName && (
                    <Text color="red.500" fontSize="xs">
                      {errors.pageName.message}
                    </Text>
                  )}
                </FormControl>
              </Box>

              <Box px={8} py={4}>
                <FormControl variant="floating" id="issueName">
                  <Input
                    autoComplete="off"
                    {...register("issueName", {
                      required: "Issue Name is required",
                    })}
                    borderColor={errors?.issueName ? "red.500" : "gray.400"}
                    borderRadius="0.25rem"
                    size="sm"
                    placeholder=" "
                    className="autocomplete-input"
                  />
                  <FormLabel fontWeight="400" color="gray.600">
                    Enter Issue
                  </FormLabel>
                  {errors.issueName && (
                    <Text color="red.500" fontSize="xs">
                      {errors.issueName.message}
                    </Text>
                  )}
                </FormControl>
              </Box>

              <Box px={8} py={4}>
                <FormLabel htmlFor="image">Screenshots :</FormLabel>
                <Box>
                  <Input
                    // {...register("image", {
                    //   required: "image is required",
                    // })}
                    borderColor={"gray.400"}
                    size="sm"
                    type="file"
                    borderRadius="0.25rem"
                    sx={{
                      "::file-selector-button": {
                        bg: "gray.500",
                        color: "white",
                        ml: -6,
                        mt: 0.7,
                        py: 1.45,
                        px: 12,
                        mr: 15,
                        borderRadius: "0.25rem",
                        _hover: {
                          bg: "blue.600",
                        },
                      },
                    }}
                    flexGrow={1}
                    onChange={handleImageChange}
                  />
                  {/* {errors.image && (
                <Text color="red.500" fontSize="xs">
                  image is required
                </Text>
              )} */}
                </Box>
                <Box
                  mt="6"
                  display="flex"
                  justifyContent="flex-end"
                  alignItems="center"
                >
                  <Button
                    loadingText="Please wait..."
                    type="submit"
                    size="sm"
                    _hover={{ bg: "#FF9000" }}
                    w="8.188rem"
                    bg="#FF9000"
                    borderRadius="0.25rem"
                    color="whiteAlpha.900"
                    fontWeight="700"
                    fontSize="1rem"
                  >
                    Submit
                  </Button>
                </Box>
              </Box>
            </Box>
          </form>
        </GridItem>

        <GridItem w="100%" shadow={"lg"}>
          <Heading as="h5" size="md" textAlign={"center"} pb={2}>
            Your histories will show here
          </Heading>

          <Table variant="simple">
            <Box>
              {loading ? (
                <Loader />
              ) : (
                supports.map((el, i) => {
                  return (
                    <Box
                      px={2}
                      bg={i % 2 === 0 ? "blue.100" : "gray.100"}
                      key={i}
                    >
                      <Flex
                        justifyContent={"space-between"}
                        alignItems={"start"}
                        gap={4}
                        p={2}
                      >
                        <Box>
                          <Text fontWeight={"bold"}>{el.pageName}</Text>
                          <Text fontWeight={"light"} fontSize={"sm"}>
                            {el.issueName}
                          </Text>
                        </Box>
                        <Box>
                          <Text>{el.timing}</Text>
                        </Box>
                      </Flex>
                    </Box>
                  );
                })
              )}
            </Box>
          </Table>
        </GridItem>
      </Grid>
      <DevTool control={control} />
    </Stack>
  );
};

export default Support;
