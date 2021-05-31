import React from 'react';
import { observer } from 'mobx-react-lite';
import { Row, Col } from 'react-bootstrap';
import ReactHtmlParser from 'react-html-parser';

/*
 * Props of Component
 */
interface ComponentProps {
  style?: React.CSSProperties;
  className?: string;
  children?: React.ReactNode;
  orderStatus: string;
  verifiedDelivery?: boolean;
  verifiedPickup?: boolean;
}

// React.useEffect(() => {
//   console.log(orderStatus);
// }, [orderStatus]);

const OrderStatus = [
  {
    key: "Created",
    label: "Created",
  },
  {
    key: "Verified",
    label: "Verified",
  },
  {
    key: "Assigned",
    label: "Assigned",
  },
  {
    key: "Accepted",
    label: "Accepted",
  },
  {
    key: "Preparing",
    label: "Preparing",
  },
  {
    key: "Delivering",
    label: "Delivering",
  },
  {
    key: "Success",
    label: "Success",
  },
  {
    key: "Canceled",
    label: "Canceled",
  },
];

const isActiveOrderStatus = (status: any, currentStatus: any) => {
  return getIndexOfOrderStatus(status) <= getIndexOfOrderStatus(currentStatus);
};

const getIndexOfOrderStatus = (status: any) => {
  let idx = -1;
  OrderStatus.forEach((data, index) => {
    if (data.key === status) {
      idx = index;
    }
  });
  return idx;
};

const ProgressOrder = (props: ComponentProps) => {
  /*
   * Props of Component
   */
  const {
    style,
    className,
    children,
    orderStatus,
  } = props;

  return (
    <>
      <Row
        className={`block-progress ${className ? className : ''}`}
        style={style}
      >
        <Col
          xs={12}
          sm={6}
          md={4}
          xl={3}
          className={`item ${
            isActiveOrderStatus("Created", orderStatus)
              ? 'active'
              : ''
          }`}
        >
          <span className="item-icon">
            <i className="ico ico-noti-order"></i>
          </span>
          <span className="item-value">{"Created"}</span>
        </Col>
        <Col
          xs={12}
          sm={6}
          md={4}
          xl={3}
          className={`item ${
            isActiveOrderStatus("Verified", orderStatus)
              ? 'active'
              : ''
          }`}
        >
          <span className="item-icon">
            <i className="ico ico-find-driver"></i>
          </span>
          <span className="item-value">{"Verified"}</span>
        </Col>
        <Col
          xs={12}
          sm={6}
          md={4}
          xl={3}
          className={`item ${
            isActiveOrderStatus("Assigned", orderStatus)
              ? 'active'
              : ''
          }`}
        >
          <span className="item-icon">
            <i className="ico ico-o-dispatched"></i>
          </span>
          <span className="item-value">{"Assigned"}</span>
        </Col>
        <Col
          xs={12}
          sm={6}
          md={4}
          xl={3}
          className={`item ${
            isActiveOrderStatus("Accepted", orderStatus)
              ? 'active'
              : ''
          }`}
        >
          <span className="item-icon">
            <i className="ico ico-o-arrive-pickup"></i>
          </span>
          <span className="item-value">{"Accepted"}</span>
        </Col>
        <Col
          xs={12}
          sm={6}
          md={4}
          xl={3}
        >
          <span className="item-icon">
            <i className="ico ico-pickup"></i>
          </span>
          <span className="item-value">
            {ReactHtmlParser("Preparing")}
          </span>
        </Col>
        <Col
          xs={12}
          sm={6}
          md={4}
          xl={3}
          className={`item ${
            isActiveOrderStatus("Delivering", orderStatus)
              ? 'active'
              : ''
          }`}
        >
          <span className="item-icon">
            <i className="ico ico-start-delivering"></i>
          </span>
          <span className="item-value">{"Delivering"}</span>
        </Col>
        <Col
          xs={12}
          sm={6}
          md={4}
          xl={3}
          className={`item ${
            isActiveOrderStatus("Success", orderStatus)
              ? 'active'
              : ''
          }`}
        >
          <span className="item-icon">
            <i className="ico ico-delivered"></i>
          </span>
          <span className="item-value">{"Success"}</span>
        </Col>
      </Row>
      {children}
    </>
  );
};

export default observer(ProgressOrder);
