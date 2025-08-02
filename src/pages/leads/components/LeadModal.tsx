import React from "react";
import {
  Badge,
  Box,
  Button,
  Flex,
  RadioGroup,
  SimpleGrid,
  Stack,
  Table,
  TableContainer,
  Tbody,
  Radio,
  Td,
  Text,
  Textarea,
  Th,
  Thead,
  Tr,
  ModalOverlay,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
} from "@chakra-ui/react";
import { Modal, ModalContent, ModalBody } from "@chakra-ui/react";
import CourseNamePopup from "./CourseNamePopup";
import CoursePricePopup from "./CoursePricePopup";
import StatusPopup from "./StatusPopup";
import UpdateDatePopup from "./UpdateDatePopup";
import AttachmentPopup from "./AttachmentPopup";
import { AiOutlineWhatsApp } from "react-icons/ai";
import { getDataById } from "../../../redux/actions/common.action";
import moment from "moment";
import ProposalPopup from "./ProposalPopup";

interface Props {
  isSideBar: boolean;
  onClose: any;
  isOpen: any;
  lead: any;
  logtype: any;
  setLogtype: any;
  remarks: any;
  setRemarks: any;
  AddLog: any;
  leadLogss: any;
  prevCourses: any;
  prevStatusHistory: any;
  prevFollowups: any;
}

const LeadModal: React.FC<Props> = ({
  isSideBar,
  onClose,
  isOpen,
  lead,
  logtype,
  setLogtype,
  remarks,
  setRemarks,
  AddLog,
  leadLogss,
  prevCourses,
  prevStatusHistory,
  prevFollowups,
}) => {
  return (
    <Modal
      onClose={onClose}
      // onClose={() => { }}
      size="custom"
      isOpen={isOpen}
      isCentered={false}
      trapFocus={false}
      motionPreset="none"
      closeOnOverlayClick={true}
    >
      <ModalContent
        height="calc(100vh - 4.5rem)"
        mt={"4.5rem"}
        ml={isSideBar ? "175px" : "415px"}
        // pointerEvents="auto"
        // width={isSideBar ? "calc(100vw - 175px)" : "calc(100vw - 415px)"}
        sx={{
          position: "fixed",
        }}
      >
        <ModalBody width="79rem" bg={"white"}>
          <Stack h="100%">
            <SimpleGrid
              columns={2}
              gridTemplateColumns="30% 70%"
              border={"1px solid #ccc"}
            >
              <Box>
                <Box border="1px solid #ccc" borderRadius={5} m={1}>
                  <TableContainer>
                    <Table size="sm" variant="simple">
                      <Thead>
                        <Tr w={15} p={0.5}>
                          <Th fontWeight={"700"} w={15} p={0.5}>
                            Client Details
                          </Th>
                          <Th w={15} p={0.5}></Th>
                        </Tr>
                      </Thead>
                      <Tbody>
                        <Tr
                          w={15}
                          p={0.5}
                          borderLeft={"4px"}
                          borderLeftColor={"#FF0000"}
                        >
                          <Td
                            w={15}
                            fontSize={"0.7rem"}
                            p={0.5}
                            fontWeight={500}
                          >
                            Name
                          </Td>
                          <Td w={15} fontSize={"0.7rem"} p={0.5}>
                            {lead?.Name}
                          </Td>
                        </Tr>
                        <Tr w={15} p={0.5}>
                          <Td
                            w={15}
                            fontSize={"0.7rem"}
                            p={0.5}
                            fontWeight={500}
                            borderLeft={"4px"}
                            borderLeftColor={"#8CB663"}
                          >
                            Mobile
                          </Td>
                          <Td w={15} fontSize={"0.7rem"} p={0.5}>
                            {lead?.Phone1}
                          </Td>
                        </Tr>
                        <Tr w={15} p={0.5}>
                          <Td
                            w={15}
                            fontSize={"0.7rem"}
                            p={0.5}
                            fontWeight={500}
                            borderLeft={"4px"}
                            borderLeftColor={"#0A9AE3"}
                          >
                            Phone No.
                          </Td>
                          <Td w={15} fontSize={"0.7rem"} p={0.5}>
                            {lead?.Phone2}
                          </Td>
                        </Tr>
                        <Tr w={15} p={0.5}>
                          <Td
                            w={15}
                            fontSize={"0.7rem"}
                            p={0.5}
                            fontWeight={500}
                            borderLeft={"4px"}
                            borderLeftColor={"#B235C6"}
                          >
                            Email ID
                          </Td>
                          <Td w={15} fontSize={"0.7rem"} p={0.5}>
                            {lead?.Email}
                          </Td>
                        </Tr>
                        <Tr w={15} p={0.5}>
                          <Td
                            w={15}
                            fontSize={"0.7rem"}
                            p={0.5}
                            fontWeight={500}
                            borderLeft={"4px"}
                            borderLeftColor={"#EFF230"}
                          >
                            Address
                          </Td>
                          <Td w={15} fontSize={"0.7rem"} p={0.5}>
                            {lead?.location}
                          </Td>
                        </Tr>
                        <Tr w={15} p={0.5}>
                          <Td
                            w={15}
                            fontSize={"0.7rem"}
                            p={0.5}
                            fontWeight={500}
                            borderLeft={"4px"}
                            borderLeftColor={"#FF0000"}
                          >
                            City
                          </Td>
                          <Td w={15} fontSize={"0.7rem"} p={0.5}>
                            {lead?.cityId?.cityName}
                          </Td>
                        </Tr>
                        <Tr w={15} p={0.5}>
                          <Td
                            w={15}
                            fontSize={"0.7rem"}
                            p={0.5}
                            fontWeight={500}
                            borderLeft={"4px"}
                            borderLeftColor={"#8CB663"}
                          >
                            Product
                          </Td>
                          <Td w={15} fontSize={"0.7rem"} p={0.5}>
                            <Box
                              display={"flex"}
                              justifyContent={"space-between"}
                              alignItems={"center"}
                              w="100%"
                            >
                              {lead?.courseId?.CourseName}
                              <CourseNamePopup
                                course={lead?.courseId?.CourseName}
                                id={lead?._id}
                                getDataById={getDataById}
                                coursePrice={lead?.CoursePrice}
                              />
                            </Box>
                          </Td>
                        </Tr>
                        <Tr w={15} p={0.5}>
                          <Td
                            w={15}
                            fontSize={"0.7rem"}
                            p={0.5}
                            fontWeight={500}
                            borderLeft={"4px"}
                            borderLeftColor={"#0A9AE3"}
                          >
                            Price
                          </Td>
                          <Td w={15} fontSize={"0.7rem"} p={0.5}>
                            <Box
                              display={"flex"}
                              justifyContent={"space-between"}
                              alignItems={"center"}
                            >
                              {lead?.CoursePrice}
                              <CoursePricePopup
                                coursePrice={lead?.CoursePrice}
                                id={lead?._id}
                                getDataById={getDataById}
                              />
                            </Box>
                          </Td>
                        </Tr>
                        <Tr w={15} p={0.5}>
                          <Td
                            w={15}
                            fontSize={"0.7rem"}
                            p={0.5}
                            fontWeight={500}
                            borderLeft={"4px"}
                            borderLeftColor={"#B235C6"}
                          >
                            Assign To
                          </Td>
                          <Td w={15} fontSize={"0.7rem"} p={0.5}>
                            {lead?.assignId?.Name}
                          </Td>
                        </Tr>
                        <Tr w={15} p={0.5}>
                          <Td
                            w={15}
                            fontSize={"0.7rem"}
                            p={0.5}
                            fontWeight={500}
                            borderLeft={"4px"}
                            borderLeftColor={"#EFF230"}
                          >
                            Status
                          </Td>
                          <Td w={15} fontSize={"0.7rem"} p={0.5}>
                            <Box
                              display={"flex"}
                              justifyContent={"space-between"}
                              alignItems={"center"}
                            >
                              <Badge variant="outline" colorScheme="green">
                                {lead?.statusId?.StatusName}
                              </Badge>
                              <StatusPopup
                                status={lead?.Status}
                                id={lead?._id}
                                getDataById={getDataById}
                              />
                            </Box>
                          </Td>
                        </Tr>
                        {lead?.statusId?.StatusName === "Final" && (
                          <Tr w={15} p={0.5}>
                            <Td
                              w={15}
                              fontSize={"0.7rem"}
                              p={0.5}
                              fontWeight={500}
                              borderLeft={"4px"}
                              borderLeftColor={"#EFF230"}
                            >
                              Proposal
                            </Td>
                            <Td w={15} fontSize={"0.7rem"} p={0.5}>
                              <Box
                                display={"flex"}
                                alignItems={"center"}
                                px={2}
                              >
                                <ProposalPopup leadId={lead?._id} />
                              </Box>
                            </Td>
                          </Tr>
                        )}
                        <Tr w={15} p={0.5}>
                          <Td
                            w={15}
                            fontSize={"0.7rem"}
                            p={0.5}
                            fontWeight={500}
                            borderLeft={"4px"}
                            borderLeftColor={"#FB0101"}
                          >
                            Created By
                          </Td>
                          <Td w={15} fontSize={"0.7rem"} p={0.5}>
                            {lead?.Name}
                          </Td>
                        </Tr>
                        <Tr w={15} p={0.5}>
                          <Td
                            w={15}
                            fontSize={"0.7rem"}
                            p={0.5}
                            fontWeight={500}
                            borderLeft={"4px"}
                            borderLeftColor={"#8CB663"}
                          >
                            Enquiry Date
                          </Td>
                          <Td w={15} fontSize={"0.7rem"} p={0.5}>
                            {new Date(lead?.EnquiryDate).toLocaleString(
                              "en-US",
                              {
                                year: "numeric",
                                month: "numeric",
                                day: "numeric",

                                hour12: true,
                              }
                            )}
                          </Td>
                        </Tr>
                        <Tr w={15} p={0.5}>
                          <Td
                            w={15}
                            fontSize={"0.7rem"}
                            p={0.5}
                            fontWeight={500}
                            borderLeft={"4px"}
                            borderLeftColor={"#0A9AE3"}
                          >
                            Follow Up
                          </Td>
                          <Td w={15} fontSize={"0.7rem"} p={0.5}>
                            <Box
                              display="flex"
                              justifyContent="space-between"
                              alignItems="center"
                            >
                              {lead?.FollowupDate && (
                                <span>
                                  {new Date(lead.FollowupDate).toLocaleString(
                                    "en-US",
                                    {
                                      year: "numeric",
                                      month: "numeric",
                                      day: "numeric",
                                      hour12: true,
                                    }
                                  )}
                                </span>
                              )}
                              <UpdateDatePopup
                                date={lead?.FollowupDate}
                                id={lead?._id}
                                getDataById={getDataById}
                              />
                            </Box>
                          </Td>
                        </Tr>
                        <Tr w={15} p={0.5}>
                          <Td
                            w={15}
                            fontSize={"0.7rem"}
                            p={0.5}
                            fontWeight={500}
                            borderLeft={"4px"}
                            borderLeftColor={"#B235C6"}
                          >
                            Attachment
                          </Td>
                          <Td w={15} fontSize={"0.7rem"} p={0.5}>
                            <AttachmentPopup image={lead?.Attachments} />
                          </Td>
                        </Tr>
                        <Tr w={15} p={0.5}>
                          <Td
                            w={15}
                            fontSize={"0.7rem"}
                            p={0.5}
                            fontWeight={500}
                            borderLeft={"4px"}
                            borderLeftColor={"#EFF230"}
                          >
                            Source
                          </Td>
                          <Td w={15} fontSize={"0.7rem"} p={0.5}>
                            {lead?.sourceId?.SourceName}
                          </Td>
                        </Tr>
                        <Tr w={15} p={0.5}>
                          <Td
                            w={15}
                            fontSize={"0.7rem"}
                            p={0.5}
                            fontWeight={500}
                            borderLeft={"4px"}
                            borderLeftColor={"#FB0101"}
                          >
                            Promotion
                          </Td>
                          <Td
                            w={15}
                            fontSize={"0.9rem"}
                            color={"green.400"}
                            fontWeight={"bold"}
                            p={0.2}
                          >
                            <AiOutlineWhatsApp />
                          </Td>
                        </Tr>
                        <Tr w={15} p={0.5}>
                          <Td
                            w={15}
                            fontSize={"0.7rem"}
                            p={0.5}
                            fontWeight={500}
                            borderLeft={"4px"}
                            borderLeftColor={"#8CB663"}
                          >
                            Remarks
                          </Td>
                          {lead?.Remark && lead?.Remark?.length > 0 && (
                            <Td
                              w={15}
                              fontSize={"0.7rem"}
                              p={0.5}
                              color="red.500"
                              fontWeight={600}
                            >
                              {lead?.Remark.slice(10)}
                            </Td>
                          )}
                        </Tr>
                      </Tbody>
                    </Table>
                  </TableContainer>
                </Box>
                <Box borderRadius={5} m={1} mx={2}>
                  <RadioGroup
                    defaultValue="OutBound"
                    value={logtype}
                    onChange={(value) => setLogtype(value)}
                  >
                    <Stack spacing={10} direction="row">
                      <Text fontWeight={700} fontSize={"0.8rem"}>
                        Log Type:
                      </Text>
                      <Radio
                        fontSize={"0.7rem"}
                        colorScheme="green"
                        value="InBound"
                        borderColor={"gray.400"}
                      >
                        <Text fontSize={"0.7rem"}>Inbound</Text>
                      </Radio>
                      <Radio
                        fontSize={"0.7rem"}
                        colorScheme="green"
                        value="OutBound"
                        borderColor={"gray.400"}
                      >
                        <Text fontSize={"0.7rem"}>Outbound</Text>
                      </Radio>
                    </Stack>
                  </RadioGroup>
                  <Text fontWeight={"700"} fontSize={"0.8rem"}>
                    Remarks
                  </Text>
                  <Textarea
                    value={remarks}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                      setRemarks(e.target.value)
                    }
                    borderColor={"gray.400"}
                    fontSize={"0.7rem"}
                  ></Textarea>
                  <Flex w="full" justifyContent={"flex-end"} mt="1">
                    {/* <Link to="/lead-list"> */}
                    <Button
                      size="xs"
                      mr="2"
                      colorScheme="teal"
                      variant="outline"
                      borderRadius="0.3rem"
                      onClick={onClose} // Replace with your desired onClick handler
                    >
                      Back
                    </Button>
                    {/* </Link> */}
                    <Button
                      size="xs"
                      colorScheme="green"
                      borderRadius="0.3rem"
                      onClick={AddLog}
                    >
                      Add Log
                    </Button>
                  </Flex>
                </Box>
              </Box>

              <Box
                border="1px solid #ccc"
                borderRadius={5}
                m={1}
                overflowY="scroll"
                maxHeight="80vh"
                position={"sticky"}
              >
                {/* <TableContainer>
                  <Box>
                    <Table className="customTable" size="sm" variant="striped">
                      <Thead position="sticky" top="0">
                        <Tr>
                          <Th fontWeight="700" zIndex={2} bg={"white"}>
                            Log History
                          </Th>
                          <Th w={25}></Th>
                        </Tr>
                      </Thead>
                      <Tbody>
                        {leadLogss?.map((el: any, index: any) => (
                          <Tr key={index}>
                            <Td fontSize="0.7rem">
                              <div>
                                <span
                                  style={{
                                    fontWeight: "500",
                                    marginRight: "5px",
                                    color: "black",
                                  }}
                                >
                                  Log Type:
                                </span>
                                {el.LogType}
                              </div>
                              <div
                                style={{
                                  color: "#078431",
                                  fontSize: "12px",
                                  whiteSpace: "pre-wrap",
                                }}
                              >
                                <span
                                  style={{
                                    fontWeight: "500",
                                    marginRight: "5px",
                                    color: "black",
                                  }}
                                >
                                  Remarks:
                                </span>
                                {el.Remarks}
                              </div>
                            </Td>
                            <Td w={15} fontSize="0.7rem" p={0.5}>
                              created by {el.createdBy} on{" "}
                              {moment(el.createdAt).format("DD/MM/YYYY HH:mm")}
                            </Td>
                          </Tr>
                        ))}
                      </Tbody>
                    </Table>
                  </Box>
                </TableContainer> */}
                <Box
                  border="1px solid #ccc"
                  borderRadius={5}
                  m={1}
                  maxHeight="80vh"
                  position="sticky"
                  overflowY="scroll"
                >
                  <Accordion allowToggle>
                    <AccordionItem border="none">
                      <Box p={2}>
                        <AccordionButton
                          p={0}
                          bg="transparent"
                          _hover={{ bg: "transparent" }}
                          _focus={{ boxShadow: "none" }}
                        >
                          <Box
                            flex="1"
                            textAlign="left"
                            fontWeight="700"
                            fontSize="sm"
                          >
                            Log History - {leadLogss?.length || "0"}
                          </Box>
                          <AccordionIcon />
                        </AccordionButton>
                      </Box>

                      <AccordionPanel pt={0}>
                        {leadLogss?.map((el: any, index: number) => (
                          <Box
                            key={index}
                            p={2}
                            mb={2}
                            border="1px solid #e2e8f0"
                            borderRadius="md"
                            fontSize="0.75rem"
                            display={"flex"}
                            alignItems={"center"}
                            justifyContent={"space-between"}
                            bg={index % 2 === 0 ? "gray.50" : "white"}
                          >
                            <Box>
                              <Text mb={1}>
                                <Text as="span" fontWeight="500" color="black">
                                  Log Type:
                                </Text>{" "}
                                {el.LogType}
                              </Text>
                              <Text
                                fontSize="xs"
                                color="#078431"
                                whiteSpace="pre-wrap"
                              >
                                <Text as="span" fontWeight="500" color="black">
                                  Remarks:
                                </Text>{" "}
                                {el.Remarks}
                              </Text>
                            </Box>

                            <Box alignSelf="flex-end" textAlign="right">
                              <Text fontSize="xs">
                                <strong> created by: </strong>
                                {el.createdBy} on{" "}
                                {moment(el.createdAt).format(
                                  "DD/MM/YYYY HH:mm"
                                )}
                              </Text>
                            </Box>
                          </Box>
                        ))}
                      </AccordionPanel>
                    </AccordionItem>
                  </Accordion>
                </Box>
                {/* <Box
                  border="1px solid #ccc"
                  borderRadius={5}
                  m={1}
                  maxHeight="90vh"
                  position={"sticky"}
                  overflowY="scroll"
                >
                  <TableContainer>
                    <Table size="sm" className="customTable">
                      <Thead>
                        <Tr w={15} p={2}>
                          <Th fontWeight="700" w={15} p={0.5}>
                            Product History
                          </Th>
                        </Tr>
                      </Thead>
                      <Tbody>
                        {prevCourses?.map((el: any, index: number) => {
                          return (
                            <Tr w={15} p={2} key={index}>
                              <Td
                                // w={15}
                                fontSize="0.7rem"
                                p={1}
                                style={{
                                  display: "flex",
                                  justifyContent: "space-between",
                                }}
                              >
                                <div>
                                  <div>
                                    <span
                                      style={{
                                        color: "#078431",
                                        fontSize: "12px",
                                      }}
                                    >
                                      Previous Product:
                                    </span>{" "}
                                    {el.prevCourse}
                                  </div>
                                  <div>
                                    {" "}
                                    <span
                                      style={{
                                        color: "#078431",
                                        fontSize: "12px",
                                      }}
                                    >
                                      Product Price:
                                    </span>{" "}
                                    {el.prevPrice}
                                  </div>
                                </div>
                                <div>
                                  Created By {el.createdBy} on{" "}
                                  {moment(el.createdAt).format(
                                    "DD/MM/YYYY HH:mm"
                                  )}
                                </div>
                              </Td>
                            </Tr>
                          );
                        })}
                      </Tbody>
                    </Table>
                  </TableContainer>
                </Box> */}
                <Box
                  border="1px solid #ccc"
                  borderRadius={5}
                  m={1}
                  maxHeight="80vh"
                  position="sticky"
                  overflowY="scroll"
                >
                  <Accordion allowToggle>
                    <AccordionItem border="none">
                      <Box p={2}>
                        <AccordionButton
                          p={0}
                          bg="transparent"
                          _hover={{ bg: "transparent" }}
                          _focus={{ boxShadow: "none" }}
                        >
                          <Box
                            flex="1"
                            textAlign="left"
                            fontWeight="700"
                            fontSize="sm"
                          >
                            Product History - {prevCourses?.length || "0"}
                          </Box>
                          <AccordionIcon />
                        </AccordionButton>
                      </Box>

                      <AccordionPanel pt={0}>
                        {prevCourses?.map((el: any, index: number) => (
                          <Box
                            key={index}
                            p={2}
                            mb={2}
                            borderRadius="md"
                            bg={index % 2 === 0 ? "blue.50" : "white"}
                            fontSize="0.75rem"
                            boxShadow="sm"
                            display="flex"
                            justifyContent="space-between"
                            flexWrap="wrap"
                          >
                            <Box>
                              <Text mb={1}>
                                <Text
                                  as="span"
                                  color="#078431"
                                  fontSize="xs"
                                  fontWeight="bold"
                                >
                                  Previous Product:
                                </Text>{" "}
                                {el.prevCourse}
                              </Text>
                              <Text>
                                <Text
                                  as="span"
                                  color="#078431"
                                  fontSize="xs"
                                  fontWeight="bold"
                                >
                                  Product Price:
                                </Text>{" "}
                                {el.prevPrice}
                              </Text>
                            </Box>

                            <Box alignSelf="flex-end" textAlign="right">
                              <Text fontSize="xs">
                                <strong>Created By: </strong>
                                {el?.createdBy} on{" "}
                                {moment(el?.createdAt).format(
                                  "DD/MM/YYYY HH:mm"
                                )}
                              </Text>
                            </Box>
                          </Box>
                        ))}
                      </AccordionPanel>
                    </AccordionItem>
                  </Accordion>
                </Box>
                {/* <Box
                  border="1px solid #ccc"
                  borderRadius={5}
                  m={1}
                  maxHeight="90vh"
                  position={"sticky"}
                  overflowY="scroll"
                >
                  <TableContainer>
                    <Table size="sm" className="customTable">
                      <Thead>
                        <Tr w={15} p={2}>
                          <Th fontWeight="700" w={15} p={0.5}>
                            Status History
                          </Th>
                        </Tr>
                      </Thead>
                      <Tbody>
                        {prevStatusHistory?.map((el: any, index: any) => (
                          <Tr
                            key={index}
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                            }}
                          >
                            <Td fontSize="0.7rem">
                              <div
                                style={{
                                  color: "#078431",
                                  fontSize: "12px",
                                  whiteSpace: "pre-wrap",
                                }}
                              >
                                <span
                                  style={{
                                    fontWeight: "500",
                                    marginRight: "5px",
                                    color: "black",
                                  }}
                                >
                                  Remarks:
                                </span>
                                {el?.status}
                              </div>
                            </Td>
                            <Td fontSize="0.7rem" p={0.5}>
                              created by {el.createdBy} on{" "}
                              {moment(el.createdAt).format("DD/MM/YYYY HH:mm")}
                            </Td>
                          </Tr>
                        ))}
                      </Tbody>
                    </Table>
                  </TableContainer>
                </Box> */}
                <Box
                  border="1px solid #ccc"
                  borderRadius={5}
                  m={1}
                  maxHeight="80vh"
                  position="sticky"
                  overflowY="scroll"
                >
                  <Accordion allowToggle>
                    <AccordionItem border={"none"}>
                      <Box p={2}>
                        <AccordionButton
                          p={0}
                          bg="transparent"
                          _hover={{ bg: "transparent" }}
                          _focus={{ boxShadow: "none" }}
                        >
                          <Box
                            flex="1"
                            textAlign="left"
                            fontWeight="700"
                            fontSize="sm"
                          >
                            status History - {prevStatusHistory?.length || "0"}
                          </Box>
                          <AccordionIcon />
                        </AccordionButton>
                      </Box>

                      <AccordionPanel pt={0}>
                        {prevStatusHistory?.map((el: any, index: number) => (
                          <Box
                            key={index}
                            p={2}
                            mb={2}
                            border="1px solid #e2e8f0"
                            borderRadius="md"
                            fontSize="0.75rem"
                            display={"flex"}
                            alignItems={"center"}
                            justifyContent={"space-between"}
                            bg={index % 2 === 0 ? "blue.50" : "white"}
                          >
                            <Text>
                              <strong>Remark:</strong> {el?.status}
                            </Text>
                            <Text>
                              <strong>Created by:</strong> {el?.createdBy} on{" "}
                              {moment(el?.createdAt).format("DD/MM/YYYY HH:mm")}
                            </Text>
                          </Box>
                        ))}
                      </AccordionPanel>
                    </AccordionItem>
                  </Accordion>
                </Box>

                {/* <Box
                  border="1px solid #ccc"
                  borderRadius={5}
                  m={1}
                  maxHeight="90vh"
                  position={"sticky"}
                  overflowY="scroll">
                  <TableContainer>
                    <Table size="sm" className="customTable">
                      <Thead>
                        <Tr w={15} p={2}>
                          <Th fontWeight="700" w={15} p={0.5}>
                            Follow Up History
                          </Th>
                        </Tr>
                      </Thead>
                      <Tbody>
                        {prevFollowups?.map((el: any, index: any) => (
                          <Tr
                            key={index}
                            display={"flex"}
                            alignItems={"center"}
                            justifyContent={"space-between"}
                          >
                            <Td fontSize="0.7rem">
                              <span
                                style={{
                                  fontWeight: "500",
                                  marginRight: "5px",
                                  color: "black",
                                }}
                              >Date :
                              </span>
                              {moment(el?.date).format("DD/MM/YYYY")}
                            </Td>
                            <Td fontSize="0.7rem" p={0.5}>
                              created by: {el?.changedBy} on{" "}
                              {moment(el?.changedAt).format("DD/MM/YYYY HH:mm")}
                            </Td>
                          </Tr>
                        ))}
                      </Tbody>
                    </Table>
                  </TableContainer>
                </Box> */}
                <Box
                  border="1px solid #ccc"
                  borderRadius={5}
                  m={1}
                  maxHeight="80vh"
                  position="sticky"
                  overflowY="scroll"
                >
                  <Accordion allowToggle>
                    <AccordionItem border="none">
                      <Box p={2}>
                        {/* Only this text is clickable for toggle */}
                        <AccordionButton
                          p={0}
                          bg="transparent"
                          _hover={{ bg: "transparent" }}
                          _focus={{ boxShadow: "none" }}
                        >
                          <Box
                            flex="1"
                            textAlign="left"
                            fontWeight="700"
                            fontSize="sm"
                          >
                            Follow Up History - {prevFollowups?.length || "0"}
                          </Box>
                          <AccordionIcon />
                        </AccordionButton>
                      </Box>

                      <AccordionPanel pt={0}>
                        {prevFollowups?.map((el: any, index: number) => (
                          <Box
                            key={index}
                            p={2}
                            mb={2}
                            border="1px solid #e2e8f0"
                            borderRadius="md"
                            fontSize="0.75rem"
                            display={"flex"}
                            alignItems={"center"}
                            justifyContent={"space-between"}
                            bg={index % 2 === 0 ? "blue.50" : "white"}
                          >
                            <Text>
                              <strong>Date:</strong>{" "}
                              {moment(el?.date).format("DD/MM/YYYY")}
                            </Text>
                            <Text>
                              <strong>Created by:</strong> {el?.changedBy} on{" "}
                              {moment(el?.changedAt).format("DD/MM/YYYY HH:mm")}
                            </Text>
                          </Box>
                        ))}
                      </AccordionPanel>
                    </AccordionItem>
                  </Accordion>
                </Box>
              </Box>
            </SimpleGrid>
          </Stack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default LeadModal;
