// using Twilio SendGrid's v3 Node.js Library
const sgMail = require('@sendgrid/mail');
const client = require('@sendgrid/client');

module.exports = async (req, res) => {
  console.log('🔵 API FUNCTION: send-email triggered');
  console.log('🔍 Request method:', req.method);
  console.log('🔍 Origin:', req.headers.origin || 'No origin');
  
  // Handle OPTIONS request (CORS preflight)
  if (req.method === 'OPTIONS') {
    console.log('🔵 Handling CORS preflight request');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Max-Age', '86400');
    return res.status(204).end();
  }
  
  // Only allow POST requests
  if (req.method !== 'POST') {
    console.log('❌ Method not allowed:', req.method);
    res.setHeader('Access-Control-Allow-Origin', '*');
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    // Parse the request body
    console.log('📦 Parsing request body...');
    const data = req.body;
    const { email, subject, message, imageData } = data;
    
    console.log('📧 Email recipient:', email);
    console.log('📋 Subject:', subject);
    console.log('📝 Message length:', message?.length || 0);
    console.log('🖼️ Image data included:', !!imageData);
    
    // Log environment variables (without revealing values)
    console.log('🔐 SENDGRID_API_KEY present:', !!process.env.SENDGRID_API_KEY);
    console.log('📤 SENDGRID_FROM_EMAIL:', process.env.SENDGRID_FROM_EMAIL);
    console.log('↩️ SENDGRID_REPLY_EMAIL:', process.env.SENDGRID_REPLY_EMAIL);

    // Validate required fields
    if (!email || !subject || !message) {
      console.log(' Missing required fields');
      console.log(' Email present:', !!email);
      console.log(' Subject present:', !!subject);
      console.log(' Message present:', !!message);
      
      res.setHeader('Access-Control-Allow-Origin', '*');
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Set SendGrid API key from environment variable
    console.log(' Setting SendGrid API key...');
    if (!process.env.SENDGRID_API_KEY) {
      console.error(' SENDGRID_API_KEY is not defined in environment variables');
      res.setHeader('Access-Control-Allow-Origin', '*');
      return res.status(500).json({ error: 'SendGrid API key is not configured' });
    }
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
            This email was sent from the Exactish App.
          </p>
        </div>
      `,
    };

    // Send the email
    console.log(' Sending email via SendGrid...');
    try {
      const response = await sgMail.send(msg);
      console.log(' SendGrid response:', response);
      
      // Add contact to the Exactish list
      // Note: This requires a SendGrid API key with Marketing Contacts permissions
      // If you're seeing 403 Forbidden errors, you need to update your API key permissions
      if (process.env.SENDGRID_ENABLE_MARKETING === 'true') {
        try {
          // Set the client API key
          client.setApiKey(process.env.SENDGRID_API_KEY);
          
          // Prepare the request to add contact to list
          const contactData = {
            list_ids: ['939df3f2-1286-49ed-bf91-f711214d012b'], // Exactish list ID
            contacts: [
              {
                email: email,
                first_name: email.split('@')[0], // Use part before @ as first name
                custom_fields: {}
              }
            ]
          };
          
          const request = {
            url: '/v3/marketing/contacts',
            method: 'PUT',
            body: contactData
          };
          
          console.log(' Adding contact to SendGrid list...');
          const [contactResponse, contactBody] = await client.request(request);
          console.log(' Contact added to list response:', contactResponse.statusCode);
        } catch (contactError) {
          console.error(' Error adding contact to list:', contactError);
          if (contactError.code === 403) {
            console.warn(' Permission denied: Your SendGrid API key does not have Marketing Contacts permissions.');
            console.warn(' To fix this, create a new API key with Marketing > Contacts permissions.');
          }
          // Continue even if adding to list fails - don't block email sending
        }
      } else {
        console.log(' Marketing contacts feature is disabled. Set SENDGRID_ENABLE_MARKETING=true to enable.');
      }
      
      res.setHeader('Access-Control-Allow-Origin', '*');
      return res.status(200).json({ 
        message: 'Email sent successfully',
        recipient: email,
        timestamp: new Date().toISOString()
      });
    } catch (sendGridError) {
      console.error(' SendGrid error:', sendGridError);
      if (sendGridError.response) {
        console.error(' SendGrid error response:', sendGridError.response.body);
      }
      throw sendGridError;
    }
  } catch (error) {
    console.error(' Error in send-email function:', error);
    console.error(' Error stack:', error.stack);
    
    res.setHeader('Access-Control-Allow-Origin', '*');
    return res.status(500).json({ 
      error: 'Error sending email', 
      details: error.message,
      timestamp: new Date().toISOString()
    });
  }
};
