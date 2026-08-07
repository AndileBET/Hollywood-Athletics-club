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
        <h2>Build <span className="headline-highlight yellow">momentum</span> every week</h2>
        <p>Review your running journey across distance, pace, elevation, duration, and club reward progress in a cleaner performance view.</p>
      </section>

      <section className="charts-grid">
        <ChartCard title="Monthly Distance" subtitle="Kilometres">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={monthlyDistanceData} margin={chartMargin}>
              <defs>
                <linearGradient id="distanceFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#FFDE17" stopOpacity={0.55} />
                  <stop offset="95%" stopColor="#FFDE17" stopOpacity={0.04} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="#E6DFF0" vertical={false} />
              <XAxis dataKey="month" stroke="#5C2D91" tickLine={false} axisLine={false} />
              <YAxis stroke="#5C2D91" tickLine={false} axisLine={false} />
              <Tooltip contentStyle={{ background: '#FFFFFF', border: '1px solid #E6DFF0', color: '#000000', borderRadius: '16px' }} />
              <Area type="monotone" dataKey="distance" stroke="#5C2D91" fill="url(#distanceFill)" strokeWidth={3} />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Pace Trend" subtitle="Minutes per km">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={paceTrendData} margin={chartMargin}>
              <CartesianGrid stroke="#E6DFF0" vertical={false} />
              <XAxis dataKey="week" stroke="#5C2D91" tickLine={false} axisLine={false} />
              <YAxis stroke="#5C2D91" tickLine={false} axisLine={false} domain={[4.8, 5.6]} />
              <Tooltip contentStyle={{ background: '#FFFFFF', border: '1px solid #E6DFF0', color: '#000000', borderRadius: '16px' }} />
              <Line type="monotone" dataKey="pace" stroke="#5C2D91" strokeWidth={3} dot={{ fill: '#FFDE17', strokeWidth: 0 }} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Activity Count" subtitle="Runs per month">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={activityCountData} margin={chartMargin}>
              <CartesianGrid stroke="#E6DFF0" vertical={false} />
              <XAxis dataKey="month" stroke="#5C2D91" tickLine={false} axisLine={false} />
              <YAxis stroke="#5C2D91" tickLine={false} axisLine={false} />
              <Tooltip contentStyle={{ background: '#FFFFFF', border: '1px solid #E6DFF0', color: '#000000', borderRadius: '16px' }} />
              <Bar dataKey="count" fill="#5C2D91" radius={[8, 8, 0, 0]} />
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
      
      <h2>{title}</h2>
      <p>{message}</p>
    </section>
  );
}
