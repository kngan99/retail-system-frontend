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
  handleConfirm: any;
  formTitle?: string;
  initialValues?: any;
  userEmail?: string;
}

const ResetForm = (props: ComponentProps) => {
  /*
   * Props of Component
   */
  const {
    style,
    className,
    children,
    handleConfirm,
    formTitle = '',
    userEmail,
    initialValues = {
      email: userEmail,
      password: '',
      confirmPassword: '',
    },
  } = props;

  const {
    VALIDATE_REQUIRED,
    VALIDATE_CONFIRM_PASSWORD,
    ACCOUNT_EMAIL,
    PLACEHOLDER_EMAIL,
    ACCOUNT_PASSWORD,
    ACCOUNT_CONFIRM_PASSWORD,
    PLACEHOLDER_PASSWORD,
    PLACEHOLDER_CONFIRM_PASSWORD,
  } = I18N;

  /*
   * Validation
   */
  const schema = yup.object({
    email: yup.string().notRequired(),
    password: yup.string().required(VALIDATE_REQUIRED),
    confirmPassword: yup
      .string()
      .oneOf([yup.ref('password')], VALIDATE_CONFIRM_PASSWORD)
      .required(VALIDATE_REQUIRED),
  });

  return (
    <>
      <Formik
        validationSchema={schema}
        onSubmit={(values) => {
          handleConfirm(values);
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
            className={`form form-reset ${className ? className : ''}`}
            style={style}
          >
            <h2 className="form-title">
              {formTitle ? formTitle : ('Reset password')}
            </h2>
            {children}
            {userEmail && (
              <Form.Row>
                <Form.Group
                  as={Col}
                  md="12"
                  controlId="email"
                  className="form-group-email"
                >
                  <i className="ico ico-user-email"></i>
                  <Form.Label className="form-label-required">
                    {(ACCOUNT_EMAIL)} <span>*</span>
                  </Form.Label>
                  <Form.Control
                    type="text"
                    placeholder={(PLACEHOLDER_EMAIL)}
                    name="email"
                    value={userEmail}
                    onChange={handleChange}
                    isInvalid={!!errors.email}
                    readOnly
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.email}
                  </Form.Control.Feedback>
                </Form.Group>
              </Form.Row>
            )}
            <Form.Row>
              <Form.Group
                as={Col}
                md="12"
                controlId="password"
                className="form-group-password"
              >
                <i className="ico ico-password"></i>
                <Form.Label className="form-label-required">
                  {(ACCOUNT_PASSWORD)} <span>*</span>
                </Form.Label>
                <Form.Control
                  type="password"
                  placeholder={(PLACEHOLDER_PASSWORD)}
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
              <Form.Group
                as={Col}
                md="12"
                controlId="confirmPassword"
                className="form-group-confirm-password"
              >
                <i className="ico ico-password"></i>
                <Form.Label className="form-label-required">
                  {(ACCOUNT_CONFIRM_PASSWORD)} <span>*</span>
                </Form.Label>
                <Form.Control
                  type="password"
                  placeholder={(PLACEHOLDER_CONFIRM_PASSWORD)}
                  value={values.confirmPassword}
                  onChange={handleChange}
                  isInvalid={!!errors.confirmPassword}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.confirmPassword}
                </Form.Control.Feedback>
              </Form.Group>
            </Form.Row>
            <ButtonGroup className="form-actions">
              <Button variant="primary" type="submit">
                <span>{('Confirm')}</span>
                <i className="ico ico-o-next"></i>
              </Button>
            </ButtonGroup>
          </Form>
        )}
      </Formik>
    </>
  );
};

export default observer(ResetForm);
