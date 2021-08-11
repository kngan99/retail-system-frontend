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
import { ProdPromotionStoreContext } from "../stores/prodpromotion.store";
const { Option } = Select;
const AutoCompleteOption = AutoComplete.Option;


const { RangePicker } = DatePicker;
const dateFormat = 'YYYY-MM-DD h:mm:ss';

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

const CollectionCreateForm = ({ visible, onCreate, onCancel, record, products }) => {
    const [form] = Form.useForm();
    const onFinish = (values) => {
        console.log("Received values of form: ", values);
    };

    return (
        <Modal
            style={{ "border-radius": "25px" }}
            visible={visible}
            title={"Update coupon: " + record.productdiscounts_Coupon}
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
                    ProductId: record.products_Id,
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
                        defaultValue={[moment(record.promotions_StartTime, dateFormat), moment(record.promotions_EndTime, dateFormat)]}
                        showTime format={dateFormat} />
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
                    name="ProductId"
                    label="Product"
                    rules={[
                        {
                            required: true,
                        },
                    ]}
                >
                    <Select>
                        {products.map(function (item) {
                            return (<Option value={item['Id']}>{item['ProductName']}</Option>)
                        })}
                    </Select>
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

const CreateProdPromotionModal = (pros) => {
    const prodpromotionStore = React.useContext(ProdPromotionStoreContext);
    const [visible, setVisible] = useState(false);

    const onCreate = async (values) => {
        console.log("Received values of form: ", { ...values, Coupon: pros.record.productdiscounts_Coupon, StartTime: new Date(values.ValidTime[0]), EndTime: new Date(values.ValidTime[1]) });
        await prodpromotionStore.updatePromotion(pros.record.productdiscounts_Coupon, { ...values, StartTime: new Date(values.ValidTime[0]), EndTime: new Date(values.ValidTime[1]) })
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
                products={prodpromotionStore.products}
            />
        </div >
    );
};

export default CreateProdPromotionModal;
