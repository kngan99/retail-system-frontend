import React from "react";
import { observer } from "mobx-react";
import AdminWrapper from "../../../admin-account/components/AdminWrapper";
import { useParams } from "react-router-dom";
import { StoreStoreContext } from "../../admin.store";
import { LatLng } from "leaflet";
import { Map, TileLayer, Popup, Marker } from "react-leaflet";
import Search from "react-leaflet-search";
import "./style.css";
import { Button, message, Row } from "antd";
import { Helmet } from "react-helmet";

const EditStoreAddressPage = () => {
  const storeStore = React.useContext(StoreStoreContext);
  const [chosenAddress, setChosenAddress] = React.useState();
  const [Lat, setLat] = React.useState();
  const [Lng, setLng] = React.useState();

  const customPopup = (SearchInfo) => {

    return (
      <Popup>
        <div>
          <p>Address Detail</p>
          <p>
            <span style={{ marginRight: "15px" }}>Lat</span>
            <span>
              {SearchInfo.latLng
                .toString()
                .split(",")[0]
                .replace("LatLng(", "")}
            </span>
            <br />
            <span style={{ marginRight: "10px" }}>Lng</span>
            <span>
              {SearchInfo.latLng.toString().split(",")[1].replace(")", "")}
            </span>
          </p>
          <p>
            Info from search: <span id={`Adrr`}>{SearchInfo.info}</span>
          </p>
          <p>
            {SearchInfo.raw &&
              SearchInfo.raw.place_id &&
              JSON.stringify(SearchInfo.raw.place_id)}
          </p>
        </div>
      </Popup>
    );
  };

  let storeID = window.location.pathname.split("/")[3];
  const [state, setState] = React.useState();
  const stateTest = {
    count: 0,
    search: new LatLng(41.009633, 28.965165),
    maxZoom: 13,
    maxBounds: [
      [-90, -180],
      [90, 180],
    ],
    bounds: [
      {
        lat: 33.100745405144245,
        lng: 24.510498046875,
      },
      {
        lat: 33.100745405144245,
        lng: 46.48315429687501,
      },
      {
        lat: 44.55916341529184,
        lng: 46.48315429687501,
      },
      {
        lat: 44.55916341529184,
        lng: 24.510498046875,
      },
    ],
  };

  const handleChangeAddress = async () => {
    const res = await storeStore.setAddress(
      storeID,
      chosenAddress,
      Lat,
      Lng
    );
    if (res) {
      message.success("Change adress successfully");
      window.location.href = window.location.pathname.replace(
        `edit-address/${storeID}`,
        "manage"
      );
    }
  };

  React.useEffect(() => {
    storeID = window.location.pathname.split("/")[3];
    const res = storeStore.getAccountById(storeID);
    setState({
      count: 0,
      search: new LatLng(10.762622, 106.660172),
      maxZoom: 13,
      maxBounds: [
        [-90, -180],
        [90, 180],
      ],
      // bounds: [
      //   {
      //     lat: 33.100745405144245,
      //     lng: 24.510498046875,
      //   },
      //   {
      //     lat: 33.100745405144245,
      //     lng: 46.48315429687501,
      //   },
      //   {
      //     lat: 44.55916341529184,
      //     lng: 46.48315429687501,
      //   },
      //   {
      //     lat: 44.55916341529184,
      //     lng: 24.510498046875,
      //   },
      // // ],
      // bounds: [
      //   {
      //     lat: 10.924067,
      //     lng: 106.713028,
      //   },
      //   {
      //     lat: 11.375031,
      //     lng: 106.131363,
      //   },
      //   {
      //     lat: 10.502307,
      //     lng: 107.169205,
      //   },
      //   {
      //     lat: 10.36291325,
      //     lng: 106.35919182006,
      //   },
      // ],
      bounds: [
        {
          lat: 10.36291325,
          lng: 106.131363,
        },
        {
          lat: 10.36291325,
          lng: 107.169205,
        },
        {
          lat: 11.375031,
          lng: 107.169205,
        },
        {
          lat: 11.375031,
          lng: 106.131363,
        },
      ],
    });
  }, []);

  return (
    <>
      <Helmet>
        <script
          type="text/javascript"
          src="https://cdn.jsdelivr.net/gh/kngan99/retail-system-frontend/src/modules/mapScript.js"
        ></script>
      </Helmet>
      <AdminWrapper pageTitle={"Edit store Address"}>
        <h6>Choosen Address</h6>
        <Row>
          <p>{chosenAddress}</p>
        </Row>
        <Row style={{marginBottom: "10px"}}>
          <Button onClick={handleChangeAddress}>Submit</Button>
        </Row>
        <Map
          className="simpleMap"
          scrollWheelZoom={true}
          bounds={stateTest.bounds}
          maxZoom={stateTest.maxZoom}
          maxBounds={stateTest.maxBounds}
        >
          <TileLayer
            noWrap={true}
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Search
            // customProvider={this.provider}
            //   onChange={(info) => {
            //     console.log("FROM onChange: ", info);
            //   }}
            position="topleft"
            inputPlaceholder="Custom placeholder"
            // search={this.state.search}
            showMarker={false}
            zoom={7}
            closeResultsOnClick={true}
            openSearchOnLoad={false}
            // these searchbounds would limit results to only Turkey.
            providerOptions={{
              searchBounds: [
                new LatLng(10.36291325, 107.169205),
                new LatLng(11.375031, 106.131363),
              ],
              region: "vn",
            }}

            // default provider OpenStreetMap
            // provider="BingMap"
            // providerKey="AhkdlcKxeOnNCJ1wRIPmrOXLxtEHDvuWUZhiT4GYfWgfxLthOYXs5lUMqWjQmc27"
          >
            {(info) => (
              <>
              <Marker position={info?.latLng}>{customPopup(info)}</Marker>
              <span>{setChosenAddress(info.info)}</span>
              <span>{setLat(parseFloat(info.latLng.lat))}</span>
              <span>{setLng(parseFloat(info.latLng.lng))}</span>
              </>
            )}
          </Search>
        </Map>
      </AdminWrapper>
    </>
  );
};

export default observer(EditStoreAddressPage);
