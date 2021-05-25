import React from "react";
import { observer } from "mobx-react";
import { useHistory } from "react-router-dom";

import WarehouseWrapper from "../../components/WarehouseWrapper";

import { AdminStoreContext } from "../../../../modules/admin-account/admin.store";
import { CartStoreContext } from "../../../../themes/pos/stores/cart.store";
import { pageSizeOptions } from '../../../../common/constants/paging.constants';
import { message } from 'antd';
import OrderGrid from "../../components/OrderGrid";
import { scrollToElement } from "../../../../common/utils/normalize.ulti";
import SummaryOrder from "../../components/SumaryOrder";
import ConfirmModal from "../../../../common/components/ConfirmModal";
import Tracking from "../../components/Tracking";
import { ActionBarDto } from "../../../theme/theme.dto";
import { FilterByDto } from "../../../../common/dto/FilterBy.dto";
import ActionBar from "../../../theme/components/ActionBar";
import { AuthenticationStoreContext } from "../../../authenticate/authentication.store";
import { retrieveFromStorage, saveToStorage } from "../../../../common/utils/storage.util";
import accountStore from "../../../account/account.store";
import { StoreStoreContext } from "../../../admin-store/admin.store";
import { WarehouseStoreContext } from "../../../admin-warehouse/admin.store";

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
    history.push('/warehouse/new-request-goods-note');
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
   * set id of row that need to delete
   */
  const [deleteID, setDeleteID] = React.useState<number>(-1);

  /*
   * show hide new/edit driver popup
   */
  const [showConfirmPopup, setShowConfirmPopup] = React.useState<boolean>(
    false
  );

  const [isSelectedAll, setIsSelectedAll] = React.useState<boolean>(false);

  const handleEdit = (id: string) => {
    orderStore.resetCargoRequest();
    const editUrl = '/warehouse/request-goods-note/edit/:orderID'.replace(":orderID", id);
    history.push(editUrl);
  };

  /*
   * Action of Delete button
   *
   * @param number id
   * @return void
   */
  const handleDelete = async (id: number) => {
    setShowConfirmPopup(true);
    setDeleteID(id);
  };

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
    setShowConfirmPopup(false);
    if (deleteID !== -1) {
      const result = await orderStore.adminDeleteOrder(deleteID);
      if (result) {
        setDeleteID(-1);
        message.success("Deleted successfully");
        orderStore.getOrderListByAdmin({ ...criteriaDto, ...{userId: retrieveFromStorage("loggedId")} });
      }
    }
  };

  /*
   * Selected tracking order
   */
  const [selectedOrder, setSelectedOrder] = React.useState<any>();

  const [currentStore, setCurrentStore] = React.useState<any>();

  /*
   * Setting actions in grid
   */
  const actions: any[] = [
    {
      label: "Edit",
      status: "",
      action: (id: string) => {
        handleEdit(id);
      },
    },
    {
      label: "Delete",
      status: "",
      action: (id: number) => {
        handleDelete(id);
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
      label: "Tracking",
      status: "",
      action: (id: number) => {
        handleTracking(id);
        scrollToElement("order-tracking");
      },
    },
    {
      label: "Show secret code",
      status: "",
      action: (id: number) => {
        const orderById = orderStore.orders.filter((item) => item.Id === id);
        setSelectedOrder(orderById[0]);
        setShowPopup(true);
      },
    },
  ];

  const handleCancel = () => {
    setShowConfirmPopup(false);
  };

  const handleOrderSummary = async (id: number) => {
    resetData();
    const order = await orderStore.getOrderById(id);
    if (order.CreatedByAccount) {
      setCreatedBy(order.CreatedByAccount);
    }
    setSelectedOrder(order);
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
      const isGetStore = await storeStore.getAccountById(parseInt(retrieveFromStorage("storeId")!));
      const isGetWarehouse = await warehouseStore.getAccountById(orderStore.selectedOrder.warehouseId);
      setSelectedOrder(orderStore.selectedOrder);
      console.log(storeStore.currentStore);
      console.log(warehouseStore.currentWarehouse);
      if (orderById) {
        let tmpMarkers = new Array();
        tmpMarkers.push(
          {
            lat: +warehouseStore.currentWarehouse.AddressCoorLat,
            lng: +warehouseStore.currentWarehouse.AddressCoorLong,
          },
          {
            lat: +storeStore.currentStore.AddressCoorLat,
            lng: +storeStore.currentStore.AddressCoorLong,
          }
        );

        setMarkers(tmpMarkers);
      }
    },
    [orderStore]
  );

  React.useEffect(() => {
    async function getOrders() {
      orderStore.getOrderListByAdmin({ ...criteriaDto, ...{ userId: retrieveFromStorage("loggedId") } });
      setCurrentStore(retrieveFromStorage("storeId"));
    }
    getOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderStore, criteriaDto]);

  React.useEffect(() => {}, [
    authStore.loggedUser,
  ]);


  return (
    <>
      <WarehouseWrapper pageTitle={"Manage Goods Requests"}>
        <ActionBar actions={actionsBar} />
        <OrderGrid
          totals={orderStore.totalCount}
          selectedIds={ids}
          handleSelectedItems={handleSelectedItems}
          handleDelete={handleDelete}
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
          <p>{"Are you sure want to delete?"}</p>
        </ConfirmModal>
      </WarehouseWrapper>
    </>
  );
};

export default observer(ManageOrderAdminPage);
