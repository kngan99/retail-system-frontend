import React from "react";
import { inject, observer } from "mobx-react";
import { makeAutoObservable, autorun, observable, values } from "mobx";
import { Input, Tooltip, Button, message, Row, Col } from "antd";
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
import cartStore, {
  CartStoreContext,
} from "../../../../themes/pos/stores/cart.store";
import { Link, useParams } from "react-router-dom";
import { AuthenticationStoreContext } from "../../../authenticate/authentication.store";
import { Breadcrumb, Container, Dropdown, Table } from "react-bootstrap";
import "antd/dist/antd.css";
import { retrieveFromStorage } from "../../../../common/utils/storage.util";

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

interface CartProduct {
  Id: number;
  ProductName: string;
  CategoryId: number;
  QuantityPerUnit: string;
  UnitPrice: number;
  UnitsInStock: number;
  ReorderLevel: number;
  Discontinued: boolean;
  Quantity: number;
  Discount: number;
  Total: number;
  RawTotal: number;
}

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
        toast("Cart is empty");
      } else {
        await cartStore.setCargoRequest(
          warehouseId,
          parseInt(retrieveFromStorage('storeId')!),
          "Edit",
          status === undefined ? null : status,
          notes === undefined ? null : notes
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
        message.warning("Please choose Warehouse!");
        return;
      } else {
        cartStore.setCargoRequest(
          warehouseId,
          parseInt(retrieveFromStorage('storeId')!),
          "Edit"
        );
        const result = await cartStore.updateCargoRequest(orderID);
        toast("Update Cargo Request successfully!");
        return result;
      }
    };

    //Row CartItemEdit
    const handleRemoveClick = async (e) => {
      await cartStore.removeFromCart(e);
    };
    const handleIncreaseClick = async (e) => {
      await cartStore.addToCart(e);
    };
    const handleDecreaseClick = async (e) => {
      await cartStore.decreaseToCart(e);
    };
    const onChange = async (item, e) => {
      if (!Number.isInteger(Number(e.target.value))) {
        toast("Invalid number!");
      } else {
        cartStore.updateQuantity(item, e.target.value);
        console.log("Change:", e.target.value);
      }
    };
    //const [quantity, setQuantity] = React.useState<number>(-1);

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const init = async () => {
      await cartStore.getOrderById(orderID);
      await setStatus(cartStore.selectedOrder.Status);
      cartStore.setOrderStatus(cartStore.selectedOrder.Status);
      await setWarehouseId(cartStore.selectedOrder.warehouseId);
      await setNotes(cartStore.selectedOrder.Notes);
      let productsInCart: CartProduct[] = [];
      cartStore.selectedOrder.products.forEach((product) => {
        return productsInCart.push({
          Id: product.Id,
          ProductName: product.ProductName,
          CategoryId: product.CategoryId,
          QuantityPerUnit: product.QuantityPerUnit,
          UnitPrice: product.UnitPrice,
          UnitsInStock: product.UnitsInStock,
          ReorderLevel: product.ReorderLevel,
          Discontinued: product.Discontinued,
          Quantity: 0,
          Discount: 0,
          Total: 0,
          RawTotal: 0,
        });
      })
      await cartStore.setProductInCart(productsInCart);
      await cartStore.setProductsInCartQuantity();
      await cartStore.setProductsInCartTotal();
    };

    React.useEffect(() => {
      init();
    },[]);

    return (
      <div className="mr-2">
        <Breadcrumb>
          <h5>Products List</h5>
        </Breadcrumb>
        <div>
          <Container fluid className={`block-orders block-summary-order`}>
            <Row>
              <Col xs={12} md={24}>
                <Container fluid className={`block order-summary-item`}>
                  <Col
                    xs={12}
                    md={24}
                    className="block-item"
                    style={{ borderTop: "none !important" }}
                  >
                    <Row>
                      <span
                        style={{
                          margin: "auto 27px auto 7px",
                          fontSize: "16px",
                        }}
                      >
                        Status
                      </span>
                      <span
                        style={{
                          borderRadius: "12px",
                          background: "#fee589",
                          border: "1px solid #e9b91f",
                          fontSize: "16px",
                          fontWeight: 600,
                          padding: "10px 20px 10px 20px",
                          minWidth: "96px",
                        }}
                      >{cartStore.orderStatus}</span>
                      {/* <Dropdown>
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
                      </Dropdown> */}
                    </Row>
                  </Col>
                  <Col xs={12} md={24} className="block-item">
                    <Row>
                      <span
                        style={{
                          margin: "auto 27px 8px 7px",
                          fontSize: "16px",
                        }}
                      >
                        Warehouse
                      </span>
                      <Input
                        placeholder="Warehouse Id"
                        prefix={
                          <HomeOutlined className="site-form-item-icon" />
                        }
                        suffix={
                          <Tooltip title="Extra information">
                            <InfoCircleOutlined
                              style={{ color: "rgba(0,0,0,.45)" }}
                            />
                          </Tooltip>
                        }
                        value={warehouseId}
                        style={{ marginBottom: "20px" }}
                        onChange={(e) => {
                          setWarehouseId(parseInt(e.target.value));
                        }}
                      />
                    </Row>
                  </Col>
                  <Col xs={12} md={24} className="block-item">
                    <Row>
                      <span
                        style={{
                          margin: "auto 27px 8px 7px",
                          fontSize: "16px",
                        }}
                      >
                        Notes
                      </span>
                      <Input
                        placeholder="Notes"
                        prefix={
                          <UnorderedListOutlined className="site-form-item-icon" />
                        }
                        suffix={
                          <Tooltip title="Please enter some extra note here">
                            <InfoCircleOutlined
                              style={{ color: "rgba(0,0,0,.45)" }}
                            />
                          </Tooltip>
                        }
                        style={{ marginBottom: "20px" }}
                        onChange={(e) => {
                          setNotes(e.target.value);
                        }}
                      />
                    </Row>
                  </Col>
                </Container>
              </Col>
            </Row>
          </Container>
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
              {productsInCart &&
                productsInCart.map((item, idx) => {
                  console.log(item.Quantity);
                  
                  return (
                    <tr>
                      <td className="pr-0">{item.Id}</td>
                      <td>{item.ProductName}</td>
                      <td>
                        <Input
                          disabled={isCheckout}
                          style={{ width: 50 }}
                          size="small"
                          value={item.Quantity}
                          onChange={async (e) => await onChange(item, e)}
                        />
                      </td>
                      <td>{item.UnitPrice}</td>
                      <td className="text-right pr-5">{item.Total}</td>
                      {!isCheckout && (
                        <td className="p-0">
                          <Button
                            onClick={async () =>
                              await handleIncreaseClick(item)
                            }
                            type="link"
                            icon={<PlusOutlined />}
                          />
                          <Button
                            onClick={async () =>
                              await handleDecreaseClick(item)
                            }
                            type="link"
                            icon={<MinusOutlined />}
                          />
                          <Button
                            onClick={async () => await handleRemoveClick(item)}
                            type="link"
                            icon={<DeleteOutlined />}
                          />
                        </td>
                      )}
                    </tr>
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
                {console.log(productsInCart)}
                {productsInCart.map((item, idx) => {
                  return (
                    <tr key={idx}>
                      <td className="pr-0">{item.Id}</td>
                      <td>{item.ProductName}</td>
                      <td>
                        <Input
                          disabled={isCheckout}
                          style={{ width: 50 }}
                          size="small"
                          value={item.Quantity}
                          onChange={async (e) => await onChange(item, e)}
                        />
                      </td>
                      <td>{item.UnitPrice}</td>
                      <td className="text-right pr-5">{item.Total}</td>
                      {!isCheckout && (
                        <td className="p-0">
                          <Button
                            onClick={async () =>
                              await handleIncreaseClick(item)
                            }
                            type="link"
                            icon={<PlusOutlined />}
                          />
                          <Button
                            onClick={async () =>
                              await handleDecreaseClick(item)
                            }
                            type="link"
                            icon={<MinusOutlined />}
                          />
                          <Button
                            onClick={async () => await handleRemoveClick(item)}
                            type="link"
                            icon={<DeleteOutlined />}
                          />
                        </td>
                      )}
                    </tr>
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
