import { type Category } from './ads';

type CategoriesChart = Record<Category, number>;

export interface Stats {
  summary: Summary;
  activityChart: ActivityChart[] | [];
  decisionsChart: {
    approved: number;
    rejected: number;
    requestChanges: number;
  };
  categoriesChart: CategoriesChart | null;
}

interface Summary {
  totalReviewed: number;
  totalReviewedToday: number;
  totalReviewedThisWeek: number;
  totalReviewedThisMonth: number;
  approvedPercentage: number;
  rejectedPercentage: number;
  requestChangesPercentage: number;
  averageReviewTime: number;
}

interface ActivityChart {
  date: string;
  approved: number;
  rejected: number;
  requestChanges: number;
}
