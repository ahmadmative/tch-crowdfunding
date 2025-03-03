import React from 'react';

interface NotificationProps {
  title: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

const Notification: React.FC<NotificationProps> = ({ title, message, type }) => {
  return (
    <div className={`p-4 rounded-md ${type === 'success' ? 'bg-green-100 text-green-700' : type === 'error' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'}`}>
      <h4 className="font-bold">{title}</h4>
      <p>{message}</p>
    </div>
  );
};

export default Notification;
