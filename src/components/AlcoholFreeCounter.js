import React, { useState, useEffect } from 'react';
import './AlcoholFreeCounter.css';

const AlcoholFreeCounter = () => {
  // Start date: 150 days ago at midnight
  const [startDate] = useState(() => {
    const saved = localStorage.getItem('alcoholFreeStartDate');
    if (saved) {
      return new Date(saved);
    }
    const start = new Date();
    start.setDate(start.getDate() - 150);
    start.setHours(0, 0, 0, 0); // Set to midnight
    localStorage.setItem('alcoholFreeStartDate', start.toISOString());
    return start;
  });

  const [days, setDays] = useState(150);
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    const updateCounter = () => {
      const now = new Date();

      // Calculate days since start (at midnight)
      const startMidnight = new Date(startDate);
      startMidnight.setHours(0, 0, 0, 0);
      const todayMidnight = new Date(now);
      todayMidnight.setHours(0, 0, 0, 0);
      const daysDiff = Math.floor((todayMidnight - startMidnight) / (1000 * 60 * 60 * 24));

      // Calculate time elapsed today (since midnight)
      const elapsedToday = now - todayMidnight;
      const totalSecondsToday = Math.floor(elapsedToday / 1000);
      const hoursToday = Math.floor(totalSecondsToday / 3600);
      const minutesToday = Math.floor((totalSecondsToday % 3600) / 60);
      const secondsToday = totalSecondsToday % 60;

      setDays(daysDiff);
      setHours(hoursToday);
      setMinutes(minutesToday);
      setSeconds(secondsToday);
    };

    updateCounter();
    const interval = setInterval(updateCounter, 1000);
    return () => clearInterval(interval);
  }, [startDate]);

  const getMilestone = (days) => {
    if (days >= 365) return { text: 'ONE YEAR CHAMPION!', emoji: '👑', color: '#ffd700' };
    if (days >= 180) return { text: 'HALF YEAR HERO!', emoji: '🏆', color: '#c0c0c0' };
    if (days >= 150) return { text: 'INCREDIBLE JOURNEY!', emoji: '⭐', color: '#50fa7b' };
    if (days >= 100) return { text: 'CENTURY CLUB!', emoji: '💯', color: '#ff79c6' };
    if (days >= 30) return { text: 'ONE MONTH STRONG!', emoji: '💪', color: '#8be9fd' };
    if (days >= 7) return { text: 'ONE WEEK WARRIOR!', emoji: '🔥', color: '#ffb86c' };
    return { text: 'EVERY DAY COUNTS!', emoji: '✨', color: '#bd93f9' };
  };

  const milestone = getMilestone(days);

  const getMotivationalQuote = () => {
    const quotes = [
      "Your strength inspires others.",
      "Every sober day is a victory.",
      "You're rewriting your story.",
      "Freedom feels amazing.",
      "Clear mind, full heart.",
      "You're unstoppable.",
      "Celebrate your power.",
      "Living your best life."
    ];
    return quotes[days % quotes.length];
  };

  // Calculate progress to next milestone
  const getNextMilestone = () => {
    const milestones = [7, 30, 100, 150, 180, 365, 500, 1000];
    for (let m of milestones) {
      if (days < m) return m;
    }
    return days + (365 - (days % 365));
  };

  const nextMilestone = getNextMilestone();
  const prevMilestone = [0, 7, 30, 100, 150, 180, 365].reverse().find(m => m <= days) || 0;
  const progress = ((days - prevMilestone) / (nextMilestone - prevMilestone)) * 100;

  return (
    <div className="counter-container">
      {/* Animated background particles */}
      <div className="particles">
        {[...Array(20)].map((_, i) => (
          <div key={i} className="particle" style={{
            '--delay': `${Math.random() * 5}s`,
            '--x': `${Math.random() * 100}%`,
            '--duration': `${10 + Math.random() * 20}s`
          }} />
        ))}
      </div>

      {/* Floating circles decoration */}
      <div className="floating-circles">
        <div className="circle circle-1"></div>
        <div className="circle circle-2"></div>
        <div className="circle circle-3"></div>
      </div>

      <div className="counter-card">
        <div className="glow"></div>

        <div className="header">
          <span className="badge">JULIE'S ALCOHOL FREE</span>
          <h1 className="title">Your Journey</h1>
        </div>

        <div className="main-counter">
          <div className="days-display">
            <span className="days-number">{days.toLocaleString()}</span>
            <span className="days-label">DAYS</span>
          </div>

          <div className="sub-counter">
            <div className="time-block">
              <span className="time-value">{String(hours).padStart(2, '0')}</span>
              <span className="time-label">Hours</span>
            </div>
            <div className="time-separator">:</div>
            <div className="time-block">
              <span className="time-value">{String(minutes).padStart(2, '0')}</span>
              <span className="time-label">Minutes</span>
            </div>
            <div className="time-separator">:</div>
            <div className="time-block">
              <span className="time-value">{String(seconds).padStart(2, '0')}</span>
              <span className="time-label">Seconds</span>
            </div>
          </div>
        </div>

        <div className="milestone-section" style={{ '--milestone-color': milestone.color }}>
          <span className="milestone-emoji">{milestone.emoji}</span>
          <span className="milestone-text">{milestone.text}</span>
        </div>

        <div className="progress-section">
          <div className="progress-header">
            <span>Progress to {nextMilestone} days</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <div className="quote-section">
          <p className="quote">"{getMotivationalQuote()}"</p>
        </div>

        <div className="stats-grid">
          <div className="stat-item">
            <span className="stat-value">{Math.floor(days / 7)}</span>
            <span className="stat-label">Weeks</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">{Math.floor(days / 30)}</span>
            <span className="stat-label">Months</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">{(days * 24).toLocaleString()}</span>
            <span className="stat-label">Hours</span>
          </div>
        </div>

        <div className="footer-message">
          <span className="pulse-dot"></span>
          <span>Counter is live and counting</span>
        </div>
      </div>
    </div>
  );
};

export default AlcoholFreeCounter;
