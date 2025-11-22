import { Transaction } from '../../types';

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
  const renderPerson = (person: Transaction['sender'], title: string) => (
    <div className="space-y-2">
      <h4 className="font-semibold text-gray-900">{title}</h4>
      <div className="text-sm space-y-1">
        <div><span className="font-medium">Nombre:</span> {person.fullName}</div>
        <div><span className="font-medium">Dirección:</span> {person.address}</div>
        <div><span className="font-medium">Teléfono 1:</span> {person.phone1}</div>
        {person.phone2 && (
          <div><span className="font-medium">Teléfono 2:</span> {person.phone2}</div>
        )}
        <div><span className="font-medium">Código Postal:</span> {person.zipCode}</div>
        <div><span className="font-medium">Ciudad:</span> {person.cityCode}</div>
        <div><span className="font-medium">Estado:</span> {person.stateCode}</div>
        <div><span className="font-medium">País:</span> {person.countryCode}</div>
        {person.roleType && (
          <div><span className="font-medium">Tipo de Rol:</span> {person.roleType}</div>
        )}
        {person.idType && (
          <div><span className="font-medium">Tipo de ID:</span> {person.idType}</div>
        )}
        {person.idNumber && (
          <div><span className="font-medium">Número de ID:</span> {person.idNumber}</div>
        )}
        {person.businessName && (
          <div><span className="font-medium">Nombre de Empresa:</span> {person.businessName}</div>
        )}
        {person.ein && (
          <div><span className="font-medium">EIN:</span> {person.ein}</div>
        )}
      </div>
    </div>
  );

  return (
    <div className="bg-white rounded-lg shadow p-6 space-y-6">
      <h2 className="text-xl font-bold text-gray-900">Detalles de la Transacción</h2>

      {/* Transaction Info */}
      <div className="space-y-3">
        <div className="flex justify-between">
          <span className="text-gray-600">Número de Factura:</span>
          <span className="font-semibold">{transaction.invoiceNumber}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Estado:</span>
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
          <span className="text-gray-600">Fecha de Factura:</span>
          <span>{formatDate(transaction.invoiceDate)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Código del Transmisor:</span>
          <span>{transaction.moneyTransmitterCode}</span>
        </div>
      </div>

      <div className="border-t pt-4">
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-gray-600">Monto Enviado:</span>
            <span className="text-lg font-semibold text-gray-900">
              {formatAmount(transaction.amountSent)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Tarifa:</span>
            <span className="font-semibold">{formatAmount(transaction.fee)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Modo de Pago:</span>
            <span>{transaction.paymentMode}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Corresponsal:</span>
            <span>{transaction.correspondentId}</span>
          </div>
          {transaction.bankName && (
            <div className="flex justify-between">
              <span className="text-gray-600">Banco:</span>
              <span>{transaction.bankName}</span>
            </div>
          )}
          <div className="flex justify-between">
            <span className="text-gray-600">Número de Cuenta:</span>
            <span>{transaction.accountNumber}</span>
          </div>
          {transaction.receiptUrl && (
            <div className="flex justify-between">
              <span className="text-gray-600">Comprobante:</span>
              <a
                href={transaction.receiptUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800"
              >
                Ver comprobante
              </a>
            </div>
          )}
        </div>
      </div>

      {/* Sender */}
      <div className="border-t pt-4">
        {renderPerson(transaction.sender, 'Remitente')}
      </div>

      {/* Receiver */}
      <div className="border-t pt-4">
        {renderPerson(transaction.receiver, 'Destinatario')}
      </div>

      {transaction.createdAt && (
        <div className="border-t pt-4 text-sm text-gray-500">
          Creado: {formatDate(transaction.createdAt)}
        </div>
      )}
    </div>
  );
};

export default TransactionDetails;

