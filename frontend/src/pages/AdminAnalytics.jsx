import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import LoadingSpinner from '../components/LoadingSpinner';
import StatCard from '../components/StatCard';
import { incidentAPI } from '../services/services';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar, Doughnut, Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

const AdminAnalytics = () => {
  const [dashboard, setDashboard] = useState(null);
  const [statistics, setStatistics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [dashRes, statsRes] = await Promise.all([
          incidentAPI.getDashboard(),
          incidentAPI.getStatistics(),
        ]);
        setDashboard(dashRes.data.data);
        setStatistics(statsRes.data.data);
      } catch {
        /* handled */
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <Layout><LoadingSpinner fullScreen /></Layout>;

  const { stats, byType, byStatus } = dashboard || {};

  const typeChartData = {
    labels: byType?.map((t) => t._id) || [],
    datasets: [{
      label: 'Incidents by Type',
      data: byType?.map((t) => t.count) || [],
      backgroundColor: ['#ef4444', '#3b82f6', '#f59e0b', '#10b981', '#8b5cf6', '#6b7280'],
    }],
  };

  const statusChartData = {
    labels: byStatus?.map((s) => s._id) || [],
    datasets: [{
      label: 'Reports by Status',
      data: byStatus?.map((s) => s.count) || [],
      backgroundColor: ['#3b82f6', '#8b5cf6', '#f59e0b', '#10b981'],
    }],
  };

  const trendChartData = {
    labels: statistics?.monthlyTrend?.map((m) => m._id) || [],
    datasets: [{
      label: 'Monthly Incidents',
      data: statistics?.monthlyTrend?.map((m) => m.count) || [],
      borderColor: '#3b82f6',
      backgroundColor: 'rgba(59, 130, 246, 0.1)',
      tension: 0.3,
      fill: true,
    }],
  };

  const severityChartData = {
    labels: statistics?.severityBreakdown?.map((s) => s._id) || [],
    datasets: [{
      data: statistics?.severityBreakdown?.map((s) => s.count) || [],
      backgroundColor: ['#10b981', '#f59e0b', '#f97316', '#ef4444'],
    }],
  };

  const chartOptions = {
    responsive: true,
    plugins: { legend: { position: 'bottom' } },
    maintainAspectRatio: false,
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Analytics & Statistics</h1>
          <p className="text-gray-500 dark:text-gray-400">
            Average resolution time: {statistics?.avgResolutionDays || 0} days
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard title="Total Reports" value={stats?.total || 0} type="total" />
          <StatCard title="Pending" value={stats?.pending || 0} type="pending" />
          <StatCard title="Resolved" value={stats?.resolved || 0} type="resolved" />
          <StatCard title="Critical Active" value={stats?.critical || 0} type="critical" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="card">
            <h2 className="font-semibold mb-4">Incidents by Type</h2>
            <div className="h-64">
              <Bar data={typeChartData} options={chartOptions} />
            </div>
          </div>
          <div className="card">
            <h2 className="font-semibold mb-4">Reports by Status</h2>
            <div className="h-64">
              <Doughnut data={statusChartData} options={chartOptions} />
            </div>
          </div>
          <div className="card">
            <h2 className="font-semibold mb-4">Monthly Trend</h2>
            <div className="h-64">
              <Line data={trendChartData} options={chartOptions} />
            </div>
          </div>
          <div className="card">
            <h2 className="font-semibold mb-4">Severity Breakdown</h2>
            <div className="h-64">
              <Doughnut data={severityChartData} options={chartOptions} />
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AdminAnalytics;
