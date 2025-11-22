import { useState } from 'react';
import { TransactionInput, Person } from '../types';
import { submitTransaction } from '../services/api';
import { useTranslation } from 'react-i18next';
// Firebase Storage imports are commented out - upload is temporarily disabled
// import { getFirebaseStorage } from '../config/firebase';
// import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

interface TransactionFormProps {
  onSuccess: (message: string) => void;
  onError: (message: string) => void;
}

const TransactionForm = ({ onSuccess, onError }: TransactionFormProps) => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [uploadingReceipt, setUploadingReceipt] = useState(false);
  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const [receiptPreview, setReceiptPreview] = useState<string | null>(null);
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
      roleType: 'Individual',
      idType: 'State ID',
      idNumber: '',
      businessName: '',
      ein: '',
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
      roleType: 'Individual',
      idType: 'State ID',
      idNumber: '',
      businessName: '',
      ein: '',
    },
    amountSent: '',
    fee: '',
    paymentMode: '',
    correspondentId: '',
    bankName: '',
    accountNumber: '',
    receiptUrl: '',
  });

  const handleReceiptChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];
    if (!validTypes.includes(file.type)) {
      onError(t('validation.invalidFileType'));
      return;
    }

    // Validate file size (10MB)
    if (file.size > 10 * 1024 * 1024) {
      onError(t('validation.fileTooLarge'));
      return;
    }

    setReceiptFile(file);

    // Create preview for images
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setReceiptPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setReceiptPreview(null);
    }
  };

  const handleRemoveReceipt = () => {
    setReceiptFile(null);
    setReceiptPreview(null);
    setFormData(prev => ({ ...prev, receiptUrl: '' }));
  };

  const uploadReceiptToStorage = async (): Promise<string | null> => {
    // Firebase Storage upload is temporarily disabled
    // The UI is kept for future implementation
    // For now, we'll just return null and allow the form to submit without receiptUrl
    if (!receiptFile) return null;

    // TODO: Enable Firebase Storage upload when the plan is upgraded
    // For now, we'll just store the file name locally for reference
    console.log('Receipt file selected:', receiptFile.name, 'Size:', receiptFile.size);
    
    // Return null to indicate no URL was uploaded
    // The form will still submit successfully without receiptUrl
    return null;
  };

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
      // Upload receipt if file is selected (currently disabled)
      let receiptUrl = formData.receiptUrl;
      if (receiptFile && !receiptUrl) {
        // Try to upload (will return null for now)
        const uploadedUrl = await uploadReceiptToStorage();
        if (uploadedUrl) {
          receiptUrl = uploadedUrl;
        }
        // Continue with form submission even if upload is disabled
        // The receiptUrl will be undefined/null and the form will still submit
      }

      // Validate phone format (basic validation)
      const phoneRegex = /^[\d\s\-\(\)]+$/;
      if (!phoneRegex.test(formData.sender.phone1) || !phoneRegex.test(formData.receiver.phone1)) {
        onError(t('validation.invalidPhone'));
        setLoading(false);
        return;
      }

      const cleanedData: TransactionInput = {
        ...formData,
        receiptUrl: receiptUrl || undefined,
      };
      
      await submitTransaction(cleanedData);
      onSuccess(t('form.transactionSent'));
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
          roleType: 'Individual',
          idType: 'State ID',
          idNumber: '',
          businessName: '',
          ein: '',
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
          roleType: 'Individual',
          idType: 'State ID',
          idNumber: '',
          businessName: '',
          ein: '',
        },
        amountSent: '',
        fee: '',
        paymentMode: '',
        correspondentId: '',
        bankName: '',
        accountNumber: '',
        receiptUrl: '',
      });
      setReceiptFile(null);
      setReceiptPreview(null);
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.error ||
        err.response?.data?.details?.[0]?.msg ||
        t('form.errorSending');
      onError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const renderPersonFields = (prefix: 'sender' | 'receiver', person: Person) => (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold text-primary capitalize">
        {prefix === 'sender' ? t('form.sender') : t('form.receiver')}
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-primary mb-1">
            {t('form.fullName')} *
          </label>
          <input
            type="text"
            name={`${prefix}.fullName`}
            value={person.fullName}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-neutral-border bg-neutral-bg rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-primary mb-1">
            {t('form.address')} *
          </label>
          <input
            type="text"
            name={`${prefix}.address`}
            value={person.address}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-neutral-border bg-neutral-bg rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-primary mb-1">
            {t('form.phone1')} *
          </label>
          <input
            type="tel"
            name={`${prefix}.phone1`}
            value={person.phone1}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-neutral-border bg-neutral-bg rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-primary mb-1">
            {t('form.phone2')}
          </label>
          <input
            type="tel"
            name={`${prefix}.phone2`}
            value={person.phone2 || ''}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-neutral-border bg-neutral-bg rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-primary mb-1">
            {t('form.zipCode')} *
          </label>
          <input
            type="text"
            name={`${prefix}.zipCode`}
            value={person.zipCode}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-neutral-border bg-neutral-bg rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-primary mb-1">
            {t('form.cityCode')} *
          </label>
          <input
            type="text"
            name={`${prefix}.cityCode`}
            value={person.cityCode}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-neutral-border bg-neutral-bg rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-primary mb-1">
            {t('form.stateCode')} *
          </label>
          <input
            type="text"
            name={`${prefix}.stateCode`}
            value={person.stateCode}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-neutral-border bg-neutral-bg rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-primary mb-1">
            {t('form.countryCode')} *
          </label>
          <input
            type="text"
            name={`${prefix}.countryCode`}
            value={person.countryCode}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-neutral-border bg-neutral-bg rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
          />
        </div>
      </div>

      {/* Role Type and ID Fields */}
      <div className="mt-6 space-y-4">
        <h4 className="text-lg font-semibold text-primary">{t('form.idDocuments')}</h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-secondary-300 dark:bg-secondary-600 bg-opacity-20 dark:bg-opacity-30 rounded-md">
          <div>
            <label className="block text-sm font-medium text-primary mb-1">
              {t('form.roleType')} *
            </label>
            <select
              name={`${prefix}.roleType`}
              value={person.roleType || 'Individual'}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-neutral-border bg-neutral-bg rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
            >
              <option value="Individual">{t('form.roleTypeIndividual')}</option>
              <option value="Business">{t('form.roleTypeBusiness')}</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-primary mb-1">
              {t('form.idType')} *
            </label>
            <select
              name={`${prefix}.idType`}
              value={person.idType || 'State ID'}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-neutral-border bg-neutral-bg rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
            >
              <option value="State ID">{t('form.idTypeStateId')}</option>
              <option value="Passport">{t('form.idTypePassport')}</option>
              <option value="Driver's License">{t('form.idTypeDriversLicense')}</option>
              <option value="EIN">{t('form.idTypeEin')}</option>
              <option value="Foreign ID">{t('form.idTypeForeignId')}</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-primary mb-1">
              {t('form.idNumber')} *
            </label>
            <input
              type="text"
              name={`${prefix}.idNumber`}
              value={person.idNumber || ''}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-neutral-border bg-neutral-bg rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
            />
          </div>
          {person.roleType === 'Business' && (
            <>
              <div>
                <label className="block text-sm font-medium text-primary mb-1">
                  {t('form.businessName')} *
                </label>
                <input
                  type="text"
                  name={`${prefix}.businessName`}
                  value={person.businessName || ''}
                  onChange={handleChange}
                  required={person.roleType === 'Business'}
                  className="w-full px-3 py-2 border border-neutral-border bg-neutral-bg rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-primary mb-1">
                  {t('form.ein')} *
                </label>
                <input
                  type="text"
                  name={`${prefix}.ein`}
                  value={person.ein || ''}
                  onChange={handleChange}
                  required={person.roleType === 'Business'}
                  className="w-full px-3 py-2 border border-neutral-border bg-neutral-bg rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <form onSubmit={handleSubmit} className="card-white p-6 space-y-6">
      {/* Transaction Details */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-primary">{t('form.transactionDetails')}</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-primary mb-1">
              {t('form.invoiceDate')} *
            </label>
            <input
              type="text"
              name="invoiceDate"
              value={formData.invoiceDate}
              onChange={handleChange}
              placeholder="1/07/2025"
              required
              className="w-full px-3 py-2 border border-neutral-border bg-neutral-bg rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-primary mb-1">
              {t('form.invoiceNumber')} *
            </label>
            <input
              type="text"
              name="invoiceNumber"
              value={formData.invoiceNumber}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-neutral-border bg-neutral-bg rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-primary mb-1">
              {t('form.invoiceStatus')} *
            </label>
            <select
              name="invoiceStatus"
              value={formData.invoiceStatus}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-neutral-border bg-neutral-bg rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
            >
              <option value="PENDING">PENDING</option>
              <option value="PAID">PAID</option>
              <option value="CANCELLED">CANCELLED</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-primary mb-1">
              {t('form.moneyTransmitterCode')} *
            </label>
            <input
              type="text"
              name="moneyTransmitterCode"
              value={formData.moneyTransmitterCode}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-neutral-border bg-neutral-bg rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-primary mb-1">
              {t('form.amountSent')} *
            </label>
            <input
              type="text"
              name="amountSent"
              value={formData.amountSent}
              onChange={handleChange}
              placeholder="$20,00"
              required
              className="w-full px-3 py-2 border border-neutral-border bg-neutral-bg rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-primary mb-1">
              {t('form.fee')} *
            </label>
            <input
              type="text"
              name="fee"
              value={formData.fee}
              onChange={handleChange}
              placeholder="$15,00"
              required
              className="w-full px-3 py-2 border border-neutral-border bg-neutral-bg rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-primary mb-1">
              {t('form.paymentMode')} *
            </label>
            <input
              type="text"
              name="paymentMode"
              value={formData.paymentMode}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-neutral-border bg-neutral-bg rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-primary mb-1">
              {t('form.correspondentId')} *
            </label>
            <input
              type="text"
              name="correspondentId"
              value={formData.correspondentId}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-neutral-border bg-neutral-bg rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-primary mb-1">
              {t('form.bankName')}
            </label>
            <input
              type="text"
              name="bankName"
              value={formData.bankName}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-neutral-border bg-neutral-bg rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-primary mb-1">
              {t('form.accountNumber')} *
            </label>
            <input
              type="text"
              name="accountNumber"
              value={formData.accountNumber}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-neutral-border bg-neutral-bg rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
            />
          </div>
        </div>
      </div>

      {/* Receipt Upload */}
      <div className="border-t pt-6">
        <div className="p-4 bg-neutral-surface rounded-md">
          <label className="block text-sm font-medium text-primary mb-2">
            {t('form.uploadReceipt')}
          </label>
          <div className="mb-2 p-2 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded text-sm text-yellow-800 dark:text-yellow-200">
            ⚠️ Receipt upload is temporarily disabled. The file selection UI is available for future use.
          </div>
          <input
            type="file"
            accept="image/*,.pdf"
            onChange={handleReceiptChange}
            className="w-full px-3 py-2 border border-neutral-border bg-neutral-bg rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
          />
          {receiptPreview && (
            <div className="mt-4">
              <p className="text-sm font-medium text-primary mb-2">{t('form.receiptPreview')}</p>
              <div className="relative inline-block">
                <img src={receiptPreview} alt="Receipt preview" className="max-w-xs max-h-48 rounded-md" />
                <button
                  type="button"
                  onClick={handleRemoveReceipt}
                  className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded text-sm hover:bg-red-600"
                >
                  {t('form.removeReceipt')}
                </button>
              </div>
            </div>
          )}
          {receiptFile && !receiptPreview && (
            <div className="mt-4 flex items-center justify-between p-2 bg-neutral-surface-alt rounded">
              <span className="text-sm text-neutral-text">{receiptFile.name} ({(receiptFile.size / 1024).toFixed(2)} KB)</span>
              <button
                type="button"
                onClick={handleRemoveReceipt}
                className="text-red-500 hover:text-red-700 text-sm"
              >
                {t('form.removeReceipt')}
              </button>
            </div>
          )}
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
          className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? t('form.sending') : t('form.submitTransaction')}
        </button>
      </div>
    </form>
  );
};

export default TransactionForm;

