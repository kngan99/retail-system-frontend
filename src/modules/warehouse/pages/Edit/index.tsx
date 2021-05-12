import React from 'react';
import { observer } from 'mobx-react';
import { useParams, useHistory } from 'react-router-dom';
import { CartStoreContext } from '../../../../themes/pos/stores/cart.store';
import { message } from 'antd';
import WarehouseWrapper from '../../components/WarehouseWrapper';
import ConfirmModal from '../../../../common/components/ConfirmModal';
import PreCartPageEdit from '../../components/PosEdit/PreCartPageEdit';
// // import { ADMIN_ORDER_ROUTERS } from '@/modules/order/router.enum';
// // import { SERVICE_TYPE, ACTIONS_MODE } from '@/modules/order/order.enum';
// import { OrderListDto } from '@/modules/order/order.dto';

const EditOrderAdminPage = () => {
  const orderStore = React.useContext(CartStoreContext);
  const history = useHistory();
  const { orderID } = useParams() as any;

  /*
   * Get list by criteria
   */
  const [criteriaDto] = React.useState<any>({
    order: { Id: orderID },
  });

  /*
   * show hide new/edit driver popup
   */
  const [showConfirmPopup, setShowConfirmPopup] = React.useState<boolean>(
    false
  );

  /*
   * action of delete button
   *
   * @param void
   * @return void
   */
  const handleDelete = () => {
    setShowConfirmPopup(true);
  };

  const handleOk = async () => {
    setShowConfirmPopup(false);
    if (orderID) {
      const result = await orderStore.adminDeleteOrder(orderID);
      if (result) {
        message.success('Update successfully')
        history.push('/warehouse/request-goods-note-cart/manage');
      }
    }
  };

  const handleCancel = () => {
    setShowConfirmPopup(false);
  };

  React.useEffect(() => {
    orderStore.editingAdminOrder = null;
    orderStore.getOrderByIdByAdmin(orderID);
  }, [orderStore, criteriaDto, orderID]);

  return (
    <>
      <WarehouseWrapper
        pageTitle={'Edit Request'}
      >
        {orderStore.editingAdminOrder &&
          <>
          <PreCartPageEdit>
          </PreCartPageEdit>
          </>
          }
        <ConfirmModal
          show={showConfirmPopup}
          handleCancel={handleCancel}
          handleOk={handleOk}
        >
          <p>Are you sure want to delete? </p>
        </ConfirmModal>
      </WarehouseWrapper>
    </>
  );
};

export default observer(EditOrderAdminPage);
