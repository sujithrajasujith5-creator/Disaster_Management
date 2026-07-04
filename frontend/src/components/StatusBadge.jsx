import { getSeverityColor, getStatusColor } from '../utils/helpers';

export const StatusBadge = ({ status }) => (
  <span className={`badge ${getStatusColor(status)}`}>{status}</span>
);

export const SeverityBadge = ({ severity }) => (
  <span className={`badge ${getSeverityColor(severity)}`}>{severity}</span>
);
