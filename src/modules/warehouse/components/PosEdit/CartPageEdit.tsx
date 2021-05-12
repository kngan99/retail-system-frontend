import React from "react";
import { inject, observer } from "mobx-react";
import { makeAutoObservable, autorun, observable, values } from "mobx";
import { Input, Tooltip, Button, message, Row, Col} from "antd";
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
import { Link, useParams } from "react-router-dom";
import { AuthenticationStoreContext } from "../../../authenticate/authentication.store";
import CartItemEdit from "./CartItemEdit";
import { Breadcrumb, Dropdown, Table } from "react-bootstrap";
import "antd/dist/antd.css";

const OrderStatus = [
  {
    key: "Created",
    label: "Created",
  },
  {
    key: "Verified",
    label: "Verified",
  },
  {
    key: "Assigned",
    label: "Assigned",
  },
  {
    key: "Accepted",
    label: "Accepted",
  },
  {
    key: "Preparing",
    label: "Preparing",
  },
  {
    key: "Delivering",
    label: "Delivering",
  },
  {
    key: "Success",
    label: "Success",
  },
  {
    key: "Canceled",
    label: "Canceled",
  },
];



const CartPageEdit = observer(
  ({ productsInCart, totalNum, totalAmount, isCheckout }) => {
    const cartStore = React.useContext(CartStoreContext);
    const authStore = React.useContext(AuthenticationStoreContext);
    const [warehouseId, setWarehouseId] = React.useState<number>(-1);
    const [status, setStatus] = React.useState<string | null>(null);
    const [notes, setNotes] = React.useState<string | null>(null);
    const { orderID } = useParams() as any;
    const handleEmptyClick = async () => {
      await cartStore.emptyCart();
    };
    const handleCheckoutClick = async () => {
      if (totalNum == 0) {
        message.error("Cart is empty");
      } else {
        await cartStore.setCargoRequest(
          warehouseId,
          authStore.loggedUser.StoreId,
          'Edit',
          status === undefined ? null : status,
          notes === undefined ? null : notes,
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
      cartStore.setCargoRequest(warehouseId, authStore.loggedUser.StoreId, 'Edit');
      const result = await cartStore.updateCargoRequest(orderID);
      message.success('Update Cargo Request successfully!');
      return result;
      }
    }
    return (
      <div className="mr-2">
        <Breadcrumb>
          <h5>Products List</h5>
        </Breadcrumb>
        {console.log(cartStore.productsInCart)}
        <div>
          <Row className='block-item'>
            <span style={{margin: 'auto 27px auto 7px', fontSize: '16px'}}>Status</span>
            <Dropdown>
              <Dropdown.Toggle className="col-select-actions">
                {status}
              </Dropdown.Toggle>
              <Dropdown.Menu className="col-select-contents">
                {OrderStatus.map((status: any, index: number) => (
                  <Dropdown.Item
                    className={status.key ? status.key : ""}
                    onSelect={() => {
                      setStatus(status.label);
                    }}
                    key={`order-action-${index}`}
                  >
                    {status.label}
                  </Dropdown.Item>
                ))}
              </Dropdown.Menu>
            </Dropdown>
          </Row>
          <Row>
            <Input
              placeholder="Warehouse Id"
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
          <Row>
            <Input
              placeholder="Notes"
              prefix={<HomeOutlined className="site-form-item-icon" />}
              suffix={
                <Tooltip title="Extra information">
                  <InfoCircleOutlined style={{ color: "rgba(0,0,0,.45)" }} />
                </Tooltip>
              }
              style={{ marginBottom: "20px" }}
              onChange={(e) => {
                setNotes(e.target.value);
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
                  <CartItemEdit item={item} key={idx} isCheckout={isCheckout} />
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
                    <CartItemEdit
                      item={item}
                      key={idx}
                      isCheckout={isCheckout}
                    />
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
            <br />
            <Button
              type="primary"
              shape="round"
              icon={<ShoppingCartOutlined />}
              size="large"
              onClick={async () => await handleSendCargoRequest()}
            >
              Update Request
            </Button>
          </>
        )}
      </div>
    );
  }
);
export default CartPageEdit;

