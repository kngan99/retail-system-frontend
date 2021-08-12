import React from "react";
import { inject, observer } from "mobx-react";
import { Input, Tooltip, Button, message } from "antd";
import { PlusOutlined, MinusOutlined, DeleteOutlined } from "@ant-design/icons";
import { CartStoreContext } from "../../../../themes/pos/stores/cart.store";
import { toast } from "react-toastify";

const CartItem = ({ item, isCheckout }) => {
  const cartStore = React.useContext(CartStoreContext);
  const handleRemoveClick = async (e) => {
    await cartStore.removeFromCart(e);
  };
  const handleIncreaseClick = async (e) => {
    await cartStore.addToCart(e, true);
  };
  const handleDecreaseClick = async (e) => {
    await cartStore.decreaseToCart(e);
  };
  const onChange = async (item, e) => {
    if (!Number.isInteger(Number(e.target.value))) {
      toast("Invalid number!");
    } else {
      cartStore.updateQuantity(item, e.target.value);
      console.log("Change:", e.target.value);
    }
  };
  const quantity = item.Quantity;
  return (
    <tr>
      <td className="pr-0">{item.Id}</td>
      <td>{item.ProductName}</td>
      <td>{item.UnitPrice}</td>
      <td>{item.ReorderLevel}</td>
      <td>
        <Input
          disabled={isCheckout || item.ReorderLevel === item.UnitPrice}
          style={{ width: 50 }}
          size="small"
          value={quantity}
          onChange={async (e) => await onChange(item, e)}
        />
      </td>
      {!isCheckout && item.ReorderLevel !== item.UnitPrice && (
        <td className="p-0">
          <Button
            onClick={async () => {
              if (item.Quantity >= item.UnitPrice - item.ReorderLevel) {
                toast("You can not increase the quantity because it has reached the limit!");
                return;
              }
              await handleIncreaseClick(item);
            }}
            type="link"
            icon={<PlusOutlined />}
          />
          <Button
            onClick={async () => await handleDecreaseClick(item)}
            type="link"
            icon={<MinusOutlined />}
          />
          <Button
            onClick={async () => await handleRemoveClick(item)}
            type="link"
            icon={<DeleteOutlined />}
          />
        </td>
      )}
    </tr>
  );
};
export default CartItem;