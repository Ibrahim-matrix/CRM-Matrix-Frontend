// AdminSelect.js
import React, { useEffect, useMemo } from "react";
import { Select } from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";
import { getDataSuperAdmin } from "../redux/actions/common.action";

interface AdminSelectProps {
  setSelectedAdmin: (adminId: string) => void;
  selectedAdmin: string;
  endpoint: string;
}

interface adminLists {
  admins: {
    Name: string;
    _id: string;
    active: boolean;
  }[];
  loading: boolean;
}

const AdminSelect: React.FC<AdminSelectProps> = ({
  setSelectedAdmin,
  selectedAdmin,
  endpoint,
}) => {
  const dispatch: any = useDispatch();
  const { admins } = useSelector(
    (state: { common: adminLists }) => state.common
  );

  const memoizedAdmins = useMemo(() => admins, [admins]);
  const endpointAdmin = "";

  useEffect(() => {
    if (memoizedAdmins?.length === 0) {
      dispatch(getDataSuperAdmin(endpointAdmin));
    }
  }, [dispatch, endpointAdmin, memoizedAdmins?.length]);

  const adminOptions = admins?.map((admin: any) => (
    <option key={admin._id} value={admin._id}>
      {admin.Name}
    </option>
  ));

  return (
    <Select
      placeholder="Select Admin"
      width={"14rem"}
      onChange={(e) => {
        const newAdminId = e.target.value;
        setSelectedAdmin(newAdminId);

        // Call the getDataSuperAdmin function here to fetch status data for the selected admin
        if (newAdminId) {
          dispatch(getDataSuperAdmin(`${endpoint}?parentId=${newAdminId}`));
        }
      }}
      value={selectedAdmin || ""}
    >
      {adminOptions}
    </Select>
  );
};

export default AdminSelect;
