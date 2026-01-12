import React, { useState, useEffect } from 'react';
import './AlcoholFreeCounter.css';

const AlcoholFreeCounter = () => {
  // Start date: yesterday at 9:15 PM Nova Scotia time (Atlantic Time)
  const [startDate] = useState(() => {
    const saved = localStorage.getItem('julieAvoidingAshley');
    if (saved) {
      return new Date(saved);
    }
    // Create date in Nova Scotia timezone (America/Halifax)
    const now = new Date();
    const novaScotiaTime = new Date(now.toLocaleString('en-US', { timeZone: 'America/Halifax' }));
    novaScotiaTime.setDate(novaScotiaTime.getDate() - 1); // Yesterday
    novaScotiaTime.setHours(21, 15, 0, 0); // 9:15 PM
    localStorage.setItem('julieAvoidingAshley', novaScotiaTime.toISOString());
    return novaScotiaTime;
  });

  const [days, setDays] = useState(1);
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    const updateCounter = () => {
      const now = new Date();

      // Calculate total time since start (9:15 PM yesterday)
      const diff = now - startDate;
      const totalSeconds = Math.floor(diff / 1000);
      const totalMinutes = Math.floor(totalSeconds / 60);
      const totalHours = Math.floor(totalMinutes / 60);

      // Count days - after 24 hours = 1 day
      const totalDays = Math.floor(totalHours / 24);

      // Show remaining hours/minutes/seconds after full days
      setDays(Math.max(1, totalDays)); // Minimum 1 day
      setHours(totalHours % 24);
      setMinutes(totalMinutes % 60);
      setSeconds(totalSeconds % 60);
    };

    updateCounter();
    const interval = setInterval(updateCounter, 1000);
    return () => clearInterval(interval);
  }, [startDate]);

  const getMilestone = (days) => {
    if (days >= 365) return { text: 'A WHOLE YEAR, JULIE?! REALLY?!', emoji: '😱', color: '#ff5555' };
    if (days >= 180) return { text: 'HALF A YEAR! CAPE BRETON ISN\'T THAT FAR!', emoji: '🫠', color: '#ff79c6' };
    if (days >= 100) return { text: '100 DAYS OF AVOIDING ASHLEY!', emoji: '💯', color: '#ffb86c' };
    if (days >= 30) return { text: 'A WHOLE MONTH, JULIE?!', emoji: '📅', color: '#f1fa8c' };
    if (days >= 14) return { text: 'TWO WEEKS! ASHLEY MISSES YOU!', emoji: '😢', color: '#8be9fd' };
    if (days >= 7) return { text: 'ONE WEEK! COME VISIT ALREADY!', emoji: '🥺', color: '#bd93f9' };
    if (days >= 3) return { text: 'STILL HIDING IN CAPE BRETON!', emoji: '🙈', color: '#50fa7b' };
    if (days >= 1) return { text: 'JULIE WENT BACK TO CAPE BRETON!', emoji: '🏃‍♀️', color: '#ff79c6' };
    return { text: 'JULIE JUST LEFT!', emoji: '👋', color: '#50fa7b' };
  };

  const milestone = getMilestone(days);

  const getFunnyQuote = () => {
    const quotes = [
      "Julie is safe in Cape Breton... hiding from Ashley.",
      "Ashley: 'Visit me!' Julie: 'I have... Cape Breton stuff.'",
      "Julie acting like Newfoundland is on another planet.",
      "Breaking news: Julie still hasn't visited Ashley!",
      "Julie's excuses are getting creative at this point.",
      "The Rock is calling, Julie. Answer it.",
      "Somewhere in Cape Breton, Julie is pretending to be busy.",
      "Julie's avoidance skills: legendary.",
      "Ashley is literally right there, Julie.",
      "Cape Breton isn't THAT nice, Julie. Visit Ashley.",
      "Julie treating a visit like it's a quest to Mordor.",
      "Plot twist: Julie could visit anytime. She just won't.",
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
          <span className="badge">CAPE BRETON → NEWFOUNDLAND</span>
          <h1 className="title">Where's Julie?!</h1>
        </div>

        <div className="main-counter">
          <div className="days-display">
            <span className="days-number">{days.toLocaleString()}</span>
            <span className="days-label">DAYS AWAY FROM ASHLEY</span>
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
            <span>Avoidance level: {nextMilestone} days</span>
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
            <span className="stat-label">Weeks Apart</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">{days}</span>
            <span className="stat-label">Visits Skipped</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">{(days * 5).toLocaleString()}</span>
            <span className="stat-label">Excuses Made</span>
          </div>
        </div>

        <div className="footer-message">
          <span className="pulse-dot"></span>
          <span>Julie is still in Cape Breton...</span>
        </div>
      </div>
    </div>
  );
};

export default AlcoholFreeCounter;
