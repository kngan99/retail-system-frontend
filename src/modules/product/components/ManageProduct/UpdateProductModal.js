import React, { useState } from "react";
// import { Button, Modal, Form, Input, Radio } from "antd";
// import CreateUserForm from "./CreateUserForm";
import "antd/dist/antd.css";
// import './style.css';
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
} from "antd";
import { ExclamationCircleOutlined, AudioOutlined, EditOutlined, EllipsisOutlined, SettingOutlined } from "@ant-design/icons";
import { ProductStoreContext } from "../../product.store";
import UploadAvatarDynamic from "./UploadAvatarDynamic";
import LazyLoad from 'react-lazyload'
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

const { Option } = Select;

const CollectionCreateForm = ({ visible, onCreate, onCancel, record, categories }) => {
    const [form] = Form.useForm();
    const [switchState, setSwitchState] = React.useState(record.Discontinued);
    const onFinish = (values) => {
        console.log("Received values of form: ", values);
    };
    function onChange(checked) {
        console.log(`switch to ${checked}`);
        setSwitchState(checked);
    }

    return (
        <Modal

            visible={visible}
            title="Update product"
            okText="Update"
            cancelText="Cancel"
            onCancel={onCancel}
            onOk={() => {
                form
                    .validateFields()
                    .then((values) => {
                        console.log("validate success")
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
                    Id: record.Id,
                    ProductName: record.ProductName,
                    CategoryId: record.CategoryId,
                    QuantityPerUnit: record.QuantityPerUnit,
                    UnitPrice: record.UnitPrice,
                    Discount: record.Discount,
                    UnitsInStock: record.UnitsInStock,
                    Quantity: record.StoreProducts[0].Quantity,
                    ReorderLevel: record.ReorderLevel,
                    Discontinued: record.Discontinued,
                    prefix: "86",
                }}
                scrollToFirstError
            >
                <Form.Item
                    name="Id"
                    label="Id"
                >
                    <InputNumber disabled={true} placeholder="Id" />
                </Form.Item>
                <Form.Item
                    name="ProductName"
                    label="Product Name"
                    rules={[
                        {
                            required: true,
                            message: 'Please input the product name!',
                        },
                    ]}
                    hasFeedback
                >
                    <Input disabled={true}/>
                </Form.Item>

                <Form.Item
                    name="CategoryId"
                    label="Category"
                    rules={[
                        {
                            required: true,
                        },
                    ]}
                >
                    <Select disabled={true}>
                        {categories.map(function (item) {
                            return (<Option value={item['Id']}>{item['CategoryName']}</Option>)
                        })}
                    </Select>
                </Form.Item>

                <Form.Item
                    name="QuantityPerUnit"
                    label="Quantity Per Unit"
                    rules={[
                        {
                            required: true,
                            message: 'This is a required field!',
                        },
                    ]}
                    hasFeedback
                >
                    <Input disabled={true}/>
                </Form.Item>

                <Form.Item
                    name="UnitPrice"
                    label="Unit Price"
                    rules={[
                        {
                            required: true,
                            message: 'This is a required field!',
                        },
                    ]}
                    hasFeedback
                >
                    <InputNumber disabled={true}/>
                </Form.Item>

                <Form.Item
                    name="Discount"
                    label="Discount"
                    rules={[
                        {
                            required: true,
                            message: 'This is a required field!',
                        },
                    ]}
                    hasFeedback
                >
                    <InputNumber disabled={true}/>
                </Form.Item>

                <Form.Item
                    name="UnitsInStock"
                    label="Units In Stock"
                    rules={[
                        {
                            required: true,
                            message: 'This is a required field!',
                        },
                    ]}
                    hasFeedback
                >
                    <InputNumber disabled={true}/>
                </Form.Item>

                <Form.Item
                    name="Quantity"
                    label="Quantity"
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


                <Form.Item
                    name="ReorderLevel"
                    label="Reorder Level"
                    rules={[
                        {
                            required: true,
                            message: 'This is a required field!',
                        },
                    ]}
                    hasFeedback
                >
                    <InputNumber disabled={true}/>
                </Form.Item>
            </Form>
        </Modal>
    );
};

const UpdateProductModal = (pros) => {
    const productStore = React.useContext(ProductStoreContext);
    console.log("now record")
    console.log(pros.record);
    if (!pros.record.PhotoURL) {
        pros.record["PhotoURL"] = "default.png";
    }
    console.log(pros.record);
    const [visible, setVisible] = useState(false);

    const onCreate = async (values) => {
        setVisible(false);
        console.log("Received values of form: ", values);
        await productStore.updateProducts(values.Id, values);
    };

    return (
        <div>
            <EditOutlined onClick={() => {
                setVisible(true);
            }} />
            <LazyLoad>
                <CollectionCreateForm
                    visible={visible}
                    onCreate={onCreate}
                    onCancel={() => {
                        setVisible(false);
                    }}
                    record={pros.record}
                    categories={productStore.categories}
                />
            </LazyLoad>
        </div>
    );
};

export default UpdateProductModal;
