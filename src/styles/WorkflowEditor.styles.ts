import { SxProps, Theme } from "@mui/material/styles";

export const styles = {
  container: {
    width: '100%', 
    height: '100vh', 
    display: 'flex', 
    flexDirection: 'column',
    backgroundColor: '#faf3e3',
    overflow: 'hidden'
  },
  header: {
    padding: '12px 20px', 
    display: 'flex', 
    alignItems: 'center',
    zIndex: 10,
    borderBottom: 'none',
  },
  titleContainer: {
    display: 'flex',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: '8px',
    boxShadow: '0px 1px 2px rgba(0,0,0,0.05)',
    padding: '12px 16px',
  },
  backText: {
    display: 'flex',
    alignItems: 'center',
    fontWeight: 500,
    fontSize: '16px',
    cursor: 'pointer',
    marginRight: '24px',
  },
  arrowIcon: {
    fontSize: '20px',
    marginRight: '8px',
  },
  divider: {
    height: '24px',
    width: '1px',
    backgroundColor: '#e0e0e0',
    margin: '0 16px',
  },
  title: {
    fontSize: '16px',
    fontWeight: 500,
  },
  saveIcon: {
    marginLeft: '16px',
    backgroundColor: '#FFC107',
    padding: '8px',
    borderRadius: '4px',
    width: '24px',
    height: '24px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  flowContainer: { 
    flex: 1, 
    position: 'relative',
    overflow: 'hidden'
  },
  flowBackground: {
    background: '#faf3e3', 
    width: '100%', 
    height: '100%'
  },
  controlsPanel: { 
    position: 'absolute', 
    bottom: 16, 
    left: 16, 
    zIndex: 5,
    display: 'flex',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: '4px',
    padding: '4px',
    boxShadow: '0px 1px 2px rgba(0,0,0,0.05)',
    border: '1px solid #e0e0e0'
  },
  zoomContainer: { 
    position: 'absolute', 
    bottom: 16, 
    right: 16, 
    zIndex: 5,
    display: 'flex',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: '4px',
    padding: '4px',
    boxShadow: '0px 1px 2px rgba(0,0,0,0.05)',
    border: '1px solid #e0e0e0'
  },
  iconButton: {
    padding: '4px',
    color: '#757575',
  },
  slider: { 
    mx: 2, 
    width: 100 
  },
  nodePanel: { 
    p: 2, 
    backgroundColor: 'white', 
    borderRadius: '8px', 
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    border: '1px solid #e0e0e0',
    mb: 2
  },
  nodeTitle: { 
    mb: 1, 
    fontWeight: 'bold', 
    fontSize: '14px' 
  },
  nodeButtonsContainer: { 
    display: 'flex', 
    gap: 1 
  },
  nodeButton: {
    textTransform: 'none',
    borderColor: '#e0e0e0',
    color: 'black',
    '&:hover': { borderColor: '#bdbdbd' },
    fontSize: '13px'
  },
  footer: { 
    padding: '12px 20px', 
    display: 'flex', 
    justifyContent: 'flex-end',
    borderTop: '1px solid #e0e0e0',
    backgroundColor: '#faf3e3',
    zIndex: 10
  },
  saveButton: { 
    backgroundColor: '#4CAF50',
    '&:hover': { 
      backgroundColor: '#4CAF50',
      opacity: 0.9
    },
    textTransform: 'none'
  },
} as Record<string, SxProps<Theme>>; 