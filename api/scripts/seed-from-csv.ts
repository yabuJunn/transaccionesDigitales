import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';
import { db } from '../src/config/firebase';
import { TransactionInput } from '../src/types';
import { parseAmountToCents } from '../src/utils/amountParser';
import { parseInvoiceDate } from '../src/utils/dateParser';
import { Timestamp } from 'firebase-admin/firestore';

dotenv.config();

interface CSVRow {
  [key: string]: string;
}

async function seedTransactions(): Promise<void> {
  try {
    const jsonPath = path.join(__dirname, '../data/transactions-sample.json');
    const jsonData = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));

    console.log(`📦 Found ${jsonData.length} transactions to seed`);

    let totalCount = 0;
    const BATCH_SIZE = 500;

    for (let i = 0; i < jsonData.length; i += BATCH_SIZE) {
      const batch = db.batch();
      const batchData = jsonData.slice(i, i + BATCH_SIZE);
      let batchCount = 0;

      for (const item of batchData) {
        const input: TransactionInput = item;

        // Parse amounts to cents
        const amountSent = parseAmountToCents(input.amountSent);
        const fee = parseAmountToCents(input.fee);

        // Parse invoice date
        const invoiceDate = parseInvoiceDate(input.invoiceDate);

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
          createdAt: Timestamp.now(),
          raw: input as unknown as Record<string, unknown>,
        };

        const docRef = db.collection('transactions').doc();
        batch.set(docRef, transaction);
        batchCount++;
        totalCount++;
      }

      await batch.commit();
      console.log(`✅ Committed batch: ${batchCount} transactions (total: ${totalCount})`);
    }

    console.log(`✅ Successfully seeded ${totalCount} transactions to Firestore`);
  } catch (error) {
    console.error('❌ Error seeding transactions:', error);
    process.exit(1);
  }
}

// Run seed
seedTransactions()
  .then(() => {
    console.log('🎉 Seeding completed');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  });

