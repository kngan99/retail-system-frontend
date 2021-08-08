import React from "react";
import { observer } from "mobx-react-lite";
import { Row, Col, Table, Button } from "react-bootstrap";
import { CommonStoreContext } from "../../../../common/common.store";
import ProductSummary from "../ProductSummary";
import { EMAIL_RULE } from "../../../../common/constants/rules.constants";
import ReturnedProductSummary from "../ReturnedProductSummary";

/*
 * Props of Component
 */
interface ComponentProps {
  orderData: any;
  createdByTitle?: any;
  createdByData?: any;
  notes?: any;
  storeInfo?: any;
  toStoreData?: any;
}

const ReturnedSummaryOrderSection = (props: ComponentProps) => {
  const commonStore = React.useContext(CommonStoreContext);

  /*
   * Props of Component
   */
  const {
    orderData,
    createdByTitle,
    createdByData,
    notes,
    storeInfo,
    toStoreData,
  } = props;

  return (
    <>
      {orderData && orderData.Id && (
        <>
          <Col xs={12} className="block-item">
            <h3 className="block-title">Products</h3>
            <ReturnedProductSummary
              productsData={orderData.products}
              quantities={orderData.quantities}
              returned={orderData.returned}
            ></ReturnedProductSummary>
          </Col>
          {createdByTitle === "Created By" && createdByData && (
            <>
              <Col xs={12} className="block-item">
                <h3 className="block-title">
                  {createdByTitle ? createdByTitle : "Created By"}
                </h3>
                <span className="block-label">{"Email"}</span>
                <span className="block-value">{createdByData.Email}</span>
              </Col>
              {createdByData.FName && (
                <Col xs={12} className="block-item">
                  <span className="block-label">{"Name"}</span>
                  <span className="block-value">
                    {createdByData.FName} {createdByData.LName}
                  </span>
                </Col>
              )}
              {createdByData.Homephone && (
                <Col xs={12} className="block-item">
                  <span className="block-label">{"Homephone"}</span>
                  <span className="block-value">{createdByData.Homephone}</span>
                </Col>
              )}
            </>
          )}
        </>
      )}
    </>
  );
};

export default observer(ReturnedSummaryOrderSection);
