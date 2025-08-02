import React, { useEffect, useRef, useState } from "react";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  VStack,
  useToast,
  HStack,
  Text,
  IconButton,
  Divider,
  Input,
  Heading,
  Badge,
  Flex,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Skeleton,
  Select,
} from "@chakra-ui/react";
import { useForm, Controller } from "react-hook-form";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { useDispatch, useSelector } from "react-redux";
import {
  getData,
  postData,
  deleteData,
  updateData,
} from "../../redux/actions/common.action";
import { useNavigate } from "react-router-dom";
import { DeleteIcon, EditIcon } from "@chakra-ui/icons";
import DeleteConfirmationDialog from "../../components/DeleteConfirmationDialog";

type GreetingForm = {
  title: string;
  greeting: string;
  category: string;
};

interface GreetingItem {
  _id: string;
  title: string;
  greeting: string;
  category: string;
}

interface GreetingState {
  proposalGreetings: GreetingItem[];
  loading: boolean;
  signinuser: {
    userId: string;
  };
  greetingCategories: {
    name: string;
  }[];
}

const ProposalGreeting = () => {
  const { proposalGreetings, loading, signinuser, greetingCategories } =
    useSelector((state: { common: GreetingState }) => state.common);

  const [showEditor, setShowEditor] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [newCat, setNewCat] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const cancelRef = useRef(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<GreetingForm>();

  const toast = useToast();
  const dispatch: any = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(getData("proposalGreeting"));
    dispatch(getData("greetingCategory"));
  }, [dispatch]);

  console.log(editId);

  const onSubmit = (data: GreetingForm) => {
    if (editId) {
      console.log("=====================");
      dispatch(updateData(editId, "proposalGreeting", data, navigate, toast));
    } else {
      dispatch(postData(data, "proposalGreeting", navigate, toast)).then(() => {
        dispatch(getData("proposalGreeting"));
      });
    }
    setShowEditor(false);
    reset();
  };

  const handleEdit = (item: GreetingItem) => {
    setEditId(item?._id);
    setValue("title", item?.title);
    setValue("greeting", item?.greeting);
    setValue("category", item?.category);
    setShowEditor(true);
  };

  const handleDelete = (id: string) => {
    setDeleteId(id);
    setIsDeleteOpen(true);
  };

  const confirmDelete = () => {
    if (deleteId) {
      dispatch(deleteData(deleteId, "proposalGreeting", toast)).then(() => {
        dispatch(getData("proposalGreeting"));
      });
      setIsDeleteOpen(false);
      setDeleteId(null);
    }
  };

  const handleAddCategory = () => {
    const payload = {
      name: newCat,
      createdBy: signinuser?.userId,
    };

    dispatch(postData(payload, "greetingCategory", navigate, toast)).then(
      () => {
        setNewCat("");
        dispatch(getData("greetingCategory"));
      }
    );
  };

  return (
    <>
      <DeleteConfirmationDialog
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={confirmDelete}
        cancelRef={cancelRef}
        title="Delete Greeting"
        message="Are you sure you want to delete this greeting? This action cannot be undone."
      />
      <Box mb={4} px={4} pt={4}>
        <Flex
          borderBottom={"1px solid"}
          borderColor={"gray.300"}
          mb={2}
          pb={1}
          alignItems={"center"}
          justifyContent={"space-between"}
        >
          <Text>CATEGORIES</Text>
          <Button
            variant={"outline"}
            colorScheme="blue"
            ml={2}
            mt={2}
            size={"sm"}
            onClick={() => navigate("/proposal-list")}
          >
            BACK
          </Button>
        </Flex>
        <HStack spacing={3} flexWrap="wrap" my={2}>
          <Badge
            colorScheme={selectedCategory === null ? "blue" : "gray"}
            p={2}
            px={4}
            borderRadius="md"
            cursor="pointer"
            onClick={() => setSelectedCategory(null)}
          >
            All
          </Badge>
          {greetingCategories?.map((cat: any) => (
            <Badge
              key={cat._id}
              colorScheme="pink"
              p={2}
              px={4}
              borderRadius="md"
              cursor={"pointer"}
              onClick={() => setSelectedCategory(cat._id)}
            >
              {cat.name}
            </Badge>
          ))}
        </HStack>

        <HStack
          mt={4}
          borderBottom={"1px solid"}
          borderColor={"gray.300"}
          pb={4}
        >
          <Input
            placeholder="New Category"
            value={newCat}
            onChange={(e) => setNewCat(e.target.value)}
          />
          <Button colorScheme="blue" onClick={handleAddCategory}>
            + Add
          </Button>
        </HStack>
      </Box>

      <Box w="100%" mx="auto" px={4}>
        {!showEditor && (
          <Button colorScheme="blue" onClick={() => setShowEditor(true)} mt={2}>
            {loading ? "loading..." : "+ Create Greeting"}
          </Button>
        )}

        {showEditor && (
          <Box
            mt={4}
            as="form"
            onSubmit={handleSubmit(onSubmit)}
            bg="white"
            p={6}
            rounded="xl"
            shadow="md"
            border="1px solid"
            borderColor="gray.200"
          >
            <VStack spacing={4} align="stretch">
              <Heading size="md" color="blue.600">
                {editId ? "Edit Greeting" : "Create New Greeting"}
              </Heading>

              <FormControl isInvalid={!!errors?.category}>
                <FormLabel>Select Category</FormLabel>
                <Controller
                  name="category"
                  control={control}
                  rules={{ required: "Category is required" }}
                  render={({ field }) => (
                    <Select
                      placeholder="Select category"
                      {...field}
                      variant="filled"
                    >
                      {greetingCategories?.map((cat: any) => (
                        <option key={cat._id} value={cat._id}>
                          {cat.name}
                        </option>
                      ))}
                    </Select>
                  )}
                />
              </FormControl>

              <FormControl isInvalid={!!errors?.title}>
                <FormLabel>Greeting Title</FormLabel>
                <Controller
                  name="title"
                  control={control}
                  rules={{ required: "Title is required" }}
                  render={({ field }) => (
                    <Input placeholder="e.g. Warm Welcome" {...field} />
                  )}
                />
              </FormControl>

              <FormControl isInvalid={!!errors?.greeting}>
                <FormLabel>Greeting Content</FormLabel>
                <Controller
                  name="greeting"
                  control={control}
                  rules={{
                    required: "Greeting is required",
                    validate: (value) =>
                      value?.replace(/<[^>]*>/g, "").trim().length > 0 ||
                      "Greeting is required",
                  }}
                  render={({ field: { onChange, value } }) => (
                    <>
                      <Box
                        border="1px solid"
                        borderColor={errors?.greeting ? "red.500" : "gray.200"}
                        borderRadius="md"
                        p={2}
                      >
                        <CKEditor
                          editor={ClassicEditor}
                          data={value || ""}
                          onChange={(_: any, editor: any) => {
                            const data = editor.getData();
                            onChange(data);
                          }}
                        />
                      </Box>
                      {errors?.greeting && (
                        <Text color="red.500" fontSize="sm" mt={1}>
                          {errors?.greeting.message}
                        </Text>
                      )}
                    </>
                  )}
                />
              </FormControl>

              <HStack justify="flex-end" pt={2}>
                <Button type="submit" colorScheme="green">
                  {editId ? "Update" : "Save"} Greeting
                </Button>
                <Button
                  variant="ghost"
                  colorScheme="red"
                  onClick={() => {
                    setShowEditor(false);
                    setEditId(null);
                    reset();
                  }}
                >
                  Cancel
                </Button>
              </HStack>
            </VStack>
          </Box>
        )}

        {/* Greeting List */}
        <Accordion allowMultiple mt={8}>
          {proposalGreetings?.length === 0 && <Text>No greetings found.</Text>}

          {loading ? (
            <Box>
              <Skeleton height="60px" mb={4}></Skeleton>
              <Skeleton height="60px" mb={4}></Skeleton>
              <Skeleton height="60px" mb={4}></Skeleton>
            </Box>
          ) : (
            proposalGreetings
              ?.filter((item: GreetingItem) =>
                selectedCategory ? item.category === selectedCategory : true
              )
              .map((item: GreetingItem) => (
                <AccordionItem
                  key={item._id}
                  border="1px solid"
                  borderColor="gray.300"
                  borderRadius="lg"
                  shadow={"sm"}
                  mb={4}
                >
                  <h2>
                    <AccordionButton _expanded={{ bg: "blue.50" }} py={4}>
                      <Flex
                        flex="1"
                        textAlign="left"
                        align="center"
                        justify="space-between"
                      >
                        <Flex alignItems={"center"} gap={4}>
                          <Heading size="sm" color="black">
                            {item.title}
                          </Heading>
                          <Text fontSize="xs" color="gray.600">
                            Category:{" "}
                            <Badge colorScheme="purple" variant="subtle">
                              {greetingCategories?.find(
                                (cat: any) => cat?._id === item?.category
                              )?.name ?? "N/A"}
                            </Badge>
                          </Text>
                        </Flex>

                        <HStack spacing={2}>
                          <IconButton
                            icon={<EditIcon />}
                            aria-label="Edit"
                            size="sm"
                            colorScheme="blue"
                            variant="outline"
                            onClick={(e: any) => {
                              e.stopPropagation();
                              handleEdit(item);
                            }}
                          />
                          <IconButton
                            icon={<DeleteIcon />}
                            aria-label="Delete"
                            size="sm"
                            colorScheme="red"
                            variant="outline"
                            onClick={(e: any) => {
                              e.stopPropagation();
                              handleDelete(item._id);
                            }}
                          />
                          <AccordionIcon />
                        </HStack>
                      </Flex>
                    </AccordionButton>
                  </h2>
                  <AccordionPanel pb={4}>
                    <Box
                      className="editor-content"
                      dangerouslySetInnerHTML={{ __html: item.greeting }}
                    />
                  </AccordionPanel>
                </AccordionItem>
              ))
          )}
        </Accordion>
      </Box>
    </>
  );
};

export default ProposalGreeting;
