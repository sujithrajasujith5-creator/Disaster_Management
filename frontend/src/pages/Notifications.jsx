import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import LoadingSpinner from '../components/LoadingSpinner';
import { notificationAPI } from '../services/services';
import { formatDate } from '../utils/helpers';
import toast from 'react-hot-toast';
import { FiBell, FiCheck, FiAlertTriangle } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { SeverityBadge } from '../components/StatusBadge';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = async () => {
    try {
      const { data } = await notificationAPI.getAll();
      setNotifications(data.data);
    } catch {
      /* handled */
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleMarkRead = async (id) => {
    try {
      await notificationAPI.markAsRead(id);
      setNotifications(
        notifications.map((n) => (n._id === id ? { ...n, isRead: true } : n))
      );
    } catch {
      toast.error('Failed to mark as read');
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await notificationAPI.markAllAsRead();
      setNotifications(notifications.map((n) => ({ ...n, isRead: true })));
      toast.success('All notifications marked as read');
    } catch {
      toast.error('Failed to mark all as read');
    }
  };

  const typeIcons = {
    emergency: FiAlertTriangle,
    status_update: FiBell,
    assignment: FiBell,
    general: FiBell,
  };

  if (loading) return <Layout><LoadingSpinner fullScreen /></Layout>;

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <Layout>
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Notifications</h1>
            <p className="text-gray-500 dark:text-gray-400">
              {unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}
            </p>
          </div>
          {unreadCount > 0 && (
            <button onClick={handleMarkAllRead} className="btn-secondary flex items-center gap-1 text-sm">
              <FiCheck size={16} /> Mark all read
            </button>
          )}
        </div>

        {notifications.length ? (
          <div className="space-y-3">
            {notifications.map((n) => {
              const Icon = typeIcons[n.type] || FiBell;
              return (
                <div
                  key={n._id}
                  className={`card flex gap-4 ${!n.isRead ? 'border-l-4 border-l-primary-500' : ''} ${n.type === 'emergency' ? 'border-red-200 dark:border-red-800 bg-red-50/50 dark:bg-red-900/10' : ''}`}
                >
                  <div className={`p-2 rounded-lg h-fit ${n.type === 'emergency' ? 'bg-red-100 dark:bg-red-900/30 text-red-600' : 'bg-primary-100 dark:bg-primary-900/30 text-primary-600'}`}>
                    <Icon size={20} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <h3 className="font-semibold">{n.title}</h3>
                      <SeverityBadge severity={n.priority} />
                      {!n.isRead && (
                        <span className="badge bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400">
                          New
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{n.message}</p>
                    <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                      <span>{formatDate(n.createdAt)}</span>
                      {n.relatedIncident && (
                        <Link
                          to={`/reports/${n.relatedIncident._id}`}
                          className="text-primary-600 hover:underline"
                        >
                          View Report
                        </Link>
                      )}
                    </div>
                  </div>
                  {!n.isRead && (
                    <button
                      onClick={() => handleMarkRead(n._id)}
                      className="text-primary-600 hover:text-primary-700 p-1"
                      title="Mark as read"
                    >
                      <FiCheck size={18} />
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="card text-center py-12">
            <FiBell className="mx-auto text-gray-400 mb-3" size={40} />
            <p className="text-gray-500">No notifications yet</p>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Notifications;
