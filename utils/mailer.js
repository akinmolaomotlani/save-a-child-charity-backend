const { Resend } = require("resend");

const resend = new Resend(process.env.RESEND_API_KEY);
console.log("API KEY:", process.env.RESEND_API_KEY);

const sendEmail = async ({ to, subject, html }) => {
  const data = await resend.emails.send({
    from: "onboarding@resend.dev", // or your domain later
    to,
    subject,
    html,
  });

  console.log("✅ Email sent:", data);
};

module.exports = sendEmail;
