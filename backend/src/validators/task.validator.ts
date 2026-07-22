import { body, param, query } from 'express-validator';

const STATUS_VALUES = ['PENDING', 'IN_PROGRESS', 'COMPLETED'];
const PRIORITY_VALUES = ['LOW', 'MEDIUM', 'HIGH'];

function isStartOfTodayOrLater(value: string): boolean {
  const due = new Date(value);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return due.getTime() >= today.getTime();
}

export const createTaskValidator = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Title is required')
    .isLength({ max: 200 })
    .withMessage('Title must be 200 characters or fewer'),
  body('description')
    .optional({ nullable: true })
    .trim()
    .isLength({ max: 2000 })
    .withMessage('Description must be 2000 characters or fewer'),
  body('status')
    .notEmpty()
    .withMessage('Status is required')
    .isIn(STATUS_VALUES)
    .withMessage(`Status must be one of: ${STATUS_VALUES.join(', ')}`),
  body('priority')
    .notEmpty()
    .withMessage('Priority is required')
    .isIn(PRIORITY_VALUES)
    .withMessage(`Priority must be one of: ${PRIORITY_VALUES.join(', ')}`),
  body('dueDate')
    .optional({ nullable: true })
    .isISO8601()
    .withMessage('Due date must be a valid date')
    .custom(isStartOfTodayOrLater)
    .withMessage('Due date cannot be before today'),
];

export const updateTaskValidator = [
  param('id').isUUID().withMessage('Invalid task id'),
  body('title')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Title cannot be empty')
    .isLength({ max: 200 })
    .withMessage('Title must be 200 characters or fewer'),
  body('description')
    .optional({ nullable: true })
    .trim()
    .isLength({ max: 2000 })
    .withMessage('Description must be 2000 characters or fewer'),
  body('status')
    .optional()
    .isIn(STATUS_VALUES)
    .withMessage(`Status must be one of: ${STATUS_VALUES.join(', ')}`),
  body('priority')
    .optional()
    .isIn(PRIORITY_VALUES)
    .withMessage(`Priority must be one of: ${PRIORITY_VALUES.join(', ')}`),
  body('dueDate')
    .optional({ nullable: true })
    .isISO8601()
    .withMessage('Due date must be a valid date')
    .custom(isStartOfTodayOrLater)
    .withMessage('Due date cannot be before today'),
];

export const taskIdValidator = [param('id').isUUID().withMessage('Invalid task id')];

export const listTasksValidator = [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer').toInt(),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100').toInt(),
  query('search').optional().trim().isLength({ max: 200 }),
  query('status')
    .optional()
    .custom((value) => {
      const values = Array.isArray(value) ? value : [value];
      return values.every((v) => STATUS_VALUES.includes(v));
    })
    .withMessage(`Status filter must be one of: ${STATUS_VALUES.join(', ')}`),
  query('priority')
    .optional()
    .custom((value) => {
      const values = Array.isArray(value) ? value : [value];
      return values.every((v) => PRIORITY_VALUES.includes(v));
    })
    .withMessage(`Priority filter must be one of: ${PRIORITY_VALUES.join(', ')}`),
  query('sortBy')
    .optional()
    .isIn(['newest', 'oldest', 'dueDate'])
    .withMessage('sortBy must be one of: newest, oldest, dueDate'),
];
