import React from "react";
import { observer } from "mobx-react";
import { useHistory } from "react-router-dom";
import ActionBar from "../../../theme/components/ActionBar";
import NewRequestGoodsNote from "../../components/NewRequestGoodsNote";
import "antd/dist/antd.css";
import CartPage from "../../components/Pos/CartPage";
import { CartStoreContext } from "../../../../themes/pos/stores/cart.store";
import AdminWrapper from "../../../admin-account/components/AdminWrapper";

const CreateRequestGoodsNotePage = () => {
  const history = useHistory();
  const cartStore = React.useContext(CartStoreContext);

  return (
    <>
      <AdminWrapper pageTitle={"Warehouse"}>
        <CartPage productsInCart={cartStore.productsInCart} totalNum={cartStore.totalNum} totalAmount={cartStore.totalAmount} isCheckout={cartStore.isCheckout} />
      </AdminWrapper>
    </>
  );
};

export default observer(CreateRequestGoodsNotePage);
