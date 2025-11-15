import Papa from 'papaparse';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import type { Stats } from '../types';
import 'jspdf';

declare module 'jspdf' {
  interface jsPDF {
    lastAutoTable?: {
      finalY: number;
    };
  }
}

/**
 * Triggers a browser download for the given content.
 * @param content The file content.
 * @param fileName The name of the file to be downloaded.
 * @param mimeType The MIME type of the file.
 */
function triggerDownload(content: string, fileName: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Exports statistics summary and activity data to a CSV file.
 * @param summaryData The summary statistics object.
 * @param activityData The activity data array.
 */
export function exportStatsToCSV(
  summaryData: Stats['summary'],
  activityData: Stats['activityChart']
) {
  if (!summaryData || !activityData) return;
  const summaryCsv = Papa.unparse({
    fields: ['Metric', 'Value'],
    data: [
      ['Total Reviewed', summaryData.totalReviewed],
      ['Approved Percentage', summaryData.approvedPercentage.toFixed(1)],
      ['Rejected Percentage', summaryData.rejectedPercentage.toFixed(1)],
      ['Average Review Time (sec)', summaryData.averageReviewTime],
    ],
  });

  const activityCsv = Papa.unparse({
    fields: ['Date', 'Approved', 'Rejected'],
    data: activityData.map((item) => [item.date, item.approved, item.rejected]),
  });

  const combinedCsv = `Summary Statistics\n${summaryCsv}\n\nActivity Data\n${activityCsv}`;
  const fileName = `moderation_stats_${new Date().toISOString().split('T')[0]}.csv`;

  triggerDownload(combinedCsv, fileName, 'text/csv;charset=utf-8');
}

/**
 * Generates and downloads a PDF report of the statistics.
 * @param summaryData The summary statistics object.
 * @param activityData The activity data array.
 */
export function generatePdfReport(
  summaryData: Stats['summary'],
  activityData: Stats['activityChart']
) {
  if (!summaryData || !activityData) return;

  const doc = new jsPDF();
  const reportDate = new Date().toLocaleDateString();

  doc.setFontSize(18);
  doc.text(`Moderation Statistics Report`, 14, 22);
  doc.setFontSize(11);
  doc.text(`Generated on ${reportDate}`, 14, 30);
  doc.setFontSize(14);
  doc.text('Summary', 14, 45);

  autoTable(doc, {
    startY: 50,
    head: [['Metric', 'Value']],
    body: [
      ['Total Reviewed', summaryData.totalReviewed],
      ['Approved', `${summaryData.approvedPercentage.toFixed(1)}%`],
      ['Rejected', `${summaryData.rejectedPercentage.toFixed(1)}%`],
      [
        'Average Review Time',
        `${(summaryData.averageReviewTime / 60).toFixed(2)} minutes`,
      ],
    ],
    theme: 'striped',
  });

  const finalY = doc.lastAutoTable?.finalY ?? 100;

  doc.text('Daily Activity', 14, finalY + 15);

  autoTable(doc, {
    startY: finalY + 20,
    head: [['Date', 'Approved', 'Rejected']],
    body: activityData.map((item) => [item.date, item.approved, item.rejected]),
    theme: 'grid',
  });

  const fileName = `moderation_report_${new Date().toISOString().split('T')[0]}.pdf`;
  doc.save(fileName);
}
