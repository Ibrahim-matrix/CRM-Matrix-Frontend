import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";
import {
  Box,
  Button,
  Checkbox,
  FormControl,
  FormLabel,
  NumberInput,
  NumberInputField,
  Text,
  VStack,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input,
  useToast,
  Tag,
  HStack,
  Flex,
} from "@chakra-ui/react";
import {
  useForm,
  Controller,
  useWatch,
  useFieldArray,
  SubmitHandler,
} from "react-hook-form";
import { useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";

export interface EMIRef {
  submit: () => any;
}

type EMI = {
  percentage: number;
  isPaid?: boolean;
  remark?: string;
  emiPaymentReceivedDate?: string;
  emiPayUpdatedBy?: {
    name: string;
    userId: string;
  };
  createdAt?: Date;
  updatedAt?: Date;
};

interface Props {
  totalAmount: number;
}

type FormValues = {
  fullPayment: boolean;
  emiCount: number;
  emis: EMI[];
};

interface User {
  signinuser: {
    Name: string;
    userId: string;
  };

  proposal: any;
}

const labelList = [
  "First",
  "Second",
  "Third",
  "Fourth",
  "Fifth",
  "Sixth",
  "Seventh",
  "Eighth",
  "Ninth",
  "Tenth",
];

const EMISection = forwardRef<EMIRef, Props>(({ totalAmount }, ref) => {
  const { signinuser, proposal } = useSelector(
    (state: { common: User }) => state.common
  );
  const [searchParams] = useSearchParams();
  const proposalId = searchParams.get("proposalId");
  const isUpdateMode = !!proposalId;

  const isFullPaymentInProposal =
    proposal?.emiSteps?.length === 1 &&
    proposal.emiSteps[0].label?.toLowerCase() === "full payment";

  const { control, register, setValue, handleSubmit, watch } =
    useForm<FormValues>({
      defaultValues: {
        fullPayment: false,
        emiCount: 1,
        emis: [{ percentage: 100, isPaid: false }],
      },
    });

  const [touchedIndices, setTouchedIndices] = useState<Set<number>>(new Set());

  const { fields, replace, update } = useFieldArray({
    control,
    name: "emis",
  });

  const emis = useWatch({ control, name: "emis" });
  const fullPayment = useWatch({ control, name: "fullPayment" });
  const emiCount = useWatch({ control, name: "emiCount" });

  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [remark, setRemark] = useState<string>("");
  const [paymentDate, setPaymentDate] = useState<string>("");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  console.log(proposal);

  useEffect(() => {
    if (fullPayment) {
      replace([]);
      setTouchedIndices(new Set());
      return;
    }

    if (isUpdateMode && proposal?.emiSteps?.length) {
      // Preload from proposal if in update mode
      const existingEMIs = proposal?.emiSteps.map((emi: any) => ({
        percentage: emi?.payPercentage,
        isPaid: emi?.isPaid,
        remark: emi?.remark || "",
        emiPaymentReceivedDate: emi?.emiPaymentReceivedDate || "",
        emiPayUpdatedBy: emi?.emiPayUpdatedBy || null,
        createdAt: emi?.createdAt || "",
        updatedAt: emi?.updatedAt || "",
      }));
      replace(existingEMIs);
      setValue("emiCount", existingEMIs?.length);
    } else {
      // Normal logic for new entry
      const count = Math.max(1, emiCount || 1);
      const equalPercent = parseFloat((100 / count).toFixed(2));
      replace(
        Array.from({ length: count }, () => ({
          percentage: equalPercent,
          isPaid: false,
        }))
      );
    }

    setTouchedIndices(new Set());
  }, [emiCount, fullPayment, proposal]);

  const handleEMIChange = (changedIndex: number, newValue: number) => {
    const newTouched = new Set(touchedIndices);
    newTouched.add(changedIndex);
    setTouchedIndices(newTouched);

    const updated = [...emis];
    updated[changedIndex].percentage = newValue;

    const untouchedIndices = updated
      .map((_, idx) => idx)
      .filter((idx) => !newTouched.has(idx));

    const usedPercent = Array.from(newTouched).reduce(
      (sum, idx) => sum + updated[idx].percentage,
      0
    );

    const remaining = 100 - usedPercent;
    const equalSplit = untouchedIndices.length
      ? parseFloat((remaining / untouchedIndices.length).toFixed(2))
      : 0;

    untouchedIndices.forEach((idx) => {
      if (updated[idx].percentage !== equalSplit) {
        update(idx, { ...updated[idx], percentage: equalSplit }); // update only if different
      }
    });

    update(changedIndex, { ...updated[changedIndex] }); // update the changed one last
  };

  const canUpdateEMI = (index: number) => {
    if (!isUpdateMode) return false;
    if (emis[index]?.isPaid) return false;
    return index === 0 || emis[index - 1]?.isPaid;
  };

  const handleOpenEMIModal = (index: number) => {
    setSelectedIndex(index);
    setRemark("");
    onOpen();
  };

  const handleConfirmUpdate = () => {
    if (selectedIndex === null || !paymentDate || !remark) return;

    const updated = [...emis];
    updated[selectedIndex] = {
      ...updated[selectedIndex],
      isPaid: true,
      remark,
      emiPaymentReceivedDate: paymentDate,
      emiPayUpdatedBy: {
        name: signinuser?.Name,
        userId: signinuser?.userId,
      },
    };
    replace(updated);
    onClose();
    toast({
      title: `EMI ${selectedIndex + 1} marked as paid.`,
      status: "success",
      duration: 3000,
    });
  };

  const totalPercent = emis.reduce((acc, emi) => acc + emi.percentage, 0);

  useImperativeHandle(ref, () => ({
    submit: () => {
      const emiSteps = fullPayment
        ? [
            {
              label: "Full Payment",
              isPaid: false,
              payPercentage: 100,
              pay: totalAmount,
            },
          ]
        : emis?.map((emi, idx) => ({
            label: labelList[idx] || `EMI ${idx + 1}`,
            isPaid: emi.isPaid || false,
            payPercentage: emi.percentage,
            pay: parseFloat(((emi.percentage / 100) * totalAmount).toFixed(2)),
            remark: emi.remark || "",
            emiPayUpdatedBy: emi.emiPayUpdatedBy || null,
            emiPaymentReceivedDate: emi?.emiPaymentReceivedDate,
          }));

      return emiSteps;
    },
  }));

  return (
    <Box my={6} pb={6} borderBottom="1px solid" borderColor="gray.300">
      <Text mb={4}>EMI SECTION</Text>

      <Checkbox
        {...register("fullPayment")}
        // isDisabled={isUpdateMode && !isFullPaymentInProposal}
      >
        Full Payment
      </Checkbox>

      {!fullPayment && (
        <>
          <FormControl mt={4}>
            <FormLabel>No. of EMIs</FormLabel>
            <NumberInput min={1}>
              <NumberInputField
                {...register("emiCount", { valueAsNumber: true })}
              />
            </NumberInput>
          </FormControl>

          <VStack align="start" mt={4} spacing={6}>
            {fields.map((field, index) => (
              <Box
                key={field.id}
                p={4}
                w="100%"
                border="1px"
                borderColor="gray.200"
                borderRadius="md"
                bg="white"
                boxShadow="md"
              >
                <HStack justify="space-between" align="center" mb={2}>
                  <Text fontWeight="medium">
                    {labelList[index] || `EMI ${index + 1}`} (
                    {emis[index]?.percentage}%)
                  </Text>
                  <Text mt={2} fontSize="sm" fontWeight="medium">
                    EMI Amount: ₹
                    {((emis[index]?.percentage / 100) * totalAmount).toFixed(2)}
                  </Text>
                  {emis[index]?.isPaid ? (
                    <Tag colorScheme="green">Paid</Tag>
                  ) : (
                    <Tag colorScheme="red">NOT PAID</Tag>
                  )}
                </HStack>

                <HStack alignItems={"flex-end"} gap={6}>
                  <FormControl>
                    <FormLabel>Set EMI Percentage</FormLabel>
                    <Controller
                      name={`emis.${index}.percentage`}
                      control={control}
                      render={({ field }) => (
                        <NumberInput
                          // isDisabled={isUpdateMode && !isFullPaymentInProposal}
                          min={0}
                          max={100}
                          value={field.value}
                          onChange={(val) =>
                            handleEMIChange(index, Number(val))
                          }
                        >
                          <NumberInputField />
                        </NumberInput>
                      )}
                    />
                  </FormControl>

                  {isUpdateMode && (
                    <Button
                      size="sm"
                      mt={3}
                      px={10}
                      colorScheme="purple"
                      isDisabled={!canUpdateEMI(index)}
                      onClick={() => handleOpenEMIModal(index)}
                    >
                      Update EMI
                    </Button>
                  )}
                </HStack>
                <Flex justifyContent={"space-between"}>
                  <VStack alignItems={"flex-start"} spacing={0}>
                    {emis[index]?.emiPayUpdatedBy && (
                      <Text mt={2} fontSize="12px">
                        EMI updated by: {emis[index]?.emiPayUpdatedBy?.name}
                      </Text>
                    )}
                    {emis[index]?.emiPaymentReceivedDate && (
                      <Text fontSize="12px">
                        Payment received at:{" "}
                        {new Date(
                          emis[index].emiPaymentReceivedDate ?? ""
                        ).toLocaleString("en-IN", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                          hour12: true,
                        })}
                      </Text>
                    )}

                    {emis[index]?.remark && (
                      <Text fontSize="12px">Remark: {emis[index].remark}</Text>
                    )}
                  </VStack>
                  <VStack alignItems={"flex-end"}>
                    {emis[index]?.createdAt &&
                      !isNaN(
                        new Date(emis[index].createdAt as any).getTime()
                      ) && (
                        <Text mt={2} fontSize="12px">
                          Created at:{" "}
                          {new Date(
                            emis[index].createdAt as any
                          ).toLocaleString("en-IN", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                            hour12: true,
                          })}
                        </Text>
                      )}
                    {emis[index]?.updatedAt &&
                      !isNaN(
                        new Date(emis[index]?.updatedAt as any).getTime()
                      ) && (
                        <Text mt={2} fontSize="12px">
                          Updated at:{" "}
                          {new Date(
                            emis[index]?.updatedAt as any
                          ).toLocaleString("en-IN", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                            hour12: true,
                          })}
                        </Text>
                      )}
                  </VStack>
                </Flex>
              </Box>
            ))}
          </VStack>

          <Text
            mt={6}
            fontWeight="bold"
            fontSize="md"
            color={totalPercent !== 100 ? "red.500" : "green.600"}
          >
            Total EMI %: {totalPercent}%
          </Text>

          <Box mt={2}>
            <Text fontWeight="medium">Total Amount: ₹{totalAmount}</Text>
            {emis.map((emi, index) => (
              <Text key={index}>
                EMI {index + 1} Amount: ₹
                {((emi.percentage / 100) * totalAmount).toFixed(2)}
              </Text>
            ))}
          </Box>
        </>
      )}

      {/* Modal for confirmation */}
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent borderRadius="lg">
          <ModalHeader>Confirm EMI Update</ModalHeader>
          <ModalBody>
            <Text mb={3} color="gray.700">
              This process is irreversible. Please add details to continue.
            </Text>
            <VStack spacing={4}>
              <FormControl isRequired>
                <FormLabel>Remark</FormLabel>
                <Input
                  value={remark}
                  onChange={(e) => setRemark(e.target.value)}
                  placeholder="Add your remark..."
                />
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Payment Received Date</FormLabel>
                <Input
                  type="date"
                  value={paymentDate}
                  onChange={(e) => setPaymentDate(e.target.value)}
                />
              </FormControl>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button onClick={onClose} variant="ghost" mr={3}>
              Cancel
            </Button>
            <Button
              colorScheme="purple"
              onClick={handleConfirmUpdate}
              isDisabled={!remark || !paymentDate}
            >
              Update EMI
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
});

export default EMISection;
