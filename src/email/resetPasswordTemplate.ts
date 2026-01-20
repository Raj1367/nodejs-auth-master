type ResetPasswordParams = {
  userName: string;
  resetPasswordLink: string;
  expiryTime: string;
  appName: string;
};

export const resetPasswordTemplate = ({
  userName,
  resetPasswordLink,
  expiryTime,
  appName,
}: ResetPasswordParams): string => {
  return `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Reset Password</title>
    <style>
      body {
        margin: 0;
        padding: 0;
        background-color: #f4f6f8;
        font-family: Arial, Helvetica, sans-serif;
      }
      .container {
        max-width: 600px;
        margin: 40px auto;
        background-color: #ffffff;
        border-radius: 8px;
        overflow: hidden;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
      }
      .header {
        background-color: #4f46e5;
        color: #ffffff;
        padding: 20px;
        text-align: center;
      }
      .content {
        padding: 30px;
        color: #333333;
        line-height: 1.6;
      }
      .button {
        display: inline-block;
        margin: 24px 0;
        padding: 12px 24px;
        background-color: #4f46e5;
        color: #ffffff !important;
        text-decoration: none;
        border-radius: 6px;
        font-weight: bold;
      }
      .footer {
        padding: 20px;
        text-align: center;
        font-size: 12px;
        color: #777777;
        background-color: #fafafa;
      }
      .link {
        word-break: break-all;
        color: #4f46e5;
      }
    </style>
  </head>

  <body>
    <div class="container">
      <div class="header">
        <h1>Reset Your Password</h1>
      </div>

      <div class="content">
        <p>Hi <strong>${userName}</strong>,</p>

        <p>
          We received a request to reset your password. Click the button below to
          set a new password:
        </p>

        <p style="text-align: center;">
          <a href="${resetPasswordLink}" class="button">
            Reset Password
          </a>
        </p>

        <p>
          If the button doesn’t work, copy and paste this link into your browser:
        </p>

        <p class="link">${resetPasswordLink}</p>

        <p>
          This link will expire in <strong>${expiryTime}</strong>.
        </p>

        <p>
          If you did not request a password reset, please ignore this email. Your
          account will remain secure.
        </p>

        <p>Best regards,<br /><strong>${appName}</strong></p>
      </div>

      <div class="footer">
        © ${new Date().getFullYear()} ${appName}. All rights reserved.
      </div>
    </div>
  </body>
</html>
`;
};
