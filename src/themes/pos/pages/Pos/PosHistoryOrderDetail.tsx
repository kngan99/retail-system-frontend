import { observer } from "mobx-react";
import React from "react";
import { ProductStoreContext } from "../../../../modules/product/product.store";

import { Modal, Button, Pagination, Table, Tag, Radio, Space, Tabs, Card, Skeleton, Avatar, List, Spin, Divider, Form, Input, Select, message, PageHeader } from 'antd';
import { ExclamationCircleOutlined, ShoppingCartOutlined, DatabaseOutlined } from "@ant-design/icons";
import { ColumnsType } from "antd/es/table";
import UpdateProductModal from "../../../../modules/product/components/ManageProduct/UpdateProductModal";
import CreateProductModal from "../../../../modules/product/components/ManageProduct/CreateProductModal";
import { makeAutoObservable, autorun, observable, toJS } from "mobx"
import Cart from "../../components/Cart";
import { Jumbotron, Container, Breadcrumb, Navbar, Nav, Row, Col } from 'react-bootstrap';
import '../../../../modules/product/components/ManageProduct/style.css';
import Clock from 'react-live-clock';
import { CommonStoreContext } from '../../../../common/common.store';
import { HistoryStoreContext } from "../../stores/history.store";
import { OrderStoreContext } from "../../stores/order.store";
import { string } from "yup/lib/locale";
import { useHistory } from 'react-router-dom';
import { AuthenticationStoreContext } from '../../../../modules/authenticate/authentication.store';
import { DEFAULT_ROUTERS } from '../../../../modules/account/router.enum';
const { confirm } = Modal;



const PosOrderHistoryPage = (props) => {
  const history = useHistory();
  const authenticationStore = React.useContext(AuthenticationStoreContext);
  const commonStore = React.useContext(CommonStoreContext);
  const historyStore = React.useContext(HistoryStoreContext);
  const orderStore = React.useContext(OrderStoreContext);

  React.useEffect(() => {
    orderStore.getCurrentOrderDetail(props.props.match.params.orderId);
  }, []);

  const columns: ColumnsType<any> = [
    {
      title: "ProductId",
      dataIndex: "ProductId",
      sorter: false,
    },
    {
      title: "ProductName",
      dataIndex: "ProductName",
      sorter: false,
      render: (_, record) => (record ? record.Product.ProductName : 'None')
    },
    {
      title: "Quantity",
      dataIndex: "Quantity",
      sorter: false,
    },
    {
      title: "ReturnedQuantity",
      dataIndex: "ReturnedQuantity",
      sorter: false,
    },
    {
      title: "Price",
      dataIndex: "Price",
      sorter: false,
    },
    {
      title: "Discount",
      dataIndex: "Discount",
      sorter: false,
    },
    {
      title: "Total",
      dataIndex: "Total",
      sorter: false,
      render: (_, record) => (record ? Number(((record.Quantity - record.ReturnedQuantity) * record.Price * (100 - record.Discount) / 100).toFixed(2)) : 0.0)
    },
  ];

  const { TabPane } = Tabs;
  const { Meta } = Card;
  const gridStyle = {
    width: '50%',
    border: "none",
  };

  return (
    <>
      <div style={{
        background: "white", width: "97%",
        margin: "auto", padding: "10px",
      }}>

        <Breadcrumb style={{ backgroundColor: '#ffe58f' }} className="mb-0 pb-0">
          <h5>Orders</h5>
        </Breadcrumb>
        <Spin spinning={orderStore.loading}>
          {orderStore.products && <Table columns={columns} dataSource={orderStore.products} rowKey={(record) => record.ProductId} pagination={false} />}<br /><br />
        </Spin>
        <br />
      </div>
    </>
  );
};

export default observer(PosOrderHistoryPage);
