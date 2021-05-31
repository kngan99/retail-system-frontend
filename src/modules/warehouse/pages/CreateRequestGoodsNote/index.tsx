import React from "react";
import { observer } from "mobx-react";
import { useHistory } from "react-router-dom";
import ActionBar from "../../../theme/components/ActionBar";
import NewRequestGoodsNote from "../../components/NewRequestGoodsNote";
import "antd/dist/antd.css";
import AdminWrapper from "../../../admin-account/components/AdminWrapper";

const CreateRequestGoodsNotePage = () => {
  const history = useHistory();

  return (
    <>
      <AdminWrapper pageTitle={"Warehouse"}>
        <NewRequestGoodsNote/>
      </AdminWrapper>
    </>
  );
};

export default observer(CreateRequestGoodsNotePage);
