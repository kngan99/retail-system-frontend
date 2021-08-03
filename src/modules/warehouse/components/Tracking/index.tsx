import React from "react";
import { observer } from "mobx-react-lite";
import { Container, Row, Col } from "react-bootstrap";
import ProgressOrder from "../Progress";
import GoogleMap from "../GoogleMap";
import { getDistance } from "../../../../common/utils/mapCalculate.ulti";
import { Map, TileLayer, Marker, Popup } from "react-leaflet";
import { LatLng } from "leaflet";
import "./style.css";
// import 'leaflet/dist/leaflet.css';
// import {Helmet} from "react-helmet";

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
  const { style, className, children, title, selectedOrder, markers, id } =
    props;

  const position = new LatLng(10.82302, 106.62965);

  const positionWH = markers[0]
    ? new LatLng(markers[0].lat, markers[0].lng)
    : new LatLng(10.82302, 106.62965);
  const positionStore = markers[1]
    ? new LatLng(markers[1]?.lat, markers[1]?.lng)
    : new LatLng(10.82302, 106.62965);

  return (
    <>
      <Container
        className={`tracking-wrapper ${className ? className : ""}`}
        fluid
        id={id}
      >
        <Row className="block-tracking" style={style}>
          <Col xs={12} className="block-content">
            <h3 className="block-title">{title ? title : "Places On Map"}</h3>
            <Row>
              {id && (
                <Col xs={12} md={4} className="item">
                  <span className="item-label">{"Id"}</span>
                  <span className="item-value">{selectedOrder?.Id}</span>
                </Col>
              )}
              {/* <Col xs={12} md={4} className="item">
                <span className="item-label">{"Distance"}</span>
                <span className="item-value">
                  {markers[2]
                    ? getDistance(markers[1], markers[0]).toString() + ' km'
                    : '0 km'}
                </span>
              </Col> */}
            </Row>
          </Col>
          <Col xs={12} className="block-map">
            <Map center={position} zoom={13} scrollWheelZoom={false}>
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              {positionWH && (
                <Marker position={positionWH}>
                  markers[0] &&
                  <Popup>
                    {markers[0]?.addr ? markers[0]?.addr : "Warehouse"}
                  </Popup>
                </Marker>
              )}
              {positionStore && (
                <Marker position={positionStore}>
                  markers[1] &&
                  <Popup>{markers[1]?.addr ? markers[1]?.addr : "Store"}</Popup>
                </Marker>
              )}
            </Map>
          </Col>
        </Row>
        {/* {selectedOrder?.status === "Cancel" ? (
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
        )} */}
        {children}
      </Container>
    </>
  );
};

export default observer(TrackingOrder);
