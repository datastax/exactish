/**
 * Email service for sending notifications via SendGrid
 */

/**
 * Interface for email notification data
 */
export interface EmailNotificationData {
  email: string;
  subject: string;
  message: string;
  imageData?: string; // Base64 image data
}

/**
 * Determines which platform is being used (Netlify or Vercel)
 * @returns The platform name and API endpoint
 */
const getPlatformInfo = (): { platform: 'netlify' | 'vercel', endpoint: string } => {
  // Check if platform is explicitly set in environment variables
  const platformOverride = import.meta.env.VITE_PLATFORM as 'netlify' | 'vercel' | undefined;
  
  if (platformOverride === 'netlify') {
    return {
      platform: 'netlify',
      endpoint: import.meta.env.VITE_NETLIFY_EMAIL_FUNCTION_URL || '/.netlify/functions/send-email'
    };
  }
  
  if (platformOverride === 'vercel') {
    return {
      platform: 'vercel',
      endpoint: import.meta.env.VITE_VERCEL_EMAIL_API_URL || '/api/send-email'
    };
  }
  
  // Auto-detect based on URL
  const isVercel = window.location.hostname.includes('vercel.app');
  
  if (isVercel) {
    return {
      platform: 'vercel',
      endpoint: import.meta.env.VITE_VERCEL_EMAIL_API_URL || '/api/send-email'
    };
  }
  
  // Default to Netlify
  return {
    platform: 'netlify',
    endpoint: import.meta.env.VITE_NETLIFY_EMAIL_FUNCTION_URL || '/.netlify/functions/send-email'
  };
}
console.log('Using email API endpoint:', getPlatformInfo().endpoint);
/**
 * Send email notification
 * @param data - Email notification data
 */
export const sendEmailNotification = async (data: EmailNotificationData): Promise<void> => {
  try {
    // Get platform info (Netlify or Vercel)
    const { platform, endpoint } = getPlatformInfo();
    console.log(`📧 [Service] Sending email via ${platform} to:`, data.email);
    console.log('📧 [Service] Using API endpoint:', endpoint);
    
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('📧 [Service] Error sending email:', response.status, errorData);
      throw new Error(`Failed to send email: ${response.status} ${response.statusText}`);
    }

    const result = await response.json();
    console.log('📧 [Service] Email sent successfully:', result);
  } catch (error) {
    console.error('📧 [Service] Error in sendEmailNotification:', error);
    throw error;
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
