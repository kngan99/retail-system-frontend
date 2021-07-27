import React from 'react';
import { observer } from 'mobx-react';
import AdminWrapper from '../../../admin-account/components/AdminWrapper';
import { AuthenticationStoreContext } from '../../../authenticate/authentication.store';
import MyAccount from '../../components/MyAccount';

const SetupCustomerPage = () => {
  const authStore = React.useContext(AuthenticationStoreContext);

  React.useEffect(() => {}, [
    authStore.loggedUser,
  ]);

  return (
    <>
      <AdminWrapper pageTitle={"Account Setup"}>
        {authStore.loggedUser && (
          <>
            <MyAccount/>
          </>
        )}
      </AdminWrapper>
    </>
  );
};

export default observer(SetupCustomerPage);
