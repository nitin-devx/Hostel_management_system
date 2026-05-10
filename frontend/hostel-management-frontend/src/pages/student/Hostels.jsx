import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import useApi from '../../hooks/useApi.js';
import { hostelApi } from '../../api/index.js';
import Spinner from '../../components/common/Spinner.jsx';
import EmptyState from '../../components/common/EmptyState.jsx';
import { ROUTES } from '../../constants/index.js';
import { FiGrid, FiArrowRight } from 'react-icons/fi';

const Hostels = () => {
  const { data, loading, execute } = useApi(hostelApi.getAll);
  useEffect(() => { execute(); }, []);

  const hostels = data?.hostels || [];

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Hostels</h1>
          <p className="page-subtitle">Browse all available hostels</p>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-16"><Spinner size="lg" /></div>
      ) : hostels.length === 0 ? (
        <EmptyState icon={FiGrid} title="No hostels yet" description="Check back later." />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {hostels.map((hostel) => {
            const totalCapacity = hostel.rooms?.reduce((s, r) => s + r.capacity, 0) || 0;
            const totalOccupied = hostel.rooms?.reduce((s, r) => s + r.occupied, 0) || 0;
            const available = totalCapacity - totalOccupied;
            const pct = totalCapacity > 0 ? Math.round((totalOccupied / totalCapacity) * 100) : 0;

            return (
              <div key={hostel.id} className="card-hover flex flex-col gap-4">
                <div className="flex items-start gap-3">
                  <div className="w-11 h-11 rounded-xl bg-primary-100 flex items-center justify-center flex-shrink-0">
                    <FiGrid className="w-5 h-5 text-primary-700" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 leading-tight">{hostel.hostelName}</h3>
                    {hostel.description && (
                      <p className="text-xs text-gray-400 mt-0.5 line-clamp-2">{hostel.description}</p>
                    )}
                  </div>
                </div>

                {/* Occupancy bar */}
                <div>
                  <div className="flex justify-between text-xs text-gray-500 mb-1">
                    <span>{totalOccupied}/{totalCapacity} seats occupied</span>
                    <span>{pct}%</span>
                  </div>
                  <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${pct >= 90 ? 'bg-red-400' : pct >= 60 ? 'bg-yellow-400' : 'bg-green-400'}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <div className="flex gap-3 text-xs text-gray-500">
                    <span><strong className="text-gray-800">{hostel.totalRooms}</strong> rooms</span>
                    <span><strong className={available > 0 ? 'text-green-600' : 'text-red-500'}>{available}</strong> seats free</span>
                  </div>
                  <Link
                    to={`${ROUTES.ROOMS}?hostelId=${hostel.id}`}
                    className="btn-primary btn-sm"
                  >
                    View Rooms <FiArrowRight />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Hostels;