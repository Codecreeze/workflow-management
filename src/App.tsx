import { Routes, Route, Navigate } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { CircularProgress, Box } from '@mui/material';
import ErrorBoundary from './components/ErrorBoundary';
import { styles } from './styles/App.styles';

// Lazy loading components for better performance
const Login = lazy(() => import('./pages/Auth/Login'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const WorkflowEditor = lazy(() => import('./pages/WorkflowEditor'));

// Loading component
const Loading = () => (
  <Box sx={styles.loadingContainer}>
    <CircularProgress />
  </Box>
);

function App() {
  return (
    <ErrorBoundary>
      <Suspense fallback={<Loading />}>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/workflow/new" element={<WorkflowEditor />} />
          <Route path="/workflow/update/:id" element={<WorkflowEditor />} />
          <Route path="/workflow/edit/:id" element={<WorkflowEditor />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </Suspense>
    </ErrorBoundary>
  );
}

export default App;
