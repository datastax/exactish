import React, { useState } from 'react';
import { Bell, Mail, Check, X } from 'lucide-react';
import { areNotificationsSupported, isNotificationPermissionGranted, requestNotificationPermission } from '../utils/notifications';

interface NotificationPreferencesProps {
  onEmailSubmit: (email: string) => void;
  isProcessing: boolean;
}

const NotificationPreferences: React.FC<NotificationPreferencesProps> = ({ 
  onEmailSubmit,
  isProcessing
}) => {
  const [email, setEmail] = useState('');
  const [emailSubmitted, setEmailSubmitted] = useState(false);
  const [notificationRequested, setNotificationRequested] = useState(false);
  const [notificationStatus, setNotificationStatus] = useState<'granted' | 'denied' | 'default' | null>(
    isNotificationPermissionGranted() ? 'granted' : null
  );

  const handleRequestNotifications = async () => {
    const granted = await requestNotificationPermission();
    setNotificationStatus(granted ? 'granted' : 'denied');
    setNotificationRequested(true);
  };

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && email.includes('@')) {
      onEmailSubmit(email);
      setEmailSubmitted(true);
    }
  };

  const resetEmail = () => {
    setEmail('');
    setEmailSubmitted(false);
  };

  const notificationsSupported = areNotificationsSupported();
  const notificationsGranted = isNotificationPermissionGranted();

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-white/90">Notification Preferences</h3>
      <p className="text-sm text-white/60">
        Choose how you'd like to be notified when your image processing is complete.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Browser Notifications */}
        <div className="bg-white/5 rounded-lg p-4 border border-white/10">
          <div className="flex items-start">
            <div className="flex-shrink-0 mt-1">
              <Bell size={18} className="text-white/70" />
            </div>
            <div className="ml-3 flex-1">
              <h4 className="text-sm font-medium text-white/90">Browser Notifications</h4>
              <p className="text-xs text-white/60 mt-1">
                Get notified in your browser when processing is complete.
              </p>
              
              {!notificationsSupported && (
                <div className="mt-2 text-xs text-amber-300">
                  Your browser doesn't support notifications.
                </div>
              )}
              
              {notificationsSupported && notificationsGranted && (
                <div className="mt-2 text-xs text-green-400 flex items-center">
                  <Check size={14} className="mr-1" />
                  Notifications enabled
                </div>
              )}
              
              {notificationsSupported && !notificationsGranted && notificationStatus === 'denied' && (
                <div className="mt-2 text-xs text-red-400">
                  Notifications blocked. Please enable them in your browser settings.
                </div>
              )}
              
              {notificationsSupported && !notificationsGranted && notificationStatus !== 'denied' && (
                <button
                  onClick={handleRequestNotifications}
                  disabled={isProcessing || notificationRequested}
                  className={`mt-3 px-3 py-1.5 text-xs rounded-md flex items-center
                    ${isProcessing || notificationRequested
                      ? 'bg-white/10 text-white/40 cursor-not-allowed'
                      : 'bg-white/20 text-white hover:bg-white/30 transition-colors'}
                  `}
                >
                  Enable Notifications
                </button>
              )}
            </div>
          </div>
        </div>
        
        {/* Email Notifications */}
        <div className="bg-white/5 rounded-lg p-4 border border-white/10">
          <div className="flex items-start">
            <div className="flex-shrink-0 mt-1">
              <Mail size={18} className="text-white/70" />
            </div>
            <div className="ml-3 flex-1">
              <h4 className="text-sm font-medium text-white/90">Email Notifications</h4>
              <p className="text-xs text-white/60 mt-1">
                Get notified by email when processing is complete.
              </p>
              
              {!emailSubmitted ? (
                <div>
                  <form onSubmit={handleEmailSubmit} className="mt-2 flex items-center">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="your@email.com"
                      disabled={isProcessing}
                      className="flex-1 bg-black/30 border border-white/10 rounded-l-md px-3 py-1.5 text-xs text-white placeholder:text-white/30 focus:outline-none focus:ring-1 focus:ring-white/30"
                      required
                    />
                    <button
                      type="submit"
                      disabled={isProcessing || !email || !email.includes('@')}
                      className={`px-3 py-1.5 text-xs rounded-r-md
                        ${isProcessing || !email || !email.includes('@')
                          ? 'bg-white/10 text-white/40 cursor-not-allowed'
                          : 'bg-white/20 text-white hover:bg-white/30 transition-colors'}
                      `}
                    >
                      Submit
                    </button>
                  </form>
                  <p className="text-xs text-white/50 mt-2 italic">
                    By providing your email, you agree to receive occasional updates from Langflow.
                  </p>
                </div>
              ) : (
                <div className="mt-2 flex items-center justify-between">
                  <div className="text-xs text-green-400 flex items-center">
                    <Check size={14} className="mr-1" />
                    Email notification set
                  </div>
                  <button
                    onClick={resetEmail}
                    className="text-xs text-white/60 hover:text-white/90 transition-colors"
                    disabled={isProcessing}
                  >
                    <X size={14} />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationPreferences;
