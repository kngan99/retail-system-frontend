import React from "react";
import { observer } from "mobx-react";
import { toast } from "react-toastify";
import { useHistory } from "react-router-dom";
import { Formik } from "formik";
import { I18N } from "../../../../i18n.enum";
import { Button, ButtonGroup, Col, Form } from "react-bootstrap";
import * as yup from 'yup';
import PreCartPage from "../Pos/PreCartPage";

/*
 * Props of Component
 */
interface ComponentProps {
    style?: React.CSSProperties;
    className?: string;
    children?: React.ReactNode;
    formTitle?: string;
    initialValues?: any;
  }

const NewRequestGoodsNote = (props: ComponentProps) => {
  const history = useHistory();
  
  /*
   * Props of Component
   */
  const {
    style,
    className,
    children,
    formTitle = '',
    initialValues = {
      email: '',
      password: '',
    },
  } = props;
    
  const {
    VALIDATE_REQUIRED,
  } = I18N;

  /*
   * Validation
   */
  const schema = yup.object({
    warehouseId: yup.string().required(VALIDATE_REQUIRED),
  });

  return (
      <>
      <PreCartPage></PreCartPage>
    </>
  );
};

export default observer(NewRequestGoodsNote);
