import React, { useState, useEffect } from 'react';

const CountdownTimer = ({ deadline }) => {
  const [timeLeft, setTimeLeft] = useState('');
  const [isUrgent, setIsUrgent] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const deadlineTime = new Date(deadline).getTime();
      const difference = deadlineTime - now;

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));

        setTimeLeft(`${days}d ${hours}h ${minutes}m`);
        setIsUrgent(days <= 1);
      } else {
        setTimeLeft('Expired');
        setIsUrgent(true);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [deadline]);

  const timerStyle = {
    padding: '4px 8px',
    borderRadius: '4px',
    fontSize: '12px',
    fontWeight: 'bold',
    backgroundColor: isUrgent ? '#ffebee' : '#e8f5e8',
    color: isUrgent ? '#c62828' : '#2e7d32',
    border: `1px solid ${isUrgent ? '#ef5350' : '#4caf50'}`
  };

  return <span style={timerStyle}>{timeLeft}</span>;
};

export default CountdownTimer;