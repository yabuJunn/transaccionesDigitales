"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const firebase_1 = require("../config/firebase");
const bankAuth_1 = require("../middleware/bankAuth");
const firestore_1 = require("firebase-admin/firestore");
const serializeTransaction_1 = require("../utils/serializeTransaction");
const router = (0, express_1.Router)();
// Helper function to convert transaction to CSV row
function transactionToCSVRow(transaction) {
    const date = transaction.invoiceDate?.toDate?.() || transaction.invoiceDate || '';
    const formattedDate = date instanceof Date ? date.toISOString().split('T')[0] : date;
    return [
        formattedDate,
        transaction.invoiceNumber || '',
        transaction.sender?.fullName || '',
        transaction.receiver?.fullName || '',
        (transaction.amountSent / 100).toFixed(2),
        (transaction.fee / 100).toFixed(2),
        transaction.paymentMode || '',
        transaction.invoiceStatus || '',
        transaction.receiptUrl || '',
    ].map(field => `"${String(field).replace(/"/g, '""')}"`).join(',');
}
// GET /api/bank/transactions - Protected endpoint (bank/admin only)
router.get('/transactions', bankAuth_1.verifyBankToken, async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const from = req.query.from;
        const to = req.query.to;
        const status = req.query.status;
        const senderName = req.query.senderName;
        const receiverName = req.query.receiverName;
        const minAmount = req.query.minAmount ? parseInt(req.query.minAmount) : undefined;
        const maxAmount = req.query.maxAmount ? parseInt(req.query.maxAmount) : undefined;
        const exportCSV = req.query.export === 'csv';
        let query = firebase_1.db.collection('transactions').orderBy('createdAt', 'desc');
        // Apply filters
        if (from) {
            const fromDate = firestore_1.Timestamp.fromDate(new Date(from));
            query = query.where('createdAt', '>=', fromDate);
        }
        if (to) {
            const toDate = firestore_1.Timestamp.fromDate(new Date(to));
            query = query.where('createdAt', '<=', toDate);
        }
        if (status) {
            query = query.where('invoiceStatus', '==', status);
        }
        // Get all matching documents
        const snapshot = await query.get();
        let transactions = snapshot.docs.map((doc) => (0, serializeTransaction_1.serializeTransaction)({
            id: doc.id,
            ...doc.data(),
        }));
        // Apply client-side filters (for fields that can't be queried directly)
        if (senderName) {
            transactions = transactions.filter((t) => t.sender?.fullName?.toLowerCase().includes(senderName.toLowerCase()));
        }
        if (receiverName) {
            transactions = transactions.filter((t) => t.receiver?.fullName?.toLowerCase().includes(receiverName.toLowerCase()));
        }
        if (minAmount !== undefined) {
            transactions = transactions.filter((t) => t.amountSent >= minAmount * 100);
        }
        if (maxAmount !== undefined) {
            transactions = transactions.filter((t) => t.amountSent <= maxAmount * 100);
        }
        const total = transactions.length;
        // If CSV export requested
        if (exportCSV) {
            const csvHeader = [
                'Date',
                'Invoice Number',
                'Sender Name',
                'Receiver Name',
                'Amount Sent',
                'Fee',
                'Payment Mode',
                'Status',
                'Receipt URL',
            ].map(field => `"${field}"`).join(',');
            const csvRows = transactions.map(transactionToCSVRow);
            const csv = [csvHeader, ...csvRows].join('\n');
            res.setHeader('Content-Type', 'text/csv');
            res.setHeader('Content-Disposition', `attachment; filename="transactions_${new Date().toISOString().split('T')[0]}.csv"`);
            res.send(csv);
            return;
        }
        // Pagination
        const startIndex = (page - 1) * limit;
        const paginatedTransactions = transactions.slice(startIndex, startIndex + limit);
        res.json({
            success: true,
            data: paginatedTransactions,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        });
    }
    catch (error) {
        console.error('Error fetching bank transactions:', error);
        res.status(500).json({
            error: 'Internal server error',
            message: error instanceof Error ? error.message : 'Unknown error',
        });
    }
});
exports.default = router;
//# sourceMappingURL=bank.js.map