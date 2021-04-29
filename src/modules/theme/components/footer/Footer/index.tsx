import React from 'react';
import ZaloFooter from '../ZaloFooter';
import FbFooter from '../FbFooter';
import '../../footer/_footer.scss';
import MailFooter from '../MailFooter';
import PhoneFooter from '../PhoneFooter';

/*
 * Props of Component
 */
interface ComponentProps {
  className?: string;
}

const Footer = React.memo((props: ComponentProps) => {
  /*
   * Props of Component
   */
  const { className } = props;

  return (
    <>
      <div className={`footer ${className ? className : ''}`}>
        <ZaloFooter />
        <FbFooter />
        <MailFooter />
        <PhoneFooter />
      </div>
    </>
  );
});

export default Footer;
