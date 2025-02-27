const { body, validationResult } = require('express-validator');

const validateSignup = [
    body('username').notEmpty().withMessage('Username is required'),

    body('fullname').notEmpty().withMessage('Full name is required'),

    body('email').isEmail().withMessage('Invalid email format'),

    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),

    body('confirmPassword').custom((value, { req }) => value === req.body.password).withMessage('Passwords must match'),

    body('address').notEmpty().withMessage('Address is required'),

     body('phoneNumber').isMobilePhone().withMessage('Invalid phone number'),

    (req, res, next) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        

        next();
        
        
    }
    
];

module.exports = validateSignup;
