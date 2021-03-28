import React from 'react';
import { observer } from 'mobx-react-lite';
import { useHistory } from 'react-router-dom';
import { Nav } from 'react-bootstrap';
//import { AuthenticationStoreContext } from '@/modules/account/authentication.store';
import { useMediaQuery } from 'react-responsive';
import logoSvg from '../../../../../src/logo.svg';
import { I18N } from '../../../../i18n.enum';
import { MenuDto } from '../../../theme/theme.dto';
import { LogoDto } from '../../../../common/dto/Logo.dto';
import { adminMenu } from '../../../theme/theme.constrants';
import { CommonStoreContext } from '../../../../common/common.store';

/*
 * Props of Component
 */
interface ComponentProps {
  style?: React.CSSProperties;
  className?: string;
  children?: React.ReactNode;
  logo?: LogoDto;
}

const AdminMenu = (props: ComponentProps) => {
  const history = useHistory();
  //const authenticationStore = React.useContext(AuthenticationStoreContext);
  const commonStore = React.useContext(CommonStoreContext);

  /*
   * Props of Component
   */
  const {
    style,
    className,
    children,
    logo = {
      className: '',
      url: logoSvg,
      alt: 'Logo',
    },
  } = props;

  const { ADMIN_MENU_LOG_OUT } = I18N;

  /*
   * Action of logout link
   * @params: void
   * @return: void
   */
  const handleLogout = () => {
    //authenticationStore.logout(history, ADMIN_USER_ROUTERS.ADMIN_LOGIN);
    window.alert('need authStore');
  };

  /*
   * Setting Menu Responsive
   */
  const [showMenu, setShowMenu] = React.useState<boolean>(false);

  const handleMediaQueryChange = (matches: boolean) => {
    if (matches === false) setShowMenu(matches);
  };

  const isMobile = useMediaQuery(
    {
      query: '(max-width: 991px)',
    },
    undefined,
    handleMediaQueryChange
  );

  const changeShowHideMenu = () => {
    setShowMenu(!showMenu);
  };

  const handleToUrl = (url: string) => {
    history.push(url);
    commonStore.setActiveMenu(url);
  };

  return (
    <>
      <div className="menu-wrapper">
        {isMobile && (
          <div
            className={`menu-icon ${showMenu ? 'close' : ''}`}
            onClick={() => changeShowHideMenu()}
          >
            {!showMenu && <i className="ico ico-menu"></i>}
            {showMenu && <i className="ico ico-delete"></i>}
          </div>
        )}
        <div
          className={`flex-column main-menu ${className ? className : ''} ${
            isMobile ? 'menu-mobile' : 'menu-desktop'
          } ${showMenu ? 'show' : ''}`}
        >
          {logo && (
            <div
              onClick={() => {
                history.push('/accounts-manage');
              }}
              className="logo-menu"
            >
              <img
                className={logo.className ? logo.className : ''}
                src={logoSvg}
                alt={logo.alt ? logo.alt : 'Logo'}
              />
            </div>
          )}
          <Nav className="menu-items" style={style}>
            {adminMenu.map((item: MenuDto, index) => (
              <Nav.Link
                className={`item ${
                  commonStore.activeMenu === item.url ? 'active' : ''
                }`}
                eventKey={item.url}
                onClick={() => handleToUrl(item.url)}
                key={`menu-${index}`}
              >
                {item.icon && <i className={`ico ${item.icon}`}></i>}
                <span>{(item.label)}</span>
              </Nav.Link>
            ))}
            <Nav.Link className="item" onClick={() => handleLogout()}>
              <i className="ico ico-logout"></i>
              <span>{(ADMIN_MENU_LOG_OUT)}</span>
            </Nav.Link>
          </Nav>
          {children}
        </div>
      </div>
    </>
  );
};

export default observer(AdminMenu);
