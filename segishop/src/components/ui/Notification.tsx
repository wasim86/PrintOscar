'use client';

import React, { useEffect } from 'react';
import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-react';

export type NotificationType = 'success' | 'error' | 'warning' | 'info';

interface NotificationProps {
  type: NotificationType;
  title: string;
  message?: string;
  isVisible: boolean;
  onClose: () => void;
  autoClose?: boolean;
  autoCloseDelay?: number;
}

const notificationStyles = {
  success: {
    container: 'bg-green-50 border-green-200',
    icon: 'text-green-600',
    title: 'text-green-900',
    message: 'text-green-700',
    closeButton: 'text-green-600 hover:text-green-800'
  },
  error: {
    container: 'bg-red-50 border-red-200',
    icon: 'text-red-600',
    title: 'text-red-900',
    message: 'text-red-700',
    closeButton: 'text-red-600 hover:text-red-800'
  },
  warning: {
    container: 'bg-yellow-50 border-yellow-200',
    icon: 'text-yellow-600',
    title: 'text-yellow-900',
    message: 'text-yellow-700',
    closeButton: 'text-yellow-600 hover:text-yellow-800'
  },
  info: {
    container: 'bg-blue-50 border-blue-200',
    icon: 'text-blue-600',
    title: 'text-blue-900',
    message: 'text-blue-700',
    closeButton: 'text-blue-600 hover:text-blue-800'
  }
};

const getIcon = (type: NotificationType) => {
  switch (type) {
    case 'success':
      return CheckCircle;
    case 'error':
      return XCircle;
    case 'warning':
      return AlertCircle;
    case 'info':
      return Info;
    default:
      return Info;
  }
};

export const Notification: React.FC<NotificationProps> = ({
  type,
  title,
  message,
  isVisible,
  onClose,
  autoClose = true,
  autoCloseDelay = 5000
}) => {
  const styles = notificationStyles[type];
  const Icon = getIcon(type);

  useEffect(() => {
    if (isVisible && autoClose) {
      const timer = setTimeout(() => {
        onClose();
      }, autoCloseDelay);

      return () => clearTimeout(timer);
    }
  }, [isVisible, autoClose, autoCloseDelay, onClose]);

  if (!isVisible) return null;

  return (
    <div className="fixed top-4 right-4 z-50 max-w-md w-full">
      <div className={`border rounded-lg p-4 shadow-lg transition-all duration-300 ${styles.container}`}>
        <div className="flex items-start">
          <Icon className={`h-5 w-5 mt-0.5 mr-3 ${styles.icon}`} />
          <div className="flex-1">
            <h3 className={`text-sm font-medium ${styles.title}`}>
              {title}
            </h3>
            {message && (
              <p className={`mt-1 text-sm ${styles.message}`}>
                {message}
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            className={`ml-3 transition-colors ${styles.closeButton}`}
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

// Hook for managing notifications
export const useNotification = () => {
  const [notification, setNotification] = React.useState<{
    type: NotificationType;
    title: string;
    message?: string;
    isVisible: boolean;
  }>({
    type: 'info',
    title: '',
    message: '',
    isVisible: false
  });

  const showNotification = (type: NotificationType, title: string, message?: string) => {
    setNotification({
      type,
      title,
      message,
      isVisible: true
    });
  };

  const hideNotification = () => {
    setNotification(prev => ({
      ...prev,
      isVisible: false
    }));
  };

  const showSuccess = (title: string, message?: string) => {
    showNotification('success', title, message);
  };

  const showError = (title: string, message?: string) => {
    showNotification('error', title, message);
  };

  const showWarning = (title: string, message?: string) => {
    showNotification('warning', title, message);
  };

  const showInfo = (title: string, message?: string) => {
    showNotification('info', title, message);
  };

  return {
    notification,
    showNotification,
    hideNotification,
    showSuccess,
    showError,
    showWarning,
    showInfo
  };
};
