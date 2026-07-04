import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Layout from '../components/Layout';
import LoadingSpinner from '../components/LoadingSpinner';
import { StatusBadge, SeverityBadge } from '../components/StatusBadge';
import { incidentAPI, commentAPI, authAPI } from '../services/services';
import { useAuth } from '../context/AuthContext';
import { formatDate, reportStatuses } from '../utils/helpers';
import toast from 'react-hot-toast';
import { FiMapPin, FiClock, FiUser, FiTrash2, FiEdit, FiSend } from 'react-icons/fi';

const ReportDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [report, setReport] = useState(null);
  const [comments, setComments] = useState([]);
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState('');
  const [isInternal, setIsInternal] = useState(false);
  const [statusForm, setStatusForm] = useState({ status: '', adminNotes: '', assignedTo: '' });

  const isAdmin = user?.role === 'admin';
  const isOwner = report?.reportedBy?._id === user?._id || report?.reportedBy === user?._id;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [reportRes, commentsRes] = await Promise.all([
          incidentAPI.getById(id),
          commentAPI.getAll(id),
        ]);
        setReport(reportRes.data.data);
        setComments(commentsRes.data.data);
        setStatusForm({
          status: reportRes.data.data.status,
          adminNotes: reportRes.data.data.adminNotes || '',
          assignedTo: reportRes.data.data.assignedTo?._id || '',
        });

        if (user?.role === 'admin') {
          const adminsRes = await authAPI.getAdmins();
          setAdmins(adminsRes.data.data);
        }
      } catch {
        toast.error('Failed to load report');
        navigate('/dashboard');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id, navigate, user?.role]);

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this report?')) return;
    try {
      await incidentAPI.delete(id);
      toast.success('Report deleted');
      navigate('/reports');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Delete failed');
    }
  };

  const handleStatusUpdate = async (e) => {
    e.preventDefault();
    try {
      const { data } = await incidentAPI.updateStatus(id, statusForm);
      setReport(data.data);
      toast.success('Status updated');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    try {
      const { data } = await commentAPI.create(id, { content: newComment, isInternal });
      setComments([...comments, data.data]);
      setNewComment('');
      toast.success('Comment added');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add comment');
    }
  };

  if (loading) return <Layout><LoadingSpinner fullScreen /></Layout>;
  if (!report) return null;

  return (
    <Layout>
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
          <div>
            <div className="flex flex-wrap gap-2 mb-2">
              <SeverityBadge severity={report.severity} />
              <StatusBadge status={report.status} />
              <span className="badge bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300">
                {report.disasterType}
              </span>
            </div>
            <h1 className="text-2xl font-bold">{report.title}</h1>
          </div>
          {isOwner && report.status === 'Submitted' && (
            <div className="flex gap-2">
              <Link to={`/reports/${id}/edit`} className="btn-secondary flex items-center gap-1">
                <FiEdit size={16} /> Edit
              </Link>
              <button onClick={handleDelete} className="btn-danger flex items-center gap-1">
                <FiTrash2 size={16} /> Delete
              </button>
            </div>
          )}
        </div>

        <div className="card space-y-4">
          <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{report.description}</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-gray-500">
            <span className="flex items-center gap-2"><FiMapPin /> {report.location}</span>
            <span className="flex items-center gap-2"><FiClock /> {formatDate(report.incidentDateTime)}</span>
            <span className="flex items-center gap-2">
              <FiUser /> {report.reportedBy?.name} ({report.reportedBy?.role})
            </span>
            {report.assignedTo && (
              <span className="flex items-center gap-2">
                Assigned to: {report.assignedTo.name}
              </span>
            )}
          </div>

          {report.evidence?.length > 0 && (
            <div>
              <h3 className="font-medium mb-2">Evidence</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {report.evidence.map((file, i) => (
                  <div key={i} className="rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
                    {file.mimetype?.startsWith('image') ? (
                      <img src={file.path} alt={file.originalName} className="w-full h-32 object-cover" />
                    ) : (
                      <video src={file.path} controls className="w-full h-32 object-cover" />
                    )}
                    <p className="text-xs p-2 truncate">{file.originalName}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {report.adminNotes && (
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
              <h3 className="font-medium text-sm mb-1">Admin Response Notes</h3>
              <p className="text-sm">{report.adminNotes}</p>
            </div>
          )}
        </div>

        {isAdmin && (
          <form onSubmit={handleStatusUpdate} className="card space-y-4">
            <h2 className="font-semibold">Manage Report</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Status</label>
                <select
                  className="input-field"
                  value={statusForm.status}
                  onChange={(e) => setStatusForm({ ...statusForm, status: e.target.value })}
                >
                  {reportStatuses.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
              {user?.role === 'admin' && (
                <div>
                  <label className="block text-sm font-medium mb-1">Assign Admin</label>
                  <select
                    className="input-field"
                    value={statusForm.assignedTo}
                    onChange={(e) => setStatusForm({ ...statusForm, assignedTo: e.target.value })}
                  >
                    <option value="">Unassigned</option>
                    {admins.map((admin) => (
                      <option key={admin._id} value={admin._id}>{admin.name} ({admin.role})</option>
                    ))}
                  </select>
                </div>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Response Notes</label>
              <textarea
                className="input-field min-h-[80px]"
                value={statusForm.adminNotes}
                onChange={(e) => setStatusForm({ ...statusForm, adminNotes: e.target.value })}
              />
            </div>
            <button type="submit" className="btn-primary">Update Status</button>
          </form>
        )}

        <div className="card">
          <h2 className="font-semibold mb-4">Comments & Updates</h2>
          <div className="space-y-4 mb-4">
            {comments.length ? comments.map((c) => (
              <div
                key={c._id}
                className={`p-3 rounded-lg ${c.isInternal ? 'bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800' : 'bg-gray-50 dark:bg-gray-700/50'}`}
              >
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-medium">{c.author?.name}</span>
                  <span className="text-gray-500">{formatDate(c.createdAt)}</span>
                </div>
                {c.isInternal && <span className="text-xs text-yellow-600 dark:text-yellow-400">Internal Note</span>}
                <p className="text-sm mt-1">{c.content}</p>
              </div>
            )) : (
              <p className="text-gray-500 text-sm">No comments yet</p>
            )}
          </div>

          <form onSubmit={handleAddComment} className="flex gap-2">
            <input
              className="input-field flex-1"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Add a comment..."
            />
            {isAdmin && (
              <label className="flex items-center gap-1 text-xs whitespace-nowrap">
                <input type="checkbox" checked={isInternal} onChange={(e) => setIsInternal(e.target.checked)} />
                Internal
              </label>
            )}
            <button type="submit" className="btn-primary px-3">
              <FiSend size={16} />
            </button>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default ReportDetail;
