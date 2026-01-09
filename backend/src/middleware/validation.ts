import { body, param, query } from 'express-validator';

export const registerValidation = [
  body('email').isEmail().withMessage('Valid email is required'),
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
    .withMessage('Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character (@$!%*?&)'),
  body('name').trim().notEmpty().withMessage('Name is required'),
];

export const loginValidation = [
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required'),
];

export const createTaskValidation = [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('description').optional().trim(),
  body('status')
    .optional()
    .isIn(['PENDING', 'IN_PROGRESS', 'COMPLETED'])
    .withMessage('Invalid status'),
];

export const updateTaskValidation = [
  body('title').optional().trim().notEmpty().withMessage('Title cannot be empty'),
  body('description').optional().trim(),
  body('status')
    .optional()
    .isIn(['PENDING', 'IN_PROGRESS', 'COMPLETED'])
    .withMessage('Invalid status'),
];

export const taskIdValidation = [
  param('id').isUUID().withMessage('Invalid task ID'),
];

export const taskQueryValidation = [
  query('page').optional().isInt({ min: 1 }).withMessage('Invalid page number'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Invalid limit'),
  query('status')
    .optional()
    .isIn(['PENDING', 'IN_PROGRESS', 'COMPLETED'])
    .withMessage('Invalid status'),
  query('search').optional().trim(),
];