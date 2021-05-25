import React from "react";
import { observer } from "mobx-react-lite";
import { Modal, Form, Col, Button, ButtonGroup } from "react-bootstrap";
import { Formik } from "formik";
import * as yup from "yup";
import { PHONE_REGEXP } from "../../../../common/constants/rules.constants";
import bsCustomFileInput from "bs-custom-file-input";
import { NewAccountDto } from "../../../account/account.dto";
import { StoreStoreContext } from "../../admin.store";
import { AccountType, newAdminFormInit } from "../../admin.constants";
import { I18N } from "../../../../i18n.enum";
import GoogleMapAutocomplete from "../../../../common/components/GoogleMapAutocomplete";

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

  const adminStore = React.useContext(StoreStoreContext);
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

  const [initialValues, setInitValues] = React.useState<any>({});

  
  /*
   * Validation
   */
  const schema = yup.object({
    fName: yup.string().required(VALIDATE_REQUIRED),
    lName: yup.string().required(VALIDATE_REQUIRED),
    email: yup.string().required(VALIDATE_REQUIRED).email(VALIDATE_EMAIL),
    homePhone: yup.string().required().matches(PHONE_REGEXP, VALIDATE_PHONE),
    type: yup.string().required(VALIDATE_REQUIRED),
  });

  React.useEffect(() => {
    bsCustomFileInput.init();
  });

  React.useEffect(() => {
    setInitValues(adminStore.adminForm);
  }, [adminStore.adminForm]);


  const handleChangePlace = (value: any, field: string, setFieldValue: any) => {
    setFieldValue('Address', value?.formatted_address, false);
    setFieldValue('AddressCoorLat', value.geometry?.location?.lat(), false);
    setFieldValue('AddressCoorLong', value.geometry?.location?.lng(), false);
    value?.address_components.map((value: any) => {
      if (value.types[0] === 'administrative_area_level_1') {
        setFieldValue('City', value.short_name, false);
      }
    });
  };

  return (
    <Modal
      show={show}
      onHide={() => handleClose()}
      aria-labelledby="contained-modal-title-vcenter"
      centered
      className={`modal-custom modal-employee ${className ? className : ""}`}
      style={style}
    >
      <Modal.Header>
        {mode === "create" ? "New Store" : "Edit Store"}
      </Modal.Header>
      <Modal.Body>
        <Formik
          onSubmit={(values) => {
            if (values.Id) delete values.Id;
            handleSubmit(values);
          }}
          initialValues={initialValues}
        >
          {({ handleSubmit, handleChange, handleBlur, values, errors, setFieldValue }) => (
            <Form
              noValidate
              onSubmit={(e) => {
                e.preventDefault();
                handleSubmit();
              }}
              className={`form form-employee ${className ? className : ""}`}
              style={style}
            >
              {children}
              {mode == 'create' &&
                <Form.Group
                as={Col}
                md="12"
                controlId="Email"
                className="form-group-name"
              >
                <Form.Label className="form-label-required">
                  {"Email"} <span>*</span>
                </Form.Label>
                <Form.Control
                  type="text"
                  value={values.Email}
                  onChange={handleChange}
                />
                {/*<Form.Control.Feedback type="invalid">
                  {errors.fName}
                </Form.Control.Feedback>*/}
              </Form.Group>}
              <Form.Group
                as={Col}
                md="12"
                controlId="ShortName"
                className="form-group-name"
              >
                <Form.Label className="form-label-required">
                  {"Short Name"} <span>*</span>
                </Form.Label>
                <Form.Control
                  type="text"
                  value={values.ShortName}
                  onChange={handleChange}
                />
                {/*<Form.Control.Feedback type="invalid">
                  {errors.fName}
                </Form.Control.Feedback>*/}
              </Form.Group>
              <Form.Group
                as={Col}
                md="12"
                controlId="Phone"
                className="form-group-name"
              >
                <Form.Label className="form-label-required">
                  {"Phone"} <span>*</span>
                </Form.Label>
                <Form.Control
                  type="text"
                  value={values.Phone}
                  onChange={handleChange}
                />
                {/*<Form.Control.Feedback type="invalid">
                  {errors.fName}
            </Form.Control.Feedback>*/}
              </Form.Group>
              <Form.Group
                as={Col}
                md="12"
                controlId="Fax"
                className="form-group-name"
              >
                <Form.Label className="form-label-required">
                  {"Fax"} <span>*</span>
                </Form.Label>
                <Form.Control
                  type="text"
                  value={values.Fax}
                  onChange={handleChange}
                />
                {/*<Form.Control.Feedback type="invalid">
                  {errors.fName}
                </Form.Control.Feedback>*/}
              </Form.Group>
              <Form.Group
                as={Col}
                md="12"
                controlId="Address"
                className="form-group-name"
              >
                <Form.Label className="form-label-required">
                  {"Address"} <span>*</span>
                </Form.Label>
                <GoogleMapAutocomplete
                  handleChangePlace={handleChangePlace}
                  field="Warehouse"
                  setFieldValue={setFieldValue}
                  componentId="Address"
                  value={values.Address}
                  onChange={(e) => {
                    console.log("ghdfjkl");
                    handleChange(e.target.value);
                  }}
                />
                {/*<Form.Control.Feedback type="invalid">
                  {errors.fName}
                </Form.Control.Feedback>*/}
              </Form.Group>
              <Form.Group
                as={Col}
                md="12"
                controlId="Country"
                className="form-group-name"
              >
                <Form.Label className="form-label-required">
                  {"Country"} <span>*</span>
                </Form.Label>
                <Form.Control
                  type="text"
                  value={values.Country}
                  onChange={handleChange}
                />
                {/*<Form.Control.Feedback type="invalid">
                  {errors.fName}
                </Form.Control.Feedback>*/}
              </Form.Group>
              <Form.Group
                as={Col}
                md="12"
                controlId="PostalCode"
                className="form-group-name"
              >
                <Form.Label className="form-label-required">
                  {"PostalCode"} <span>*</span>
                </Form.Label>
                <Form.Control
                  type="text"
                  value={values.PostalCode}
                  onChange={handleChange}
                />
                {/*<Form.Control.Feedback type="invalid">
                  {errors.fName}
                </Form.Control.Feedback>*/}
              </Form.Group>
              <Form.Group
                as={Col}
                md="12"
                controlId="Region"
                className="form-group-name"
              >
                <Form.Label className="form-label-required">
                  {"Region"} <span>*</span>
                </Form.Label>
                <Form.Control
                  type="text"
                  value={values.Region}
                  onChange={handleChange}
                />
                {/*<Form.Control.Feedback type="invalid">
                  {errors.fName}
                </Form.Control.Feedback>*/}
              </Form.Group>
              <Form.Group
                as={Col}
                md="12"
                controlId="City"
                className="form-group-name"
              >
                <Form.Label className="form-label-required">
                  {"City"} <span>*</span>
                </Form.Label>
                <Form.Control
                  type="text"
                  value={values.City}
                  onChange={handleChange}
                />
                {/*<Form.Control.Feedback type="invalid">
                  {errors.fName}
                </Form.Control.Feedback>*/}
              </Form.Group>
              <Form.Group
                as={Col}
                md="12"
                controlId="Size"
                className="form-group-name"
              >
                <Form.Label className="form-label-required">
                  {"Size"} <span>*</span>
                </Form.Label>
                <Form.Control
                  type="text"
                  value={values.Size}
                  onChange={handleChange}
                />
                {/*<Form.Control.Feedback type="invalid">
                  {errors.fName}
                </Form.Control.Feedback>*/}
              </Form.Group>
              
              <ButtonGroup className="form-actions">
                {mode === "create" && (
                  <Button variant="primary" type="submit">
                    <span>{BUTTONS_CREATE}</span>
                    <i className="ico ico-plus"></i>
                  </Button>
                )}
                {mode === "edit" && (
                  <Button variant="primary" type="submit">
                    <span>{BUTTONS_UPDATE}</span>
                    <i className="ico ico-plus"></i>
                  </Button>
                )}
                {mode === "edit" && (
                  <Button onClick={handleDelete}>
                    <span>{BUTTONS_DELETE}</span>
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
