import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
} from "react";
import {
  Box,
  Button,
  Input,
  Select,
  Stack,
  Text,
  VStack,
  HStack,
  IconButton,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  SimpleGrid,
  GridItem,
  Flex,
  Textarea,
} from "@chakra-ui/react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { CloseIcon } from "@chakra-ui/icons";
import { useDispatch, useSelector } from "react-redux";
import { getData } from "../../redux/actions/common.action";
import { useSearchParams } from "react-router-dom";
import EMISection, { EMIRef } from "./components/EMISection";

interface Items {
  items: {
    productId: string;
    quantity: number;
    price: number;
    tax: number;
  }[];
  discount: number;
  discountType: "percentage" | "amount";
}

interface Products {
  courses: {
    CourseName: string;
    CourseValue: number;
  }[];
  proposal: {};
}

export interface ProposalEditorRef {
  getData: () => any;
}

interface Props {
  productId?: string;
  value?: number;
}

const ProposalEditor = forwardRef<ProposalEditorRef, Props>(
  ({ productId, value }, ref) => {
    console.log(productId, value);
    const { courses, proposal } = useSelector(
      (state: { common: Products }) => state.common
    );
    const { control, watch, handleSubmit, setValue, reset } = useForm<Items>({
      defaultValues: {
        items: [{ productId: "", quantity: 1, price: 0, tax: 0 }],
        discount: 0,
        discountType: "percentage",
      },
    });

    const [searchParams] = useSearchParams();
    const proposalId = searchParams.get("proposalId");

    console.log(proposalId);

    useEffect(() => {
      if (!proposalId) return;

      const cleanedItems = (proposal as any)?.items?.map((item: any) => ({
        ...item,
        tax:
          typeof item?.tax === "string"
            ? parseFloat(item?.tax?.replace("%", ""))
            : item?.tax,
      }));
      reset({
        ...proposal,
        items: cleanedItems,
      });
    }, [proposalId, proposal]);

    useEffect(() => {
      if (!productId || !value) return;
      setValue(`items.${0}.productId`, productId || "");
      setValue(`items.${0}.price`, value || 0);
    }, [productId, value]);

    const dispatch: any = useDispatch();
    const endpoint = "course";

    const { fields, append, remove } = useFieldArray({
      control,
      name: "items",
    });

    console.log(fields);

    const items = watch("items");
    // const discount = watch("discount");

    useEffect(() => {
      dispatch(getData(endpoint));
    }, []);

    console.log(courses);

    const calculateAmount = (item: any) => {
      const itemTotal = item?.quantity * item?.price;
      const taxAmount = (itemTotal * item?.tax) / 100;
      return itemTotal + taxAmount;
    };

    const subTotal = items.reduce(
      (sum, item) => sum + item.quantity * item.price,
      0
    );

    const totalTax = items.reduce((sum, item) => {
      const itemTotal = item.quantity * item.price;
      const taxAmount = (itemTotal * item.tax) / 100;
      return sum + taxAmount;
    }, 0);

    const discountValue = watch("discount") || 0;
    const discountType = watch("discountType") || "percentage";

    const parsedDiscount = Number(discountValue);
    const discountPrice =
      discountType === "percentage"
        ? (subTotal * parsedDiscount) / 100
        : parsedDiscount;

    const total = subTotal - discountPrice + totalTax;

    const onSubmit = (data: any) => {
      console.log("Final Form Data", data);
    };

    const emiRef = useRef<EMIRef>(null);

    useImperativeHandle(ref, () => ({
      getData: () => {
        const itemsWithTotal = items?.map((item: any) => {
          const a = calculateAmount(item).toFixed(2);
          const t = item?.price * item.quantity;
          return {
            ...item,
            total: t,
            totalWithTax: a,
            tax: item?.tax + "%",
          };
        });

        const emiFormData = emiRef.current?.submit();
        return {
          items: itemsWithTotal,
          subTotal,
          discount: discountValue,
          discountPrice,
          discountType,
          totalTax,
          total,
          emiSteps: emiFormData,
        };
      },
    }));

    return (
      <form onSubmit={handleSubmit(onSubmit)}>
        <VStack spacing={0}>
          {fields.map((field, index) => (
            <Flex alignItems={"center"}>
              <SimpleGrid mx={6} columns={10} key={field.id} borderRadius="md">
                {/* item no. */}
                <GridItem
                  py={6}
                  px={2}
                  border="1px solid #ddd"
                  borderLeftRadius={"md"}
                >
                  <Text textAlign={"center"}> {index + 1}</Text>
                </GridItem>

                {/* Product Selector */}
                <GridItem colSpan={3} py={6} px={2} border="1px solid #ddd">
                  <Controller
                    control={control}
                    name={`items.${index}.productId`}
                    render={({ field: productField }) => (
                      <Select
                        // isDisabled={productId ? true : false}
                        placeholder="Select Product"
                        {...productField}
                        onChange={(e) => {
                          const selected = courses?.find(
                            (p: any) => p?._id === e.target.value
                          );
                          productField.onChange(e);
                          setValue(
                            `items.${index}.price`,
                            selected?.CourseValue || 0
                          );
                        }}
                      >
                        {courses?.map((product: any) => (
                          <option key={product?._id} value={product?._id}>
                            {product?.CourseName}
                          </option>
                        ))}
                      </Select>
                    )}
                  />
                </GridItem>

                {/* Quantity */}
                <GridItem py={6} px={2} border="1px solid #ddd">
                  <Controller
                    control={control}
                    name={`items.${index}.quantity`}
                    render={({ field }) => (
                      <NumberInput min={1} {...field}>
                        <NumberInputField />
                        <NumberInputStepper>
                          <NumberIncrementStepper />
                          <NumberDecrementStepper />
                        </NumberInputStepper>
                      </NumberInput>
                    )}
                  />
                </GridItem>

                {/* Price */}
                <GridItem py={6} px={2} border="1px solid #ddd">
                  <Controller
                    control={control}
                    name={`items.${index}.price`}
                    render={({ field }) => (
                      <NumberInput min={0} {...field}>
                        <NumberInputField />
                      </NumberInput>
                    )}
                  />
                </GridItem>

                {/* Tax */}
                <GridItem colSpan={2} py={6} px={2} border="1px solid #ddd">
                  <Controller
                    control={control}
                    name={`items.${index}.tax`}
                    render={({ field }) => (
                      <Select {...field}>
                        <option value="0">No Tax</option>
                        <option value="5">5%</option>
                        <option value="10">10%</option>
                        <option value="18">18%</option>
                      </Select>
                    )}
                  />
                </GridItem>

                {/* Amount Display */}
                <GridItem
                  colSpan={2}
                  rowSpan={2}
                  bg={"gray.100"}
                  py={6}
                  px={4}
                  border="1px solid #ddd"
                  borderRightRadius={"md"}
                >
                  <Box minW="80px" textAlign="right" fontWeight="bold">
                    ₹{calculateAmount(items[index]).toFixed(2)}
                  </Box>
                </GridItem>
              </SimpleGrid>
              {/* Remove Button */}
              {fields.length > 1 && (
                <IconButton
                  icon={<CloseIcon />}
                  size="sm"
                  mr={2}
                  colorScheme="red"
                  onClick={() => remove(index)}
                  aria-label="Remove item"
                />
              )}
            </Flex>
          ))}

          <Button
            colorScheme="white"
            color={"blue"}
            _hover={{ color: "black" }}
            onClick={() =>
              append({
                productId: "",
                quantity: 1,
                price: 0,
                tax: 0,
              })
            }
          >
            + Add Item
          </Button>
        </VStack>

        {/* Summary Section */}
        <HStack
          borderBottom={"1px solid"}
          justifyContent={"end"}
          borderTop={"1px solid"}
          borderColor={"gray.200"}
          m={4}
          pb={4}
        >
          <SimpleGrid columns={4} row={3} mr={6}>
            <GridItem
              colSpan={3}
              border="1px solid"
              justifyItems={"end"}
              p={2}
              borderColor={"gray.200"}
            >
              <Text>Sub Total</Text>
            </GridItem>
            <GridItem
              border="1px solid"
              justifyItems={"end"}
              p={2}
              borderColor={"gray.200"}
            >
              <Text>₹{subTotal.toFixed(2)}</Text>
            </GridItem>
            <GridItem
              colSpan={1}
              border="1px solid"
              justifyItems={"end"}
              p={2}
              borderColor={"gray.200"}
            >
              <Text>Discount</Text>
            </GridItem>
            <GridItem
              colSpan={1}
              border="1px solid"
              justifyItems={"end"}
              p={2}
              borderColor={"gray.200"}
            >
              <Controller
                control={control}
                name="discount"
                render={({ field }) => (
                  <NumberInput min={0} w="100px" {...field}>
                    <NumberInputField />
                  </NumberInput>
                )}
              />
            </GridItem>
            <GridItem
              colSpan={1}
              border="1px solid"
              justifyItems={"end"}
              p={2}
              borderColor={"gray.200"}
            >
              {/* Discount Type Select */}
              <Controller
                control={control}
                name="discountType"
                render={({ field }) => (
                  <Select w="110px" {...field}>
                    <option value="percentage">%</option>
                    <option value="amount">₹</option>
                  </Select>
                )}
              />
            </GridItem>
            <GridItem
              colSpan={1}
              border="1px solid"
              justifyItems={"end"}
              p={2}
              borderColor={"gray.200"}
            >
              <Text color="red.500">- ₹{discountPrice.toFixed(2)}</Text>
            </GridItem>
            <GridItem
              colSpan={1}
              border="1px solid"
              justifyItems={"end"}
              p={2}
              borderColor={"gray.200"}
            >
              <Text>Tax</Text>
            </GridItem>
            <GridItem
              colSpan={3}
              border="1px solid"
              justifyItems={"end"}
              p={2}
              borderColor={"gray.200"}
            >
              <Text>₹{totalTax.toFixed(2)}</Text>
            </GridItem>

            <GridItem
              colSpan={3}
              bg={"gray.100"}
              border="1px solid"
              justifyItems={"end"}
              p={2}
              borderColor={"gray.200"}
            >
              <Text fontWeight={"bold"}>Total</Text>
            </GridItem>
            <GridItem
              bg={"gray.100"}
              colSpan={1}
              border="1px solid"
              justifyItems={"end"}
              p={2}
              borderColor={"gray.200"}
            >
              <Text fontWeight={"bold"}>₹{total.toFixed(2)}</Text>
            </GridItem>
          </SimpleGrid>
        </HStack>
        {/* Emi options section */}
        <EMISection ref={emiRef} totalAmount={total} />
      </form>
    );
  }
);
export default ProposalEditor;
