import { Card, Modal as MuiModal } from "@mui/material";

const Modal = (props) => {
  const { children, ...rest } = props;
  return (
    <MuiModal {...rest} className="modal">
      <Card className="modal-card">{children}</Card>
    </MuiModal>
  );
};

export default Modal;
