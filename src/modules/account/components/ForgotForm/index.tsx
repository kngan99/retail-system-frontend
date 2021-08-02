import React from 'react';
import { observer } from 'mobx-react-lite';
import { Form, Col, Button, ButtonGroup } from 'react-bootstrap';
import { Formik } from 'formik';
import * as yup from 'yup';
import { I18N } from '../../../../i18n.enum';

/*
 * Props of Component
 */
interface ComponentProps {
  style?: React.CSSProperties;
  className?: string;
  children?: React.ReactNode;
  handleForgotPassword: any;
  handleBack?: any;
  formTitle?: string;
  initialValues?: any;
}

const ForgotForm = (props: ComponentProps) => {
  /*
   * Props of Component
   */
  const {
    style,
    className,
    children,
    handleForgotPassword,
    handleBack = false,
    formTitle = '',
    initialValues = {
      email: '',
    },
  } = props;

  const {
    VALIDATE_REQUIRED,
    VALIDATE_EMAIL,
  } = I18N;

  /*
   * Validation
   */
  const schema = yup.object({
    email: yup.string().required((VALIDATE_REQUIRED)).email((VALIDATE_EMAIL)),
  });

  return (
    <>
      <Formik
        validationSchema={schema}
        onSubmit={(values) => {
          handleForgotPassword(values);
        }}
        initialValues={initialValues}
      >
        {({ handleSubmit, handleChange, handleBlur, values, errors }) => (
          <Form
            name="form-forgot"
            noValidate
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit();
            }}
            className={`form form-forgot ${className ? className : ''}`}
            style={style}
          >
            <h2 className="form-title">
              {formTitle ? formTitle : `Forgot Password`}
            </h2>
            {children}
            <Form.Row>
              <Form.Group
                as={Col}
                md="12"
                controlId="email"
                className="form-group-email"
              >
                <i className="ico ico-user-email"></i>
                <Form.Label className="form-label-required">
                  {'Your email'} <span>*</span>
                </Form.Label>
                <Form.Control
                  type="text"
                  placeholder={'Please enter your email'}
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
            <ButtonGroup className="form-actions">
              <Button variant="primary" type="submit">
                <span>{'Send'}</span>
                <i className="ico ico-o-next"></i>
              </Button>
              {handleBack && (
                <Button
                  onClick={handleBack}
                  className="action-link"
                  variant="link"
                >
                  {'Back'}
                </Button>
              )}
            </ButtonGroup>
          </Form>
        )}
      </Formik>
    </>
  );
};

export default observer(ForgotForm);
