// using Twilio SendGrid's v3 Node.js Library
const sgMail = require('@sendgrid/mail');

exports.handler = async (event, context) => {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method Not Allowed' }),
    };
  }

  try {
    // Parse the request body
    const data = JSON.parse(event.body);
    const { email, subject, message, imageData } = data;

    // Validate required fields
    if (!email || !subject || !message) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Missing required fields' }),
      };
    }

    // Set SendGrid API key from environment variable
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);

    // Prepare email content
    const msg = {
      to: email,
      from: process.env.SENDGRID_FROM_EMAIL, // Verified sender email
      replyTo: process.env.SENDGRID_REPLY_EMAIL || process.env.SENDGRID_FROM_EMAIL,
      subject: subject,
      text: message, // Plain text version
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #6366f1;">${subject}</h2>
          <p>${message}</p>
          ${imageData ? `
            <div style="margin: 20px 0;">
              <p style="margin-bottom: 10px; font-weight: bold;">Your processed image:</p>
              <img src="${imageData}" alt="Processed Image" style="max-width: 100%; border-radius: 8px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);" />
            </div>
          ` : ''}
          <p style="margin-top: 20px; font-size: 0.9em; color: #666;">
            This email was sent from the Image Iteration App.
          </p>
        </div>
      `,
    };

    // Send the email
    await sgMail.send(msg);

    return {
      statusCode: 200,
      body: JSON.stringify({ 
        message: 'Email sent successfully',
        recipient: email 
      }),
    };
  } catch (error) {
    console.error('Error sending email:', error);
    
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        error: 'Error sending email', 
        details: error.message 
      }),
    };
  }
};
