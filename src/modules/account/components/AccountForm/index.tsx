import React from "react";
import { observer } from "mobx-react-lite";

import {
  Form,
  Row,
  Col,
  Button,
  ButtonGroup,
  Container,
  OverlayTrigger,
  Tooltip,
} from "react-bootstrap";

import { Formik } from "formik";
import * as yup from "yup";
import bsCustomFileInput from "bs-custom-file-input";
import Image from "react-bootstrap/Image";
import {
  PHONE_REGEXP,
} from "../../../../common/constants/rules.constants";
import { AuthenticationStoreContext } from "../../../authenticate/authentication.store";
import { I18N } from "../../../../i18n.enum";
import { REFERENCE_TYPE } from "../../referenceType.enum";

/*
 * Props of Component
 */
interface ComponentProps {
  style?: React.CSSProperties;
  className?: string;
  children?: React.ReactNode;
  initialValues?: any;
  handleSubmitForm?: any;
  handleUploadAvatar?: any;
  handleDeleteFiles?: any;
}

const CustomerAccountForm = (props: ComponentProps) => {
  const authStore = React.useContext(AuthenticationStoreContext);

  /*
   * Props of Component
   */
  const {
    style,
    className,
    children,
    initialValues,
    handleSubmitForm,
    handleUploadAvatar,
    handleDeleteFiles,
  } = props;

  const {
    VALIDATE_EMAIL,
    VALIDATE_PHONE,
    BUTTONS_UPDATE,
  } = I18N;

  /*
   * Validation
   */
  const schema = yup.object({
    FName: yup.string().notRequired(),
    LName: yup.string().notRequired(),
    Email: yup.string().email(VALIDATE_EMAIL).notRequired(),
    Homephone: yup
      .string()
      .matches(PHONE_REGEXP, VALIDATE_PHONE)
      .notRequired(),
  });

  const [avatar, setAvatar] = React.useState<string>("");

  React.useEffect(() => {
    bsCustomFileInput.init();
  });

  React.useEffect(() => {
    if (authStore.loggedUser) {
      setAvatar(authStore.loggedUser.avatarUrl);
    }
  }, [authStore.loggedUser]);

  return (
    <>
      <Formik
        validationSchema={schema}
        onSubmit={(values) => {
          handleSubmitForm(values);
        }}
        initialValues={initialValues}
      >
        {({ handleSubmit, handleChange, values, errors }) => (
          <Form
            noValidate
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit();
            }}
            className={`form form-custom ${className ? className : ""}`}
            style={style}
          >
            {children}
            <Form.Row className="company-info">
              <Container fluid>
                <Row>
                  <Form.Group
                    as={Col}
                    xs={12}
                    lg={7}
                    controlId="Email"
                    className="form-group-email"
                  >
                    <Form.Label className="form-label">
                      Email
                    </Form.Label>
                    <Form.Control
                      type="text"
                      name="email"
                      value={values.Email}
                      onChange={handleChange}
                      isInvalid={!!errors.email}
                      readOnly
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.email}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Row>
                <Row>
                  <Form.Group
                    as={Col}
                    xs={12}
                    lg={5}
                    controlId="FName"
                    className="form-group-firstName"
                  >
                    <Form.Label className="form-label">
                      Firstname
                    </Form.Label>
                    <Form.Control
                      type="text"
                      value={values.FName ?? ""}
                      onChange={handleChange}
                      isInvalid={!!errors.FName}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.FName}
                    </Form.Control.Feedback>
                  </Form.Group>
                  <Form.Group
                    as={Col}
                    xs={12}
                    lg={5}
                    controlId="LName"
                    className="form-group-firstName"
                  >
                    <Form.Label className="form-label">
                      Lastname
                    </Form.Label>
                    <Form.Control
                      type="text"
                      value={values.LName ?? ""}
                      onChange={handleChange}
                      isInvalid={!!errors.LName}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.LName}
                    </Form.Control.Feedback>
                  </Form.Group>
                  <Form.Group
                    as={Col}
                    xs={12}
                    lg={2}
                    className="form-group-verifiedStatus"
                  >
                    <Form.Label className="form-label">
                      Account Status
                    </Form.Label>
                    <div className={authStore.loggedUser.EmailVerified ? 'account-status account-status-verified' : 'account-status account-status-unverified'}>
                      {authStore.loggedUser.EmailVerified ? 'Verified' : 'Not Verified'}
                    </div>
                    <OverlayTrigger
                      key={"top"}
                      placement={"top"}
                      overlay={
                        <Tooltip id="tooltip-info">
                          Contact account owner to vefify or use admin page to verify
                        </Tooltip>
                      }
                    >
                      <div className="tooltip-icon">
                        <span className="ico ico-faq"></span>
                      </div>
                    </OverlayTrigger>
                  </Form.Group>
                </Row>
                <Row>
                  <Form.Group
                    as={Col}
                    xs={12}
                    lg={5}
                    controlId="Title"
                    className="form-group-firstName"
                  >
                    <Form.Label className="form-label">
                      Title
                    </Form.Label>
                    <Form.Control
                      type="text"
                      value={values.Title ?? ""}
                      onChange={handleChange}
                      isInvalid={!!errors.FName}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.FName}
                    </Form.Control.Feedback>
                  </Form.Group>
                  <Form.Group
                    as={Col}
                    xs={12}
                    lg={5}
                    controlId="TitleOfCourtesy"
                    className="form-group-firstName"
                  >
                    <Form.Label className="form-label">
                      Title Of Courtesy
                    </Form.Label>
                    <Form.Control
                      type="text"
                      value={values.TitleOfCourtesy ?? ""}
                      onChange={handleChange}
                      isInvalid={!!errors.LName}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.LName}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Row>
                <Row>
                  <Form.Group
                    as={Col}
                    xs={12}
                    lg={5}
                    controlId="Type"
                    className="form-group-firstName"
                  >
                    <Form.Label className="form-label">
                      Type
                    </Form.Label>
                    <Form.Control
                      type="text"
                      value={values.Type ?? ""}
                      onChange={handleChange}
                      isInvalid={!!errors.LName}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.LName}
                    </Form.Control.Feedback>
                  </Form.Group>
                  <Form.Group
                    as={Col}
                    xs={12}
                    lg={5}
                    controlId="HomePhone"
                    className="form-group-firstName"
                  >
                    <Form.Label className="form-label">
                      Phone Number
                    </Form.Label>
                    <Form.Control
                      type="text"
                      value={values.HomePhone ?? ""}
                      onChange={handleChange}
                      isInvalid={!!errors.LName}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.LName}
                    </Form.Control.Feedback>
                  </Form.Group>


                </Row>
                <Row>
                  <Form.Group
                    as={Col}
                    xs={12}
                    lg={5}
                    controlId="Password"
                    className="form-group-firstName"
                  >
                    <Form.Label className="form-label">
                      Password
                    </Form.Label>
                    <Form.Control
                      type="text"
                      value={values.Password ?? ""}
                      onChange={handleChange}
                      isInvalid={!!errors.FName}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.FName}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Row>
                <Row>
                  <Form.Group
                    as={Col}
                    xs={12}
                    lg={5}
                    controlId="Birthday"
                    className="form-group-firstName"
                  >
                    <Form.Label className="form-label">
                      Birthday
                    </Form.Label>
                    <Form.Control
                      type="text"
                      value={values.Birthday ?? ""}
                      onChange={handleChange}
                      isInvalid={!!errors.LName}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.LName}
                    </Form.Control.Feedback>
                  </Form.Group>
                  <Form.Group
                    as={Col}
                    xs={12}
                    lg={5}
                    controlId="HireDate"
                    className="form-group-firstName"
                  >
                    <Form.Label className="form-label">
                      Hire Date
                    </Form.Label>
                    <Form.Control
                      type="text"
                      value={values.HireDate ?? ""}
                      onChange={handleChange}
                      isInvalid={!!errors.FName}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.FName}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Row>
                <Row>
                  <Form.Group
                    as={Col}
                    xs={12}
                    lg={5}
                    controlId="Country"
                    className="form-group-firstName"
                  >
                    <Form.Label className="form-label">
                      Country
                    </Form.Label>
                    <Form.Control
                      type="text"
                      value={values.Country ?? ""}
                      onChange={handleChange}
                      isInvalid={!!errors.FName}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.FName}
                    </Form.Control.Feedback>
                  </Form.Group>
                  <Form.Group
                    as={Col}
                    xs={12}
                    lg={5}
                    controlId="PostalCode"
                    className="form-group-firstName"
                  >
                    <Form.Label className="form-label">
                      PostalCode
                    </Form.Label>
                    <Form.Control
                      type="text"
                      value={values.PostalCode ?? ""}
                      onChange={handleChange}
                      isInvalid={!!errors.LName}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.LName}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Row>
                <Row>
                  <Form.Group
                    as={Col}
                    xs={12}
                    lg={5}
                    controlId="City"
                    className="form-group-firstName"
                  >
                    <Form.Label className="form-label">
                      City
                    </Form.Label>
                    <Form.Control
                      type="text"
                      value={values.City ?? ""}
                      onChange={handleChange}
                      isInvalid={!!errors.FName}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.FName}
                    </Form.Control.Feedback>
                  </Form.Group>
                  <Form.Group
                    as={Col}
                    xs={12}
                    lg={5}
                    controlId="Region"
                    className="form-group-firstName"
                  >
                    <Form.Label className="form-label">
                      Region
                    </Form.Label>
                    <Form.Control
                      type="text"
                      value={values.Region ?? ""}
                      onChange={handleChange}
                      isInvalid={!!errors.LName}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.LName}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Row>
                <Row>
                  <Form.Group
                    as={Col}
                    xs={12}
                    lg={12}
                    controlId="Address"
                    className="form-group-firstName"
                  >
                    <Form.Label className="form-label">
                      Address
                    </Form.Label>
                    <Form.Control
                      type="text"
                      value={values.Address ?? ""}
                      onChange={handleChange}
                      isInvalid={!!errors.FName}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.FName}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Row>
                <Row>
                  <Form.Group
                    as={Col}
                    xs={12}
                    lg={12}
                    controlId="Notes"
                    className="form-group-firstName"
                  >
                    <Form.Label className="form-label">
                      Notes
                    </Form.Label>
                    <Form.Control
                      type="text"
                      value={values.Notes ?? ""}
                      onChange={handleChange}
                      isInvalid={!!errors.FName}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.FName}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Row>
                <Row>
                  <Form.Group
                    as={Col}
                    xs={12}
                    lg={7}
                    controlId="avatarUrl"
                    className="form-group-avatarUrl"
                  >
                    <div className="form-image-wrapper">
                      <Form.Label className="form-label">
                        Upload Profile Avatar
                        <span className="image-size">
                          {"Image size < 3MB"}
                        </span>
                      </Form.Label>
                      {avatar && (
                        <div className="image">
                          <a
                            className="zoom-image"
                            href={avatar}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <Image src={`${avatar}`} />
                          </a>
                          <Button
                            className="btn-icon"
                            onClick={() => {
                              setAvatar("");
                              handleDeleteFiles(
                                REFERENCE_TYPE.PROFILE_IMG
                              );
                            }}
                          >
                            <i className="ico ico-o-close"></i>
                          </Button>
                        </div>
                      )}
                      <Form.File
                        id="iconCompany"
                        label="Choose an image"
                        onChange={handleUploadAvatar}
                        custom
                      />
                    </div>
                  </Form.Group>
                </Row>
                {/* <Row>
                  <Form.Group
                    as={Col}
                    xs={12}
                    controlId="profileUrl"
                    className="form-group-block form-group-profileUrl"
                  >
                    <Form.Label className="form-label">
                      {(CUSTOMER_PROFILE_PICTURE)}
                    </Form.Label>
                    {cardFront && (
                      <div className="image">
                        <Image src={`${cardFront}`} />
                        <Button
                          className="btn-icon"
                          onClick={() => {
                            setCardFront('');
                            handleDeleteFiles(
                              REFERENCE_TYPE.
                            );
                          }}
                        >
                          <i className="ico ico-o-close"></i>
                        </Button>
                      </div>
                    )}
                    <Form.File
                      id="profileUrl"
                      label={(BUTTONS_CHOOSE_IMAGE)}
                      onChange={handleUploadCardFront}
                      custom
                    />
                  </Form.Group>
                </Row> */}
                <ButtonGroup className="form-actions">
                  <Button variant="primary" type="submit">
                    <span>{BUTTONS_UPDATE}</span>
                    <i className="ico ico-update"></i>
                  </Button>
                </ButtonGroup>
              </Container>
            </Form.Row>
          </Form>
        )}
      </Formik>
    </>
  );
};

export default observer(CustomerAccountForm);
