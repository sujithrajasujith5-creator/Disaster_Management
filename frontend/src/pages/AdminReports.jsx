import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import ReportCard from '../components/ReportCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { incidentAPI } from '../services/services';
import { disasterTypes, severityLevels, reportStatuses } from '../utils/helpers';
import { FiSearch, FiFilter } from 'react-icons/fi';

const AdminReports = () => {
  const [reports, setReports] = useState([]);
  const [pagination, setPagination] = useState({});
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: '',
    status: '',
    severity: '',
    disasterType: '',
    sort: '-createdAt',
    page: 1,
  });

  const fetchReports = async () => {
    setLoading(true);
    try {
      const params = Object.fromEntries(
        Object.entries(filters).filter(([, v]) => v !== '')
      );
      const { data } = await incidentAPI.getAll(params);
      setReports(data.data);
      setPagination(data.pagination);
    } catch {
      /* handled */
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, [filters.page, filters.status, filters.severity, filters.disasterType, filters.sort]);

  const handleSearch = (e) => {
    e.preventDefault();
    setFilters({ ...filters, page: 1 });
    fetchReports();
  };

  return (
    <Layout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Manage Reports</h1>

        <div className="card">
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                className="input-field pl-10"
                placeholder="Search reports..."
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              />
            </div>
            <select
              className="input-field sm:w-40"
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value, page: 1 })}
            >
              <option value="">All Status</option>
              {reportStatuses.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
            <select
              className="input-field sm:w-36"
              value={filters.severity}
              onChange={(e) => setFilters({ ...filters, severity: e.target.value, page: 1 })}
            >
              <option value="">All Severity</option>
              {severityLevels.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
            <select
              className="input-field sm:w-44"
              value={filters.disasterType}
              onChange={(e) => setFilters({ ...filters, disasterType: e.target.value, page: 1 })}
            >
              <option value="">All Types</option>
              {disasterTypes.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
            <button type="submit" className="btn-primary flex items-center gap-1">
              <FiFilter size={16} /> Filter
            </button>
          </form>
        </div>

        {loading ? (
          <LoadingSpinner />
        ) : reports.length ? (
          <>
            <div className="grid gap-4">
              {reports.map((report) => (
                <ReportCard key={report._id} report={report} showReporter linkTo={`/admin/reports/${report._id}`} />
              ))}
            </div>
            {pagination.pages > 1 && (
              <div className="flex justify-center gap-2">
                <button
                  className="btn-secondary"
                  disabled={filters.page <= 1}
                  onClick={() => setFilters({ ...filters, page: filters.page - 1 })}
                >
                  Previous
                </button>
                <span className="flex items-center px-4 text-sm">
                  Page {pagination.page} of {pagination.pages}
                </span>
                <button
                  className="btn-secondary"
                  disabled={filters.page >= pagination.pages}
                  onClick={() => setFilters({ ...filters, page: filters.page + 1 })}
                >
                  Next
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="card text-center py-12 text-gray-500">No reports found</div>
        )}
      </div>
    </Layout>
  );
};

export default AdminReports;
