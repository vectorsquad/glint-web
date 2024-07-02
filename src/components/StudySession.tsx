import React, { useState, useEffect } from 'react';
import PomodoroTimer from './PomodoroTimer';

const StudySession: React.FC = () => {
  const [time, setTime] = useState(25 * 60); // 25 minutes in seconds
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null; // Declare interval as possibly null
    if (isActive) {
      interval = setInterval(() => {
        setTime((prevTime) => prevTime - 1);
      }, 1000);
    } else if (interval) {
      clearInterval(interval); // Ensure interval is not null before clearing it
    }
    return () => {
      if (interval) clearInterval(interval); // Ensure interval is not null before clearing it in cleanup
    };
  }, [isActive]);

  const handleStartPause = () => {
    setIsActive(!isActive);
  };

  const handleReset = () => {
    setIsActive(false);
    setTime(25 * 60);
  };

  return (
    <div>
      <h1>Study Session</h1>
      <div>
        <span>{Math.floor(time / 60)}:{(time % 60).toString().padStart(2, '0')}</span>
      </div>
      <button onClick={handleStartPause}>{isActive ? 'Pause' : 'Start'}</button>
      <button onClick={handleReset}>Reset</button>
      <PomodoroTimer />
    </div>
  );
};

export default StudySession;
