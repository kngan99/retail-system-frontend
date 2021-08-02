import React from "react";
import { observer } from "mobx-react-lite";
import { ProductStoreContext } from "../../../product/product.store";
import { DatePicker, Space, Button, Row, Result } from "antd";
import { CalendarOutlined, SmileOutlined } from "@ant-design/icons";
import Icon from "@ant-design/icons";
import moment from "moment";
import { Bar } from "react-chartjs-2";

interface ComponentProps {
  className?: string;
  children?: React.ReactNode;
  handleChangeType?: any;
}

const PandaSvg = () => (
  <svg viewBox="0 0 1024 1024" width="1em" height="1em" fill="currentColor">
    <path
      d="M99.096 315.634s-82.58-64.032-82.58-132.13c0-66.064 33.032-165.162 148.646-148.646 83.37 11.91 99.096 165.162 99.096 165.162l-165.162 115.614zM924.906 315.634s82.58-64.032 82.58-132.13c0-66.064-33.032-165.162-148.646-148.646-83.37 11.91-99.096 165.162-99.096 165.162l165.162 115.614z"
      fill="#6B676E"
      p-id="1143"
    />
    <path
      d="M1024 561.548c0 264.526-229.23 429.42-512.002 429.42S0 826.076 0 561.548 283.96 66.064 512.002 66.064 1024 297.022 1024 561.548z"
      fill="#FFEBD2"
      p-id="1144"
    />
    <path
      d="M330.324 842.126c0 82.096 81.34 148.646 181.678 148.646s181.678-66.55 181.678-148.646H330.324z"
      fill="#E9D7C3"
      p-id="1145"
    />
    <path
      d="M644.13 611.098C594.582 528.516 561.55 512 512.002 512c-49.548 0-82.58 16.516-132.13 99.096-42.488 70.814-78.73 211.264-49.548 247.742 66.064 82.58 165.162 33.032 181.678 33.032 16.516 0 115.614 49.548 181.678-33.032 29.18-36.476-7.064-176.93-49.55-247.74z"
      fill="#FFFFFF"
      p-id="1146"
    />
    <path
      d="M611.098 495.484c0-45.608 36.974-82.58 82.58-82.58 49.548 0 198.194 99.098 198.194 165.162s-79.934 144.904-148.646 99.096c-49.548-33.032-132.128-148.646-132.128-181.678zM412.904 495.484c0-45.608-36.974-82.58-82.58-82.58-49.548 0-198.194 99.098-198.194 165.162s79.934 144.904 148.646 99.096c49.548-33.032 132.128-148.646 132.128-181.678z"
      fill="#6B676E"
      p-id="1147"
    />
    <path
      d="M512.002 726.622c-30.06 0-115.614 5.668-115.614 33.032 0 49.638 105.484 85.24 115.614 82.58 10.128 2.66 115.614-32.944 115.614-82.58-0.002-27.366-85.556-33.032-115.614-33.032z"
      fill="#464655"
      p-id="1148"
    />
    <path
      d="M330.324 495.484m-33.032 0a33.032 33.032 0 1 0 66.064 0 33.032 33.032 0 1 0-66.064 0Z"
      fill="#464655"
      p-id="1149"
    />
    <path
      d="M693.678 495.484m-33.032 0a33.032 33.032 0 1 0 66.064 0 33.032 33.032 0 1 0-66.064 0Z"
      fill="#464655"
      p-id="1150"
    />
  </svg>
);

const PandaIcon = (props) => <Icon component={PandaSvg} {...props} />;

const ReportDiagram = (props: ComponentProps) => {
  const productStore = React.useContext(ProductStoreContext);
  const [start, setStart] = React.useState<Date>();
  const [end, setEnd] = React.useState<Date>();
  const [noSummaryProducts, setNoSummaryProducts] = React.useState<number>(-1);
  const [totalIncome, setTotalIncome] = React.useState<number>(0);
  const [summaryProducts, setSummaryProducts] = React.useState<any[]>([]);
  const [productsLabel, setProductsLabel] = React.useState<any[]>([]);
  const [quantity, setQuantity] = React.useState<number[]>([]);
  const [income, setIncome] = React.useState<number[]>([]);
  const { RangePicker } = DatePicker;

  const options = {
    scales: {
      yAxes: [
        {
          ticks: {
            beginAtZero: true,
          },
        },
      ],
    },
  };

  const rand = () => Math.floor(Math.random() * 255);

  const data = {
    labels: productStore.productsLabel,
    datasets: [
      {
        type: 'line',
        label: 'Income',
        borderColor: `rgb(${rand()}, ${rand()}, ${rand()})`,
        borderWidth: 2,
        fill: false,
        data: productStore.income,
      },
      {
        type: 'bar',
        label: 'Quantity',
        backgroundColor: `rgb(${rand()}, ${rand()}, ${rand()})`,
        data: productStore.quantity,
        borderColor: 'white',
        borderWidth: 2,
      },
    ],
  }

  const handleGetDiagram = async () => {
    const res = await productStore.getPeriodSummary(start!, end!);
    setNoSummaryProducts(productStore.noSummaryProducts);
    setTotalIncome(productStore.totalIncome);
    productStore.summaryProducts.map((product) => {
      productsLabel.push(product.ProductName);
      income.push(product.Price);
      quantity.push(product.Quantity);
      return summaryProducts.push(product);
    });
    console.log("income");
    console.log(income);
    console.log(quantity);
  };

  return (
    <>
      <Row style={{ marginBottom: "12px" }}>
        <CalendarOutlined style={{ fontSize: "20px" }} />
        <span style={{ marginLeft: "10px", fontSize: "15px", fontWeight: 400 }}>
          Please choose period
        </span>
      </Row>
      <Row style={{ marginBottom: "12px" }}>
        <Space direction="vertical" size={12}>
          <RangePicker
            onChange={(value) => {
              if (value && value[0]) {
                setStart(
                  new Date(moment(value[0]).format("YYYY-MM-DD HH:mm:ss"))
                );
              }
              if (value && value[1]) {
                setEnd(
                  new Date(moment(value[1]).format("YYYY-MM-DD HH:mm:ss"))
                );
              }
            }}
          />
        </Space>
      </Row>
      <Row style={{ marginBottom: "12px" }}>
        <Button type="primary" onClick={handleGetDiagram}>
          Submit
        </Button>
      </Row>
      <Row style={{ minHeight: "600px" }}>
        {noSummaryProducts === -1 && (
          <Result
            icon={<PandaIcon />}
            title="Please choose the range and press Submit to get the report!"
          />
        )}
        {noSummaryProducts === 0 && (
          <Result
            icon={<SmileOutlined />}
            title="Looks like in this period we do not have any product sold!"
          />
        )}
        {summaryProducts && noSummaryProducts > 0 && quantity.length > 0 && income.length > 0 && (
          <>
            <div className="header">
              <h1 className="title">Crazy Chart</h1>
              <div className="links">
                <a
                  className="btn btn-gh"
                  href="https://github.com/reactchartjs/react-chartjs-2/blob/master/example/src/charts/Crazy.js"
                >
                  Github Source
                </a>
              </div>
            </div>
            <Bar data={data} options={options} />
          </>
        )}
      </Row>
    </>
  );
};

export default observer(ReportDiagram);
