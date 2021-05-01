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
const { Header, Content, Footer } = Layout;
const { Panel } = Collapse;




const HistoryPage = (props) => {
    const history = useHistory();
    const authenticationStore = React.useContext(AuthenticationStoreContext);
    const commonStore = React.useContext(CommonStoreContext);
    const handleLogout = () => {
        authenticationStore.logout(history, DEFAULT_ROUTERS.LOGIN);
    };


    return (
        <>
            <AdminWrapper>
                <div style={{ background: "linear-gradient(90deg, #fab91a 0, #ffd424 100%)" }} className="site-page-header-ghost-wrapper">

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
