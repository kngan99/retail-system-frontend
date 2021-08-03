import { observer } from "mobx-react";
import React, { useState } from "react";
import App from "./App";
import { ProductStoreContext } from "../../../../modules/product/product.store";
import { CartStoreContext } from "../../stores/cart.store";
import { Modal, Button, Pagination, Table, Tag, Radio, Space, Tabs, Card, Skeleton, Avatar, List, Spin, Divider, Form, Input, Select, message, Alert, Row, Col} from 'antd';
import { ExclamationCircleOutlined, AudioOutlined, EditOutlined, EllipsisOutlined, SettingOutlined, DeleteOutlined, ShoppingCartOutlined } from "@ant-design/icons";
import { ColumnsType } from "antd/es/table";
import UpdateProductModal from "../../../../modules/product/components/ManageProduct/UpdateProductModal";
import CreateProductModal from "../../../../modules/product/components/ManageProduct/CreateProductModal";
import { makeAutoObservable, autorun, observable, toJS } from "mobx"
import Cart from "../../components/Cart";
import { Jumbotron, Container, Breadcrumb, Navbar, Nav,  } from 'react-bootstrap';
import '../../../../modules/product/components/ManageProduct/style.css';
import Clock from 'react-live-clock';
import { CommonStoreContext } from '../../../../common/common.store';
import CreateCustomerModal from "../../components/CreateCustomerModal";
import { Table as BootstrapTable } from 'react-bootstrap';
import BarCodePos from '../../components/BarcodePos';
import Dinero from "dinero.js";

import StripeCheckout from "react-stripe-checkout";
interface Product {
  Id: number;
  ProductName: string;
  CategoryId: number;
  QuantityPerUnit: string;
  UnitPrice: number;
  UnitsInStock: number;
  ReorderLevel: number;
  Discontinued: boolean;
  PhotoURL: string;
}

const { confirm } = Modal;

const { Option } = Select;

const PosPage = () => {
  const [product, setProduct] = useState({
    name: "React from FB",
    price: 10,
    productBy: "facebook"
  });
  const commonStore = React.useContext(CommonStoreContext);
  const productStore = React.useContext(ProductStoreContext);
  const cartStore = React.useContext(CartStoreContext);
  const [total, setTotal] = React.useState<number>();
  const [returnCash, setReturnCash] = React.useState<number>(0);
  const [totalpay, setTotalpay] = React.useState<number>(0);
  React.useEffect(() => {
  }, [returnCash, cartStore.loading]);
  React.useEffect(() => {
    productStore.startSearch();
  }, []);
  const showTotal = (total: number) => {
    return `Total ${total} items`;
  }

  const onChange = async (pageNumber: number, pageSize: any) => {
    console.log("Page: ", pageNumber);
    console.log("PageSize: ", pageSize);
    console.log("PreviousPageSize: ", productStore.pageSize);
    if (pageNumber == 0 || pageSize != productStore.pageSize) pageNumber = 1;
    console.log("Page: ", pageNumber);
    await productStore.changePage(pageNumber, pageSize);
  }

  const search = async (key: string) => {
    await productStore.changeSearchKey(key);
  }

  const showPromiseConfirm = async (row: any) => {
    confirm({
      title: "Do you want to delete product " + row.ProductName,
      icon: <ExclamationCircleOutlined />,
      content: "Warning: The delete product cannot be recover",
      async onOk() {
        await productStore.deleteProduct(row.Id);
      },
      onCancel() { },
    });
  }

  const handleClick = (e: any) => {
    cartStore.addToCart(e);
  }

  const columns: ColumnsType<Product> = [
    {
      title: "Id",
      dataIndex: "Id",
      sorter: false,
    },
    {
      title: "ProductName",
      dataIndex: "ProductName",
      sorter: false,
    },
    {
      title: "QuantityPerUnit",
      dataIndex: "QuantityPerUnit",
      sorter: false,
    },
    {
      title: "UnitPrice",
      dataIndex: "UnitPrice",
      sorter: false,
    },
    {
      title: "Discontinued",
      dataIndex: "Discontinued",
      key: "Discontinued",
      render: (val) =>
        (!val) ? <Tag color="green">In stock</Tag> : <Tag color="red">Out of stock</Tag>,
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <Button
            style={{}}
            icon={<ShoppingCartOutlined />}
            className=""
            type="primary"
            onClick={() => handleClick(record)}
          >
            Add
          </Button>
        </Space>
      ),
    },
  ];

  const callback = (key: any) => {
    console.log(key);
  }



  const { TabPane } = Tabs;
  const { Meta } = Card;
  const gridStyle = {
    width: '50%',
    border: "none",
  };
  const onChangePay = async (e: any, total: number) => {
    setReturnCash(Number(e.target.value) - total);
    console.log('Change:', e.target.value);
  };
  const onPressEnterAdd = async (e: any) => {
    if (!Number.isInteger(Number(e.target.value))) {
      message.error("Invalid ID!");
    }
    else {
      cartStore.addToCartById(Number(e.target.value));
    }
  };

  const onPressEnterCoupon = async (e: any) => {
    if (!Number.isInteger(Number(e.target.value))) {
      message.error("Invalid ID!");
    }
    else {
      cartStore.getPromotion(Number(e.target.value));
    }
  };

  const handleConfirmOrderClick = async () => {
    await cartStore.confirmOrder();
  }

  const { Search } = Input;

  const onSearch = (val: string) => {
      cartStore.getCustomers(val);
  }



  const onCustomerChange = (value: number) => {
    cartStore.changeCustomer(value);
  }

  const makePayment = token => {
    const body = {
      token,
      product
    };
    const headers = {
      "Content-Type": "application/json"
    };

    return fetch(`http://warehouse-retail.herokuapp.com/api/orders/payment`, {
      method: "POST",
      headers,
      body: JSON.stringify(body)
    })
      .then(response => {
        console.log("RESPONSE ", response);
        const { status } = response;
        console.log("STATUS ", status);
      })
      .catch(error => console.log(error));
  };

  const onFinish = async (values: any) => {
    console.log('Received values of form: ', values);
    await cartStore.confirmVnpayOrder(values.orderId);
  };

  return (
    <>
      {cartStore.session && <div style={{
        background: "white", width: "97%",
        margin: "auto", padding: "10px",
      }}>
        <Row>
          <Col className="printable" xs={{ span: 22, offset: 1 }} sm={{ span: 22, offset: 1 }} xl={{ span: 22, offset: 1 }} xxl={{ span: 10, offset: 0 }}><Cart productsInCart={cartStore.productsInCart} totalNum={cartStore.totalNum} totalAmount={cartStore.subtotalAmount} isCheckout={cartStore.isCheckout}/>
            {/* {cartStore.discount !== 0 && <Alert message={"Order Discount: -" + cartStore.discount} type="error" />}
            {(cartStore.isCheckout) && <Alert message={"Tax(10%): " + (cartStore.totalAmount * 0.1).toFixed(2)} type="warning" />}
            {(cartStore.isCheckout) && <Alert message={"Total: " + (cartStore.totalAmount * 1.1).toFixed(2)} type="success" />} */}
            <br/>
            {(cartStore.isCheckout) && <Alert message="Order's summary: " type="info" />}
            {(cartStore.isCheckout) &&
              <BootstrapTable striped bordered hover>
              <thead>
                {cartStore.discount !== 0 && <tr>
                  <th>Order Discount</th>
                  <th>{"-" + cartStore.discount}</th>
                </tr>}
              </thead>
              <tbody>
                <tr>
                  <td>
                    Tax(10%)
                  </td>
                  <td>
                    {(cartStore.totalAmount * 0.1).toFixed(2)}
                  </td>
                </tr>
               <tr>
                  <td>
                    Total
                  </td>
                  <td>
                    {(cartStore.totalAmount * 1.1).toFixed(2)}
                  </td>
                </tr>
              </tbody>
            </BootstrapTable>}
          </Col>
          {(!cartStore.isCheckout) && <Col xs={{ span: 22, offset: 1 }} sm={{ span: 22, offset: 1 }} xl={{ span: 22, offset: 1 }} xxl={{ span: 11, offset: 2 }}>
            <Breadcrumb style={{ backgroundColor: '#ffe58f' }} className="mb-0 pb-0">
              <h5>Products</h5>
            </Breadcrumb>
            <Row>
              <Col xs={{ span: 10 }} sm={{ span: 10 }}>
                <Input placeholder="Enter product Id to add to cart immediately" onPressEnter={async (e) => await onPressEnterAdd(e)} />
              </Col>
              <Col xs={{ span: 4 }} sm={{ span: 4 }}>
                &nbsp;&nbsp;<BarCodePos />
              </Col>
              <Col xs={{ span: 10 }} sm={{ span: 10 }}>
                <Search
                  placeholder="input id or name"
                  onSearch={(value: any) => search(value)}
                  enterButton
                  autoFocus={true}
                  defaultValue={productStore.searchKey}
                />
              </Col>
            </Row>
            <Tabs defaultActiveKey="1" onChange={callback}>
              <TabPane tab="Table" key="1">
                <Spin spinning={productStore.loading}>
                  <Table<Product> size="small" columns={columns} dataSource={productStore.products} rowKey={(record) => record.Id} pagination={false} />
                </Spin>
              </TabPane>
              <TabPane tab="Cards" key="2">
                <Spin spinning={productStore.loading}>
                  <List
                    grid={{
                      gutter: 16,
                      xs: 1,
                      sm: 2,
                      md: 3,
                      lg: 3,
                      xl: 4,
                      xxl: 4,
                    }}
                    dataSource={productStore.products}
                    renderItem={product => (
                      <List.Item>
                        <Card
                          size="small"
                          style={{ marginTop: 7 }}
                          actions={[
                            <ShoppingCartOutlined onClick={() => handleClick(product)} />
                          ]}
                        >

                          <Skeleton loading={false} avatar active>
                            <Meta
                              avatar={<Avatar size={48} shape="square" src={"http://warehouse-retail.herokuapp.com/api/products/img/thumbnails-" + String(product.PhotoURL ? product.PhotoURL : "default.png")} />
                              }
                              title={product.ProductName}
                              description={!product.Discontinued ? <Tag color="green">In stock</Tag> : <Tag color="red">Out of stock</Tag>}
                            />

                          </Skeleton>

                        </Card>
                      </List.Item>
                    )}
                  />,
              </Spin>
              </TabPane>
            </Tabs>
            <br />
            <Row>
              <Col xs={{ span: 20, offset: 1 }} sm={{ span: 20, offset: 1 }} xl={{ span: 20, offset: 1 }} xxl={{ span: 20, offset: 1 }}>
                <Pagination
                  size="small"
                  showQuickJumper
                  defaultCurrent={1}
                  total={productStore.totalCount}
                  showTotal={showTotal}
                  defaultPageSize={10}
                  onChange={onChange}
                />
              </Col>
            </Row>
          </Col>}
          {(cartStore.isCheckout) && <Col className="no-print" xs={{ span: 22, offset: 1 }} sm={{ span: 22, offset: 1 }} xl={{ span: 22, offset: 1 }} xxl={{ span: 11, offset: 2 }}>
            <Breadcrumb className="mb-0 pb-0">
              <h5>Promotion</h5>
            </Breadcrumb>

            <Form
              labelCol={{ span: 4 }}
              wrapperCol={{ span: 14 }}
              layout="horizontal"
            >
              <Form.Item label="Coupon">
                <Input placeholder="Enter coupon" onPressEnter={async (e) => await onPressEnterCoupon(e)} />
              </Form.Item>
            </Form>
            {cartStore.discount != 0 && <Alert message={"Apply coupon successfully, Discount: " + cartStore.discount} type="success" />}
            <br />
            <Breadcrumb className="mb-0 pb-0">
              <h5>Customer</h5>
            </Breadcrumb>

            <Form
              labelCol={{ span: 4 }}
              wrapperCol={{ span: 14 }}
              layout="horizontal"
            >
              <CreateCustomerModal />
              <br />
              <Form.Item label="Customer">
                <Select
                  showSearch
                  placeholder="Select a person"
                  optionFilterProp="children"
                  onSearch={onSearch}
                  onChange={onCustomerChange}
                  value={cartStore.currentCustomer.ContactName}
                >
                  {cartStore.customers && cartStore.customers.map(function (item) {
                    return (<Option value={item['Id']}>{item['ContactName']}</Option>)
                  })}
                </Select>
              </Form.Item>
              <Form.Item label="Phone">
                <Input value={cartStore.currentCustomer.Phone} disabled />
              </Form.Item>
              <Form.Item label="Address">
                <Input value={cartStore.currentCustomer.Address + ", " + cartStore.currentCustomer.City} disabled />
              </Form.Item>
            </Form>

            <Breadcrumb className="mb-0 pb-0">
              <h5>Payment</h5>
            </Breadcrumb>
            <Tabs defaultActiveKey="1" onChange={callback}>
              <TabPane tab="Cash" key="1">
                <Form
                  labelCol={{ span: 4 }}
                  wrapperCol={{ span: 14 }}
                  layout="horizontal"
                >
                  <Form.Item label="Total">
                    <Input disabled={cartStore.isCheckout} value={(cartStore.totalAmount * 1.1).toFixed(2)} />
                  </Form.Item>
                  <Form.Item label="Pay">
                    <Input onChange={async (e) => await onChangePay(e, Number((cartStore.totalAmount * 1.1).toFixed(2)))} />
                  </Form.Item>
                  <Form.Item label="Return">
                    <Input disabled={cartStore.isCheckout} value={Dinero({ amount: parseInt(""+(returnCash * 100)) }).toFormat('$0,0.00')} />
                  </Form.Item>
                  {!cartStore.isConfirm && <Form.Item style={{ textAlign: 'right' }}>
                    <Button loading={cartStore.loading} onClick={async () => await handleConfirmOrderClick()} type="primary" htmlType="submit">
                      Confirm
                    </Button>
                  </Form.Item>}
                </Form>
              </TabPane>
              <TabPane tab="Credit card" key="2">
                {/* <Alert message="This payment method is currently not supported. Please try again later!" type="warning" /> */}
                {!cartStore.isConfirm && <App></App>}
              </TabPane>
              <TabPane tab="E-Wallet" key="3">
                {/* <Alert message="This payment method is currently not supported. Please try again later!" type="warning" /> */}
                {/* <iframe id="iframe_a" name="iframe_a" style={{ width: '100%', height: "700px", border: 'none' }} src="http://localhost:8888/order/create_payment_url/20000000" /> */}
                {/* <StripeCheckout stripeKey="pk_test_51IxOkDGizvfJJVTjv7mn0Nxb9uZDBOVBYdxncXN4WBetXM8ypXaJ1ptyvA9XrgFDjS5bp1KtQ28Sukq94toUFAzR00SOLYwrFI" token={makePayment} name="Buy React" amount={product.price * 100}>
                  <button className="btn-large blue">
                    Buy react is just {product.price} $
          </button>
                </StripeCheckout> */}
                {!cartStore.isConfirm && <Form.Item style={{ textAlign: 'center' }}>
                  <Alert message="This payment method is currently supported VND currency only!" type="warning" />
                  <br />
                  <a id="vnpaylink" href={"https://retailvnpay.herokuapp.com/order/create_payment_url/" + String(parseInt(String((Number((cartStore.totalAmount * 1.1).toFixed(1))*23100))))} target="_blank">Go to payment page!</a>
                  <br />
                  <br/>
                  <Alert message="Please remember to create payment before confirming the order!" type="warning" />
                  <br />
                  <Form
                    labelCol={{ span: 4 }}
                    wrapperCol={{ span: 14 }}
                    layout="horizontal"
                    onFinish={onFinish}
                  >
                    <Form.Item label="OrderId" name="orderId" rules={[{ required: true, message: 'Please input the order Id created by VNPay!' }]}>
                      <Input placeholder="Order ID"/>
                    </Form.Item>
                    <Form.Item style={{ textAlign: 'right' }}>
                      <Button loading={cartStore.loading} type="primary" htmlType="submit">
                        Confirm payment and process order
                    </Button>
                    </Form.Item>
                  </Form>
                </Form.Item>}
              </TabPane>
            </Tabs>
          </Col>}
        </Row>
        <br />
      </div>}
    </>
  );
};

export default observer(PosPage);
