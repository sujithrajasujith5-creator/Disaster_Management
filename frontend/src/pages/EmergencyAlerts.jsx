import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import LoadingSpinner from '../components/LoadingSpinner';
import { notificationAPI } from '../services/services';
import { formatDate } from '../utils/helpers';
import toast from 'react-hot-toast';
import { FiAlertOctagon, FiSend } from 'react-icons/fi';
import { SeverityBadge } from '../components/StatusBadge';

const EmergencyAlerts = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [form, setForm] = useState({
    title: '',
    message: '',
    priority: 'Critical',
  });

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const { data } = await notificationAPI.getHistory();
        setHistory(data.data);
      } catch {
        /* handled */
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!window.confirm('Send emergency alert to ALL users?')) return;
    setSending(true);
    try {
      await notificationAPI.sendEmergency(form);
      toast.success('Emergency alert sent to all users!');
      setForm({ title: '', message: '', priority: 'Critical' });
      const { data } = await notificationAPI.getHistory();
      setHistory(data.data);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send alert');
    } finally {
      setSending(false);
    }
  };

  if (loading) return <Layout><LoadingSpinner fullScreen /></Layout>;

  return (
    <Layout>
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="flex items-center gap-3">
          <FiAlertOctagon className="text-red-500" size={28} />
          <div>
            <h1 className="text-2xl font-bold">Emergency Alerts</h1>
            <p className="text-gray-500 dark:text-gray-400">
              Broadcast urgent alerts to all campus users
            </p>
          </div>
        </div>

        <form onSubmit={handleSend} className="card space-y-4 border-2 border-red-200 dark:border-red-800">
          <div className="bg-red-50 dark:bg-red-900/20 p-3 rounded-lg text-sm text-red-700 dark:text-red-400">
            Warning: This will send an immediate notification to all registered users.
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Alert Title *</label>
            <input
              className="input-field"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              required
              placeholder="e.g., Campus Evacuation Required"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Message *</label>
            <textarea
              className="input-field min-h-[100px]"
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              required
              placeholder="Detailed emergency instructions..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Priority</label>
            <select
              className="input-field"
              value={form.priority}
              onChange={(e) => setForm({ ...form, priority: e.target.value })}
            >
              <option value="Critical">Critical</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
            </select>
          </div>
          <button type="submit" className="btn-danger w-full flex items-center justify-center gap-2" disabled={sending}>
            <FiSend />
            {sending ? 'Sending...' : 'Send Emergency Alert'}
          </button>
        </form>

        <div>
          <h2 className="text-lg font-semibold mb-4">Alert History</h2>
          {history.length ? (
            <div className="space-y-3">
              {history.map((alert) => (
                <div key={alert._id} className="card">
                  <div className="flex justify-between items-start gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <SeverityBadge severity={alert.priority} />
                        <span className="text-xs text-gray-500">{formatDate(alert.createdAt)}</span>
                      </div>
                      <h3 className="font-semibold">{alert.title}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{alert.message}</p>
                      <p className="text-xs text-gray-500 mt-2">
                        Sent by: {alert.sender?.name || 'System'} • {alert.recipients?.length || 0} recipients
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="card text-center text-gray-500 py-8">No alerts sent yet</div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default EmergencyAlerts;
