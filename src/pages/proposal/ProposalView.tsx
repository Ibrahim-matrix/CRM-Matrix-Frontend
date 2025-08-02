import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Divider,
  Flex,
  Grid,
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
  useToast,
} from "@chakra-ui/react";
import { MdLocationOn, MdPhone, MdEmail } from "react-icons/md";
import { FaWhatsapp, FaGlobe, FaSeedling } from "react-icons/fa";
import { Navigate, useNavigate, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  getData,
  getDataById,
  postData,
} from "../../redux/actions/common.action";
import HtmlPaginated from "./components/HtmlPaginated ";
import bottomImage from "../../icons/pdfbg.png";
import topImage from "../../icons/collogo.png";
import bgImage from "../../icons/logo.jpg";

import html2pdf from "html2pdf.js";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

import "./proposal.css";
import { FaCheck, FaDownload, FaPrint, FaTimes } from "react-icons/fa";
import { A4ResponsiveWrapper } from "./components/A4ResponsiveWrapper";
import Cookies from "js-cookie";
import axios from "axios";
import { BASE_URL } from "../../config/RequestMethod";
import ProposalInfoSkeleton from "./components/ProposalInfoSkeleton ";

// Dummy EMI Plan
const emis = [
  { label: "1st EMI", percentage: 10 },
  { label: "2nd EMI", percentage: 20 },
  { label: "3rd EMI", percentage: 30 },
  { label: "4th EMI", percentage: 40 },
];

export const A4Box = ({
  children,
  imageUrl,
}: {
  children: React.ReactNode;
  imageUrl: string;
}) => (
  <Box
    bg="white"
    w="794px"
    h="1122px"
    boxShadow="lg"
    px={10}
    py={24}
    position="relative"
    overflow="hidden"
    className="page"
  >
    {/* Background image as absolutely positioned Image component */}
    <Image
      src={imageUrl}
      alt="Background"
      position="absolute"
      top={40}
      left={0}
      width="100%"
      height="fit-content"
      objectFit="contain" // or "cover" depending on your design
      opacity={0.1}
      zIndex={0}
      crossOrigin="anonymous"
    />
    {children}
  </Box>
);

interface ProposalDetails {
  proposal: {
    name: string;
    email: string;
    phone: string;
    status: string;
    sentDate: Date;
    clientReactionDate: Date;
    clientNote: string;
    Esign: string;
    location: string;
    greetingId: string;
    descriptions: {
      value: string;
    };
    terms: {
      value: string;
    };
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
    }[];
    createdBY: {
      name: string;
      userId: string;
    };
  };

  courses: {
    CourseName: string;
  }[];
  signinuser: any;
  user: any;
  proposalGreeting: {
    _id: string;
    title: string;
    greeting: string;
  };
  loading: boolean;
}

const ProposalView = () => {
  const { proposal, courses, signinuser, user, proposalGreeting, loading } =
    useSelector((state: { common: ProposalDetails }) => state.common);
  const toast = useToast();
  const [searchParams] = useSearchParams();
  const proposalId = searchParams.get("proposalId");
  const sendId = searchParams.get("sendId");
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  const [pdfUrl, setPdfUrl] = useState("");
  const [uploadedPdfUrl, setUploadedPdfUrl] = useState<string>();

  const dispatch: any = useDispatch();
  const navigate = useNavigate();

  console.log(proposalGreeting);
  console.log(user);

  useEffect(() => {
    dispatch(getData("course"));
  }, []);

  useEffect(() => {
    if (!proposal) return;
    dispatch(getDataById(proposal?.greetingId, "proposalGreeting"));
  }, [proposal]);

  useEffect(() => {
    if (signinuser?.UserType === 2) {
      dispatch(getDataById(signinuser?.userId, "user"));
    } else if (signinuser?.UserType === 3) {
      dispatch(getDataById(signinuser?.userId, "user")).then(() => {
        dispatch(getDataById(user?.parentId, "user"));
      });
    }
  }, [signinuser]);

  useEffect(() => {
    if (!proposalId) return;
    dispatch(getDataById(proposalId, "proposal"));
  }, [proposalId]);

  const handlePrint = () => window.print();

  const handleDownloadPDF = async () => {
    setIsGeneratingPDF(true); // Temporarily remove gaps

    await new Promise((resolve) => setTimeout(resolve, 100)); // Allow re-render

    const element = document.querySelector(".print-area");

    html2pdf()
      .set({
        margin: 0,
        filename: "proposal.pdf",
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: "px", format: [794, 1122], orientation: "portrait" },
      })
      .from(element)
      .save()
      .then(() => {
        setIsGeneratingPDF(false); // Restore layout
      });
  };

  const handleSendProposalPDF = async () => {
    if (!sendId) return;
    dispatch(postData({ id: sendId }, "client-proposal", navigate, toast));
  };

  console.log(pdfUrl);

  return (
    <>
      <VStack
        align="center"
        bg="gray.100"
        gap={isGeneratingPDF ? 0 : 6}
        spacing={0}
      >
        <A4ResponsiveWrapper isDownload={isGeneratingPDF}>
          {/* Page 1: Greeting */}
          <A4Box imageUrl={user?.ComapanyImageTwo}>
            {loading ? (
              <ProposalInfoSkeleton />
            ) : (
              <>
                <Image src={topImage} w={"40%"}></Image>
                <Box>
                  <Text fontWeight="bold">Dear, {proposal?.name}</Text>
                  <Text fontSize={"sm"}>
                    <span style={{ fontWeight: "bold" }}>Email Id:</span>{" "}
                    {proposal?.email}
                  </Text>
                  <Text fontSize={"sm"}>
                    <span style={{ fontWeight: "bold" }}>Contact No:</span>{" "}
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
                    __html: proposalGreeting?.greeting,
                  }}
                />
                <Box mt={6}>
                  <Text fontWeight={"bold"}>Kind Regards,</Text>
                  <Text fontWeight={"bold"}>{user?.Name}</Text>
                  <Text>Mob: {user?.Phone}</Text>
                  <Text>Email: {user?.Email}</Text>
                  <Text fontWeight={"bold"}>{user?.companyName}</Text>
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
                  <Icon as={MdLocationOn} boxSize={8} mt={1} color={"white"} />
                  <Text fontSize="12px" color={"white"}>
                    {user?.Address}
                  </Text>
                </Flex>

                {/* Column 2 - Phone and WhatsApp */}
                <Flex direction="column" gap={3} pl={4}>
                  <Flex align="center" gap={3}>
                    <Icon as={MdPhone} boxSize={5} color={"white"} />
                    <Text fontSize="12px" color={"white"}>
                      {user?.Phone}
                    </Text>
                  </Flex>
                  <Flex align="center" gap={3}>
                    <Icon as={FaWhatsapp} boxSize={5} color="green.400" />
                    <Text fontSize="12px" color={"white"}>
                      {user?.Phone}
                    </Text>
                  </Flex>
                </Flex>

                {/* Column 3 - Email and Website */}
                <Flex direction="column" gap={3}>
                  <Flex align="center" gap={3}>
                    <Icon as={MdEmail} boxSize={5} color={"white"} />
                    <Link fontSize="12px" color={"white"} isExternal>
                      {user?.Email}
                    </Link>
                  </Flex>
                  <Flex align="center" gap={3}>
                    <Image
                      src="https://www.google.com/favicon.ico"
                      boxSize={5}
                      alt="Google"
                    />
                    <Link fontSize="12px" color={"white"} isExternal>
                      {user?.webURL}
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
          <A4Box imageUrl={user?.ComapanyImageTwo}>
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

                <GridItem colSpan={3} py={3} px={2} border="1px solid #ddd">
                  Product Name
                </GridItem>

                <GridItem py={3} px={2} border="1px solid #ddd">
                  Qty
                </GridItem>

                <GridItem py={3} px={2} border="1px solid #ddd">
                  Price
                </GridItem>

                <GridItem colSpan={2} py={3} px={2} border="1px solid #ddd">
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
                  <GridItem colSpan={3} py={6} px={2} border="1px solid #ddd">
                    <Text>
                      {
                        courses?.find(
                          (product: any) => product?._id === item?.productId
                        )?.CourseName
                      }
                    </Text>
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
                  <GridItem colSpan={2} py={6} px={2} border="1px solid #ddd">
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
                  <Text fontWeight="bold">₹{proposal?.total?.toFixed(2)}</Text>
                </GridItem>
              </SimpleGrid>
            </HStack>
          </A4Box>

          {/* Page 4: Payment Plan */}
          <A4Box imageUrl={user?.ComapanyImageTwo}>
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
          <A4Box imageUrl={user?.ComapanyImageTwo}>
            <Text fontSize="xl" fontWeight="bold" mb={4}>
              Terms & Conditions
            </Text>
            <Box
              dangerouslySetInnerHTML={{ __html: proposal?.terms?.value }}
              fontSize="md"
            />

            <Flex mt={4} justifyContent={"space-between"} alignItems={"flex-end"}>
              <Box mt={10}>
                <Text fontWeight="bold" fontSize="lg">
                  Thank you.
                </Text>
                <Text fontWeight={"bold"}>{user?.companyName}</Text>
                <Text>Mob: {user?.Phone}</Text>
                <Text>Email: {user?.Email}</Text>
                <Text whiteSpace={"nowrap"}>
                  Date:{" "}
                  {new Date(proposal?.sentDate).toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: true,
                  })}
                </Text>
              </Box>
              {(proposal?.status === "ACCEPTED" ||
                proposal?.status === "DECLINED") && (
                <VStack alignItems={"flex-end"} justifyContent={"flex-end"}>
                  <Tag
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
                  <Image src={proposal?.Esign} width={"30%"}></Image>
                  <Text fontWeight={"bold"}>Signnature - {proposal?.name}</Text>
                  <Text>
                    Date:{" "}
                    {new Date(proposal?.clientReactionDate).toLocaleDateString(
                      "en-GB",
                      {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: true,
                      }
                    )}
                  </Text>
                </VStack>
              )}
            </Flex>
          </A4Box>
        </A4ResponsiveWrapper>
      </VStack>
      <HStack justify="space-evenly" w="100%" shadow={"md"} py={2}>
        <Button
          leftIcon={<FaPrint />}
          variant={"outline"}
          colorScheme="blue"
          className="no-print"
          onClick={handlePrint}
        >
          Print Proposal
        </Button>
        <Button
          leftIcon={<FaDownload />}
          variant={"outline"}
          colorScheme="blue"
          onClick={handleDownloadPDF}
        >
          Download
        </Button>

        {sendId && (
          <Button
            leftIcon={<FaSeedling />}
            variant={"solid"}
            colorScheme="green"
            onClick={handleSendProposalPDF}
            isDisabled={loading}
          >
            {loading ? "Sending..." : "Send Proposal"}
          </Button>
        )}
      </HStack>
    </>
  );
};

export default ProposalView;
