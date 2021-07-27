import React from 'react';
import { observer } from 'mobx-react-lite';
import PageTitle from '../../../../common/components/PageTitle';
import WarehouseTopMenu from '../WarehouseTopMenu';
import WarehouseMenu from '../WarehouseMenu';

interface ComponentProps {
  children?: React.ReactNode;
  pageTitle?: string;
  pageSubTitle?: string;
  showCurrentDate?: boolean;
}

const WarehouseWrapper = (props: ComponentProps) => {

  /*
   * Props of Component
   */
  const { children, pageTitle, pageSubTitle, showCurrentDate = true } = props;

  return (
    <>
      <div className={`page-wrapper`}>
        <WarehouseMenu className="admin-menu" />
        <div className="main">
          <WarehouseTopMenu />
          {pageTitle && (
            <PageTitle
              title={pageTitle}
              subTitle={pageSubTitle}
              showCurrentDate={showCurrentDate}
            />
          )}
          {children}
        </div>
      </div>
    </>
  );
};

export default observer(WarehouseWrapper);
