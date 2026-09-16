import React from 'react';
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Box,
  Typography,
  Chip,
  Divider,
} from '@mui/material';
import {
  DashboardOutlined as DashboardIcon,
  SearchOutlined as SearchIcon,
  AltRouteOutlined as JourneyIcon,
  WarningAmberOutlined as ExceptionIcon,
  AdminPanelSettingsOutlined as AdminIcon,
  LocalShippingOutlined as LogoIcon,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';

const DRAWER_WIDTH = 260;

const menuItems = [
  { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
  { text: 'Transaction Search', icon: <SearchIcon />, path: '/search' },
  { text: 'Journey View', icon: <JourneyIcon />, path: '/journey/SHP-8921' },
  { text: 'Exception Workbench', icon: <ExceptionIcon />, path: '/exceptions', badge: '5 Alert' },
  { text: 'Administration', icon: <AdminIcon />, path: '/admin' },
];

export const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: DRAWER_WIDTH,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: DRAWER_WIDTH,
          boxSizing: 'border-box',
          backgroundColor: '#0f172a',
          color: '#f8fafc',
          borderRight: 'none',
        },
      }}
    >
      {/* Brand Header */}
      <Box display="flex" alignItems="center" gap={1.5} p={3}>
        <Box
          sx={{
            width: 36,
            height: 36,
            borderRadius: 2,
            backgroundColor: '#2563eb',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <LogoIcon sx={{ color: '#ffffff', fontSize: 22 }} />
        </Box>
        <Box>
          <Typography variant="subtitle1" fontWeight={700} lineHeight={1.2}>
            SCIH Enterprise
          </Typography>
          <Typography variant="caption" sx={{ color: '#94a3b8' }}>
            Supply Chain Hub
          </Typography>
        </Box>
      </Box>

      <Divider sx={{ borderColor: '#1e293b', my: 1 }} />

      {/* Navigation Links */}
      <List sx={{ px: 1.5, py: 1 }}>
        {menuItems.map((item) => {
          const isActive = location.pathname.startsWith(item.path);

          return (
            <ListItem key={item.text} disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton
                onClick={() => navigate(item.path)}
                sx={{
                  borderRadius: 2,
                  py: 1.2,
                  px: 2,
                  backgroundColor: isActive ? '#2563eb' : 'transparent',
                  color: isActive ? '#ffffff' : '#94a3b8',
                  '&:hover': {
                    backgroundColor: isActive ? '#1d4ed8' : '#1e293b',
                    color: '#ffffff',
                  },
                }}
              >
                <ListItemIcon sx={{ color: isActive ? '#ffffff' : '#94a3b8', minWidth: 36 }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.text}
                  primaryTypographyProps={{
                    fontSize: 14,
                    fontWeight: isActive ? 600 : 500,
                  }}
                />
                {item.badge && (
                  <Chip
                    label={item.badge}
                    size="small"
                    sx={{
                      height: 20,
                      fontSize: 11,
                      backgroundColor: '#dc2626',
                      color: '#ffffff',
                      fontWeight: 600,
                    }}
                  />
                )}
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
    </Drawer>
  );
};
