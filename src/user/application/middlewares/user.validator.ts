import { body } from 'express-validator';
import { validateResult } from '../../../shared/helpers/validate.helper';

export const validateUserInfo = [
  body('email')
    .notEmpty()
    .withMessage('The email is required.')
    .isEmail()
    .withMessage('Not a valid e-mail address.'),
  body('firstName').notEmpty().withMessage('The name is required.'),
  body('lastName').notEmpty().withMessage('The last name is required.'),
  body('mobilePhone')
    .optional()
    .isLength({ min: 10, max: 10 })
    .withMessage('The mobile phone must be exactly 10 digits.')
    .matches(/^[0-9]+$/)
    .withMessage('The mobile phone must contain only numbers.'),
  body('zipCode')
    .optional()
    .trim()
    .isLength({ min: 5, max: 6 })
    .withMessage('The postal code must be exactly 6 digits.')
    .isNumeric({ no_symbols: true })
    .withMessage('The postal code must contain only numbers.'),

  (req, res, next) => {
    validateResult(req, res, next);
  },
];
