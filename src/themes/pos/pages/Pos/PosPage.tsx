import { observer } from "mobx-react";
import React from "react";
import { ProductStoreContext } from "../../../../modules/product/product.store";
import { CartStoreContext } from "../../stores/cart.store";
import { Modal, Button, Pagination, Table, Tag, Radio, Space, Tabs, Card, Skeleton, Avatar, List, Spin, Divider, Form, Input, Select, message } from 'antd';
import { ExclamationCircleOutlined, AudioOutlined, EditOutlined, EllipsisOutlined, SettingOutlined, DeleteOutlined, ShoppingCartOutlined } from "@ant-design/icons";
import { ColumnsType } from "antd/es/table";
import UpdateProductModal from "../../../../modules/product/components/ManageProduct/UpdateProductModal";
import CreateProductModal from "../../../../modules/product/components/ManageProduct/CreateProductModal";
import { makeAutoObservable, autorun, observable, toJS } from "mobx"
import Cart from "../../components/Cart";
import { Jumbotron, Container, Breadcrumb, Navbar, Nav, Row, Col } from 'react-bootstrap';
import '../../../../modules/product/components/ManageProduct/style.css';
import Clock from 'react-live-clock';
import { CommonStoreContext } from '../../../../common/common.store';

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



const PosPage = () => {
  const commonStore = React.useContext(CommonStoreContext);
  const productStore = React.useContext(ProductStoreContext);
  const cartStore = React.useContext(CartStoreContext);
  const [total, setTotal] = React.useState<number>();
  const [returnCash, setReturnCash] = React.useState<number>(0);
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
  const onChangePay = async (e: any) => {
    setReturnCash(Number(e.target.value) - Number(cartStore.totalAmount));
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

  const handleConfirmOrderClick = async () => {
    await cartStore.confirmOrder();
  }

  const { Search } = Input;

  return (
    <>
      {cartStore.session && <div style={{
        background: "white", width: "97%",
        margin: "auto", padding: "10px",
      }}>
        <Row>
          <Col xs={{ span: 12, offset: 1 }} sm={{ span: 10, offset: 1 }} xl={{ span: 6, offset: 0 }}><Cart productsInCart={cartStore.productsInCart} totalNum={cartStore.totalNum} totalAmount={cartStore.totalAmount} isCheckout={cartStore.isCheckout} /></Col>
          {(!cartStore.isCheckout) && <Col xs={{ span: 10, offset: 1 }} sm={{ span: 10, offset: 1 }} xl={{ span: 6, offset: 0 }}>
            <Breadcrumb style={{ backgroundColor: '#ffe58f' }} className="mb-0 pb-0">
              <h5>Products</h5>
            </Breadcrumb>
            <Row>
              <Col xs={{ span: 5 }} sm={{ span: 5 }}>
                <Input placeholder="Enter product Id to add to cart immediately" onPressEnter={async (e) => await onPressEnterAdd(e)} />
              </Col>
              <Col xs={{ span: 3 }} sm={{ span: 3 }}></Col>
              <Col xs={{ span: 4 }} sm={{ span: 4 }}>
                <Search
                  placeholder="input id or name"
                  onSearch={(value: any) => search(value)}
                  enterButton
                  autoFocus={true}
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
                              avatar={<Avatar size={48} shape="square" src={"http://127.0.0.1:4000/api/products/img/thumbnails-" + String(product.PhotoURL ? product.PhotoURL : "default.png")} />
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
              <Col xs={{ span: 10, offset: 1 }} sm={{ span: 10, offset: 1 }}>
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
          {(cartStore.isCheckout) && <Col xs={{ span: 12, offset: 1 }} sm={{ span: 10, offset: 1 }} xl={{ span: 6, offset: 0 }}>
            <Breadcrumb className="mb-0 pb-0">
              <h5>Customer</h5>
            </Breadcrumb>

            <Form
              labelCol={{ span: 4 }}
              wrapperCol={{ span: 14 }}
              layout="horizontal"
            >
              <Form.Item label="Customer">
                <Input />
              </Form.Item>
              <Form.Item label="Phone">
                <Input />
              </Form.Item>
              <Form.Item label="Address">
                <Input />
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
                    <Input disabled={cartStore.isCheckout} value={cartStore.totalAmount} />
                  </Form.Item>
                  <Form.Item label="Pay">
                    <Input onChange={async (e) => await onChangePay(e)} />
                  </Form.Item>
                  <Form.Item label="Return">
                    <Input disabled={cartStore.isCheckout} value={returnCash} />
                  </Form.Item>
                  {!cartStore.isConfirm && <Form.Item style={{ textAlign: 'right' }}>
                    <Button loading={cartStore.loading} onClick={async () => await handleConfirmOrderClick()} type="primary" htmlType="submit">
                      Confirm
                    </Button>
                  </Form.Item>}
                </Form>
              </TabPane>
              <TabPane tab="Credit card" key="2"></TabPane>
              <TabPane tab="E-Wallet" key="3"></TabPane>
            </Tabs>
          </Col>}
        </Row>
        <br />
      </div>}
    </>
  );
};

export default observer(PosPage);