import React from "react";
import { observer } from "mobx-react";
import { toast } from "react-toastify";
import { useHistory } from "react-router-dom";
import { AdminStoreContext } from "../../admin.store";
import { pageSizeOptions } from "../../../../common/constants/paging.constants";
import { I18N } from "../../../../i18n.enum";
import AdminWrapper from "../../components/AdminWrapper";
import { ActionBarDto } from "../../../theme/theme.dto";
import AdminAccountFormModal from "../../components/AdminAccountFormModal";
import AdminAccountGrid from "../../components/AccountGrid";
import ActionBar from "../../../theme/components/ActionBar";
import ConfirmModal from "../../../../common/components/ConfirmModal";

const ManageAccountAdminPage = () => {
  const history = useHistory();
  /*
   * Translation
   */
  const {
    ADMIN_MANAGE_ACCOUNT,
    BUTTONS_ADD_NEW,
    MESSAGES_CREATED_SUCCESS,
    MESSAGES_UPDATE_SUCCESS,
    MESSAGES_DELETE_SUCCESS,
    MESSAGES_CONFIRM_DELETE,
    BUTTONS_RESTORE,
  } = I18N;

  const adminStore = React.useContext(AdminStoreContext);

  const [showPopup, setShowPopup] = React.useState<boolean>(false);

  const [mode, setMode] = React.useState<string>("create");

  const [id, setId] = React.useState<number>(-1);

  const [ids, setIds] = React.useState<string[]>([]);

  const [confirmAction, setConfirmAction] = React.useState<string>('');

  const [deleteID, setDeleteID] = React.useState<number>(-1);

  const handleSelectedItems = (items: string[]) => {
    setIds(items);
  };

  const [showConfirmPopup, setShowConfirmPopup] = React.useState<boolean>(
    false
  );

  const [confirmTitle, setConfirmTitle] = React.useState<string>('');

  const handleOk = async () => {
    setShowConfirmPopup(false);
    if (confirmAction === 'delete') {
      if (deleteID) {
        const result = await adminStore.deleteAccount(deleteID);
        if (result) {
          setDeleteID(-1);
          toast.dismiss();
          toast.success((MESSAGES_DELETE_SUCCESS));
          adminStore.getAccounts(criteriaDto.skip, criteriaDto.take);
        }
      }
    }
  };

  const handleCancel = () => {
    setShowConfirmPopup(false);
  };

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

  const handleCreate = () => {
    setShowPopup(true);
  };

  const handleRestore = () => {
    history.push("/");
  };

  const [criteriaDto, setCriteriaDto] = React.useState<any>({
    skip: 0,
    take: +pageSizeOptions[0],
    orderDirection: "DESC",
  });

  const handleCreateAccount = async (values: any) => {
    adminStore.setAdminAccountForm(values);
    const result = await adminStore.addAccount();

    if (result) {
      adminStore.resetAdminAccountForm();
      adminStore.getAccounts(criteriaDto.skip, criteriaDto.take);
      toast.dismiss();
      toast.success(MESSAGES_CREATED_SUCCESS);
      setShowPopup(false);
    }
  };

  const handleClose = () => {
    setShowPopup(false);
  };

  const handleEdit = async (id: number) => {
    const admin = await adminStore.getAccountById(id);
    if (admin) {
      setMode("edit");
      setId(id);
      setShowPopup(true);
    }
  };

  const handleDelete = async (id: number) => {
    setShowConfirmPopup(true);
    setConfirmTitle(MESSAGES_CONFIRM_DELETE);
    setConfirmAction('delete');
    setDeleteID(id);
  };

  const handleChangePageItem = (page: number) => {
    setCriteriaDto({
      skip: page > 1 ? (page - 1) * +pageSizeOptions[0] : 0,
      take: +pageSizeOptions[0],
      orderDirection: "DESC",
    });
  };

  React.useEffect(() => {
    adminStore.getAccounts(criteriaDto.skip, criteriaDto.take);
  }, [adminStore, criteriaDto]);

  return (
    <>
      <AdminWrapper pageTitle={ADMIN_MANAGE_ACCOUNT}>
        <ActionBar actions={actionsBar} />
        <AdminAccountGrid
          selectedIds={ids}
          handleChangePageItem={handleChangePageItem}
          handleEdit={handleEdit}
          handleDelete={handleDelete}
          handleSelectedItems={handleSelectedItems}
        />
        <AdminAccountFormModal
          show={showPopup}
          handleClose={handleClose}
          handleSubmit={handleCreateAccount}
          mode={mode}
        />
        <ConfirmModal
          show={showConfirmPopup}
          handleCancel={handleCancel}
          handleOk={handleOk}
        >
          <p>{confirmTitle}</p>
        </ConfirmModal>
      </AdminWrapper>
    </>
  );
};

export default observer(ManageAccountAdminPage);
