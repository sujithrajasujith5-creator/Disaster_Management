import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Layout from '../components/Layout';
import LoadingSpinner from '../components/LoadingSpinner';
import { incidentAPI, authAPI } from '../services/services';
import { useAuth } from '../context/AuthContext';
import { formatDate, reportStatuses } from '../utils/helpers';
import toast from 'react-hot-toast';
import { FiArrowLeft, FiClock, FiUser } from 'react-icons/fi';

const AdminResolve = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [report, setReport] = useState(null);
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ status: '', adminNotes: '', assignedTo: '' });

  useEffect(() => {
    const loadReport = async () => {
      try {
        const [reportRes, adminsRes] = await Promise.all([
          incidentAPI.getById(id),
          authAPI.getAdmins(),
        ]);

        const reportData = reportRes.data.data;
        setReport(reportData);
        setForm({
          status: reportData.status || 'Submitted',
          adminNotes: reportData.adminNotes || '',
          assignedTo: reportData.assignedTo?._id || '',
        });
        setAdmins(adminsRes.data.data);
      } catch (err) {
        toast.error(err.response?.data?.message || 'Failed to load report');
        navigate('/admin/reports');
      } finally {
        setLoading(false);
      }
    };

    loadReport();
  }, [id, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const { data } = await incidentAPI.updateStatus(id, form);
      setReport(data.data);
      toast.success('Issue updated successfully');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update issue');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <Layout><LoadingSpinner fullScreen /></Layout>;

  return (
    <Layout>
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
          <div>
            <h1 className="text-2xl font-bold">Resolve Issue</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">Review and update the selected report.</p>
          </div>
          <Link to="/admin/reports" className="btn-secondary inline-flex items-center gap-2">
            <FiArrowLeft size={16} /> Back to Reports
          </Link>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.4fr_0.9fr]">
          <div className="card space-y-4">
            <div>
              <p className="text-sm text-gray-500">Report ID: {report._id}</p>
              <h2 className="text-xl font-semibold mt-2">{report.title}</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-600">
              <div>
                <p className="font-medium">Reported By</p>
                <p>{report.reportedBy?.name} ({report.reportedBy?.role})</p>
              </div>
              <div>
                <p className="font-medium">Date</p>
                <p>{formatDate(report.incidentDateTime)}</p>
              </div>
              <div>
                <p className="font-medium">Location</p>
                <p>{report.location}</p>
              </div>
              <div>
                <p className="font-medium">Severity</p>
                <p>{report.severity}</p>
              </div>
            </div>

            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
              <h3 className="font-medium mb-2">Description</h3>
              <p className="whitespace-pre-wrap text-gray-700 dark:text-gray-300">{report.description}</p>
            </div>

            {report.evidence?.length > 0 && (
              <div className="space-y-3">
                <h3 className="font-medium">Evidence</h3>
                <div className="grid grid-cols-2 gap-3">
                  {report.evidence.map((file, index) => (
                    <div key={index} className="rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
                      {file.mimetype?.startsWith('image') ? (
                        <img src={file.path} alt={file.originalName} className="w-full h-36 object-cover" />
                      ) : (
                        <video src={file.path} controls className="w-full h-36 object-cover" />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="card space-y-4">
            <div>
              <h2 className="text-xl font-semibold">Admin Resolution</h2>
              <p className="text-sm text-gray-500 mt-1">Update the issue status, assign an admin, and record your resolution notes.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Status</label>
                <select
                  className="input-field"
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value })}
                >
                  {reportStatuses.map((status) => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Assign Admin</label>
                <select
                  className="input-field"
                  value={form.assignedTo}
                  onChange={(e) => setForm({ ...form, assignedTo: e.target.value })}
                >
                  <option value="">Unassigned</option>
                  {admins.map((member) => (
                    <option key={member._id} value={member._id}>
                      {member.name} ({member.role})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Resolution Notes</label>
                <textarea
                  className="input-field min-h-[120px]"
                  value={form.adminNotes}
                  onChange={(e) => setForm({ ...form, adminNotes: e.target.value })}
                  placeholder="Enter any notes, actions taken, or follow-up details"
                />
              </div>

              <button type="submit" className="btn-primary w-full" disabled={submitting}>
                {submitting ? 'Saving...' : 'Save Resolution'}
              </button>
            </form>

            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
              <p className="text-sm text-gray-500">Resolved by:</p>
              <div className="mt-2 text-sm text-gray-700 dark:text-gray-300">
                <p>{user?.name} ({user?.role})</p>
                <p className="mt-1">Current assigned admin: {report.assignedTo?.name || 'Not assigned'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AdminResolve;
