import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { useEffect, useState } from 'react';
import ActivityRow from '../components/ActivityRow.jsx';
import ChartCard from '../components/ChartCard.jsx';
import { getPerformanceData } from '../api/client.js';

const chartMargin = { top: 12, right: 12, bottom: 0, left: -18 };

export default function Performance() {
  const [performanceData, setPerformanceData] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    let isMounted = true;

    getPerformanceData()
      .then((data) => {
        if (isMounted) {
          setPerformanceData(data);
        }
      })
      .catch((error) => {
        if (isMounted) {
          setErrorMessage(error.message);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  if (errorMessage) {
    return <BackendState title="Performance unavailable" message={errorMessage} />;
  }

  if (!performanceData) {
    return <BackendState title="Loading performance" message="Loading data..." />;
  }

  const { activities, activityCountData, monthlyDistanceData, paceTrendData } = performanceData;

  return (
    <div className="page-stack">
      <section className="page-header">
        <p className="eyebrow">Performance Centre</p>
        <h2>Training trends and activity history</h2>
        <p>Review club-ready metrics across distance, pace, elevation, duration, and rewards points.</p>
      </section>

      <section className="charts-grid">
        <ChartCard title="Monthly Distance" subtitle="Kilometres">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={monthlyDistanceData} margin={chartMargin}>
              <defs>
                <linearGradient id="distanceFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f9c80e" stopOpacity={0.45} />
                  <stop offset="95%" stopColor="#f9c80e" stopOpacity={0.04} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="#302a3c" vertical={false} />
              <XAxis dataKey="month" stroke="#a8a2b4" tickLine={false} axisLine={false} />
              <YAxis stroke="#a8a2b4" tickLine={false} axisLine={false} />
              <Tooltip contentStyle={{ background: '#111014', border: '1px solid #3b3348', color: '#fff' }} />
              <Area type="monotone" dataKey="distance" stroke="#f9c80e" fill="url(#distanceFill)" strokeWidth={3} />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Pace Trend" subtitle="Minutes per km">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={paceTrendData} margin={chartMargin}>
              <CartesianGrid stroke="#302a3c" vertical={false} />
              <XAxis dataKey="week" stroke="#a8a2b4" tickLine={false} axisLine={false} />
              <YAxis stroke="#a8a2b4" tickLine={false} axisLine={false} domain={[4.8, 5.6]} />
              <Tooltip contentStyle={{ background: '#111014', border: '1px solid #3b3348', color: '#fff' }} />
              <Line type="monotone" dataKey="pace" stroke="#ffffff" strokeWidth={3} dot={{ fill: '#f9c80e', strokeWidth: 0 }} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Activity Count" subtitle="Runs per month">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={activityCountData} margin={chartMargin}>
              <CartesianGrid stroke="#302a3c" vertical={false} />
              <XAxis dataKey="month" stroke="#a8a2b4" tickLine={false} axisLine={false} />
              <YAxis stroke="#a8a2b4" tickLine={false} axisLine={false} />
              <Tooltip contentStyle={{ background: '#111014', border: '1px solid #3b3348', color: '#fff' }} />
              <Bar dataKey="count" fill="#7f3cff" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </section>

      <section className="panel">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Complete Log</p>
            <h2>Activities</h2>
          </div>
        </div>
        <div className="activity-list full-log">
          {activities.map((activity) => (
            <ActivityRow activity={activity} key={activity.id} />
          ))}
        </div>
      </section>
    </div>
  );
}

function BackendState({ title, message }) {
  return (
    <section className="panel">
      <p className="eyebrow">Backend</p>
      <h2>{title}</h2>
      <p>{message}</p>
    </section>
  );
}
