import { Button, Card, Modal as MuiModal } from "@mui/material";

const Modal = (props) => {
  const { children, ...rest } = props;
  return (
    <MuiModal {...rest} className="modal">
      <Card className="modal-card">
        <>
          <div className="modal-close-button-container">
            <Button
              onClick={props.onClose}
              aria-label="close"
              className="modal-close-button"
            />
          </div>
          {children}
        </>
      </Card>
    </MuiModal>
  );
};

export default Modal;
