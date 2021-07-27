import React from 'react';
import { observer } from 'mobx-react-lite';
import { Badge, Input, message, Table} from 'antd';
import { CheckOutlined, DeleteOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import {Helmet} from "react-helmet";
import '../RecommendExcel/style.css';
import { CartStoreContext } from "../../../../themes/pos/stores/cart.store";
import { transaction } from 'mobx';

interface ComponentProps {
  className?: string;
  children?: React.ReactNode;
  handleChangeType?: any;
}

interface ProductItemProps {
    record?: any;
}

const ProductItem = (props: ProductItemProps) => {
    const {record} = props;
    const columnsApriori = [
        {
          title: "Id",
          dataIndex: "id",
          key: "id",
        },
        {
          title: "Image",
          dataIndex: "image",
          key: "image",
        },
        {
          title: "Product Name",
          dataIndex: "name",
          key: "name",
        },
        {
          title: "Qty In Stock",
          dataIndex: "quantity",
          key: "quantity",
        },
      ];

    let data = [];

    React.useEffect(() => {
        // for (let i = 0; i < record.products[1]; i++){
        //     data.push(record.products);
        // }
    });

    return (
        <Table
                      dataSource={
                        record.products[0].map((product, index) => (
                            {
                                key: index,
                                id: product.ProductId,
                                image: product.Product,
                                name: product.Product.ProductName,
                                quantity:product.Product.UnitsInStock,
                            }
                        )
                        )
                      }
                      columns={columnsApriori}
                    />
    )
}

const RecommendExcel = (props: ComponentProps) => {
  const cartStore = React.useContext(CartStoreContext);
  const [enterItems, setEnterItems] = React.useState<string>("bread, milk, cheese, beer, umbrella, diaper, water, detergent");
  const [noTransactions, setNoTransactions] = React.useState<number>(5);
  const [sup, setSup] = React.useState<number>(40);
  const [conf, setConf] = React.useState<number>(70);

  const handleRemoveClick = async (e) => {
    await cartStore.removeApriori(e);
  }

  const handleEmptyClick = async () => {
    await cartStore.emptyCart();
  }

  const handleGetTransactions = async () => {
      if (cartStore.productsAprioriId.length === 0) {
          message.error("Please choose product");
          return;
      }
      const res = await cartStore.getTransactions();
      console.log(cartStore.transactions);
  }
  
//   React.useEffect(() => {
//     setEnterItems("bread, milk, cheese, beer, umbrella, diaper, water, detergent");
//     setNoTransactions(5);
//     setSup(40);
//     setConf(70);
//   }, []);

const columnsOrderApriori = [
    {
      title: "OrderId",
      dataIndex: "orderid",
      key: "orderid",
    },
]

const dataSourceOrderApriori = cartStore.transactions.map((transaction, index) => (
    {
        key: index,
        orderid: transaction.OrderId,
        products: transaction.Products,
    }
)
)

  return (
    <>
      <Helmet>
        <script
          type="text/javascript"
          src="https://cdn.jsdelivr.net/gh/kngan99/retail-system-frontend/src/modules/operation/components/AprioriJS/jquery/jquery-1.7.2.min.js"
        ></script>
        <script
          type="text/javascript"
          src="https://cdn.jsdelivr.net/gh/kngan99/retail-system-frontend/src/modules/operation/components/AprioriJS/Itemset.js"
        ></script>
        <script
          type="text/javascript"
          src="https://cdn.jsdelivr.net/gh/kngan99/retail-system-frontend/src/modules/operation/components/AprioriJS/ItemsetCollection.js"
        ></script>
        <script
          type="text/javascript"
          src="https://cdn.jsdelivr.net/gh/kngan99/retail-system-frontend/src/modules/operation/components/AprioriJS/AssociationRule.js"
        ></script>
        <script
          type="text/javascript"
          src="https://cdn.jsdelivr.net/gh/kngan99/retail-system-frontend/src/modules/operation/components/AprioriJS/Bit.js"
        ></script>
        <script
          type="text/javascript"
          src="https://cdn.jsdelivr.net/gh/kngan99/retail-system-frontend/src/modules/operation/components/AprioriJS/AprioriMining.js"
        ></script>
        <script
          type="text/javascript"
          src="https://cdn.jsdelivr.net/gh/kngan99/retail-system-frontend/src/modules/operation/components/AprioriJS/Apriori2.js"
        ></script>
      </Helmet>
      <div id="AprioriContainer">
        <table id="AprioriTable" cellPadding="0" cellSpacing="0" width="100%">
          <tr>
            <td>Selected Item Ids:</td>
            <td>
              <input
                type="text"
                id="ItemsTextBox"
                value={cartStore.productsAprioriIdStr}
                style={{ width: "410px;" }}
                onChange={(e) => setEnterItems(e.target.value)}
              />
            </td>
          </tr>
          <tr>
            <td>Selected Product:</td>
          </tr>
          <tr>
            <td colSpan={2}>
              {cartStore.productsApriori.map((item, idx) => {
                return (
                  <tr>
                    <td>{item.Id}</td>
                    <td>{item.ProductName}</td>
                    <td className="p-0">
                      <Button
                        onClick={async () => await handleRemoveClick(item)}
                        type="link"
                        icon={<DeleteOutlined />}
                      />
                    </td>
                  </tr>
                );
              })}
            </td>
          </tr>
          <tr>
            <td>Transactions:</td>
            <td>
              <input
                type="number"
                id="TransCountTextBox"
                value={cartStore.noTransactions}
                style={{ width: "80px" }}
                onChange={(e) => setNoTransactions(parseInt(e.target.value))}
              />
              &nbsp;&nbsp;
              <Button
                id="GetTransactionBtn"
                onClick={() => handleGetTransactions()}
                loading={cartStore.loading2}
              >
                Get Transactions
              </Button>
              &nbsp;&nbsp;
              <button id="GenerateDBButton" style={{ width: "100px", display: 'none' }}>
                Generate DB
              </button>
              &nbsp;&nbsp;
              <button id="ConfirmButton" style={{ width: "100px", padding: "4px", borderRadius: "7px"}}>
                Confirm
              </button>
              &nbsp;&nbsp;
            </td>
          </tr>
          <tr style={{ height: "10px" }}>
            <td></td>
          </tr>
          <tr>
            <td colSpan={2}>
              <textarea
                id="DBTextBox"
                cols={73}
                style={{ height: "120px", /*display: "none"*/ width: "100%" }}
                /*readOnly={true}*/
                value={cartStore.transactionStrName}
              ></textarea>
            </td>
          </tr>
          <tr>
            <td colSpan={2}>
              <Table
                expandable={{
                  expandedRowRender: (record) => (
                    <ProductItem record={record}/>
                  ),
                }}
                dataSource={dataSourceOrderApriori}
                columns={columnsOrderApriori}
                style={{ width: "100%" }}
                pagination={{
                  defaultPageSize: 10,
                  showSizeChanger: true,
                  pageSizeOptions: ["5", "10"],
                }}
              />
            </td>
          </tr>
          <tr style={{ height: "10px" }}>
            <td></td>
          </tr>
          <tr>
            <td colSpan={2}>
              Support Threshold (%):&nbsp;&nbsp;
              <input
                type="number"
                id="SupportThresholdTextBox"
                value={sup}
                style={{ width: "80px" }}
                onChange={(e) => setSup(parseInt(e.target.value))}
              />
            </td>
          </tr>
          <tr>
            <td colSpan={2}>
              Confidence Threshold (%):&nbsp;&nbsp;
              <input
                type="number"
                id="ConfidenceThresholdTextBox"
                value={conf}
                style={{ width: "80px" }}
                onChange={(e) => setConf(parseInt(e.target.value))}
              />
              &nbsp;&nbsp;
              <button id="AprioriButton" style={{ width: "100px", padding: "4px", borderRadius: "7px"}}>
                Apriori
              </button>
            </td>
          </tr>
          <tr style={{ height: "10px" }}>
            <td></td>
          </tr>
          <tr>
            <td colSpan={2}>
              <textarea
                id="ResultTextBox"
                cols={73}
                style={{ minHeight: "180px", width: "100%"}}
                readOnly={true}
              ></textarea>
            </td>
          </tr>
        </table>
      </div>
    </>
  );
};

export default observer(RecommendExcel);
