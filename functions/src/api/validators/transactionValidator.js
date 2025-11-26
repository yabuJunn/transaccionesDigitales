"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.transactionValidationRules = void 0;
const express_validator_1 = require("express-validator");
exports.transactionValidationRules = [
    (0, express_validator_1.body)('invoiceDate')
        .notEmpty()
        .withMessage('Invoice date is required')
        .isString()
        .withMessage('Invoice date must be a string'),
    (0, express_validator_1.body)('invoiceNumber')
        .notEmpty()
        .withMessage('Invoice number is required')
        .isString()
        .withMessage('Invoice number must be a string'),
    (0, express_validator_1.body)('invoiceStatus')
        .notEmpty()
        .withMessage('Invoice status is required')
        .isString()
        .withMessage('Invoice status must be a string'),
    (0, express_validator_1.body)('moneyTransmitterCode')
        .notEmpty()
        .withMessage('Money transmitter code is required')
        .isString()
        .withMessage('Money transmitter code must be a string'),
    (0, express_validator_1.body)('sender.fullName')
        .notEmpty()
        .withMessage('Sender full name is required')
        .isString()
        .trim(),
    (0, express_validator_1.body)('sender.address')
        .notEmpty()
        .withMessage('Sender address is required')
        .isString()
        .trim(),
    (0, express_validator_1.body)('sender.phone1')
        .notEmpty()
        .withMessage('Sender phone1 is required')
        .isString()
        .trim(),
    (0, express_validator_1.body)('sender.zipCode')
        .notEmpty()
        .withMessage('Sender zip code is required')
        .isString()
        .trim(),
    (0, express_validator_1.body)('sender.cityCode')
        .notEmpty()
        .withMessage('Sender city code is required')
        .isString()
        .trim(),
    (0, express_validator_1.body)('sender.stateCode')
        .notEmpty()
        .withMessage('Sender state code is required')
        .isString()
        .trim(),
    (0, express_validator_1.body)('sender.countryCode')
        .notEmpty()
        .withMessage('Sender country code is required')
        .isString()
        .trim(),
    (0, express_validator_1.body)('sender.roleType')
        .notEmpty()
        .withMessage('Sender role type is required')
        .isIn(['Individual', 'Business'])
        .withMessage('Sender role type must be Individual or Business'),
    (0, express_validator_1.body)('sender.idType')
        .notEmpty()
        .withMessage('Sender ID type is required')
        .isIn(['State ID', 'Passport', "Driver's License", 'EIN', 'Foreign ID'])
        .withMessage('Sender ID type must be one of: State ID, Passport, Driver\'s License, EIN, Foreign ID'),
    (0, express_validator_1.body)('sender.idNumber')
        .notEmpty()
        .withMessage('Sender ID number is required')
        .isString()
        .trim(),
    (0, express_validator_1.body)('sender.businessName')
        .optional()
        .isString()
        .trim(),
    (0, express_validator_1.body)('sender.ein')
        .optional()
        .isString()
        .trim(),
    (0, express_validator_1.body)('receiver.fullName')
        .notEmpty()
        .withMessage('Receiver full name is required')
        .isString()
        .trim(),
    (0, express_validator_1.body)('receiver.address')
        .notEmpty()
        .withMessage('Receiver address is required')
        .isString()
        .trim(),
    (0, express_validator_1.body)('receiver.phone1')
        .notEmpty()
        .withMessage('Receiver phone1 is required')
        .isString()
        .trim(),
    (0, express_validator_1.body)('receiver.zipCode')
        .notEmpty()
        .withMessage('Receiver zip code is required')
        .isString()
        .trim(),
    (0, express_validator_1.body)('receiver.cityCode')
        .notEmpty()
        .withMessage('Receiver city code is required')
        .isString()
        .trim(),
    (0, express_validator_1.body)('receiver.stateCode')
        .notEmpty()
        .withMessage('Receiver state code is required')
        .isString()
        .trim(),
    (0, express_validator_1.body)('receiver.countryCode')
        .notEmpty()
        .withMessage('Receiver country code is required')
        .isString()
        .trim(),
    (0, express_validator_1.body)('receiver.roleType')
        .notEmpty()
        .withMessage('Receiver role type is required')
        .isIn(['Individual', 'Business'])
        .withMessage('Receiver role type must be Individual or Business'),
    (0, express_validator_1.body)('receiver.idType')
        .notEmpty()
        .withMessage('Receiver ID type is required')
        .isIn(['State ID', 'Passport', "Driver's License", 'EIN', 'Foreign ID'])
        .withMessage('Receiver ID type must be one of: State ID, Passport, Driver\'s License, EIN, Foreign ID'),
    (0, express_validator_1.body)('receiver.idNumber')
        .notEmpty()
        .withMessage('Receiver ID number is required')
        .isString()
        .trim(),
    (0, express_validator_1.body)('receiver.businessName')
        .optional()
        .isString()
        .trim(),
    (0, express_validator_1.body)('receiver.ein')
        .optional()
        .isString()
        .trim(),
    (0, express_validator_1.body)('amountSent')
        .notEmpty()
        .withMessage('Amount sent is required')
        .custom((value) => {
        if (typeof value !== 'string' && typeof value !== 'number') {
            throw new Error('Amount sent must be a string or number');
        }
        return true;
    }),
    (0, express_validator_1.body)('fee')
        .notEmpty()
        .withMessage('Fee is required')
        .custom((value) => {
        if (typeof value !== 'string' && typeof value !== 'number') {
            throw new Error('Fee must be a string or number');
        }
        return true;
    }),
    (0, express_validator_1.body)('paymentMode')
        .notEmpty()
        .withMessage('Payment mode is required')
        .isString()
        .trim(),
    (0, express_validator_1.body)('correspondentId')
        .notEmpty()
        .withMessage('Correspondent ID is required')
        .isString()
        .trim(),
    (0, express_validator_1.body)('bankName')
        .optional()
        .isString()
        .trim(),
    (0, express_validator_1.body)('accountNumber')
        .notEmpty()
        .withMessage('Account number is required')
        .isString()
        .trim(),
    (0, express_validator_1.body)('receiptUrl')
        .optional()
        .isURL()
        .withMessage('Receipt URL must be a valid URL'),
];
//# sourceMappingURL=transactionValidator.js.map