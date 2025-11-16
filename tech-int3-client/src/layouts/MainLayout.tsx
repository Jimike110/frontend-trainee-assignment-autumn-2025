import {
  NavLink as RouterNavLink,
  Outlet,
  useLocation,
} from 'react-router-dom';
import {
  AppBar,
  Box,
  Button,
  Container,
  Toolbar,
  Typography,
  IconButton,
  Chip,
} from '@mui/material';
import { Toaster } from 'react-hot-toast';
import { Brightness4, Brightness7 } from '@mui/icons-material';
import { useTheme } from '../context/ThemeContext';
import { useNewAds } from '../context/NewAdsContext';
import { AnimatePresence, motion } from 'framer-motion';
import { QueryProgressBar } from '../components/QueryProgressBar';

export const MainLayout = () => {
  const { mode, toggleTheme } = useTheme();
  const { newAdsCount, triggerRefetch } = useNewAds();
  const location = useLocation();

  const hasFilters = location.search;

  const showLoadNew = newAdsCount > 0 && !hasFilters;

  return (
    <Box sx={{ display: 'flex' }}>
      <QueryProgressBar />
      <Toaster position="top-right" reverseOrder={false} />
      <AppBar component="nav">
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <RouterNavLink
            to="/"
            style={{ display: 'flex', alignItems: 'center' }}
          >
            <img
              width={110}
              src="https://static.tildacdn.com/tild6438-3762-4439-a366-616561343235/Logo-Avito_new_2.svg"
              alt="Avito Logo"
              style={{ marginInline: 16 }}
            />
            <Typography
              variant="h6"
              component="div"
              sx={{ flexGrow: 1, display: { xs: 'none', sm: 'block' } }}
            >
              модерация
            </Typography>
          </RouterNavLink>
          <Box>
            {showLoadNew && (
              <Button
                variant="contained"
                color="warning"
                onClick={triggerRefetch}
                endIcon={<Chip label={newAdsCount} size="small" />}
                sx={{ mr: 2 }}
              >
                Load New
              </Button>
            )}
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
        <AnimatePresence mode="wait">
          <motion.div key={location.pathname}>
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </Container>
    </Box>
  );
};
