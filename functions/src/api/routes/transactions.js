"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const firebase_1 = require("../config/firebase");
const transactionValidator_1 = require("../validators/transactionValidator");
const amountParser_1 = require("../utils/amountParser");
const dateParser_1 = require("../utils/dateParser");
const auth_1 = require("../middleware/auth");
const firestore_1 = require("firebase-admin/firestore");
const serializeTransaction_1 = require("../utils/serializeTransaction");
const router = (0, express_1.Router)();
// POST /api/transactions - Public endpoint to submit transactions
router.post('/', transactionValidator_1.transactionValidationRules, async (req, res) => {
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            res.status(400).json({
                error: 'Validation failed',
                details: errors.array(),
            });
            return;
        }
        const input = req.body;
        // Parse amounts to cents
        const amountSent = (0, amountParser_1.parseAmountToCents)(input.amountSent);
        const fee = (0, amountParser_1.parseAmountToCents)(input.fee);
        // Parse invoice date
        const invoiceDate = (0, dateParser_1.parseInvoiceDate)(input.invoiceDate);
        // Build transaction document
        const transaction = {
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
                roleType: input.sender.roleType,
                idType: input.sender.idType,
                idNumber: input.sender.idNumber?.trim() || '',
                ...(input.sender.businessName?.trim() ? { businessName: input.sender.businessName.trim() } : {}),
                ...(input.sender.ein?.trim() ? { ein: input.sender.ein.trim() } : {}),
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
                roleType: input.receiver.roleType,
                idType: input.receiver.idType,
                idNumber: input.receiver.idNumber?.trim() || '',
                ...(input.receiver.businessName?.trim() ? { businessName: input.receiver.businessName.trim() } : {}),
                ...(input.receiver.ein?.trim() ? { ein: input.receiver.ein.trim() } : {}),
            },
            amountSent,
            fee,
            paymentMode: input.paymentMode.trim(),
            correspondentId: input.correspondentId.trim(),
            bankName: input.bankName?.trim() || '',
            accountNumber: input.accountNumber.trim(),
            ...(input.receiptUrl?.trim() ? { receiptUrl: input.receiptUrl.trim() } : {}),
            raw: input,
        };
        // Write to Firestore
        const docRef = await firebase_1.db.collection('transactions').add({
            ...transaction,
            createdAt: firestore_1.Timestamp.now(),
        });
        res.status(201).json({
            success: true,
            id: docRef.id,
            message: 'Transaction created successfully',
        });
    }
    catch (error) {
        console.error('Error creating transaction:', error);
        res.status(500).json({
            error: 'Internal server error',
            message: error instanceof Error ? error.message : 'Unknown error',
        });
    }
});
// GET /api/transactions - Protected endpoint (admin only)
router.get('/', auth_1.verifyFirebaseToken, async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const status = req.query.status;
        let query = firebase_1.db.collection('transactions').orderBy('createdAt', 'desc');
        if (status) {
            query = query.where('invoiceStatus', '==', status);
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
        const transactions = paginatedDocs.map((doc) => (0, serializeTransaction_1.serializeTransaction)({
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
    }
    catch (error) {
        console.error('Error fetching transactions:', error);
        res.status(500).json({
            error: 'Internal server error',
            message: error instanceof Error ? error.message : 'Unknown error',
        });
    }
});
// GET /api/transactions/:id - Get single transaction (admin only)
router.get('/:id', auth_1.verifyFirebaseToken, async (req, res) => {
    try {
        const { id } = req.params;
        const doc = await firebase_1.db.collection('transactions').doc(id).get();
        if (!doc.exists) {
            res.status(404).json({ error: 'Transaction not found' });
            return;
        }
        res.json({
            success: true,
            data: (0, serializeTransaction_1.serializeTransaction)({
                id: doc.id,
                ...doc.data(),
            }),
        });
    }
    catch (error) {
        console.error('Error fetching transaction:', error);
        res.status(500).json({
            error: 'Internal server error',
            message: error instanceof Error ? error.message : 'Unknown error',
        });
    }
});
exports.default = router;
//# sourceMappingURL=transactions.js.map