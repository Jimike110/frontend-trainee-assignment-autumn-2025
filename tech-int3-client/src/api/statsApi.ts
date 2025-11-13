import type { Stats } from '../types';
import axiosClient from './axiosClient';

export type StatsPeriod = 'today' | 'week' | 'month';

/**
 * Fetches the summary statistics.
 * @param period - The time period for the stats.
 */
export const getSummaryStats = async (
  period: StatsPeriod
): Promise<Stats['summary']> => {
  const response = await axiosClient.get('/stats/summary', {
    params: { period },
  });
  return response.data;
};

/**
 * Fetches the data for the daily activity chart.
 * @param period - The time period for the stats.
 */
export const getActivityChartData = async (
  period: StatsPeriod
): Promise<Stats['activityChart']> => {
  const response = await axiosClient.get('/stats/chart/activity', {
    params: { period },
  });
  return response.data;
};

/**Fetches the data for the decisions distribution chart.
 * @param period - The time period for the stats.
 */
export const getDecisionsChartData = async (
  period: StatsPeriod
): Promise<Stats['decisionsChart']> => {
  const response = await axiosClient.get('/stats/chart/decisions', {
    params: { period },
  });
  return response.data;
};

/**
 * Fetches the data for the categories distribution chart.
 * @param period - The time period for the stats.
 */
export const getCategoriesChartData = async (
  period: StatsPeriod
): Promise<Stats['categoriesChart']> => {
  const response = await axiosClient.get('stats/chart/categories', {
    params: { period },
  });
  return response.data;
};
