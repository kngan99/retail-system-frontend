import React, { Suspense } from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import AccountLayout from "./themes/account/layout";
import "./themes/style.scss";
import { cssTransition, ToastContainer } from "react-toastify";

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
      <Suspense fallback={<div>Loading... </div>}>
        <Switch>
          <Route
            path="/account"
            render={(props: any) => <AccountLayout {...props} exact />}
          />
          <Route path="/" render={(props: any) => <AccountLayout {...props} exact />} />
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
