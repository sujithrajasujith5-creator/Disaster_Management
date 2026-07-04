import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import LoadingSpinner from '../components/LoadingSpinner';
import { incidentAPI } from '../services/services';
import { FiFileText, FiBarChart2, FiAlertOctagon, FiShield } from 'react-icons/fi';

const AdminPage = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const { data: res } = await incidentAPI.getDashboard();
        setData(res.data);
      } catch {
        /* handled elsewhere */
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading) return <Layout><LoadingSpinner fullScreen /></Layout>;

  const stats = data?.stats || {};

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between gap-4 items-start">
          <div>
            <h1 className="text-3xl font-bold">Admin Panel</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-2">
              Manage incident reports, assign admins, and update issue status from one central page.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full sm:w-auto">
            <Link to="/admin/reports" className="btn-primary text-center py-3">
              <FiFileText size={18} />
              <span>Manage Reports</span>
            </Link>
            <Link to="/admin/analytics" className="btn-secondary text-center py-3">
              <FiBarChart2 size={18} />
              <span>Analytics</span>
            </Link>
            <Link to="/admin/alerts" className="btn-secondary text-center py-3">
              <FiAlertOctagon size={18} />
              <span>Emergency Alerts</span>
            </Link>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-4">
          <div className="card p-5">
            <p className="text-sm text-gray-500">Total Reports</p>
            <p className="text-3xl font-semibold mt-3">{stats.total || 0}</p>
          </div>
          <div className="card p-5">
            <p className="text-sm text-gray-500">Pending</p>
            <p className="text-3xl font-semibold mt-3">{stats.pending || 0}</p>
          </div>
          <div className="card p-5">
            <p className="text-sm text-gray-500">Resolved</p>
            <p className="text-3xl font-semibold mt-3">{stats.resolved || 0}</p>
          </div>
          <div className="card p-5">
            <p className="text-sm text-gray-500">Critical Active</p>
            <p className="text-3xl font-semibold mt-3">{stats.critical || 0}</p>
          </div>
        </div>

        <div className="card p-5">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm text-gray-500">Admin actions</p>
              <h2 className="text-xl font-semibold mt-2">Issue workflow</h2>
            </div>
            <FiShield size={28} className="text-primary-600" />
          </div>
          <div className="mt-4 grid gap-4 sm:grid-cols-3">
            <div className="rounded-xl border border-gray-200 dark:border-gray-700 p-4">
              <p className="text-sm font-medium text-gray-700 dark:text-gray-200">Review reports</p>
              <p className="text-sm text-gray-500 mt-2">Open the report queue and review incoming issues from users.</p>
            </div>
            <div className="rounded-xl border border-gray-200 dark:border-gray-700 p-4">
              <p className="text-sm font-medium text-gray-700 dark:text-gray-200">Assign admins</p>
              <p className="text-sm text-gray-500 mt-2">Choose a responsible admin and track progress through status updates.</p>
            </div>
            <div className="rounded-xl border border-gray-200 dark:border-gray-700 p-4">
              <p className="text-sm font-medium text-gray-700 dark:text-gray-200">Update status</p>
              <p className="text-sm text-gray-500 mt-2">Move issues to Under Review, In Progress, or Resolved once handled.</p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AdminPage;
