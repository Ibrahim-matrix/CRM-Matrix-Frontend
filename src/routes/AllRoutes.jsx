import React, { lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import LazyLoader from "../components/LazyLoader";
import Login from "../pages/login/Login";
import PasswordSet from "../pages/login/PasswordSet";
import PrivateRoute from "../components/PrivateRoute";
import NotFound from "../pages/not-found/NotFound";

// import ProposalPage from "../pages/proposal/Proposal";
// import ProposalList from "../pages/proposal/ProposalList";
// import EditorComponent from "../pages/proposal/ProposalEditor";
// import ProposalView from "../pages/proposal/ProposalView";
// import ProposalGreeting from "../pages/proposal/ProposalGreeting";

const ProposalPage = lazy(() => import("../pages/proposal/Proposal"));
const ProposalList = lazy(() => import("../pages/proposal/ProposalList"));
const EditorComponent = lazy(() => import("../pages/proposal/ProposalEditor"));
const ProposalView = lazy(() => import("../pages/proposal/ProposalView"));
const ProposalGreeting = lazy(() =>
  import("../pages/proposal/ProposalGreeting")
);

// lazy load components
const AddnewUser = lazy(() => import("../pages/user/AddnewUser"));
const AddnewAdmin = lazy(() => import("../pages/user/AddAdmin"));
const TeamList = lazy(() => import("../pages/user/TeamList"));
const AdminList = lazy(() => import("../pages/user/AdminList"));

const LeadFilter = lazy(() => import("../pages/leads/components/LeadFilter"));

const SourceList = lazy(() => import("../pages/source/SourceList"));
const AddNewLead = lazy(() => import("../pages/leads/AddNewLead"));
const AddSource = lazy(() => import("../pages/source/AddSource"));
const CourseList = lazy(() => import("../pages/course/CourseList"));
const AddCourse = lazy(() => import("../pages/course/AddCourse"));
const BranchList = lazy(() => import("../pages/branch/BranchList"));
const CityList = lazy(() => import("../pages/city/CityList"));
const AddStatus = lazy(() => import("../pages/status/AddStatus"));
const StatusList = lazy(() => import("../pages/status/StatusList"));
const AddBasicInfo = lazy(() => import("../pages/user/AddBasicInfo"));
const AddBranch = lazy(() => import("../pages/branch/AddBranch"));
const AddCity = lazy(() => import("../pages/city/AddCity"));
const UpdateCourse = lazy(() => import("../pages/course/UpdateCourse"));
const UpdateBranch = lazy(() => import("../pages/branch/UpdateBranch"));
const UpdateSource = lazy(() => import("../pages/source/UpdateSource"));
const UpdateCity = lazy(() => import("../pages/city/UpdateCity"));
const UpdateTemplate = lazy(() => import("../pages/WhatsApp/UpdateMessage"));
const UpdateStatus = lazy(() => import("../pages/status/UpdateStatus"));
const LeadList = lazy(() => import("../pages/leads/LeadList"));
const UpdateUser = lazy(() => import("../pages/user/UpdateUser"));
const UpdateAdmin = lazy(() => import("../pages/user/UpdateAdmin"));
const UserDashboard = lazy(() => import("../pages/dashboard/UserDashboard"));
const SuperDashboard = lazy(() => import("../pages/dashboard/SuperDashboard"));
const AdminDashboard = lazy(() => import("../pages/dashboard/AdminDashboard"));
const Profile = lazy(() => import("../pages/Profile/Profile"));
const Support = lazy(() => import("../pages/support/Support"));
const SuperSupport = lazy(() => import("../pages/support/SuperSupport"));
const WhatsAppMsg = lazy(() => import("../pages/WhatsApp/Message"));
const WhatsAppImg = lazy(() => import("../pages/WhatsApp/Image"));
const WhatsAppDocs = lazy(() => import("../pages/WhatsApp/Documents"));
const WhatsAppAddMsg = lazy(() => import("../pages/WhatsApp/AddMessage"));
const WhatsAppAddImg = lazy(() => import("../pages/WhatsApp/AddImage"));
const WhatsAppAddDocs = lazy(() => import("../pages/WhatsApp/AddDocuments"));
const SocialIntegration = lazy(() =>
  import("../pages/SocialIntegration/SocialIntegration")
);

const IndiaMart = lazy(() => import("../pages/IndiaMart/IndiaMart"));
const AdminDetails = lazy(() => import("../pages/user/AdminDetails"));
const UserDetails = lazy(() => import("../pages/user/UserDetails"));
const UpdateTicket = lazy(() => import("../pages/support/UpdateTicket"));

const Unauthorized = lazy(() => import("../pages/Unauthorized/Unauthorized"));
const SideMenu = lazy(() => import("../pages/SideMenu/SideMenu"));
const UpdateSideMenu = lazy(() => import("../pages/SideMenu/Update"));

const AllRoutes = ({ isSideBar }) => {
  return (
    <Routes>
      {/* add routes */}
      <Route
        path="/"
        element={
          <Suspense fallback={<LazyLoader />}>
            <PrivateRoute requiredPermissions="Dashboard">
              <UserDashboard />
            </PrivateRoute>
          </Suspense>
        }
      />
      <Route
        path="/login"
        element={
          <Suspense fallback={<LazyLoader />}>
            <Login />
          </Suspense>
        }
      />
      <Route
        path="/password-set"
        element={
          // <Suspense fallback={<LazyLoader />}>
          <PasswordSet />
          // </Suspense>
        }
      />
      <Route
        path="/admin-dashboard"
        element={
          <Suspense fallback={<LazyLoader />}>
            <PrivateRoute requiredPermissions="Dashboard">
              <AdminDashboard />
            </PrivateRoute>
          </Suspense>
        }
      />
      <Route
        path="/proposal"
        element={
          <Suspense>
            <PrivateRoute requiredPermissions="Proposal List">
              <ProposalPage />
            </PrivateRoute>
          </Suspense>
        }
      />
      <Route
        path="/proposal-view"
        element={
          <Suspense>
            <PrivateRoute requiredPermissions="Proposal List">
              <ProposalView />
            </PrivateRoute>
          </Suspense>
        }
      />
      <Route
        path="/proposal-greeting"
        element={
          <Suspense>
            <PrivateRoute requiredPermissions="Proposal List">
              <ProposalGreeting />
            </PrivateRoute>
          </Suspense>
        }
      />

      <Route
        path="/lead-filter"
        element={
          <Suspense fallback={<LazyLoader />}>
            <PrivateRoute requiredPermissions="Dashboard">
              <LeadFilter />
            </PrivateRoute>
          </Suspense>
        }
      />

      <Route
        path="/super-dashboard"
        element={
          <Suspense fallback={<LazyLoader />}>
            <PrivateRoute requiredPermissions="Dashboard">
              <SuperDashboard />
            </PrivateRoute>
          </Suspense>
        }
      />
      <Route
        path="/profile"
        element={
          <Suspense fallback={<LazyLoader />}>
            <PrivateRoute requiredPermissions="Lead List">
              <Profile />
            </PrivateRoute>
          </Suspense>
        }
      />
      <Route
        path="/support"
        element={
          <Suspense fallback={<LazyLoader />}>
            <PrivateRoute requiredPermissions="Lead List">
              <Support />
            </PrivateRoute>
          </Suspense>
        }
      />
      <Route
        path="/super-support"
        element={
          <Suspense fallback={<LazyLoader />}>
            <PrivateRoute requiredPermissions="Dashboard">
              <SuperSupport />
            </PrivateRoute>
          </Suspense>
        }
      />
      <Route
        path="/sidemenu"
        element={
          <Suspense fallback={<LazyLoader />}>
            <PrivateRoute requiredPermissions="SideMenu">
              <SideMenu />
            </PrivateRoute>
          </Suspense>
        }
      />
      <Route
        path="/update-sidemenu"
        element={
          <Suspense fallback={<LazyLoader />}>
            <PrivateRoute requiredPermissions="SideMenu">
              <UpdateSideMenu />
            </PrivateRoute>
          </Suspense>
        }
      />
      <Route
        path="lead-list"
        element={
          <Suspense>
            <PrivateRoute requiredPermissions="Lead List">
              <LeadList isSideBar={isSideBar} />
            </PrivateRoute>
          </Suspense>
        }
      />
      <Route
        path="template"
        element={
          <Suspense fallback={<LazyLoader />}>
            <PrivateRoute requiredPermissions="Lead List">
              <WhatsAppMsg />
            </PrivateRoute>
          </Suspense>
        }
      />
      <Route
        path="whatsapp-image"
        element={
          <Suspense fallback={<LazyLoader />}>
            <PrivateRoute requiredPermissions="Lead List">
              <WhatsAppImg />
            </PrivateRoute>
          </Suspense>
        }
      />
      <Route
        path="whatsapp-document"
        element={
          <Suspense fallback={<LazyLoader />}>
            <PrivateRoute requiredPermissions="Lead List">
              <WhatsAppDocs />
            </PrivateRoute>
          </Suspense>
        }
      />
      <Route
        path="integration"
        element={
          <Suspense fallback={<LazyLoader />}>
            <PrivateRoute requiredPermissions="Lead List">
              <SocialIntegration />
            </PrivateRoute>
          </Suspense>
        }
      />

      <Route
        path="add-message"
        element={
          <Suspense fallback={<LazyLoader />}>
            <PrivateRoute requiredPermissions="Lead List">
              <WhatsAppAddMsg />
            </PrivateRoute>
          </Suspense>
        }
      />
      <Route
        path="add-image"
        element={
          <Suspense fallback={<LazyLoader />}>
            <PrivateRoute requiredPermissions="Lead List">
              <WhatsAppAddImg />
            </PrivateRoute>
          </Suspense>
        }
      />
      <Route
        path="add-document"
        element={
          <Suspense fallback={<LazyLoader />}>
            <PrivateRoute requiredPermissions="Lead List">
              <WhatsAppAddDocs />
            </PrivateRoute>
          </Suspense>
        }
      />
      <Route
        path="/addnewadmin"
        element={
          <Suspense fallback={<LazyLoader />}>
            <PrivateRoute requiredPermissions="Admin List">
              <AddnewAdmin />
            </PrivateRoute>
          </Suspense>
        }
      />
      <Route
        path="/addnewuser"
        element={
          <Suspense fallback={<LazyLoader />}>
            <PrivateRoute requiredPermissions="Team List">
              <AddnewUser />
            </PrivateRoute>
          </Suspense>
        }
      />
      <Route
        path="/add-source"
        element={
          <Suspense fallback={<LazyLoader />}>
            <PrivateRoute requiredPermissions="Source List">
              <AddSource />
            </PrivateRoute>
          </Suspense>
        }
      />
      <Route
        path="/add-lead"
        element={
          <Suspense fallback={<LazyLoader />}>
            <PrivateRoute requiredPermissions="Lead List">
              <AddNewLead />
            </PrivateRoute>
          </Suspense>
        }
      />
      <Route
        path="/add-course"
        element={
          <Suspense fallback={<LazyLoader />}>
            <PrivateRoute requiredPermissions="Product List">
              <AddCourse />
            </PrivateRoute>
          </Suspense>
        }
      />
      <Route
        path="/add-branch"
        element={
          <Suspense fallback={<LazyLoader />}>
            <PrivateRoute requiredPermissions="Branch List">
              <AddBranch />
            </PrivateRoute>
          </Suspense>
        }
      />
      <Route
        path="/add-basic-information"
        element={
          <Suspense fallback={<LazyLoader />}>
            <PrivateRoute>
              <AddBasicInfo />
            </PrivateRoute>
          </Suspense>
        }
      />
      <Route
        path="/add-city"
        element={
          <Suspense fallback={<LazyLoader />}>
            <PrivateRoute requiredPermissions="City List">
              <AddCity />
            </PrivateRoute>
          </Suspense>
        }
      />
      <Route
        path="/add-status"
        element={
          <Suspense fallback={<LazyLoader />}>
            <PrivateRoute requiredPermissions="Status List">
              <AddStatus />
            </PrivateRoute>
          </Suspense>
        }
      />

      {/* list routes  */}
      <Route
        path="/user-list"
        element={
          <Suspense>
            <PrivateRoute requiredPermissions="Team List">
              <TeamList />
            </PrivateRoute>
          </Suspense>
        }
      />
      <Route
        path="/admin-list"
        element={
          <Suspense>
            <PrivateRoute requiredPermissions="Admin List">
              <AdminList />
            </PrivateRoute>
          </Suspense>
        }
      />
      <Route
        path="/proposal-list"
        element={
          <Suspense>
            <PrivateRoute requiredPermissions="Proposal List">
              <ProposalList />
            </PrivateRoute>
          </Suspense>
        }
      />
      <Route
        path="/source-list"
        element={
          <Suspense>
            <PrivateRoute requiredPermissions="Source List">
              <SourceList />
            </PrivateRoute>
          </Suspense>
        }
      />
      <Route
        path="/product-list"
        element={
          <Suspense>
            <PrivateRoute requiredPermissions="Product List">
              <CourseList />
            </PrivateRoute>
          </Suspense>
        }
      />
      <Route
        path="/branch-list"
        element={
          <Suspense>
            <PrivateRoute requiredPermissions="Branch List">
              <BranchList />
            </PrivateRoute>
          </Suspense>
        }
      />
      <Route
        path="/city-list"
        element={
          <Suspense>
            <PrivateRoute requiredPermissions="City List">
              <CityList />
            </PrivateRoute>
          </Suspense>
        }
      />
      <Route
        path="/status-list"
        element={
          <Suspense>
            <PrivateRoute requiredPermissions="Status List">
              <StatusList />
            </PrivateRoute>
          </Suspense>
        }
      />
      <Route
        path="/india-mart"
        element={
          <Suspense>
            <PrivateRoute requiredPermissions="India Mart">
              <IndiaMart />
            </PrivateRoute>
          </Suspense>
        }
      />

      {/* singlepage routes */}
      <Route
        path="admin-details/:id"
        element={
          <Suspense fallback={<LazyLoader />}>
            <PrivateRoute requiredPermissions="Admin List">
              <AdminDetails />
            </PrivateRoute>
          </Suspense>
        }
      />

      <Route
        path="user-details/:id"
        element={
          <Suspense fallback={<LazyLoader />}>
            <PrivateRoute requiredPermissions="Team List">
              <UserDetails />
            </PrivateRoute>
          </Suspense>
        }
      />
      <Route
        path="update-ticket/:id"
        element={
          <Suspense fallback={<LazyLoader />}>
            <PrivateRoute requiredPermissions="Team List">
              <UpdateTicket />
            </PrivateRoute>
          </Suspense>
        }
      />
      <Route
        path="update-course/:id"
        element={
          <Suspense fallback={<LazyLoader />}>
            <PrivateRoute requiredPermissions="Product List">
              <UpdateCourse />
            </PrivateRoute>
          </Suspense>
        }
      />
      <Route
        path="update-branch/:id"
        element={
          <Suspense fallback={<LazyLoader />}>
            <PrivateRoute requiredPermissions="Branch List">
              <UpdateBranch />
            </PrivateRoute>
          </Suspense>
        }
      />
      <Route
        path="update-source/:id"
        element={
          <Suspense fallback={<LazyLoader />}>
            <PrivateRoute requiredPermissions="Source List">
              <UpdateSource />
            </PrivateRoute>
          </Suspense>
        }
      />
      <Route
        path="update-city/:id"
        element={
          <Suspense fallback={<LazyLoader />}>
            <PrivateRoute requiredPermissions="City List">
              <UpdateCity />
            </PrivateRoute>
          </Suspense>
        }
      />
      <Route
        path="update-template/:id"
        element={
          <Suspense fallback={<LazyLoader />}>
            <PrivateRoute requiredPermissions="City List">
              <UpdateTemplate />
            </PrivateRoute>
          </Suspense>
        }
      />
      <Route
        path="update-status/:id"
        element={
          <Suspense fallback={<LazyLoader />}>
            <PrivateRoute requiredPermissions="Status List">
              <UpdateStatus />
            </PrivateRoute>
          </Suspense>
        }
      />
      <Route
        path="update-admin/:id"
        element={
          <Suspense fallback={<LazyLoader />}>
            <PrivateRoute requiredPermissions="Team List">
              <UpdateAdmin />
            </PrivateRoute>
          </Suspense>
        }
      />

      <Route
        path="update-user/:id"
        element={
          <Suspense fallback={<LazyLoader />}>
            <PrivateRoute requiredPermissions="Team List">
              <UpdateUser />
            </PrivateRoute>
          </Suspense>
        }
      />
      <Route
        path="loader"
        element={
          // <Suspense fallback={<LazyLoader/>}>
          <LazyLoader />
          // </Suspense>
        }
      />

      <Route
        path="/unauthorized"
        element={
          <Suspense fallback={<LazyLoader />}>
            <Unauthorized />
          </Suspense>
        }
      />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AllRoutes;
