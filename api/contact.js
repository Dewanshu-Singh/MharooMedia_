import { Resend } from 'resend';

// Resend automatically looks for the RESEND_API_KEY environment variable.
const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  // CORS configuration (optional but good practice)
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { name, phone, email, message } = req.body;

    if (!name || !phone || !email || !message) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const { data, error } = await resend.emails.send({
      from: 'Contact Form <onboarding@resend.dev>', // Change this once domain is verified
      to: process.env.RECEIVER_EMAIL || 'your_email@example.com', // User needs to configure this!
      subject: `New Consultation Request from ${name}`,
      html: `
        <h2>New Consultation Request</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong><br>${message.replace(/\n/g, '<br>')}</p>
      `,
    });

    if (error) {
      console.error("Resend API Error:", error);
      return res.status(400).json({ error: error.message });
    }

    return res.status(200).json({ success: true, data });
  } catch (err) {
    console.error("Server Error:", err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
