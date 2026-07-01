'use client';

import React, { useContext, useMemo, useState } from 'react';
import { DialogMessageView } from '../components/dialog-message/view';

export const DialogMessageIcon = {
  success: '/images/common/success.svg',
  alert: '/images/common/alert.svg',
  waiting: '/images/common/waiting.svg',
};

export const DialogMessageContext = React.createContext<{
  showMessage: (message: string, onCallback?: () => void) => void;
  showMessageIcon: (message: string, icon: string, onCallback?: () => void) => void;
  showConfirmMessageIcon: (message: string, icon: string, onCallback: () => void) => void;
  hideMessage: () => void;
} | null>(null);

export const useDialogMessage = () => {
  const context = useContext(DialogMessageContext);
  if (!context) {
    throw new Error('useDialogMessage must be used within a DialogMessageProvider');
  }
  return context;
};

export const DialogMessageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [message, setMessage] = useState<string | null>(null);
  const [icon, setIcon] = useState<string | null>(null);
  const [isConfirm, setIsConfirm] = useState<boolean>(false);
  const [callback, setCallback] = useState<(() => void) | null>(null);

  const showMessage = (msg: string, onCallback?: () => void) => {
    setMessage(msg);
    setIcon(null);
    setIsConfirm(false);
    setCallback(() => onCallback || null);
  };

  const showMessageIcon = (msg: string, iconChanged: string, onCallback?: () => void) => {
    setMessage(msg);
    setIcon(iconChanged);
    setIsConfirm(false);
    setCallback(() => onCallback || null);
  };

  const showConfirmMessageIcon = (msg: string, iconChanged: string, onCallback?: () => void) => {
    setMessage(msg);
    setIcon(iconChanged);
    setIsConfirm(true);
    setCallback(() => onCallback || null);
  };

  const hideMessage = () => {
    setMessage(null);
    setIsConfirm(false);
    setIcon(null);
    if (callback && !isConfirm) {
      callback();
      setCallback(null);
    }
  };

  const contextValue = useMemo(
    () => ({ showMessage, showMessageIcon, hideMessage, showConfirmMessageIcon }),
    [showMessage, showMessageIcon, hideMessage, showConfirmMessageIcon]
  );

  return (
    <DialogMessageContext.Provider value={contextValue}>
      {children}
      {message && (
        <DialogMessageView
          isConfirm={isConfirm}
          icon={icon}
          message={message}
          hideMessage={hideMessage}
          onConfirm={
            isConfirm
              ? () => {
                  if (callback) {
                    callback();
                    setCallback(null);
                  }
                  hideMessage();
                }
              : undefined
          }
        />
      )}
    </DialogMessageContext.Provider>
  );
};
