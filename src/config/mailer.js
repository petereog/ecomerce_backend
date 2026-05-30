const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);

const sendOTP = async (email, otp) => {
  await resend.emails.send({
    from: 'Pecumat Foods <onboarding@resend.dev>',
    to: email,
    subject: 'Your Verification Code',
    html: `
      <div style="font-family: sans-serif; padding: 20px;">
        <h2 style="color: #53B175;">Pecumat Foods</h2>
        <p>Your verification code is:</p>
        <h1 style="letter-spacing: 10px; color: #53B175;">${otp}</h1>
        <p>This code expires in 10 minutes.</p>
      </div>
    `,
  });
};

module.exports = { sendOTP };