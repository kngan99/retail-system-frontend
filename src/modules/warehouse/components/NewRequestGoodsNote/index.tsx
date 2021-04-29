import React from "react";
import { observer } from "mobx-react";
import { toast } from "react-toastify";
import { useHistory } from "react-router-dom";
import ActionBar from "../../../theme/components/ActionBar";
import WarehouseWrapper from "../../components/WarehouseWrapper";

const NewRequestGoodsNote = () => {
  const history = useHistory();

  return (
    <>
     <div>New Request good note</div>
    </>
  );
};

export default observer(NewRequestGoodsNote);
