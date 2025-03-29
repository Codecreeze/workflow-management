import { SxProps, Theme } from "@mui/material/styles";

export const styles = {
  drawerContainer: {
    width: 280, 
    p: 2, 
    height: '100%', 
    display: 'flex', 
    flexDirection: 'column'
  },
  closeButtonContainer: {
    display: 'flex', 
    justifyContent: 'flex-end'
  },
  userProfileSection: {
    display: 'flex', 
    flexDirection: 'column', 
    alignItems: 'center', 
    mb: 3, 
    mt: 2
  },
  avatar: {
    width: 80, 
    height: 80, 
    mb: 2
  },
  userName: {
    fontWeight: 'bold'
  },
  divider: {
    mb: 2
  },
  menuItem: (isActive: boolean) => ({
    borderRadius: '8px',
    bgcolor: isActive ? 'rgba(0, 0, 0, 0.08)' : 'transparent',
    '&:hover': { bgcolor: isActive ? 'rgba(0, 0, 0, 0.12)' : 'rgba(0, 0, 0, 0.12)' }
  }),
  menuItemText: (isActive: boolean) => ({
    fontWeight: isActive ? 'bold' : 'normal',
    color: isActive ? 'primary.main' : 'inherit'
  }),
  spacer: {
    flexGrow: 1
  },
  logoutButton: {
    borderRadius: '8px',
    bgcolor: "rgba(239, 83, 80, 0.08)",
    '&:hover': { 
      bgcolor: 'rgba(239, 83, 80, 0.12)' 
    },
    py: 1
  },
  logoutIcon: {
    color: '#EF5350'
  },
  logoutText: {
    fontWeight: 'medium',
    color: '#EF5350'
  }
} as Record<string, any>; 