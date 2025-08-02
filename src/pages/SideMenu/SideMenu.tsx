import React, { useEffect, useState } from "react";
import {
  Input,
  Button,
  ListItem,
  Box,
  Stack,
  GridItem,
  Grid,
  OrderedList,
} from "@chakra-ui/react";
import axios from "axios";
import UpdateSideMenu from "./Update";
import Cookies from "js-cookie";
import DeleteMenu from "./DeleteMenu";
import { BASE_URL_SUPERADMIN } from "../../config/RequestMethod";

export const createMenuItem = (menuItem: any) => {
  console.log(menuItem);
  return axios.post(
    `${BASE_URL_SUPERADMIN}sideMenu`,
    { myMenu: menuItem },
    {
      headers: {
        Authorization: `Bearer ${token}`, // Pass the token in the headers
      },
    }
  );
};

export const getMenuItems = () => {
  return axios.get(`${BASE_URL_SUPERADMIN}sideMenu`, {
    headers: {
      Authorization: `Bearer ${token}`, // Pass the token in the headers
    },
  });
};

const token = Cookies.get("token");

const SideMenu: React.FC = () => {
  const [newPermission, setNewPermission] = useState("");
  const [menuItems, setMenuItems] = useState<string[]>([]);

  console.log(menuItems, newPermission);

  const fetchData = async () => {
    try {
      const response = await getMenuItems();
      setMenuItems(response.data?.Data?.menu);
    } catch (error) {
      console.error("Error fetching menu items:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAddPermission = () => {
    if (newPermission.trim() !== "") {
      createMenuItem(newPermission)
        .then(() => {
          setNewPermission("");
          fetchData(); // Fetch the updated data after the promise resolves
        })
        .catch((error) => {
          console.error("Error creating menu item:", error);
        });
    }
  };

  return (
    <Stack h="100%" mt={1}>
      <Grid templateColumns="repeat(2, 1fr)" p={12} gap={8}>
        <GridItem w="100%" border={2}>
          <Box>
            <Input
              type="text"
              placeholder="Enter permission"
              value={newPermission}
              onChange={(e) => setNewPermission(e.target.value)}
            />
            <Button onClick={handleAddPermission} mt={2} colorScheme="blue">
              Add
            </Button>
          </Box>
        </GridItem>
        <GridItem>
          <OrderedList>
            {menuItems?.map((permission, index) => (
              <ListItem
                key={index}
                my={4}
                sx={{ display: "flex", justifyContent: "space-between" }}
              >
                {`${index + 1}.) `} {permission}
                <Box sx={{ display: "flex", justifyContent: "center" }}>
                  <UpdateSideMenu
                    menuItem={permission} // Pass the current menu item
                    fetchData={fetchData}
                  />
                  <DeleteMenu
                    menuItem={permission} // Pass the current menu item
                    fetchData={fetchData}
                  />
                </Box>
              </ListItem>
            ))}
          </OrderedList>
        </GridItem>
      </Grid>
    </Stack>
  );
};

export default SideMenu;
