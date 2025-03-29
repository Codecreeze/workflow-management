import {
  Dialog,
  Box,
  IconButton,
  Typography,
  Button,
  CircularProgress
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
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
        <IconButton onClick={onClose} size="large" disabled={isDeleting}>
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
          {`"Are You Sure You Want To Delete '${workflow?.name || "Process_Name"}'?`}
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
            disabled={isDeleting}
            sx={{
              borderRadius: '4px',
              fontWeight: 500,
              px: 3,
              py: 1,
              border: '1px solid #f44336',
              backgroundColor: 'white',
              color: '#f44336',
              '&:hover': {
                backgroundColor: '#fff1f0',
              },
              minWidth: '80px'
            }}
            startIcon={isDeleting ? <CircularProgress size={16} color="error" /> : null}
          >
            {isDeleting ? 'Deleting...' : 'Yes'}
          </Button>
          <Button 
            onClick={onClose}
            disabled={isDeleting}
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

export default DeleteWorkflowModal; 