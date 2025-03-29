import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  IconButton,
  Typography,
  Box,
  CircularProgress,
  Alert,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useForm, Controller } from 'react-hook-form';

interface SaveWorkflowModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (name: string, description: string) => void;
  initialName?: string;
  initialDescription?: string;
  status?: 'idle' | 'saving' | 'success' | 'error';
  error?: string | null;
}

interface FormInputs {
  name: string;
  description: string;
}

const SaveWorkflowModal: React.FC<SaveWorkflowModalProps> = ({
  open,
  onClose,
  onSave,
  initialName = '',
  initialDescription = '',
  status = 'idle',
  error = null,
}) => {
  const [showSuccess, setShowSuccess] = useState(false);
  const { control, handleSubmit, formState: { errors }, reset } = useForm<FormInputs>({
    defaultValues: {
      name: initialName,
      description: initialDescription,
    }
  });

  // Reset form when modal opens or initial values change
  useEffect(() => {
    if (open) {
      reset({
        name: initialName,
        description: initialDescription,
      });
    }
  }, [open, initialName, initialDescription, reset]);

  // Handle success state changes
  useEffect(() => {
    if (status === 'success') {
      setShowSuccess(true);
      const timer = setTimeout(() => {
        setShowSuccess(false);
        onClose();
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [status, onClose]);

  const onSubmit = (data: FormInputs) => {
    onSave(data.name, data.description);
  };

  return (
    <Dialog 
      open={open} 
      onClose={status === 'saving' ? undefined : onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: '12px',
          p: 1,
        }
      }}
    >
      <DialogTitle sx={{ 
        fontWeight: 500, 
        fontSize: '20px',
        p: 2,
        pb: 1,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        Save your workflow
        <IconButton
          aria-label="close"
          onClick={onClose}
          disabled={status === 'saving'}
          sx={{
            color: 'grey.500',
            p: 1,
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent sx={{ p: 2 }}>
          {status === 'error' && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error || 'Failed to save workflow. Please try again.'}
            </Alert>
          )}
          
          {showSuccess && (
            <Alert severity="success" sx={{ mb: 2 }}>
              Workflow saved successfully!
            </Alert>
          )}
          
          <Box sx={{ mb: 3 }}>
            <Typography variant="body1" sx={{ mb: 1, fontWeight: 500 }}>
              Name
            </Typography>
            <Controller
              name="name"
              control={control}
              rules={{ 
                required: "Workflow name is required",
                minLength: {
                  value: 3,
                  message: "Name must be at least 3 characters"
                }
              }}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  placeholder="Name here"
                  variant="outlined"
                  size="small"
                  error={!!errors.name}
                  helperText={errors.name?.message}
                  disabled={status === 'saving'}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '8px',
                    }
                  }}
                />
              )}
            />
          </Box>
          
          <Box>
            <Typography variant="body1" sx={{ mb: 1, fontWeight: 500 }}>
              Description
            </Typography>
            <Controller
              name="description"
              control={control}
              rules={{ 
                required: "Workflow description is required",
                minLength: {
                  value: 5,
                  message: "Description must be at least 5 characters"
                }
              }}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  multiline
                  rows={4}
                  placeholder="Write here.."
                  variant="outlined"
                  error={!!errors.description}
                  helperText={errors.description?.message}
                  disabled={status === 'saving'}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '8px',
                    }
                  }}
                />
              )}
            />
          </Box>
        </DialogContent>
        
        <DialogActions sx={{ p: 2, pt: 0 }}>
          <Button
            type="submit"
            variant="contained"
            disabled={status === 'saving'}
            sx={{
              borderRadius: '6px',
              bgcolor: '#f44336',
              textTransform: 'none',
              fontWeight: 500,
              px: 3,
              '&:hover': {
                bgcolor: '#e53935',
              }
            }}
            startIcon={status === 'saving' ? <CircularProgress size={16} color="inherit" /> : null}
          >
            {status === 'saving' ? 'Saving...' : 'Save'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default SaveWorkflowModal; 