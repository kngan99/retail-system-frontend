import React from "react";
import { observer } from "mobx-react";
import { toast } from "react-toastify";
import { useHistory } from "react-router-dom";
import ActionBar from "../../../theme/components/ActionBar";
import WarehouseWrapper from "../../components/WarehouseWrapper";
import NewRequestGoodsNote from "../../components/NewRequestGoodsNote";
import "antd/dist/antd.css";
import CartPage from "../../components/Pos/CartPage";
import { CartStoreContext } from "../../../../themes/pos/stores/cart.store";

const CreateRequestGoodsNotePage = () => {
  const history = useHistory();
  const cartStore = React.useContext(CartStoreContext);

  return (
    <>
      <WarehouseWrapper pageTitle={"Warehouse"}>
        <CartPage productsInCart={cartStore.productsInCart} totalNum={cartStore.totalNum} totalAmount={cartStore.totalAmount} isCheckout={cartStore.isCheckout} />
      </WarehouseWrapper>
    </>
  );
};

export default observer(CreateRequestGoodsNotePage);
