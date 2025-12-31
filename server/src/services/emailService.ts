const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

interface EmailPayload {
  to: string;
  subject: string;
  html: string;
}

async function sendNotificationEmail({ to, subject, html }: EmailPayload) {
  try {
    const info = await transporter.sendMail({
      from: `"Apartment Tracker" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    });
    console.log("Email sent successfully:", info.accepted);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("Error sending email:", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return { success: false, error: errorMessage };
  }
}

async function sendNewMessageNotification(
  tenant: { first_name: string; email: string },
  issue: { id: number; title: string },
  message: string,
  sender: { first_name: string; last_name: string }
) {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #1a1a1a;">
      <h2 style="color: #1a1a1a; margin-bottom: 16px;">New Message on Your Maintenance Issue</h2>
      <p style="margin: 12px 0;">Hello ${tenant.first_name},</p>
      <p style="margin: 12px 0;">Your landlord has sent you a message regarding your issue: <strong>${issue.title}</strong></p>
      
      <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #7A94B8;">
        <p style="margin: 8px 0;"><strong style="color: #7A94B8;">Sent By:</strong> ${sender.first_name} ${sender.last_name}</p>
        <p style="margin: 8px 0;"><strong style="color: #7A94B8;">Message:</strong> ${message}</p>
      </div>
      
      <p style="margin: 20px 0;">
        <a href="${process.env.CLIENT_URL}/issues/${issue.id}" 
           style="background-color: #7A94B8; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: 600;">
          View Issue
        </a>
      </p>
      
      <hr style="margin-top: 30px; border: none; border-top: 1px solid #d4d4d4;">
      <p style="color: #666; font-size: 12px; margin-top: 20px;">
        You received this email because you have an active maintenance request.
        To manage your notification preferences, visit your <a href="${process.env.CLIENT_URL}/settings" style="color: #7A94B8; text-decoration: underline;">account settings</a>.
      </p>
    </div>
  `;

  return await sendNotificationEmail({
    to: tenant.email,
    subject: `New Message on Your Maintenance Issue: ${issue.title}`,
    html,
  });
}

export {
  sendNotificationEmail,
  sendNewMessageNotification,
};
