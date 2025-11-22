import { Timestamp } from 'firebase-admin/firestore';

/**
 * Converts Firestore Timestamp to a serializable format for JSON responses
 */
function serializeTimestamp(timestamp: Timestamp | { seconds: number; nanoseconds?: number } | any): { seconds: number; nanoseconds: number } {
  if (timestamp && typeof timestamp === 'object') {
    if (timestamp.seconds !== undefined) {
      return {
        seconds: typeof timestamp.seconds === 'number' ? timestamp.seconds : timestamp.seconds.toNumber(),
        nanoseconds: timestamp.nanoseconds || 0,
      };
    }
    // If it's a Firestore Timestamp object
    if (timestamp.toDate) {
      const date = timestamp.toDate();
      return {
        seconds: Math.floor(date.getTime() / 1000),
        nanoseconds: (date.getTime() % 1000) * 1000000,
      };
    }
  }
  // Fallback: return as is if already in correct format
  return timestamp;
}

/**
 * Serializes a transaction document to ensure all Timestamps are properly formatted
 */
export function serializeTransaction(transaction: any): any {
  const serialized = { ...transaction };
  
  // Serialize invoiceDate
  if (serialized.invoiceDate) {
    serialized.invoiceDate = serializeTimestamp(serialized.invoiceDate);
  }
  
  // Serialize createdAt
  if (serialized.createdAt) {
    serialized.createdAt = serializeTimestamp(serialized.createdAt);
  }
  
  return serialized;
}

