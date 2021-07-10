import React from 'react';
import { observer } from 'mobx-react-lite';
import { Container, Row, Col, Table, Form, Dropdown, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { CommonStoreContext } from '../../../../common/common.store';
import { CartStoreContext } from '../../../../themes/pos/stores/cart.store';
import { pageSizeOptions } from '../../../../common/constants/paging.constants';
import { toTimeFormat } from '../../../../common/utils/time.util';
import Paging from '../../../../common/components/Paging';

// Paging

/*
 * Props of Component
 */
interface ComponentProps {
  style?: React.CSSProperties;
  className?: string;
  children?: React.ReactNode;
  title?: string;
  referenceNo?: boolean;
  selectedIds: string[];
  handleSelectedItems: any;
  totals: number;
  handleEdit: any;
  handleDelete: any;
  handleChangePageItem: any;
  current: number;
  actionType?: string;
  actions: any[];
  handleOrderSummary?: any;
}

const OrderGrid = (props: ComponentProps) => {
  const commonStore = React.useContext(CommonStoreContext);
  const orderStore = React.useContext(CartStoreContext);

  /*
   * Props of Component
   */
  const {
    style,
    className,
    children,
    title,
    selectedIds = [],
    handleSelectedItems,
    totals,
    handleChangePageItem,
    current,
    actionType = 'listing',
    actions,
    handleOrderSummary,
  } = props;

  /*
   * Seleted ids in grid
   */
  const [ids, setIds] = React.useState<string[]>(selectedIds);

  /*
   * Seleted ids in grid
   */
  const [items, setItems] = React.useState<any[]>([]);

  /*
   * Selected status
   */
  const [selectedStatus, setSelectedStatus] = React.useState<any[]>([]);

  /*
   * Set paging size
   */
  const [pagingSize, setPagingSize] = React.useState<number>(
    +pageSizeOptions[0]
  );

  /*
   * Set current Page
   */
  const [currentPage, setCurrentPage] = React.useState<number>(1);

  /*
   * Set frame Page
   */
  const [currentPageFrame, setCurrentPageFrame] = React.useState<number>(
    current
  );

  /*
   * Set current order
   */
  const [, setCurrentOrder] = React.useState<number>(-1);

  /*
   * Set total page
   */
  // const totals: number = items.length;
  const maxPage: number = 4;
  const [totalPage, setTotalPage] = React.useState<number>(0);

  /*
   * Handle when select a row
   *
   * @param string value
   * @return void
   */
  const handleSelectedRow = (value: string) => {
    const checkboxes = document.getElementsByName('orderID[]');
    const allOrderId = document.getElementsByName('allOrderId'),
      checkItem = ids.find((item) => item === value);
    let checked = 0;

    if (checkItem) {
      setIds([...ids.filter((item) => item !== value)]);
      handleSelectedItems([...ids.filter((item) => item !== value)]);
    } else {
      setIds([...ids, value]);
      handleSelectedItems([...ids, value]);
    }
    checkboxes.forEach((item: any) => {
      if (item.checked) checked++;
    });
    if (checked === items.length) {
      allOrderId.forEach((item: any) => {
        item.checked = true;
      });
    } else {
      allOrderId.forEach((item: any) => {
        item.checked = false;
      });
    }
  };

  /*
   * Handle when select all items
   *
   * @param any event
   * @return void
   */
  const handleSelectedAll = (event: any) => {
    let tmpItems: any[] = [],
      tmpIds: any[] = [];
    const checkboxes = document.getElementsByName('orderID[]');
    checkboxes.forEach((item: any) => {
      item.checked = event.target.checked;
    });

    if (!event.target.checked) {
      setIds([]);
      tmpIds = [];
    } else {
      selectedStatus.map((item: any) => {
        tmpItems.push({ id: item.Id, checked: event.target.checked });
        tmpIds.push(item.id.toString());
        return selectedStatus;
      });
      setSelectedStatus(tmpItems);
      setIds(tmpIds);
      tmpIds = ['-1'];
    }
    console.log(ids);
    handleSelectedItems(tmpIds);
  };

  const handleStatus = (action: any, status: string) => {
    if (action.label === "Cancel") {
      return !action.checkNewStatus(status);
    }
    return false;
  };

  /*
   * Handle when changing page size
   *
   * @param number pageSize
   * @return void
   */
  const handleChangeSize = (event: any) => {
    setPagingSize(+event.target.value);
    setTotalPage(Math.ceil(totals / +event.target.value));
  };

  /*
   * Handle when changing current page
   *
   * @param number page
   * @return void
   */
  const handleChangePage = (page: number) => {
    setCurrentPage(page);
    setCurrentPageFrame(Math.ceil(page / maxPage));
    handleChangePageItem(page);
  };

  const handleActiveRow = (id: any) => {
    setCurrentOrder(id);
  };

  React.useEffect(() => {
    /*
     * Init selected items
     */
    let tmpItems: any[] = [];
    setItems(orderStore.orders);
    
    console.log(orderStore.orders);
    items.map((item: any) => {
      tmpItems.push({ id: item.Id, checked: false });
      return items;
    });
    console.log(orderStore.orders);
    setSelectedStatus(tmpItems);
    setTotalPage(Math.ceil(totals / +pageSizeOptions[0]));
  }, [items, orderStore.orders, totals]);

  // @ts-ignore
  return (
    <>
      {orderStore.orders && (
        <Container
          fluid
          className={`block-orders block-table ${className ? className : ''}`}
          style={style}
        >
          <Row>
            {title && (
              <Col xs={12}>
                <h3 className="block-title">
                  {title ? title : "Cargo Requests Manage"}
                </h3>
              </Col>
            )}
            <Col xs={12} className="block-content">
              <Table responsive="lg">
                <thead>
                  <tr>
                    <th className="col-selected">
                      <Form.Check
                        type="checkbox"
                        onClick={handleSelectedAll}
                        name="allOrderId"
                      />
                    </th>
                    <th>
                      <span>{"Id"}</span>
                      {(
                          <OverlayTrigger
                            key={'top'}
                            placement={'top'}
                            overlay={
                              <Tooltip id="tooltip-right">Please click on the Id of specific Request to see its Summary</Tooltip>
                            }
                          >
                            <div className="tooltip-icon">
                              <span className="ico ico-faq"></span>
                            </div>
                          </OverlayTrigger>
                        )}
                    </th>
                    <th>{"Warehouse"}</th>
                    <th>{"Created By"}</th>
                    <th>{"Created At"}</th>
                    <th>{"Updated By"}</th>
                    <th>{"Updated At"}</th>
                    <th>{"Status"}</th>
                    <th className="col-actions"></th>
                  </tr>
                </thead>
                <tbody>
                  {orderStore.orders.map((item: any, index: number) => (
                    <tr key={item.Id}>
                      <td className="col-selected">
                        <Form.Check
                          type="checkbox"
                          onChange={() => handleSelectedRow(item.Id.toString())}
                          value={item.Id}
                          className="order-checked-item"
                          name="orderID[]"
                          defaultChecked={selectedStatus[index]?.checked}
                        />
                      </td>
                      <td className="order-id" data-th={`${"Id"}: `}>
                        <span
                          className="order-summary"
                          onClick={() => {
                            handleOrderSummary(item.Id);
                            handleActiveRow(item.Id);
                          }}
                        >
                          {item.Id}
                        </span>
                      </td>
                      <td>{item.Warehouse && item.Warehouse.Shortname ? item.Warehouse.Shortname : '-' }</td>
                      <td>{item.CreatedByAccount.LName}</td>
                      <td>
                        {item.CreatedAt
                          ? toTimeFormat(
                              item.CreatedAt.toLocaleString(),
                              commonStore.dateTimeFormat
                            )
                          : '-'}
                      </td>
                      <td>{item.UpdatedBy}</td>
                      <td>
                        {item.UpdatedAt
                          ? toTimeFormat(
                              item.UpdatedAt.toLocaleString(),
                              commonStore.dateTimeFormat
                            )
                          : '-'}
                      </td>
                      <td
                        data-th={`${item.Status}: `}
                        className="col-order-status"
                      >
                        <span>{item.Status}</span>
                      </td>
                      <td className="col-actions col-actions-abs">
                        {actionType === 'listing' && (
                          <Dropdown>
                            <Dropdown.Toggle className="col-select-actions">
                              <i className="ico ico-setting"></i>
                            </Dropdown.Toggle>
                            <Dropdown.Menu className="col-select-contents">
                              {actions.map((action: any, index: number) => (
                                <Dropdown.Item
                                  className={action.status ? action.status : ''}
                                  onClick={() => {
                                    action.action(item.Id);
                                  }}
                                  key={`order-action-${index}`}
                                  disabled={handleStatus(action, item.status)}
                                >
                                  {action.label}
                                </Dropdown.Item>
                              ))}
                            </Dropdown.Menu>
                          </Dropdown>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Col>
          </Row>
          {children}
          {totalPage > 1 && (
            <>
              <Paging
                handleChangeSize={handleChangeSize}
                totalPage={totalPage}
                totals={totals}
                currentPageFrame={currentPageFrame}
                maxPage={maxPage}
                handleChangePage={handleChangePage}
                current={currentPage}
                pageSize={pagingSize}
              />
            </>
          )}
        </Container>
      )}
    </>
  );
};

export default observer(OrderGrid);
