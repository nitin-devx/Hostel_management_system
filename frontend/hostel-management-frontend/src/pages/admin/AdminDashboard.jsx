import { useEffect } from 'react';
import useApi from '../../hooks/useApi.js';
import { adminApi } from '../../api/index.js';
import StatCard from '../../components/common/StatCard.jsx';
import Spinner from '../../components/common/Spinner.jsx';
import { Link } from 'react-router-dom';
import { ROUTES } from '../../constants/index.js';
import { FiUsers, FiGrid, FiList, FiCheckCircle, FiClock, FiXCircle, FiArrowRight } from 'react-icons/fi';

const AdminDashboard = () => {
  const { data, loading, execute } = useApi(adminApi.getDashboard);
  useEffect(() => { execute(); }, []);

  const stats = data?.stats;

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Admin Dashboard</h1>
          <p className="page-subtitle">System overview and quick actions</p>
        </div>
        <button onClick={execute} className="btn-secondary btn-sm" disabled={loading}>
          {loading ? 'Refreshing...' : '↻ Refresh'}
        </button>
      </div>

      {loading && !stats ? (
        <div className="flex justify-center py-16"><Spinner size="lg" /></div>
      ) : stats ? (
        <>
          {/* Primary Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <StatCard title="Total Students"  value={stats.totalStudents} icon={FiUsers} colorClass="bg-purple-50 text-purple-600" />
            <StatCard title="Total Hostels"   value={stats.totalHostels}  icon={FiGrid}  colorClass="bg-blue-50 text-blue-600" />
            <StatCard title="Total Rooms"     value={stats.totalRooms}    icon={FiList}  colorClass="bg-indigo-50 text-indigo-600" />
            <StatCard
              title="Occupancy Rate"
              value={`${stats.occupancy.rate}%`}
              subtitle={`${stats.occupancy.occupied}/${stats.occupancy.total} seats`}
              icon={FiCheckCircle}
              colorClass={stats.occupancy.rate > 80 ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}
            />
          </div>

          {/* Application Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            <StatCard title="Pending Applications"  value={stats.applications.pending}  icon={FiClock}       colorClass="bg-yellow-50 text-yellow-600" subtitle="Awaiting review" />
            <StatCard title="Approved Applications" value={stats.applications.approved} icon={FiCheckCircle} colorClass="bg-green-50 text-green-600"  subtitle="Rooms allocated" />
            <StatCard title="Rejected Applications" value={stats.applications.rejected} icon={FiXCircle}     colorClass="bg-red-50 text-red-500"      subtitle="Not allocated" />
          </div>

          {/* Occupancy Visual */}
          <div className="card mb-6">
            <h2 className="text-base font-semibold text-gray-900 mb-4">Hostel Occupancy</h2>
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <div className="flex justify-between text-xs text-gray-500 mb-2">
                  <span>Occupied: <strong className="text-gray-800">{stats.occupancy.occupied}</strong></span>
                  <span>Available: <strong className="text-green-600">{stats.occupancy.available}</strong></span>
                  <span>Total: <strong className="text-gray-800">{stats.occupancy.total}</strong></span>
                </div>
                <div className="h-4 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      stats.occupancy.rate >= 90 ? 'bg-red-500' : stats.occupancy.rate >= 70 ? 'bg-yellow-500' : 'bg-green-500'
                    }`}
                    style={{ width: `${stats.occupancy.rate}%` }}
                  />
                </div>
                <p className="text-xs text-gray-400 mt-1.5 text-right">{stats.occupancy.rate}% capacity used</p>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {[
              { label: 'Manage Hostels',      to: ROUTES.ADMIN_HOSTELS },
              { label: 'Manage Rooms',        to: ROUTES.ADMIN_ROOMS },
              { label: 'Review Applications', to: ROUTES.ADMIN_APPLICATIONS },
              { label: 'View Students',       to: ROUTES.ADMIN_STUDENTS },
            ].map(({ label, to }) => (
              <Link key={to} to={to} className="card-hover flex items-center justify-between group cursor-pointer">
                <span className="text-sm font-medium text-gray-700 group-hover:text-primary-700">{label}</span>
                <FiArrowRight className="w-4 h-4 text-gray-400 group-hover:text-primary-600 transition" />
              </Link>
            ))}
          </div>
        </>
      ) : null}
    </div>
  );
};

export default AdminDashboard;