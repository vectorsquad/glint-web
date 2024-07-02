import React, { useState, useEffect } from 'react';

const PomodoroTimer: React.FC = () => {
  const [time, setTime] = useState(25 * 60); // 25 minutes in seconds
  const [isActive, setIsActive] = useState(false);
  const [isBreak, setIsBreak] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isActive) {
      interval = setInterval(() => {
        setTime((prevTime) => {
          if (prevTime === 1) {
            clearInterval(interval!);
            setIsActive(false);
            setIsBreak(prevIsBreak => {
              const newIsBreak = !prevIsBreak;
              setTime(newIsBreak ? 5 * 60 : 25 * 60);
              return newIsBreak;
            });
            return prevTime; // Avoid changing time here due to state update above
          }
          return prevTime - 1;
        });
      }, 1000);
    } else {
      if (interval) clearInterval(interval);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive]);

  const handleStartPause = () => {
    setIsActive(!isActive);
  };

  const handleReset = () => {
    setIsActive(false);
    setIsBreak(false);
    setTime(25 * 60);
  };

  return (
    <div>
      <h1>{isBreak ? 'Break Time' : 'Work Time'}</h1>
      <div>
        <span>{Math.floor(time / 60)}:{time % 60 < 10 ? '0' : ''}{time % 60}</span>
      </div>
      <button onClick={handleStartPause}>{isActive ? 'Pause' : 'Start'}</button>
      <button onClick={handleReset}>Reset</button>
    </div>
  );
};

export default PomodoroTimer;
