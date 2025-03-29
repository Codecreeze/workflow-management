import { SxProps, Theme } from "@mui/material/styles";

export const styles = {
  container: {
    width: "100%",
    height: "100vh",
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
  },
  header: {
    backgroundColor: "#f5f5f5",
    padding: "20px 20px",
    display: "flex",
    alignItems: "center",
    zIndex: 10,
    position: "sticky",
    top: 0,
    boxShadow: "none",
  },
  menuIcon: {
    border: "1.11px solid #E0E0E0",
    width: "40px",
    height: "40px",
    borderRadius: "8px",
    background: "#FFFFFF",
    "&:hover": { backgroundColor: "#ffffff" },
  },
  headerTitle: {
    fontWeight: "bold",
    fontSize: "18px",
    ml: 2,
  },
  content: {
    padding: { xs: "20px 20px", md: "30px 50px 60px 70px" },
    flex: 1,
    display: "flex",
    flexDirection: "column",
    backgroundColor: "#f5f5f5",
    overflow: "hidden",
  },
  toolbarContainer: {
    display: "flex",
    flexDirection: { xs: "column", sm: "row" },
    justifyContent: "space-between",
    alignItems: { xs: "stretch", sm: "center" },
    mb: 3,
    gap: { xs: 2, sm: 0 }
  },
  searchField: {
    width: { xs: "100%", sm: "340px" },
    "& .MuiOutlinedInput-root": {
      backgroundColor: "white",
      height: "32px",
      border: "1px solid #E0E0E0",
      borderRadius: "4px",
      width: "100%",
      "& .MuiOutlinedInput-notchedOutline": {
        border: "none",
      },
    },
  },
  buttonContainer: {
    display: "flex",
    justifyContent: { xs: "flex-end", sm: "flex-end" },
    width: "100%"
  },
  createButton: {
    backgroundColor: "black",
    textTransform: "none",
    borderRadius: "5px",
    height: "40px",
    color: "white",
  },
  tableContainer: {
    mb: 3,
    boxShadow: "none",
    borderRadius: "4px",
    flex: 1,
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
  },
  tableHeaderCell: {
    fontWeight: "bold",
    height: "48px",
    padding: "16px 8px",
    borderBottom: "1px solid #FF9800",
  },
  tableCell: {
    height: "48px", 
    padding: "12px 8px",
  },
  tableRow: {
    "&:hover": { backgroundColor: "#f9f9f9" },
    height: "48px",
  },
  tableWrapper: {
    overflow: "auto",
    flex: 1,
  },
  tableScrollContainer: {
    overflow: "auto",
    minWidth: "100%",
    flex: 1,
    padding: "0px 20px 0px 40px",
    marginTop: "10px"
  },
  executeButton: {
    width: "71px",
    height: "32px",
    borderRadius: "6px",
    border: "1px solid #E0E0E0",
    padding: "7px 12px",
    gap: "2px",
    backgroundColor: "#FFFFFF",
    minWidth: 0,
    "&:hover": {
      backgroundColor: "#FEF3E9",
      borderColor: "#FF9800"
    },
    fontWeight: 500,
    fontSize: "12px",
    lineHeight: "150%",
    letterSpacing: "0%",
    textAlign: "center",
    verticalAlign: "middle",
    textTransform: "capitalize",
    color: "#221F20",
  },
  editButton: {
    width: "71px",
    height: "32px",
    borderRadius: "6px",
    border: "1px solid #E0E0E0",
    padding: "7px 12px",
    gap: "2px",
    backgroundColor: "#FFFFFF",
    minWidth: 0,
    "&:hover": {
      backgroundColor: "#FEF3E9",
      borderColor: "#FF9800"
    },
    fontWeight: 500,
    fontSize: "12px",
    lineHeight: "150%",
    letterSpacing: "0%",
    textAlign: "center",
    verticalAlign: "middle",
    textTransform: "capitalize",
    color: "#221F20",
  },
  iconContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  pinIcon: {
    fontSize: "20px",
    transform: "rotate(45deg)"
  },
  pinnedIcon: {
    fontSize: "20px",
    color: "#F9A825",
    transform: "rotate(45deg)"
  },
  noDataCell: {
    padding: "40px 20px",
    height: "400px",
    textAlign: "center"
  },
  noDataContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  noDataImage: {
    maxWidth: "300px"
  },
  noDataText: {
    marginTop: 2,
    marginBottom: 1,
    fontWeight: "medium"
  },
  dialogTitle: {
    fontWeight: "bold",
  },
  paginationContainer: {
    padding: "20px 30px 20px 40px", 
    backgroundColor: "white",
    borderTop: "1px solid #e0e0e0",
    position: "sticky",
    bottom: 0,
    zIndex: 5,
    display: "flex",
    justifyContent: "flex-end",
    alignItems: "center",
    gap: 3
  },
  rowsPerPageContainer: {
    display: "flex", 
    alignItems: "center"
  },
  rowsPerPageText: {
    mr: 2
  },
  rowsPerPageSelect: {
    minWidth: "45px",
    "& .MuiInput-underline:before": { borderBottom: "none" },
    "& .MuiInput-underline:hover:not(.Mui-disabled):before": {
      borderBottom: "none",
    },
    "& .MuiInput-underline:after": { borderBottom: "none" }
  },
  menuPaper: {
    elevation: 1,
    overflow: "visible",
    filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.12))",
    mt: 0.5,
    padding: 0,
    paddingTop: 0,
    paddingBottom: 0,
    '&::before': {
      content: '""',
      display: 'block',
      position: 'absolute',
      top: 0,
      right: 14,
      width: 10,
      height: 10,
      bgcolor: 'background.paper',
      transform: 'translateY(-50%) rotate(45deg)',
      zIndex: 0
    }
  },
  menu: {
    paddingTop: 0,
    paddingBottom: 0,
    "& .MuiMenu-list": {
      paddingTop: 0,
      paddingBottom: 0
    }
  },
  deleteText: {
    color: "#EF5350"
  }
} as Record<string, SxProps<Theme>>; 