import React from "react";
import { inject, observer } from "mobx-react";
import { makeAutoObservable, autorun, observable } from "mobx";
import { Table, Breadcrumb } from "react-bootstrap";
import { Input, Tooltip, Button, message, Row, Col } from "antd";
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
} from "@ant-design/icons";
import { CartStoreContext } from "../../../../themes/pos/stores/cart.store";
import CartItem from "./CartItem";
import { Link } from "react-router-dom";

const CartPage = observer(
  ({ productsInCart, totalNum, totalAmount, isCheckout }) => {
        const cartStore = React.useContext(CartStoreContext);
        { console.log(cartStore.productsInCart)}
    const handleEmptyClick = async () => {
      await cartStore.emptyCart();
    };
    const handleCheckoutClick = async () => {
      if (totalNum == 0) {
        message.error("Cart is empty");
      } else {
        await cartStore.checkoutCart();
      }
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
    return (
      <div className="mr-2">
        <Breadcrumb>
          <h5>Request For Products</h5>
            </Breadcrumb>
            {console.log(cartStore.productsInCart)}
        <div>
          <Row style={{ marginBottom: "15px", marginLeft: "15px" }}>
            <PlusCircleTwoTone
              style={{ marginTop: "5px", marginRight: "5px" }}
            />
            <Link to="/warehouse/new-request-goods-note">
              I want to choose more products
            </Link>
          </Row>
          <Row>
            <Input
              placeholder="Enter Warehouse Id"
              prefix={<HomeOutlined className="site-form-item-icon" />}
              suffix={
                <Tooltip title="Extra information">
                  <InfoCircleOutlined style={{ color: "rgba(0,0,0,.45)" }} />
                </Tooltip>
              }
              style={{ marginBottom: "20px" }}
            />
          </Row>
        </div>
        {!isCheckout && (
          <Table striped bordered hover size="sm">
            <thead>
              <tr>
                <th className="pr-0">#</th>
                <th>Name</th>
                <th>Quantity</th>
                <th>Price</th>
                <th className="text-right pr-5">Total</th>
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
                <td className="pr-0">Num</td>
                <td>{totalNum}</td>
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
                <td className="pr-0">Total</td>
                <td>{totalAmount}</td>
                <td></td>
                <td></td>
                <td className="p-0">
                  <Button
                    onClick={async () => await handleCheckoutClick()}
                    type="link"
                    icon={<CheckOutlined />}
                  >
                    Submit request
                  </Button>
                </td>
              </tr>
            </tbody>
          </Table>
        )}
        {isCheckout && (
          <Table striped bordered hover size="sm">
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Quantity</th>
                <th>Price</th>
                <th className="text-right pr-5">Total</th>
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
                <td>Num</td>
                <td>{totalNum}</td>
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
                <td>Total</td>
                <td>{totalAmount}</td>
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
        )}
      </div>
    );
  }
);
export default CartPage;
