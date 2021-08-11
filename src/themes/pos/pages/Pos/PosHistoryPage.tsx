import { observer } from "mobx-react";
import React from "react";
import { ProductStoreContext } from "../../../../modules/product/product.store";
import { CartStoreContext } from "../../stores/cart.store";
import { Modal, Button, Pagination, Table, Tag, Radio, Space, Tabs, Card, Skeleton, Avatar, List, Spin, Divider, Form, Input, Select, message } from 'antd';
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
import { useHistory } from 'react-router-dom';
import { Column } from "@ant-design/charts";
const { confirm } = Modal;



const PosHistoryPage = (cashierId) => {
  const history = useHistory();
  const commonStore = React.useContext(CommonStoreContext);
  const historyStore = React.useContext(HistoryStoreContext);
  const orderStore = React.useContext(OrderStoreContext);
  React.useEffect(() => {
    historyStore.setCurrentCashier(cashierId.cashierId);
    historyStore.getPastSessions(cashierId.cashierId);
    historyStore.getPastStores(cashierId.cashierId)
    orderStore.setCurrentCashier(cashierId.cashierId);
    orderStore.getPastOrders(cashierId.cashierId);
  }, []);

  // React.useEffect(() => {
  //   historyStore.setCurrentCashier(cashierId.cashierId);
  //   historyStore.getPastSessions(cashierId.cashierId);
  //   orderStore.setCurrentCashier(cashierId.cashierId);
  //   orderStore.getPastOrders(cashierId.cashierId);
  // }, [historyStore.currentCashierId]);

  const showTotal = (total: number) => {
    return `Total ${total} items`;
  }

  const onChange = async (pageNumber: number, pageSize: any) => {
    if (pageNumber == 0 || pageSize != historyStore.pageSize) pageNumber = 1;
    console.log("Page: ", pageNumber);
    await historyStore.changePage(pageNumber, pageSize);
  }

  const showTotalOrder = (total: number) => {
    return `Total ${total} items`;
  }

  const onChangeOrder = async (pageNumber: number, pageSize: any) => {
    if (pageNumber == 0 || pageSize != orderStore.pageSize) pageNumber = 1;
    console.log("Page: ", pageNumber);
    await orderStore.changePage(pageNumber, pageSize);
  }


  const columns: ColumnsType<any> = [
    {
      title: "SessionId",
      dataIndex: "SessionId",
      sorter: false,
    },
    {
      title: "Salescleck",
      dataIndex: "SaleclerkId",
      sorter: false,
      render: (text, row, index) => {
        return row.Account.FName +" "+ row.Account.LName;
      }
    },
    {
      title: "Start",
      dataIndex: "Start",
      sorter: false,
      render: (text, row, index) => {
        return <span>{new Date(text).toLocaleString()}</span>
      }
    },
    {
      title: "End",
      dataIndex: "End",
      sorter: false,
      render: (text, row, index) => {
        return <span>{new Date(text).toLocaleString()}</span>
      }
    },
    {
      title: "StoreId",
      dataIndex: "StoreId",
      sorter: false,
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <Button
            style={{}}
            icon={<DatabaseOutlined />}
            className=""
            type="primary"
            onClick={() => {
              console.log(record);
              history.push('/pos/past/' + String(record.SessionId));
            }}
          >
            Detail
          </Button>
        </Space>
      ),
    },
  ];

  const orderColumns: ColumnsType<any> = [
    {
      title: "Id",
      dataIndex: "Id",
      sorter: false,
    },
    {
      title: "Customer",
      dataIndex: "Customer",
      sorter: false,
      render: (record) => (record ? record.ContactName : 'None')
    },
    {
      title: "OrderDate",
      dataIndex: "OrderDate",
      sorter: false,
      render: (text, row, index) => {
        return <span>{new Date(text).toLocaleString()}</span>
      }
    },
    {
      title: "RawTotal",
      dataIndex: "ProductOrders",
      sorter: false,
      render: (record) => (record.reduce((accumulator, current) => accumulator + (current.Price * (current.Quantity - current.ReturnedQuantity)), 0)).toFixed(2)
    },
    {
      title: "Discount",
      dataIndex: "Discount",
      sorter: false,
    },
    {
      title: "Total(+VAT)",
      dataIndex: "ProductOrders",
      sorter: false,
      render: (record, row) => ((record.reduce((accumulator, current) => accumulator + (current.Price * (current.Quantity - current.ReturnedQuantity)), 0) - row.Discount) * 1.1).toFixed(2),
    },
    {
      title: "Payment",
      dataIndex: "Payment",
      render: (_,row) =>
        (row.Stripe) ? <Tag color="blue">Credit Card</Tag> : ((row.Vnpay) ? <Tag color="red">E-Wallet</Tag> : <Tag color="yellow">Cash</Tag>),
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <Button
            style={{}}
            icon={<DatabaseOutlined />}
            className=""
            type="primary"
            onClick={() => {
              console.log(record);
              history.push('/pos/order/' + String(record.Id));
            }}
          >
            Detail
          </Button>
        </Space>
      ),
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
      {/* <Spin spinning={historyStore.loading || orderStore.loading}> */}
      <Tabs defaultActiveKey="1">
        <TabPane tab="Past Sessions" key="1">
            <Table columns={columns} dataSource={historyStore.sessions} rowKey={(record) => record.SessionId} pagination={false} /><br /><br />
            <Pagination
              showQuickJumper
              defaultCurrent={1}
              total={historyStore.totalCount}
              showTotal={showTotal}
              defaultPageSize={10}
              onChange={onChange}
            />
        </TabPane>
        <TabPane tab="Past Orders" key="2">
            <Table columns={orderColumns} dataSource={orderStore.orders} rowKey={(record) => record.Id} pagination={false} /><br /><br />
            <Pagination
              showQuickJumper
              defaultCurrent={1}
              total={orderStore.totalCount}
              showTotal={showTotalOrder}
              defaultPageSize={10}
              onChange={onChangeOrder}
            />
        </TabPane>
        <TabPane tab="Past Stores" key="3">
          {historyStore.pastStores.length > 0 && !historyStore.loading &&
            <Column data={historyStore.pastStores}
              height={400}
              xField={'StoreId'}
              yField={'FinalTotal'}
              />
          }
        </TabPane>
        </Tabs>
      {/* </Spin> */}
      <br />
    </>
  );
};

export default observer(PosHistoryPage);
