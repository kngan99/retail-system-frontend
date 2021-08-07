import React from "react";
import { observer } from "mobx-react";
import { useHistory } from "react-router-dom";

import { AdminStoreContext } from "../../../../modules/admin-account/admin.store";
import cartStore, {
  CartStoreContext,
} from "../../../../themes/pos/stores/cart.store";
import { pageSizeOptions } from "../../../../common/constants/paging.constants";
import { message } from "antd";
import OrderGrid from "../../components/OrderGrid";
import { scrollToElement } from "../../../../common/utils/normalize.ulti";
import SummaryOrder from "../../components/SumaryOrder";
import ConfirmModal from "../../../../common/components/ConfirmModal";
import Tracking from "../../components/Tracking";
import { ActionBarDto } from "../../../theme/theme.dto";
import { FilterByDto } from "../../../../common/dto/FilterBy.dto";
import ActionBar from "../../../theme/components/ActionBar";
import { AuthenticationStoreContext } from "../../../authenticate/authentication.store";
import {
  retrieveFromStorage,
  saveToStorage,
} from "../../../../common/utils/storage.util";
import accountStore from "../../../account/account.store";
import { StoreStoreContext } from "../../../admin-store/admin.store";
import { WarehouseStoreContext } from "../../../admin-warehouse/admin.store";
import AdminWrapper from "../../../admin-account/components/AdminWrapper";
import { toast } from "react-toastify";

const ManageOrderAdminPage = () => {
  const orderStore = React.useContext(CartStoreContext);
  const adminStore = React.useContext(AdminStoreContext);
  const storeStore = React.useContext(StoreStoreContext);
  const warehouseStore = React.useContext(WarehouseStoreContext);
  const authStore = React.useContext(AuthenticationStoreContext);
  const history = useHistory();

  // -----------------------------
  // Action Bar - Process
  // -----------------------------

  const [actionsBar] = React.useState<ActionBarDto[]>([
    {
      label: "New",
      type: "primary",
      action: () => {
        handleCreate();
      },
    },
  ]);

  const handleCreate = () => {
    history.push("/warehouse/new-request-goods-note");
  };

  /*
   * Get list by criteria
   */
  const [criteriaDto, setCriteriaDto] = React.useState<any>({
    skip: 0,
    take: +pageSizeOptions[0],
    orderBy: "Id",
    orderDirection: "DESC",
  });

  /*
   * Seleted ids in grid
   */
  const [ids, setIds] = React.useState<string[]>([]);

  const [showPopup, setShowPopup] = React.useState<boolean>(false);

  const handleClose = () => {
    setShowPopup(false);
  };
  const [markers, setMarkers] = React.useState<any[]>([]);

  const [orderId, setOrderId] = React.useState<number>(-1);

  /*
   * Seleted ids in grid
   */
  const [filtered, setFiltered] = React.useState<boolean>(false);

  const [showSummary, setShowSummary] = React.useState<boolean>(false);

  const [createdBy, setCreatedBy] = React.useState<any>({});

  /*
   * Selected tracking order
   */
  const [notes, setNotes] = React.useState<any>([]);

  const [currentOrder, setCurrentOrder] = React.useState<any>();

  /*
   * Setting filters
   */
  // const filters: FilterByDto[] = [
  //   {
  //     key: 'orderId',
  //     label: 'orderId',
  //   },
  //   {
  //     key: 'status',
  //     label: '',
  //     type: FILTER_TYPE.SELECT,
  //     options: OrderStatus,
  //   },
  //   {
  //     key: 'customerEmail',
  //     label: 'customerEmail',
  //   },
  // ];

  /*
   * Action of search button
   * @param: any e
   * @param: FilterByDto filterType
   * @return: void
   */
  const handleFilter = (searchKey: string) => {
    setCriteriaDto({
      skip: 0,
      take: +pageSizeOptions[0],
      searchBy: "",
      searchKeyword: searchKey,
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

  const setNextStep = (currentStep: string) => {
    let nextStatus = currentStep;
    if (currentStep === "Created") {
      nextStatus = "Confirmed";
    } else if (currentStep === "Confirmed") {
      nextStatus = "Delivering";
    } else if (currentStep === "Delivering") {
      nextStatus = "Success";
    }
    setNextStatus(nextStatus);
  };
  // -----------------------------
  // Grid Process
  // -----------------------------

  /*
   * set id of row that need to delete
   */
  const [deleteID, setDeleteID] = React.useState<number>(-1);

  const [progressID, setProgressID] = React.useState<number>(-1);

  /*
   * show hide new/edit driver popup
   */
  const [showConfirmPopup, setShowConfirmPopup] =
    React.useState<boolean>(false);

  const [showConfirmProgressPopup, setShowConfirmProgressPopup] =
    React.useState<boolean>(false);

  const [isSelectedAll, setIsSelectedAll] = React.useState<boolean>(false);

  const handleEdit = (id: string) => {
    orderStore.resetCargoRequest();
    const editUrl = "/warehouse/request-goods-note/edit/:orderID".replace(
      ":orderID",
      id
    );
    history.push(editUrl);
  };

  /*
   * Action of Delete button
   *
   * @param number id
   * @return void
   */
  const handleCancelReq = async (id: number) => {
    const res = await cartStore.getCargoReqStatus(id);
    setCurrentStatus(res[0][0].Status);
    setNextStep(res[0][0].Status);
    if (currentStatus === "Cancelled" || res[0][0].Status === "Cancelled") {
      toast("This request has been cancelled!");
      return;
    }
    if (currentStatus === "Success" || res[0][0].Status === "Success") {
      toast("This request has been done!");
      return;
    }
    setShowConfirmPopup(true);
    setDeleteID(id);
  };

  const handleProgress = async (id: number) => {
    const res = await cartStore.getCargoReqStatus(id);
    setCurrentStatus(res[0][0].Status);
    setNextStep(res[0][0].Status);
    if (currentStatus === "Cancelled" || res[0][0].Status === "Cancelled") {
      toast("This request has been cancelled!");
      return;
    }
    if (currentStatus === "Success" || res[0][0].Status === "Success") {
      toast("This request has been done!");
      return;
    }
    const order = await orderStore.getOrderById(id);
    setSelectedOrder(order);
    setShowConfirmProgressPopup(true);
    setProgressID(id);
  };

  const waitForSelectedOrder = (func:any, value: any) => {
    if(typeof selectedOrder !== "undefined"){
        func(value);
    }
    else{
        setTimeout(waitForSelectedOrder, 250);
    }
}

  /*
   * Action of selecting all items
   * @param: string[] items
   * @return: void
   */
  const handleSelectedItems = (items: string[]) => {
    if (items[0] === "-1") setIsSelectedAll(true);
    else setIsSelectedAll(false);
    setIds(items);
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
      orderBy: "Id",
      orderDirection: "DESC",
    });
  };

  const handleOk = async () => {
    if (currentStatus === "Delivering") {
      setShowConfirmPopup(false);
      return;
    }
    setShowConfirmPopup(false);
    if (deleteID !== -1) {
      const result = await orderStore.cancelCargoReq(deleteID);
      if (result) {
        setDeleteID(-1);
        toast("Cancel successfully");
        if (retrieveFromStorage("role") === "WarehouseStaff") {
          orderStore.getOrderListByAdmin({
            ...criteriaDto,
            ...{ userId: retrieveFromStorage("loggedId") },
            ...{ warehouseId: retrieveFromStorage("warehouseId") },
          });
        } else {
          orderStore.getOrderListByAdmin({
            ...criteriaDto,
            ...{ userId: retrieveFromStorage("loggedId") },
            ...{ storeId: retrieveFromStorage("storeId") },
          });
        }
      }
    }
  };

  const handleOkProgress = async () => {
    if (retrieveFromStorage("role")! === "WarehouseStaff") {
      if (
        currentStatus === "Delivering" &&
        retrieveFromStorage("role") === "WarehouseStaff"
      ) {
        setShowConfirmProgressPopup(false);
        return;
      } else if (
        retrieveFromStorage("role") !== "WarehouseStaff" &&
        (currentStatus === "Created" || currentStatus === "Confirmed")
      ) {
        setShowConfirmProgressPopup(false);
        return;
      }
      setShowConfirmProgressPopup(false);
      if (progressID !== -1) {
        const result = await orderStore.updateStatusCargoReq(
          progressID,
          currentStatus
        );
        if (result) {
          setProgressID(-1);
          toast("Process successfully to the next step!");
          if (retrieveFromStorage("role") === "WarehouseStaff") {
            orderStore.getOrderListByAdmin({
              ...criteriaDto,
              ...{ userId: retrieveFromStorage("loggedId") },
              ...{ warehouseId: retrieveFromStorage("warehouseId") },
            });
          } else {
            orderStore.getOrderListByAdmin({
              ...criteriaDto,
              ...{ userId: retrieveFromStorage("loggedId") },
              ...{ storeId: retrieveFromStorage("storeId") },
            });
          }
        }
      }
    }
    //TO STORE
    else {
      if (
        currentStatus === "Delivering" &&
        parseInt(retrieveFromStorage("storeId")!) === selectedOrder?.ToStoreId
      ) {
        setShowConfirmProgressPopup(false);
        return;
      } else if (
        parseInt(retrieveFromStorage("storeId")!) !==
          selectedOrder?.ToStoreId &&
        (currentStatus === "Created" || currentStatus === "Confirmed")
      ) {
        setShowConfirmProgressPopup(false);
        return;
      }
      setShowConfirmProgressPopup(false);
      if (progressID !== -1) {
        const result = await orderStore.updateStatusCargoReq(
          progressID,
          currentStatus
        );
        if (result) {
          setProgressID(-1);
          toast("Process successfully to the next step!");
          orderStore.getOrderListByAdmin({
            ...criteriaDto,
            ...{ userId: retrieveFromStorage("loggedId") },
            ...{ storeId: retrieveFromStorage("storeId") },
          });
        }
      }
    }
  };

  const handleDetail = (id) => {
    toast("Click on Id to see Detail");
  };

  /*
   * Selected tracking order
   */
  const [selectedOrder, setSelectedOrder] = React.useState<any>();

  const [toStoreData, setToStoreData] = React.useState<any>();

  const [currentStore, setCurrentStore] = React.useState<any>();

  const [currentStatus, setCurrentStatus] = React.useState<any>();

  const [nextStatus, setNextStatus] = React.useState<any>();

  /*
   * Setting actions in grid
   */
  const actions: any[] = [
    // {
    //   label: "Edit",
    //   status: "",
    //   action: (id: string) => {
    //     handleEdit(id);
    //   },
    // },
    {
      label: "Progress",
      status: "",
      action: (id: number) => {
        handleProgress(id);
      },
    },
    {
      label: "Detail",
      status: "",
      action: (id: number) => {
        handleDetail(id);
      },
    },
    {
      label: "Cancel",
      status: "",
      action: (id: number) => {
        handleCancelReq(id);
      },
    },
    // {
    //   label: "Cancel by employee",
    //   status: "",
    //   action: (id: number) => {
    //     handleCustomerCancelling(id);
    //   },
    //   checkNewStatus: (status: string) => {
    //     return isPossibleToCustomerCancelByAdmin(status);
    //   },
    // },

    {
      label: "Places on Map",
      status: "",
      action: (id: number) => {
        handleTracking(id);
        scrollToElement("order-tracking");
      },
    },
  ];

  const handleCancel = () => {
    setShowConfirmPopup(false);
  };

  const handleCancelProgress = () => {
    setShowConfirmProgressPopup(false);
  };

  const handleOrderSummary = async (id: number) => {
    resetData();
    const order = await orderStore.getOrderById(id);
    if (order.CreatedByAccount) {
      setCreatedBy(order.CreatedByAccount);
    }
    setSelectedOrder(order);
    if (order.Warehouse) {
      setToStoreData(null);
    }
    if (order.ToStoreId) {
      const toStore = await storeStore.getAccountById(order.ToStoreId);
      setToStoreData(storeStore.currentStore);
    }
    setShowSummary(true);
    scrollToElement("summary-popup");
  };

  const handleCloseSummary = () => {
    setShowSummary(false);
  };

  const resetData = () => {
    setNotes(null);
    setCreatedBy(null);
  };

  const handleTracking = React.useCallback(
    async (id: number) => {
      let orderById = await orderStore.getOrderById(id);
      let isGetWarehouse, isGetToStore;
      const isGetStore = await storeStore.getAccountById(
        parseInt(retrieveFromStorage("storeId")!)
      );
      if (orderStore.selectedOrder?.warehouseId) {
        isGetWarehouse = await warehouseStore.getAccountById(
          orderStore.selectedOrder?.warehouseId
        );
        isGetToStore = null;
      } else {
        isGetToStore = await storeStore.getToStoreById(
          orderStore.selectedOrder?.ToStoreId
        );
        isGetWarehouse = null;
      }
      setSelectedOrder(orderStore.selectedOrder);
      if (orderById) {
        let tmpMarkers = [] as any;
        if (orderById) {
          if (isGetWarehouse) {
            tmpMarkers.push(
              {
                lat: warehouseStore.currentWarehouse.AddressCoorLat,
                lng: warehouseStore.currentWarehouse.AddressCoorLong,
                addr: warehouseStore.currentWarehouse.Address,
              },
              {
                lat: storeStore.currentStore.AddressCoorLat,
                lng: storeStore.currentStore.AddressCoorLong,
                addr: storeStore.currentStore.Address,
              }
            );
          } else if (isGetToStore) {
            tmpMarkers.push(
              {
                lat: storeStore.currentToStore.AddressCoorLat,
                lng: storeStore.currentToStore.AddressCoorLong,
                addr: storeStore.currentToStore.Address,
              },
              {
                lat: storeStore.currentStore.AddressCoorLat,
                lng: storeStore.currentStore.AddressCoorLong,
                addr: storeStore.currentStore.Address,
              }
            );
          }
        }

        setMarkers(tmpMarkers);
      }
      console.log(markers);
    },
    [markers, orderStore, storeStore, warehouseStore]
  );

  React.useEffect(() => {
    async function getOrders() {
      if (retrieveFromStorage("role") === "WarehouseStaff") {
        orderStore.getOrderListByAdmin({
          ...criteriaDto,
          ...{ userId: retrieveFromStorage("loggedId") },
          ...{ warehouseId: retrieveFromStorage("warehouseId") },
        });
      } else {
        orderStore.getOrderListByAdmin({
          ...criteriaDto,
          ...{ userId: retrieveFromStorage("loggedId") },
          ...{ storeId: retrieveFromStorage("storeId") },
        });
      }
      setCurrentStore(retrieveFromStorage("storeId"));
    }
    getOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderStore, criteriaDto]);

  React.useEffect(() => {}, [authStore.loggedUser]);

  return (
    <>
      <AdminWrapper pageTitle={"Manage Goods Requests"}>
        {retrieveFromStorage("role") !== "WarehouseStaff" && (
          <ActionBar actions={actionsBar} />
        )}
        <OrderGrid
          totals={orderStore.totalCount}
          selectedIds={ids}
          handleSelectedItems={handleSelectedItems}
          handleDelete={handleCancelReq}
          handleEdit={handleEdit}
          handleChangePageItem={handleChangePageItem}
          current={currentPage}
          actions={actions}
          handleOrderSummary={handleOrderSummary}
        />
        {showSummary && (
          <>
            <SummaryOrder
              title={"Order Summary"}
              handleClose={handleCloseSummary}
              orderItem={selectedOrder}
              createdByData={createdBy}
              createdByTitle={"Created By"}
              id="summary-popup"
              notes={notes}
              toStoreData={toStoreData}
            />
          </>
        )}
        <Tracking
          selectedOrder={selectedOrder}
          markers={markers}
          id="order-tracking"
        />
        <ConfirmModal
          show={showConfirmPopup}
          handleCancel={handleCancel}
          handleOk={handleOk}
        >
          {currentStatus === "Delivering" ? (
            <p>
              {
                "This request order is delivering. You cannot cancel a delivering request"
              }
            </p>
          ) : (
            <p>{"Are you sure want to cancel this request?"}</p>
          )}
        </ConfirmModal>
        <ConfirmModal
          show={showConfirmProgressPopup}
          handleCancel={handleCancelProgress}
          handleOk={handleOkProgress}
        >
          {retrieveFromStorage("role") === "WarehouseStaff" ||
          (retrieveFromStorage("role") !== "WarehouseStaff" &&
            parseInt(retrieveFromStorage("storeId")!) ===
              selectedOrder?.ToStoreId) ? (
            !(currentStatus === "Created" || currentStatus === "Confirmed") ? (
              <p>
                {
                  "Only Store Manager and Store Warehouse Manager of Store created can process on this step. Please contact the Store (You can find the contact in request detail)"
                }
              </p>
            ) : (
              <p>{`Are you sure want to process this request to step ${nextStatus}?`}</p>
            )
          ) : !(currentStatus === "Delivering") ? (
            <p>
              {
                "Only Manager of the destination can process on this step. Please contact the destination (You can find the contact in request detail)"
              }
            </p>
          ) : (
            <p>{`Are you sure want to process this request to step ${nextStatus}?`}</p>
          )}
        </ConfirmModal>
      </AdminWrapper>
    </>
  );
};

export default observer(ManageOrderAdminPage);
