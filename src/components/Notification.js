import React from 'react';
import './Notification.css';

const Notification = ({ message, type = 'info' }) => {
  return (
    <div className={`notification notification-${type}`}>
      {message}
    </div>
  );
};

export default Notification;
