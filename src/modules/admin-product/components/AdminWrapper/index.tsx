import React from 'react';
import { observer } from 'mobx-react-lite';
import AdminMenu from '../AdminMenu';
import AdminTopMenu from '../AdminTopMenu';
import PageTitle from '../../../../common/components/PageTitle';
import AdminFooter from '../AdminFooter';

interface ComponentProps {
  children?: React.ReactNode;
  pageTitle?: string;
  pageSubTitle?: string;
  showCurrentDate?: boolean;
}

const AdminWrapper = (props: ComponentProps) => {

  /*
   * Props of Component
   */
  const { children, pageTitle, pageSubTitle, showCurrentDate = true } = props;

  return (
    <>
      <div className={`page-wrapper`}>
        <AdminMenu className="admin-menu" />
        <div className="main">
          <AdminTopMenu />
          {pageTitle && (
            <PageTitle
              title={pageTitle}
              subTitle={pageSubTitle}
              showCurrentDate={showCurrentDate}
            />
          )}
          {children}
          <AdminFooter />
        </div>
      </div>
    </>
  );
};

export default observer(AdminWrapper);
