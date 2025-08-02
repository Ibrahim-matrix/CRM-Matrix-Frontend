import Cookies from "js-cookie";

export const initialStates: {
  course: Record<string, any>;
  user: Record<string, any>;
  singup: Record<string, any>;
  support: Record<string, any>;
  admin: Record<string, any>;
  branch: Record<string, any>;
  source: Record<string, any>;
  city: Record<string, any>;
  whatsapp: Record<string, any>;
  sidemenu: Record<string, any>;
  todo: Record<string, any>;
  contact: Record<string, any>;
  status: Record<string, any>;
  lead: Record<string, any>;
  particularadminrevnue: any[];
  assignlead: Record<string, any>;
  logs: Record<string, any>;
  leadscount: any[];
  signinuser: Record<string, any> | null;
  courses: any[];
  branches: any[];
  sources: any[];
  cities: any[];
  whatsapps: any[];
  statuses: any[];
  users: any[];
  supports: any[];
  admins: any[];
  leads: any[];
  assignleads: any[];
  courseanalytics: any[];
  sourceanalytics: any[];
  adminsrevenue: any[];
  supertiles: any[];
  todos: any[];
  sidemenus: any[];

  success: boolean;
  loading: boolean;
  error: boolean;
  // auth: boolean;
} = {
  course: {},
  user: {},
  singup: {},
  support: {},
  admin: {},
  branch: {},
  source: {},
  city: {},
  whatsapp: {},
  contact: {},
  status: {},
  sidemenu: {},
  todo: {},
  particularadminrevnue: [],
  lead: [],
  assignlead: [],
  logs: [],
  signinuser: JSON.parse(Cookies.get("signinuser") || "null"),
  courses: [],
  leadscount: [],
  branches: [],
  sources: [],
  cities: [],
  todos: [],
  whatsapps: [],
  statuses: [],
  users: [],
  supports: [],
  admins: [],
  leads: [],
  assignleads: [],
  adminsrevenue: [],
  supertiles: [],
  sidemenus: [],
  courseanalytics: [],
  sourceanalytics: [],
  success: false,
  loading: false,
  error: false,
  // auth: JSON.parse(Cookies.get("auth") || "false"),
};
