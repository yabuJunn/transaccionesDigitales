import { Timestamp } from 'firebase-admin/firestore';
/**
 * Parses date strings to Firestore Timestamp
 * Supports:
 * - ISO datetime format (YYYY-MM-DDTHH:mm) from datetime-local input
 * - Legacy format d/M/yyyy (e.g., "1/07/2025") for backward compatibility
 */
export declare function parseInvoiceDate(dateString: string): Timestamp;
//# sourceMappingURL=dateParser.d.ts.map