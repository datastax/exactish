/**
 * Utility for handling browser notifications
 */

/**
 * Request notification permission if not already granted
 * @returns Promise<boolean> - Whether permission is granted
 */
export const requestNotificationPermission = async (): Promise<boolean> => {
  if (!('Notification' in window)) {
    console.log('This browser does not support desktop notifications');
    return false;
  }

  if (Notification.permission === 'granted') {
    return true;
  }

  if (Notification.permission !== 'denied') {
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  }

  return false;
};

/**
 * Send a browser notification
 * @param title - Notification title
 * @param options - Notification options
 */
export const sendNotification = (title: string, options?: NotificationOptions): void => {
  if (!('Notification' in window)) {
    console.log('This browser does not support desktop notifications');
    return;
  }

  if (Notification.permission === 'granted') {
    try {
      // Create and show the notification
      const notification = new Notification(title, options);
      
      // Auto close after 5 seconds
      setTimeout(() => {
        notification.close();
      }, 5000);
      
    } catch (error) {
      console.error('Error sending notification:', error);
    }
  } else {
    console.log('Notification permission not granted');
  }
};
