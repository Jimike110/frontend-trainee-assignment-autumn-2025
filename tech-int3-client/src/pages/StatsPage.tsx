import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  Box,
  Typography,
  Grid,
  Paper,
  ToggleButtonGroup,
  ToggleButton,
  CircularProgress,
  Alert,
  Stack,
  Button,
} from '@mui/material';
import {
  getSummaryStats,
  getActivityChartData,
  getDecisionsChartData,
  getCategoriesChartData,
  type StatsPeriod,
} from '../api/statsApi';
import { ActivityChart } from '../components/ActivityChart';
import { DecisionsChart } from '../components/DecisionsChart';
import { CategoriesChart } from '../components/CategoriesChart';
import { exportStatsToCSV, generatePdfReport } from '../utils/exportUtils';

const StatCard = ({
  title,
  value,
}: {
  title: string;
  value: string | number;
}) => (
  <Paper sx={{ p: 2, textAlign: 'center' }}>
    <Typography variant="h6" color="text.secondary">
      {title}
    </Typography>
    <Typography variant="h4">{value}</Typography>
  </Paper>
);

export const StatsPage = () => {
  const [period, setPeriod] = useState<StatsPeriod>('week');

  const handlePeriodChange = (
    _event: React.MouseEvent<HTMLElement>,
    newPeriod: StatsPeriod | null
  ) => {
    if (newPeriod) {
      setPeriod(newPeriod);
    }
  };

  const summaryQuery = useQuery({
    queryKey: ['summaryStats', period],
    queryFn: () => getSummaryStats(period),
  });

  const activityQuery = useQuery({
    queryKey: ['activityChart', period],
    queryFn: () => getActivityChartData(period),
  });

  const decisionsQuery = useQuery({
    queryKey: ['decisionsChart', period],
    queryFn: () => getDecisionsChartData(period),
  });

  const categoriesQuery = useQuery({
    queryKey: ['categoriesChart', period],
    queryFn: () => getCategoriesChartData(period),
  });

  const isLoading =
    summaryQuery.isLoading ||
    activityQuery.isLoading ||
    decisionsQuery.isLoading ||
    categoriesQuery.isLoading;
  const isError =
    summaryQuery.isError ||
    activityQuery.isError ||
    decisionsQuery.isError ||
    categoriesQuery.isError;

  const handleExportCSV = () => {
    if (summaryQuery.data && activityQuery.data) {
      exportStatsToCSV(summaryQuery.data, activityQuery.data);
    }
  };

  const handleGeneratePDF = () => {
    if (summaryQuery.data && activityQuery.data) {
      generatePdfReport(summaryQuery.data, activityQuery.data);
    }
  };

  if (isError) {
    return <Alert severity="error">Failed to load statistics.</Alert>;
  }

  return (
    <Box>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 2,
          mb: 3,
        }}
      >
        <Typography variant="h4" component={'h1'}>
          Moderator Statistics
        </Typography>

        <Stack direction="row" spacing={2}>
          <Button
            variant="outlined"
            onClick={handleExportCSV}
            disabled={isLoading}
          >
            Export to CSV
          </Button>
          <Button
            variant="contained"
            onClick={handleGeneratePDF}
            disabled={isLoading}
          >
            Generate PDF Report
          </Button>
        </Stack>

        <ToggleButtonGroup
          value={period}
          exclusive
          onChange={handlePeriodChange}
          aria-label="time period"
        >
          <ToggleButton value={'today'} aria-label="today">
            Today
          </ToggleButton>
          <ToggleButton value={'week'} aria-label="this week">
            7 days
          </ToggleButton>
          <ToggleButton value={'month'} aria-label="this month">
            30 days
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>

      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Grid container spacing={3}>
          <Grid component={'div'} size={{ xs: 6, md: 3 }}>
            <StatCard
              title="Total Reviewed"
              value={summaryQuery.data?.totalReviewed || 0}
            ></StatCard>
          </Grid>
          <Grid component={'div'} size={{ xs: 6, md: 3 }}>
            <StatCard
              title="Approved"
              value={`${summaryQuery.data?.approvedPercentage.toFixed(1) || 0}%`}
            ></StatCard>
          </Grid>
          <Grid component={'div'} size={{ xs: 6, md: 3 }}>
            <StatCard
              title="Rejected"
              value={`${summaryQuery.data?.rejectedPercentage.toFixed(1) || 0}%`}
            ></StatCard>
          </Grid>
          <Grid component={'div'} size={{ xs: 6, md: 3 }}>
            <StatCard
              title="Avg. Review Time"
              value={`${(summaryQuery.data!.averageReviewTime / 60).toFixed(1) || 0} min`}
            ></StatCard>
          </Grid>

          <Grid component={'div'} size={{ xs: 12, lg: 12 }}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Activity
              </Typography>
              {activityQuery.data && (
                <ActivityChart data={activityQuery.data} />
              )}
            </Paper>
          </Grid>
          <Grid component={'div'} size={{ xs: 12, lg: 6 }}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Decision Distribution
              </Typography>
              {decisionsQuery.data && (
                <DecisionsChart data={decisionsQuery.data} />
              )}
            </Paper>
          </Grid>
          <Grid component={'div'} size={{ xs: 12, lg: 6 }}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Categories Distribution
              </Typography>
              {decisionsQuery.data && (
                <CategoriesChart data={categoriesQuery.data!} />
              )}
            </Paper>
          </Grid>
        </Grid>
      )}
    </Box>
  );
};
