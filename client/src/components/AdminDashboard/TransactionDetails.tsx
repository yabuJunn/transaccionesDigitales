import { Transaction } from '../../types';
import { useTranslation } from 'react-i18next';

interface TransactionDetailsProps {
  transaction: Transaction;
  formatDate: (date: string | { seconds: number; nanoseconds: number }) => string;
  formatAmount: (cents: number) => string;
}

const TransactionDetails = ({
  transaction,
  formatDate,
  formatAmount,
}: TransactionDetailsProps) => {
  const { t } = useTranslation();

  const renderPerson = (person: Transaction['sender'], isSender: boolean) => (
    <div className="space-y-2">
      <h4 className="font-semibold text-primary">{isSender ? t('form.sender') : t('form.receiver')}</h4>
      <div className="text-sm space-y-1">
        <div><span className="font-medium">{t('admin.name')}:</span> {person.fullName}</div>
        <div><span className="font-medium">{t('admin.address')}:</span> {person.address}</div>
        <div><span className="font-medium">{t('admin.phone1')}:</span> {person.phone1}</div>
        {person.phone2 && (
          <div><span className="font-medium">{t('admin.phone2')}:</span> {person.phone2}</div>
        )}
        <div><span className="font-medium">{t('form.zipCode')}:</span> {person.zipCode}</div>
        <div><span className="font-medium">{t('admin.city')}:</span> {person.cityCode}</div>
        <div><span className="font-medium">{t('admin.state')}:</span> {person.stateCode}</div>
        <div><span className="font-medium">{t('admin.country')}:</span> {person.countryCode}</div>
        {person.roleType && (
          <div><span className="font-medium">{t('admin.roleType')}:</span> {person.roleType}</div>
        )}
        {person.idType && (
          <div><span className="font-medium">{t('admin.idType')}:</span> {person.idType}</div>
        )}
        {person.idNumber && (
          <div><span className="font-medium">{t('admin.idNumber')}:</span> {person.idNumber}</div>
        )}
        {person.businessName && (
          <div><span className="font-medium">{t('admin.businessName')}:</span> {person.businessName}</div>
        )}
        {person.ein && (
          <div><span className="font-medium">{t('admin.ein')}:</span> {person.ein}</div>
        )}
      </div>
    </div>
  );

  return (
    <div className="card-white p-6 space-y-6">
      <h2 className="text-xl font-bold text-primary">{t('admin.transactionDetails')}</h2>

      {/* Transaction Info */}
      <div className="space-y-3">
        <div className="flex justify-between">
          <span className="text-neutral-muted">{t('admin.invoiceNumber')}:</span>
          <span className="font-semibold text-neutral-text">{transaction.invoiceNumber}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-neutral-muted">{t('admin.status')}:</span>
          <span
            className={`px-2 py-1 text-xs rounded ${
              transaction.invoiceStatus === 'PAID'
                ? 'bg-green-100 text-green-800'
                : transaction.invoiceStatus === 'PENDING'
                ? 'bg-yellow-100 text-yellow-800'
                : 'bg-red-100 text-red-800'
            }`}
          >
            {transaction.invoiceStatus}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-neutral-muted">{t('admin.invoiceDate')}:</span>
          <span className="text-neutral-text">{formatDate(transaction.invoiceDate)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-neutral-muted">{t('admin.transmitterCode')}:</span>
          <span className="text-neutral-text">{transaction.moneyTransmitterCode}</span>
        </div>
      </div>

      <div className="border-t border-neutral-border pt-4">
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-neutral-muted">{t('admin.amountSent')}:</span>
            <span className="text-lg font-semibold text-primary">
              {formatAmount(transaction.amountSent)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-neutral-muted">{t('admin.fee')}:</span>
            <span className="font-semibold text-neutral-text">{formatAmount(transaction.fee)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-neutral-muted">{t('admin.paymentMode')}:</span>
            <span className="text-neutral-text">{transaction.paymentMode}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-neutral-muted">{t('admin.correspondent')}:</span>
            <span className="text-neutral-text">{transaction.correspondentId}</span>
          </div>
          {transaction.bankName && (
            <div className="flex justify-between">
              <span className="text-neutral-muted">{t('admin.bankName')}:</span>
              <span className="text-neutral-text">{transaction.bankName}</span>
            </div>
          )}
          <div className="flex justify-between">
            <span className="text-neutral-muted">{t('admin.accountNumber')}:</span>
            <span className="text-neutral-text">{transaction.accountNumber}</span>
          </div>
          {transaction.receiptUrl && (
            <div className="flex justify-between">
              <span className="text-neutral-muted">{t('admin.receipt')}:</span>
              <a
                href={transaction.receiptUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="link-accent"
              >
                {t('admin.viewReceipt')}
              </a>
            </div>
          )}
        </div>
      </div>

      {/* Sender */}
      <div className="border-t border-neutral-border pt-4">
        {renderPerson(transaction.sender, true)}
      </div>

      {/* Receiver */}
      <div className="border-t border-neutral-border pt-4">
        {renderPerson(transaction.receiver, false)}
      </div>

      {transaction.createdAt && (
        <div className="border-t border-neutral-border pt-4 text-sm text-neutral-muted">
          {t('admin.createdAt')}: {formatDate(transaction.createdAt)}
        </div>
      )}
    </div>
  );
};

export default TransactionDetails;

