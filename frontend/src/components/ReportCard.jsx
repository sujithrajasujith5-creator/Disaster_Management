import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { StatusBadge, SeverityBadge } from './StatusBadge';
import { formatDate } from '../utils/helpers';
import { FiMapPin, FiClock, FiChevronRight } from 'react-icons/fi';

const ReportCard = ({ report, showReporter = false, linkTo }) => (
  <motion.div
    initial={{ opacity: 0, y: 22 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, amount: 0.2 }}
    transition={{ duration: 0.52, ease: 'easeOut' }}
    whileHover={{ y: -6 }}
    className="group"
  >
    <Link
      to={linkTo || `/reports/${report._id}`}
      className="card block overflow-hidden rounded-[28px] border border-white/10 bg-white/90 dark:bg-slate-900/90 shadow-sm transition shadow-slate-950/10 hover:shadow-[0_32px_90px_rgba(15,23,42,0.14)]"
    >
      <div className="relative overflow-hidden p-5">
        <div className="pointer-events-none absolute inset-x-[-30%] top-0 h-32 bg-gradient-to-r from-cyan-400/10 via-transparent to-sky-500/10 blur-3xl" />
        <div className="flex justify-between items-start gap-4 relative">
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <SeverityBadge severity={report.severity} />
              <StatusBadge status={report.status} />
              <span className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded">
                {report.disasterType}
              </span>
            </div>
            <h3 className="font-semibold text-lg group-hover:text-primary-600 transition-colors truncate">
              {report.title}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">
              {report.description}
            </p>
            <div className="flex flex-wrap gap-4 mt-3 text-xs text-gray-500 dark:text-gray-400">
              <span className="flex items-center gap-1">
                <FiMapPin size={12} />
                {report.location}
              </span>
              <span className="flex items-center gap-1">
                <FiClock size={12} />
                {formatDate(report.incidentDateTime)}
              </span>
              {showReporter && report.reportedBy && (
                <span>By: {report.reportedBy.name}</span>
              )}
            </div>
          </div>
          <motion.div
            className="text-gray-400 flex-shrink-0 mt-2"
            whileHover={{ rotate: 10, scale: 1.05 }}
            transition={{ duration: 0.25 }}
          >
            <FiChevronRight size={18} />
          </motion.div>
        </div>
      </div>
    </Link>
  </motion.div>
);

export default ReportCard;
