import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import { ThemeProvider, CssBaseline } from '@mui/material'
import { store } from './redux/store.ts'
import './index.css'
import App from './App.tsx'
import { createTheme } from '@mui/material/styles'
import { setupGlobalErrorHandlers } from './components/ErrorBoundary.tsx'

// Set up global error handlers
setupGlobalErrorHandlers();

// Create a custom theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#4caf50',
    },
    secondary: {
      main: '#f44336',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        'html, body, #root': {
          width: '100%',
          height: '100%',
          margin: 0,
          padding: 0,
          overflow: 'hidden',
        },
        '#root': {
          display: 'flex',
          flexDirection: 'column',
        },
      },
    },
  },
});

// Get the root element
const rootElement = document.getElementById('root');

// Create the root and render the app
if (rootElement) {
  createRoot(rootElement).render(
    <StrictMode>
      <Provider store={store}>
        <BrowserRouter>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <App />
          </ThemeProvider>
        </BrowserRouter>
      </Provider>
    </StrictMode>,
  );
}
