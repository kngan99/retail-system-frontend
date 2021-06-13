import { observer } from "mobx-react";
import React from "react";
import { CartStoreContext } from "../../stores/cart.store";
import { HistoryStoreContext } from "../../stores/history.store";
import { Layout, Menu, Breadcrumb, PageHeader, Button, Descriptions, Collapse, Tag } from 'antd';
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
const { Header, Content, Footer } = Layout;
const { Panel } = Collapse;




const HistoryPage = (props) => {
    const history = useHistory();
    const cartStore = React.useContext(CartStoreContext);
    const authenticationStore = React.useContext(AuthenticationStoreContext);
    const commonStore = React.useContext(CommonStoreContext);
    const historyStore = React.useContext(HistoryStoreContext);
    const handleLogout = () => {
        authenticationStore.logout(history, DEFAULT_ROUTERS.LOGIN);
    };
    React.useEffect(() => {
        historyStore.getCurrentSessionDetail(props.match.params.sessionId);
        console.log(historyStore.currentDetailSession);
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
                        {historyStore.currentDetailSession && <Collapse defaultActiveKey={['1']}>
                            <Panel header={<strong style={{ color: '#8c8c8c' }}>Detail info</strong>} key="1">
                                <Descriptions size="small" column={2}>
                                    <Descriptions.Item label="Session Id">
                                        <a>{historyStore.currentDetailSession.data.SessionId}</a>
                                    </Descriptions.Item>
                                    <Descriptions.Item label="Session start">{new Date(historyStore.currentDetailSession.data.Start).toLocaleString()}</Descriptions.Item>
                                    <Descriptions.Item label="Session end">{new Date(historyStore.currentDetailSession.data.End).toLocaleString()}</Descriptions.Item>
                                    {historyStore.currentDetailSession.total && <Descriptions.Item label="Total"><Tag color="cyan">${historyStore.currentDetailSession.total[0].FinalTotal}</Tag></Descriptions.Item>}
                                    {historyStore.currentDetailSession.totalCash && <Descriptions.Item label="Total Cash"><Tag color="yellow">${historyStore.currentDetailSession.totalCash[0].FinalTotal}</Tag></Descriptions.Item>}
                                    {historyStore.currentDetailSession.totalCredit && <Descriptions.Item label="Total Credit"><Tag color="blue">${historyStore.currentDetailSession.totalCredit[0].FinalTotal}</Tag></Descriptions.Item>}
                                    {historyStore.currentDetailSession.totalVnpay && <Descriptions.Item label="Total Vnpay"><Tag color="red">${historyStore.currentDetailSession.totalVnpay[0].FinalTotal}</Tag></Descriptions.Item>}
                                    <Descriptions.Item label="Current time"><Clock format={commonStore.hourMinusFormat} ticking={true} /></Descriptions.Item>
                                </Descriptions>
                            </Panel>
                        </Collapse>}
                    </PageHeader>
                </div >
                <Layout style={{ background: "linear-gradient(90deg, #fab91a 0, #ffd424 100%)" }} className="layout">
                    <Content style={{ padding: '0 1px' }}>
                        <div className="site-layout-content"><PosHistorySessionDetail props={props} /></div>
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
