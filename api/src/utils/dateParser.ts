import { Timestamp } from 'firebase-admin/firestore';

/**
 * Parses date strings in format d/M/yyyy (e.g., "1/07/2025") to Firestore Timestamp
 */
export function parseInvoiceDate(dateString: string): Timestamp {
  // Handle format: d/M/yyyy or dd/MM/yyyy
  const parts = dateString.split('/');
  
  if (parts.length !== 3) {
    throw new Error(`Invalid date format: ${dateString}. Expected d/M/yyyy`);
  }

  const day = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10) - 1; // JavaScript months are 0-indexed
  const year = parseInt(parts[2], 10);

  if (isNaN(day) || isNaN(month) || isNaN(year)) {
    throw new Error(`Invalid date values: ${dateString}`);
  }

  const date = new Date(year, month, day);
  
  if (isNaN(date.getTime())) {
    throw new Error(`Invalid date: ${dateString}`);
  }

  return Timestamp.fromDate(date);
}

