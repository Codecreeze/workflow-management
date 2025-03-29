import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Box,
  TextField,
  InputAdornment,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Typography,
  Pagination,
  PaginationItem,
  MenuItem,
  Menu,
  ListItemIcon,
  ListItemText,
  CircularProgress,
  Alert,
  Snackbar,
} from "@mui/material";

// Direct imports for icons
import {
  Search,
  MoreVert,
  ArrowDownward,
  Add,
  Menu as MenuIcon,
  Delete as DeleteIcon,
  Refresh as RefreshIcon,
} from "@mui/icons-material";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import ArrowLeftIcon from "@mui/icons-material/ArrowLeft";
import PushPin from "@mui/icons-material/PushPin";
import PushPinOutlined from "@mui/icons-material/PushPinOutlined";

// Import styles
import { styles } from "../styles/Dashboard.styles";
import useDebounce from "../hooks/useDebounce";
import noDataImage from "../assets/no-data.jpg";

// Import components and hooks
import ExecuteWorkflowModal from "../components/Modals/ExecuteWorkflowModal";
import DeleteWorkflowModal from "../components/Modals/DeleteWorkflowModal";
import AppDrawer from "../components/Dashboard/AppDrawer";
import { useWorkflows } from "../hooks/useWorkflows";
import { Workflow } from "../types";
import ErrorBoundary from "../components/ErrorBoundary";
import { useActiveWorkflow } from "../hooks/useActiveWorkflow";

const Dashboard = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [openExecuteDialog, setOpenExecuteDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedWorkflow, setSelectedWorkflow] = useState<Workflow | null>(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [pinnedWorkflows, setPinnedWorkflows] = useState<string[]>([]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error" | "info" | "warning">("success");

  const navigate = useNavigate();
  const location = useLocation();
  const { setWorkflow, clearWorkflow } = useActiveWorkflow();

  // Use our custom hook for API interactions
  const {
    workflows,
    isLoading,
    isError,
    error,
    deleteWorkflow,
    refreshData,
    isDeleting
  } = useWorkflows();

  // Use debounce hook for search
  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  // Use debounced search query for filtering
  useEffect(() => {
    setPage(0); // Reset to first page when search query changes
  }, [debouncedSearchQuery]);

  const filteredWorkflows = workflows.filter(
    (workflow) =>
      workflow.name
        .toLowerCase()
        .includes(debouncedSearchQuery.toLowerCase()) ||
      workflow.id.toLowerCase().includes(debouncedSearchQuery.toLowerCase())
  );

  // Calculate pagination
  const displayedWorkflows = filteredWorkflows.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleCreateNew = () => {
    // Clear any existing active workflow before creating a new one
    clearWorkflow();
    navigate("/workflow/new");
  };

  const handleEdit = (workflow: Workflow) => {
    setWorkflow(workflow);
    navigate(`/workflow/update/${workflow.id}`);
  };

  const handleExecute = (workflow: Workflow) => {
    setSelectedWorkflow(workflow);
    setOpenExecuteDialog(true);
  };

  const handleTogglePin = (workflowId: string) => {
    setPinnedWorkflows((prev) =>
      prev.includes(workflowId)
        ? prev.filter((id) => id !== workflowId)
        : [...prev, workflowId]
    );
  };

  const handleConfirmExecute = () => {
    // In a real app, you would execute the workflow here
    setOpenExecuteDialog(false);
    showSnackbar("Workflow execution started", "info");
  };

  const handleCancelExecute = () => {
    setOpenExecuteDialog(false);
  };

  const handleToggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  const handleMenuOpen = (
    event: React.MouseEvent<HTMLElement>,
    workflow: Workflow
  ) => {
    setAnchorEl(event.currentTarget);
    setSelectedWorkflow(workflow);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleDeleteClick = () => {
    handleMenuClose();
    setOpenDeleteDialog(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedWorkflow) return;
    
    const result = await deleteWorkflow(selectedWorkflow.id);
    setOpenDeleteDialog(false);
    
    if (result.success) {
      showSnackbar("Workflow deleted successfully", "success");
    } else {
      showSnackbar(result.error || "Failed to delete workflow", "error");
    }
  };

  const handleCancelDelete = () => {
    setOpenDeleteDialog(false);
  };

  const handleRefresh = () => {
    refreshData();
    showSnackbar("Refreshing workflow data...", "info");
  };

  const showSnackbar = (message: string, severity: "success" | "error" | "info" | "warning") => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  // Table columns configuration
  const columns = [
    { id: "name", label: "Workflow Name", width: "25%" },
    { id: "id", label: "ID", width: "10%" },
    { id: "lastEdited", label: "Last Edited On", width: "25%" },
    { id: "description", label: "Description", width: "25%" },
    { id: "pin", label: "", width: "3%", align: "center" },
    { id: "execute", label: "", width: "6%", align: "center" },
    { id: "edit", label: "", width: "6%", align: "center" },
    { id: "actions", label: "", width: "3%", align: "center" },
  ];

  return (
    <ErrorBoundary>
      <Box sx={styles.container}>
        {/* Header with menu icon */}
        <Box sx={styles.header}>
          <IconButton sx={styles.menuIcon} onClick={handleToggleDrawer}>
            <MenuIcon />
          </IconButton>
          <Box sx={styles.headerTitle}>Workflow Builder</Box>
        </Box>

        {/* Main content area */}
        <Box sx={styles.content}>
          {/* Search and create button */}
          <Box sx={styles.toolbarContainer}>
            <TextField
              placeholder="Search By Workflow Name/ID"
              variant="outlined"
              size="small"
              value={searchQuery}
              onChange={handleSearch}
              sx={styles.searchField}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <Search />
                  </InputAdornment>
                ),
              }}
            />
            <Box sx={styles.buttonContainer}>
              <IconButton 
                onClick={handleRefresh} 
                sx={{ marginRight: 1 }}
                disabled={isLoading}
              >
                <RefreshIcon />
              </IconButton>
              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={handleCreateNew}
                sx={styles.createButton}
              >
                Create New Process
              </Button>
            </Box>
          </Box>

          {/* Error message if API fails */}
          {isError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              Failed to load workflows: {error ? JSON.stringify(error) : 'Unknown error'}
            </Alert>
          )}

          {/* Loading indicator */}
          {isLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
              <CircularProgress />
            </Box>
          ) : (
            <>
              {/* Table of workflows */}
              <TableContainer component={Paper} sx={styles.tableContainer}>
                <Box sx={styles.tableScrollContainer}>
                  <Table stickyHeader aria-label="workflow table">
                    <TableHead>
                      <TableRow>
                        {columns.map((column) => (
                          <TableCell
                            key={column.id}
                            align={column.align as any}
                            width={column.width}
                            sx={styles.tableHeaderCell}
                          >
                            {column.label}
                          </TableCell>
                        ))}
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {displayedWorkflows.length > 0 ? (
                        displayedWorkflows.map((workflow, index) => (
                          <TableRow key={index} sx={styles.tableRow}>
                            <TableCell sx={styles.tableCell}>
                              {workflow.name}
                            </TableCell>
                            <TableCell sx={styles.tableCell}>
                              #{workflow.id}
                            </TableCell>
                            <TableCell sx={styles.tableCell}>
                              {workflow.lastEdited}
                            </TableCell>
                            <TableCell sx={styles.tableCell}>
                              {workflow.description}
                            </TableCell>
                            <TableCell align="center" sx={styles.tableCell}>
                              <IconButton
                                size="small"
                                onClick={() => handleTogglePin(workflow.id)}
                              >
                                {pinnedWorkflows.includes(workflow.id) ? (
                                  <PushPin fontSize="small" sx={styles.pinnedIcon} />
                                ) : (
                                  <PushPinOutlined fontSize="small" sx={styles.pinIcon} />
                                )}
                              </IconButton>
                            </TableCell>
                            <TableCell align="center" sx={styles.tableCell}>
                              <Button
                                variant="outlined"
                                size="small"
                                onClick={() => handleExecute(workflow)}
                                sx={styles.executeButton}
                              >
                                Execute
                              </Button>
                            </TableCell>
                            <TableCell align="center" sx={styles.tableCell}>
                              <Button
                                variant="outlined"
                                size="small"
                                onClick={() => handleEdit(workflow)}
                                sx={styles.editButton}
                              >
                                Edit
                              </Button>
                            </TableCell>
                            <TableCell align="center" sx={styles.tableCell}>
                              <IconButton
                                size="small"
                                onClick={(e) => handleMenuOpen(e, workflow)}
                              >
                                <MoreVert fontSize="small" />
                              </IconButton>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={8} sx={styles.noDataCell}>
                            <Box sx={styles.noDataContainer}>
                              <img
                                src={noDataImage}
                                alt="No Data"
                                style={{ maxWidth: "300px" }}
                              />
                              <Typography variant="h6" sx={styles.noDataText}>
                                No workflows found
                              </Typography>
                              <Typography variant="body2" color="textSecondary">
                                {debouncedSearchQuery ? "Try different search criteria" : "Create a new workflow to get started"}
                              </Typography>
                            </Box>
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </Box>
                {displayedWorkflows.length > 0 && (
                  <Box sx={styles.paginationContainer}>
                    <Pagination
                      count={Math.ceil(filteredWorkflows.length / rowsPerPage)}
                      page={page + 1}
                      onChange={(e, p) => handleChangePage(e, p - 1)}
                      shape="rounded"
                      renderItem={(item) => (
                        <PaginationItem
                          slots={{ previous: ArrowLeftIcon, next: ArrowRightIcon }}
                          {...item}
                        />
                      )}
                    />
                  </Box>
                )}
              </TableContainer>
            </>
          )}
        </Box>

        {/* Drawer */}
        <AppDrawer open={drawerOpen} onClose={handleToggleDrawer} />

        {/* Modals */}
        <ExecuteWorkflowModal
          open={openExecuteDialog}
          onClose={handleCancelExecute}
          onConfirm={handleConfirmExecute}
          workflow={selectedWorkflow}
        />

        <DeleteWorkflowModal
          open={openDeleteDialog}
          onClose={handleCancelDelete}
          onConfirm={handleConfirmDelete}
          workflow={selectedWorkflow}
          isDeleting={isDeleting}
        />

        {/* Menu for more options */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
        >
          <MenuItem onClick={handleDeleteClick}>
            <ListItemIcon>
              <DeleteIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Delete</ListItemText>
          </MenuItem>
        </Menu>

        {/* Snackbar for notifications */}
        <Snackbar
          open={snackbarOpen}
          autoHideDuration={3000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert 
            onClose={handleCloseSnackbar} 
            severity={snackbarSeverity}
            variant="filled"
            sx={{ width: '100%' }}
          >
            {snackbarMessage}
          </Alert>
        </Snackbar>
      </Box>
    </ErrorBoundary>
  );
};

export default Dashboard;
