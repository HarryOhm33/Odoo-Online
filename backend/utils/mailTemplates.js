module.exports.generateVerificationEmail = (name, verificationLink) => {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Verify Your Account</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
            line-height: 1.6;
            color: #333;
            margin: 0;
            padding: 0;
            background-color: #f9fafb;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
        }
        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            padding: 30px 20px;
            text-align: center;
            border-radius: 8px 8px 0 0;
        }
        .header h1 {
            color: white;
            margin: 0;
            font-size: 28px;
            font-weight: 600;
        }
        .content {
            padding: 30px;
        }
        .welcome-text {
            font-size: 18px;
            margin-bottom: 20px;
            color: #4a5568;
        }
        .verification-box {
            background-color: #f7fafc;
            border: 1px solid #e2e8f0;
            border-radius: 8px;
            padding: 25px;
            text-align: center;
            margin: 25px 0;
        }
        .button {
            display: inline-block;
            padding: 14px 28px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            text-decoration: none;
            border-radius: 6px;
            font-weight: 600;
            font-size: 16px;
            margin: 15px 0;
        }
        .link-text {
            word-break: break-all;
            color: #4a5568;
            font-size: 14px;
            margin-top: 15px;
        }
        .footer {
            text-align: center;
            padding: 20px;
            font-size: 14px;
            color: #718096;
            border-top: 1px solid #e2e8f0;
        }
        .warning {
            background-color: #fff5f5;
            border: 1px solid #fed7d7;
            border-radius: 6px;
            padding: 15px;
            margin: 20px 0;
            color: #c53030;
            font-size: 14px;
        }
        .logo {
            font-size: 24px;
            font-weight: bold;
            color: white;
            text-decoration: none;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Verify Your Account</h1>
        </div>
        
        <div class="content">
            <p class="welcome-text">Hello <strong>${name}</strong>,</p>
            <p>Thank you for signing up! To complete your registration, please verify your email address by clicking the button below:</p>
            
            <div class="verification-box">
                <a href="${verificationLink}" class="button">Verify Email Address</a>
                <p class="link-text">Or copy and paste this link into your browser:<br>${verificationLink}</p>
            </div>
            
            <div class="warning">
                <strong>Important:</strong> This verification link will expire in 10 minutes for security reasons.
            </div>
            
            <p>If you didn't create an account with us, please ignore this email.</p>
            
            <p>Best regards,<br>The Team</p>
        </div>
        
        <div class="footer">
            <p>© ${new Date().getFullYear()} Your Company Name. All rights reserved.</p>
            <p>If you need help, please contact our support team at support@yourdomain.com</p>
        </div>
    </div>
</body>
</html>
  `;
};

module.exports.generatePasswordResetEmail = (name, resetLink) => {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Reset Your Password</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
            line-height: 1.6;
            color: #333;
            margin: 0;
            padding: 0;
            background-color: #f9fafb;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
        }
        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            padding: 30px 20px;
            text-align: center;
            border-radius: 8px 8px 0 0;
        }
        .header h1 {
            color: white;
            margin: 0;
            font-size: 28px;
            font-weight: 600;
        }
        .content {
            padding: 30px;
        }
        .welcome-text {
            font-size: 18px;
            margin-bottom: 20px;
            color: #4a5568;
        }
        .reset-box {
            background-color: #f7fafc;
            border: 1px solid #e2e8f0;
            border-radius: 8px;
            padding: 25px;
            text-align: center;
            margin: 25px 0;
        }
        .button {
            display: inline-block;
            padding: 14px 28px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            text-decoration: none;
            border-radius: 6px;
            font-weight: 600;
            font-size: 16px;
            margin: 15px 0;
        }
        .link-text {
            word-break: break-all;
            color: #4a5568;
            font-size: 14px;
            margin-top: 15px;
        }
        .footer {
            text-align: center;
            padding: 20px;
            font-size: 14px;
            color: #718096;
            border-top: 1px solid #e2e8f0;
        }
        .warning {
            background-color: #fff5f5;
            border: 1px solid #fed7d7;
            border-radius: 6px;
            padding: 15px;
            margin: 20px 0;
            color: #c53030;
            font-size: 14px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Password Reset Request</h1>
        </div>
        
        <div class="content">
            <p class="welcome-text">Hello <strong>${name}</strong>,</p>
            <p>We received a request to reset your password. You can reset it by clicking the button below:</p>
            
            <div class="reset-box">
                <a href="${resetLink}" class="button">Reset Password</a>
                <p class="link-text">Or copy and paste this link into your browser:<br>${resetLink}</p>
            </div>
            
            <div class="warning">
                <strong>Important:</strong> This reset link will expire in 10 minutes for security reasons.
            </div>
            
            <p>If you didn’t request this password reset, you can safely ignore this email. Your account will remain secure.</p>
            
            <p>Best regards,<br>The Team</p>
        </div>
        
        <div class="footer">
            <p>© ${new Date().getFullYear()} Your Company Name. All rights reserved.</p>
            <p>If you need help, please contact our support team at support@yourdomain.com</p>
        </div>
    </div>
</body>
</html>
  `;
};

// ── Employee Account Activation Email ────────────────────────────────────────
module.exports.generateActivationEmail = (name, activationLink, orgName) => {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Activate Your Account</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
            line-height: 1.6;
            color: #333;
            margin: 0;
            padding: 0;
            background-color: #f9fafb;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
        }
        .header {
            background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%);
            padding: 30px 20px;
            text-align: center;
            border-radius: 8px 8px 0 0;
        }
        .header h1 {
            color: white;
            margin: 0;
            font-size: 28px;
            font-weight: 600;
        }
        .header p {
            color: rgba(255,255,255,0.9);
            margin: 8px 0 0;
            font-size: 15px;
        }
        .content {
            padding: 30px;
        }
        .welcome-text {
            font-size: 18px;
            margin-bottom: 20px;
            color: #4a5568;
        }
        .activation-box {
            background-color: #f0fff4;
            border: 1px solid #c6f6d5;
            border-radius: 8px;
            padding: 25px;
            text-align: center;
            margin: 25px 0;
        }
        .button {
            display: inline-block;
            padding: 14px 32px;
            background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%);
            color: white;
            text-decoration: none;
            border-radius: 6px;
            font-weight: 700;
            font-size: 16px;
            margin: 15px 0;
        }
        .link-text {
            word-break: break-all;
            color: #4a5568;
            font-size: 13px;
            margin-top: 15px;
        }
        .info-box {
            background-color: #ebf8ff;
            border: 1px solid #bee3f8;
            border-radius: 6px;
            padding: 15px;
            margin: 20px 0;
            color: #2b6cb0;
            font-size: 14px;
        }
        .footer {
            text-align: center;
            padding: 20px;
            font-size: 14px;
            color: #718096;
            border-top: 1px solid #e2e8f0;
        }
        .steps {
            background-color: #f7fafc;
            border-radius: 8px;
            padding: 20px;
            margin: 20px 0;
        }
        .steps ol {
            margin: 8px 0 0;
            padding-left: 20px;
            color: #4a5568;
        }
        .steps li {
            margin-bottom: 8px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Welcome to ${orgName || "the Team"}!</h1>
            <p>Your account has been created</p>
        </div>
        
        <div class="content">
            <p class="welcome-text">Hello <strong>${name}</strong>,</p>
            <p>You have been added as a team member. To get started, activate your account by setting your password using the button below:</p>

            <div class="steps">
                <strong>Getting started is easy:</strong>
                <ol>
                    <li>Click the <strong>Activate Account</strong> button below</li>
                    <li>Set a secure password for your account</li>
                    <li>Log in and start managing assets</li>
                </ol>
            </div>
            
            <div class="activation-box">
                <a href="${activationLink}" class="button">Activate Account</a>
                <p class="link-text">Or copy and paste this link into your browser:<br>${activationLink}</p>
            </div>
            
            <div class="info-box">
                <strong>Note:</strong> This activation link will expire in <strong>24 hours</strong>. If you need a new link, please contact your administrator.
            </div>
            
            <p>If you were not expecting this invitation, please ignore this email or contact your administrator.</p>
            
            <p>Best regards,<br>The ${orgName || "Company"} Admin Team</p>
        </div>
        
        <div class="footer">
            <p>© ${new Date().getFullYear()} ${orgName || "Your Company"}. All rights reserved.</p>
            <p>If you need help, please contact your system administrator.</p>
        </div>
    </div>
</body>
</html>
  `;
};
