const { Resend } = require("resend");

const resend = new Resend(process.env.RESEND_API_KEY);

const sendEmail = async ({ to, subject, html }) => {
  try {
    const response = await resend.emails.send({
      from: "onboarding@resend.dev", // default test sender
      to,
      subject,
      html,
    });

    console.log("✅ Email sent:", response);
  } catch (err) {
    console.error("❌ Email error:", err);
    throw err;
  }
};

module.exports = sendEmail;
