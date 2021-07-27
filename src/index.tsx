import React, { Suspense } from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import AccountLayout from "./themes/account/layout";
import ProductLayout from "./themes/product/layout";
import POSLayout from "./themes/pos/layout"
import PromotionLayout from "./themes/promotion/layout"
import "./themes/style.scss";
import { cssTransition, ToastContainer } from "react-toastify";
import { Spin } from 'antd';
import WarehouseLayout from "./themes/warehouse/layout";
import StoreLayout from "./themes/store/layout";
import OperationLayout from "./themes/operation/layout";
import { WaveLoading } from 'react-loadingg';

const Zoom = cssTransition({
  enter: 'zoomIn',
  exit: 'zoomOut',
  // appendPosition: false,
  // collapse: true,
  // collapseDuration: 300,
});

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <Suspense fallback={<div><WaveLoading style={{color: 'white'}}/></div>}>
        <Switch>
          <Route
            path="/account"
            render={(props: any) => <AccountLayout {...props} exact />}
          />
          <Route
            path="/product"
            render={(props: any) => <ProductLayout {...props} exact />}
          />
          <Route
            path="/pos"
            render={(props: any) => <POSLayout {...props} exact />}
          />
          <Route
            path="/promotion"
            render={(props: any) => <PromotionLayout {...props} exact />}
          />
            <Route
            path="/warehouse"
            render={(props: any) => <WarehouseLayout {...props} exact />}
          />
          <Route
            path="/store"
            render={(props: any) => <StoreLayout {...props} exact />}
          />
          <Route
            path="/operation"
            render={(props: any) => <OperationLayout {...props} exact />}
          />
          <Route path="/" render={(props: any) => <App />} />
        </Switch>
      </Suspense>
      <ToastContainer
        autoClose={2000}
        position={'top-center'}
        hideProgressBar={false}
        transition={Zoom}
        pauseOnHover={true}
        closeOnClick={true}
        rtl={false}
      />
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
