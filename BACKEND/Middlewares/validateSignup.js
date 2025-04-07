const { body, validationResult } = require('express-validator');

const validateSignup = [
  body('username')
    .notEmpty()
    .withMessage('Username is required'),

  body('first_name')
    .notEmpty()
    .withMessage('First name is required'),

  body('last_name')
    .notEmpty()
    .withMessage('Last name is required'),

  body('email')
    .isEmail()
    .withMessage('Invalid email format'),

  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),

  body('confirmPassword')
    .custom((value, { req }) => value === req.body.password)
    .withMessage('Passwords must match'),

  body('phoneNumber')
    .isMobilePhone()
    .withMessage('Invalid phone number'),

  body('street')
    .notEmpty()
    .withMessage('Street is required'),

  body('city')
    .notEmpty()
    .withMessage('City is required'),

  body('state_zip')
    .notEmpty()
    .withMessage('State & ZIP are required'),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];

module.exports = validateSignup;
