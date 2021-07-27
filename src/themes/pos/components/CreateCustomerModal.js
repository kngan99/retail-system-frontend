import React, { useState } from "react";
// import { Button, Modal, Form, Input, Radio } from "antd";
// import { insertUsersApi } from "../../api/user";
// import CreateUserForm from "./CreateUserForm";
import "antd/dist/antd.css";
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
import { CartStoreContext } from "../stores/cart.store";
const { Option } = Select;
const AutoCompleteOption = AutoComplete.Option;

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
                initialValues={{
                    Address: "",
                    City: "HCM City",
                    ContactName: "",
                    ContactTitle: "",
                    Country: "Vietnam",
                    Fax: "",
                    Phone: "",
                    PostalCode: "700000",
                    Region: "South",
                    prefix: "86",
                }}
                scrollToFirstError
            >
                <Form.Item
                    name="ContactTitle"
                    label="Contact Title"
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    name="ContactName"
                    label="Contact Name"
                    rules={[
                        {
                            required: true,
                            message: 'Please input customer name!',
                        },
                    ]}
                    hasFeedback
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    name="Phone"
                    label="Phone"
                    rules={[
                        {
                            required: true,
                            message: 'Please input customer phone number!',
                        },
                    ]}
                    hasFeedback
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    name="Fax"
                    label="Fax"
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    name="Address"
                    label="Address"
                    rules={[
                        {
                            required: true,
                            message: 'Please input customer address!',
                        },
                    ]}
                    hasFeedback
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    name="City"
                    label="City"
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    name="Country"
                    label="Country"
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    name="Region"
                    label="Region"
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    name="PostalCode"
                    label="Postal Code"
                >
                    <Input />
                </Form.Item>

            </Form>
        </Modal>
    );
};

const CreateCustomerModal = (pros) => {
    const cartStore = React.useContext(CartStoreContext);
    const [visible, setVisible] = useState(false);

    const onCreate = async (values) => {
        console.log("Received values of form: ", values);
        // insertUsersApi(values);
        await cartStore.createCustomer(values);
        setVisible(false);
    };
    const unsetCustomer = async () => {
        await cartStore.resetCurrentCustomer();
    }

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
                Create New Customer
      </Button>&nbsp;
            <Button
                type="primary"
                style={{ background: "#fab91a", border: "none", "border-radius": "10px" }}
                className="p-2 h-100"
                onClick={() => {
                    unsetCustomer();
                }}
            >
                Unset customer
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

export default CreateCustomerModal;
