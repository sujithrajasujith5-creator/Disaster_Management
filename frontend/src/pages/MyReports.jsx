import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import ReportCard from '../components/ReportCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { incidentAPI } from '../services/services';
import { Link } from 'react-router-dom';
import { FiPlusCircle } from 'react-icons/fi';

const MyReports = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const { data } = await incidentAPI.getMyReports();
        setReports(data.data);
      } catch {
        /* handled */
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
  }, []);

  if (loading) return <Layout><LoadingSpinner fullScreen /></Layout>;

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">My Reports</h1>
          <Link to="/reports/new" className="btn-primary flex items-center gap-2">
            <FiPlusCircle />
            New Report
          </Link>
        </div>

        {reports.length ? (
          <div className="grid gap-4">
            {reports.map((report) => (
              <ReportCard key={report._id} report={report} />
            ))}
          </div>
        ) : (
          <div className="card text-center py-12">
            <p className="text-gray-500 mb-4">You haven't submitted any reports yet.</p>
            <Link to="/reports/new" className="btn-primary inline-flex items-center gap-2">
              <FiPlusCircle />
              Report Your First Incident
            </Link>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default MyReports;
