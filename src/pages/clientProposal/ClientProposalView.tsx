import axios from "axios";
import React, { useEffect, useState } from "react";
import { BASE_URL } from "../../config/RequestMethod";
import { useSearchParams } from "react-router-dom";
import {
  Badge,
  Box,
  Button,
  Divider,
  Flex,
  GridItem,
  HStack,
  Icon,
  Image,
  Link,
  SimpleGrid,
  Skeleton,
  Tag,
  Text,
  VStack,
} from "@chakra-ui/react";
import { A4ResponsiveWrapper } from "../proposal/components/A4ResponsiveWrapper";
import { A4Box } from "../proposal/ProposalView";
import topImage from "../../icons/collogo.png";
import bgImage from "../../icons/logo.jpg";
import bottomImage from "../../icons/pdfbg.png";
import { MdEmail, MdLocationOn, MdPhone } from "react-icons/md";
import {
  FaBackward,
  FaCheck,
  FaCross,
  FaDownload,
  FaTimes,
  FaWhatsapp,
} from "react-icons/fa";
import HtmlPaginated from "../proposal/components/HtmlPaginated ";
import NotFound from "../not-found/NotFound";
import Unauthorized from "../Unauthorized/Unauthorized";
import ESignCanvas from "./ESignCanvas";
import ProposalInfoSkeleton from "../proposal/components/ProposalInfoSkeleton ";
import html2pdf from "html2pdf.js";

interface Proposal {
  Esign: string;
  status: string;
  sentDate: Date;
  clientReactionDate: Date;
  clientNote: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  greetingId: string;
  descriptions: {
    value: string;
  };
  terms: {
    value: string;
  };
  greeting: string;
  emiSteps: {
    label: string;
    payPercentage: number;
    pay: number;
    isPaid: boolean;
    remark: string;
    emiPaymentReceivedDate: Date;
    emiPayUpdatedBy: {
      name: string;
      userId: string;
    };
  }[];
  discountType: string;
  subTotal: number;
  discount: string;
  discountPrice: number;
  total: number;
  totalTax: number;
  validTillDate: Date;
  proposalName: string;
  items: {
    productId: string;
    quantity: 1;
    productName: string;
  }[];
  createdBY: {
    name: string;
    userId: string;
  };
  companyInfo: {
    _id: string;
    companyName: string;
    Name: string;
    Email: string;
    Phone: string;
    Address: string;
    webURL: string;
    City: string;
    ComapanyImageOne: string;
    ComapanyImageTwo: string;
  };
}

const ClientProposalView = () => {
  const [searchParams] = useSearchParams();
  const proposalId = searchParams.get("proposalId");

  const [proposal, setProposal] = useState<Proposal>();
  const [loading, setLoading] = useState<boolean>(false);

  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  const [notFound, setNotFound] = useState(false);
  const [unauthorized, setUnauthorized] = useState(false);

  const [showAccept, setShowAccept] = useState<boolean>(false);

  const handlePrint = () => window.print();

  const handleDownloadPDF = async () => {
    setIsGeneratingPDF(true);

    const element = document.querySelector(".print-area");

    // ✅ Wait for all images inside the element to load
    const images = element?.querySelectorAll("img");
    await Promise.all(
      Array.from(images ? images : []).map((img) => {
        if (img.complete) return Promise.resolve();
        return new Promise((resolve) => {
          img.onload = resolve;
          img.onerror = resolve;
        });
      })
    );

    await new Promise((res) => setTimeout(res, 200)); // tiny delay

    html2pdf()
      .set({
        margin: 0,
        filename: "proposal.pdf",
        image: { type: "jpeg", quality: 1 },
        html2canvas: {
          scale: 2,
          useCORS: true, // ✅ required
          allowTaint: false,
          logging: true,
          backgroundColor: null,
        },
        jsPDF: {
          unit: "px",
          format: [794, 1122],
          orientation: "portrait",
        },
      })
      .from(element)
      .save()
      .finally(() => setIsGeneratingPDF(false));
  };

  const getProposalDetails = async () => {
    try {
      setLoading(true);
      const res: any = await axios.get(
        `${BASE_URL}client-proposal/${proposalId}`
      );
      console.log(res?.data);
      setProposal(res?.data?.Data);
    } catch (err: any) {
      if (err.response?.status === 404) {
        setNotFound(true); // Handle "Proposal not found"
      } else if (err.response?.status === 403) {
        setUnauthorized(true); // For access denied cases
      } else {
        console.error("Unexpected error", err);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (proposalId) {
      getProposalDetails();
    }
  }, [proposalId]);
  return (
    <>
      {notFound ? (
        <NotFound />
      ) : unauthorized ? (
        <Unauthorized />
      ) : (
        <VStack
          justifyContent={"space-between"}
          h={showAccept ? "100vh" : 0}
          bg="gray.100"
        >
          {!showAccept && (
            <VStack
              align="center"
              w={"full"}
              bg="gray.100"
              gap={isGeneratingPDF ? 0 : 6}
              spacing={0}
            >
              <A4ResponsiveWrapper isDownload={isGeneratingPDF}>
                {/* Page 1: Greeting */}
                <A4Box
                  imageUrl={
                    proposal?.companyInfo?.ComapanyImageTwo
                      ? proposal?.companyInfo?.ComapanyImageTwo
                      : bgImage
                  }
                >
                  {loading ? (
                    <ProposalInfoSkeleton />
                  ) : (
                    <>
                      <Image
                        src={proposal?.companyInfo?.ComapanyImageOne}
                        w={"40%"}
                      ></Image>
                      <Box>
                        <Text fontWeight="bold">Dear, {proposal?.name}</Text>
                        <Text fontSize={"sm"}>
                          <span style={{ fontWeight: "bold" }}>Email Id:</span>{" "}
                          {proposal?.email}
                        </Text>
                        <Text fontSize={"sm"}>
                          <span style={{ fontWeight: "bold" }}>
                            Contact No:
                          </span>{" "}
                          {proposal?.phone}
                        </Text>
                        <Text mb={6} maxW={"50%"} fontSize={"sm"}>
                          <span style={{ fontWeight: "bold" }}>Address:</span>{" "}
                          {proposal?.location}
                        </Text>
                      </Box>
                    </>
                  )}
                  <Divider my={4} />
                  {loading ? (
                    <Box>
                      {[...new Array(3)].map((_: any, i: number) => (
                        <Box>
                          <Skeleton
                            height="16px"
                            mb={3}
                            width="40%"
                            borderRadius="md"
                          />
                          <Skeleton
                            height="12px"
                            mb={2}
                            width="100%"
                            borderRadius="md"
                          />
                          <Skeleton
                            height="12px"
                            mb={2}
                            width="92%"
                            borderRadius="md"
                          />
                          <Skeleton
                            height="12px"
                            mb={2}
                            width="88%"
                            borderRadius="md"
                          />
                          <Skeleton
                            height="12px"
                            mb={6}
                            width="55%"
                            borderRadius="md"
                          />
                        </Box>
                      ))}
                    </Box>
                  ) : (
                    <>
                      <Box
                        dangerouslySetInnerHTML={{
                          __html: proposal?.greeting ? proposal?.greeting : "",
                        }}
                      />
                      <Box mt={6}>
                        <Text fontWeight={"bold"}>Kind Regards,</Text>
                        <Text fontWeight={"bold"}>
                          {proposal?.companyInfo?.Name}
                        </Text>
                        <Text>Mob: {proposal?.companyInfo?.Phone}</Text>
                        <Text>Email: {proposal?.companyInfo?.Email}</Text>
                        <Text fontWeight={"bold"}>
                          {proposal?.companyInfo?.companyName}
                        </Text>
                      </Box>
                    </>
                  )}
                  <Flex
                    position={"absolute"}
                    bgImage={bottomImage}
                    w={"100%"}
                    height={"220px"}
                    bgRepeat={"no-repeat"}
                    bgSize={"cover"}
                    bottom={0}
                    left={0}
                  >
                    <SimpleGrid
                      columns={3}
                      spacing={2}
                      px={6}
                      alignSelf={"flex-end"}
                      mb={6}
                    >
                      {/* Column 1 - Location */}
                      <Flex align="flex-start" gap={3}>
                        <Icon
                          as={MdLocationOn}
                          boxSize={8}
                          mt={1}
                          color={"white"}
                        />
                        <Text fontSize="12px" color={"white"}>
                          {proposal?.companyInfo?.Address}
                        </Text>
                      </Flex>

                      {/* Column 2 - Phone and WhatsApp */}
                      <Flex direction="column" gap={3} pl={4}>
                        <Flex align="center" gap={3}>
                          <Icon as={MdPhone} boxSize={5} color={"white"} />
                          <Text fontSize="12px" color={"white"}>
                            {proposal?.companyInfo?.Phone}
                          </Text>
                        </Flex>
                        <Flex align="center" gap={3}>
                          <Icon as={FaWhatsapp} boxSize={5} color="green.400" />
                          <Text fontSize="12px" color={"white"}>
                            {proposal?.companyInfo?.Phone}
                          </Text>
                        </Flex>
                      </Flex>

                      {/* Column 3 - Email and Website */}
                      <Flex direction="column" gap={3}>
                        <Flex align="center" gap={3}>
                          <Icon as={MdEmail} boxSize={5} color={"white"} />
                          <Link fontSize="12px" color={"white"} isExternal>
                            {proposal?.companyInfo?.Email}
                          </Link>
                        </Flex>
                        <Flex align="center" gap={3}>
                          <Image
                            src="https://www.google.com/favicon.ico"
                            boxSize={5}
                            alt="Google"
                          />
                          <Link fontSize="12px" color={"white"} isExternal>
                            {proposal?.companyInfo?.webURL}
                          </Link>
                        </Flex>
                      </Flex>
                    </SimpleGrid>
                  </Flex>
                </A4Box>

                {/* Page 2: Proposal Description (again if long) */}
                <HtmlPaginated
                  html={proposal?.descriptions?.value || ""}
                  isDownload={isGeneratingPDF}
                />

                {/* Page 3: Items */}
                <A4Box
                  imageUrl={
                    proposal?.companyInfo?.ComapanyImageTwo
                      ? proposal?.companyInfo?.ComapanyImageTwo
                      : bgImage
                  }
                >
                  {/* Summary */}
                  <Text fontSize="xl" fontWeight="bold" mb={4}>
                    Proposal Items
                  </Text>

                  <VStack spacing={0}>
                    <SimpleGrid
                      columns={10}
                      borderRadius="md"
                      mx={6}
                      overflow="hidden"
                      w="100%"
                      alignSelf="center"
                      fontWeight="bold"
                      bg="gray.100"
                    >
                      <GridItem
                        py={3}
                        px={2}
                        textAlign="center"
                        border="1px solid #ddd"
                        borderLeftRadius="md"
                      >
                        Sl No.
                      </GridItem>

                      <GridItem
                        colSpan={3}
                        py={3}
                        px={2}
                        border="1px solid #ddd"
                      >
                        Product Name
                      </GridItem>

                      <GridItem py={3} px={2} border="1px solid #ddd">
                        Qty
                      </GridItem>

                      <GridItem py={3} px={2} border="1px solid #ddd">
                        Price
                      </GridItem>

                      <GridItem
                        colSpan={2}
                        py={3}
                        px={2}
                        border="1px solid #ddd"
                      >
                        Tax
                      </GridItem>

                      <GridItem
                        colSpan={2}
                        py={3}
                        px={2}
                        textAlign="right"
                        border="1px solid #ddd"
                        borderRightRadius="md"
                      >
                        Total
                      </GridItem>
                    </SimpleGrid>

                    {proposal?.items?.map((item: any, index: number) => (
                      <SimpleGrid
                        key={index}
                        columns={10}
                        borderRadius="md"
                        mx={6}
                        overflow="hidden"
                        w={"100%"}
                        alignSelf={"center"}
                      >
                        {/* Item No. */}
                        <GridItem
                          py={6}
                          px={2}
                          border="1px solid #ddd"
                          borderLeftRadius="md"
                          textAlign="center"
                        >
                          <Text>{index + 1}</Text>
                        </GridItem>

                        {/* Product Name */}
                        <GridItem
                          colSpan={3}
                          py={6}
                          px={2}
                          border="1px solid #ddd"
                        >
                          <Text>{item?.productName}</Text>
                        </GridItem>

                        {/* Quantity */}
                        <GridItem py={6} px={2} border="1px solid #ddd">
                          <Text>{item?.quantity}</Text>
                        </GridItem>

                        {/* Price */}
                        <GridItem py={6} px={2} border="1px solid #ddd">
                          <Text>₹{item?.price}</Text>
                        </GridItem>

                        {/* Tax */}
                        <GridItem
                          colSpan={2}
                          py={6}
                          px={2}
                          border="1px solid #ddd"
                        >
                          <Text>{item?.tax}</Text>
                        </GridItem>

                        {/* Amount */}
                        <GridItem
                          colSpan={2}
                          py={6}
                          px={4}
                          border="1px solid #ddd"
                          borderRightRadius="md"
                          bg="gray.100"
                          textAlign="right"
                          fontWeight="bold"
                        >
                          ₹{item?.totalWithTax?.toFixed(2)}
                        </GridItem>
                      </SimpleGrid>
                    ))}
                  </VStack>

                  {/* Summary */}
                  <HStack
                    borderTop="1px solid"
                    borderBottom="1px solid"
                    borderColor="gray.200"
                    justify="end"
                    m={4}
                    pb={4}
                  >
                    <SimpleGrid columns={4} spacing={0} w="fit-content" mr={6}>
                      <GridItem
                        colSpan={3}
                        border="1px solid"
                        p={2}
                        borderColor="gray.200"
                      >
                        <Text>Sub Total</Text>
                      </GridItem>
                      <GridItem border="1px solid" p={2} borderColor="gray.200">
                        <Text>₹{proposal?.subTotal?.toFixed(2)}</Text>
                      </GridItem>

                      <GridItem
                        colSpan={3}
                        border="1px solid"
                        p={2}
                        borderColor="gray.200"
                      >
                        <Text>Discount</Text>
                      </GridItem>
                      <GridItem border="1px solid" p={2} borderColor="gray.200">
                        <Text>
                          {proposal?.discountType === "percentage"
                            ? `${proposal?.discount}%`
                            : `₹${proposal?.discountPrice}`}
                        </Text>
                      </GridItem>

                      <GridItem
                        colSpan={3}
                        border="1px solid"
                        p={2}
                        borderColor="gray.200"
                      >
                        <Text>Total Tax</Text>
                      </GridItem>
                      <GridItem border="1px solid" p={2} borderColor="gray.200">
                        <Text>₹{proposal?.totalTax?.toFixed(2)}</Text>
                      </GridItem>

                      <GridItem
                        colSpan={3}
                        bg="gray.100"
                        border="1px solid"
                        p={2}
                        borderColor="gray.200"
                      >
                        <Text fontWeight="bold">Total</Text>
                      </GridItem>
                      <GridItem
                        bg="gray.100"
                        border="1px solid"
                        p={2}
                        borderColor="gray.200"
                      >
                        <Text fontWeight="bold">
                          ₹{proposal?.total?.toFixed(2)}
                        </Text>
                      </GridItem>
                    </SimpleGrid>
                  </HStack>
                </A4Box>

                {/* Page 4: Payment Plan */}
                <A4Box
                  imageUrl={
                    proposal?.companyInfo?.ComapanyImageTwo
                      ? proposal?.companyInfo?.ComapanyImageTwo
                      : bgImage
                  }
                >
                  <Text fontSize="xl" fontWeight="bold" mb={4}>
                    Payment Plan (EMI)
                  </Text>
                  <VStack w="100%">
                    <SimpleGrid
                      w="100%"
                      bg="gray.300"
                      p={4}
                      borderRadius="md"
                      columns={5}
                      placeItems="center"
                      border="1px solid #ccc"
                    >
                      <Text fontWeight="bold">Sl No.</Text>
                      <Text fontWeight="bold">EMI %</Text>
                      <Text fontWeight="bold">EMI AMOUNT</Text>
                      <Tag colorScheme="gray">STATUS</Tag>
                      <Text fontWeight="bold">EMI PAID DATE</Text>
                    </SimpleGrid>
                    {proposal?.emiSteps?.map((emi, idx) => (
                      <SimpleGrid
                        key={idx}
                        w="100%"
                        bg="gray.50"
                        p={4}
                        borderRadius="md"
                        columns={5}
                        mb={4}
                        justifyItems={"center"}
                        border="1px solid #ccc"
                      >
                        <Text>{emi?.label}</Text>
                        <Text fontWeight="bold">{emi?.payPercentage}%</Text>
                        <Text fontWeight="bold">${emi?.pay}</Text>
                        <Box>
                          {emi?.isPaid ? (
                            <Tag colorScheme="green">PAID</Tag>
                          ) : (
                            <Tag colorScheme="red">NOT PAID</Tag>
                          )}
                        </Box>
                        <Text color="gray.600" fontSize="sm">
                          {emi?.isPaid && emi?.emiPaymentReceivedDate
                            ? new Date(
                                emi?.emiPaymentReceivedDate
                              ).toLocaleDateString("en-IN", {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                              })
                            : "--"}
                        </Text>
                      </SimpleGrid>
                    ))}
                  </VStack>
                  {/* Summary Section */}
                  <VStack
                    w="100%"
                    spacing={6}
                    mt={6}
                    p={6}
                    borderRadius="xl"
                    bg="gray.50"
                    boxShadow="md"
                    align="stretch"
                  >
                    {/* Paid */}
                    <Box
                      p={4}
                      bg="white"
                      borderRadius="lg"
                      boxShadow="sm"
                      borderLeft="6px solid #38A169"
                    >
                      <Text fontSize="sm" fontWeight="medium" color="gray.500">
                        Paid Amount
                      </Text>
                      <Text fontSize="2xl" fontWeight="bold" color="green.600">
                        $
                        {proposal?.emiSteps
                          ?.filter((emi) => emi.isPaid)
                          ?.reduce((acc, curr) => acc + curr.pay, 0)
                          .toFixed(2)}
                      </Text>
                    </Box>

                    {/* Remaining */}
                    <Box
                      p={4}
                      bg="white"
                      borderRadius="lg"
                      boxShadow="sm"
                      borderLeft="6px solid #E53E3E"
                    >
                      <Text fontSize="sm" fontWeight="medium" color="gray.500">
                        Remaining Amount
                      </Text>
                      <Text fontSize="2xl" fontWeight="bold" color="red.500">
                        $
                        {proposal?.emiSteps
                          ?.filter((emi) => !emi.isPaid)
                          ?.reduce((acc, curr) => acc + curr.pay, 0)
                          .toFixed(2)}
                      </Text>
                    </Box>

                    {/* Total */}
                    <Box
                      p={4}
                      bg="white"
                      borderRadius="lg"
                      boxShadow="sm"
                      borderLeft="6px solid #3182CE"
                    >
                      <Text fontSize="sm" fontWeight="medium" color="gray.500">
                        Total Amount
                      </Text>
                      <Text fontSize="2xl" fontWeight="bold" color="gray.800">
                        ${proposal?.total?.toFixed(2)}
                      </Text>
                    </Box>
                  </VStack>
                </A4Box>

                {/* Page 5: Terms */}
                <A4Box
                  imageUrl={
                    proposal?.companyInfo?.ComapanyImageTwo
                      ? proposal?.companyInfo?.ComapanyImageTwo
                      : bgImage
                  }
                >
                  <Text fontSize="xl" fontWeight="bold" mb={4}>
                    Terms & Conditions
                  </Text>
                  <Box
                    dangerouslySetInnerHTML={{
                      __html: proposal?.terms?.value
                        ? proposal?.terms?.value
                        : "",
                    }}
                    fontSize="md"
                  />

                  <Flex
                    mt={6}
                    justifyContent={"space-between"}
                    alignItems={"flex-end"}
                  >
                    <Box mt={10}>
                      <Text fontWeight="bold" fontSize="lg">
                        Thank you.
                      </Text>
                      <Text fontWeight={"bold"}>
                        {proposal?.companyInfo?.companyName}
                      </Text>
                      <Text>Mob: {proposal?.companyInfo?.Phone}</Text>
                      <Text>Email: {proposal?.companyInfo?.Email}</Text>
                      <Text whiteSpace={"nowrap"}>
                        Date:{" "}
                        {proposal?.sentDate
                          ? new Date(proposal?.sentDate).toLocaleDateString(
                              "en-GB",
                              {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                                hour12: true,
                              }
                            )
                          : ""}
                      </Text>
                    </Box>
                    {(proposal?.status === "ACCEPTED" ||
                      proposal?.status === "DECLINED") && (
                      <VStack
                        alignItems={"flex-end"}
                        justifyContent={"flex-start"}
                      >
                        <Tag
                          size={"lg"}
                          colorScheme={
                            proposal?.status === "ACCEPTED" ? "green" : "red"
                          }
                        >
                          {proposal?.status}
                        </Tag>
                        <Text>
                          <strong>Note: </strong>
                          {proposal?.clientNote}
                        </Text>
                        <Image
                          crossOrigin="anonymous"
                          src={proposal?.Esign}
                          width={"30%"}
                        ></Image>
                        <Text fontWeight={"bold"}>
                          Signnature - {proposal?.name}
                        </Text>
                        <Text>
                          Date:{" "}
                          {proposal?.clientReactionDate
                            ? new Date(
                                proposal?.clientReactionDate
                              ).toLocaleDateString("en-GB", {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                                hour12: true,
                              })
                            : ""}
                        </Text>
                      </VStack>
                    )}
                  </Flex>
                </A4Box>
              </A4ResponsiveWrapper>
            </VStack>
          )}

          {showAccept && (
            <Flex justifyContent={"center"} w={"100%"} p={2}>
              <ESignCanvas back={setShowAccept} />
            </Flex>
          )}
          {proposal?.status !== "ACCEPTED" &&
          proposal?.status !== "DECLINED" ? (
            <HStack
              p={4}
              gap={6}
              justifyContent={"space-evenly"}
              shadow={"md"}
              w={"full"}
              bg={"white"}
            >
              {!showAccept && (
                <Button
                  colorScheme="green"
                  onClick={() => setShowAccept(true)}
                  leftIcon={<FaCheck />}
                >
                  ACCEPT
                </Button>
              )}
              {!showAccept && (
                <Button
                  colorScheme="red"
                  variant={"outline"}
                  leftIcon={<FaTimes />}
                >
                  DECLINE
                </Button>
              )}
              {showAccept && (
                <Button
                  leftIcon={<FaBackward />}
                  onClick={() => setShowAccept(false)}
                  colorScheme="orange"
                  variant={"outline"}
                >
                  BACK
                </Button>
              )}
            </HStack>
          ) : (
            <Flex
              bg={proposal?.status === "ACCEPTED" ? "green.400" : "red.400"}
              w={"full"}
              alignItems={"center"}
              justifyContent={"center"}
            >
              <Text
                p={4}
                textAlign={"center"}
                color={"white"}
                fontWeight={"bold"}
              >
                {proposal?.status === "ACCEPTED"
                  ? "YOU HAVE ALREADY ACCEPTED THE PROPOSAL"
                  : "YOU HAVE ALREADY DECLINED THE PROPOSAL"}
              </Text>
              <Button
                leftIcon={<FaDownload />}
                colorScheme="blue"
                onClick={handleDownloadPDF}
              >
                Download
              </Button>
            </Flex>
          )}
        </VStack>
      )}
    </>
  );
};

export default ClientProposalView;
