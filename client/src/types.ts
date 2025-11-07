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
  id1?: IDDocument | null;
  id2?: IDDocument | null;
}

export interface TransactionInput {
  invoiceDate: string;
  invoiceNumber: string;
  invoiceStatus: string;
  moneyTransmitterCode: string;
  sender: Person;
  receiver: Person;
  amountSent: string | number;
  fee: string | number;
  paymentMode: string;
  correspondentId: string;
  bankName: string;
  accountNumber: string;
}

