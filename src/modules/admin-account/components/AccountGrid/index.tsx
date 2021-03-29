import React from "react";
import { observer } from "mobx-react-lite";
import { Container, Row, Col, Table, Form, Button } from "react-bootstrap";
import Paging from "../../../../common/components/Paging";
import { pageSizeOptions } from "../../../../common/constants/paging.constants";
import { AccountsActionsDto } from "../../../account/account.dto";
import { AdminStoreContext } from "../../admin.store";

/*
 * Props of Component
 */
interface ComponentProps {
  style?: React.CSSProperties;
  className?: string;
  children?: React.ReactNode;
  title?: string;
  actionType?: string;
  actions?: AccountsActionsDto[];
  handleChangePageItem?: any;
  handleEdit?: any;
  handleDelete?: any;
  selectedIds: string[];
  handleSelectedItems: any;
}

const AdminAccountGrid = (props: ComponentProps) => {
  const adminStore = React.useContext(AdminStoreContext);

  /*
   * Props of Component
   */
  const {
    style,
    className,
    children,
    title,
    selectedIds = [],
    handleChangePageItem,
    handleEdit,
    handleDelete,
    handleSelectedItems,
  } = props;

  const [totals, setTotals] = React.useState<number>(0);

  const [totalPage, setTotalPage] = React.useState<number>(0);

  const [items, setItems] = React.useState<any[]>([]);

  const [pagingSize, setPagingSize] = React.useState<number>(
    +pageSizeOptions[0]
  );

  const [selectedStatus, setSelectedStatus] = React.useState<any[]>([]);

  const [currentPage, setCurrentPage] = React.useState<number>(1);

  const [currentPageFrame, setCurrentPageFrame] = React.useState<number>(1);

  const [ids, setIds] = React.useState<string[]>(selectedIds);

  const maxPage: number = 4;

  const handleSelectedAll = (event: any) => {
    let tmpItems: any[] = [],
      tmpIds: any[] = [];
    const checkboxes = document.getElementsByName("accountID[]");
    checkboxes.forEach((item: any) => {
      item.checked = event.target.checked;
    });

    selectedStatus.map((item: any) => {
      tmpItems.push({ id: item.id, checked: event.target.checked });
      tmpIds.push(item.id);
      return selectedStatus;
    });

    if (!event.target.checked) tmpIds = [];
    setSelectedStatus(tmpItems);
    setIds(tmpIds);
    handleSelectedItems(tmpIds);
  };

  const handleSelectedRow = (value: string) => {
    const checkboxes = document.getElementsByName('accountID[]');
    const allOrderId = document.getElementsByName('allAccountID'),
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

  const handleChangeSize = (event: any) => {
    setPagingSize(+event.target.value);
    setTotalPage(Math.ceil(totals / +event.target.value));
  };

  const handleChangePage = (page: number) => {
    setCurrentPage(page);
    setCurrentPageFrame(Math.ceil(page / maxPage));
    handleChangePageItem(page);
  };

  React.useEffect(() => {
    const getAccounts = async () => {
      await adminStore.getAccounts(0, 10);
      setItems(adminStore.accounts);
      setTotals(adminStore.totalCount);
      setTotalPage(Math.ceil(totals / +pageSizeOptions[0]));
    };
    getAccounts();
  }, [adminStore, totals]);

  return (
    <>
      {items && (
        <Container
          fluid
          className={`block-orders ${className ? className : ""}`}
          style={style}
        >
          <Row>
            {title && (
              <Col xs={12}>
                <h3 className="block-title">
                  {title ? title : "Manage Accounts"}
                </h3>
              </Col>
            )}
            <Col xs={12} className="block-content">
              <Form
                noValidate
                onSubmit={(e) => {
                  e.preventDefault();
                }}
                className="order-grid"
              >
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
                      </th>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Phone</th>
                      <th>Role</th>
                      <th className="col-actions"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((item: any, index: number) => (
                      <tr key={item.Id}>
                        <td className="col-selected">
                          <Form.Check
                            type="checkbox"
                            onChange={() =>
                              handleSelectedRow(item.id.toString())
                            }
                            value={item.id}
                            className="order-checked-item"
                            name="orderID[]"
                            defaultChecked={selectedStatus[index]?.checked}
                          />
                        </td>
                        <td>{item.Id}</td>
                        <td>
                          {item.FName} {item.LName}
                        </td>
                        <td>{item.Email}</td>
                        <td>{item.Homephone}</td>
                        <td>{item.Type}</td>
                        <td className="col-actions">
                          <Button
                            variant="primary"
                            onClick={() => handleEdit(item.Id)}
                            className="btn-icon"
                            size="lg"
                          >
                            <i className="ico ico-edit"></i>
                          </Button>
                          <Button
                            variant="primary"
                            onClick={() => {
                              handleDelete(item.Id);
                            }}
                            className="btn-icon"
                            size="lg"
                          >
                            <i className="ico ico-delete"></i>
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </Form>
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

export default observer(AdminAccountGrid);
