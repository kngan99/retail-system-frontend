import React from "react";
import { observer } from "mobx-react";
import { useParams, useHistory, Link } from "react-router-dom";
import { CartStoreContext } from "../../../../themes/pos/stores/cart.store";
import { message, Row } from "antd";
import ConfirmModal from "../../../../common/components/ConfirmModal";
import CartPageEdit from "../../components/PosEdit/CartPageEdit";
import { Button } from "react-bootstrap";
import { toast } from "react-toastify";
import {
  PlusOutlined,
  MinusOutlined,
  PlusCircleTwoTone,
  DeleteOutlined,
  CheckOutlined,
  ArrowLeftOutlined,
  PrinterOutlined,
  ShoppingCartOutlined,
  InfoCircleOutlined,
  HomeOutlined,
  UnorderedListOutlined
} from "@ant-design/icons";
import "antd/dist/antd.css";
import AdminWrapper from "../../../admin-account/components/AdminWrapper";
// // import { ADMIN_ORDER_ROUTERS } from '@/modules/order/router.enum';
// // import { SERVICE_TYPE, ACTIONS_MODE } from '@/modules/order/order.enum';
// import { OrderListDto } from '@/modules/order/order.dto';

const ReturnProducts = () => {
  const orderStore = React.useContext(CartStoreContext);
  const history = useHistory();
  const { orderID } = useParams() as any;
  const cartStore = React.useContext(CartStoreContext);

  /*
   * Get list by criteria
   */
  const [criteriaDto] = React.useState<any>({
    order: { Id: orderID },
  });

  /*
   * show hide new/edit driver popup
   */
  const [showConfirmPopup, setShowConfirmPopup] =
    React.useState<boolean>(false);

  /*
   * action of delete button
   *
   * @param void
   * @return void
   */
  const handleCancelRequest = () => {
    setShowConfirmPopup(true);
  };

  const handleOk = async () => {
    setShowConfirmPopup(false);
    if (orderID) {
      const result = await orderStore.cancelCargoReq(orderID);
      if (result) {
        toast("Cancel successfully");
        history.push("/warehouse/request-goods-note-cart/manage");
      }
    }
  };

  const handleCancel = () => {
    setShowConfirmPopup(false);
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const init = async () => {
  };

  React.useEffect(() => {
    orderStore.editingAdminOrder = null;
    init();
  }, []);

  return (
    <>
      <AdminWrapper pageTitle={"Return products"}>
        Return product page
      </AdminWrapper>
    </>
  );
};

export default observer(ReturnProducts);
