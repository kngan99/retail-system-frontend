import React from 'react';
import { observer } from 'mobx-react-lite';
import { Container, Row, Col, Table, Button } from 'react-bootstrap';
import { I18N } from '../../../../i18n.enum';
import { AccountStoreContext } from '../../../account/account.store';
import { pageSizeOptions } from '../../../../common/constants/paging.constants';
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
  totals: number;
  handleRestore: any;
  handleChangePageItem: any;
  current: number;
}

const DeletedAccountGridAdmin = (props: ComponentProps) => {
  const accountStore = React.useContext(AccountStoreContext);

  /*
   * Props of Component
   */
  const {
    style,
    className,
    children,
    title,
    totals,
    handleRestore,
    handleChangePageItem,
    current,
  } = props;
  
  const { ACCOUNT_EMAIL, ACCOUNT_PHONE } = I18N;

  /*
   * Seleted ids in grid
   */
  const [items, setItems] = React.useState<any>([]);

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
   * Set total page
   */
  // const totals: number = items.length;
  const maxPage: number = 4;
  const [totalPage, setTotalPage] = React.useState<number>(0);

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

  React.useEffect(() => {
    /*
     * Init selected items
     */
    let tmpItems: any[] = [];
    setItems(accountStore.deletedAccounts);
    items.map((item: any) => {
      tmpItems.push({ id: item.id, checked: false });
      return items;
    });
    setTotalPage(Math.ceil(totals / +pageSizeOptions[0]));
  }, [items, accountStore.deletedAccounts, totals]);

  return (
    <>
      {items && (
        <Container
          fluid
          className={`block-orders block-table ${className ? className : ''}`}
          style={style}
        >
          <Row>
            {title && (
              <Col xs={12}>
                <h3 className="block-title">
                  {title ? title : "Deleted Accounts"}
                </h3>
              </Col>
            )}
            <Col xs={12} className="block-content">
            <Table responsive="lg">
                  <thead>
                    <tr>
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
                        <td>{item.Id}</td>
                        <td>
                          {item.FName} {item.LName}
                        </td>
                        <td>{item.Email}</td>
                        <td>{item.HomePhone}</td>
                        <td>{item.Type}</td>
                        <td className="col-actions">
                        <Button
                          variant="primary"
                          onClick={() => handleRestore(item.Id)}
                          className="btn-icon"
                          size="lg"
                        >
                          <i className="ico ico-reset"></i>
                        </Button>
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

export default observer(DeletedAccountGridAdmin);
