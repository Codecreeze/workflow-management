import { useNavigate, useLocation } from 'react-router-dom';
import {
  Drawer,
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Avatar,
  Typography,
  Divider,
  IconButton
} from '@mui/material';
import { Dashboard as DashboardIcon, Logout as LogoutIcon, Close as CloseIcon } from '@mui/icons-material';
import { styles } from '../../styles/AppDrawer.styles';

interface AppDrawerProps {
  open: boolean;
  onClose: () => void;
}

// Dummy user data
const userData = {
  fullName: 'John Doe',
  avatar: 'https://i.pravatar.cc/150?img=3',
  email: 'john.doe@example.com'
};

const AppDrawer = ({ open, onClose }: AppDrawerProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const isDashboardActive = location.pathname === '/' || location.pathname === '/dashboard';

  const handleNavigate = (path: string) => {
    navigate(path);
    onClose();
  };

  const handleLogout = () => {
    onClose();
    navigate('/');
  };

  return (
    <Drawer
      anchor="left"
      open={open}
      onClose={onClose}
    >
      <Box sx={styles.drawerContainer}>
        <Box sx={styles.closeButtonContainer}>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>

        {/* User Profile Section */}
        <Box sx={styles.userProfileSection}>
          <Avatar
            src={userData.avatar}
            alt={userData.fullName}
            sx={styles.avatar}
          />
          <Typography variant="h6" sx={styles.userName}>
            {userData.fullName}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {userData.email}
          </Typography>
        </Box>

        <Divider sx={styles.divider} />

        {/* Navigation Items */}
        <List>
          <ListItem disablePadding>
            <ListItemButton 
              onClick={() => handleNavigate('/dashboard')}
              sx={styles.menuItem(isDashboardActive)}
            >
              <ListItemIcon>
                <DashboardIcon color={isDashboardActive ? 'primary' : 'inherit'} />
              </ListItemIcon>
              <ListItemText 
                primary={
                  <Typography 
                    sx={styles.menuItemText(isDashboardActive)}
                  >
                    Dashboard
                  </Typography>
                }
              />
            </ListItemButton>
          </ListItem>
        </List>

        <Box sx={styles.spacer} />

        {/* Logout Section */}
        <List>
          <ListItem disablePadding>
            <ListItemButton 
              onClick={handleLogout} 
              sx={styles.logoutButton}
            >
              <ListItemIcon>
                <LogoutIcon sx={styles.logoutIcon} />
              </ListItemIcon>
              <ListItemText 
                primary={
                  <Typography sx={styles.logoutText}>
                    Logout
                  </Typography>
                }
              />
            </ListItemButton>
          </ListItem>
        </List>
      </Box>
    </Drawer>
  );
};

export default AppDrawer; 