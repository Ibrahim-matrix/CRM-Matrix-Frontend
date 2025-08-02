import { Box, Stack } from "@chakra-ui/react";
import Sidebar from "./components/Sidebar";
import { useState } from "react";
import AllRoutes from "./routes/AllRoutes";
import { useEffect } from "react";
import Navbar from "./components/Navbar";
import "./App.css";
import { useLocation } from "react-router-dom";
import LoginRoute from "./pages/login/LoginRoute";
import Cookies from "js-cookie";
import PasswordSetRoute from "./pages/login/PasswordSetRoute";
import ClientProposalView from "./pages/clientProposal/ClientProposalView";

function App() {
  const [isCollapsed, setIsCollapsed] = useState<boolean>(true);
  const [isPasswordSet, setIsPasswordSet] = useState<boolean>(false);
  const [isClientProposalView, setIsClientProposalView] =
    useState<boolean>(false);

  const location = useLocation();
  const handleToggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  useEffect(() => {
    setIsPasswordSet(location.pathname === "/password-set");
    setIsClientProposalView(location.pathname === "/client-proposal-view");
  }, [location.pathname]);

  // const { auth } = useSelector((state:any) => state.common);
  const token = Cookies.get("token");

  return (
    <Stack h="100%">
      {token ? (
        <Box display="flex" h="100%">
          {/* Sidebar */}
          <Sidebar
            isCollapsed={isCollapsed}
            handleToggleCollapse={handleToggleCollapse}
          />

          {/* Content */}
          <Box
            flexGrow={1}
            minWidth={0}
            flexShrink={1}
            ml={isCollapsed ? "80px" : "200px"}
          >
            <Box minH="100vh" bg="gray.200">
              <Navbar
                isCollapsed={isCollapsed}
                handleToggleCollapse={handleToggleCollapse}
              />
              <Box
                minH="89vh"
                borderRadius="md"
                m={2}
                bg={location.pathname === "/" ? "" : "whiteAlpha.900"}
              >
                <AllRoutes isSideBar={isCollapsed} />
              </Box>
            </Box>
          </Box>
        </Box>
      ) : isPasswordSet ? (
        <PasswordSetRoute />
      ) : isClientProposalView ? (
        <ClientProposalView />
      ) : (
        <LoginRoute />
      )}
    </Stack>
  );
}

export default App;
