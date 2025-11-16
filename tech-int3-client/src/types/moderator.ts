type Permissions =
  | 'approve_ads'
  | 'reject_ads'
  | 'request_changes'
  | 'view_stats';

export interface Moderator {
  id: number;
  name: string;
  email: string;
  role: string;
  statistics: ModeratorStats;
  permissions: Permissions[];
}

interface ModeratorStats {
  totalReviewed: number;
  todayReviewed: number;
  thisWeekReviewed: number;
  thisMonthReviewed: number;
  averageReviewTime: number;
  approvalRate: number;
}
