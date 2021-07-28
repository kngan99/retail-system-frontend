import React from 'react';
import { observer } from 'mobx-react-lite';
import { useHistory } from 'react-router-dom';
import logoSvg from '../../../../../src/logo1.svg';
import { AuthenticationStoreContext } from '../../../authenticate/authentication.store';
import { I18N } from '../../../../i18n.enum';
import { DEFAULT_ROUTERS } from '../../router.enum';
import { normalizeName } from '../../../../common/utils/normalize.ulti';
import { retrieveFromSession, retrieveFromStorage } from '../../../../common/utils/storage.util';

/*
 * Props of Component
 */
interface ComponentProps {
  className?: string;
}

const AccountSummary = (props: ComponentProps) => {
  const authStore = React.useContext(AuthenticationStoreContext);

  const history = useHistory();

  /*
   * Props of Component
   */
  const { className } = props;

  const { TOPMENU_WELCOME } = I18N;


  return (
    <>
      <div className={`item box-info ${className ? className : ''}`}>
        <span
          onClick={() => {
            history.push(DEFAULT_ROUTERS.SETUP);
          }}
        >
          <>
              Welcome {retrieveFromStorage('fullname')} the {retrieveFromStorage('role')}
          </>
        </span>
        <div
          className="info-avatar"
          onClick={() => {
            history.push(DEFAULT_ROUTERS.SETUP);
          }}
        >
          <img
            src={
                authStore.loggedUser?.avatarUrl
                ? authStore.loggedUser?.avatarUrl
                : logoSvg
            }
            alt="Logo"
            style={{ width: '56px', height: '56px', margin: '-25px 0' }}
          />
        </div>
      </div>
    </>
  );
};

export default observer(AccountSummary);
