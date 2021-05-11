import { Avatar, Row } from "antd";
import React from "react";
import { Table } from "react-bootstrap";


interface ComponentProps {
  style?: React.CSSProperties;
  className?: string;
  children?: React.ReactNode;
  productsData: any[];
  quantities: any[];
}

const ProductSummary = (props: ComponentProps) => {
  const {style, className, children, productsData, quantities} = props;
  
  return (
      <div className="mr-2">
        <div>
          <Table striped hover size="sm">
            <thead>
              <tr>
                <th>Image</th>
                <th>Name</th>
                <th>Quantity</th>
                <th>Units In Stock</th>
                <th className="text-right pr-5">Total</th>
              </tr>
            </thead>
            <tbody>
              {productsData.map((item, idx) => {
                return (
                  <tr>
                    <td className="pr-0">
                    <Avatar shape="square" size={64} src={"http://127.0.0.1:4000/api/products/img/thumbnails-" + String(item.PhotoURL ? item.PhotoURL : "default.png")} />
                    </td>
                    <td>
                        {item.ProductName}
                    </td>
                    <td>
                        {quantities[idx]}
                    </td>
                    <td>
                        {item.UnitsInStock}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        </div>
        {children}
      </div>
    );

}
export default ProductSummary;

