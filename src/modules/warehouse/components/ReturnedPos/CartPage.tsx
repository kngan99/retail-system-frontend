import React from "react";
import { inject, observer } from "mobx-react";
import { makeAutoObservable, autorun, observable } from "mobx";
import { Table, Breadcrumb, ButtonGroup, ToggleButton } from "react-bootstrap";
import { Input, Tooltip, Button, message, Row, Col, Select } from "antd";
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
  UnorderedListOutlined,
} from "@ant-design/icons";
import { CartStoreContext } from "../../../../themes/pos/stores/cart.store";
import CartItem from "./CartItem";
import { Link } from "react-router-dom";
import { AuthenticationStoreContext } from "../../../authenticate/authentication.store";
import { retrieveFromStorage } from "../../../../common/utils/storage.util";
import { WarehouseStoreContext } from "../../../admin-warehouse/admin.store";
import { StoreStoreContext } from "../../../admin-store/admin.store";

const CartPage = observer(
  ({ productsInCart, totalNum, totalAmount, isCheckout }) => {
    const cartStore = React.useContext(CartStoreContext);
    const authStore = React.useContext(AuthenticationStoreContext);
    const warehouseStore = React.useContext(WarehouseStoreContext);
    const storeStore = React.useContext(StoreStoreContext);
    const [warehouseId, setWarehouseId] = React.useState<number>(-1);
    const [toStoreId, setToStoreId] = React.useState<number>(-1);
    const { Option } = Select;

    const handleEmptyClick = async () => {
      await cartStore.emptyCart();
    };

    const handleCheckoutClick = async () => {
      if (totalNum === 0) {
        toast("Cart is empty");
        return;
      }

      await cartStore.setCargoRequestToStore(
        toStoreId,
        parseInt(retrieveFromStorage("storeId")!),
        "Create"
      );

      await cartStore.checkoutCart();
    };

    const handleModifyClick = async () => {
      await cartStore.returnToCart();
    };

    const handleNewOrderClick = async () => {
      await cartStore.newOrder();
    };
    const handleConfirmPrintClick = async () => {
      // var content = document.getElementById("divcontents");
      // var pri = document.getElementById("ifmcontentstoprint").contentWindow;
      // pri.document.open();
      // pri.document.write(content.innerHTML);
      // pri.document.close();
      // pri.focus();
      // pri.print();
      window.print();
    };
    const handleSendCargoRequest = async () => {
      cartStore.setReturnCargoRequest(
        parseInt(window.location.pathname.split("/")[3])
      );
      const result = await cartStore.sendReturnedCargoRequest();
      if (result) {
        toast("Create Cargo Request successfully!");
      } else {
        toast("Create Cargo Request fail! Please try again later");
      }
      window.location.href = window.location.pathname.replace(
        `new-return-goods-note`,
        "return-goods"
      );
      return result;
    };

    React.useEffect(() => {}, []);

    return (
      <div className="mr-2">
        <Breadcrumb>
          <h5>Request For Return Products</h5>
        </Breadcrumb>
        <div>
          <Row style={{ marginBottom: "15px", marginLeft: "15px" }}>
            <UnorderedListOutlined
              style={{
                color: "#40a9ff",
                marginRight: "10px",
                fontSize: "22px",
              }}
            />
            <span style={{ color: "#40a9ff", fontWeight: 400 }}>
              Request Summary
            </span>
          </Row>
        </div>
        {!isCheckout && (
          <Table striped bordered hover size="sm">
            <thead>
              <tr>
                <th className="pr-0">#</th>
                <th>Name</th>
                <th>Quantity Ordered</th>
                <th>Returned</th>
                <th>Quantity</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {productsInCart.map((item, idx) => {
                return (
                  <CartItem item={item} key={idx} isCheckout={isCheckout} />
                );
              })}
              <tr>
                <td></td>
                <td className="pr-0"></td>
                <td></td>
                <td></td>
                <td></td>
                <td className="p-0">
                  <Button
                    onClick={async () => await handleEmptyClick()}
                    type="link"
                    icon={<DeleteOutlined />}
                  >
                    Empty cart
                  </Button>
                </td>
              </tr>
              <tr>
                <td></td>
                <td className="pr-0"></td>
                <td></td>
                <td></td>
                <td></td>
                <td className="p-0">
                  <Button
                    onClick={async () => await handleCheckoutClick()}
                    type="link"
                    icon={<CheckOutlined />}
                  >
                    Submit
                  </Button>
                </td>
              </tr>
            </tbody>
          </Table>
        )}
        {isCheckout && (
          <>
            <Table striped bordered hover size="sm">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Name</th>
                  <th>Quantity Ordered</th>
                  <th>Returned</th>
                  <th>Quantity</th>
                </tr>
              </thead>
              <tbody>
                {productsInCart.map((item, idx) => {
                  return (
                    item.Quantity > 0 && <CartItem item={item} key={idx} isCheckout={isCheckout} />
                  );
                })}
                <tr>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td className="p-0">
                    {cartStore.isConfirm && (
                      <Button
                        onClick={async () => await handleConfirmPrintClick()}
                        type="link"
                        icon={<PrinterOutlined />}
                      >
                        Print receipt
                      </Button>
                    )}
                  </td>
                </tr>
                <tr>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td className="p-0">
                    {!cartStore.isConfirm && (
                      <Button
                        onClick={async () => await handleModifyClick()}
                        type="link"
                        icon={<ArrowLeftOutlined />}
                      >
                        Modify
                      </Button>
                    )}
                    {cartStore.isConfirm && (
                      <Button
                        loading={cartStore.loading}
                        onClick={async () => await handleNewOrderClick()}
                        type="link"
                        icon={<ShoppingCartOutlined />}
                      >
                        New request
                      </Button>
                    )}
                  </td>
                </tr>
              </tbody>
            </Table>
            <br />
            <Button
              type="primary"
              shape="round"
              icon={<ShoppingCartOutlined />}
              size="large"
              onClick={async () => await handleSendCargoRequest()}
            >
              Send Request
            </Button>
          </>
        )}
      </div>
    );
  }
);
export default CartPage;
