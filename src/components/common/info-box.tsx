import React from 'react';

interface InfoBoxProps {
  type?: 'info' | 'warning' | 'amber';
  children: React.ReactNode;
}

const typeClassMap = {
  info: 'info-box',
  warning: 'warn-box',
  amber: 'amber-box',
};

export const InfoBox: React.FC<InfoBoxProps> = ({ type = 'info', children }) => {
  return <div className={typeClassMap[type]}>{children}</div>;
};
