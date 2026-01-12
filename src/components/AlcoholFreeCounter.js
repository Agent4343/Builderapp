import React, { useState, useEffect } from 'react';
import './AlcoholFreeCounter.css';

const AlcoholFreeCounter = () => {
  // Start date: yesterday at 9:15 PM Nova Scotia time (Atlantic Time)
  const [startDate] = useState(() => {
    const saved = localStorage.getItem('lastWithJulieDate');
    if (saved) {
      return new Date(saved);
    }
    // Create date in Nova Scotia timezone (America/Halifax)
    const now = new Date();
    const novaScotiaTime = new Date(now.toLocaleString('en-US', { timeZone: 'America/Halifax' }));
    novaScotiaTime.setDate(novaScotiaTime.getDate() - 1); // Yesterday
    novaScotiaTime.setHours(21, 15, 0, 0); // 9:15 PM
    localStorage.setItem('lastWithJulieDate', novaScotiaTime.toISOString());
    return novaScotiaTime;
  });

  const [days, setDays] = useState(1);
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    const updateCounter = () => {
      const now = new Date();

      // Calculate total time since start
      const diff = now - startDate;
      const totalSeconds = Math.floor(diff / 1000);
      const totalMinutes = Math.floor(totalSeconds / 60);
      const totalHours = Math.floor(totalMinutes / 60);
      const totalDays = Math.floor(totalHours / 24);

      setDays(totalDays);
      setHours(totalHours % 24);
      setMinutes(totalMinutes % 60);
      setSeconds(totalSeconds % 60);
    };

    updateCounter();
    const interval = setInterval(updateCounter, 1000);
    return () => clearInterval(interval);
  }, [startDate]);

  const getMilestone = (days) => {
    if (days >= 365) return { text: 'A WHOLE YEAR?! GO SEE HER!', emoji: '😱', color: '#ff5555' };
    if (days >= 180) return { text: 'HALF A YEAR... SERIOUSLY?!', emoji: '🫠', color: '#ff79c6' };
    if (days >= 100) return { text: '100 DAYS OF MISSING JULIE!', emoji: '😭', color: '#ffb86c' };
    if (days >= 30) return { text: 'A MONTH WITHOUT JULIE?!', emoji: '🥺', color: '#f1fa8c' };
    if (days >= 14) return { text: 'TWO WEEKS IS TOO LONG!', emoji: '😩', color: '#8be9fd' };
    if (days >= 7) return { text: 'ONE WEEK ALREADY?!', emoji: '😢', color: '#bd93f9' };
    if (days >= 3) return { text: 'MISSING HER YET?', emoji: '🥹', color: '#50fa7b' };
    if (days >= 1) return { text: 'THE COUNTDOWN BEGINS!', emoji: '💕', color: '#ff79c6' };
    return { text: 'JUST LEFT JULIE!', emoji: '👋', color: '#50fa7b' };
  };

  const milestone = getMilestone(days);

  const getFunnyQuote = () => {
    const quotes = [
      "Julie is probably wondering where you are...",
      "Somewhere, Julie just sneezed. She's thinking of you!",
      "Time flies when you're NOT with Julie... wait, no it doesn't.",
      "Ashley withdrawal symptoms may include: missing Julie.",
      "Pro tip: Call Julie. She's awesome.",
      "This timer judges you. Go see Julie!",
      "Fun fact: Julie misses you more. Probably.",
      "Distance makes the heart grow fonder... GO VISIT!",
      "Every second without Julie is a second too long.",
      "Julie > Everything else. Just saying.",
      "Breaking news: Ashley still not with Julie!",
      "Plot twist: You could be with Julie right now.",
    ];
    const totalSeconds = days * 86400 + hours * 3600 + minutes * 60 + seconds;
    return quotes[Math.floor(totalSeconds / 10) % quotes.length];
  };

  // Calculate progress to next milestone
  const getNextMilestone = () => {
    const milestones = [1, 3, 7, 14, 30, 100, 180, 365];
    for (let m of milestones) {
      if (days < m) return m;
    }
    return days + (365 - (days % 365));
  };

  const nextMilestone = getNextMilestone();
  const prevMilestone = [0, 1, 3, 7, 14, 30, 100, 180, 365].reverse().find(m => m <= days) || 0;
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
          <span className="badge">MISSING JULIE TIMER</span>
          <h1 className="title">Ashley's Countdown</h1>
        </div>

        <div className="main-counter">
          <div className="days-display">
            <span className="days-number">{days.toLocaleString()}</span>
            <span className="days-label">DAYS SINCE SEEING JULIE</span>
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
            <span>Loneliness level: {nextMilestone} days</span>
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
          <p className="quote">"{getFunnyQuote()}"</p>
        </div>

        <div className="stats-grid">
          <div className="stat-item">
            <span className="stat-value">{Math.floor(days / 7)}</span>
            <span className="stat-label">Sad Weeks</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">{(days * 24 + hours).toLocaleString()}</span>
            <span className="stat-label">Lonely Hours</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">{(days * 3).toLocaleString()}</span>
            <span className="stat-label">Missed Hugs</span>
          </div>
        </div>

        <div className="footer-message">
          <span className="pulse-dot"></span>
          <span>Time without Julie is ticking...</span>
        </div>
      </div>
    </div>
  );
};

export default AlcoholFreeCounter;
