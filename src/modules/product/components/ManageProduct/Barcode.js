import React, { useState, useEffect, useRef } from "react";
import { Modal, Button, message } from "antd";
import { ProductStoreContext } from "../../product.store";
import { BarcodeOutlined } from "@ant-design/icons";
import BarcodeScannerComponent from "react-webcam-barcode-scanner";
import { toast } from "react-toastify";

const BarCode = (pros) => {
  const productStore = React.useContext(ProductStoreContext);

  const [visible, setVisible] = React.useState(false);
  const [flag, setFlag] = React.useState(true);
  const [confirmLoading, setConfirmLoading] = React.useState(false);
  const [data, setData] = React.useState("Not Found");

  const showModal = async (id) => {
    setVisible(true);
    setData("Not Found");
  };

  const handleCancel = () => {
    console.log("Clicked cancel button");
    setVisible(false);
  };

  return (
    <>
      <BarcodeOutlined
        onClick={async () => {
          await showModal(pros.record.Id);
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
                productStore.addBarcode(pros.record.Id, result.text);
                toast(`Added Barcode ${result.text}`);
                setVisible(false);
            }            
          }}
        />
        <p>{data}</p>
      </Modal>
    </>
  );
};

export default BarCode;
