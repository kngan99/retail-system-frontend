import { Avatar, Row } from "antd";
import React from "react";
import { Table } from "react-bootstrap";


interface ComponentProps {
  style?: React.CSSProperties;
  className?: string;
  children?: React.ReactNode;
  productsData: any[];
  quantities: any[];
  returned: any[];
}

const ReturnedProductSummary = (props: ComponentProps) => {
  const {style, className, children, productsData, quantities, returned} = props;
  
  return (
      <div className="mr-2">
        <div>
          <Table striped hover size="sm">
            <thead>
              <tr>
                <th>Image</th>
                <th>Name</th>
                <th style={{ textAlign: 'center' }}>Quantity</th>
              </tr>
            </thead>
            <tbody>
              {productsData.map((item, idx) => {
                return (
                  <tr>
                    <td className="pr-0">
                    <Avatar shape="square" size={64} src={"https://warehouse-retail.herokuapp.com/api/products/img/thumbnails-" + String(item.PhotoURL ? item.PhotoURL : "default.png")} />
                    </td>
                    <td>
                        {item.ProductName}
                    </td>
                    <td style={{textAlign: 'center'}}>
                        {quantities[idx]}
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
export default ReturnedProductSummary;

