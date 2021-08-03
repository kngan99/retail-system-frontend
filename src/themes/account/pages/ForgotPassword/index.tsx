import React from 'react';
import { observer } from 'mobx-react';
import { useHistory } from 'react-router-dom';
import { AccountStoreContext } from '../../../../modules/account/account.store';
import OnePage from '../../../../modules/theme/components/OnePage';
import CustomerForgotForm from '../../../../modules/account/components/CustomerForgotForm';
import { message } from 'antd';
import { toast } from 'react-toastify';
const ForgotCustomerPage = () => {
  const history = useHistory();
  const accountStore = React.useContext(AccountStoreContext);


  const handleForgotPassword = async (values: any) => {
    const result = await accountStore.forgotPassword(
      values.email
    );
    if (result) {
      toast('Please check your email');
      history.push(
        '/'
      );
    }
  };

  return (
    <>
      <OnePage title={`Forgot password`}>
        <CustomerForgotForm
          handleForgotPassword={handleForgotPassword}
          handleBack={false}
          formTitle={`Forgot password`}
        >
          Please input your email address (that you register with Retail System) to reset your password
        </CustomerForgotForm>
      </OnePage>
    </>
  );
};

export default observer(ForgotCustomerPage);
