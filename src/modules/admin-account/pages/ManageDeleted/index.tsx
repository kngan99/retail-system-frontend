import React from 'react';
import { observer } from 'mobx-react';

// Grid
import { AccountStoreContext } from '../../../account/account.store';
import { I18N } from '../../../../i18n.enum';
import AdminWrapper from '../../components/AdminWrapper';
import ConfirmModal from '../../../../common/components/ConfirmModal';
import { pageSizeOptions } from '../../../../common/constants/paging.constants';
import { FilterByDto } from '../../../../common/dto/FilterBy.dto';
import DeletedAccountGridAdmin from "../../components/DeletedGrid";
import { message } from 'antd';
import { toast } from "react-toastify";

const ManageDeletedAccountAdminPage = () => {
  const accountStore = React.useContext(AccountStoreContext);

  const {
    MANAGE_RESTORE_TITLE,
    MESSAGES_CONFIRM_RESTORE,
  } = I18N;

  // -----------------------------
  // Filter - Process
  // -----------------------------

  /*
   * Get list by criteria
   */
  const [criteriaDto, setCriteriaDto] = React.useState</*CustomerListDto*/any>({
    skip: 0,
    take: +pageSizeOptions[0],
  });
  /*
   * Seleted ids in grid
   */
  const [filtered, setFiltered] = React.useState<boolean>(false);

  /*
   * Setting filters
   */
  const filters: FilterByDto[] = [
    {
      key: 'email',
      label: 'Email'
    },
    {
      key: 'phoneNumber',
      label: 'Phone',
    },
  ];

  /*
   * Action of search button
   * @param: any e
   * @param: FilterByDto filterType
   * @return: void
   */
  const handleFilter = (e: any, filterType: FilterByDto) => {
    setCriteriaDto({
      skip: 0,
      take: +pageSizeOptions[0],
      searchBy: filterType.key,
      searchKeyword: e.target.search.value,
    });
    setFiltered(true);
  };

  const handleResetFilter = () => {
    setCriteriaDto({
      skip: 0,
      take: +pageSizeOptions[0],
    });
    setFiltered(false);
  };

  // -----------------------------
  // Grid Process
  // -----------------------------

  /*
   * set id of row that need to restore
   */
  const [restoreID, setRestoreID] = React.useState<number>(-1);

  /*
   * show hide new/edit driver popup
   */
  const [showConfirmPopup, setShowConfirmPopup] = React.useState<boolean>(
    false
  );
  /*
   * Action of Delete button
   *
   * @param number id
   * @return void
   */
  const handleRestore = async (id: number) => {
    setShowConfirmPopup(true);
    setRestoreID(id);
  };

  /*
   * Current page
   */
  const [currentPage, setCurrentPage] = React.useState<number>(1);

  /*
   * Action of change page
   * @param: number page
   * @return: void
   */
  const handleChangePageItem = (page: number) => {
    setCurrentPage(page);
    setCriteriaDto({
      skip: page > 1 ? (page - 1) * +pageSizeOptions[0] : 0,
      take: +pageSizeOptions[0],
      orderBy: 'id',
      orderDirection: 'DESC',
    });
  };

  const handleOk = async () => {
    setShowConfirmPopup(false);
    if (restoreID) {
      const result = await accountStore.restoreAccountByIdByAdmin(
        restoreID
      );
      if (result) {
        setRestoreID(-1);
        toast('Restore completed');
        accountStore.getDeletedAccountByAdmin(criteriaDto);
      }
    }
  };

  const handleCancel = () => {
    setShowConfirmPopup(false);
  };

  React.useEffect(() => {
    accountStore.getDeletedAccountByAdmin(criteriaDto);
  }, [accountStore, criteriaDto]);

  return (
    <>
      <AdminWrapper pageTitle={(MANAGE_RESTORE_TITLE)}>
        <DeletedAccountGridAdmin
          totals={accountStore.totalDeletedAccounts}
          handleRestore={handleRestore}
          handleChangePageItem={handleChangePageItem}
          current={currentPage}
        />
        <ConfirmModal
          show={showConfirmPopup}
          handleCancel={handleCancel}
          handleOk={handleOk}
        >
          <p>{(MESSAGES_CONFIRM_RESTORE)}</p>
        </ConfirmModal>
      </AdminWrapper>
    </>
  );
};

export default observer(ManageDeletedAccountAdminPage);
