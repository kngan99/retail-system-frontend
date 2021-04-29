import React from 'react';
import { observer } from 'mobx-react-lite';
import fbLogo from '../../../assets/images/fb-icon.png';
import '../../footer/_footer.scss';

/*
 * Props of Component
 */
interface ComponentProps {
  className?: string;
}

const FbFooter = (props: ComponentProps) => {
  /*
   * Props of Component
   */
  const { className } = props;

  return (
    <>
      <div className={`logo-box ${className ? className : ''}`}>
        <div className="footer-info">
          <a
            href="https://www.facebook.com/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img src={fbLogo} alt="Logo" />
          </a>
          <div className="info-text">
            <a
              href="https://www.facebook.com/"
              target="_blank"
              rel="noopener noreferrer"
            >
              fb.com
            </a>
          </div>
        </div>
      </div>
    </>
  );
};

export default observer(FbFooter);
