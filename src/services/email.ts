/**
 * Email service for sending notifications via SendGrid
 */

// Define the API endpoint for the Netlify function that sends emails
// Use the deployed function URL if available, otherwise use the local path
const EMAIL_API_ENDPOINT = import.meta.env.VITE_NETLIFY_EMAIL_FUNCTION_URL || '/.netlify/functions/send-email';

console.log('Using email API endpoint:', EMAIL_API_ENDPOINT);

/**
 * Interface for email notification data
 */
interface EmailNotificationData {
  email: string;
  subject: string;
  message: string;
  imageData?: string; // Base64 image data
}

/**
 * Send an email notification using SendGrid via Netlify function
 * @param data - Email notification data
 * @returns Promise<boolean> - Whether the email was sent successfully
 */
export const sendEmailNotification = async (data: EmailNotificationData): Promise<boolean> => {
  try {
    console.log('🔵 SENDING EMAIL NOTIFICATION');
    console.log('📧 To:', data.email);
    console.log('📋 Subject:', data.subject);
    console.log('📝 Message:', data.message);
    console.log('🖼️ Image included:', !!data.imageData);
    console.log('🔗 Using endpoint:', EMAIL_API_ENDPOINT);
    
    // Call the Netlify function to send the email
    console.log('⏳ Calling Netlify function...');
    const response = await fetch(EMAIL_API_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    
    console.log('📥 Response status:', response.status);
    console.log('📥 Response status text:', response.statusText);
    
    if (!response.ok) {
      let errorMessage = '';
      try {
        const errorData = await response.json();
        console.error('📛 API error response:', errorData);
        errorMessage = errorData.error || errorData.details || response.statusText;
      } catch (jsonError) {
        console.error('📛 Could not parse error response as JSON');
        const textResponse = await response.text();
        console.error('📛 Raw error response:', textResponse);
        errorMessage = response.statusText;
      }
      throw new Error(`Failed to send email: ${errorMessage}`);
    }
    
    const result = await response.json();
    console.log('✅ Email notification sent successfully:', result);
    return true;
  } catch (error) {
    console.error('❌ Error sending email notification:', error instanceof Error ? error.message : 'Unknown error');
    if (error instanceof Error && error.stack) {
      console.error('📚 Stack trace:', error.stack);
    }
    return false;
  }
};

/**
 * Mock function for development - logs the email that would be sent
 * @param data - Email notification data
 */
export const mockSendEmailNotification = (data: EmailNotificationData): void => {
  console.log('MOCK EMAIL NOTIFICATION:');
  console.log('To:', data.email);
  console.log('Subject:', data.subject);
  console.log('Message:', data.message);
  console.log('Image included:', !!data.imageData);
};
