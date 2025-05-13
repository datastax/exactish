/**
 * Email service for sending notifications via SendGrid
 */

// Define the API endpoint for the Netlify function that sends emails
const EMAIL_API_ENDPOINT = '/.netlify/functions/send-email';

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
    console.log('Sending email notification to:', data.email);
    
    // Call the Netlify function to send the email
    const response = await fetch(EMAIL_API_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Failed to send email: ${errorData.error || response.statusText}`);
    }
    
    const result = await response.json();
    console.log('Email notification sent successfully:', result);
    return true;
  } catch (error) {
    console.error('Error sending email notification:', error instanceof Error ? error.message : 'Unknown error');
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
