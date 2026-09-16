import React, { useEffect } from 'react';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { theme } from './theme/theme';
import { setupMockApi } from './services/mockApi';
import { AppLayout } from './components/layout/AppLayout';
import { Dashboard } from './pages/Dashboard';
import { TransactionSearch } from './pages/TransactionSearch';
import { JourneyView } from './pages/JourneyView';
import { ExceptionWorkbench } from './pages/ExceptionWorkbench';
import { Administration } from './pages/Administration';

export const App: React.FC = () => {
  useEffect(() => {
    setupMockApi();
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <Routes>
          <Route element={<AppLayout />}>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/search" element={<TransactionSearch />} />
            <Route path="/journey/:id" element={<JourneyView />} />
            <Route path="/exceptions" element={<ExceptionWorkbench />} />
            <Route path="/admin" element={<Administration />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
};

export default App;
