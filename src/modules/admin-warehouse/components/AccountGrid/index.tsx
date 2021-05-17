import React from "react";
import { observer } from "mobx-react-lite";
import { Container, Row, Col, Table, Form, Button } from "react-bootstrap";
import Paging from "../../../../common/components/Paging";
import { pageSizeOptions } from "../../../../common/constants/paging.constants";
import { AccountsActionsDto } from "../../../account/account.dto";
import { AdminStoreContext } from "../../admin.store";
import ConfirmModal from "../../../../common/components/ConfirmModal";

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
  currentId: number;
  criteriaDto: any;
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
    handleEdit,
    handleDelete,
    currentId,
    criteriaDto,
  } = props;

  const [totals, setTotals] = React.useState<number>(0);

  const [totalPage, setTotalPage] = React.useState<number>(0);

  const [items, setItems] = React.useState<any[]>([]);

  const [pagingSize, setPagingSize] = React.useState<number>(
    +pageSizeOptions[0]
  );

  const [currentPage, setCurrentPage] = React.useState<number>(1);

  const [currentPageFrame, setCurrentPageFrame] = React.useState<number>(1);  

  const [showConfirmPopup, setShowConfirmPopup] = React.useState<boolean>(
    false
  );

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
    adminStore.getAccounts(criteriaDto.skip, criteriaDto.take);
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
                  {title ? title : "Manage Warehouses"}
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
                      <th>
                        <span>{"Id"}</span>
                      </th>
                      <th>Short Name</th>
                      <th>Email</th>
                      <th>Phone</th>
                      <th>Fax</th>
                      <th>Address</th>
                      <th>City</th>
                      <th>Size</th>
                      <th>Space Available</th>
                      <th className="col-actions"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((item: any, index: number) => (
                      <tr key={item.Id}>
                        <td>{item.Id}</td>
                        <td>
                          {item.ShortName}
                        </td>
                        <td>{item.Email}</td>
                        <td>{item.Phone}</td>
                        <td>{item.Fax}</td>
                        <td>{item.Address}</td>
                        <td>{item.City}</td>
                        <td>{item.WarehouseSize}</td>
                        <td>{item.SpaceAvailable}</td>
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
