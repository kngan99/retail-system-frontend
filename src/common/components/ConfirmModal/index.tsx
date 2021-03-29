import React from 'react';
import { observer } from 'mobx-react-lite';
import { Modal, ButtonGroup, Button } from 'react-bootstrap';

/*
 * Props of Component
 */
interface ComponentProps {
  style?: React.CSSProperties;
  className?: string;
  children?: React.ReactNode;
  formTitle?: string;
  handleOk: any;
  handleCancel: any;
  show: boolean;
}

const ConfirmModal = (props: ComponentProps) => {
  /*
   * Props of Component
   */
  const {
    style,
    className,
    children,
    formTitle,
    handleCancel,
    handleOk,
    show = false,
  } = props;

  return (
    <Modal
      show={show}
      onHide={() => handleCancel()}
      aria-labelledby="contained-modal-title-vcenter"
      centered
      className={`modal-custom modal-confirm ${className ? className : ''}`}
      style={style}
    >
      <Modal.Header>{formTitle ? formTitle : 'Comfirmation'}</Modal.Header>
      <Modal.Body>
        <div className="modal-content">{children}</div>
        <ButtonGroup className="modal-actions">
          <Button variant="primary" onClick={() => handleOk()}>
            <span>{'OK'}</span>
          </Button>
          <Button variant="primary" onClick={() => handleCancel()}>
            <span>{'Cancel'}</span>
          </Button>
        </ButtonGroup>
      </Modal.Body>
    </Modal>
  );
};

export default observer(ConfirmModal);
