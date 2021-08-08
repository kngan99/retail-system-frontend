import React from "react";
import { observer } from "mobx-react";
import { useHistory } from "react-router-dom";
import ActionBar from "../../../theme/components/ActionBar";
import NewRequestGoodsNote from "../../components/NewRequestGoodsNote";
import "antd/dist/antd.css";
import AdminWrapper from "../../../admin-account/components/AdminWrapper";
import CartPage from "../../components/ReturnedPos/CartPage";
import { CartStoreContext } from "../../../../themes/pos/stores/cart.store";

const CreateRequestGoodsNotePage = () => {
  const history = useHistory();
  const cartStore = React.useContext(CartStoreContext);
  const [productsData, setProductsData ] = React.useState<any>();

  React.useEffect(() => {
    const init = async () => {
      let id = parseInt(window.location.pathname.split("/")[3]);
      await cartStore.setReturnedOrderById(id);
      setProductsData(cartStore.productsInCart);
    };
    init();
  }, [cartStore]);

  return (
    <>
      <AdminWrapper pageTitle={"Warehouse"}>
        {productsData &&
          <CartPage
            productsInCart={productsData}
            totalNum={cartStore.totalNum}
            totalAmount={cartStore.totalAmount}
            isCheckout={cartStore.isCheckout}
          />
        }
      </AdminWrapper>
    </>
  );
};

export default observer(CreateRequestGoodsNotePage);
