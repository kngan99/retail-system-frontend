import React from "react";
import { observer } from "mobx-react";
import { useHistory } from "react-router-dom";
import { pageSizeOptions } from "../../../../common/constants/paging.constants";
import { I18N } from "../../../../i18n.enum";
import { ActionBarDto } from "../../../theme/theme.dto";
import ActionBar from "../../../theme/components/ActionBar";
import { message } from "antd";
import RecommendListProduct from "../../components/RecommendListProduct";
import AdminWrapper from "../../components/AdminWrapper";
import RecommendExcel from "../../components/RecommendExcel";
import { Button, Row } from "react-bootstrap";
import ListProductToRemove from "../../components/ListProductToRemove";
import AssignQuantityModal from "../../components/AssignQuantityModal";
import { toast } from "react-toastify";
import { AdminStoreContext } from "../../../admin-account/admin.store";
import { ProductStoreContext } from "../../../product/product.store";
import OrderThrowAwayGrid from "../../components/OrderThrowAwayGrid";
import { retrieveFromStorage } from '../../../../common/utils/storage.util';
import ConfirmModal from "../../../../common/components/ConfirmModal";

const ThrowAwayPage = () => {
  const history = useHistory();
  /*
   * Translation
   */
  const {
    ADMIN_MANAGE_PRODUCT,
    BUTTONS_ADD_NEW,
    MESSAGES_UPDATE_SUCCESS,
    BUTTONS_RESTORE,
  } = I18N;

  const productStore = React.useContext(ProductStoreContext);

  const [showPopup, setShowPopup] = React.useState<boolean>(false);

  const [mode, setMode] = React.useState<string>("create");

  const [id, setId] = React.useState<number>(-1); //product ID

  const [criteriaDto, setCriteriaDto] = React.useState<any>({
    skip: 0,
    take: +pageSizeOptions[0],
    orderDirection: "DESC",
  });

  const actions: any[] = [
    {
      label: "Progress",
      status: "",
      action: (id: number) => {
        handleProgress(id);
      },
    },
    {
      label: "Cancel",
      status: "",
      action: (id: number) => {
        handleCancel(id);
      },
    },
  ];

  const [currentStatus, setCurrentStatus] = React.useState<any>();
  const [nextStatus, setNextStatus] = React.useState<any>();

  const setNextStep = (currentStep: string) => {
    let nextStatus = currentStep;
    if (currentStep === "Pending") {
      nextStatus = "Approved";
    } else if (currentStep === "Approved") {
      nextStatus = "Thrown";
    }
    setNextStatus(nextStatus);
  };

  const [showConfirmProgressPopup, setShowConfirmProgressPopup] =
    React.useState<boolean>(false);

  const [progressID, setProgressID] = React.useState<number>(-1);

  const handleCancel = async (id: number) => {
    const res = await adminStore.getThrowAwayStatus(id);
    setCurrentStatus(res[0][0].status);
    setNextStep(res[0][0].status);
    if (currentStatus === "Thrown" || res[0][0].status === "Thrown") {
      toast("This request has been done!");
      return;
    }
    const result = await adminStore.updateStatusThrowAway(
      id,
      "Cancelled"
    );
    if (result) {
      setProgressID(-1);
      adminStore.progressId = -1;
      toast("Cancel successfully!");
      await adminStore.getThrowAwayData(
        criteriaDto.skip,
        criteriaDto.take,
        ""
      );
    }
  };

  const handleProgress = async (id: number) => {
    const res = await adminStore.getThrowAwayStatus(id);
    setCurrentStatus(res[0][0].status);
    setNextStep(res[0][0].status);
    if (currentStatus === "Thrown" || res[0][0].status === "Thrown") {
      toast("This request has been done!");
      return;
    }

    if (currentStatus === "Cancelled" || res[0][0].status === "Cancelled") {
      toast("This request has been cancelled!");
      return;
    }

    adminStore.getThrowAwayData(criteriaDto.skip, criteriaDto.take, "");
    // setSelectedOrder(order);
    setShowConfirmProgressPopup(true);
    adminStore.progressId = id;
    setProgressID(id);
  };

  const handleOkProgress = async () => {
    
    if (currentStatus === "Pending" && retrieveFromStorage('role') === "OperationStaff") {
      setShowConfirmProgressPopup(false);
      return;
    }
    if (progressID !== -1 || adminStore.progressId !== -1) {
      const realId = progressID !== -1 ? progressID : adminStore.progressId
      const result = await adminStore.updateStatusThrowAway(
        realId,
        currentStatus
      );
      if (result) {
        setProgressID(-1);
        adminStore.progressId = -1;
        toast.success("Process successfully to the next step!");
        // if (retrieveFromStorage("role") === "WarehouseStaff") {
        //   orderStore.getOrderListByAdmin({
        //     ...criteriaDto,
        //     ...{ userId: retrieveFromStorage("loggedId") },
        //     ...{ warehouseId: retrieveFromStorage("warehouseId") },
        //   });
        // } else {
        //   orderStore.getOrderListByAdmin({
        //     ...criteriaDto,
        //     ...{ userId: retrieveFromStorage("loggedId") },
        //     ...{ storeId: retrieveFromStorage("storeId") },
        //   });
        // }
        await adminStore.getThrowAwayData(
          criteriaDto.skip,
          criteriaDto.take,
          ""
        );
      }
    }
    
    setShowConfirmProgressPopup(false);
  };

  const handleCancelProgress = () => {
    setShowConfirmProgressPopup(false);
  };

  const handleChangePageItem = (page: number) => {
    setCurrentPage(page);
    setCriteriaDto({
      skip: page > 1 ? (page - 1) * +pageSizeOptions[0] : 0,
      take: +pageSizeOptions[0],
      orderBy: "Id",
      orderDirection: "DESC",
    });
  };

  const [currentPage, setCurrentPage] = React.useState<number>(1);

  const adminStore = React.useContext(AdminStoreContext);

  const handleAssignClose = () => {
    setShowAssignPopup(false);
  };

  const handleAssignSubmit = async (inputedQuan: string) => {
    let res;
    res = await adminStore.assignRemoveProduct(parseInt(inputedQuan), id);
    if (res) {
      //adminStore.getAccounts(criteriaDto.skip, criteriaDto.take, "");
      toast("Remove request sent successfully!");
    } else {
      //adminStore.getAccounts(criteriaDto.skip, criteriaDto.take, "");
      toast("Error, please try again later");
    }
    setShowAssignPopup(false);
  };

  const [showAssignPopup, setShowAssignPopup] = React.useState<boolean>(false);

  const handleAssign = async (record: any) => {
    setId(record.Id);
    adminStore.curIdForThrowaway = record.Id;
    setShowAssignPopup(true);
  };

  const alertExceed = async (quan: number) => {
    const selectedQuan = productStore.products.filter((prod) => {
      return prod.Id === id;
    })[0].UnitsInStock;
    adminStore.isExceed = quan > selectedQuan;
    return;
  };

  React.useEffect(() => {
    async function getData() {
      adminStore.getThrowAwayData(criteriaDto.skip, criteriaDto.take, "");
    }
    getData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [adminStore, criteriaDto]);

  return (
    <>
      <AdminWrapper pageTitle={"Remove Broken Products"}>
        {/* <ActionBar actions={actionsBar} /> */}
        <Row>
          <h5>Disposal List</h5>
        </Row>
        <OrderThrowAwayGrid
          totals={adminStore.totalCountThrowAway}
          handleChangePageItem={handleChangePageItem}
          current={currentPage}
          actions={actions}
        />
        <Row>
          <h5>List product</h5>
        </Row>
        <ListProductToRemove handleAssign={handleAssign} />
        <AssignQuantityModal
          show={showAssignPopup}
          handleClose={handleAssignClose}
          handleSubmit={handleAssignSubmit}
          alertExceed={alertExceed}
          mode={mode}
        />
        <ConfirmModal
          show={showConfirmProgressPopup}
          handleCancel={handleCancelProgress}
          handleOk={handleOkProgress}
        >
          {retrieveFromStorage("role") === "OperationStaff" &&
          currentStatus === "Pending" ? (
            <p>{`Only Store Manager can approve!`}</p>
          ) : (
            <p>{`Are you sure want to process this request to step ${nextStatus}?`}</p>
          )}
        </ConfirmModal>
      </AdminWrapper>
    </>
  );
};

export default observer(ThrowAwayPage);
