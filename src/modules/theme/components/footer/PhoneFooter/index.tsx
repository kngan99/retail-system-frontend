import React from 'react';
import { observer } from 'mobx-react-lite';
import phoneLogo from '../../../assets/images/phone-icon.png';
import '../../footer/_footer.scss';

/*
 * Props of Component
 */
interface ComponentProps {
  className?: string;
}

const PhoneFooter = (props: ComponentProps) => {
  /*
   * Props of Component
   */
  const { className } = props;

  return (
    <>
      <div className={`logo-box ${className ? className : ''}`}>
        <div className="footer-info">
          <a href="tel: 0386105775">
            <img src={phoneLogo} alt="Logo" />
          </a>
          <div className="info-text">
            <a href="tel: 0386105775">0386105775</a>
          </div>
        </div>
      </div>
    </>
  );
};

export default observer(PhoneFooter);
