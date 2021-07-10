import React, { useState, useEffect, useRef } from "react";
import { Modal, Button, message } from "antd";
import { BarcodeOutlined } from "@ant-design/icons";
import BarcodeScannerComponent from "react-webcam-barcode-scanner";
import { CartStoreContext } from "../stores/cart.store";

const BarCodePos = (pros) => {
  const cartStore = React.useContext(CartStoreContext);
  const [visible, setVisible] = React.useState(false);
  const [flag, setFlag] = React.useState(true);
  const [confirmLoading, setConfirmLoading] = React.useState(false);
  const [data, setData] = React.useState("Not Found");

  const showModal = async () => {
    setVisible(true);
    setData("Not Found");
  };

  const handleCancel = () => {
    console.log("Clicked cancel button");
    setVisible(false);
  };

  const addProduct = (barcode) => {
    setTimeout(function () {
      cartStore.addToCartByBarcode((barcode));
    }, 500);
  }

  return (
    <>
      <BarcodeOutlined
        onClick={async () => {
          await showModal();
        }}
      />
      <Modal
        title="Title"
        visible={visible}
        confirmLoading={confirmLoading}
        onOk={handleCancel}
        onCancel={handleCancel}
        width={500}
      >
        <BarcodeScannerComponent
          width={400}
          height={400}
          onUpdate={(err, result) => {
            if (result && result !== "Not Found" && flag) {
                setFlag(false);
                setData(result.text);
                addProduct(result.text);
                setTimeout(function () {
                message.info(`Barcode ${result.text}`);
                  result.text = "Not Found";
                }, 2000);
                //setVisible(false);
            }            
          }}
        />
        <p>{data}</p>
      </Modal>
    </>
  );
};

export default BarCodePos;
