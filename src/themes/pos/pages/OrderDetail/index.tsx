import { observer } from "mobx-react";
import React from "react";
import { CartStoreContext } from "../../stores/cart.store";
import { HistoryStoreContext } from "../../stores/history.store";
import { Layout, Menu, Breadcrumb, PageHeader, Button, Descriptions, Collapse } from 'antd';
import PosPage from '../Pos/PosPage';
import PosHistoryPage from '../Pos/PosHistoryPage';
import "antd/dist/antd.css";
import '../../assets/style.css';
import Clock from 'react-live-clock';
import { CommonStoreContext } from '../../../../common/common.store';
import { AuthenticationStoreContext } from '../../../../modules/authenticate/authentication.store';
import { DEFAULT_ROUTERS } from '../../../../modules/account/router.enum';
import { useHistory } from 'react-router-dom';
import AdminWrapper from "../../../../modules/admin-account/components/AdminWrapper";
import PosHistorySessionDetail from "../Pos/PosHistorySessionDetail";
import PosHistoryOrderDetail from "../Pos/PosHistoryOrderDetail";
import { OrderStoreContext } from "../../stores/order.store";
const { Header, Content, Footer } = Layout;
const { Panel } = Collapse;




const HistoryPage = (props) => {
    const history = useHistory();
    const cartStore = React.useContext(CartStoreContext);
    const authenticationStore = React.useContext(AuthenticationStoreContext);
    const orderStore = React.useContext(OrderStoreContext);
    const commonStore = React.useContext(CommonStoreContext);
    const historyStore = React.useContext(HistoryStoreContext);
    const handleLogout = () => {
        authenticationStore.logout(history, DEFAULT_ROUTERS.LOGIN);
    };
    React.useEffect(() => {
        orderStore.getCurrentOrderDetail(props.match.params.orderId);
    }, []);


    return (
        <>
            <AdminWrapper>
                <div style={{ background: "linear-gradient(90deg, #fab91a 0, #ffd424 100%)" }} className="site-page-header-ghost-wrapper">
                    <PageHeader
                        ghost={false}
                        onBack={() => window.history.back()}
                        extra={[
                            <Button key="3">Help?</Button>,
                            <Button onClick={() => { history.push('/pos') }} key="2">Return to sale page</Button>,
                            <Button key="5" type="primary" onClick={() => handleLogout()}>
                                Log out
                        </Button>,
                        ]}
                    >
                        {orderStore.order && <Collapse defaultActiveKey={['1']}>
                            <Panel header={<strong style={{ color: '#8c8c8c' }}>Detail info</strong>} key="1">
                                <Descriptions size="small" column={2}>
                                    <Descriptions.Item label="Store Manager">Lili Qu</Descriptions.Item>
                                    <Descriptions.Item label="Session Id">
                                        <a>{orderStore.order.SessionId}</a>
                                    </Descriptions.Item>
                                    <Descriptions.Item label="Order Date">{new Date(orderStore.order.OrderDate).toLocaleString()}</Descriptions.Item>
                                    <Descriptions.Item label="Saleslerk">{orderStore.order.Account.FName + " " + orderStore.order.Account.LName}</Descriptions.Item>
                                    <Descriptions.Item label="Current time"><Clock format={commonStore.hourMinusFormat} ticking={true} /></Descriptions.Item>
                                    <Descriptions.Item label="Store">
                                        TN Store, A123 St., W.10, D.1, Abc City
                                </Descriptions.Item>
                                </Descriptions>
                            </Panel>
                        </Collapse>}
                        {orderStore.order && orderStore.order.Customer &&
                            <Collapse defaultActiveKey={['2']}>
                                <Panel header={<strong style={{ color: '#8c8c8c' }}>Customer's info</strong>} key="1">
                                    <Descriptions size="small" column={2}>
                                        <Descriptions.Item label="Customer">{orderStore.order.Customer.ContactTitle + ". " + orderStore.order.Customer.ContactName}</Descriptions.Item>
                                        <Descriptions.Item label="Customer's Address">{orderStore.order.Customer.Address + ", " + orderStore.order.Customer.City + ", " + orderStore.order.Customer.Region + ", " + orderStore.order.Customer.Country}</Descriptions.Item>
                                        <Descriptions.Item label="Customer's Address Postal Code">{orderStore.order.Customer.PostalCode}</Descriptions.Item>
                                        <Descriptions.Item label="Customer's Phone">{orderStore.order.Customer.Phone}</Descriptions.Item>
                                        <Descriptions.Item label="Customer's Fax">{orderStore.order.Customer.Fax}</Descriptions.Item>
                                    </Descriptions>
                                </Panel>
                            </Collapse>}
                    </PageHeader>
                </div >
                <Layout style={{ background: "linear-gradient(90deg, #fab91a 0, #ffd424 100%)" }} className="layout">
                    <Content style={{ padding: '0 1px' }}>

                        <div className="site-layout-content"><PosHistoryOrderDetail props={props} /></div>
                    </Content>
                    <Footer style={{ textAlign: 'center', background: "linear-gradient(90deg, #fab91a 0, #ffd424 100%)" }}></Footer>
                </Layout>
                <br />
                <br />
                <br />
            </AdminWrapper>
        </>
    );
};

export default observer(HistoryPage);
