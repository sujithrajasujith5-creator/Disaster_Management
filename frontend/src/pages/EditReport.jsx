import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import LoadingSpinner from '../components/LoadingSpinner';
import { incidentAPI } from '../services/services';
import { disasterTypes, severityLevels } from '../utils/helpers';
import toast from 'react-hot-toast';

const EditReport = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    title: '',
    disasterType: 'Fire',
    description: '',
    severity: 'Medium',
    location: '',
    incidentDateTime: '',
  });

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const { data } = await incidentAPI.getById(id);
        const report = data.data;
        if (report.status !== 'Submitted') {
          toast.error('Cannot edit report after review');
          navigate(`/reports/${id}`);
          return;
        }
        setForm({
          title: report.title,
          disasterType: report.disasterType,
          description: report.description,
          severity: report.severity,
          location: report.location,
          incidentDateTime: new Date(report.incidentDateTime).toISOString().slice(0, 16),
        });
      } catch {
        toast.error('Failed to load report');
        navigate('/reports');
      } finally {
        setLoading(false);
      }
    };
    fetchReport();
  }, [id, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const formData = new FormData();
      Object.entries(form).forEach(([key, value]) => formData.append(key, value));
      await incidentAPI.update(id, formData);
      toast.success('Report updated');
      navigate(`/reports/${id}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Layout><LoadingSpinner fullScreen /></Layout>;

  return (
    <Layout>
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Edit Report</h1>
        <form onSubmit={handleSubmit} className="card space-y-5">
          <div>
            <label className="block text-sm font-medium mb-1">Title</label>
            <input className="input-field" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Disaster Type</label>
              <select className="input-field" value={form.disasterType} onChange={(e) => setForm({ ...form, disasterType: e.target.value })}>
                {disasterTypes.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Severity</label>
              <select className="input-field" value={form.severity} onChange={(e) => setForm({ ...form, severity: e.target.value })}>
                {severityLevels.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea className="input-field min-h-[120px]" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Location</label>
              <input className="input-field" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} required />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Date & Time</label>
              <input type="datetime-local" className="input-field" value={form.incidentDateTime} onChange={(e) => setForm({ ...form, incidentDateTime: e.target.value })} required />
            </div>
          </div>
          <div className="flex gap-3">
            <button type="submit" className="btn-primary flex-1" disabled={saving}>{saving ? 'Saving...' : 'Save Changes'}</button>
            <button type="button" className="btn-secondary" onClick={() => navigate(-1)}>Cancel</button>
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default EditReport;
