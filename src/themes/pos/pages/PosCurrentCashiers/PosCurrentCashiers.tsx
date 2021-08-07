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
import PosHistoryPage from "../Pos/PosHistoryPage";
const { confirm } = Modal;



const PosCurrentCashiersPage = () => {
  const history = useHistory();
  const commonStore = React.useContext(CommonStoreContext);
  const historyStore = React.useContext(HistoryStoreContext);
  const orderStore = React.useContext(OrderStoreContext);
 
  React.useEffect(() => {
    historyStore.getAllCashiers();
  }, []);

  const callback = async (key) => {
    console.log(key);
    await historyStore.setCurrentCashier(Number(key));
    await orderStore.setCurrentCashier(Number(key));
    await historyStore.setCurrentCashier(Number(key));
    await historyStore.getPastSessions(Number(key));
    await orderStore.setCurrentCashier(Number(key));
    await orderStore.getPastOrders(Number(key));
  }


  const { TabPane } = Tabs;
  const { Meta } = Card;
  const gridStyle = {
    width: '50%',
    border: "none",
  };

  return (
    <>
      {historyStore.cashiers &&
        <Spin spinning={historyStore.loading}>
        {historyStore.cashiers.length && <Tabs tabPosition="left" defaultActiveKey="0" onChange={callback} style={{ height: 992 }}>
          <TabPane tab="Default" key="0">
          Click on the staff name tab to view detail
          </TabPane>
          {historyStore.cashiers.map((cashier) => (
            <TabPane tab={String(cashier.FName)} key={String(cashier.Id)}>
              {cashier.Id && <PosHistoryPage cashierId={cashier.Id}></PosHistoryPage>}
            </TabPane>
          ))}
        </Tabs>}
        </Spin>
      }
      <br />
    </>
  );
};

export default observer(PosCurrentCashiersPage);
