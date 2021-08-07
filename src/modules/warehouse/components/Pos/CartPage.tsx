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

    const [radioValue, setRadioValue] = React.useState("1");

    const radios = [
      { name: "To Warehouse", value: "1" },
      { name: "To Store", value: "2" },
    ];

    const handleEmptyClick = async () => {
      await cartStore.emptyCart();
    };
    const handleCheckoutClick = async () => {
      if (totalNum === 0) {
        toast("Cart is empty");
        return;
      }
      if (warehouseId === -1 && toStoreId === -1) {
        toast("Please choose warehouse or store");
        return;
      }
      if (toStoreId === parseInt(retrieveFromStorage("storeId")!)) {
        toast("Can not choose your store");
        return;
      }
      if (warehouseId > 0) {
        await cartStore.setCargoRequestToStore(
          warehouseId,
          parseInt(retrieveFromStorage("storeId")!),
          "Create"
        );
      } else if (toStoreId > 0) {
        await cartStore.setCargoRequestToStore(
          toStoreId,
          parseInt(retrieveFromStorage("storeId")!),
          "Create"
        );
      } else {
        toast("Error. Please try again later");
      }
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
      if (warehouseId === -1 && toStoreId === -1) {
        message.warning("Please choose Warehouse or Store");
        return;
      } else {
        if (warehouseId > 0) {
          cartStore.setCargoRequest(
            warehouseId,
            parseInt(retrieveFromStorage("storeId")!),
            "Create"
          );
        } else if (toStoreId > 0) {
          cartStore.setCargoRequestToStore(
            toStoreId,
            parseInt(retrieveFromStorage("storeId")!),
            "Create"
          );
        }
        else {
          toast("Error. Please try again later");
          return
        }
        const result = await cartStore.sendCargoRequest();
        if (result) {
          toast("Create Cargo Request successfully!");
        } else {
          toast("Create Cargo Request fail! Please try again later");
        }
        window.location.href = window.location.pathname.replace(
          "new-request-goods-note-cart",
          "request-goods-note-cart/manage"
        );
        return result;
      }
    };

    React.useEffect(() => {
      const getAllWarehouse = async () => {
        const res = await warehouseStore.getWarehousesAllDb();
        return res;
      };

      const getAllStore = async () => {
        const res = await storeStore.getStoresAllDb();
        return res;
      };

      getAllWarehouse();
      getAllStore();
      setWarehouseId(-1);
      setToStoreId(-1);
    }, [storeStore, warehouseStore]);

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
              </>
            )}
          </Row>
          <Row>
            <ButtonGroup>
              {radios.map((radio, idx) => (
                <ToggleButton
                  key={idx}
                  id={`radio-${idx}`}
                  type="radio"
                  variant={"outline-secondary"}
                  name="radio"
                  value={radio.value}
                  checked={radioValue === radio.value}
                  onChange={(e) => setRadioValue(e.currentTarget.value)}
                  style={{ color: "black" }}
                >
                  {radio.name}
                </ToggleButton>
              ))}
            </ButtonGroup>
          </Row>
          <Row>
            <p>To warehouse</p>
            {radioValue === "1" ? (
              <Select
                showSearch
                style={{ width: "100%", marginBottom: "20px" }}
                placeholder="Select a warehouse"
                optionFilterProp="value"
                onChange={(value) => {
                  //console.log(value);
                  setWarehouseId(parseInt(value.split(" - ")[0]));
                }}
                defaultValue={`Select warehouse`}
                filterOption={(input, option) =>
                  option?.value.indexOf(input.toLowerCase()) >= 0
                }
              >
                {warehouseStore.warehouseAllDb.map((warehouse) => (
                  <Option
                    key={warehouse.Id}
                    value={`${warehouse.Id} - ${warehouse.ShortName}`}
                  >
                    <p>
                      {warehouse.Id} - {warehouse.ShortName}
                      <br />
                      {warehouse.Address}
                    </p>
                  </Option>
                ))}
              </Select>
            ) : (
              <Select
                showSearch
                style={{ width: "100%", marginBottom: "20px" }}
                placeholder="Select a warehouse"
                optionFilterProp="value"
                onChange={(value) => {
                  //console.log(value);
                  setWarehouseId(parseInt(value.split(" - ")[0]));
                }}
                defaultValue={`Select warehouse`}
                filterOption={(input, option) =>
                  option?.value.indexOf(input.toLowerCase()) >= 0
                }
                disabled
              >
                {warehouseStore.warehouseAllDb.map((warehouse) => (
                  <Option
                    key={warehouse.Id}
                    value={`${warehouse.Id} - ${warehouse.ShortName}`}
                  >
                    <p>
                      {warehouse.Id} - {warehouse.ShortName}
                      <br />
                      {warehouse.Address}
                    </p>
                  </Option>
                ))}
              </Select>
            )}
          </Row>
          <Row>
            <p>To store</p>
            {radioValue === "2" ? (
              <Select
                showSearch
                style={{ width: "100%", marginBottom: "20px" }}
                placeholder="Select a store"
                optionFilterProp="value"
                onChange={(value) => {
                  //console.log(value);
                  setToStoreId(parseInt(value.split(" - ")[0]));
                }}
                defaultValue={`Select store`}
                filterOption={(input, option) =>
                  option?.value.indexOf(input.toLowerCase()) >= 0
                }
              >
                {storeStore.storeAllDb.map((store) => (
                  <Option
                    key={store.Id}
                    value={`${store.Id} - ${store.ShortName}`}
                  >
                    <p>
                      {store.Id} - {store.ShortName}
                      <br />
                      {store.Address}
                    </p>
                  </Option>
                ))}
              </Select>
            ) : (
              <Select
                showSearch
                style={{ width: "100%", marginBottom: "20px" }}
                placeholder="Select a store"
                optionFilterProp="value"
                onChange={(value) => {
                  //console.log(value);
                  setToStoreId(parseInt(value.split(" - ")[0]));
                }}
                defaultValue={`Select store`}
                filterOption={(input, option) =>
                  option?.value.indexOf(input.toLowerCase()) >= 0
                }
                disabled
              >
                {storeStore.storeAllDb.map((store) => (
                  <Option
                    key={store.Id}
                    value={`${store.Id} - ${store.ShortName}`}
                  >
                    <p>
                      {store.Id} - {store.ShortName}
                      <br />
                      {store.Address}
                    </p>
                  </Option>
                ))}
              </Select>
            )}
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
