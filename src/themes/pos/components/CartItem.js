import React from 'react';
import { inject, observer } from 'mobx-react';
import { CartStoreContext } from "../stores/cart.store";
import { Input, Tooltip, Button, message, Badge } from 'antd';
import { PlusOutlined, MinusOutlined, DeleteOutlined } from "@ant-design/icons";

const CartItem = ({ item, isCheckout }) => {
    const cartStore = React.useContext(CartStoreContext);
    const handleRemoveClick = async (e) => {
        await cartStore.removeFromCart(e);
    }
    const handleIncreaseClick = async (e) => {
        await cartStore.addToCart(e);
    }
    const handleDecreaseClick = async (e) => {
        await cartStore.decreaseToCart(e);
    }
    const onChange = async (item, e) => {
        if (!Number.isInteger(Number(e.target.value))) {
            message.error("Invalid number!");
        }
        else {
            cartStore.updateQuantity(item, e.target.value);
            console.log('Change:', e.target.value);
        }
    };
    const quantity = item.Quantity
    return (
        <tr>
            <td class="pr-0">
                {item.Id}
            </td>
            <td>
                {item.ProductName}
            </td>
            <td>
                <Input disabled={isCheckout} style={{ width: 50 }} size='small' value={quantity} onChange={async (e) => await onChange(item, e)} />
            </td>
            <td>
                {item.UnitPrice}
            </td>
            <td>
                <Badge count={'-' + item.Discount + '%'} />
            </td>
            <td class="text-right pr-5">
                {item.Total}
            </td>
            {(!isCheckout) && <td class="p-0">
                <Button onClick={async () => await handleIncreaseClick(item)} type="link" icon={<PlusOutlined />} />
                <Button onClick={async () => await handleDecreaseClick(item)} type="link" icon={<MinusOutlined />} />
                <Button onClick={async () => await handleRemoveClick(item)} type="link" icon={<DeleteOutlined />} />
            </td>}
        </tr>
    );
}
export default CartItem;
