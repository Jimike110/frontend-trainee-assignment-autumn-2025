import type { Ad } from '../types';

const statusColors: Record<Ad['status'], 'success' | 'warning' | 'error'> = {
  approved: 'success',
  pending: 'warning',
  rejected: 'error',
  draft: 'warning',
};

const priorityColors: Record<Ad['priority'], 'default' | 'error'> = {
  normal: 'default',
  urgent: 'error',
};

export { statusColors, priorityColors };
