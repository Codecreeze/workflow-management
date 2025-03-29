import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  Box,
  IconButton,
  Typography
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
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
      PaperProps={{
        sx: {
          borderRadius: '12px',
          maxWidth: '550px',
          width: '100%',
          p: 0
        }
      }}
    >
      <Box sx={{ 
        position: 'absolute',
        right: 8,
        top: 8
      }}>
        <IconButton onClick={onClose} size="large">
          <CloseIcon />
        </IconButton>
      </Box>

      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column',
        alignItems: 'center',
        padding: '30px 40px 20px 40px',
      }}>
        <Typography variant="h6" sx={{ 
          fontWeight: 500,
          fontSize: '18px',
          textAlign: 'center',
          mb: 2
        }}>
          {`"Are You Sure You Want To Execute The Process '${workflow?.name || "Process_Name"}'?`}
        </Typography>

        <Typography color="error" sx={{ 
          textAlign: 'center',
          mt: 2,
          color: '#f44336',
          fontWeight: 400,
          fontSize: '16px'
        }}>
          You Cannot Undo This Step
        </Typography>

        <Box sx={{ 
          display: 'flex',
          justifyContent: 'flex-end',
          gap: 2,
          mt: 6,
          width: '100%'
        }}>
          <Button 
            onClick={onConfirm}
            sx={{
              borderRadius: '4px',
              fontWeight: 500,
              px: 3,
              py: 1,
              border: '1px solid #ccc',
              backgroundColor: 'white',
              color: 'black',
              '&:hover': {
                backgroundColor: '#f5f5f5',
              },
              minWidth: '80px'
            }}
          >
            Yes
          </Button>
          <Button 
            onClick={onClose}
            sx={{
              borderRadius: '4px',
              fontWeight: 500,
              px: 3,
              py: 1,
              backgroundColor: 'white',
              border: '1px solid #ccc',
              color: 'black',
              '&:hover': {
                backgroundColor: '#f5f5f5',
              },
              minWidth: '80px'
            }}
          >
            No
          </Button>
        </Box>
      </Box>
    </Dialog>
  );
};

export default ExecuteWorkflowModal; 