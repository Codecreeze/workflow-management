import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button
} from '@mui/material';
import { styles } from '../../styles/Modal.styles';
import { Workflow } from '../../types';

export interface ExecuteWorkflowModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  workflow: Workflow | null;
}

const ExecuteWorkflowModal = ({ open, onClose, onConfirm, workflow }: ExecuteWorkflowModalProps) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title" sx={styles.dialogTitle}>
        {`Are You Sure You Want To Execute The Process '${workflow?.name || "Process_Name"}'?`}
      </DialogTitle>
      <DialogContent sx={styles.dialogContent}>
        <DialogContentText id="alert-dialog-description">
          You Cannot Undo This Step
        </DialogContentText>
      </DialogContent>
      <DialogActions sx={styles.dialogActions}>
        <Button onClick={onClose} sx={styles.cancelButton}>
          Cancel
        </Button>
        <Button onClick={onConfirm} sx={styles.confirmButton} autoFocus>
          Execute
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ExecuteWorkflowModal; 