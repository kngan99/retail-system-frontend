import React from 'react';
import { observer } from 'mobx-react-lite';
import ResetForm from '../ResetForm';

interface ComponentProps {
  style?: React.CSSProperties;
  className?: string;
  children?: React.ReactNode;
  handleConfirm: any;
  formTitle?: string;
  initialValues?: any;
  userEmail?: string;
}

const CustomerResetForm = (props: ComponentProps) => {
  return (
    <>
      <ResetForm {...props} />
    </>
  );
};

export default observer(CustomerResetForm);
