import { Area, AreaChart, Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { useEffect, useState } from 'react';
import ActivityRow from '../components/ActivityRow.jsx';
import ChartCard from '../components/ChartCard.jsx';
import { getPerformanceData } from '../api/client.js';
import Pagination from '../components/Pagination.jsx';

const chartMargin = { top: 12, right: 12, bottom: 0, left: -18 };

function ChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  const item = payload[0];
  const value = Number(item.value || 0);
  function ChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;

  const item = payload[0];
  const value = Number(item.value || 0);

  return (
    <div className="chart-tooltip">
      <strong>{label}</strong>

      {item.dataKey === 'distance' ? (
        <span className="distance-with-star">
          Distance: {value.toFixed(1)}
          <img src="/images/branding/stars.png" alt="" className="km-star-icon" />
        </span>
      ) : (
        <span>Total Minutes: {Math.round(value)}</span>
      )}
    </div>
  );
}
  return <div className="chart-tooltip"><strong>{label}</strong><span>{name}</span></div>;
}

export default function Performance() {
  const [performanceData, setPerformanceData] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [page, setPage] = useState(1);

  useEffect(() => {
    let mounted = true;
    getPerformanceData()
      .then((data) => mounted && setPerformanceData(data))
      .catch((error) => mounted && setErrorMessage(error.message));
    return () => { mounted = false; };
  }, []);

  if (errorMessage) return <BackendState title="Performance unavailable" message={errorMessage} />;
  if (!performanceData) return <BackendState title="Loading performance" message="Loading activity analytics..." />;

  const { activities, activityCountData, monthlyDistanceData, totalMinutesData } = performanceData;
  const pageSize = 6;
  const totalPages = Math.max(1, Math.ceil(activities.length / pageSize));
  const safePage = Math.min(page, totalPages);
  const visibleActivities = activities.slice((safePage - 1) * pageSize, safePage * pageSize);

  return (
    <div className="page-stack">
      <section className="page-header performance-header-refined">
        <p className="eyebrow performance-title">Performance</p>
        <h2>Build <span className="headline-highlight yellow">momentum</span> every week</h2>
        <p>Review purple stars, total active minutes and activity count with the latest synced data.</p>
      </section>

      <section className="charts-grid performance-charts">
        <ChartCard title="Monthly" subtitle="Purple Stars">
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
              <Tooltip content={<ChartTooltip />} />
              <Area type="monotone" dataKey="distance" stroke="#5C2D91" fill="url(#distanceFill)" strokeWidth={3} />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Total Minutes" subtitle="Active minutes per month">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={totalMinutesData} margin={chartMargin}>
              <CartesianGrid stroke="#E6DFF0" vertical={false} />
              <XAxis dataKey="month" stroke="#5C2D91" tickLine={false} axisLine={false} />
              <YAxis stroke="#5C2D91" tickLine={false} axisLine={false} />
              <Tooltip content={<ChartTooltip />} />
              <Area type="monotone" dataKey="minutes" stroke="#5C2D91" fill="#F1EAF8" strokeWidth={3} />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Activity Count" subtitle="Activities per month">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={activityCountData} margin={chartMargin}>
              <CartesianGrid stroke="#E6DFF0" vertical={false} />
              <XAxis dataKey="month" stroke="#5C2D91" tickLine={false} axisLine={false} />
              <YAxis stroke="#5C2D91" tickLine={false} axisLine={false} allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="count" fill="#5C2D91" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </section>

      <section className="panel">
        <div className="section-heading">
          <div><p className="eyebrow">Complete Log</p><h2>Activities</h2></div>
        </div>
        <div className="activity-list full-log">
          {visibleActivities.map((activity) => <ActivityRow activity={activity} key={activity.id} />)}
        </div>
        <Pagination currentPage={safePage} totalPages={totalPages} onChange={setPage} />
      </section>
    </div>
  );
}

function BackendState({ title, message }) {
  return <section className="panel"><h2>{title}</h2><p>{message}</p></section>;
}
