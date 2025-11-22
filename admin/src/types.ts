export interface IDDocument {
  type: string;
  number: string;
}

export interface Person {
  fullName: string;
  address: string;
  phone1: string;
  phone2?: string | null;
  zipCode: string;
  cityCode: string;
  stateCode: string;
  countryCode: string;
  roleType?: 'Individual' | 'Business';
  idType?: 'State ID' | 'Passport' | "Driver's License" | 'EIN' | 'Foreign ID';
  idNumber?: string;
  businessName?: string;
  ein?: string;
}

export interface Transaction {
  id: string;
  invoiceDate: string | { seconds: number; nanoseconds: number };
  invoiceNumber: string;
  invoiceStatus: string;
  moneyTransmitterCode: string;
  sender: Person;
  receiver: Person;
  amountSent: number; // in cents
  fee: number; // in cents
  paymentMode: string;
  correspondentId: string;
  bankName: string;
  accountNumber: string;
  receiptUrl?: string;
  createdAt?: { seconds: number; nanoseconds: number };
}

export interface TransactionsResponse {
  success: boolean;
  data: Transaction[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

