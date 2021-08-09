import React from "react";
import { observer } from "mobx-react-lite";
import {
  Form,
  Button,
  InputGroup,
  FormControl,
  Modal,
  Row,
  ButtonGroup,
} from "react-bootstrap";
import { toast } from "react-toastify";
import { AdminStoreContext } from "../../../admin-account/admin.store";

/*
 * Props of Component
 */
interface ComponentProps {
  style?: React.CSSProperties;
  className?: string;
  children?: React.ReactNode;
  handleSubmit?: any;
  show?: boolean;
  handleClose?: any;
  mode?: string;
  alertExceed?: any;
}

const AssignQuantityModal = (props: ComponentProps) => {
  /*
   * Props of Component
   */
  const {
    style,
    className,
    children,
    handleSubmit,
    show,
    handleClose,
    mode,
    alertExceed,
  } = props;

  const adminStore = React.useContext(AdminStoreContext);

  const [quantity, setQuantity] = React.useState<string>("");
  const onSubmit = async () => {
    alertExceed(quantity);
    if (adminStore.isExceed) {
      toast("Your quantity exceeds the quantity in stock");
      return;
    }
    handleSubmit(quantity);
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
      <Modal.Header>Choose quantity</Modal.Header>
      <Modal.Body>
        <Form.Group>
          <InputGroup className="mb-3">
            <InputGroup.Text id="basic-addon1">#</InputGroup.Text>
            <Form.Control
              placeholder="Enter Store/Warehouse Id"
              aria-label="Search"
              aria-describedby="basic-addon1"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
            />
          </InputGroup>
          <ButtonGroup className="form-actions">
            <Button onClick={onSubmit} style={{ marginLeft: "10px" }}>
              Submit
              <i className="ico ico-o-next"></i>
            </Button>
            <Button onClick={handleClose} style={{ marginLeft: "10px" }}>
              Cancel
            </Button>
          </ButtonGroup>
        </Form.Group>
      </Modal.Body>
    </Modal>
  );
};

export default observer(AssignQuantityModal);
