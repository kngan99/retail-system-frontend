import React from 'react';
import { observer } from 'mobx-react-lite';
import { Modal, Form, Col, Button, ButtonGroup } from 'react-bootstrap';
import { Formik } from 'formik';
import * as yup from 'yup';
import { PHONE_REGEXP} from '../../../../common/constants/rules.constants';
import bsCustomFileInput from 'bs-custom-file-input';
import { NewAccountDto } from '../../../account/account.dto';
import { AdminStoreContext } from '../../admin.store';
import { AccountType, newAdminFormInit } from '../../admin.constants';
import { I18N } from '../../../../i18n.enum';

interface ComponentProps {
  style?: React.CSSProperties;
  className?: string;
  children?: React.ReactNode;
  handleSubmit?: any;
  handleDelete?: any;
  show?: boolean;
  handleClose?: any;
  mode?: string;
}

const AdminAccountFormModal = (props: ComponentProps) => {
  /*
   * Props of Component
   */
  const {
    style,
    className,
    children,
    handleSubmit,
    handleDelete,
    show,
    handleClose,
    mode,
  } = props;

  const adminStore = React.useContext(AdminStoreContext);
  /*
   * Translation
   */
  const {
    VALIDATE_REQUIRED,
    VALIDATE_PHONE,
    VALIDATE_EMAIL,
    ADMIN_NEW_ACCOUNT,
    ADMIN_EDIT_ACCOUNT,
    ACCOUNT_FNAME,
    ACCOUNT_LNAME,
    ACCOUNT_EMAIL,
    ACCOUNT_PHONE,
    ACCOUNT_ROLE_LABEL,
    BUTTONS_CREATE,
    BUTTONS_DELETE,
    BUTTONS_UPDATE,
  } = I18N;

  const [initialValues, setInitValues] = React.useState<NewAccountDto>(
    newAdminFormInit
  );
  /*
   * Validation
   */
  const schema = yup.object({
    fName: yup.string().required((VALIDATE_REQUIRED)),
    lName: yup.string().required((VALIDATE_REQUIRED)),
    email: yup.string().required((VALIDATE_REQUIRED)).email((VALIDATE_EMAIL)),
    homePhone: yup
      .string()
      .required()
      .matches(PHONE_REGEXP, (VALIDATE_PHONE)),
    type: yup.string().required((VALIDATE_REQUIRED)),
  });

  React.useEffect(() => {
    bsCustomFileInput.init();
  });

  React.useEffect(() => {
    setInitValues(adminStore.adminForm);
  }, [adminStore.adminForm]);

  return (
    <Modal
      show={show}
      onHide={() => handleClose()}
      aria-labelledby="contained-modal-title-vcenter"
      centered
      className={`modal-custom modal-employee ${className ? className : ''}`}
      style={style}
    >
      <Modal.Header>
        {mode === 'create'
          ? (ADMIN_NEW_ACCOUNT)
          : (ADMIN_EDIT_ACCOUNT)}
      </Modal.Header>
      <Modal.Body>
        <Formik
          validationSchema={schema}
          onSubmit={(values) => {
            handleSubmit(values);
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
              className={`form form-employee ${className ? className : ''}`}
              style={style}
            >
              {children}
              <Form.Group
                as={Col}
                md="12"
                controlId="fName"
                className="form-group-name"
              >
                <Form.Label className="form-label-required">
                  {(ACCOUNT_FNAME)} 
                </Form.Label>
                <Form.Control
                  type="text"
                  value={values.fName}
                  onChange={handleChange}
                  isInvalid={!!errors.fName}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.fName}
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group
                as={Col}
                md="12"
                controlId="lName"
                className="form-group-name"
              >
                <Form.Label className="form-label-required">
                  {(ACCOUNT_LNAME)} 
                </Form.Label>
                <Form.Control
                  type="text"
                  value={values.lName}
                  onChange={handleChange}
                  isInvalid={!!errors.lName}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.lName}
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group
                as={Col}
                md="12"
                controlId="email"
                className="form-group-email"
              >
                <Form.Label className="form-label-required">
                  {(ACCOUNT_EMAIL)} 
                </Form.Label>
                <Form.Control
                  type="text"
                  value={values.email}
                  onChange={handleChange}
                  isInvalid={!!errors.email}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.email}
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group
                as={Col}
                md="12"
                controlId="homePhone"
                className="form-group-homePhone"
              >
                <Form.Label className="form-label-required">
                  {(ACCOUNT_PHONE)} 
                </Form.Label>
                <Form.Control
                  type="text"
                  value={values.homePhone}
                  onChange={handleChange}
                  isInvalid={!!errors.homePhone}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.homePhone}
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group
                as={Col}
                md="12"
                controlId="type"
                className="form-group-type"
              >
                <Form.Label className="form-label-required">
                  {(ACCOUNT_ROLE_LABEL)} 
                </Form.Label>
                <Form.Control
                  as="select"
                  name="type"
                  defaultValue={values.type}
                  onChange={handleChange}
                  isInvalid={!!errors.type}
                >
                  {AccountType.map((value, index) => {
                    return (
                      <option key={`account-type-${index}`} value={value.key}>
                        {(value.label)}
                      </option>
                    );
                  })}
                </Form.Control>
                <Form.Control.Feedback type="invalid">
                  {errors.type}
                </Form.Control.Feedback>
              </Form.Group>
              <ButtonGroup className="form-actions">
                {mode === 'create' && (
                  <Button variant="primary" type="submit">
                    <span>{(BUTTONS_CREATE)}</span>
                    <i className="ico ico-plus"></i>
                  </Button>
                )}
                {mode === 'edit' && (
                  <Button variant="primary" type="submit">
                    <span>{(BUTTONS_UPDATE)}</span>
                    <i className="ico ico-plus"></i>
                  </Button>
                )}
                {mode === 'edit' && (
                  <Button onClick={handleDelete}>
                    <span>{(BUTTONS_DELETE)}</span>
                    <i className="ico ico-delete"></i>
                  </Button>
                )}
              </ButtonGroup>
            </Form>
          )}
        </Formik>
      </Modal.Body>
    </Modal>
  );
};

export default observer(AdminAccountFormModal);
