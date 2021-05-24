import React from 'react';
import { observer } from 'mobx-react';
import AdminWrapper from '../../../admin-account/components/AdminWrapper';
import { AuthenticationStoreContext } from '../../../authenticate/authentication.store';
import EditAccount from '../../components/EditAccount';

const EditAccountAdminPage = () => {
  const authStore = React.useContext(AuthenticationStoreContext);

  React.useEffect(() => {}, [
    authStore.loggedUser,
  ]);

  return (
    <>
      <AdminWrapper pageTitle={"Account Detail"}>
        {authStore.loggedUser && (
          <>
            <EditAccount/>
          </>
        )}
      </AdminWrapper>
    </>
  );
};

export default observer(EditAccountAdminPage);
