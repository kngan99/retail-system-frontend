import React from 'react';
import { observer } from 'mobx-react-lite';
import { Row, Col, Table } from 'react-bootstrap';
import { CommonStoreContext } from '../../../../common/common.store';

/*
 * Props of Component
 */
interface ComponentProps {
  orderData: any;
  createdByTitle?: any;
  createdByData?: any;
  notes?: any;
}

const SummaryOrderSection = (props: ComponentProps) => {
  const commonStore = React.useContext(CommonStoreContext);

  /*
   * Props of Component
   */
  const {
    orderData,
    createdByTitle,
    createdByData,
    notes,
  } = props;

  return (
    <>
      {orderData && orderData.Id && (
        <>
          <Col xs={12} className="block-item">
            <span className="block-label">{"Id"}</span>
            <span className="block-value">{orderData.Id}</span>
          </Col>
          <Col xs={12} className="block-item">
            <Row>
              <Col xs={12} xl={7}>
                <span className="block-label">
                  Test 1  (*)
                </span>
                <span className="block-value">
                  Test 1
                </span>
              </Col>
              {/*orderData.referenceNo && */(
                <Col xs={12} xl={5}>
                  <span className="block-label">
                    {'t(ORDER_SERVICETYPE_REFNUMBER)'}
                  </span>
                  <span className="block-value">{'orderData.referenceNo'}</span>
                </Col>
              )}
            </Row>
          </Col>
          {orderData.Notes && (
            <Col xs={12} className="block-item">
              <span className="block-label">{"Notes"}</span>
              <span className="block-value">{orderData.Notes}</span>
            </Col>
          )}
          {notes && (
            <Col xs={12} className="block-item">
              <span className="block-label">{"Notes Pass through component"}</span>
              <span className="block-value">{notes}</span>
            </Col>
          )}
          {createdByTitle === "Created By" &&
            createdByData && (
              <>
                <Col xs={12} className="block-item">
                  <h3 className="block-title">
                    {createdByTitle
                      ? createdByTitle
                      : "Created By"}
                  </h3>
                  <span className="block-label">
                    {"Email"}
                  </span>
                  <span className="block-value">{createdByData.Email}</span>
                </Col>
                {createdByData.FName && (
                  <Col xs={12} className="block-item">
                    <span className="block-label">
                      {"Name"}
                    </span>
                    <span className="block-value">
                      {createdByData.FName} {createdByData.LName}
                    </span>
                  </Col>
                )}
                {createdByData.Homephone && (
                  <Col xs={12} className="block-item">
                    <span className="block-label">
                      {"Homephone"}
                    </span>
                    <span className="block-value">
                      {createdByData.Homephone}
                    </span>
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
