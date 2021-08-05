import React from "react";
import { observer } from "mobx-react-lite";
import { Container, Row, Col, Table, Form, Button } from "react-bootstrap";
import Paging from "../../../../common/components/Paging";
import { pageSizeOptions } from "../../../../common/constants/paging.constants";
import { AccountsActionsDto } from "../../../account/account.dto";
import { AdminStoreContext } from "../../admin.store";
import ConfirmModal from "../../../../common/components/ConfirmModal";
import Filter from "../../../../common/components/Filter";

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
  handleAdminVerify?: any;
  handleEdit?: any;
  handleDelete?: any;
  handleAssign?: any;
  currentId: number;
  criteriaDto: any;
  handleFilter?: any;
  filtered?: boolean;
  handleResetFilter?: any;
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
    handleChangePageItem,
    handleAdminVerify,
    handleEdit,
    handleDelete,
    handleAssign,
    currentId,
    criteriaDto,
    handleFilter,
    filtered,
    handleResetFilter,
  } = props;

  const [totals, setTotals] = React.useState<number>(0);

  const [totalPage, setTotalPage] = React.useState<number>(0);

  const [items, setItems] = React.useState<any[]>([]);

  const [pagingSize, setPagingSize] = React.useState<number>(
    +pageSizeOptions[0]
  );

  const [currentPage, setCurrentPage] = React.useState<number>(1);

  const [currentPageFrame, setCurrentPageFrame] = React.useState<number>(1);

  const [showConfirmPopup, setShowConfirmPopup] =
    React.useState<boolean>(false);

  const [showConfirmAssignPopup, setShowConfirmAssignPopup] =
    React.useState<boolean>(false);

  const maxPage: number = 4;

  const handleChangeSize = (event: any) => {
    setPagingSize(+event.target.value);
    setTotalPage(Math.ceil(totals / +event.target.value));
  };

  const handleChangePage = (page: number) => {
    setCurrentPage(page);
    setCurrentPageFrame(Math.ceil(page / maxPage));
    handleChangePageItem(page);
  };

  // React.useEffect(() => {
  //   const getAccounts = async () => {
  //     await adminStore.getAccounts(0, 10);
  //     setItems(adminStore.accounts);
  //     setTotals(adminStore.totalCount);
  //     setTotalPage(Math.ceil(totals / +pageSizeOptions[0]));
  //   };
  //   getAccounts();
  // }, [adminStore, totals]);

  React.useEffect(() => {
    setItems(adminStore.accounts);
    setTotals(adminStore.totalCount);
    setTotalPage(Math.ceil(totals / +pageSizeOptions[0]));
  }, [adminStore.accounts, adminStore.totalCount, totals]);

  /*Confirm modal*/
  const handleOk = async () => {
    setShowConfirmPopup(false);
    await adminStore.deleteAccount(currentId);
    adminStore.getAccounts(criteriaDto.skip, criteriaDto.take, "");
  };

  const handleCancel = () => {
    setShowConfirmPopup(false);
  };
  /*End Confirm modal*/

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
                <Col xs={12} style={{ margin: "17px auto auto -56px" }}>
                  <Filter
                    handleFilter={handleFilter}
                    filtered={filtered}
                    handleResetFilter={handleResetFilter}
                  ></Filter>
                </Col>
                <Table responsive="md" style={{ marginLeft: "-16px" }}>
                  <thead>
                    <tr></tr>
                    <tr>
                      <th>
                        <span>{"Id"}</span>
                      </th>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Phone</th>
                      <th>Role</th>
                      <th>Place Id</th>
                      <th>Email Verified </th>
                      <th>Admin Verified </th>
                      <th className="col-actions">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((item: any, index: number) => (
                      <tr key={item.Id}>
                        <td>{item.Id}</td>
                        <td>
                          {item.FName} {item.LName}
                        </td>
                        <td>{item.Email}</td>
                        <td>{item.Homephone}</td>
                        <td>{item.Type}</td>
                        <td>
                          {item.StoreId | item.WarehouseId
                            ? item.StoreId
                              ? item.StoreId
                              : item.WarehouseId
                            : "-"}
                        </td>
                        <td
                          className={
                            item.EmailVerified
                              ? "account-status account-status-verified"
                              : "account-status account-status-unverified"
                          }
                        >
                          {item.EmailVerified ? "Verified" : "Not Verified"}
                        </td>
                        <td
                          className={
                            item.AdminVerified
                              ? "account-status account-status-verified"
                              : "account-status account-status-unverified"
                          }
                        >
                          {item.AdminVerified ? "Verified" : "Not Verified"}
                        </td>
                        <td className="col-actions">
                          <Button
                            variant="primary"
                            onClick={() => {
                              handleAdminVerify(item.Id);
                            }}
                            className="btn-icon"
                            size="lg"
                          >
                            <i
                              className="ico ico-checked"
                              style={{ fontSize: "medium" }}
                            ></i>
                          </Button>
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
                              handleAssign(item.Id, setShowConfirmAssignPopup);
                            }}
                            className="btn-icon"
                            size="lg"
                          >
                            <i className="ico ico-assign"></i>
                          </Button>
                          <Button
                            variant="primary"
                            onClick={() => {
                              handleDelete(item.Id, setShowConfirmPopup);
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
          <ConfirmModal
            show={showConfirmPopup}
            handleCancel={handleCancel}
            handleOk={handleOk}
            children={<strong>Do you want to delete this item?</strong>}
          ></ConfirmModal>
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
