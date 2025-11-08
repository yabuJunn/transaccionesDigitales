import { body, ValidationChain } from 'express-validator';

export const transactionValidationRules: ValidationChain[] = [
  body('invoiceDate')
    .notEmpty()
    .withMessage('Invoice date is required')
    .isString()
    .withMessage('Invoice date must be a string'),
  
  body('invoiceNumber')
    .notEmpty()
    .withMessage('Invoice number is required')
    .isString()
    .withMessage('Invoice number must be a string'),
  
  body('invoiceStatus')
    .notEmpty()
    .withMessage('Invoice status is required')
    .isString()
    .withMessage('Invoice status must be a string'),
  
  body('moneyTransmitterCode')
    .notEmpty()
    .withMessage('Money transmitter code is required')
    .isString()
    .withMessage('Money transmitter code must be a string'),
  
  body('sender.fullName')
    .notEmpty()
    .withMessage('Sender full name is required')
    .isString()
    .trim(),
  
  body('sender.address')
    .notEmpty()
    .withMessage('Sender address is required')
    .isString()
    .trim(),
  
  body('sender.phone1')
    .notEmpty()
    .withMessage('Sender phone1 is required')
    .isString()
    .trim(),
  
  body('sender.zipCode')
    .notEmpty()
    .withMessage('Sender zip code is required')
    .isString()
    .trim(),
  
  body('sender.cityCode')
    .notEmpty()
    .withMessage('Sender city code is required')
    .isString()
    .trim(),
  
  body('sender.stateCode')
    .notEmpty()
    .withMessage('Sender state code is required')
    .isString()
    .trim(),
  
  body('sender.countryCode')
    .notEmpty()
    .withMessage('Sender country code is required')
    .isString()
    .trim(),
  
  body('sender.id1.type')
    .notEmpty()
    .withMessage('Sender ID 1 type is required')
    .isString()
    .trim(),
  
  body('sender.id1.number')
    .notEmpty()
    .withMessage('Sender ID 1 number is required')
    .isString()
    .trim(),
  
  body('sender.id2.type')
    .optional()
    .isString()
    .trim(),
  
  body('sender.id2.number')
    .optional()
    .isString()
    .trim(),
  
  body('receiver.fullName')
    .notEmpty()
    .withMessage('Receiver full name is required')
    .isString()
    .trim(),
  
  body('receiver.address')
    .notEmpty()
    .withMessage('Receiver address is required')
    .isString()
    .trim(),
  
  body('receiver.phone1')
    .notEmpty()
    .withMessage('Receiver phone1 is required')
    .isString()
    .trim(),
  
  body('receiver.zipCode')
    .notEmpty()
    .withMessage('Receiver zip code is required')
    .isString()
    .trim(),
  
  body('receiver.cityCode')
    .notEmpty()
    .withMessage('Receiver city code is required')
    .isString()
    .trim(),
  
  body('receiver.stateCode')
    .notEmpty()
    .withMessage('Receiver state code is required')
    .isString()
    .trim(),
  
  body('receiver.countryCode')
    .notEmpty()
    .withMessage('Receiver country code is required')
    .isString()
    .trim(),
  
  body('amountSent')
    .notEmpty()
    .withMessage('Amount sent is required')
    .custom((value) => {
      if (typeof value !== 'string' && typeof value !== 'number') {
        throw new Error('Amount sent must be a string or number');
      }
      return true;
    }),
  
  body('fee')
    .notEmpty()
    .withMessage('Fee is required')
    .custom((value) => {
      if (typeof value !== 'string' && typeof value !== 'number') {
        throw new Error('Fee must be a string or number');
      }
      return true;
    }),
  
  body('paymentMode')
    .notEmpty()
    .withMessage('Payment mode is required')
    .isString()
    .trim(),
  
  body('correspondentId')
    .notEmpty()
    .withMessage('Correspondent ID is required')
    .isString()
    .trim(),
  
  body('bankName')
    .optional()
    .isString()
    .trim(),
  
  body('accountNumber')
    .notEmpty()
    .withMessage('Account number is required')
    .isString()
    .trim(),
];

