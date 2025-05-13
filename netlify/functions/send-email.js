// using Twilio SendGrid's v3 Node.js Library
const sgMail = require('@sendgrid/mail');

exports.handler = async (event, context) => {
  console.log('🔵 NETLIFY FUNCTION: send-email triggered');
  console.log('🔍 Request method:', event.httpMethod);
  console.log('🔍 Origin:', event.headers.origin || event.headers.Origin || 'No origin');
  
  // Handle OPTIONS request (CORS preflight)
  if (event.httpMethod === 'OPTIONS') {
    console.log('🔵 Handling CORS preflight request');
    return {
      statusCode: 204, // No content
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Max-Age': '86400'
      }
    };
  }
  
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    console.log('❌ Method not allowed:', event.httpMethod);
    return {
      statusCode: 405,
      headers: {
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({ error: 'Method Not Allowed' }),
    };
  }

  try {
    // Parse the request body
    console.log('📦 Parsing request body...');
    const data = JSON.parse(event.body);
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
      
      return {
        statusCode: 400,
        headers: {
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({ error: 'Missing required fields' }),
      };
    }

    // Set SendGrid API key from environment variable
    console.log(' Setting SendGrid API key...');
    if (!process.env.SENDGRID_API_KEY) {
      console.error(' SENDGRID_API_KEY is not defined in environment variables');
      return {
        statusCode: 500,
        headers: {
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({ error: 'SendGrid API key is not configured' }),
      };
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
            This email was sent from the Image Iteration App.
          </p>
        </div>
      `,
    };

    // Send the email
    console.log(' Sending email via SendGrid...');
    try {
      const response = await sgMail.send(msg);
      console.log(' SendGrid response:', response);
      
      return {
        statusCode: 200,
        headers: {
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({ 
          message: 'Email sent successfully',
          recipient: email,
          timestamp: new Date().toISOString()
        }),
      };
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
    
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({ 
        error: 'Error sending email', 
        details: error.message,
        timestamp: new Date().toISOString()
      }),
    };
  }
};
