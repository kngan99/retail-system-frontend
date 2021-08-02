import React from 'react';
import { useHistory, useParams } from 'react-router-dom';
import OnePage from '../../../../modules/theme/components/OnePage';
import { AccountStoreContext } from '../../../../modules/account/account.store';
import { AuthenticationStoreContext } from '../../../../modules/authenticate/authentication.store';
import CustomerResetForm from '../../../../modules/account/components/CustomerResetForm';
import { observer } from 'mobx-react';

export interface ResetPasswordDto {
  token: string;
  password: string;
}

const ResetPasswordCustomerPage = () => {
  const history = useHistory();
  const { token } = useParams() as any;
  const accountStore = React.useContext(AccountStoreContext);
  const authStore = React.useContext(AuthenticationStoreContext);

  const handleConfirm = async (values: any) => {
    const resetPasswordFormValue: ResetPasswordDto = {
      password: values.password,
      token,
    };
    await authStore.clearTmpUser();
    const result = await accountStore.resetPassword(resetPasswordFormValue);

    if (result) {
      history.push('/account/login');
    }
  };

  const callbackValidate = React.useCallback(async () => {
    return await authStore.validateResetToken(token, history);
  }, [authStore, history, token]);

  React.useEffect(() => {
    callbackValidate();
  }, [callbackValidate]);

  return (
    <>
      <OnePage title={'Reset password'}>
        <CustomerResetForm
          handleConfirm={handleConfirm}
          userEmail={authStore.tmpUser?.email}
        />
      </OnePage>
    </>
  );
};

export default observer(ResetPasswordCustomerPage);
