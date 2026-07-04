import Layout from '../components/Layout';
import { useState, useEffect } from 'react';
import { incidentAPI } from '../services/services';
import StatCard from '../components/StatCard';
import ReportCard from '../components/ReportCard';
import LoadingSpinner from '../components/LoadingSpinner';
import DashboardBackground from '../components/DashboardBackground';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiPlusCircle, FiAlertTriangle } from 'react-icons/fi';
import { StatusBadge } from '../components/StatusBadge';
import { formatDate } from '../utils/helpers';

const Dashboard = () => {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const { data: res } = await incidentAPI.getDashboard();
        setData(res.data);
      } catch {
        /* handled by interceptor */
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (loading) return <Layout><LoadingSpinner fullScreen /></Layout>;

  const { stats, activeIncidents, recentReports, helpRequests } = data || {};

  return (
    <Layout>
      <div className="relative overflow-hidden">
        <DashboardBackground />
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: { opacity: 1, transition: { staggerChildren: 0.12, when: 'beforeChildren' } },
          }}
          className="space-y-6 relative"
        >
          <motion.div
            variants={{
              hidden: { opacity: 0, y: 18 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: 'easeOut' } },
            }}
            className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
          >
            <div>
              <motion.h1
                variants={{
                  hidden: { opacity: 0, x: -24 },
                  visible: { opacity: 1, x: 0, transition: { duration: 0.55, ease: 'easeOut' } },
                }}
                className="text-2xl font-bold overflow-hidden"
              >
                Dashboard
              </motion.h1>
              <motion.p
                variants={{
                  hidden: { opacity: 0, x: -18 },
                  visible: { opacity: 1, x: 0, transition: { delay: 0.15, duration: 0.55, ease: 'easeOut' } },
                }}
                className="text-gray-500 dark:text-gray-400"
              >
                Welcome back,{' '}
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3, duration: 0.8, ease: 'easeOut' }}
                  className="inline-block"
                >
                  {user?.name}
                </motion.span>
              </motion.p>
            </div>
            {user?.role !== 'admin' && (
              <motion.div
                variants={{
                  hidden: { opacity: 0, y: 18 },
                  visible: { opacity: 1, y: 0, transition: { delay: 0.3, duration: 0.55, ease: 'easeOut' } },
                }}
              >
                <Link to="/reports/new" className="btn-primary flex items-center gap-2 relative overflow-hidden group">
                  <span className="animate-breathing-glow absolute inset-0 rounded-2xl opacity-40 bg-gradient-to-r from-cyan-400/20 via-sky-400/10 to-blue-400/15 blur-xl" />
                  <span className="relative z-10 flex items-center gap-2">
                    <FiPlusCircle className="transition-transform duration-500 group-hover:translate-x-0.5 group-hover:rotate-2" />
                    <span className="transition-transform duration-300 group-hover:translate-x-1">Report Incident</span>
                  </span>
                </Link>
              </motion.div>
            )}
          </motion.div>

          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
            initial="hidden"
            animate="visible"
            variants={{
              hidden: {},
              visible: { transition: { staggerChildren: 0.15 } },
            }}
          >
            <StatCard title="Total Reports" value={stats?.total || 0} type="total" />
            <StatCard title="Pending" value={stats?.pending || 0} type="pending" />
            <StatCard title="Resolved" value={stats?.resolved || 0} type="resolved" />
            <StatCard title="Critical Active" value={stats?.critical || 0} type="critical" />
          </motion.div>
        </motion.div>

        {activeIncidents?.length > 0 && (
          <section>
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <FiAlertTriangle className="text-orange-500" />
              Active Incidents
            </h2>
            <div className="grid gap-4">
              {activeIncidents.slice(0, 5).map((report) => (
                <ReportCard key={report._id} report={report} showReporter={user?.role === 'admin'} />
              ))}
            </div>
          </section>
        )}

        {helpRequests?.length > 0 && (
          <section>
            <h2 className="text-lg font-semibold mb-4">Help Requests</h2>
            <div className="card overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <th className="text-left py-2 px-3">Incident</th>
                    <th className="text-left py-2 px-3">Urgency</th>
                    <th className="text-left py-2 px-3">Status</th>
                    <th className="text-left py-2 px-3">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {helpRequests.map((hr) => (
                    <tr key={hr._id} className="border-b border-gray-100 dark:border-gray-700/50">
                      <td className="py-2 px-3">{hr.incidentReport?.title || 'N/A'}</td>
                      <td className="py-2 px-3"><StatusBadge status={hr.urgency} /></td>
                      <td className="py-2 px-3"><StatusBadge status={hr.status} /></td>
                      <td className="py-2 px-3">{formatDate(hr.createdAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        <section>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Recent Reports</h2>
            <Link to={user?.role === 'admin' ? '/admin/reports' : '/reports'} className="text-primary-600 text-sm hover:underline">
              View all
            </Link>
          </div>
          <div className="grid gap-4">
            {recentReports?.length ? (
              recentReports.map((report) => (
                <ReportCard key={report._id} report={report} showReporter={user?.role === 'admin'} />
              ))
            ) : (
              <div className="card text-center text-gray-500 py-8">No reports yet</div>
            )}
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default Dashboard;
