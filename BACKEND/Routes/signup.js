
const express = require("express");
const router = express.Router();

const validateSignup = require("../Middlewares/validateSignup");
const hashPassword = require("../Middlewares/hashPassword");
const db = require("../db");

const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
require("dotenv").config();

// Environment variables
const JWT_SECRET = process.env.JWT_SECRET;
const BASE_URL = (
  process.env.BASE_URL || "https://ecoconscious.onrender.com"
).replace(/\/$/, "");

// Email transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASSWORD,
  },
});

// Generate token and send verification email
const sendVerificationEmail = async (user) => {
  if (!JWT_SECRET) {
    throw new Error("JWT_SECRET is not configured");
  }

  if (!process.env.EMAIL || !process.env.EMAIL_PASSWORD) {
    throw new Error("Email credentials are not configured");
  }

  const verificationToken = jwt.sign(
    {
      email: user.email,
      purpose: "email_verification",
    },
    JWT_SECRET,
    { expiresIn: "1h" }
  );

  // Save the latest verification token
  await db.execute(
    "UPDATE users SET verification_token = ? WHERE userid = ?",
    [verificationToken, user.userid]
  );

  const verificationUrl =
    `${BASE_URL}/verify?token=${encodeURIComponent(verificationToken)}`;

  await transporter.sendMail({
    from: `"EcoConscious" <${process.env.EMAIL}>`,
    to: user.email,
    subject: "Verify your EcoConscious account",

    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; padding: 20px;">
        <h2>Welcome to EcoConscious!</h2>

        <p>Hi ${user.first_name || "there"},</p>

        <p>
          Thank you for registering with EcoConscious.
          Please verify your email address to activate your account.
        </p>

        <p>
          <a
            href="${verificationUrl}"
            style="
              background-color: #28a745;
              color: white;
              padding: 12px 20px;
              text-decoration: none;
              border-radius: 5px;
              display: inline-block;
            "
          >
            Verify Email
          </a>
        </p>

        <p>This verification link expires in 1 hour.</p>

        <p>If you did not create this account, please ignore this email.</p>

        <p>Regards,<br/>EcoConscious Team</p>
      </div>
    `,
  });
};

// POST /api/signup
router.post("/", validateSignup, hashPassword, async (req, res) => {
  const {
    username,
    first_name,
    last_name,
    email,
    password,
    phoneNumber,
    street,
    city,
    state_zip,
  } = req.body;

  try {
    // Check whether email already exists
    const [emailUsers] = await db.execute(
      `SELECT userid, username, email, first_name, isVerified
       FROM users
       WHERE email = ?`,
      [email]
    );

    if (emailUsers.length > 0) {
      const existingUser = emailUsers[0];

      if (Number(existingUser.isVerified) === 0) {
        // Resend verification email for an existing unverified account
        await sendVerificationEmail(existingUser);

        return res.status(200).json({
          message:
            "This email is already registered but not verified. A new verification email has been sent. Please check your inbox.",
        });
      }

      return res.status(409).json({
        message: "Email is already registered. Please log in.",
      });
    }

    // Check whether username already exists
    const [usernameUsers] = await db.execute(
      "SELECT userid FROM users WHERE username = ?",
      [username]
    );

    if (usernameUsers.length > 0) {
      return res.status(409).json({
        message: "Username is already taken. Please choose another username.",
      });
    }

    // Insert new user
    const insertQuery = `
      INSERT INTO users (
        username,
        first_name,
        last_name,
        email,
        password,
        phoneNumber,
        street,
        city,
        state_zip,
        verification_token,
        isVerified
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NULL, 0)
    `;

    const [result] = await db.execute(insertQuery, [
      username,
      first_name,
      last_name,
      email,
      password,
      phoneNumber,
      street,
      city,
      state_zip,
    ]);

    // Send verification email
    await sendVerificationEmail({
      userid: result.insertId,
      email,
      first_name,
    });

    return res.status(201).json({
      message:
        "Signup successful! Please check your email to verify your account. The verification link expires in 1 hour.",
    });

  } catch (error) {
    console.error("Signup Error:", error);

    return res.status(500).json({
      message: "Unable to complete signup. Please try again later.",
    });
  }
});

// POST /api/signup/resend-verification
router.post("/resend-verification", async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        message: "Email is required.",
      });
    }

    const [users] = await db.execute(
      `SELECT userid, email, first_name, isVerified
       FROM users
       WHERE email = ?`,
      [email]
    );

    // Generic response avoids revealing whether an account exists
    if (users.length === 0 || Number(users[0].isVerified) === 1) {
      return res.status(200).json({
        message:
          "If an unverified account exists with this email, a verification link will be sent.",
      });
    }

    await sendVerificationEmail(users[0]);

    return res.status(200).json({
      message: "A new verification email has been sent. Please check your inbox.",
    });

  } catch (error) {
    console.error("Resend Verification Error:", error);

    return res.status(500).json({
      message: "Unable to send verification email. Please try again later.",
    });
  }
});

module.exports = router;
