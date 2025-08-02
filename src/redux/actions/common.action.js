import axios from "axios";
import Cookies from "js-cookie";

import {
  DELETE_BRANCH_DATA_SUCCESS,
  DELETE_CITY_DATA_SUCCESS,
  DELETE_WHATSIMAGE_DATA_SUCCESS,
  DELETE_COURSE_DATA_SUCCESS,
  DELETE_DATA_FAILURE,
  DELETE_DATA_REQUEST,
  DELETE_LEAD_DATA_SUCCESS,
  DELETE_SOURCE_DATA_SUCCESS,
  DELETE_STATUS_DATA_SUCCESS,
  DELETE_USER_DATA_SUCCESS,
  DELETE_ADMIN_DATA_SUCCESS,
  GET_BRANCH_DATA_SUCCESS,
  GET_CITY_DATA_SUCCESS,
  GET_WHATSIMAGE_DATA_SUCCESS,
  GET_CONTACT_DATA_SUCCESS,
  GET_COURSE_ANALYTICS_SUCCESS,
  GET_COURSE_DATA_SUCCESS,
  GET_DATA_FAILURE,
  GET_DATA_REQUEST,
  GET_LEAD_COUNT_SUCCESS,
  GET_LEAD_DATA_SUCCESS,
  GET_SINGLE_BRANCH_DATA_SUCCESS,
  GET_SINGLE_CITY_DATA_SUCCESS,
  GET_SINGLE_CONTACT_DATA_SUCCESS,
  GET_SINGLE_COURSE_DATA_SUCCESS,
  GET_SINGLE_DATA_FAILURE,
  GET_SINGLE_DATA_REQUEST,
  GET_SINGLE_LEAD_DATA_SUCCESS,
  GET_SINGLE_SOURCE_DATA_SUCCESS,
  GET_SINGLE_STATUS_DATA_SUCCESS,
  GET_SINGLE_USER_DATA_SUCCESS,
  GET_SUPER_SINGLE_PARTICULAR_ADMIN_REVENUE,
  GET_SINGLE_ADMIN_DATA_SUCCESS,
  GET_SOURCE_ANALYTICS_SUCCESS,
  GET_SOURCE_DATA_SUCCESS,
  GET_STATUS_DATA_SUCCESS,
  GET_USER_DATA_SUCCESS,
  GET_SUPPORT_DATA_SUCCESS,
  GET_ADMIN_DATA_SUCCESS,
  POST_BRANCH_DATA_SUCCESS,
  POST_CITY_DATA_SUCCESS,
  POST_WHATSIMAGE_DATA_SUCCESS,
  POST_COURSE_DATA_SUCCESS,
  POST_DATA_FAILURE,
  POST_DATA_REQUEST,
  POST_LEAD_DATA_SUCCESS,
  POST_LEAD_ASSIGN_SUCCESS,
  POST_LEAD_LOGS_SUCCESS,
  POST_SIGN_IN_SUCCESS,
  POST_SIGN_OUT_SUCCESS,
  POST_SOURCE_DATA_SUCCESS,
  POST_STATUS_DATA_SUCCESS,
  POST_USER_DATA_SUCCESS,
  POST_SUPPORT_DATA_SUCCESS,
  POST_ADMIN_DATA_SUCCESS,
  UPDATE_BRANCH_DATA_SUCCESS,
  UPDATE_CITY_DATA_SUCCESS,
  UPDATE_WHATSIMAGE_DATA_SUCCESS,
  UPDATE_COURSE_DATA_SUCCESS,
  UPDATE_DATA_FAILURE,
  UPDATE_DATA_REQUEST,
  UPDATE_LEAD_DATA_SUCCESS,
  UPDATE_SOURCE_DATA_SUCCESS,
  UPDATE_STATUS_DATA_SUCCESS,
  UPDATE_USER_DATA_SUCCESS,
  UPDATE_ADMIN_DATA_SUCCESS,
  GET_SINGLE_WHATSIMAGE_DATA_SUCCESS,
  GET_SINGLE_SUPER_SIDEMENU,
  GET_SINGLE_SUPER_TODO,
  GET_SUPER_ADMIN_REVENUE,
  GET_SUPER_DASHBOARD_TILES,
  GET_SUPER_SIDEMENU,
  GET_SUPER_TODO,
  POST_SUPER_SIDEMENU,
  POST_TODO_DATA,
  UPDATE_SUPER_SIDEMENU,
  UPDATE_SUPER_TODO,
  DELETE_SUPER_SIDEMENU,
  DELETE_TODO_DATA,
  POST_SIGN_UP_SUCCESS,
  GET_SINGLE_SUPPORT_DATA_SUCCESS,
  UPDATE_SUPPORT_DATA_SUCCESS,
  POST_FORGET_PASSWORD_REQUEST,
  POST_FORGET_PASSWORD_SUCCESS,
  POST_PROPOSAL_SUCCESS,
  GET_PROPOSAL_DATA,
  GET_SINGLE_PROPOSAL,
  UPDATE_PROPOSAL_DATA,
  GET_PROPOSAL_GREETING_DATA,
  UPDATE_PROPOSAL_GREETING_DATA,
  GET_SINGLE_PROPOSAL_GREETING,
  POST_GREETING_CATEGORY_SUCCESS,
  GET_GREETING_CATEGORY_DATA,
  DELETE_GREETING_SUCCESS,
} from "../types/common.types";
import { BASE_URL, BASE_URL_SUPERADMIN } from "../../config/RequestMethod";

//navigate routes common for navigation
const endpointRoutes = {
  sidemenu: "/sidemenu",
  // todo: "/admin-dashboard",
  adminRevenue: "/adminrevenue",
  supertiles: "/supertiles",
  particularAdmin: "/particularAdmin",
  course: "/product-list",
  branch: "/branch-list",
  source: "/source-list",
  city: "/city-list",
  proposal: "/proposal-list",
  contact: "/contact-list",
  status: "/status-list",
  user: "/user-list",
  issue: "/super-support",
  "": "/admin-list",
  lead: "/lead-list",
  proposal: "/proposal-list",
  assignlead: "lead/assign-to-user",
  template: "/template",
  "/auth/forgot-password": "login",
};

//POST DATA
//these are POSTendpointActionTypesPost for the Types of the redux
//if the endpoint is coming course then it will trigger the TYPE e.g.  POST_COURSE_DATA_SUCCESS,

const POSTendpointActionTypesPost = {
  course: POST_COURSE_DATA_SUCCESS,
  branch: POST_BRANCH_DATA_SUCCESS,
  source: POST_SOURCE_DATA_SUCCESS,
  city: POST_CITY_DATA_SUCCESS,
  template: POST_WHATSIMAGE_DATA_SUCCESS,
  status: POST_STATUS_DATA_SUCCESS,
  user: POST_USER_DATA_SUCCESS,
  issue: POST_SUPPORT_DATA_SUCCESS,
  admin: POST_ADMIN_DATA_SUCCESS,
  lead: POST_LEAD_DATA_SUCCESS,
  assignlead: POST_LEAD_ASSIGN_SUCCESS,
  sidemenu: POST_SUPER_SIDEMENU,
  todo: POST_TODO_DATA,
  proposal: POST_PROPOSAL_SUCCESS,
  proposalGreeting: POST_GREETING_CATEGORY_SUCCESS,
  // "admins/todo": POST_SUPER_TODO,
  "lead/logs": POST_LEAD_LOGS_SUCCESS,
  "auth/signin": POST_SIGN_IN_SUCCESS,
  "auth/signup": POST_SIGN_UP_SUCCESS,
  "auth/signout": POST_SIGN_OUT_SUCCESS,
  "auth/request-forgot-password": POST_FORGET_PASSWORD_REQUEST,
  "/auth/forgot-password": POST_FORGET_PASSWORD_SUCCESS,
};

//common function for postdata
//it took parameter as  formData, endpoint, navigate and toast

export const postData =
  (formData, endpoint, navigate, toast) => async (dispatch) => {
    // Get the success action type based on the endpoint
    let successActionTypePost = POSTendpointActionTypesPost[endpoint];
    dispatch({ type: POST_DATA_REQUEST }); // Dispatch a request action
    try {
      console.log("Posting to:", endpoint, "with data:", formData);
      const token = Cookies.get("token");
      // Get the token from the cookie
      const res = await axios.post(
        `${BASE_URL}${endpoint}`, // Make a POST request to the specified endpoint
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Pass the token in the headers
          },
        }
      );
      console.log(res.data, "ok");

      // Check the role of the user and navigate accordingly
      if (res.data.userData?.UserType === 3) {
        navigate("/");
      }
      if (res.data.userData?.UserType === 2) {
        navigate("/admin-dashboard");
      }
      if (res.data.userData?.UserType === 1) {
        navigate("/super-dashboard");
      }

      dispatch({ type: successActionTypePost, payload: res.data }); // Dispatch the success action with the response data
      console.log(res.data.message, "alert");
      // Display a success toast notification

      const message = res.data?.message || "Operation successful.";
      toast({
        title: message,
        status: "success",
        position: "top-right",
        isClosable: true,
      });

      if (res.data?.token) {
        Cookies.set("token", res.data.token, { expires: 7 });
        // Store the new token as a cookie that expires in 7 days
      }
      if (endpoint in endpointRoutes) {
        navigate(endpointRoutes[endpoint]); // Navigate based on the endpoint route
      }

      return res.data;
    } catch (error) {
      dispatch({ type: POST_DATA_FAILURE, payload: error.message }); // Dispatch a failure action with the error message
      console.log("hi");
      // Display an error toast notification with the error message
      toast({
        title: `${error.response?.data.message}`,
        status: "error",
        position: "top-right",
        isClosable: true,
      });

      console.log(error.message);
    }
  };

export const postDataSuperAdmin =
  (formData, endpoint, navigate, toast) => async (dispatch) => {
    // Get the success action type based on the endpoint
    let successActionTypePost = POSTendpointActionTypesPost[endpoint];
    dispatch({ type: POST_DATA_REQUEST }); // Dispatch a request action
    try {
      const token = Cookies.get("token");
      // Get the token from the cookie
      const res = await axios.post(
        `${BASE_URL_SUPERADMIN}${endpoint}`, // Make a POST request to the specified endpoint
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Pass the token in the headers
          },
        }
      );
      console.log("hi");
      console.log(res.data.userData, "okusr");

      dispatch({ type: successActionTypePost, payload: res.data }); // Dispatch the success action with the response data
      console.log(res.data.message, "alert");
      // Display a success toast notification
      toast({
        title: `${res.data.message}`,
        status: "success",
        position: "top-right",
        isClosable: true,
      });

      if (res.data?.token) {
        Cookies.set("token", res.data.token, { expires: 7 });
        // Store the new token as a cookie that expires in 7 days
      }

      if (endpoint in endpointRoutes) {
        navigate(endpointRoutes[endpoint]); // Navigate based on the endpoint route
      }

      return res.data;
    } catch (error) {
      dispatch({ type: POST_DATA_FAILURE, payload: error.message }); // Dispatch a failure action with the error message
      console.log("error");
      // Display an error toast notification with the error message
      toast({
        title: `${error.response?.data.message}`,
        status: "error",
        position: "top-right",
        isClosable: true,
      });

      console.log(error.message);
    }
  };

//GET DATA
//these are GETendpointActionTypes for the Types of the redux
//if the endpoint is coming course then it will trigger the TYPE e.g.  GET_COURSE_DATA_SUCCESS,
//endpoint are coming  from the parameter of the function and its triggering the action accordingly .
//the types are working as defined in reducer and the data is stored in initial States
//initialStates are in redux initialState folder...
const GETendpointActionTypes = {
  branch: GET_BRANCH_DATA_SUCCESS,
  course: GET_COURSE_DATA_SUCCESS,
  source: GET_SOURCE_DATA_SUCCESS,
  city: GET_CITY_DATA_SUCCESS,
  template: GET_WHATSIMAGE_DATA_SUCCESS,
  contact: GET_CONTACT_DATA_SUCCESS,
  status: GET_STATUS_DATA_SUCCESS,
  user: GET_USER_DATA_SUCCESS,
  assignTo: GET_USER_DATA_SUCCESS,
  "": GET_ADMIN_DATA_SUCCESS,
  issue: GET_SUPPORT_DATA_SUCCESS,
  dashboardAdminsRevenue: GET_SUPER_ADMIN_REVENUE,
  dashboard: GET_SUPER_DASHBOARD_TILES,
  sidemenu: GET_SUPER_SIDEMENU,
  todo: GET_SUPER_TODO,
  proposal: GET_PROPOSAL_DATA,
  proposalGreeting: GET_PROPOSAL_GREETING_DATA,
  greetingCategory: GET_GREETING_CATEGORY_DATA,
  lead: GET_LEAD_DATA_SUCCESS,
  "dashboard/leads-count": GET_LEAD_COUNT_SUCCESS,
  "dashboard/analytics": GET_COURSE_ANALYTICS_SUCCESS,
  "dashboard/source": GET_SOURCE_ANALYTICS_SUCCESS,
};
//common function for getdata in array
//it took parameter as  endpoint only
export const getData = (endpoint) => async (dispatch) => {
  console.log(endpoint);
  const [endpointWithoutQuery, queryParameters] = endpoint.split("?");
  let successActionType = GETendpointActionTypes[endpointWithoutQuery];
  console.log(successActionType);
  dispatch({ type: GET_DATA_REQUEST });

  try {
    console.log("start");
    const token = Cookies.get("token");

    const res = await axios.get(`${BASE_URL}${endpoint}`, {
      headers: {
        Authorization: `Bearer ${token}`, // Pass the token in the headers
      },
    });

    dispatch({ type: successActionType, payload: res.data.Data });
    console.log(res.data);
    return res.data.Data;
  } catch (error) {
    dispatch({ type: GET_DATA_FAILURE, payload: error.message });
    console.log(error);
  }
};

export const getDataSuperAdmin = (endpoint) => async (dispatch) => {
  const [endpointWithoutQuery, queryParameters] = endpoint.split("?");
  let successActionType = GETendpointActionTypes[endpointWithoutQuery];

  dispatch({ type: GET_DATA_REQUEST });

  try {
    const token = Cookies.get("token");

    const res = await axios.get(`${BASE_URL_SUPERADMIN}${endpoint}`, {
      headers: {
        Authorization: `Bearer ${token}`, // Pass the token in the headers
      },
    });

    dispatch({ type: successActionType, payload: res.data.Data });
    return res.data.Data;
  } catch (error) {
    dispatch({ type: GET_DATA_FAILURE, payload: error.message });
    console.log(error);
  }
};

//GET SINGLE DATA BY ID
//these are endpointGetSingleActionTypes for the Types of the redux
//if the endpoint is coming branch then it will trigger the TYPE e.g.  GET_SINGLE_BRANCH_DATA_SUCCESS,
//endpoint are coming  from the parameter of the function and its triggering the action accordingly .
//the types are working as defined in reducer and the data is stored in initial States
//initialStates are in redux initialState folder...
const endpointGetSingleActionTypes = {
  course: GET_SINGLE_COURSE_DATA_SUCCESS,
  branch: GET_SINGLE_BRANCH_DATA_SUCCESS,
  source: GET_SINGLE_SOURCE_DATA_SUCCESS,
  city: GET_SINGLE_CITY_DATA_SUCCESS,
  template: GET_SINGLE_WHATSIMAGE_DATA_SUCCESS,
  contact: GET_SINGLE_CONTACT_DATA_SUCCESS,
  status: GET_SINGLE_STATUS_DATA_SUCCESS,
  user: GET_SINGLE_USER_DATA_SUCCESS,
  adminUsers: GET_SINGLE_ADMIN_DATA_SUCCESS,
  issue: GET_SINGLE_SUPPORT_DATA_SUCCESS,
  adminProductRevenues: GET_SUPER_SINGLE_PARTICULAR_ADMIN_REVENUE,
  sidemenue: GET_SINGLE_SUPER_SIDEMENU,
  todo: GET_SINGLE_SUPER_TODO,
  proposal: GET_SINGLE_PROPOSAL,
  proposalGreeting: GET_SINGLE_PROPOSAL_GREETING,

  lead: GET_SINGLE_LEAD_DATA_SUCCESS,
};

//common function for getdata by id
//it took parameter as id, endpoint
export const getDataById = (id, endpoint) => async (dispatch) => {
  console.log(id, endpoint, "ddd");
  let successGetActionType = endpointGetSingleActionTypes[endpoint];

  dispatch({ type: GET_SINGLE_DATA_REQUEST });
  try {
    const token = Cookies.get("token");

    const res = await axios.get(`${BASE_URL}${endpoint}/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`, // Pass the token in the headers
      },
    });
    dispatch({ type: successGetActionType, payload: res.data });
    console.log(res.data);

    return res.data;
  } catch (error) {
    dispatch({ type: GET_SINGLE_DATA_FAILURE, payload: error.message });
    console.log(error);
  }
};

export const getDataByIdSuperAdmin = (id, endpoint) => async (dispatch) => {
  let successGetActionType = endpointGetSingleActionTypes[endpoint];

  dispatch({ type: GET_SINGLE_DATA_REQUEST });
  try {
    const token = Cookies.get("token");

    const res = await axios.get(`${BASE_URL_SUPERADMIN}${endpoint}/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`, // Pass the token in the headers
      },
    });
    dispatch({ type: successGetActionType, payload: res.data });

    return res.data;
  } catch (error) {
    dispatch({ type: GET_SINGLE_DATA_FAILURE, payload: error.message });
    console.log(error);
  }
};

//DELETE DATA
//these are enpointActionTypes for the Types of the redux
//if the endpoint is coming branch then it will trigger the TYPE e.g.  DELETE_BRANCH_DATA_SUCCESS,
//endpoint are coming  from the parameter of the function and its triggering the action accordingly .
const endpointActionTypesDelete = {
  course: DELETE_COURSE_DATA_SUCCESS,
  branch: DELETE_BRANCH_DATA_SUCCESS,
  source: DELETE_SOURCE_DATA_SUCCESS,
  city: DELETE_CITY_DATA_SUCCESS,
  template: DELETE_WHATSIMAGE_DATA_SUCCESS,
  status: DELETE_STATUS_DATA_SUCCESS,
  user: DELETE_USER_DATA_SUCCESS,
  admin: DELETE_ADMIN_DATA_SUCCESS,
  lead: DELETE_LEAD_DATA_SUCCESS,
  sidemenu: DELETE_SUPER_SIDEMENU,
  proposalGreeting: DELETE_GREETING_SUCCESS,
  // "admins/todo": DELETE_SUPER_TODO,
  todo: DELETE_TODO_DATA,
};
//common function for deleting the data
//it took parameter as id, endpoint,toast

export const deleteData = (id, endpoint, toast) => async (dispatch) => {
  let successDeleteActionType = endpointActionTypesDelete[endpoint];

  dispatch({ type: DELETE_DATA_REQUEST });
  try {
    const token = Cookies.get("token");

    const res = await axios.delete(`${BASE_URL}${endpoint}/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`, // Pass the token in the headers
      },
    });
    if (res.data) {
      dispatch({ type: successDeleteActionType, payload: res.data.Data });
      toast({
        title: `${res.data.message}`,
        status: "success",
        position: "top-right",
        isClosable: true,
      });
      return res.data.Data;
    } else {
      // Handle the case where res.data is undefined
      throw new Error("Invalid response data");
    }
  } catch (error) {
    dispatch({ type: DELETE_DATA_FAILURE, payload: error.message });
    toast({
      title: `${error.response?.data?.message || error.message}`,
      status: "error",
      position: "top-right",
      isClosable: true,
    });
    console.log(error);
  }
};

export const deleteDataSuperAdmin =
  (id, endpoint, toast) => async (dispatch) => {
    let successDeleteActionType = endpointActionTypesDelete[endpoint];

    dispatch({ type: DELETE_DATA_REQUEST });
    try {
      const token = Cookies.get("token");

      const res = await axios.delete(
        `${BASE_URL_SUPERADMIN}${endpoint}/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Pass the token in the headers
          },
        }
      );
      if (res.data) {
        dispatch({ type: successDeleteActionType, payload: res.data.Data });
        toast({
          title: `${res.data.message}`,
          status: "success",
          position: "top-right",
          isClosable: true,
        });
        return res.data.Data;
      } else {
        // Handle the case where res.data is undefined
        throw new Error("Invalid response data");
      }
    } catch (error) {
      dispatch({ type: DELETE_DATA_FAILURE, payload: error.message });
      toast({
        title: `${error.response?.data?.message || error.message}`,
        status: "error",
        position: "top-right",
        isClosable: true,
      });
      console.log(error);
    }
  };

//UPDATE DATA
//these are enpointActionTypes for the Types of the redux
//if the endpoint is coming course then it will trigger the TYPE e.g. UPDATE_COURSE_DATA_SUCCESS.
//endpoint are coming  from the parameter of the function and its triggering the action accordingly .
const endpointActionTypes = {
  course: UPDATE_COURSE_DATA_SUCCESS,
  branch: UPDATE_BRANCH_DATA_SUCCESS,
  source: UPDATE_SOURCE_DATA_SUCCESS,
  city: UPDATE_CITY_DATA_SUCCESS,
  template: UPDATE_WHATSIMAGE_DATA_SUCCESS,
  status: UPDATE_STATUS_DATA_SUCCESS,
  user: UPDATE_USER_DATA_SUCCESS,
  adminUsers: UPDATE_ADMIN_DATA_SUCCESS,
  lead: UPDATE_LEAD_DATA_SUCCESS,
  sidemenu: UPDATE_SUPER_SIDEMENU,
  issue: UPDATE_SUPPORT_DATA_SUCCESS,

  todo: UPDATE_SUPER_TODO,
  proposal: UPDATE_PROPOSAL_DATA,
  proposalGreeting: UPDATE_PROPOSAL_GREETING_DATA,
};

//common function for updating the data
//it took parameter as id endpoint formdata and navigation route and toast
export const updateData =
  (id, endpoint, formData, navigate, toast) => async (dispatch) => {
    console.log(id, formData, "id form actions");
    console.log(endpoint, "endpoint");
    const successUpdateActionType = endpointActionTypes[endpoint];

    if (!successUpdateActionType) {
      console.log(`No success action type defined for endpoint: ${endpoint}`);
      return;
    }
    dispatch({ type: UPDATE_DATA_REQUEST });
    try {
      const token = Cookies.get("token");

      const res = await axios.put(`${BASE_URL}${endpoint}/${id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`, // Pass the token in the headers
        },
      });
      dispatch({ type: successUpdateActionType, payload: res.data });
      console.log(res.data.message, "alert");
      toast({
        title: `${res.data.message}`,
        status: "info",
        position: "top-right",
        isClosable: true,
      });
      if (endpoint in endpointRoutes) {
        navigate(endpointRoutes[endpoint]); // Navigate based on the endpoint route
      }
      return res.data;
    } catch (error) {
      dispatch({ type: UPDATE_DATA_FAILURE, payload: error.message });
      console.log(error);
      toast({
        title: `Something Went wrong..`,
        status: "error",
        position: "top-right",
        isClosable: true,
      });
    }
  };

export const updateDataSuperAdmin =
  (id, endpoint, formData, navigate, toast) => async (dispatch) => {
    console.log(id, formData, "id form actions");
    const successUpdateActionType = endpointActionTypes[endpoint];

    if (!successUpdateActionType) {
      console.log(`No success action type defined for endpoint: ${endpoint}`);
      return;
    }
    dispatch({ type: UPDATE_DATA_REQUEST });
    try {
      const token = Cookies.get("token");

      const res = await axios.put(
        `${BASE_URL_SUPERADMIN}${endpoint}/${id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Pass the token in the headers
          },
        }
      );
      dispatch({ type: successUpdateActionType, payload: res.data });
      console.log(res.data.message, "alert");
      toast({
        title: `${res.data.message}`,
        status: "info",
        position: "top-right",
        isClosable: true,
      });
      if (endpoint in endpointRoutes) {
        navigate(endpointRoutes[endpoint]); // Navigate based on the endpoint route
      }
      return res.data;
    } catch (error) {
      dispatch({ type: UPDATE_DATA_FAILURE, payload: error.message });
      console.log(error);
      toast({
        title: `Something Went wrong..`,
        status: "error",
        position: "top-right",
        isClosable: true,
      });
    }
  };
