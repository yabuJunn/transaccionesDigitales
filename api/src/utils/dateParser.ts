import { Timestamp } from 'firebase-admin/firestore';

/**
 * Parses date strings to Firestore Timestamp
 * Supports:
 * - ISO datetime format (YYYY-MM-DDTHH:mm) from datetime-local input
 * - Legacy format d/M/yyyy (e.g., "1/07/2025") for backward compatibility
 */
export function parseInvoiceDate(dateString: string): Timestamp {
  let date: Date;

  // Try ISO format first (from datetime-local input: YYYY-MM-DDTHH:mm)
  if (dateString.includes('T')) {
    date = new Date(dateString);
    
    if (isNaN(date.getTime())) {
      throw new Error(`Invalid ISO date format: ${dateString}`);
    }
    
    return Timestamp.fromDate(date);
  }

  // Legacy format: d/M/yyyy or dd/MM/yyyy
  const parts = dateString.split('/');
  
  if (parts.length !== 3) {
    throw new Error(`Invalid date format: ${dateString}. Expected YYYY-MM-DDTHH:mm or d/M/yyyy`);
  }

  const day = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10) - 1; // JavaScript months are 0-indexed
  const year = parseInt(parts[2], 10);

  if (isNaN(day) || isNaN(month) || isNaN(year)) {
    throw new Error(`Invalid date values: ${dateString}`);
  }

  date = new Date(year, month, day);
  
  if (isNaN(date.getTime())) {
    throw new Error(`Invalid date: ${dateString}`);
  }

  return Timestamp.fromDate(date);
}

