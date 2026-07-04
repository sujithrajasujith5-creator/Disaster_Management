import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { incidentAPI } from '../services/services';
import { disasterTypes, severityLevels } from '../utils/helpers';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { FiUpload, FiX } from 'react-icons/fi';

const CreateReport = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [files, setFiles] = useState([]);
  const [form, setForm] = useState({
    title: '',
    disasterType: 'Fire',
    description: '',
    severity: 'Medium',
    location: '',
    incidentDateTime: new Date().toISOString().slice(0, 16),
    helpRequested: false,
    helpMessage: '',
  });

  const handleFileChange = (e) => {
    const selected = Array.from(e.target.files);
    if (files.length + selected.length > 5) {
      toast.error('Maximum 5 files allowed');
      return;
    }
    setFiles([...files, ...selected]);
  };

  const removeFile = (index) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData();
      Object.entries(form).forEach(([key, value]) => {
        formData.append(key, value);
      });
      files.forEach((file) => formData.append('evidence', file));

      const { data } = await incidentAPI.create(formData);
      toast.success('Report submitted successfully!');
      navigate(`/reports/${data.data._id}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit report');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
        >
          <h1 className="text-2xl font-bold mb-6">Report an Incident</h1>
        </motion.div>

        <motion.form
          onSubmit={handleSubmit}
          className="card space-y-5"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.08 } },
          }}
        >
          <motion.div variants={{ hidden: { opacity: 0, y: 14 }, visible: { opacity: 1, y: 0 } }}>
            <label className="block text-sm font-medium mb-1">Incident Title *</label>
            <input
              className="input-field shadow-input"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              required
              placeholder="Brief title of the incident"
            />
          </motion.div>

          <motion.div variants={{ hidden: { opacity: 0, y: 14 }, visible: { opacity: 1, y: 0 } }} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Disaster Type *</label>
              <select
                className="input-field shadow-input"
                value={form.disasterType}
                onChange={(e) => setForm({ ...form, disasterType: e.target.value })}
              >
                {disasterTypes.map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Severity *</label>
              <select
                className="input-field shadow-input"
                value={form.severity}
                onChange={(e) => setForm({ ...form, severity: e.target.value })}
              >
                {severityLevels.map((level) => (
                  <option key={level} value={level}>{level}</option>
                ))}
              </select>
            </div>
          </motion.div>

          <motion.div variants={{ hidden: { opacity: 0, y: 14 }, visible: { opacity: 1, y: 0 } }}>
            <label className="block text-sm font-medium mb-1">Description *</label>
            <textarea
              className="input-field min-h-[120px] shadow-input shadow-border-shimmer"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              required
              placeholder="Describe the incident in detail..."
            />
          </motion.div>

          <motion.div variants={{ hidden: { opacity: 0, y: 14 }, visible: { opacity: 1, y: 0 } }} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Location *</label>
              <input
                className="input-field shadow-input"
                value={form.location}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
                required
                placeholder="Building, floor, room"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Date & Time *</label>
              <input
                type="datetime-local"
                className="input-field shadow-input focus:border-cyan-400/80"
                value={form.incidentDateTime}
                onChange={(e) => setForm({ ...form, incidentDateTime: e.target.value })}
                required
              />
            </div>
          </motion.div>

          <motion.div variants={{ hidden: { opacity: 0, y: 14 }, visible: { opacity: 1, y: 0 } }}>
            <label className="block text-sm font-medium mb-1">Upload Evidence (max 5 files)</label>
            <label
              htmlFor="file-upload"
              className="group block cursor-pointer border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-3xl p-6 text-center transition hover:border-cyan-400/90 hover:shadow-[0_18px_60px_rgba(56,189,248,0.12)] hover:-translate-y-0.5"
            >
              <span className="flex items-center justify-center mx-auto mb-3 h-14 w-14 rounded-full bg-slate-900/80 text-cyan-300 transition group-hover:bg-cyan-500/15">
                <FiUpload className="animate-bounce-slow" size={24} />
              </span>
              <span className="block font-medium text-sm text-slate-200">Choose Files</span>
              <p className="text-xs text-gray-500 mt-2">Images or videos, max 10MB each</p>
              <input
                type="file"
                accept="image/*,video/*"
                multiple
                onChange={handleFileChange}
                className="hidden"
                id="file-upload"
              />
            </label>
            {files.length > 0 && (
              <div className="mt-3 space-y-2">
                {files.map((file, i) => (
                  <div key={i} className="flex items-center justify-between bg-gray-50 dark:bg-gray-700/50 px-3 py-2 rounded-lg text-sm transition hover:bg-slate-100 dark:hover:bg-slate-800">
                    <span className="truncate">{file.name}</span>
                    <button type="button" onClick={() => removeFile(i)} className="text-red-500 ml-2">
                      <FiX size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </motion.div>

          <motion.div variants={{ hidden: { opacity: 0, y: 14 }, visible: { opacity: 1, y: 0 } }} className="border-t border-gray-200 dark:border-gray-700 pt-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={form.helpRequested}
                onChange={(e) => setForm({ ...form, helpRequested: e.target.checked })}
                className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
              <span className="text-sm font-medium">Request immediate emergency help</span>
            </label>
            {form.helpRequested && (
              <textarea
                className="input-field mt-3 min-h-[80px] shadow-input shadow-border-shimmer"
                value={form.helpMessage}
                onChange={(e) => setForm({ ...form, helpMessage: e.target.value })}
                placeholder="Describe the help you need..."
              />
            )}
          </motion.div>

          <motion.div variants={{ hidden: { opacity: 0, y: 14 }, visible: { opacity: 1, y: 0 } }} className="flex gap-3">
            <button
              type="submit"
              className="btn-primary flex-1 relative overflow-hidden"
              disabled={loading}
            >
              <span className="button-glow absolute inset-0 rounded-2xl opacity-0 transition duration-300" />
              {loading ? 'Submitting...' : 'Submit Report'}
            </button>
            <button type="button" className="btn-secondary hover:-translate-y-0.5 transition-transform" onClick={() => navigate(-1)}>
              Cancel
            </button>
          </motion.div>
        </motion.form>
      </div>
    </Layout>
  );
};

export default CreateReport;
