import React, { useEffect, useRef, useState } from "react";
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  IconButton,
  Input,
  Select,
  SimpleGrid,
  Text,
  Textarea,
  useToast,
  VStack,
} from "@chakra-ui/react";
import ReactSelect from "react-select";
import { useForm, Controller, useFieldArray, useWatch } from "react-hook-form";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

import { ChevronDownIcon, CloseIcon } from "@chakra-ui/icons"; // Add this at the top
import { useDispatch, useSelector } from "react-redux";
import {
  getData,
  getDataById,
  postData,
  updateData,
} from "../../redux/actions/common.action";
import { useNavigate, useSearchParams } from "react-router-dom";
import ProposalEditor, { ProposalEditorRef } from "./ProposalEditor";
import EMISection from "./components/EMISection";

type FormData = {
  name: string;
  status: string;
  leadId: string;
  phone: string;
  email: string;
  location: string;
  validTillDate: string;
  createdBY: {
    name: string;
    userId: string;
  };
  proposalName: string;
  descriptions: { value: string };
  terms: { value: string };
  greetingId: string;
};

interface LeadItem {
  lead: {
    Name: string;
    _id: string;
    Phone1: string;
    Email: string;
    location: string;
    courseId: {
      _id: string;
      CourseName: string;
      CourseValue: number;
    };
  };
  users: {
    Name: string;
    _id: string;
  }[];
  loading: boolean;
  signinuser: {
    Name: string;
    userId: string;
  };
  proposal: {
    validTillDate: string;
    status: string;
  };
  proposalGreetings: {
    _id: string;
    title: string;
    greeting: string;
  }[];
}

const ProposalPage = () => {
  const {
    register,
    control,
    setValue,
    reset,
    handleSubmit,
    formState: { errors },
    clearErrors,
  } = useForm<FormData>({
    defaultValues: {
      descriptions: { value: "" },
      terms: { value: "" },
    },
  });

  const selectedLeadId = useWatch({ control, name: "leadId" });
  const selectedProposalGreeting = useWatch({ control, name: "greetingId" });

  const { lead, users, loading, signinuser, proposal, proposalGreetings } =
    useSelector((state: { common: LeadItem }) => state.common);
  console.log(proposal);

  const selectedGreeting = proposalGreetings?.find(
    (g: any) => g?._id === selectedProposalGreeting
  );
  const dispatch: any = useDispatch();
  const navigate = useNavigate();
  const toast = useToast();
  const endpoint: string = "lead";
  const [searchParams] = useSearchParams();
  const leadId = searchParams.get("leadId");
  const proposalId = searchParams.get("proposalId");

  useEffect(() => {
    if (!proposalId) return;
    dispatch(getDataById(proposalId, "proposal"));
  }, [proposalId]);

  useEffect(() => {
    if (!proposalId) return;
    reset({
      ...proposal,
      validTillDate: proposal?.validTillDate
        ? new Date(proposal?.validTillDate).toISOString().split("T")[0]
        : "",
    });
  }, [proposalId, proposal]);

  useEffect(() => {
    if (!leadId) return;
    dispatch(getDataById(leadId, endpoint)).then(() => {
      setValue("leadId", leadId);
    });
  }, [leadId]);

  useEffect(() => {
    if (lead?._id) {
      setValue("name", lead?.Name);
      setValue("phone", lead?.Phone1);
      setValue("email", lead?.Email);
      setValue("location", lead?.location);
    }
  }, [lead]);

  useEffect(() => {
    if (!signinuser) return;
    setValue("createdBY", {
      name: signinuser?.Name,
      userId: signinuser?.userId,
    });
  }, [signinuser]);

  useEffect(() => {
    dispatch(getData("proposalGreeting"));
    dispatch(getData(endpoint));
    if (!leadId) {
      setValue("leadId", "");
      setValue("name", "");
      setValue("phone", "");
      setValue("email", "");
      setValue("location", "");
    }
  }, []);

  console.log(users);

  const ClientNameOptions = users?.map((u: any) => (
    <option key={u?._id} value={u?._id}>
      {u?.Name}
    </option>
  ));

  const clientNameOptions = users?.map((u: any) => ({
    value: u?._id,
    label: u?.Name,
  }));

  const greetingOption = proposalGreetings?.map((g: any) => (
    <option key={g?._id} value={g?._id}>
      {g?.title}
    </option>
  ));

  useEffect(() => {
    if (selectedLeadId) {
      users?.map((u: any) => {
        if (u?._id === selectedLeadId) {
          setValue("name", u?.Name);
          setValue("phone", u?.Phone1);
          setValue("email", u?.Email);
          setValue("location", u?.location);
        }
      });
      clearErrors(["phone", "email", "location"]);
    }
  }, [selectedLeadId]);

  const handleBack = () => {
    setValue("leadId", "");
    setValue("phone", "");
    setValue("email", "");
    setValue("location", "");

    navigate("/proposal-list");
  };

  const selectedUser: any = users?.find((u) => u?._id === selectedLeadId);
  console.log(selectedUser);
  const courseId = selectedUser?.CourseInfo?._id || lead?.courseId?._id;
  const courseValue =
    selectedUser?.CourseInfo?.CourseValue || lead?.courseId?.CourseValue;
  console.log(courseId);
  console.log(courseValue);

  const proposalEditorRef = useRef<ProposalEditorRef>(null);

  const endpoint2: string = "proposal";

  const onSubmit = (data: FormData) => {
    console.log("parent data:", data);
    const proposalEditorData = proposalEditorRef.current?.getData();
    console.log("chield data:", proposalEditorData);

    console.log("final data:", { ...data, ...proposalEditorData });
    const payload = { ...data, ...proposalEditorData };

    if (leadId) {
      dispatch(postData(payload, endpoint2, navigate, toast));
    } else if (proposalId) {
      dispatch(updateData(proposalId, endpoint2, payload, navigate, toast));
    } else {
      dispatch(postData(payload, endpoint2, navigate, toast));
    }
  };

  return (
    <Box p={8}>
      <Text
        pb={2}
        mb={4}
        fontSize={"lg"}
        borderBottom={"1px solid"}
        borderColor={"gray.200"}
      >
        Client Details
      </Text>

      <form onSubmit={handleSubmit(onSubmit)}>
        <SimpleGrid
          columns={{ md: 2, lg: 4 }}
          gap={6}
          pb={6}
          borderBottom={"1px solid"}
          borderColor={"gray.200"}
        >
          {/* client details */}
          <Box>
            <FormControl variant={"floating"}>
              <Input
                size="sm"
                borderRadius={"md"}
                placeholder={loading ? "loading Name..." : ""}
                {...register("proposalName", { required: true })}
                borderColor={errors?.proposalName ? "red.500" : "gray.400"}
              />
              <FormLabel>Proposal Name</FormLabel>
              {errors.proposalName && (
                <Text fontSize={"xs"} color={"red.500"}>
                  Proposal Name is required.
                </Text>
              )}
            </FormControl>
          </Box>
          <Box>
            <FormControl variant={"floating"}>
              <Input
                size="sm"
                borderRadius={"md"}
                placeholder={loading ? "loading name..." : ""}
                isDisabled={true}
                {...register("createdBY.name", { required: true })}
                borderColor={errors?.createdBY ? "red.500" : "gray.400"}
              />
              <FormLabel>Created By</FormLabel>
              {errors.createdBY && (
                <Text fontSize={"xs"} color={"red.500"}>
                  Creater name is required.
                </Text>
              )}
            </FormControl>
          </Box>
          <Box>
            <FormControl isInvalid={!!errors?.leadId} variant={"floating"}>
              <Select
                size="sm"
                borderRadius={"md"}
                isDisabled={leadId || proposalId ? true : false}
                placeholder=""
                {...register("leadId", { required: true })}
                borderColor={errors?.leadId ? "red.500" : "gray.400"}
              >
                <option value={""} selected disabled>
                  {loading ? "loading name..." : "Select Client Name"}
                </option>
                {ClientNameOptions}
              </Select>
              <FormLabel>Select Client Name</FormLabel>
              {errors.leadId && (
                <Text fontSize={"xs"} color={"red.500"}>
                  Client name is required.
                </Text>
              )}
            </FormControl>
          </Box>
          {/* <Box>
            <FormControl isInvalid={!!errors?.leadId} >
              <FormLabel mt={2}>Select Client Name</FormLabel>
              <Controller
                name="leadId"
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <ReactSelect
                    {...field}
                    value={clientNameOptions.find(
                      (opt) => opt.value === field.value
                    )}
                    onChange={(option: any) => field.onChange(option?.value)} // <- this is critical
                    isDisabled={!!leadId}
                    options={clientNameOptions}
                    placeholder={
                      loading ? "Loading name..." : "Select Client Name"
                    }
                    styles={{
                      menu: (base:any) => ({
                        ...base,
                        zIndex: 9999, // 👈 ensures it appears on top
                      }),
                      control: (base:any, state:any) => ({
                        ...base,
                        borderColor: errors?.leadId ? "red" : "#CBD5E0",
                        borderRadius: "8px",
                        minHeight: "36px",
                        boxShadow: state.isFocused
                          ? "0 0 0 1px #3182ce"
                          : "none",
                      }),
                      valueContainer: (base:any) => ({
                        ...base,
                        padding: "0 8px",
                      }),
                    }}
                  />
                )}
              />
              {errors.leadId && (
                <Text fontSize={"xs"} color="red.500">
                  Client name is required.
                </Text>
              )}
            </FormControl>
          </Box> */}
          <Box>
            <FormControl variant={"floating"}>
              <Input
                size="sm"
                borderRadius={"md"}
                placeholder={loading ? "loading Phone number..." : ""}
                isDisabled={leadId ? true : false}
                {...register("phone", { required: true })}
                borderColor={errors?.phone ? "red.500" : "gray.400"}
              />
              <FormLabel>Client Phone number</FormLabel>
              {errors.phone && (
                <Text fontSize={"xs"} color={"red.500"}>
                  Client Phone number is required.
                </Text>
              )}
            </FormControl>
          </Box>
          <Box>
            <FormControl variant={"floating"}>
              <Input
                size="sm"
                borderRadius={"md"}
                placeholder={loading ? "loading Email..." : ""}
                isDisabled={leadId ? true : false}
                {...register("email", { required: true })}
                borderColor={errors?.email ? "red.500" : "gray.400"}
              />
              <FormLabel>Client Email</FormLabel>
              {errors.email && (
                <Text fontSize={"xs"} color={"red.500"}>
                  Client Email is required.
                </Text>
              )}
            </FormControl>
          </Box>

          <Box>
            <FormControl variant={"floating"}>
              <Input
                size="sm"
                borderRadius={"md"}
                type="date"
                {...register("validTillDate", { required: true })}
                borderColor={errors?.location ? "red.500" : "gray.400"}
              />
              <FormLabel>Valid Till</FormLabel>
              {errors.validTillDate && (
                <Text fontSize={"xs"} color={"red.500"}>
                  valid till is required.
                </Text>
              )}
            </FormControl>
          </Box>
          <Box>
            <FormControl variant={"floating"}>
              <Textarea
                rows={1}
                size="sm"
                borderRadius={"md"}
                placeholder={loading ? "loading Address..." : ""}
                isDisabled={leadId ? true : false}
                {...register("location", { required: true })}
                borderColor={errors?.location ? "red.500" : "gray.400"}
              />
              <FormLabel>Address</FormLabel>
              {errors.location && (
                <Text fontSize={"xs"} color={"red.500"}>
                  Client address is required.
                </Text>
              )}
            </FormControl>
          </Box>
        </SimpleGrid>

        {/* STATUS */}
        {proposalId && proposal?.status === "SENT PENDING" && (
          <Box>
            <FormLabel mb={2} fontWeight="semibold" color="gray.700">
              STATUS
            </FormLabel>
            <FormControl variant={"floating"}>
              <Select
                size={"sm"}
                maxW={"250px"}
                icon={<ChevronDownIcon />}
                borderRadius="md"
                fontSize="sm"
                fontWeight="medium"
                placeholder=""
                {...register("status", { required: true })}
                borderColor={errors.status ? "red.500" : "gray.300"}
                focusBorderColor="blue.400"
                _hover={{ borderColor: "blue.300" }}
                bg="white"
                shadow="sm"
              >
                <option selected disabled value={""}>
                  Select Status
                </option>
                <option value={"ACCEPTED"}>ACCEPTED</option>
                <option value={"DECLINED"}>DECLINED</option>
              </Select>
            </FormControl>
          </Box>
        )}

        {/* Greetings*/}
        <Box mt={6}>
          <FormLabel mb={2} fontWeight="semibold" color="gray.700">
            GREETINGS
          </FormLabel>

          <FormControl isInvalid={!!errors.greetingId}>
            <Select
              maxW={"250px"}
              size="sm"
              icon={<ChevronDownIcon />}
              borderRadius="md"
              fontSize="sm"
              fontWeight="medium"
              placeholder=""
              {...register("greetingId", { required: true })}
              borderColor={errors.greetingId ? "red.500" : "gray.300"}
              focusBorderColor="blue.400"
              _hover={{ borderColor: "blue.300" }}
              bg="white"
              shadow="sm"
            >
              <option value="" disabled selected>
                {loading ? "Loading greetings..." : "Select Greeting Template"}
              </option>
              {proposalGreetings?.map((g) => (
                <option key={g._id} value={g._id}>
                  {g.title}
                </option>
              ))}
            </Select>

            {errors.greetingId && (
              <Text fontSize="xs" color="red.500" mt={1}>
                Greeting is required.
              </Text>
            )}
          </FormControl>

          {selectedGreeting?.greeting && (
            <Box
              mt={6}
              p={6}
              rounded="lg"
              bg="white"
              border="1px solid"
              borderColor="gray.200"
              boxShadow="md"
              transition="all 0.2s"
              _hover={{ boxShadow: "lg" }}
            >
              <Text fontSize="md" fontWeight="semibold" mb={3} color="blue.600">
                {selectedGreeting.title}
              </Text>
              <Box
                className="greeting-html"
                fontSize="sm"
                color="gray.700"
                lineHeight="1.6"
                dangerouslySetInnerHTML={{ __html: selectedGreeting.greeting }}
              />
            </Box>
          )}
        </Box>

        {/* proposal details*/}
        <Box mt={6} borderBottom={"1px solid"} borderColor={"gray.200"} pb={6}>
          <FormLabel>PROPOSAL DETAILS</FormLabel>

          <VStack spacing={6} align="stretch">
            <FormControl position="relative">
              <Controller
                name={`descriptions.value`}
                rules={{
                  validate: (value) =>
                    value && value.replace(/<[^>]+>/g, "").trim() !== ""
                      ? true
                      : "Proposal Details are required.",
                }}
                control={control}
                render={({ field: { onChange, value } }) => (
                  <Box
                    bg="white"
                    position="relative"
                    borderWidth="1px"
                    borderRadius="md"
                    borderColor={
                      errors.descriptions?.value ? "red.500" : "gray.200"
                    }
                    p={2}
                  >
                    <CKEditor
                      onReady={(editor: any) => {
                        // Set min-height using editor's editable element
                        editor.editing.view.change((writer: any) => {
                          writer.setStyle(
                            "min-height",
                            "300px",
                            editor.editing.view.document.getRoot()
                          );
                        });
                      }}
                      editor={ClassicEditor}
                      data={value}
                      onChange={(_: any, editor: any) => {
                        const data = editor.getData();
                        onChange(data);
                      }}
                    />
                  </Box>
                )}
              />
              {errors.descriptions?.value && (
                <Text color="red.500" fontSize="sm" mt={1}>
                  {errors.descriptions?.value?.message}
                </Text>
              )}
            </FormControl>
          </VStack>
        </Box>

        {/* items section*/}
        <ProposalEditor
          ref={proposalEditorRef}
          productId={courseId}
          value={courseValue}
        />

        {/* TERMS AND CONDITIONS */}
        <FormControl
          isInvalid={!!errors.terms?.value}
          mb={4} // Optional spacing
        >
          <Text mb={2}>TERMS AND CONDITIONS</Text>

          <Controller
            name="terms.value"
            control={control}
            rules={{
              validate: (value) =>
                value && value.replace(/<[^>]+>/g, "").trim() !== ""
                  ? true
                  : "Terms and Conditions are required.",
            }}
            render={({ field: { onChange, value } }) => (
              <Box
                bg="white"
                position="relative"
                borderWidth="1px"
                borderRadius="md"
                borderColor={errors.terms?.value ? "red.500" : "gray.200"}
                p={2}
              >
                <CKEditor
                  onReady={(editor: any) => {
                    editor.editing.view.change((writer: any) => {
                      writer.setStyle(
                        "min-height",
                        "300px",
                        editor.editing.view.document.getRoot()
                      );
                    });
                  }}
                  editor={ClassicEditor}
                  data={value}
                  onChange={(_: any, editor: any) => {
                    const data = editor.getData();
                    onChange(data);
                  }}
                />
              </Box>
            )}
          />
          {errors.terms?.value && (
            <Text color="red.500" fontSize="sm" mt={1}>
              {errors.terms.value.message}
            </Text>
          )}
        </FormControl>

        <Flex mt={6} gap={4}>
          <Button
            onClick={handleBack}
            borderColor={"#e67e00"}
            color={"#e67e00"}
            px={10}
            _hover={{
              bgGradient: "linear(to-r, #e67e00, #ffa726)",
              color: "white",
            }}
            variant="outline"
            transition="all 0.2s"
          >
            BACK
          </Button>
          <Button
            type="submit"
            bg={"#e67e00"}
            color={"white"}
            _hover={{
              bgGradient: "linear(to-r, #e67e00, #ffa726)",
              color: "white",
            }}
            transition="all 0.2s"
          >
            {loading ? "Updating..." : "SAVE"}
          </Button>
        </Flex>
      </form>
    </Box>
  );
};

export default ProposalPage;
