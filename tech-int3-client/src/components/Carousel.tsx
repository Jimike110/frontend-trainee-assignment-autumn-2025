import { useState, type ReactNode } from 'react';
import { Box, IconButton, type SxProps, type Theme } from '@mui/material';
import { ChevronLeft, ChevronRight } from '@mui/icons-material';

interface CarouselProps {
  children: ReactNode[];
  sx?: SxProps<Theme>;
}

const Carousel = ({ children, sx = {} }: CarouselProps) => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  const next = (): void => {
    setCurrentIndex((prevIndex: number) =>
      prevIndex === children.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prev = (): void => {
    setCurrentIndex((prevIndex: number) =>
      prevIndex === 0 ? children.length - 1 : prevIndex - 1
    );
  };

  return (
    <Box sx={{ position: 'relative', ...sx }}>
      <Box sx={{ position: 'relative', overflow: 'hidden' }}>
        <Box
          sx={{
            display: 'flex',
            transition: 'transform 0.3s ease',
            transform: `translateX(-${currentIndex * 100}%)`,
          }}
        >
          {children.map((child: ReactNode, index: number) => (
            <Box key={index} sx={{ minWidth: '100%' }}>
              {child}
            </Box>
          ))}
        </Box>
      </Box>

      {children.length > 1 && (
        <>
          <IconButton
            onClick={prev}
            sx={{
              position: 'absolute',
              left: 8,
              top: '50%',
              transform: 'translateY(-50%)',
              backgroundColor: 'rgba(255,255,255,0.8)',
              '&:hover': { backgroundColor: 'rgba(255,255,255,0.9)' },
            }}
          >
            <ChevronLeft />
          </IconButton>
          <IconButton
            onClick={next}
            sx={{
              position: 'absolute',
              right: 8,
              top: '50%',
              transform: 'translateY(-50%)',
              backgroundColor: 'rgba(255,255,255,0.8)',
              '&:hover': { backgroundColor: 'rgba(255,255,255,0.9)' },
            }}
          >
            <ChevronRight />
          </IconButton>

          <Box
            sx={{ display: 'flex', justifyContent: 'center', mt: 1, gap: 0.5 }}
          >
            {children.map((_: ReactNode, index: number) => (
              <Box
                key={index}
                sx={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  backgroundColor:
                    currentIndex === index ? 'primary.main' : 'grey.400',
                  cursor: 'pointer',
                }}
                onClick={() => setCurrentIndex(index)}
              />
            ))}
          </Box>
        </>
      )}
    </Box>
  );
};

export default Carousel;
