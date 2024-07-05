import nodemailer from "nodemailer";
import { ApiResponse } from "@/types/ApiResponse";


// Create a transport object using the default SMTP transport

// const transporter = nodemailer.createTransport({
//   host: "sandbox.smtp.mailtrap.io", // The hostname of your Mailtrap inbox
//   port: 2525, // The port number assigned by Mailtrap
//   secure: false,
//   auth: {
//     user: process.env.EMAIL_USERNAME, // Your Mailtrap username
//     pass: process.env.EMAIL_PASSWORD, // Your Mailtrap password
//   },
// });

//google API
 
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  auth: {
    user: process.env.GMAIL_USERNAME,
    pass: process.env.APP_PASSWORD,
  },
});


export async function sendVerificationEmail(
  username: string,
  email: string,
  verifyCode: string
): Promise<ApiResponse> {
  try {
    // Directly construct the HTML string for the email
    const htmlBody = `
      <html style="font-family: Arial, sans-serif;">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        .container {
          max-width: 600px;
          margin: auto;
          padding: 20px;
        }
        .header {
          font-size: 24px;
          color: #333;
          margin-bottom: 10px;
        }
        .message {
          font-size: 16px;
          color: #666;
          margin-bottom: 20px;
        }
        .code {
          font-weight: bold;
          color: #007BFF;
          margin-bottom: 20px;
        }
        
      </style>
    </head>
    <body>
      <div class="container">
        <h1 class="header">Hello ${username},</h1>
        <p class="message">Your verification code is:</p>
        <p class="code">${verifyCode}</p>
        <p class="message">If you did not request this code, please ignore this email.</p>
      </div>
    </body>
  </html>
    `;

    // Send the email
    const mailOptions = {
      from: '"AnonSync" <no-reply@anonSync.com>', // sender address
      to: email, // list of receivers
      subject: "AnonSync: Verify your email", // Subject line
      html: htmlBody, // plain text body
    };

    await transporter.sendMail(mailOptions);

    return {
      success: true,
      message: "Verification email sent",
    };
  } catch (emailError) {
    console.error("Error sending verification email:", emailError);
    return {
      success: false,
      message: "Error sending verification email",
    };
  }
}