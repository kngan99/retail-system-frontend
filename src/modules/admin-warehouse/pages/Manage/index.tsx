import React from "react";
import { observer } from "mobx-react";
import { useHistory } from "react-router-dom";
import { WarehouseStoreContext } from "../../admin.store";
import { pageSizeOptions } from "../../../../common/constants/paging.constants";
import { I18N } from "../../../../i18n.enum";
import AdminWrapper from "../../components/AdminWrapper";
import { ActionBarDto } from "../../../theme/theme.dto";
import AdminAccountFormModal from "../../components/AdminAccountFormModal";
import AdminAccountGrid from "../../components/AccountGrid";
import ActionBar from "../../../theme/components/ActionBar";
import { message } from "antd";
import { toast } from "react-toastify";


const ManageAccountAdminPage = () => {
  const history = useHistory();
  const {
    ADMIN_MANAGE_ACCOUNT,
    BUTTONS_ADD_NEW,
    MESSAGES_UPDATE_SUCCESS,
    BUTTONS_RESTORE,
  } = I18N;

  const adminStore = React.useContext(WarehouseStoreContext);

  const [showPopup, setShowPopup] = React.useState<boolean>(false);

  const [mode, setMode] = React.useState<string>("create");

  const [id, setId] = React.useState<number>(-1);

  const [actionsBar] = React.useState<ActionBarDto[]>([
    // {
    //   label: BUTTONS_RESTORE,
    //   type: "primary",
    //   action: () => {
    //     handleRestore();
    //   },
    // },
    {
      label: BUTTONS_ADD_NEW,
      type: "primary",
      action: () => {
        handleCreate();
      },
    },
  ]);

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
    if (mode == 'edit') setMode("create");
    else setMode("edit");
    setShowPopup(false);
  };

  const handleSubmit = async (values: any) => {
    adminStore.setAdminForm(values);
    if (mode === "create") {
      const result = await adminStore.addAccount();
      if (result) {
        adminStore.getAccounts(criteriaDto.skip, criteriaDto.take);
        adminStore.resetAdminForm();
        setShowPopup(false);
        toast('Created successfully!', {autoClose: 4000});
      }
    }
    if (mode === "edit") {
      const result = await adminStore.updateAccount(id, adminStore.adminForm);
      if (result) {
        adminStore.getAccounts(criteriaDto.skip, criteriaDto.take);
        adminStore.resetAdminForm();
        setShowPopup(false);
        toast(MESSAGES_UPDATE_SUCCESS);
      }
    }
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

  const handleDelete = async (id: number, setShowConfirmPopup: any) => {
    setShowConfirmPopup(true);
    // await adminStore.deleteAccount(id);
    // adminStore.getAccounts(criteriaDto.skip, criteriaDto.take);
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
  }, [criteriaDto, adminStore]);

  return (
    <>
      <AdminWrapper pageTitle={"Manage Warehouses"}>
        <ActionBar actions={actionsBar} />
        <AdminAccountGrid
          handleChangePageItem={handleChangePageItem}
          handleEdit={handleEdit}
          handleDelete={handleDelete}
          currentId={id}
          criteriaDto={criteriaDto}
        />
        <AdminAccountFormModal
          show={showPopup}
          handleClose={handleClose}
          handleSubmit={handleSubmit}
          mode={mode}
        />
      </AdminWrapper>
    </>
  );
};

export default observer(ManageAccountAdminPage);
