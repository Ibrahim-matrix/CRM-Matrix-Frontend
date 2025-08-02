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
  GET_SINGLE_WHATSIMAGE_DATA_SUCCESS,
  GET_SINGLE_CONTACT_DATA_SUCCESS,
  GET_SINGLE_COURSE_DATA_SUCCESS,
  GET_SINGLE_DATA_FAILURE,
  GET_SINGLE_DATA_REQUEST,
  GET_SINGLE_LEAD_DATA_SUCCESS,
  GET_SINGLE_SOURCE_DATA_SUCCESS,
  GET_SINGLE_STATUS_DATA_SUCCESS,
  GET_SINGLE_USER_DATA_SUCCESS,
  GET_SINGLE_SUPPORT_DATA_SUCCESS,
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
  UPDATE_BRANCH_DATA_SUCCESS,
  UPDATE_SUPPORT_DATA_SUCCESS,
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
  POST_SUPER_SIDEMENU,
  POST_TODO_DATA,
  GET_SUPER_ADMIN_REVENUE,
  GET_SUPER_DASHBOARD_TILES,
  GET_SUPER_SIDEMENU,
  GET_SUPER_TODO,
  GET_SUPER_SINGLE_PARTICULAR_ADMIN_REVENUE,
  UPDATE_SUPER_SIDEMENU,
  UPDATE_SUPER_TODO,
  DELETE_SUPER_SIDEMENU,
  DELETE_TODO_DATA,
  GET_SINGLE_SUPER_SIDEMENU,
  GET_SINGLE_SUPER_TODO,
  POST_SIGN_UP_SUCCESS,
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
import { initialStates } from "../initialStates/initialStates";
import Cookies from "js-cookie";
// import Cookies from "js-cookie";

//This reducer function tooks the initstate as params and action and retrns the data
//and store it in initialstates and we can use initialstates everywhere in the application...
export const commonReducer = (state = initialStates, action) => {
  switch (action.type) {
    //post cases
    case POST_DATA_REQUEST:
      return {
        ...state,
        loading: true,
        success: false,
      };
    case POST_FORGET_PASSWORD_REQUEST:
      return {
        ...state,
        loading: false,
        error: false,
        success: true,
      };
    case POST_FORGET_PASSWORD_SUCCESS:
      return {
        ...state,
        loading: false,
        error: false,
        success: true,
      };
    case POST_COURSE_DATA_SUCCESS:
      return {
        ...state,
        loading: false,
        error: false,
        success: true,
      };
    case POST_BRANCH_DATA_SUCCESS:
      return {
        ...state,
        loading: false,
        error: false,
        success: true,
      };
    case POST_SOURCE_DATA_SUCCESS:
      return {
        ...state,
        loading: false,
        error: false,
        success: true,
      };
    case POST_PROPOSAL_SUCCESS:
      return {
        ...state,
        loading: false,
        error: false,
        success: true,
      };
    case POST_GREETING_CATEGORY_SUCCESS:
      return {
        ...state,
        loading: false,
        error: false,
        success: true,
      };
    case POST_CITY_DATA_SUCCESS:
      return {
        ...state,
        loading: false,
        error: false,
        success: true,
      };
    case POST_WHATSIMAGE_DATA_SUCCESS:
      return {
        ...state,
        loading: false,
        error: false,
        success: true,
      };
    case POST_STATUS_DATA_SUCCESS:
      return {
        ...state,
        loading: false,
        error: false,
        success: true,
      };
    case POST_USER_DATA_SUCCESS:
      return {
        ...state,
        loading: false,
        error: false,
        success: true,
      };
    case POST_SIGN_UP_SUCCESS:
      return {
        ...state,
        loading: false,
        error: false,
        success: true,
      };
    case POST_SUPPORT_DATA_SUCCESS:
      return {
        ...state,
        loading: false,
        error: false,
        success: true,
      };
    case POST_LEAD_DATA_SUCCESS:
      return {
        ...state,
        loading: false,
        error: false,
        success: true,
      };
    case POST_LEAD_ASSIGN_SUCCESS:
      return {
        ...state,
        loading: false,
        error: false,
        success: true,
      };
    case POST_LEAD_LOGS_SUCCESS:
      return {
        ...state,
        loading: false,
        error: false,
        success: true,
      };
    case POST_SUPER_SIDEMENU:
      return {
        ...state,
        loading: false,
        error: false,
        success: true,
      };
    case POST_TODO_DATA:
      return {
        ...state,
        loading: false,
        error: false,
        success: true,
      };
    case POST_SIGN_IN_SUCCESS:
      // Update state
      const newStateSignIn = {
        ...state,
        loading: false,
        error: false,
        success: true,
        // auth: true,
        signinuser: action.payload.userData,
      };

      Cookies.set("signinuser", JSON.stringify(newStateSignIn.signinuser));

      return newStateSignIn;
    case POST_SIGN_OUT_SUCCESS:
      const newStateLogout = {
        ...state,
        loading: false,
        // auth: false,
        error: false,
        success: true,
        signinuser: {},
      };

      Cookies.remove("signinuser");
      return newStateLogout;
    case POST_DATA_FAILURE: {
      return {
        ...state,
        loading: false,
        error: true,
        success: false,
      };
    }

    //get cases
    case GET_DATA_REQUEST:
      return {
        ...state,
        loading: true,
        success: false,
      };
    case GET_COURSE_DATA_SUCCESS:
      return {
        ...state,
        loading: false,
        error: false,
        success: true,
        courses: action.payload,
      };
    case GET_BRANCH_DATA_SUCCESS:
      return {
        ...state,
        loading: false,
        error: false,
        success: true,
        branches: action.payload,
      };
    case GET_SOURCE_DATA_SUCCESS:
      return {
        ...state,
        loading: false,
        error: false,
        success: true,
        sources: action.payload,
      };
    case GET_CITY_DATA_SUCCESS:
      return {
        ...state,
        loading: false,
        error: false,
        success: true,
        cities: action.payload,
      };
    case GET_PROPOSAL_DATA:
      return {
        ...state,
        loading: false,
        error: false,
        success: true,
        proposals: action.payload,
      };
    case GET_PROPOSAL_GREETING_DATA:
      return {
        ...state,
        loading: false,
        error: false,
        success: true,
        proposalGreetings: action.payload,
      };
    case GET_GREETING_CATEGORY_DATA:
      return {
        ...state,
        loading: false,
        error: false,
        success: true,
        greetingCategories: action.payload,
      };
    case GET_WHATSIMAGE_DATA_SUCCESS:
      return {
        ...state,
        loading: false,
        error: false,
        success: true,
        whatsapps: action.payload,
      };
    case GET_CONTACT_DATA_SUCCESS:
      return {
        ...state,
        loading: false,
        error: false,
        success: true,
        contacts: action.payload,
      };
    case GET_STATUS_DATA_SUCCESS:
      return {
        ...state,
        loading: false,
        error: false,
        success: true,
        statuses: action.payload,
      };
    case GET_USER_DATA_SUCCESS:
      return {
        ...state,
        loading: false,
        error: false,
        success: true,
        users: action.payload,
      };
    case GET_SUPPORT_DATA_SUCCESS:
      return {
        ...state,
        loading: false,
        error: false,
        success: true,
        supports: action.payload,
      };
    case GET_ADMIN_DATA_SUCCESS:
      return {
        ...state,
        loading: false,
        error: false,
        success: true,
        admins: action.payload,
      };
    case GET_LEAD_DATA_SUCCESS:
      return {
        ...state,
        loading: false,
        error: false,
        success: true,
        users: action.payload,
      };

    case GET_LEAD_COUNT_SUCCESS:
      return {
        ...state,
        loading: false,
        error: false,
        success: true,
        leadscount: action.payload,
      };
    case GET_SUPER_ADMIN_REVENUE:
      return {
        ...state,
        loading: false,
        error: false,
        success: true,
        adminsrevenue: action.payload,
      };

    case GET_SUPER_DASHBOARD_TILES:
      return {
        ...state,
        loading: false,
        error: false,
        success: true,
        supertiles: action.payload,
      };

    case GET_SUPER_SIDEMENU:
      return {
        ...state,
        loading: false,
        error: false,
        success: true,
        sidemenus: action.payload,
      };

    case GET_SUPER_TODO:
      return {
        ...state,
        loading: false,
        error: false,
        success: true,
        todos: action.payload,
      };

    case GET_COURSE_ANALYTICS_SUCCESS:
      return {
        ...state,
        loading: false,
        error: false,
        success: true,
        courseanalytics: action.payload,
      };
    case GET_SOURCE_ANALYTICS_SUCCESS:
      return {
        ...state,
        loading: false,
        error: false,
        success: true,
        sourceanalytics: action.payload,
      };
    case GET_DATA_FAILURE: {
      return {
        ...state,
        loading: false,
        success: false,
        error: true,
      };
    }
    //get single cases
    case GET_SINGLE_DATA_REQUEST:
      return {
        ...state,
        loading: true,
        success: false,
      };
    case GET_SINGLE_COURSE_DATA_SUCCESS:
      return {
        ...state,
        loading: false,
        error: false,
        success: true,
        course: action.payload,
      };
    case GET_SINGLE_BRANCH_DATA_SUCCESS:
      return {
        ...state,
        loading: false,
        error: false,
        success: true,
        branch: action.payload,
      };
    case GET_SINGLE_SOURCE_DATA_SUCCESS:
      return {
        ...state,
        loading: false,
        error: false,
        success: true,
        source: action.payload,
      };
    case GET_SINGLE_CITY_DATA_SUCCESS:
      return {
        ...state,
        loading: false,
        error: false,
        success: true,
        city: action.payload,
      };
    case GET_SINGLE_WHATSIMAGE_DATA_SUCCESS:
      return {
        ...state,
        loading: false,
        error: false,
        success: true,
        whatsapp: action.payload,
      };
    case GET_SINGLE_CONTACT_DATA_SUCCESS:
      return {
        ...state,
        loading: false,
        error: false,
        success: true,
        contact: action.payload,
      };
    case GET_SINGLE_STATUS_DATA_SUCCESS:
      return {
        ...state,
        loading: false,
        error: false,
        success: true,
        status: action.payload,
      };
    case GET_SINGLE_USER_DATA_SUCCESS:
      return {
        ...state,
        loading: false,
        error: false,
        success: true,
        user: action.payload,
      };
    case GET_SINGLE_PROPOSAL:
      return {
        ...state,
        loading: false,
        error: false,
        success: true,
        proposal: action.payload,
      };
    case GET_SINGLE_PROPOSAL_GREETING:
      return {
        ...state,
        loading: false,
        error: false,
        success: true,
        proposalGreeting: action.payload,
      };
    case GET_SINGLE_SUPPORT_DATA_SUCCESS:
      return {
        ...state,
        loading: false,
        error: false,
        success: true,
        support: action.payload,
      };
    case GET_SUPER_SINGLE_PARTICULAR_ADMIN_REVENUE:
      return {
        ...state,
        loading: false,
        error: false,
        success: true,
        particularadminrevnue: action.payload,
      };

    case GET_SINGLE_ADMIN_DATA_SUCCESS:
      return {
        ...state,
        loading: false,
        error: false,
        success: true,
        admin: action.payload,
      };
    case GET_SINGLE_SUPER_SIDEMENU:
      return {
        ...state,
        loading: false,
        error: false,
        success: true,
        sidemenu: action.payload,
      };
    case GET_SINGLE_SUPER_TODO:
      return {
        ...state,
        loading: false,
        error: false,
        success: true,
        todo: action.payload,
      };
    case GET_SINGLE_LEAD_DATA_SUCCESS:
      return {
        ...state,
        loading: false,
        error: false,
        success: true,
        lead: action.payload.Data,
        logs: action.payload.leadLogss,
        leadLogss: action.payload.leadLogss,
        prevCourses: action.payload.prevCourses,
        prevStatusHistory: action.payload.prevStatusHistory,
        prevFollowups: action.payload.prevFollowups,
      };
    case GET_SINGLE_DATA_FAILURE: {
      return {
        ...state,
        loading: false,
        success: false,
        error: true,
      };
    }

    //delete cases
    case DELETE_DATA_REQUEST:
      return {
        ...state,
        loading: true,
        success: false,
      };
    case DELETE_BRANCH_DATA_SUCCESS:
      return {
        ...state,
        loading: false,
        error: false,
        success: true,
        branches: state.branches.filter(
          (branch) => branch._id !== action.payload
        ),
      };
    case DELETE_COURSE_DATA_SUCCESS:
      return {
        ...state,
        loading: false,
        error: false,
        success: true,
        courses: state.courses.filter(
          (course) => course._id !== action.payload
        ),
      };
    case DELETE_SOURCE_DATA_SUCCESS:
      return {
        ...state,
        loading: false,
        error: false,
        success: true,
        sources: state.sources.filter(
          (source) => source._id !== action.payload
        ),
      };
    case DELETE_CITY_DATA_SUCCESS:
      return {
        ...state,
        loading: false,
        error: false,
        success: true,
        cities: state.cities.filter((city) => city._id !== action.payload),
      };
    case DELETE_WHATSIMAGE_DATA_SUCCESS:
      return {
        ...state,
        loading: false,
        error: false,
        success: true,
        whatsapps: state.whatsapps.filter(
          (whatsapp) => whatsapp._id !== action.payload
        ),
      };
    case DELETE_STATUS_DATA_SUCCESS:
      return {
        ...state,
        loading: false,
        error: false,
        success: true,
        statuses: state.statuses.filter(
          (status) => status._id !== action.payload
        ),
      };
    case DELETE_GREETING_SUCCESS:
      return {
        ...state,
        loading: false,
        error: false,
        success: true,
        proposalGreetings: state.proposalGreetings.filter(
          (greeting) => greeting._id !== action.payload
        ),
      };
    case DELETE_USER_DATA_SUCCESS:
      return {
        ...state,
        loading: false,
        error: false,
        success: true,
        users: state.users.filter((user) => user._id !== action.payload),
      };
    case DELETE_ADMIN_DATA_SUCCESS:
      return {
        ...state,
        loading: false,
        error: false,
        success: true,
        admins: state.admins.filter((admin) => admin._id !== action.payload),
      };
    case DELETE_LEAD_DATA_SUCCESS:
      return {
        ...state,
        loading: false,
        error: false,
        success: true,
        leads: state.leads.filter((leads) => leads._id !== action.payload),
      };
    case DELETE_SUPER_SIDEMENU:
      return {
        ...state,
        loading: false,
        error: false,
        success: true,
        sidemenus: state.sidemenus.filter(
          (sidemenu) => sidemenu._id !== action.payload
        ),
      };
    case DELETE_TODO_DATA:
      return {
        ...state,
        loading: false,
        error: false,
        success: true,
        todos: state.todos.filter((todo) => todo._id !== action.payload),
      };
    case DELETE_DATA_FAILURE: {
      return {
        ...state,
        loading: false,
        success: false,
        error: true,
      };
    }

    //update cases
    case UPDATE_DATA_REQUEST:
      return {
        ...state,
        loading: true,
        success: false,
      };
    case UPDATE_BRANCH_DATA_SUCCESS:
      return {
        ...state,
        loading: false,
        error: false,
        success: true,
        branches: state.branches.map((branch) =>
          branch._id === action.payload._id ? action.payload : branch
        ),
      };
    case UPDATE_SUPPORT_DATA_SUCCESS:
      return {
        ...state,
        loading: false,
        error: false,
        success: true,
        supports: state.supports.map((support) =>
          support._id === action.payload._id ? action.payload : support
        ),
      };
    case UPDATE_COURSE_DATA_SUCCESS:
      return {
        ...state,
        loading: false,
        error: false,
        success: true,
        courses: state.courses.map((course) =>
          course._id === action.payload._id ? action.payload : course
        ),
      };

    case UPDATE_SOURCE_DATA_SUCCESS:
      return {
        ...state,
        loading: false,
        error: false,
        success: true,
        sources: state.sources.map((source) =>
          source._id === action.payload._id ? action.payload : source
        ),
      };
    case UPDATE_CITY_DATA_SUCCESS:
      return {
        ...state,
        loading: false,
        error: false,
        success: true,
        cities: state.cities.map((city) =>
          city._id === action.payload._id ? action.payload : city
        ),
      };
    case UPDATE_WHATSIMAGE_DATA_SUCCESS:
      return {
        ...state,
        loading: false,
        error: false,
        success: true,
        whatsapps: state.whatsapps.map((whatsapp) =>
          whatsapp._id === action.payload._id ? action.payload : whatsapp
        ),
      };
    case UPDATE_STATUS_DATA_SUCCESS:
      return {
        ...state,
        loading: false,
        error: false,
        success: true,
        statuses: state.statuses.map((status) =>
          status._id === action.payload._id ? action.payload : status
        ),
      };
    case UPDATE_USER_DATA_SUCCESS:
      return {
        ...state,
        loading: false,
        error: false,
        success: true,
        users: state.users.map((user) =>
          user._id === action.payload._id ? action.payload : user
        ),
      };
    case UPDATE_ADMIN_DATA_SUCCESS:
      return {
        ...state,
        loading: false,
        error: false,
        success: true,
        admins: state.admins.map((admin) =>
          admin._id === action.payload._id ? action.payload : admin
        ),
      };
    case UPDATE_LEAD_DATA_SUCCESS:
      return {
        ...state,
        loading: false,
        error: false,
        success: true,
        leads: state.leads.map((lead) =>
          lead._id === action.payload._id ? action.payload : lead
        ),
      };
    case UPDATE_PROPOSAL_DATA:
      return {
        ...state,
        loading: false,
        error: false,
        success: true,
        proposals: state.proposals.map((proposal) =>
          proposal._id === action.payload.Data._id
            ? action.payload.Data
            : proposal
        ),
      };
    case UPDATE_PROPOSAL_GREETING_DATA:
      return {
        ...state,
        loading: false,
        error: false,
        success: true,
        proposalGreetings: state.proposalGreetings.map((greeting) =>
          greeting._id === action.payload.Data._id
            ? action.payload.Data
            : greeting
        ),
      };
    case UPDATE_SUPER_SIDEMENU:
      return {
        ...state,
        loading: false,
        error: false,
        success: true,
        sidemenus: state.sidemenus.map((sidemenu) =>
          sidemenu._id === action.payload._id ? action.payload : sidemenu
        ),
      };
    case UPDATE_SUPER_TODO:
      return {
        ...state,
        loading: false,
        error: false,
        success: true,
        todos: state.todos.map((todo) =>
          todo._id === action.payload._id ? action.payload : todo
        ),
      };
    // case UPDATE_LOGCOURSE_DATA_SUCCESS:
    //   return {
    //     ...state,
    //     loading: false,
    //     error: false,
    //     success: true,
    //     lead: state.lead.map((lead) =>
    //       lead._id === action.payload._id ? action.payload : lead
    //     ),
    //   };
    case UPDATE_DATA_FAILURE:
      return {
        ...state,
        loading: false,
        success: false,
        error: true,
      };

    default:
      return state;
  }
};
