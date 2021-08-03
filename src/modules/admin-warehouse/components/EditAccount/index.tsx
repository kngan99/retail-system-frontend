import React from 'react';
import { observer } from 'mobx-react-lite';

import bsCustomFileInput from 'bs-custom-file-input';
import { AuthenticationStoreContext } from '../../../authenticate/authentication.store';
import { I18N } from '../../../../i18n.enum';
import { REFERENCE_TYPE } from '../../../account/referenceType.enum';
import AccountForm from '../../../account/components/AccountForm';
import { AccountStoreContext } from '../../../account/account.store';
import { message} from 'antd';
import { toast } from 'react-toastify';

interface ComponentProps {
  className?: string;
  children?: React.ReactNode;
  handleChangeType?: any;
}

const EditAccount = (props: ComponentProps) => {
  const authStore = React.useContext(AuthenticationStoreContext);
  const accountStore = React.useContext(AccountStoreContext);
  let id: number = 0;

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
        id
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
    const result = await uploadFiles();
    if (result) {
      const data = await accountStore.updateAccount(id);
      if (data) {
        const user = await accountStore.getAccountInfo(id);
        authStore.setLoggedUser(user ?? authStore.loggedUser);
        toast(MESSAGES_UPDATE_SUCCESS);
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
        id,
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
    id = parseInt(window.location.pathname.split('/')[1]);
    console.log(window.location.pathname);
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

export default observer(EditAccount);
