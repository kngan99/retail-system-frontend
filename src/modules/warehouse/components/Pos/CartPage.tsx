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
  UnorderedListOutlined
} from "@ant-design/icons";
import { CartStoreContext } from "../../../../themes/pos/stores/cart.store";
import CartItem from "./CartItem";
import { Link } from "react-router-dom";
import { AuthenticationStoreContext } from "../../../authenticate/authentication.store";
import { retrieveFromStorage } from '../../../../common/utils/storage.util';

const CartPage = observer(
  ({ productsInCart, totalNum, totalAmount, isCheckout }) => {
    const cartStore = React.useContext(CartStoreContext);
    const authStore = React.useContext(AuthenticationStoreContext);
    const [warehouseId, setWarehouseId] = React.useState<number>(-1);
    const handleEmptyClick = async () => {
      await cartStore.emptyCart();
    };
    const handleCheckoutClick = async () => {
      if (totalNum == 0) {
        message.error("Cart is empty");
      } else {
        await cartStore.setCargoRequest(
          warehouseId,
          parseInt(retrieveFromStorage('storeId')!),
          'Create'
        );
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
    const handleSendCargoRequest = async () => {
      if (warehouseId === -1) {
        message.warning('Please choose Warehouse!');
        return;
      }
      else{
      cartStore.setCargoRequest(warehouseId, parseInt(retrieveFromStorage('storeId')!), 'Create');
      const result = await cartStore.sendCargoRequest();
      if (result) message.success('Create Cargo Request successfully!');
      return result;
      }
    }
    return (
      <div className="mr-2">
        <Breadcrumb>
          <h5>Request For Products</h5>
        </Breadcrumb>
        {console.log(cartStore.productsInCart)}
        <div>
          <Row style={{ marginBottom: "15px", marginLeft: "15px" }}>
            {!cartStore.isCheckout ? (
              <>
            <PlusCircleTwoTone
              style={{ marginTop: "5px", marginRight: "5px" }}
            />
            <Link to="/warehouse/new-request-goods-note">
              I want to choose more products
            </Link>
            </>
            ) : (
              <>
              <UnorderedListOutlined style={{color: '#40a9ff', marginRight: '10px', fontSize: '22px'}}/>
              <span style={{color: '#40a9ff', fontWeight: 400}}>Request Summary</span>
              </>
            )
            }
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
              onChange={(e) => {
                setWarehouseId(parseInt(e.target.value));
              }}
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
            <br/>
            <Button
              type="primary" shape='round' icon={<ShoppingCartOutlined />} size='large'
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

