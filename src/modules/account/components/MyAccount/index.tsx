import React from 'react';
import { observer } from 'mobx-react-lite';

import bsCustomFileInput from 'bs-custom-file-input';
import { AuthenticationStoreContext } from '../../../authenticate/authentication.store';
import { AccountStoreContext } from '../../account.store';
import { I18N } from '../../../../i18n.enum';
import { REFERENCE_TYPE } from '../../referenceType.enum';
import AccountForm from '../AccountForm';
import { message } from 'antd';
import { retrieveFromStorage } from '../../../../common/utils/storage.util';
import { toast } from 'react-toastify';

interface ComponentProps {
  className?: string;
  children?: React.ReactNode;
  handleChangeType?: any;
}

const MyAccount = (props: ComponentProps) => {
  const authStore = React.useContext(AuthenticationStoreContext);
  const accountStore = React.useContext(AccountStoreContext);

  /*
   * Props of Component
   */
  const { className, children } = props;
  const { MESSAGES_UPDATE_SUCCESS, MESSAGES_DELETE_SUCCESS } = I18N;

  const [avatar, setAvatar] = React.useState({
    file: null,
  });

  const [initData, setInitData] = React.useState<any>(null);

  const uploadFiles = async () => {
    if (avatar.file) {
      const result = await accountStore.uploadAvatar(
        avatar.file,
        authStore.loggedUser.Id
      );
      if (result) {
        toast(MESSAGES_UPDATE_SUCCESS);
        setAvatar({
          file: null,
        });
      }
    }
    return true;
  };

  const handleSubmit = async (values: any) => {
    accountStore.setAccountForm(values);
    console.log("HI ngan");
    const result = await uploadFiles();
    if (true) {
      const data = await accountStore.updateAccount(authStore.loggedUser.Id);
      if (data) {
        const user = await accountStore.getAccountInfo(authStore.loggedUser.Id);
        authStore.setLoggedUser(user ?? authStore.loggedUser);
        toast(MESSAGES_UPDATE_SUCCESS);
        window.location.reload(false);
      }
    }
  };

  /*
   * Action of Delete button
   *
   * @param number id
   * @return void
   */
  const handleDelete = async (type: REFERENCE_TYPE) => {
    if (type === REFERENCE_TYPE.PROFILE_IMG) {
      const result = accountStore.deleteAccountFile(
        authStore.loggedUser.Id,
        REFERENCE_TYPE.PROFILE_IMG
      );
      if (result) {
        authStore.loggedUser.avatarUrl = '';
        bsCustomFileInput.init();
        toast(MESSAGES_DELETE_SUCCESS);
      }
    }
  };

  const handleUploadAvatar = (event: any) => {
    setAvatar({ file: event.target.files[0] });
  };

  React.useEffect(() => {
    if (authStore.loggedUser) {
      setInitData(authStore.loggedUser);
    }
  }, [authStore.loggedUser]);

  return (
    <>
      {initData && (
        <AccountForm
          className={className}
          children={children}
          handleSubmitForm={handleSubmit}
          initialValues={initData}
          handleUploadAvatar={handleUploadAvatar}
          handleDeleteFiles={handleDelete}
        />
      )}
    </>
  );
};

export default observer(MyAccount);
