import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import useApi from '../../hooks/useApi.js';
import { roomApi, applicationApi } from '../../api/index.js';
import Spinner from '../../components/common/Spinner.jsx';
import EmptyState from '../../components/common/EmptyState.jsx';
import Modal from '../../components/common/Modal.jsx';
import { getAvailabilityBadge, getAvailabilityLabel } from '../../utils/index.js';
import toast from 'react-hot-toast';
import { FiList, FiUsers, FiSend } from 'react-icons/fi';

const Rooms = () => {
  const [searchParams] = useSearchParams();
  const hostelId = searchParams.get('hostelId');

  const [filter, setFilter] = useState('all'); // all | available
  const [applyRoom, setApplyRoom] = useState(null);
  const [applying, setApplying] = useState(false);

  const { data, loading, execute } = useApi(roomApi.getAll);

  useEffect(() => {
    execute({ hostelId: hostelId || undefined, available: filter === 'available' ? true : undefined });
  }, [filter, hostelId]);

  const rooms = data?.rooms || [];

  const handleApply = async () => {
    if (!applyRoom) return;
    setApplying(true);
    try {
      await applicationApi.apply(applyRoom.id);
      toast.success(`Applied for room ${applyRoom.roomNumber}!`);
      setApplyRoom(null);
      execute({ hostelId: hostelId || undefined });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Application failed');
    } finally {
      setApplying(false);
    }
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Available Rooms</h1>
          <p className="page-subtitle">Browse and apply for hostel rooms</p>
        </div>
        {/* Filter */}
        <div className="flex gap-2 bg-gray-100 p-1 rounded-lg">
          {['all', 'available'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition capitalize
                ${filter === f ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
            >
              {f === 'all' ? 'All Rooms' : 'Available Only'}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-16"><Spinner size="lg" /></div>
      ) : rooms.length === 0 ? (
        <EmptyState icon={FiList} title="No rooms found" description="Try changing your filter." />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {rooms.map((room) => {
            const available = room.occupied < room.capacity;
            const freePct = Math.round(((room.capacity - room.occupied) / room.capacity) * 100);

            return (
              <div key={room.id} className={`card flex flex-col gap-3 border-2 ${available ? 'border-transparent hover:border-primary-200' : 'border-transparent opacity-75'} transition`}>
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-gray-900 text-lg">Room {room.roomNumber}</h3>
                  <span className={getAvailabilityBadge(room.occupied, room.capacity)}>
                    {getAvailabilityLabel(room.occupied, room.capacity)}
                  </span>
                </div>

                <p className="text-xs text-gray-400 -mt-1">{room.hostel?.hostelName}</p>

                {/* Capacity bar */}
                <div>
                  <div className="flex items-center gap-2 text-xs text-gray-500 mb-1.5">
                    <FiUsers className="w-3.5 h-3.5" />
                    <span>{room.occupied}/{room.capacity} occupied</span>
                  </div>
                  <div className="h-1.5 bg-gray-100 rounded-full">
                    <div
                      className={`h-full rounded-full ${room.occupied >= room.capacity ? 'bg-red-400' : 'bg-green-400'}`}
                      style={{ width: `${Math.round((room.occupied / room.capacity) * 100)}%` }}
                    />
                  </div>
                </div>

                <button
                  className={`w-full mt-1 ${available ? 'btn-primary' : 'btn-secondary opacity-50 cursor-not-allowed'} btn-sm`}
                  disabled={!available}
                  onClick={() => available && setApplyRoom(room)}
                >
                  {available ? <><FiSend className="w-3.5 h-3.5" /> Apply Now</> : 'Room Full'}
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* Apply Confirm Modal */}
      <Modal isOpen={!!applyRoom} onClose={() => setApplyRoom(null)} title="Confirm Application" size="sm">
        {applyRoom && (
          <div>
            <p className="text-sm text-gray-600 mb-4">
              You are about to apply for <strong>Room {applyRoom.roomNumber}</strong> in{' '}
              <strong>{applyRoom.hostel?.hostelName}</strong>. This will be sent to admin for review.
            </p>
            <div className="bg-gray-50 rounded-xl p-4 mb-6 space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-gray-500">Room</span><strong>{applyRoom.roomNumber}</strong></div>
              <div className="flex justify-between"><span className="text-gray-500">Capacity</span><strong>{applyRoom.capacity} seats</strong></div>
              <div className="flex justify-between"><span className="text-gray-500">Available</span><strong className="text-green-600">{applyRoom.capacity - applyRoom.occupied} seats</strong></div>
            </div>
            <div className="flex gap-3">
              <button className="btn-secondary flex-1" onClick={() => setApplyRoom(null)} disabled={applying}>Cancel</button>
              <button className="btn-primary flex-1" onClick={handleApply} disabled={applying}>
                {applying ? 'Submitting...' : 'Confirm Apply'}
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Rooms;