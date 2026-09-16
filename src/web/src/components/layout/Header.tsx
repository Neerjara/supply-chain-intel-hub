import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  InputBase,
  Box,
  IconButton,
  Badge,
  Avatar,
  Paper,
} from '@mui/material';
import {
  Search as SearchIcon,
  NotificationsOutlined as NotificationsIcon,
  TuneOutlined as FilterIcon,
} from '@mui/icons-material';

const DRAWER_WIDTH = 260;

export const Header: React.FC = () => {
  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        width: `calc(100% - ${DRAWER_WIDTH}px)`,
        ml: `${DRAWER_WIDTH}px`,
        backgroundColor: '#ffffff',
        borderBottom: '1px solid #e2e8f0',
        color: '#0f172a',
      }}
    >
      <Toolbar sx={{ justifyContent: 'space-between', px: 3 }}>
        {/* Global Search Bar */}
        <Paper
          component="form"
          sx={{
            p: '2px 8px',
            display: 'flex',
            alignItems: 'center',
            width: 400,
            backgroundColor: '#f8fafc',
            border: '1px solid #e2e8f0',
            boxShadow: 'none',
          }}
        >
          <SearchIcon sx={{ color: '#64748b', ml: 1, mr: 1 }} />
          <InputBase
            placeholder="Search Tracking #, Container, or Destination..."
            sx={{ ml: 1, flex: 1, fontSize: 14 }}
          />
          <IconButton type="button" sx={{ p: '6px' }} aria-label="filter">
            <FilterIcon sx={{ fontSize: 18, color: '#64748b' }} />
          </IconButton>
        </Paper>

        {/* Right Action Icons & Profile */}
        <Box display="flex" alignItems="center" gap={2}>
          <IconButton sx={{ color: '#64748b' }}>
            <Badge badgeContent={5} color="error">
              <NotificationsIcon />
            </Badge>
          </IconButton>

          <Box display="flex" alignItems="center" gap={1.5} sx={{ cursor: 'pointer' }}>
            <Avatar sx={{ bgcolor: '#2563eb', width: 36, height: 36, fontSize: 14, fontWeight: 700 }}>
              SA
            </Avatar>
            <Box display={{ xs: 'none', sm: 'block' }}>
              <Typography variant="subtitle2" fontWeight={600} lineHeight={1.2}>
                Sarah Admin
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Logistics Director
              </Typography>
            </Box>
          </Box>
        </Box>
      </Toolbar>
    </AppBar>
  );
};
