"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseAmountToCents = parseAmountToCents;
/**
 * Parses amount strings to integer cents
 * Handles formats like: "$20,00", "$200,00", "20.00", "20,00", etc.
 */
function parseAmountToCents(amount) {
    if (typeof amount === 'number') {
        return Math.round(amount * 100);
    }
    // Remove currency symbols, spaces, and other non-digit characters except . and ,
    let cleaned = amount.replace(/[^\d.,]/g, '');
    // Handle comma as decimal separator (e.g., "20,00" -> "20.00")
    if (cleaned.includes(',') && !cleaned.includes('.')) {
        cleaned = cleaned.replace(',', '.');
    }
    else if (cleaned.includes(',') && cleaned.includes('.')) {
        // If both exist, determine which is decimal separator
        const lastComma = cleaned.lastIndexOf(',');
        const lastDot = cleaned.lastIndexOf('.');
        if (lastComma > lastDot) {
            // Comma is decimal separator
            cleaned = cleaned.replace(/\./g, '').replace(',', '.');
        }
        else {
            // Dot is decimal separator
            cleaned = cleaned.replace(/,/g, '');
        }
    }
    const parsed = parseFloat(cleaned);
    if (isNaN(parsed)) {
        throw new Error(`Invalid amount format: ${amount}`);
    }
    return Math.round(parsed * 100);
}
//# sourceMappingURL=amountParser.js.map