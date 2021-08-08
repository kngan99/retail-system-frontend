import React from 'react';
import { observer } from 'mobx-react-lite';
import { Button, Col, Row, Container } from 'react-bootstrap';
import SummaryOrderSection from '../SummaryOrderSection';
import ReturnedSummaryOrderSection from '../ReturnedSummaryOrderSection';

/*
 * Props of Component
 */
interface ComponentProps {
  style?: React.CSSProperties;
  className?: string;
  children?: React.ReactNode;
  title: string;
  handleClose: any;
  orderItem?: any;
  createdByTitle?: any;
  createdByData?: any;
  id?: string;
  notes?: any;
  storeInfo?: any;
  toStoreData?: any;
}

const ReturnedSummaryOrder = (props: ComponentProps) => {
  /*
   * Props of Component
   */
  const {
    style,
    className,
    children,
    title,
    createdByTitle,
    handleClose,
    orderItem,
    toStoreData,
    createdByData,
    id,
    notes,
    storeInfo,
  } = props;


  return (
    <>
      <Container
        fluid
        className={`block-orders block-summary-order ${
          className ? className : ''
        }`}
        style={style}
        id={id}
      >
        <Row>
          <Col xs={12}>
            <Container
              className={`block order-summary-item ${
                className ? className : ''
              }`}
              fluid
            >
              <h3 className="block-title">
                {title ? title : "Summary"}
              </h3>
              <Button className="btn-icon" onClick={handleClose}>
                <i className="ico ico-o-close"></i>
              </Button>
              <Row>
                <ReturnedSummaryOrderSection
                  orderData={orderItem}
                  storeInfo={storeInfo}
                  createdByTitle={createdByTitle}
                  createdByData={createdByData}
                  notes={notes}
                  toStoreData={toStoreData}
                />
              </Row>
              {children}
            </Container>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default observer(ReturnedSummaryOrder);
