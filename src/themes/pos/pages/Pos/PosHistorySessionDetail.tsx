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
import { string } from "yup/lib/locale";
import { useHistory } from 'react-router-dom';
import { AuthenticationStoreContext } from '../../../../modules/authenticate/authentication.store';
import { DEFAULT_ROUTERS } from '../../../../modules/account/router.enum';
const { confirm } = Modal;



const PosHistoryPage = (props) => {
  const history = useHistory();
  const authenticationStore = React.useContext(AuthenticationStoreContext);
  const commonStore = React.useContext(CommonStoreContext);
  const historyStore = React.useContext(HistoryStoreContext);

  React.useEffect(() => {
    historyStore.getCurrentSessionDetail(props.props.match.params.sessionId);
  }, []);

  const showTotal = (total: number) => {
    return `Total ${total} items`;
  }

  const onChange = async (pageNumber: number, pageSize: any) => {
    if (pageNumber == 0 || pageSize != historyStore.pageSize) pageNumber = 1;
    console.log("Page: ", pageNumber);
    await historyStore.changePage(pageNumber, pageSize);
  }


  const columns: ColumnsType<any> = [
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
      title: "Discount",
      dataIndex: "Discount",
      sorter: false,
    },
    {
      title: "Total(+VAT)",
      dataIndex: "ProductOrders",
      sorter: false,
      render: (record, row) => ((record.reduce((accumulator, current) => accumulator + ((current.Price * (current.Quantity - current.ReturnedQuantity)) * (100 - current.Discount) / 100), 0) - row.Discount) * (1 + 0.1)).toFixed(2)
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

  const handleLogout = () => {
    authenticationStore.logout(history, DEFAULT_ROUTERS.LOGIN);
  };

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
        <Spin spinning={historyStore.loading}>
          <Table columns={columns} dataSource={historyStore.orders} rowKey={(record) => record.Id} pagination={false} /><br /><br />
          <Pagination
            showQuickJumper
            defaultCurrent={1}
            total={historyStore.totalCount}
            showTotal={showTotal}
            defaultPageSize={10}
            onChange={onChange}
          />
        </Spin>
        <br />
      </div>
    </>
  );
};

export default observer(PosHistoryPage);
