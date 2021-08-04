import React from "react";
import { observer } from "mobx-react";
import { useHistory } from "react-router-dom";
import { AdminStoreContext } from "../../admin.store";
import { pageSizeOptions } from "../../../../common/constants/paging.constants";
import { I18N } from "../../../../i18n.enum";
import AdminWrapper from "../../components/AdminWrapper";
import { ActionBarDto } from "../../../theme/theme.dto";
import AdminAccountFormModal from "../../components/AdminAccountFormModal";
import AdminAccountGrid from "../../components/AccountGrid";
import ActionBar from "../../../theme/components/ActionBar";
import { message } from "antd";
import { toast } from "react-toastify";
import ConfirmModal from "../../../../common/components/ConfirmModal";

const ManageAccountAdminPage = () => {
  const history = useHistory();
  const {
    ADMIN_MANAGE_ACCOUNT,
    BUTTONS_ADD_NEW,
    MESSAGES_UPDATE_SUCCESS,
    BUTTONS_RESTORE,
  } = I18N;

  const adminStore = React.useContext(AdminStoreContext);

  const [showPopup, setShowPopup] = React.useState<boolean>(false);

  const [mode, setMode] = React.useState<string>("create");

  const [id, setId] = React.useState<number>(-1);

  const [filtered, setFiltered] = React.useState<boolean>(false);

  const [searchKeywordCurPage, setSearchKeywordCurPage] = React.useState<string>("");

  const [actionsBar] = React.useState<ActionBarDto[]>([
    {
      label: BUTTONS_RESTORE,
      type: "primary",
      action: () => {
        handleRestore();
      },
    },
    {
      label: BUTTONS_ADD_NEW,
      type: "primary",
      action: () => {
        handleCreate();
      },
    },
  ]);

  const [showConfirmPopup, setShowConfirmPopup] =
    React.useState<boolean>(false);

  /*Confirm modal*/
  const handleOk = async () => {
    const curUser = await adminStore.getAccountById(id);
    if (!adminStore.curUser.Type) {
      toast("Please set the Account Role before verifying!");
      setShowConfirmPopup(false);
      return;
    }
    setShowConfirmPopup(false);
    const res = await adminStore.adminVerifyAccount(id);
    if (res) {
      toast("Verify successfully!");
      setId(-1);
    }
    adminStore.getAccounts(criteriaDto.skip, criteriaDto.take, '');
  };

  const handleCancel = () => {
    setShowConfirmPopup(false);
  };
  /*End Confirm modal*/

  const handleRestore = () => {
    history.push("/account/deleted");
  };

  const [criteriaDto, setCriteriaDto] = React.useState<any>({
    skip: 0,
    take: +pageSizeOptions[0],
    orderDirection: "DESC",
  });

  const handleCreate = () => {
    setMode("create");
    setShowPopup(true);
  };

  const handleClose = () => {
    setShowPopup(false);
  };

  const handleSubmit = async (values: any) => {
    adminStore.setAdminForm(values);
    if (mode === "create") {
      const result = await adminStore.addAccount();
      if (result) {
        adminStore.getAccounts(criteriaDto.skip, criteriaDto.take, '');
        adminStore.resetAdminForm();
        toast('Created successfully');
        setShowPopup(false);
      }
    }
    if (mode === "edit") {
      const result = await adminStore.updateAccount(id, adminStore.adminForm);
      if (result) {
        adminStore.getAccounts(criteriaDto.skip, criteriaDto.take, '');
        adminStore.resetAdminForm();
        toast(MESSAGES_UPDATE_SUCCESS);
        setShowPopup(false);
      }
    }
    adminStore.getAccounts(criteriaDto.skip, criteriaDto.take,'');
    //toast('Created successfully');
    setShowPopup(false);
  };

  const handleAdminVerify = async (id: number) => {
    setShowConfirmPopup(true);
    setId(id);
  };

  const handleEdit = async (id: number) => {
    const admin = await adminStore.getAccountById(id);
    if (admin) {
      setMode("edit");
      setId(id);
      setShowPopup(true);
    }
  };

  const handleDelete = async (id: number, setShowConfirmPopup: any) => {
    setShowConfirmPopup(true);
    await adminStore.deleteAccount(id);
    adminStore.getAccounts(criteriaDto.skip, criteriaDto.take, '');
  };

  const handleChangePageItem = (page: number) => {
    setCriteriaDto({
      skip: page > 1 ? (page - 1) * +pageSizeOptions[0] : 0,
      take: +pageSizeOptions[0],
      orderDirection: "DESC",
      searchKeyword: searchKeywordCurPage,
    });
  };

  const handleFilter = (searchKey: string) => {
    setCriteriaDto({
      skip: 0,
      take: +pageSizeOptions[0],
      searchBy: '',
      searchKeyword: searchKey,
    });
    setSearchKeywordCurPage(searchKey);
    setFiltered(true);
  };

  const handleResetFilter = () => {
    setCriteriaDto({
      skip: 0,
      take: +pageSizeOptions[0],
    });
    setFiltered(false);
  };

  React.useEffect(() => {
    adminStore.getAccounts(criteriaDto.skip, criteriaDto.take, criteriaDto.searchKeyword);
  }, [criteriaDto, adminStore]);

  return (
    <>
      <AdminWrapper pageTitle={ADMIN_MANAGE_ACCOUNT}>
        <ActionBar actions={actionsBar} />
        <AdminAccountGrid
          handleChangePageItem={handleChangePageItem}
          handleAdminVerify={handleAdminVerify}
          handleEdit={handleEdit}
          handleDelete={handleDelete}
          currentId={id}
          criteriaDto={criteriaDto}
          handleFilter={handleFilter}
          filtered={filtered}
          handleResetFilter={handleResetFilter}
        />
        <AdminAccountFormModal
          show={showPopup}
          handleClose={handleClose}
          handleSubmit={handleSubmit}
          mode={mode}
          handleDelete={handleDelete}
        />
        <ConfirmModal
          show={showConfirmPopup}
          handleCancel={handleCancel}
          handleOk={handleOk}
          children={<strong>Do you want to verify this account?</strong>}
        ></ConfirmModal>
      </AdminWrapper>
    </>
  );
};

export default observer(ManageAccountAdminPage);
