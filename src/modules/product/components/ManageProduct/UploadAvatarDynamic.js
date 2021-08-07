import React, { useEffect, useState } from "react";
import { Upload, Button, Avatar, message } from "antd";
import ImgCrop from "antd-img-crop";
import { UploadOutlined } from "@ant-design/icons";
import { ProductStoreContext } from "../../product.store";
import productService from '../../../../modules/product/product.service';
import { toast } from "react-toastify";

// const token = checkToken();

const UploadAvatarDynamic = (record) => {
    const productStore = React.useContext(ProductStoreContext);
    const [imageUrl, setImageUrl] = React.useState(
        record.record.PhotoURL
    );
    console.log(record.record.PhotoURL);
    useEffect(() => {

    }, [imageUrl]);

    const [fileList, setFileList] = useState([]);
    const onChange = async ({ file: newFile, fileList: newFileList }) => {
        setFileList(newFileList);
        if (newFile.status === 'done') {
            setImageUrl("https://warehouse-retail.herokuapp.com/api/products/img/" + String(newFile.response.filename));
        }
    };

    const onPreview = async (file) => {
        let src = file.url;
        if (!src) {
            src = await new Promise((resolve) => {
                const reader = new FileReader();
                reader.readAsDataURL(file.originFileObj);
                reader.onload = () => resolve(reader.result);
            });
        }
        const image = new Image();
        image.src = src;
        const imgWindow = window.open(src);
        imgWindow.document.write(image.outerHTML);
    };

    function beforeUpload(file) {
        console.log("current id");
        console.log(record.record.Id)
        const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
        if (!isJpgOrPng) {
            toast('You can only upload JPG/PNG file!');
        }
        const isLt2M = file.size / 1024 / 1024 < 10;
        if (!isLt2M) {
            toast('Image must smaller than 10MB!');
        }
        return isJpgOrPng && isLt2M;
    }

    return (<ImgCrop beforeCrop={beforeUpload} rotate>
        <Upload action={"https://warehouse-retail.herokuapp.com/" + "api/products/avatar/" + record.record.Id}
        headers={{'Authorization':'Bearer ' + localStorage.getItem('token')}}
            fileList={fileList}
            onChange={onChange}
            onPreview={onPreview} > {
                fileList.length < 1 && (<Avatar shape="square"
                    size={150}
                    style={
                        { padding: 0 }
                    }
                    src={"https://warehouse-retail.herokuapp.com/api/products/img/" + String(imageUrl)}
                />)} </Upload > </ImgCrop>
    );
};

export default UploadAvatarDynamic;
