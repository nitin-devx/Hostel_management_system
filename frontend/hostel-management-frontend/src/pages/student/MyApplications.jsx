import { useEffect } from 'react';
import useApi from '../../hooks/useApi.js';
import { applicationApi } from '../../api/index.js';
import Spinner from '../../components/common/Spinner.jsx';
import EmptyState from '../../components/common/EmptyState.jsx';
import { formatDateTime, getStatusBadgeClass } from '../../utils/index.js';
import { FiList, FiGrid } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { ROUTES } from '../../constants/index.js';

const statusIcon = { pending: '🕐', approved: '✅', rejected: '❌' };

const MyApplications = () => {
  const { data, loading, execute } = useApi(applicationApi.getMine);
  useEffect(() => { execute(); }, []);

  const applications = data?.applications || [];

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">My Applications</h1>
          <p className="page-subtitle">Track all your room application requests</p>
        </div>
        <Link to={ROUTES.ROOMS} className="btn-primary">Apply for Room</Link>
      </div>

      {loading ? (
        <div className="flex justify-center py-16"><Spinner size="lg" /></div>
      ) : applications.length === 0 ? (
        <EmptyState
          icon={FiGrid}
          title="No applications yet"
          description="Browse available rooms and apply to get started."
          action={<Link to={ROUTES.ROOMS} className="btn-primary btn-sm">Browse Rooms</Link>}
        />
      ) : (
        <div className="space-y-4">
          {applications.map((app) => (
            <div key={app.id} className="card hover:shadow-md transition-shadow">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="text-2xl mt-0.5">{statusIcon[app.status]}</div>
                  <div>
                    <div className="flex items-center gap-3 flex-wrap">
                      <h3 className="font-semibold text-gray-900">Room {app.room?.roomNumber}</h3>
                      <span className={getStatusBadgeClass(app.status)}>{app.status}</span>
                    </div>
                    <p className="text-sm text-gray-500 mt-0.5">{app.room?.hostel?.hostelName}</p>
                    <p className="text-xs text-gray-400 mt-1">Applied: {formatDateTime(app.appliedAt)}</p>
                    {app.remarks && (
                      <div className="mt-2 bg-yellow-50 border border-yellow-100 rounded-lg px-3 py-2">
                        <p className="text-xs text-yellow-800"><strong>Remark:</strong> {app.remarks}</p>
                      </div>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-400">Application #{app.id}</p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {app.room?.capacity - app.room?.occupied > 0 ? `${app.room?.capacity - app.room?.occupied} seats free` : 'Room full'}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyApplications;