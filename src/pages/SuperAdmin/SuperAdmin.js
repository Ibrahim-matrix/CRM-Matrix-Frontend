import axios from "axios";
import { BASE_URL_SUPERADMIN } from "../../config/RequestMethod";
import Cookies from "js-cookie";

const token = Cookies.get("token");

export const createMenuItem = (menuItem, endpoint) => {
  console.log(menuItem);
  return axios.post(
    `${BASE_URL_SUPERADMIN}${endpoint}`,
    { myMenu: menuItem },
    {
      headers: {
        Authorization: `Bearer ${token}`, // Pass the token in the headers
      },
    }
  );
};

export const getMenuItems = (endpoint) => {
  return axios.get(`${BASE_URL_SUPERADMIN}${endpoint}`, {
    headers: {
      Authorization: `Bearer ${token}`, // Pass the token in the headers
    },
  });
};
