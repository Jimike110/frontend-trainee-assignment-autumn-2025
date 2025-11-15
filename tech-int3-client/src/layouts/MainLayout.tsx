import { NavLink as RouterNavLink, Outlet } from 'react-router-dom';
import {
  AppBar,
  Box,
  Button,
  Container,
  Toolbar,
  Typography,
  IconButton,
} from '@mui/material';
import { Toaster } from 'react-hot-toast';
import {Brightness4, Brightness7} from '@mui/icons-material';
import { useTheme } from '../context/ThemeContext';

export const MainLayout = () => {
  const { mode, toggleTheme } = useTheme();

  return (
    <Box sx={{ display: 'flex' }}>
      <Toaster position="top-right" reverseOrder={false} />
      <AppBar component="nav">
        <Toolbar>
          <img width={110} src="https://static.tildacdn.com/tild6438-3762-4439-a366-616561343235/Logo-Avito_new_2.svg" alt="Avito Logo" style={{ marginInline: 16 }} />
          <Typography
            variant="h6"
            component="div"
            sx={{ flexGrow: 1, display: { xs: 'none', sm: 'block' } }}
          >
            модерация
          </Typography>
          <Box>
            <Button sx={{ color: '#fff' }} component={RouterNavLink} to="/list">
              Ads
            </Button>
            <Button
              sx={{ color: '#fff' }}
              component={RouterNavLink}
              to="/stats"
            >
              Stats
            </Button>

            <IconButton sx={{ ml: 1 }} onClick={toggleTheme} color="inherit">
              {mode === 'dark' ? <Brightness7 /> : <Brightness4 />}
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>
      <Container component="main" sx={{ p: 3, mt: 8 }}>
        <Outlet />
      </Container>
    </Box>
  );
};
