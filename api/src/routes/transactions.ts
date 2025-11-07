import { Router, Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { db } from '../config/firebase';
import { Transaction, TransactionInput } from '../types';
import { transactionValidationRules } from '../validators/transactionValidator';
import { parseAmountToCents } from '../utils/amountParser';
import { parseInvoiceDate } from '../utils/dateParser';
import { verifyFirebaseToken, AuthenticatedRequest } from '../middleware/auth';
import { Timestamp } from 'firebase-admin/firestore';

const router = Router();

// POST /api/transactions - Public endpoint to submit transactions
router.post(
  '/',
  transactionValidationRules,
  async (req: Request, res: Response): Promise<void> => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({
          error: 'Validation failed',
          details: errors.array(),
        });
        return;
      }

      const input: TransactionInput = req.body;

      // Parse amounts to cents
      const amountSent = parseAmountToCents(input.amountSent);
      const fee = parseAmountToCents(input.fee);

      // Parse invoice date
      const invoiceDate = parseInvoiceDate(input.invoiceDate);

      // Build transaction document
      const transaction: Omit<Transaction, 'createdAt'> = {
        invoiceDate,
        invoiceNumber: input.invoiceNumber.trim(),
        invoiceStatus: input.invoiceStatus.trim(),
        moneyTransmitterCode: input.moneyTransmitterCode.trim(),
        sender: {
          fullName: input.sender.fullName.trim(),
          address: input.sender.address.trim(),
          phone1: input.sender.phone1.trim(),
          phone2: input.sender.phone2?.trim() || null,
          zipCode: input.sender.zipCode.trim(),
          cityCode: input.sender.cityCode.trim(),
          stateCode: input.sender.stateCode.trim(),
          countryCode: input.sender.countryCode.trim(),
          id1: input.sender.id1 || null,
          id2: input.sender.id2 || null,
        },
        receiver: {
          fullName: input.receiver.fullName.trim(),
          address: input.receiver.address.trim(),
          phone1: input.receiver.phone1.trim(),
          phone2: input.receiver.phone2?.trim() || null,
          zipCode: input.receiver.zipCode.trim(),
          cityCode: input.receiver.cityCode.trim(),
          stateCode: input.receiver.stateCode.trim(),
          countryCode: input.receiver.countryCode.trim(),
          id1: input.receiver.id1 || null,
          id2: input.receiver.id2 || null,
        },
        amountSent,
        fee,
        paymentMode: input.paymentMode.trim(),
        correspondentId: input.correspondentId.trim(),
        bankName: input.bankName?.trim() || '',
        accountNumber: input.accountNumber.trim(),
        raw: input as unknown as Record<string, unknown>,
      };

      // Write to Firestore
      const docRef = await db.collection('transactions').add({
        ...transaction,
        createdAt: Timestamp.now(),
      });

      res.status(201).json({
        success: true,
        id: docRef.id,
        message: 'Transaction created successfully',
      });
    } catch (error) {
      console.error('Error creating transaction:', error);
      res.status(500).json({
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }
);

// GET /api/transactions - Protected endpoint (admin only)
router.get(
  '/',
  verifyFirebaseToken,
  async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 20;
      const status = req.query.status as string | undefined;

      let query = db.collection('transactions').orderBy('createdAt', 'desc');

      if (status) {
        query = query.where('invoiceStatus', '==', status) as FirebaseFirestore.Query;
      }

      // Get total count for pagination (this is expensive but needed for accurate pagination)
      const countSnapshot = await query.get();
      const total = countSnapshot.size;

      // For pagination, we need to skip documents
      // Firestore doesn't support offset, so we'll fetch all and slice
      // For better performance with large datasets, consider using cursor-based pagination
      const snapshot = await query.limit(limit * page).get();
      const allDocs = snapshot.docs;
      const startIndex = (page - 1) * limit;
      const paginatedDocs = allDocs.slice(startIndex, startIndex + limit);

      const transactions = paginatedDocs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      res.json({
        success: true,
        data: transactions,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      });
    } catch (error) {
      console.error('Error fetching transactions:', error);
      res.status(500).json({
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }
);

// GET /api/transactions/:id - Get single transaction (admin only)
router.get(
  '/:id',
  verifyFirebaseToken,
  async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const doc = await db.collection('transactions').doc(id).get();

      if (!doc.exists) {
        res.status(404).json({ error: 'Transaction not found' });
        return;
      }

      res.json({
        success: true,
        data: {
          id: doc.id,
          ...doc.data(),
        },
      });
    } catch (error) {
      console.error('Error fetching transaction:', error);
      res.status(500).json({
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }
);

export default router;

