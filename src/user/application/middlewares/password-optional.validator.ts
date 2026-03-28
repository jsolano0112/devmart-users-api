import { body } from 'express-validator';
import { validateResult } from '../../../shared/helpers/validate.helper';

export const validateOptionalPassword = [
  body('password')
    .optional({ checkFalsy: true })
    .isLength({ min: 8 })
    .withMessage('The password must be at least 8 characters long.')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/)
    .withMessage(
      'The password must contain at least one uppercase letter, one lowercase letter, and one number.',
    ),
  (req, res, next) => {
    validateResult(req, res, next);
  },
];
