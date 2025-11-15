import { AppBar, Toolbar, Typography, Button, Box, useTheme, useMediaQuery } from '@mui/material';
import { useHotkeys } from '../hooks/useHotkeys';
import { useRef } from 'react';
import Keycap from './Keycap';

interface BulkActionsBarProps {
    selectedCount: number;
    onApprove: () => void;
    onReject: () => void;
    onClear: () => void;
}

export const BulkActionsBar = ({
    selectedCount,
    onApprove,
    onReject,
    onClear,
}: BulkActionsBarProps) => {
    const approveAllRef = useRef<HTMLButtonElement>(null);
    const rejectAllRef = useRef<HTMLButtonElement>(null);
    const clearRef = useRef<HTMLButtonElement>(null);

    const theme = useTheme();
    const isSm = useMediaQuery(theme.breakpoints.down('sm'));

    useHotkeys([
        ['a', () => approveAllRef.current?.click()],
        ['A', () => approveAllRef.current?.click()],
        ['ф', () => approveAllRef.current?.click()],
        ['Ф', () => approveAllRef.current?.click()],
        ['d', () => rejectAllRef.current?.click()],
        ['D', () => rejectAllRef.current?.click()],
        ['в', () => rejectAllRef.current?.click()],
        ['В', () => rejectAllRef.current?.click()],
        ['Escape', () => clearRef.current?.click()]
    ]);

    return (
        <AppBar
            position="fixed"
            color="primary"
            sx={{ top: 'auto', bottom: 0, background: '#333' }}
        >
            <Toolbar
                sx={{
                    flexDirection: { xs: 'column', sm: 'row' },
                    alignItems: { xs: 'stretch', sm: 'center' },
                    gap: 1,
                    py: { xs: 1, sm: 0.5 },
                }}
            >
                <Typography
                    variant={isSm ? 'subtitle2' : 'h6'}
                    sx={{
                        flexGrow: 1,
                        textAlign: { xs: 'center', sm: 'left' },
                        width: { xs: '100%', sm: 'auto' },
                        mb: { xs: 0.5, sm: 0 },
                    }}
                >
                    {selectedCount} выбран{selectedCount === 1 ? 'о' : 'ы'}
                </Typography>

                <Box
                    sx={{
                        display: 'flex',
                        gap: 1,
                        width: { xs: '100%', sm: 'auto' },
                        flexDirection: { xs: 'column', sm: 'row' },
                        alignItems: 'center',
                    }}
                >
                    <Button
                        ref={approveAllRef}
                        variant="contained"
                        color="success"
                        onClick={onApprove}
                        size={isSm ? 'small' : 'medium'}
                        fullWidth={isSm}
                    >
                        {!isSm && <Keycap variant='filled'>A</Keycap>}
                        {isSm ? 'Одобрить' : ' Одобрить выбранное'}
                    </Button>

                    <Button
                        ref={rejectAllRef}
                        variant="contained"
                        color="error"
                        onClick={onReject}
                        size={isSm ? 'small' : 'medium'}
                        fullWidth={isSm}
                    >
                        {!isSm && <Keycap variant='filled'>D</Keycap>}
                        {isSm ? 'Отклонить' : ' Отклонить выбранное'}
                    </Button>

                    <Button
                        variant="outlined"
                        color="inherit"
                        onClick={onClear}
                        size={isSm ? 'small' : 'medium'}
                        fullWidth={isSm}
                        ref={clearRef}
                    >
                        {!isSm && <Keycap variant='filled'>Esc</Keycap>}
                        {isSm ? 'Очистить' : ' Очистить выбранное'}
                    </Button>
                </Box>
            </Toolbar>
        </AppBar>
    );
};
