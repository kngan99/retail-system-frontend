import React from 'react';
import { observer } from 'mobx-react-lite';
import { Container, Row, Col } from 'react-bootstrap';
import ProgressOrder from '../Progress';
import GoogleMap from '../GoogleMap';
import { getDistance } from '../../../../common/utils/mapCalculate.ulti';

/*
 * Props of Component
 */
interface ComponentProps {
  style?: React.CSSProperties;
  className?: string;
  children?: React.ReactNode;
  title?: string;
  selectedOrder?: any;
  markers?: any;
  id?: string;
}

const TrackingOrder = (props: ComponentProps) => {
  /*
   * Props of Component
   */
  const {
    style,
    className,
    children,
    title,
    selectedOrder,
    markers,
    id,
  } = props;



  return (
    <>
      <Container
        className={`tracking-wrapper ${className ? className : ''}`}
        fluid
        id={id}
      >
        <Row className="block-tracking" style={style}>
          <Col xs={12} className="block-content">
            <h3 className="block-title">
              {title ? title : 'Tracking'}
            </h3>
            <Row>
              <Col xs={12} md={4} className="item">
                <span className="item-label">{"Id"}</span>
                <span className="item-value">
                  {selectedOrder?.orderId ?? ''}
                </span>
              </Col>
              <Col xs={12} md={4} className="item">
                <span className="item-label">{"Distance"}</span>
                <span className="item-value">
                  {markers[2]
                    ? getDistance(markers[1], markers[0]).toString() + ' km'
                    : '0 km'}
                </span>
              </Col>
            </Row>
          </Col>
          <Col xs={12} className="block-map">
            <GoogleMap markers={markers} />
          </Col>
        </Row>
        {selectedOrder?.status === "Cancel" ? (
          <ProgressOrder
            orderStatus={selectedOrder?.beforeCancel ?? ''}
            verifiedDelivery={selectedOrder?.verifiedDelivery ?? false}
            verifiedPickup={selectedOrder?.verifiedPickup ?? false}
          />
        ) : (
          <ProgressOrder
            orderStatus={selectedOrder?.status ?? ''}
            verifiedDelivery={selectedOrder?.verifiedDelivery ?? false}
            verifiedPickup={selectedOrder?.verifiedPickup ?? false}
          />
        )}
        {children}
      </Container>
    </>
  );
};

export default observer(TrackingOrder);
