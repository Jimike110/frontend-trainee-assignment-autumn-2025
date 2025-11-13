import React from 'react';
import { Box, useTheme } from '@mui/material';

interface KeycapProps {
  children: React.ReactNode;
  size?: 'small' | 'medium';
  variant?: 'outlined' | 'filled';
}

/**
 * Custom Keycap component for displaying keyboard keys
 */
const Keycap: React.FC<KeycapProps> = ({
  children,
  size = 'medium',
  variant = 'outlined',
}) => {
  const theme = useTheme();

  const padding = size === 'small' ? '2px 6px' : '4px 8px';
  const fontSize = size === 'small' ? '0.75rem' : '0.875rem';
  const backgroundColor =
    variant === 'filled' ? theme.palette.grey[200] : 'transparent';
  const borderColor =
    variant === 'outlined' ? theme.palette.grey[400] : 'transparent';

  return (
    <Box
      component="span"
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding,
        fontSize,
        fontWeight: 500,
        color: theme.palette.text.primary,
        borderRadius: '4px',
        border: `1px solid ${borderColor}`,
        backgroundColor,
        boxShadow:
          variant === 'filled' ? 'inset 0 -1px 0 rgba(0,0,0,0.2)' : 'none',
        userSelect: 'none',
        fontFamily: 'Roboto, Arial, sans-serif',
        mr: 1.5,
        ml: 1.5,
        mb: 0.5,
      }}
    >
      {children}
    </Box>
  );
};

export default Keycap;
