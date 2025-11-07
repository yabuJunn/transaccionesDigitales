import { useState } from 'react';
import { TransactionInput, Person } from '../types';
import { submitTransaction } from '../services/api';

interface TransactionFormProps {
  onSuccess: (message: string) => void;
  onError: (message: string) => void;
}

const TransactionForm = ({ onSuccess, onError }: TransactionFormProps) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<TransactionInput>({
    invoiceDate: '',
    invoiceNumber: '',
    invoiceStatus: 'PENDING',
    moneyTransmitterCode: '',
    sender: {
      fullName: '',
      address: '',
      phone1: '',
      phone2: '',
      zipCode: '',
      cityCode: '',
      stateCode: '',
      countryCode: '',
      id1: null,
      id2: null,
    },
    receiver: {
      fullName: '',
      address: '',
      phone1: '',
      phone2: '',
      zipCode: '',
      cityCode: '',
      stateCode: '',
      countryCode: '',
      id1: null,
      id2: null,
    },
    amountSent: '',
    fee: '',
    paymentMode: '',
    correspondentId: '',
    bankName: '',
    accountNumber: '',
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    
    if (name.startsWith('sender.')) {
      const field = name.replace('sender.', '');
      setFormData((prev) => ({
        ...prev,
        sender: { ...prev.sender, [field]: value },
      }));
    } else if (name.startsWith('receiver.')) {
      const field = name.replace('receiver.', '');
      setFormData((prev) => ({
        ...prev,
        receiver: { ...prev.receiver, [field]: value },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await submitTransaction(formData);
      onSuccess('Transacción enviada exitosamente');
      // Reset form
      setFormData({
        invoiceDate: '',
        invoiceNumber: '',
        invoiceStatus: 'PENDING',
        moneyTransmitterCode: '',
        sender: {
          fullName: '',
          address: '',
          phone1: '',
          phone2: '',
          zipCode: '',
          cityCode: '',
          stateCode: '',
          countryCode: '',
          id1: null,
          id2: null,
        },
        receiver: {
          fullName: '',
          address: '',
          phone1: '',
          phone2: '',
          zipCode: '',
          cityCode: '',
          stateCode: '',
          countryCode: '',
          id1: null,
          id2: null,
        },
        amountSent: '',
        fee: '',
        paymentMode: '',
        correspondentId: '',
        bankName: '',
        accountNumber: '',
      });
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.error ||
        err.response?.data?.details?.[0]?.msg ||
        'Error al enviar la transacción. Por favor, intente nuevamente.';
      onError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const renderPersonFields = (prefix: 'sender' | 'receiver', person: Person) => (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold text-gray-800 capitalize">
        {prefix === 'sender' ? 'Remitente' : 'Destinatario'}
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nombre Completo *
          </label>
          <input
            type="text"
            name={`${prefix}.fullName`}
            value={person.fullName}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Dirección *
          </label>
          <input
            type="text"
            name={`${prefix}.address`}
            value={person.address}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Teléfono 1 *
          </label>
          <input
            type="tel"
            name={`${prefix}.phone1`}
            value={person.phone1}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Teléfono 2
          </label>
          <input
            type="tel"
            name={`${prefix}.phone2`}
            value={person.phone2 || ''}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Código Postal *
          </label>
          <input
            type="text"
            name={`${prefix}.zipCode`}
            value={person.zipCode}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Ciudad *
          </label>
          <input
            type="text"
            name={`${prefix}.cityCode`}
            value={person.cityCode}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Estado/Provincia *
          </label>
          <input
            type="text"
            name={`${prefix}.stateCode`}
            value={person.stateCode}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            País *
          </label>
          <input
            type="text"
            name={`${prefix}.countryCode`}
            value={person.countryCode}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>
    </div>
  );

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6 space-y-6">
      {/* Transaction Details */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-gray-800">Detalles de la Transacción</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Fecha de Factura (d/M/yyyy) *
            </label>
            <input
              type="text"
              name="invoiceDate"
              value={formData.invoiceDate}
              onChange={handleChange}
              placeholder="1/07/2025"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Número de Factura *
            </label>
            <input
              type="text"
              name="invoiceNumber"
              value={formData.invoiceNumber}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Estado de Factura *
            </label>
            <select
              name="invoiceStatus"
              value={formData.invoiceStatus}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="PENDING">PENDING</option>
              <option value="PAID">PAID</option>
              <option value="CANCELLED">CANCELLED</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Código del Transmisor *
            </label>
            <input
              type="text"
              name="moneyTransmitterCode"
              value={formData.moneyTransmitterCode}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Monto Enviado ($) *
            </label>
            <input
              type="text"
              name="amountSent"
              value={formData.amountSent}
              onChange={handleChange}
              placeholder="$20,00"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tarifa ($) *
            </label>
            <input
              type="text"
              name="fee"
              value={formData.fee}
              onChange={handleChange}
              placeholder="$15,00"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Modo de Pago *
            </label>
            <input
              type="text"
              name="paymentMode"
              value={formData.paymentMode}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              ID del Corresponsal *
            </label>
            <input
              type="text"
              name="correspondentId"
              value={formData.correspondentId}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nombre del Banco
            </label>
            <input
              type="text"
              name="bankName"
              value={formData.bankName}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Número de Cuenta *
            </label>
            <input
              type="text"
              name="accountNumber"
              value={formData.accountNumber}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Sender Fields */}
      <div className="border-t pt-6">
        {renderPersonFields('sender', formData.sender)}
      </div>

      {/* Receiver Fields */}
      <div className="border-t pt-6">
        {renderPersonFields('receiver', formData.receiver)}
      </div>

      {/* Submit Button */}
      <div className="flex justify-end pt-4">
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Enviando...' : 'Enviar Transacción'}
        </button>
      </div>
    </form>
  );
};

export default TransactionForm;

