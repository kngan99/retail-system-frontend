import React from "react";
import { observer } from "mobx-react";
import { useHistory, useParams } from "react-router-dom";

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
import ReturnedOrderGrid from "../../components/ReturnedOrderGrid";
import ReturnedSummaryOrder from "../../components/ReturnedSumaryOrder";


const ReturnProducts = () => {
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
    const reqId = parseInt(window.location.pathname.split('/')[3]);
    history.push(`/warehouse/new-return-goods-note/${reqId}`);
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
      nextStatus = "Shipper Coming";
    } else if (currentStep === "Shipper Coming") {
      nextStatus = "Picked";
    } else if (currentStep === "Picked") {
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
    const res = await cartStore.getReturnedCargoReqStatus(id);
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
    const res = await cartStore.getReturnedCargoReqStatus(id);
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
    const order = await cartStore.getReturnedOrderById(id);
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
    if (currentStatus === "Picked" || currentStatus === "Shipper Coming") {
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
    if ((currentStatus === "Picked" || currentStatus === "Shipper Coming") && retrieveFromStorage('role')==='WarehouseStaff') {
      setShowConfirmProgressPopup(false);
      return;
    }
    else if (retrieveFromStorage('role') !=='WarehouseStaff' &&(currentStatus === "Created" || currentStatus === "Confirmed")) {
      setShowConfirmProgressPopup(false);
      return;
    }
    setShowConfirmProgressPopup(false);
    if (progressID !== -1) {
      const result = await cartStore.updateStatusReturnedCargoReq(progressID,currentStatus);
      if (result) {
        setProgressID(-1);
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
        const orderID = parseInt(window.location.pathname.split('/')[3]);
        await cartStore.getReturnedOrdersByOrderId(orderID);
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
  ];

  const handleCancel = () => {
    setShowConfirmPopup(false);
  };

  const handleCancelProgress = () => {
    setShowConfirmProgressPopup(false);
  };

  const handleOrderSummary = async (id: number) => {
    resetData();
    const order = await orderStore.getReturnedOrderById(id);
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

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const init = async () => {
    const orderID = parseInt(window.location.pathname.split('/')[3]);
    await cartStore.getReturnedOrdersByOrderId(orderID);
    // await setNotes(cartStore.selectedOrder.Notes);
    // cartStore.selectedOrder.products.forEach((product) => {
    //   return productsInCart.push({
    //     Id: product.Id,
    //     ProductName: product.ProductName,
    //     CategoryId: product.CategoryId,
    //     QuantityPerUnit: product.QuantityPerUnit,
    //     UnitPrice: product.UnitPrice,
    //     UnitsInStock: product.UnitsInStock,
    //     ReorderLevel: product.ReorderLevel,
    //     Discontinued: product.Discontinued,
    //     Quantity: 0,
    //     Discount: 0,
    //     Total: 0,
    //     RawTotal: 0,
    //   });
    // })
    // await cartStore.setProductInCart(productsInCart);
    // await cartStore.setProductsInCartQuantity();
    // await cartStore.setProductsInCartTotal();
  };

  React.useEffect(() => {
    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cartStore, criteriaDto]);

  React.useEffect(() => {}, [authStore.loggedUser]);

  return (
    <>
      <AdminWrapper pageTitle={"Manage Returns Requests"}>
        {retrieveFromStorage("role") !== "WarehouseStaff" && (
          <ActionBar actions={actionsBar} />
        )}
        <ReturnedOrderGrid
          totals={cartStore.totalReturnedOrders}
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
            <ReturnedSummaryOrder
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
        <ConfirmModal
          show={showConfirmPopup}
          handleCancel={handleCancel}
          handleOk={handleOk}
        >
          {(currentStatus === "Picked" || currentStatus === "Shipper Coming") ? (
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
          {(retrieveFromStorage("role") === "WarehouseStaff") ? (
            !(currentStatus === "Created" || currentStatus === "Confirmed") ? (
              <p>{"Only Store Manager and Store Warehouse Manager can process on this step. Please contact the Store (You can find the contact in request detail)"}</p>
            ) : (
              <p>{`Are you sure want to process this request to step ${nextStatus}?`}</p>
            )
          ) : (
            !(currentStatus === "Picked" || currentStatus === "Shipper Coming") ? (
              <p>{"Only Branch Warehouse Staff can process on this step. Please contact the Warehouse (You can find the contact in request detail)"}</p>            ) : (
              <p>{`Are you sure want to process this request to step ${nextStatus}?`}</p>
            )
          )}
        </ConfirmModal>
      </AdminWrapper>
    </>
  );
};

export default observer(ReturnProducts);
