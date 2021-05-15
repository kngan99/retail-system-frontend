import React from 'react';
import { observer } from 'mobx-react-lite';
import mailLogo from '../../../assets/images/mail-icon.png';
import '../../footer/_footer.scss';

/*
 * Props of Component
 */
interface ComponentProps {
  className?: string;
}

const MailFooter = (props: ComponentProps) => {
  /*
   * Props of Component
   */
  const { className } = props;

  return (
    <>
      <div className={`logo-box ${className ? className : ''}`}>
        <div className="footer-info">
          <a href="mailto:ngan.le.bku@hcmut.edu.vn">
            <img src={mailLogo} alt="Logo" />
          </a>
          <div className="info-text">
            <a href="mailto:ngan.le.bku@hcmut.edu.vn">Send mail</a>
          </div>
        </div>
      </div>
    </>
  );
};

export default observer(MailFooter);
