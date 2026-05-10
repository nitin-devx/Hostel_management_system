import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import useApi from '../../hooks/useApi.js';
import { applicationApi } from '../../api/index.js';
import useNotifications from '../../hooks/useNotifications.js';
import StatCard from '../../components/common/StatCard.jsx';
import Spinner from '../../components/common/Spinner.jsx';
import { ROUTES } from '../../constants/index.js';
import { formatDateTime, getStatusBadgeClass } from '../../utils/index.js';
import { FiList, FiCheckCircle, FiClock, FiBell, FiArrowRight, FiGrid } from 'react-icons/fi';

const StudentDashboard = () => {
  const { user } = useAuth();
  const { notifications, unread } = useNotifications();
  const { data, loading, execute } = useApi(applicationApi.getMine);

  useEffect(() => { execute(); }, []);

  const applications = data?.applications || [];
  const pending  = applications.filter((a) => a.status === 'pending').length;
  const approved = applications.filter((a) => a.status === 'approved').length;
  const latest   = applications.slice(0, 5);

  return (
    <div>
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Welcome back, {user?.name?.split(' ')[0]}! 👋</h1>
          <p className="page-subtitle">Here's a summary of your hostel activity.</p>
        </div>
        <Link to={ROUTES.ROOMS} className="btn-primary">
          Browse Rooms <FiArrowRight />
        </Link>
      </div>

      {/* Stats */}
      {loading ? <Spinner className="my-8 mx-auto" /> : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard title="Total Applications" value={applications.length} icon={FiList} colorClass="bg-blue-50 text-blue-600" />
          <StatCard title="Pending"  value={pending}  icon={FiClock}        colorClass="bg-yellow-50 text-yellow-600" />
          <StatCard title="Approved" value={approved}  icon={FiCheckCircle} colorClass="bg-green-50 text-green-600" />
          <StatCard title="Unread Notifications" value={unread} icon={FiBell} colorClass="bg-red-50 text-red-500" />
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Applications */}
        <div className="lg:col-span-2 card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold text-gray-900">Recent Applications</h2>
            <Link to={ROUTES.MY_APPLICATIONS} className="text-xs text-primary-600 hover:underline font-medium">
              View all →
            </Link>
          </div>

          {loading ? (
            <Spinner className="mx-auto my-6" />
          ) : latest.length === 0 ? (
            <div className="text-center py-10">
              <FiGrid className="w-8 h-8 text-gray-300 mx-auto mb-2" />
              <p className="text-sm text-gray-400">No applications yet.</p>
              <Link to={ROUTES.ROOMS} className="btn-primary btn-sm mt-3 inline-flex">Browse Rooms</Link>
            </div>
          ) : (
            <div className="space-y-3">
              {latest.map((app) => (
                <div key={app.id} className="flex items-center justify-between bg-gray-50 rounded-xl px-4 py-3">
                  <div>
                    <p className="text-sm font-medium text-gray-800">
                      Room {app.room?.roomNumber}
                      <span className="text-gray-400 font-normal ml-1">— {app.room?.hostel?.hostelName}</span>
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">{formatDateTime(app.appliedAt)}</p>
                  </div>
                  <span className={getStatusBadgeClass(app.status)}>{app.status}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Notifications */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold text-gray-900">Notifications</h2>
            <Link to={ROUTES.NOTIFICATIONS} className="text-xs text-primary-600 hover:underline font-medium">
              See all →
            </Link>
          </div>
          {notifications.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-8">No notifications yet.</p>
          ) : (
            <div className="space-y-3">
              {notifications.slice(0, 5).map((n) => (
                <div key={n.id} className={`rounded-xl px-4 py-3 text-sm ${n.isRead ? 'bg-gray-50 text-gray-500' : 'bg-primary-50 text-gray-700 border border-primary-100'}`}>
                  <p className="leading-snug">{n.message}</p>
                  <p className="text-xs text-gray-400 mt-1">{formatDateTime(n.createdAt)}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;