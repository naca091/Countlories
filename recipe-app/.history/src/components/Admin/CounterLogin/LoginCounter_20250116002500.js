import React, { useState, useEffect } from 'react';
import axios from 'axios';

const LoginCounter = () => {
  const [stats, setStats] = useState({ loginCount: 0, totalUsers: 1 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get('/api/stats/login-count');
        setStats(response.data.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load statistics');
        setLoading(false);
      }
    };

    fetchStats();
    // Cập nhật mỗi 5 phút
    const interval = setInterval(fetchStats, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  if (loading) return <div className="flex items-center justify-center">Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  const percentage = (stats.loginCount / stats.totalUsers) * 100;
  const circumference = 2 * Math.PI * 45; // r=45
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="flex flex-col items-center justify-center p-8">
      <h2 className="text-2xl font-bold mb-4">Daily Login Statistics</h2>
      <div className="relative w-48 h-48">
        {/* Background circle */}
        <svg className="transform -rotate-90 w-48 h-48">
          <circle
            cx="96"
            cy="96"
            r="45"
            stroke="#eee"
            strokeWidth="10"
            fill="transparent"
            className="absolute"
          />
          {/* Progress circle */}
          <circle
            cx="96"
            cy="96"
            r="45"
            stroke="#3b82f6"
            strokeWidth="10"
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            className="transition-all duration-500"
          />
        </svg>
        {/* Text in center */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="text-3xl font-bold">{stats.loginCount}</div>
          <div className="text-gray-500">of</div>
          <div className="text-xl">{stats.totalUsers}</div>
        </div>
      </div>
      <div className="mt-4 text-center">
        <p className="text-lg">{percentage.toFixed(1)}% users logged in today</p>
      </div>
    </div>
  );
};

export default LoginCounter;