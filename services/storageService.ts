import { AnalysisResult } from '../types';

/**
 * Saves the analysis report to LocalStorage.
 * @returns The unique ID of the saved report.
 */
export const saveReport = async (data: AnalysisResult): Promise<string> => {
  const reportId = crypto.randomUUID();
  
  try {
    localStorage.setItem(`skillbridge_report_${reportId}`, JSON.stringify(data));
    return reportId;
  } catch (e) {
    throw new Error("Could not save report. Local storage might be full.");
  }
};

/**
 * Retrieves a report by ID from LocalStorage.
 */
export const getReport = async (id: string): Promise<AnalysisResult | null> => {
  const localData = localStorage.getItem(`skillbridge_report_${id}`);
  if (localData) {
    return JSON.parse(localData);
  }
  
  return null;
};