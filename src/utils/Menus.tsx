import React from "react";
import { useLocation, useParams } from "react-router-dom";
import { Box, Text, chakra } from "@chakra-ui/react";
import { motion } from "framer-motion";

const Menus = () => {
  const { id } = useParams<string>();
  const location = useLocation();
  // console.log(location.pathname.split('/')[1],"location")
  const activeMenu = [
    {
      link: "/",
      text: "Dashboard",
    },

    {
      link: "/admin-dashboard",
      text: "Dashboard",
    },
    {
      link: "/super-dashboard",
      text: "Dashboard",
    },
    {
      link: "/profile",
      text: "Profile Settings",
    },
    {
      link: "/support",
      text: "Raise Ticket",
    },
    {
      link: "/add-lead",
      text: "Add Lead",
    },
    {
      link: "/user-list",
      text: "Team List",
    },
    {
      link: "/lead-list",
      text: "Lead List",
    },
    {
      link: "/source-list",
      text: "Source List",
    },
    {
      link: "/product-list",
      text: "Product List",
    },
    {
      link: "/branch-list",
      text: "Branch List",
    },
    {
      link: "/template",
      text: "WhatsApp Template",
    },
    {
      link: "/whatsapp-image",
      text: "Image Template",
    },
    {
      link: "/whatsapp-document",
      text: "Document Template",
    },
    {
      link: "/add-message",
      text: "Add WhatsApp Template",
    },
    {
      link: "/add-image",
      text: "Add WhatsApp Image",
    },
    {
      link: "/add-document",
      text: "Add WhatsApp Document",
    },
    {
      link: "/addnewuser",
      text: "Add New User",
    },
    {
      link: "/add-source",
      text: "Add Source",
    },
    {
      link: "/add-course",
      text: "Add Course",
    },
    {
      link: "/add-branch",
      text: "Add Branch",
    },
    {
      link: "/add-basic-information",
      text: "Add Basic Information",
    },
    {
      link: "/add-city",
      text: "Add City",
    },
    {
      link: "/add-status",
      text: "Add Status",
    },
    {
      link: "/status-list",
      text: "Status List",
    },
    {
      link: "/city-list",
      text: "City List",
    },
    {
      link: `/update-course/:id`,
      text: "Update Course",
    },
    {
      link: "/update-branch/:id",
      text: "Update Branch",
    },
    {
      link: "/update-source/:id",
      text: "Update Source",
    },
    {
      link: "/update-city/:id",
      text: "Update City",
    },
    {
      link: "/update-status/:id",
      text: "Update Status",
    },
    {
      link: "/log/:id",
      text: "Update Log",
    },
    {
      link: "/update-admin/:id",
      text: "Update Admin",
    },
    {
      link: "/update-user/:id",
      text: "Update User",
    },
    {
      link: "/proposal",
      text: "Create Proposal",
    },
    {
      link: "/proposal-list",
      text: "Proposal List",
    },
    {
      link: "/proposal-view",
      text: "Proposal View",
    },
    {
      link: "/proposal-greeting",
      text: "Proposal Greetings",
    },
    {
      link: "/india-mart",
      text: "India Mart",
    },
    {
      link: "/sidemenu",
      text: "Create SideMenu",
    },
    {
      link: "/integration",
      text: "Integration",
    },
    {
      link: "/admin-list",
      text: "Admin List",
    },
    {
      link: "/addnewadmin",
      text: "Add Admin",
    },
  ];

  const AnimationText = {
    hidden: { opacity: 0, y: -50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.9,
      },
    },
  };
  const AnimatedText = chakra(motion(Text));
  return (
    <Box ml={5}>
      {activeMenu?.map((el, i) => (
        <AnimatedText
          initial="hidden"
          animate="visible"
          variants={AnimationText}
          key={i}
          fontSize={"1.2rem"}
          lineHeight={"1.4rem"}
          fontWeight={"600"}
        >
          {location.pathname.split("/")[1] === el.link.split("/")[1]
            ? el.text
            : ""}
        </AnimatedText>
      ))}
    </Box>
  );
};

export default Menus;
