import React from "react";
import { observer } from "mobx-react";
import { toast } from "react-toastify";
import { useHistory } from "react-router-dom";
import ActionBar from "../../../theme/components/ActionBar";
import WarehouseWrapper from "../../components/WarehouseWrapper";
import NewRequestGoodsNote from "../../components/NewRequestGoodsNote";

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
