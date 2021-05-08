import React, { useState, useEffect, useRef } from 'react';
import { Line } from '@ant-design/charts';
import { Modal, Button } from 'antd';
import { ProductStoreContext } from "../../product.store";

const App = (pros) => {
    const productStore = React.useContext(ProductStoreContext);

    const [visible, setVisible] = React.useState(false);
    const [confirmLoading, setConfirmLoading] = React.useState(false);
    const [modalData, setModalData] = React.useState(undefined);
    const [config, setConfig] = React.useState(undefined);

    const showModal = async (id) => {
        await productStore.getProductForecast(id);
        console.log(productStore.salesForecast);
        setModalData(productStore.salesForecast);
        setConfig({
            data: productStore.salesForecast,
            height: 400,
            xField: 'year',
            yField: 'value',
            point: {
                size: 5,
                shape: 'diamond',
            },
        })
        setVisible(true);
    };

    const data = [
        {
            year: '1991',
            value: 3,
        },
        {
            year: '1992',
            value: 4,
        },
        {
            year: '1993',
            value: 3.5,
        },
        {
            year: '1994',
            value: 5,
        },
        {
            year: '1995',
            value: 4.9,
        },
        {
            year: '1996',
            value: 6,
        },
        {
            year: '1997',
            value: 7,
        },
        {
            year: '1998',
            value: 9,
        },
        {
            year: '1999',
            value: 13,
        },
    ];

    const handleOk = () => {
        setConfirmLoading(true);
        setTimeout(() => {
            setVisible(false);
            setConfirmLoading(false);
        }, 2000);
    };

    const handleCancel = () => {
        console.log('Clicked cancel button');
        setVisible(false);
    };

    return (
        <>
            <Button type="primary" onClick={async () => { await showModal(pros.record.Id) }}>
                Open Modal with async logic
      </Button>
            <Modal
                title="Title"
                visible={visible}
                onOk={handleOk}
                confirmLoading={confirmLoading}
                onCancel={handleCancel}
                width={1000}
            >
                {modalData && <Line {...config} />}
            </Modal>
        </>
    );
};

export default App;
