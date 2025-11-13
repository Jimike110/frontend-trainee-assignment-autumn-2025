import { NavLink as RouterNavLink, Outlet } from 'react-router-dom';
import {
  AppBar,
  Box,
  Button,
  Container,
  Toolbar,
  Typography,
} from '@mui/material';

export const MainLayout = () => {
  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar component="nav">
        <Toolbar>
          <Typography
            variant="h6"
            component="div"
            sx={{ flexGrow: 1, display: { xs: 'none', sm: 'block' } }}
          >
            Avito Moderation Tool
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
          </Box>
        </Toolbar>
      </AppBar>
      <Container component="main" sx={{ p: 3, mt: 8 }}>
        <Outlet />
      </Container>
    </Box>
  );
};
