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
} from "antd";
import { QuestionCircleOutlined } from "@ant-design/icons";
import { ProductStoreContext } from "../../product.store";
const { Option } = Select;
const AutoCompleteOption = AutoComplete.Option;

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

const CollectionCreateForm = ({ visible, onCreate, onCancel, categories }) => {
    const [form] = Form.useForm();
    const onFinish = (values) => {
        console.log("Received values of form: ", values);
    };
    const [switchState, setSwitchState] = React.useState(false);
    function onChange(checked) {
        console.log(`switch to ${checked}`);
        setSwitchState(checked);
    }

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
                initialValues={{
                    ProductName: "new product",
                    CategoryId: 1,
                    QuantityPerUnit: "1kg per item",
                    UnitPrice: 1,
                    UnitsInStock: 1,
                    ReorderLevel: 1,
                    Discount: 0,
                    Discontinued: false,
                    prefix: "86",
                }}
                scrollToFirstError
            >
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
                    <Input />
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
                    <Select defaultValue="1">
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
                    <Input />
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
                    <InputNumber />
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
                    <InputNumber />
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
                    <InputNumber />
                </Form.Item>

                <Form.Item name="Discontinued"
                    label="Discontinued">
                    <Switch
                        checkedChildren="Out Of Stock"
                        unCheckedChildren="In Stock"
                        checked={switchState}
                        onChange={onChange}
                    />
                </Form.Item>
            </Form>
        </Modal>
    );
};

const CreateProductModal = (pros) => {
    const productStore = React.useContext(ProductStoreContext);
    const [visible, setVisible] = useState(false);

    const onCreate = async (values) => {
        console.log("Received values of form: ", values);
        // insertUsersApi(values);
        await productStore.createProducts(values);
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
                Create New Product
      </Button>
            <CollectionCreateForm
                visible={visible}
                onCreate={onCreate}
                onCancel={() => {
                    setVisible(false);
                }}
                categories={productStore.categories}
            />
        </div >
    );
};

export default CreateProductModal;
