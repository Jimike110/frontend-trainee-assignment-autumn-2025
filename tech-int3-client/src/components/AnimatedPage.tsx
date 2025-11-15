import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

const animations = {
  initial: { opacity: 0, x: -5 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: 5 },
};

interface AnimatedPageProps {
  children: ReactNode;
}

export const AnimatedPage = ({ children }: AnimatedPageProps) => {
  return (
    <motion.div
      variants={animations}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ duration: 0.5 }}
    >
      {children}
    </motion.div>
  );
};
