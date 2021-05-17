import React, { useState } from "react";
// import { Button, Modal, Form, Input, Radio } from "antd";
// import { insertUsersApi } from "../../api/user";
// import CreateUserForm from "./CreateUserForm";
import "antd/dist/antd.css";
import './style.css';
import {
    Form,
    Input,
    Tooltip,
    Cascader,
    Select,
    Row,
    Col,
    Checkbox,
    Button,
    AutoComplete,
    Radio,
    Modal,
    InputNumber,
    Switch,
    DatePicker, Space
} from "antd";
import moment from 'moment';
import { QuestionCircleOutlined, EditOutlined } from "@ant-design/icons";
import { PromotionStoreContext } from "../stores/promotion.store";
const { Option } = Select;
const AutoCompleteOption = AutoComplete.Option;


const { RangePicker } = DatePicker;

const roles = [
    {
        value: "admin",
        label: "admin",
    },
    {
        value: "normal-user",
        label: "normal-user",
    },
    {
        value: "contact-point",
        label: "contact-point",
    },
    {
        value: "dc-member",
        label: "dc-member",
    },
];
const formItemLayout = {
    labelCol: {
        xs: {
            span: 24,
        },
        sm: {
            span: 8,
        },
    },
    wrapperCol: {
        xs: {
            span: 24,
        },
        sm: {
            span: 16,
        },
    },
};

const CollectionCreateForm = ({ visible, onCreate, onCancel, record }) => {
    const [form] = Form.useForm();
    const onFinish = (values) => {
        console.log("Received values of form: ", values);
    };

    return (
        <Modal
            style={{ "border-radius": "25px" }}
            visible={visible}
            title={"Update coupon: " + record.orderdiscounts_Coupon}
            okText="Update"
            cancelText="Cancel"
            onCancel={onCancel}
            onOk={() => {
                form
                    .validateFields()
                    .then((values) => {
                        form.resetFields();
                        onCreate(values);
                    })
                    .catch((info) => {
                        console.log("Validate Failed:", info);
                    });
            }}
        >
            <Form
                {...formItemLayout}
                form={form}
                name="register"
                onFinish={onFinish}
                initialValues={{
                    Description: record.promotions_Description,
                    MinBill: record.orderdiscounts_MinBill,
                    MaxDiscount: record.orderdiscounts_MaxDiscount,
                    PercentOff: record.promotions_PercentOff,
                    prefix: "86",
                }}
                scrollToFirstError
            >

                <Form.Item
                    name="ValidTime"
                    label="Valid Time"
                    rules={[
                        {
                            required: true,
                        },
                    ]}
                >
                    <RangePicker
                        defaultValue={[moment(record.promotions_StartTime), moment(record.promotions_EndTime)]}
                        showTime />
                </Form.Item>

                <Form.Item
                    name="Description"
                    label="Description"
                    rules={[
                        {
                            required: true,
                            message: 'This is a required field!',
                        },
                    ]}
                    hasFeedback
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    name="MinBill"
                    label="MinBill"
                    rules={[
                        {
                            required: true,
                            message: 'Please input the minimum total of order!',
                        },
                    ]}
                    hasFeedback
                >
                    <InputNumber />
                </Form.Item>

                <Form.Item
                    name="MaxDiscount"
                    label="MaxDiscount"
                    rules={[
                        {
                            required: true,
                            message: 'Please input the max discount of order!',
                        },
                    ]}
                    hasFeedback
                >
                    <InputNumber />
                </Form.Item>

                <Form.Item
                    name="PercentOff"
                    label="Percent Off (%)"
                    rules={[
                        {
                            required: true,
                            message: 'This is a required field!',
                        },
                    ]}
                    hasFeedback
                >
                    <InputNumber />
                </Form.Item>

            </Form>
        </Modal>
    );
};

const CreatePromotionModal = (pros) => {
    const promotionStore = React.useContext(PromotionStoreContext);
    const [visible, setVisible] = useState(false);

    const onCreate = async (values) => {
        console.log("Received values of form: ", values);
        // insertUsersApi(values);
        // await productStore.createProducts(values);
        setVisible(false);
    };

    return (
        <div>
            <EditOutlined onClick={() => {
                setVisible(true);
            }} />
            <CollectionCreateForm
                visible={visible}
                onCreate={onCreate}
                onCancel={() => {
                    setVisible(false);
                }}
                record={pros.record}
            />
        </div >
    );
};

export default CreatePromotionModal;
