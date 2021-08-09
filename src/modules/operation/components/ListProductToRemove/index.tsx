import { observer } from "mobx-react";
import React from "react";
import { ProductStoreContext } from "../../../product/product.store";
import { AddProductStoreContext } from "../../../product/addproduct.store";
import {
  Input,
  Row,
  Modal,
  Col,
  Button,
  Pagination,
  Table,
  Tag,
  Radio,
  Space,
  Tabs,
  Card,
  Skeleton,
  Avatar,
  List,
  Spin,
} from "antd";
import {
  ExclamationCircleOutlined,
  AudioOutlined,
  EditOutlined,
  EllipsisOutlined,
  SettingOutlined,
  DeleteOutlined,
  CloseOutlined,
} from "@ant-design/icons";
import { ColumnsType } from "antd/es/table";
import "antd/dist/antd.css";
import UpdateProductModal from "../../../product/components/ManageProduct/UpdateProductModal";
import UpdateProductModalAdmin from "../../../product/components/ManageProduct/UpdateProductModalAdmin";
import CreateProductModal from "../../../product/components/ManageProduct/CreateProductModal";
import { makeAutoObservable, autorun, observable } from "mobx";
import App from "../../../product/components/ManageProduct/SalesAnalysis";
import BarCode from "../../../product/components/ManageProduct/Barcode";
import { AuthenticationStoreContext } from "../../../authenticate/authentication.store";
import { ShoppingCartOutlined } from "@ant-design/icons";
import { CartStoreContext } from "../../../../themes/pos/stores/cart.store";
import { AdminStoreContext } from "../../../admin-account/admin.store";
import { toast } from "react-toastify";

interface Product {
  Id: number;
  ProductName: string;
  CategoryId: number;
  QuantityPerUnit: string;
  UnitPrice: number;
  UnitsInStock: number;
  ReorderLevel: number;
  Discontinued: boolean;
}

const { confirm } = Modal;

interface ComponentProps {
  handleAssign?: any;
  setQuanInStock?: any;
}

const ListProductToRemove = (props: ComponentProps) => {
  const { handleAssign, setQuanInStock } = props;

  const productStore = React.useContext(ProductStoreContext);
  const addProductStore = React.useContext(AddProductStoreContext);
  const authenticationStore = React.useContext(AuthenticationStoreContext);
  const cartStore = React.useContext(CartStoreContext);

  React.useEffect(() => {
    productStore.startSearch();
    if (localStorage.getItem("role") != "OperationStaff") {
      addProductStore.startSearch();
    }
  }, []);

  const showTotal = (total: number) => {
    return `Total ${total} items`;
  };

  const onChange = async (pageNumber: number, pageSize: any) => {
    console.log("Page: ", pageNumber);
    console.log("PageSize: ", pageSize);
    console.log("PreviousPageSize: ", productStore.pageSize);
    if (pageNumber == 0 || pageSize != productStore.pageSize) pageNumber = 1;
    console.log("Page: ", pageNumber);
    await productStore.changePage(pageNumber, pageSize);
  };

  const onChangeNew = async (pageNumber: number, pageSize: any) => {
    console.log("Page: ", pageNumber);
    console.log("PageSize: ", pageSize);
    console.log("PreviousPageSize: ", addProductStore.pageSize);
    if (pageNumber == 0 || pageSize != addProductStore.pageSize) pageNumber = 1;
    console.log("Page: ", pageNumber);
    await addProductStore.changePage(pageNumber, pageSize);
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

  const showAddProductPromiseConfirm = async (row: any) => {
    confirm({
      title: "Do you want to add product " + row.ProductName,
      icon: <ExclamationCircleOutlined />,
      content:
        "Note: The product will be added to your store with no quantity!",
      async onOk() {
        await addProductStore.addProduct(row.Id);
        await productStore.startSearch();
      },
      onCancel() {},
    });
  };

  const admincolumns: ColumnsType<Product> = [
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
      title: "Category",
      dataIndex: "Category",
      sorter: false,
      render: (record) => record.CategoryName,
    },
    {
      title: "QuantityPerUnit",
      dataIndex: "QuantityPerUnit",
      sorter: false,
    },
    {
      title: "UnitsInStock",
      dataIndex: "UnitsInStock",
      sorter: false,
    },
    {
      title: "ReorderLevel",
      dataIndex: "ReorderLevel",
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
            style={{}}
            icon={<CloseOutlined />}
            className=""
            type="primary"
            onClick={() => {
              console.log(record);
              handleAssign(record.Id);
            }}
          >
            Removeeee
          </Button>
        </Space>
      ),
    },
  ];

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
      title: "Category",
      dataIndex: "Category",
      sorter: false,
      render: (record) => record.CategoryName,
    },
    {
      title: "QuantityPerUnit",
      dataIndex: "QuantityPerUnit",
      sorter: false,
    },
    {
      title: "UnitsInStock",
      dataIndex: "UnitsInStock",
      sorter: false,
    },
    {
      title: "ReorderLevel",
      dataIndex: "ReorderLevel",
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
            style={{}}
            icon={<CloseOutlined />}
            className=""
            type="primary"
            onClick={async() => {
              handleAssign(record);
            }}
          >
            Remove
          </Button>
        </Space>
      ),
    },
  ];

  const handleClick = (e: any) => {
    cartStore.addApriori(e);
  };

  const newcolumns: ColumnsType<Product> = [
    {
      title: "ProductName",
      dataIndex: "ProductName",
      sorter: false,
    },
    {
      title: "Category",
      dataIndex: "Category",
      sorter: false,
      render: (record) => record.CategoryName,
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
      title: "UnitsInStock",
      dataIndex: "UnitsInStock",
      sorter: false,
    },
    {
      title: "ReorderLevel",
      dataIndex: "ReorderLevel",
      sorter: false,
    },
    {
      title: "Discount",
      dataIndex: "Discount",
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
      title: "Add to your store",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <Button
            style={{}}
            icon={<CloseOutlined />}
            className=""
            type="primary"
            onClick={() => showAddProductPromiseConfirm(record)}
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

  const { Search } = Input;
  const search = async (key: string) => {
    await productStore.changeSearchKey(key);
  };

  const { TabPane } = Tabs;
  const { Meta } = Card;
  const gridStyle = {
    width: "50%",
    border: "none",
  };

  return (
    <>
      <div style={{ background: "white" }}>
        {console.log(productStore.products)}
        <Tabs defaultActiveKey="1" onChange={callback}>
          <TabPane tab="Table" key="1">
            <Row>
              <Search
                placeholder="input id or name"
                onSearch={(value: any) => search(value)}
                enterButton
                autoFocus={true}
              />
            </Row>
            <br />
            <Spin spinning={productStore.loading}>
              {localStorage.getItem("role") == "StoresManager" && (
                <Table<Product>
                  columns={admincolumns}
                  dataSource={productStore.products}
                  rowKey={(record) => record.Id}
                  pagination={false}
                />
              )}
              {localStorage.getItem("role") != "StoresManager" && (
                <Table<Product>
                  columns={columns}
                  dataSource={productStore.products}
                  rowKey={(record) => record.Id}
                  pagination={false}
                />
              )}
              <br />
              <Row>
                <Col span={18} offset={6}>
                  <Pagination
                    showQuickJumper
                    defaultCurrent={1}
                    total={productStore.totalCount}
                    showTotal={showTotal}
                    defaultPageSize={10}
                    onChange={onChange}
                  />
                </Col>
              </Row>
            </Spin>
          </TabPane>
          <TabPane tab="Cards" key="2">
            <Row>
              <Search
                placeholder="input id or name"
                onSearch={(value: any) => search(value)}
                enterButton
                autoFocus={true}
              />
            </Row>
            <br />
            <Spin spinning={productStore.loading}>
              <List
                grid={{
                  gutter: 16,
                  xs: 1,
                  sm: 2,
                  md: 2,
                  lg: 2,
                  xl: 3,
                  xxl: 4,
                }}
                dataSource={productStore.products}
                renderItem={(product) => (
                  <List.Item>
                    <Card
                      style={{ width: 300, marginTop: 16 }}
                      actions={[
                        localStorage.getItem("role") == "StoresManager" && (
                          <App record={product} />
                        ),
                      ]}
                    >
                      <Skeleton loading={false} avatar active>
                        <Meta
                          avatar={
                            <Avatar
                              shape="square"
                              size={64}
                              src={
                                "https://warehouse-retail.herokuapp.com/api/products/img/thumbnails-" +
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
                        <p>{product.QuantityPerUnit}</p>
                      </Skeleton>
                    </Card>
                  </List.Item>
                )}
              />
              ,
              <br />
              <Row>
                <Col span={18} offset={6}>
                  <Pagination
                    showQuickJumper
                    defaultCurrent={1}
                    total={productStore.totalCount}
                    showTotal={showTotal}
                    defaultPageSize={10}
                    onChange={onChange}
                  />
                </Col>
              </Row>
            </Spin>
          </TabPane>
        </Tabs>
      </div>
    </>
  );
};

export default observer(ListProductToRemove);
