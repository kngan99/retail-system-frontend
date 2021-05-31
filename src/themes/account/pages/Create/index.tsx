import React from 'react';
import { observer } from 'mobx-react';
import { useHistory } from 'react-router-dom';
import { AccountStoreContext } from '../../../../modules/account/account.store';
import OnePage from '../../../../modules/theme/components/OnePage';
import DefaultRegisterForm from '../../../../modules/account/components/DefaultRegisterForm';
import { DEFAULT_ROUTERS } from '../../../../modules/account/router.enum';
import { CreateUserDto } from '../../../../modules/account/account.dto';
import { message } from 'antd';
const CreateAccountPage = () => {
  const accountStore = React.useContext(AccountStoreContext);
  const history = useHistory();

  /*
   * Setting required fields of register form
   * @params: void
   * @return: json
   */
  const requiredFields = {
    email: true,
    password: true,
    confirmPassword: true,
    phone: false,
  };

  /*
   * Action of Sign up button
   * @params: void
   * @return: void
   */
  const handleSignUp = async (values: any) => {
    const createUserData: CreateUserDto = {
      email: values.email.trim(),
      password: values.password,
      homephone: values.phone,
    };

    accountStore.setCreateUserForm(createUserData);
    await accountStore.register();
    //const result = await accountStore.register();
    // console.log(result);
    // if (result) {
      accountStore.resetCreateUserForm();
      history.push(DEFAULT_ROUTERS.LOGIN);
      message.success('Register successfully! Check your email to verified and login');
    //}
  };

  return (
    <>
      <OnePage title="Register">
        <DefaultRegisterForm
          handleRegister={handleSignUp}
          required={requiredFields}
        />
      </OnePage>
    </>
  );
};

export default observer(CreateAccountPage);
