import React from "react";
import { observer } from "mobx-react";
import { toast } from "react-toastify";
import { useHistory } from "react-router-dom";
import { Formik } from "formik";
import { I18N } from "../../../../i18n.enum";
import { Button, ButtonGroup, Col, Form } from "react-bootstrap";
import * as yup from 'yup';
import CartPage from "../Pos/CartPage";

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
    ACCOUNT_LOGIN_WELCOME,
    ACCOUNT_EMAIL,
    PLACEHOLDER_EMAIL,
    ACCOUNT_PASSWORD,
    PLACEHOLDER_PASSWORD,
    ACCOUNT_LINK_FORGOTPASSWORD,
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
          {/* Copy from Login form have not fixed */}
      <CartPage></CartPage>
     <Formik
        validationSchema={schema}
        onSubmit={(values) => {
          // handleLogin(values);
        }}
        initialValues={initialValues}
      >
        {({ handleSubmit, handleChange, handleBlur, values, errors }) => (
          <Form
            noValidate
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit();
            }}
            className={`form form-login ${className ? className : ''}`}
            style={style}
          >
            <h2 className="form-title">
              {formTitle ? formTitle : ACCOUNT_LOGIN_WELCOME}
            </h2>
            {children}

            <Form.Row>
              <Form.Group
                as={Col}
                md="12"
                controlId="email"
                className="form-group-email"
              >
                <i className="ico ico-account-email"></i>
                <Form.Label className="form-label-required">
                  {ACCOUNT_EMAIL} <span>*</span>
                </Form.Label>
                <Form.Control
                  type="text"
                  placeholder={PLACEHOLDER_EMAIL}
                  name="email"
                  value={values.email}
                  onChange={handleChange}
                  isInvalid={!!errors.email}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.email}
                </Form.Control.Feedback>
              </Form.Group>
            </Form.Row>
            <Form.Row>
              <Form.Group
                as={Col}
                md="12"
                controlId="password"
                className="form-group-password"
              >
                <i className="ico ico-password"></i>
                <Form.Label className="form-label-required">
                  {ACCOUNT_PASSWORD} <span>*</span>
                </Form.Label>
                <Form.Control
                  type="password"
                  placeholder={PLACEHOLDER_PASSWORD}
                  value={values.password}
                  onChange={handleChange}
                  isInvalid={!!errors.password}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.password}
                </Form.Control.Feedback>
              </Form.Group>
            </Form.Row>
            <Form.Row>
              <Form.Group as={Col} md="12" controlId="formBasicCheckbox">
                <Button
                  variant="link"
                  className="action-link"
                  // onClick={handleForgotPassword}
                >
                  {ACCOUNT_LINK_FORGOTPASSWORD}
                </Button>
              </Form.Group>
            </Form.Row>
          </Form>
        )}
      </Formik>
    </>
  );
};

export default observer(NewRequestGoodsNote);
