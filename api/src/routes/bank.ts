import { Router, Request, Response } from 'express';
import { db } from '../config/firebase';
import { verifyBankToken } from '../middleware/bankAuth';
import { Timestamp } from 'firebase-admin/firestore';
import { AuthenticatedRequest } from '../middleware/auth';

const router = Router();

// Helper function to convert transaction to CSV row
function transactionToCSVRow(transaction: any): string {
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
router.get(
  '/transactions',
  verifyBankToken,
  async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 20;
      const from = req.query.from as string | undefined;
      const to = req.query.to as string | undefined;
      const status = req.query.status as string | undefined;
      const senderName = req.query.senderName as string | undefined;
      const receiverName = req.query.receiverName as string | undefined;
      const minAmount = req.query.minAmount ? parseInt(req.query.minAmount as string) : undefined;
      const maxAmount = req.query.maxAmount ? parseInt(req.query.maxAmount as string) : undefined;
      const exportCSV = req.query.export === 'csv';

      let query = db.collection('transactions').orderBy('createdAt', 'desc');

      // Apply filters
      if (from) {
        const fromDate = Timestamp.fromDate(new Date(from));
        query = query.where('createdAt', '>=', fromDate) as FirebaseFirestore.Query;
      }

      if (to) {
        const toDate = Timestamp.fromDate(new Date(to));
        query = query.where('createdAt', '<=', toDate) as FirebaseFirestore.Query;
      }

      if (status) {
        query = query.where('invoiceStatus', '==', status) as FirebaseFirestore.Query;
      }

      // Get all matching documents
      const snapshot = await query.get();
      let transactions = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      // Apply client-side filters (for fields that can't be queried directly)
      if (senderName) {
        transactions = transactions.filter((t: any) =>
          t.sender?.fullName?.toLowerCase().includes(senderName.toLowerCase())
        );
      }

      if (receiverName) {
        transactions = transactions.filter((t: any) =>
          t.receiver?.fullName?.toLowerCase().includes(receiverName.toLowerCase())
        );
      }

      if (minAmount !== undefined) {
        transactions = transactions.filter((t: any) => t.amountSent >= minAmount * 100);
      }

      if (maxAmount !== undefined) {
        transactions = transactions.filter((t: any) => t.amountSent <= maxAmount * 100);
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
    } catch (error) {
      console.error('Error fetching bank transactions:', error);
      res.status(500).json({
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }
);

export default router;

