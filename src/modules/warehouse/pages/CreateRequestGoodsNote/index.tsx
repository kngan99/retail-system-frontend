import React from "react";
import { observer } from "mobx-react";
import { useHistory } from "react-router-dom";
import ActionBar from "../../../theme/components/ActionBar";
import WarehouseWrapper from "../../components/WarehouseWrapper";
import NewRequestGoodsNote from "../../components/NewRequestGoodsNote";
import "antd/dist/antd.css";

const CreateRequestGoodsNotePage = () => {
  const history = useHistory();

  return (
    <>
      <WarehouseWrapper pageTitle={"Warehouse"}>
        <NewRequestGoodsNote/>
      </WarehouseWrapper>
    </>
  );
};

export default observer(CreateRequestGoodsNotePage);
