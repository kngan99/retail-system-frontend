import React from "react";
import { observer } from "mobx-react-lite";
import { Row, Col, Table } from "react-bootstrap";
import { CommonStoreContext } from "../../../../common/common.store";
import ProductSummary from "../ProductSummary";
import { EMAIL_RULE } from '../../../../common/constants/rules.constants';

/*
 * Props of Component
 */
interface ComponentProps {
  orderData: any;
  createdByTitle?: any;
  createdByData?: any;
  notes?: any;
  storeInfo?: any;
}

const SummaryOrderSection = (props: ComponentProps) => {
  const commonStore = React.useContext(CommonStoreContext);

  /*
   * Props of Component
   */
  const { orderData, createdByTitle, createdByData, notes, storeInfo } = props;

  return (
    <>
      {orderData && orderData.Id && (
        <>
          <Col xs={12} className="block-item">
            <span className="block-label">{"Id"}</span>
            <span className="block-value">{orderData.Id}</span>
          </Col>
          <Col xs={12} xl={12} className="block-item">
            <span className="block-label">To Warehouse </span>
            <span className="block-value">{`${orderData.Warehouse.ShortName} -  ${orderData.Warehouse.Phone}`}</span>
          </Col>
          <Col xs={12} xl={12} className="block-item">
            <span className="block-label">Warehouse address</span>
            <span className="block-value">{orderData.Warehouse.Address}</span>
          </Col>
          <Col xs={12} xl={12} className="block-item">
            <span className="block-label">Warehouse email</span>
            <span className="block-value">{orderData.Warehouse.Email}</span>
          </Col>
          <Col xs={12} className="block-item">
            <span className="block-label">{"From Store"}</span>
            <span className="block-value">{`${orderData.Store.ShortName} -  ${orderData.Store.Phone}`}</span>
          </Col>
          <Col xs={12} className="block-item">
            <span className="block-label">{"Store Address"}</span>
            <span className="block-value">{orderData.Store.Address}</span>
          </Col>
          <Col xs={12} className="block-item">
            <span className="block-label">{"Store Email"}</span>
            <span className="block-value">{orderData.Store.Email}</span>
          </Col>
          {
            <Col xs={12} className="block-item">
              <span className="block-label">{"Notes"}</span>
              <span className="block-value">
                {orderData.Notes ? orderData.Notes : "-"}
              </span>
            </Col>
          }
          {notes && (
            <Col xs={12} className="block-item">
              <span className="block-label">
                {"Notes Pass through component"}
              </span>
              <span className="block-value">{notes}</span>
            </Col>
          )}
          <Col xs={12} className="block-item">
            <h3 className="block-title">Products</h3>
            <ProductSummary
              productsData={orderData.products}
              quantities={orderData.quantities}
            ></ProductSummary>
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

export default observer(SummaryOrderSection);
