const { body } = require('express-validator');

const handleValidation = (req, res, next) => {
  const { validationResult } = require('express-validator');
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, message: errors.array()[0].msg, errors: errors.array() });
  }
  next();
};

const registerValidation = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  handleValidation,
];

const loginValidation = [
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required'),
  handleValidation,
];

const incidentValidation = [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('disasterType')
    .isIn(['Fire', 'Flood', 'Earthquake', 'Medical Emergency', 'Electrical Hazard', 'Other'])
    .withMessage('Invalid disaster type'),
  body('description').trim().notEmpty().withMessage('Description is required'),
  body('severity').isIn(['Low', 'Medium', 'High', 'Critical']).withMessage('Invalid severity'),
  body('location').trim().notEmpty().withMessage('Location is required'),
  body('incidentDateTime').isISO8601().withMessage('Valid date and time is required'),
  handleValidation,
];

const commentValidation = [
  body('content').trim().notEmpty().withMessage('Comment content is required'),
  handleValidation,
];

const alertValidation = [
  body('title').trim().notEmpty().withMessage('Alert title is required'),
  body('message').trim().notEmpty().withMessage('Alert message is required'),
  handleValidation,
];

module.exports = {
  registerValidation,
  loginValidation,
  incidentValidation,
  commentValidation,
  alertValidation,
};
