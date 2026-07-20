export interface ReportItem {
  label: string;
  value: string;
  hint?: string;
}

export interface ToolReportData {
  toolSlug: string;
  title: string;
  generatedLabel: string;
  snapshot: ReportItem[];
  results: ReportItem[];
  comparison?: {
    caption: string;
    columns: string[];
    rows: { label: string; cells: string[] }[];
    note?: string;
  };
  options: { name: string; why: string }[];
  nextSteps: string[];
  assumptions: string[];
  methodology: string[];
}

export function reportDateLabel(date = new Date()): string {
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
