import { observer } from "mobx-react";
import React from "react";
import { ProductStoreContext } from "../../../product/product.store";
import {
  ExclamationCircleOutlined,
  AudioOutlined,
  EditOutlined,
  EllipsisOutlined,
  SettingOutlined,
  DeleteOutlined,
  ShoppingCartOutlined,
  PlusOutlined,
  PlusCircleTwoTone,
} from "@ant-design/icons";
import { ColumnsType } from "antd/es/table";
import UpdateProductModal from "../../../product/components/ManageProduct/UpdateProductModal";
import CreateProductModal from "../../../product/components/ManageProduct/CreateProductModal";
import { makeAutoObservable, autorun, observable, toJS } from "mobx";
import {
  Jumbotron,
  Container,
  Breadcrumb,
  Navbar,
  Nav,
  Row,
  Col,
} from "react-bootstrap";
import "../../../../modules/product/components/ManageProduct/style.css";
import Clock from "react-live-clock";
import { CommonStoreContext } from "../../../../common/common.store";
import { CartStoreContext } from "../../../../themes/pos/stores/cart.store";
import Tag from "antd/lib/tag";
import Space from "antd/lib/space";
import Tabs from "antd/lib/tabs";
import Card from "antd/lib/card";
import Modal from "antd/lib/modal";
import Button from "antd/lib/button";
import Input from "antd/lib/input";
import {
  Avatar,
  Form,
  List,
  message,
  Pagination,
  Skeleton,
  Spin,
  Table,
  Badge,
} from "antd";
import { toast } from "react-toastify";
import { Link, Redirect, useHistory } from "react-router-dom";
import { AuthenticationStoreContext } from "../../../authenticate/authentication.store";

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

const PreCartPage = () => {
  const commonStore = React.useContext(CommonStoreContext);
  const productStore = React.useContext(ProductStoreContext);
  const cartStore = React.useContext(CartStoreContext);
  const [total, setTotal] = React.useState<number>();
  const [returnCash, setReturnCash] = React.useState<number>(0);
  React.useEffect(() => {}, [returnCash, cartStore.loading]);
  React.useEffect(() => {
    productStore.startSearch();
  }, []);

  const showTotal = (total: number) => {
    return `Total ${total} items`;
  };

  const onChange = async (pageNumber: number, pageSize: any) => {
    if (pageNumber == 0 || pageSize != productStore.pageSize) pageNumber = 1;
    console.log("Page: ", pageNumber);
    await productStore.changePage(pageNumber, pageSize);
  };

  const search = async (key: string) => {
    await productStore.changeSearchKey(key);
  };

  const showPromiseConfirm = async (row: any) => {
    confirm({
      title: "Do you want to delete product " + row.ProductName,
      icon: <ExclamationCircleOutlined />,
      content: "Warning: The delete product cannot be recover",
      async onOk() {
        await productStore.deleteProduct(row.Id);
      },
      onCancel() {},
    });
  };

  const handleClick = (e: any) => {
    cartStore.addToCart(e, true);
  };

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
        !val ? (
          <Tag color="green">In stock</Tag>
        ) : (
          <Tag color="red">Out of stock</Tag>
        ),
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <Button
            style={{ color: "rgb(24, 144, 255)" }}
            icon={<PlusCircleTwoTone />}
            className=""
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
  };

  const { TabPane } = Tabs;
  const { Meta } = Card;
  const gridStyle = {
    width: "50%",
    border: "none",
  };
  const onChangePay = async (e: any) => {
    setReturnCash(Number(e.target.value) - Number(cartStore.totalAmount));
    console.log("Change:", e.target.value);
  };
  const onPressEnterAdd = async (e: any) => {
    if (!Number.isInteger(Number(e.target.value))) {
      toast("Invalid ID!");
    } else {
      cartStore.addToCartById(Number(e.target.value), true);
    }
  };

  const handleConfirmOrderClick = async () => {
    await cartStore.confirmOrder();
  };

  const { Search } = Input;

  return (
    <>
      {
        /*cartStore.session && */ <div
          style={{
            background: "white",
            width: "97%",
            margin: "auto",
            padding: "10px",
          }}
        >
          <Row>
            {!cartStore.isCheckout && (
              <Col
                xs={{ span: 12, offset: 1 }}
                sm={{ span: 12, offset: 1 }}
                xl={{ span: 12, offset: 0 }}
              >
                <Breadcrumb
                  style={{ backgroundColor: "#ffe58f" }}
                  className="mb-0 pb-0"
                >
                  <h5>Products</h5>
                </Breadcrumb>
                <Row>
                  <Col xs={{ span: 4 }} sm={{ span: 4 }} xl={{ span: 4 }}>
                    <Input
                      placeholder="Enter product Id to add to cart immediately"
                      onPressEnter={async (e) => await onPressEnterAdd(e)}
                    />
                  </Col>
                  <Col xs={{ span: 4 }} sm={{ span: 4 }} xl={{ span: 4 }}></Col>
                  <Col xs={{ span: 4 }} sm={{ span: 4 }} xl={{ span: 4 }}>
                    <Search
                      placeholder="input id or name"
                      onSearch={(value: any) => search(value)}
                      enterButton
                      autoFocus={true}
                      style={{ textAlign: "right", marginRight: "5px" }}
                      defaultValue={productStore.searchKey}
                    />
                  </Col>
                </Row>
                <Row>
                  <Col
                    xs={{ span: 2 }}
                    sm={{ span: 2 }}
                    xl={{ span: 2 }}
                    style={{ margin: "15px 0" }}
                  >
                    <Button
                      type="primary"
                      shape="round"
                      icon={<ShoppingCartOutlined />}
                      size="large"
                    >
                      <Link
                        to="/warehouse/new-request-goods-note-cart"
                        style={{
                          color: "white",
                          marginTop: "5px",
                          marginLeft: "5px",
                        }}
                      >
                        Go to cart
                        <Badge
                          count={cartStore.totalNum}
                          style={{
                            margin: "auto -6px 3px 7px",
                          }}
                        ></Badge>
                      </Link>
                    </Button>
                  </Col>
                </Row>
                <Row>
                  <Col
                    xs={{ span: 12, offset: 1 }}
                    sm={{ span: 12, offset: 1 }}
                    xl={{ span: 12, offset: 0 }}
                  >
                    <Tabs defaultActiveKey="1" onChange={callback}>
                      <TabPane tab="Table" key="1">
                        <Spin spinning={productStore.loading}>
                          <Table<Product>
                            columns={columns}
                            dataSource={productStore.products}
                            rowKey={(record) => record.Id}
                            pagination={false}
                            style={{ width: "100%" }}
                          />
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
                            renderItem={(product) => (
                              <List.Item>
                                <Card
                                  size="small"
                                  style={{ marginTop: 7 }}
                                  actions={[
                                    <PlusOutlined
                                      onClick={() => handleClick(product)}
                                    />,
                                  ]}
                                >
                                  <Skeleton loading={false} avatar active>
                                    <Meta
                                      avatar={
                                        <Avatar
                                          size={48}
                                          shape="square"
                                          src={
                                            "http://localhost:4000/api/products/img/thumbnails-" +
                                            String(
                                              product.PhotoURL
                                                ? product.PhotoURL
                                                : "default.png"
                                            )
                                          }
                                        />
                                      }
                                      title={product.ProductName}
                                      description={
                                        !product.Discontinued ? (
                                          <Tag color="green">In stock</Tag>
                                        ) : (
                                          <Tag color="red">Out of stock</Tag>
                                        )
                                      }
                                    />
                                  </Skeleton>
                                </Card>
                              </List.Item>
                            )}
                          />
                          ,
                        </Spin>
                      </TabPane>
                    </Tabs>
                  </Col>
                </Row>
                <br />
                <Row>
                  <Col
                    xs={{ span: 12, offset: 1 }}
                    sm={{ span: 12, offset: 1 }}
                    xl={{ span: 12, offset: 0 }}
                  >
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
              </Col>
            )}
          </Row>
          <br />
        </div>
      }
    </>
  );
};

export default observer(PreCartPage);
