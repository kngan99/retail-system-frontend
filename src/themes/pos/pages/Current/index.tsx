import { observer } from "mobx-react";
import React from "react";
import { CartStoreContext } from "../../stores/cart.store";
import { HistoryStoreContext } from "../../stores/history.store";
import { Layout, Menu, Breadcrumb, PageHeader, Button, Descriptions, Collapse } from 'antd';
import PosPage from '../Pos/PosPage';
import PosCurrentCashiersPage from '../PosCurrentCashiers/PosCurrentCashiers';
import "antd/dist/antd.css";
import '../../assets/style.css';
import Clock from 'react-live-clock';
import { CommonStoreContext } from '../../../../common/common.store';
import { AuthenticationStoreContext } from '../../../../modules/authenticate/authentication.store';
import { DEFAULT_ROUTERS } from '../../../../modules/account/router.enum';
import { useHistory } from 'react-router-dom';
import AdminWrapper from "../../../../modules/admin-account/components/AdminWrapper";
const { Header, Content, Footer } = Layout;
const { Panel } = Collapse;




const CurrentPage = () => {
    const history = useHistory();
    const authenticationStore = React.useContext(AuthenticationStoreContext);
    const commonStore = React.useContext(CommonStoreContext);
    const handleLogout = () => {
        authenticationStore.logout(history, DEFAULT_ROUTERS.LOGIN);
    };


    return (
        <>

            <AdminWrapper>
                <Layout className="layout">
                    <Content style={{ padding: '0 1px' }}>

                        <div className="site-layout-content"><PosCurrentCashiersPage></PosCurrentCashiersPage></div>
                    </Content>
                    <Footer style={{ textAlign: 'center' }}></Footer>
                </Layout>
                <br />
                <br />
                <br />
            </AdminWrapper>
        </>
    );
};

export default observer(CurrentPage);
