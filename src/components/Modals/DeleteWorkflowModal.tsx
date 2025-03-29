import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  CircularProgress
} from '@mui/material';
import { styles } from '../../styles/Modal.styles';
import { Workflow } from '../../types';

export interface DeleteWorkflowModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  workflow: Workflow | null;
  isDeleting?: boolean;
}

const DeleteWorkflowModal = ({ 
  open, 
  onClose, 
  onConfirm, 
  workflow,
  isDeleting = false
}: DeleteWorkflowModalProps) => {
  return (
    <Dialog
      open={open}
      onClose={isDeleting ? undefined : onClose}
      aria-labelledby="delete-dialog-title"
      aria-describedby="delete-dialog-description"
    >
      <DialogTitle id="delete-dialog-title" sx={styles.dialogTitle}>
        {`Are You Sure You Want To Delete '${workflow?.name || "Process_Name"}'?`}
      </DialogTitle>
      <DialogContent sx={styles.dialogContent}>
        <DialogContentText id="delete-dialog-description">
          You Cannot Undo This Step
        </DialogContentText>
      </DialogContent>
      <DialogActions sx={styles.dialogActions}>
        <Button 
          onClick={onClose} 
          sx={styles.cancelButton}
          disabled={isDeleting}
        >
          Cancel
        </Button>
        <Button 
          onClick={onConfirm} 
          sx={styles.deleteButton}
          disabled={isDeleting}
          startIcon={isDeleting ? <CircularProgress size={16} color="inherit" /> : null}
        >
          {isDeleting ? 'Deleting...' : 'Delete'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteWorkflowModal; 