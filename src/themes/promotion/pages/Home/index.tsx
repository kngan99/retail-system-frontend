import { observer } from "mobx-react";
import React from "react";
import { PromotionStoreContext } from "../../stores/promotion.store";
import { Row, Modal, Col, Button, Pagination, Table, Tag, Radio, Space, Tabs, Card, Skeleton, Avatar, List, Spin } from 'antd';
import { ExclamationCircleOutlined, AudioOutlined, EditOutlined, EllipsisOutlined, SettingOutlined, DeleteOutlined } from "@ant-design/icons";
import { ColumnsType } from "antd/es/table";
import "antd/dist/antd.css";
import UpdateProductModal from "../../../../modules/product/components/ManageProduct/UpdateProductModal";
import CreateProductModal from "../../../../modules/product/components/ManageProduct/CreateProductModal";
import CreatePromotionModal from "../../components/CreatePromotionModal";
import { makeAutoObservable, autorun, observable } from "mobx"
import App from "../../../../modules/product/components/ManageProduct/SalesAnalysis";
import UpdatePromotionModal from "../../components/UpdatePromotionModal";

interface Promotion {
  orderdiscounts_Coupon: number;
  orderdiscounts_MinBill: number;
  orderdiscounts_MaxDiscount: number;
  promotion_Coupon: number;
  promotion_StartTime: Date;
  promotion_EndTime: Date;
  promotion_Description: string;
  promotion_PercentOff: number;
}

const { confirm } = Modal;



const HomePage = () => {
  const promotionStore = React.useContext(PromotionStoreContext);
  React.useEffect(() => {
    promotionStore.getPromotions();
  }, []);



  const showTotal = (total: number) => {
    return `Total ${total} items`;
  }

  const onChange = async (pageNumber: number, pageSize: any) => {
    if (pageNumber == 0 || pageSize != promotionStore.pageSize) pageNumber = 1;
    await promotionStore.changePage(pageNumber, pageSize);
  }

  // const showPromiseConfirm = async (row: any) => {
  //   confirm({
  //     title: "Do you want to delete  " + row.ProductName,
  //     icon: <ExclamationCircleOutlined />,
  //     content: "Warning: The delete product cannot be recover",
  //     async onOk() {
  //       await productStore.deleteProduct(row.Id);
  //     },
  //     onCancel() { },
  //   });
  // }

  const columns: ColumnsType<Promotion> = [
    {
      title: "Coupon",
      dataIndex: "orderdiscounts_Coupon",
      sorter: false,
    },
    {
      title: "MinBill",
      dataIndex: "orderdiscounts_MinBill",
      sorter: false,
    },
    {
      title: "MaxDiscount",
      dataIndex: "orderdiscounts_MaxDiscount",
      sorter: false,
    },
    {
      title: "StartTime",
      dataIndex: "promotions_StartTime",
      sorter: false,
      render: (text, row, index) => {
        return <span>{new Date(text).toLocaleString()}</span>
      }
    },
    {
      title: "EndTime",
      dataIndex: "promotions_EndTime",
      sorter: false,
      render: (text, row, index) => {
        return <span>{new Date(text).toLocaleString()}</span>
      }
    },
    {
      title: "Discription",
      dataIndex: "promotions_Description",
      sorter: false,
    },
    {
      title: "PercentOff",
      dataIndex: "promotions_PercentOff",
      sorter: false,
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          {localStorage.getItem('role') === 'StoresManager' && <UpdatePromotionModal record={record} />}
        </Space>
      ),
    },
  ];

  const callback = (key: any) => {
    console.log(key);
  }

  const { TabPane } = Tabs;
  const { Meta } = Card;
  const gridStyle = {
    width: '50%',
    border: "none",
  };


  return (
    <>
      <div style={{ background: "white" }}>
        {localStorage.getItem('role') === 'StoresManager' && <br />}
        {localStorage.getItem('role') === 'StoresManager' && <CreatePromotionModal />}
        {localStorage.getItem('role') === 'StoresManager' && <br />}
        <Spin spinning={promotionStore.loading}>
          <Table<Promotion> columns={columns} dataSource={promotionStore.promotions} rowKey={(record) => record.orderdiscounts_Coupon} pagination={false} />
        </Spin>
        <br />
        <Row>
          <Col span={18} offset={6}>
            <Pagination
              showQuickJumper
              defaultCurrent={1}
              total={promotionStore.totalCount}
              showTotal={showTotal}
              defaultPageSize={10}
              onChange={onChange}
            />
          </Col>
        </Row>
      </div>
    </>
  );
};

export default observer(HomePage);
