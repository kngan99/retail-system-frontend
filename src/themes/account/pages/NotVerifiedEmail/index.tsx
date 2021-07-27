import React from 'react';
import { observer } from 'mobx-react';
import { useHistory } from 'react-router-dom';
import IconThankYou from '../../../../modules/theme/assets/images/icon-thank-you.png'
import OnePage from '../../../../modules/theme/components/OnePage';
import { AuthenticationStoreContext } from '../../../../modules/authenticate/authentication.store';
import { I18N } from '../../../../i18n.enum';
import ThankYouContent from '../../../../modules/admin-account/components/ThankYouContent';

const VerifiedEmailPage = () => {
  const authStore = React.useContext(AuthenticationStoreContext);
  const history = useHistory();

  const {
    BUTTONS_LOGIN,
  } = I18N;

  React.useEffect(() => {
    const timeout = setTimeout(() => {
      history.push('/account/login');
    }, 30000);
    return () => clearTimeout(timeout);
  }, [authStore, history]);

  return (
    <>
      <OnePage className="thank-you-page" title="Retail System">
        <ThankYouContent
          title={"One more step"}
          subTitle={`Your account has not been verified. Please check your registered email and follow the instructions first and then login again. If you have verified your email, please contact the admin to verify your identity`}
          iconSuccess={IconThankYou}
          btnText={BUTTONS_LOGIN}
          handleBtn={() => history.push("/account/login")}
        ></ThankYouContent>
      </OnePage>
    </>
  );
};

export default observer(VerifiedEmailPage);
