import { SxProps, Theme } from "@mui/material/styles";

export const styles = {
  dialogTitle: {
    fontWeight: "bold",
  },
  dialogContent: {
    mt: 1
  },
  dialogActions: {
    px: 3,
    pb: 2
  },
  cancelButton: {
    color: 'text.secondary'
  },
  confirmButton: {
    fontWeight: 'medium'
  },
  deleteButton: {
    color: '#EF5350'
  }
} as Record<string, SxProps<Theme>>; 