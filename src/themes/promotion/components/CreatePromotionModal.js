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
import { QuestionCircleOutlined } from "@ant-design/icons";
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

const CollectionCreateForm = ({ visible, onCreate, onCancel }) => {
    const [form] = Form.useForm();
    const onFinish = (values) => {
        console.log("Received values of form: ", values);
    };

    return (
        <Modal
            style={{ "border-radius": "25px" }}
            visible={visible}
            title="Create a new collection"
            okText="Create"
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
                // initialValues={{
                //     Discription: "T",
                //     CategoryId: 1,
                //     QuantityPerUnit: "1kg per item",
                //     UnitPrice: 1,
                //     UnitsInStock: 1,
                //     ReorderLevel: 1,
                //     Discount: 0,
                //     Discontinued: false,
                //     prefix: "86",
                // }}
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
                    <RangePicker showTime />
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
        await promotionStore.createPromotion({ ...values, StartTime: new Date(values.ValidTime[0]), EndTime: new Date(values.ValidTime[1]) })
        // insertUsersApi(values);
        // await productStore.createProducts(values);
        setVisible(false);
    };

    return (
        <div>
            <Button
                type="primary"
                style={{ background: "#fab91a", border: "none", "border-radius": "10px" }}
                className="p-2 h-100"
                onClick={() => {
                    setVisible(true);
                }}
            >
                Create New Promotion
      </Button>
            <CollectionCreateForm
                visible={visible}
                onCreate={onCreate}
                onCancel={() => {
                    setVisible(false);
                }}
            />
        </div >
    );
};

export default CreatePromotionModal;
