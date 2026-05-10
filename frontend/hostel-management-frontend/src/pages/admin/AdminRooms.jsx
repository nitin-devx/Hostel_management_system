import { useEffect, useState } from 'react';
import useApi from '../../hooks/useApi.js';
import { roomApi, hostelApi } from '../../api/index.js';
import Spinner from '../../components/common/Spinner.jsx';
import EmptyState from '../../components/common/EmptyState.jsx';
import Modal from '../../components/common/Modal.jsx';
import ConfirmDialog from '../../components/common/ConfirmDialog.jsx';
import { getAvailabilityBadge, getAvailabilityLabel } from '../../utils/index.js';
import toast from 'react-hot-toast';
import { FiList, FiPlus, FiEdit2, FiTrash2 } from 'react-icons/fi';

const emptyForm = { roomNumber: '', capacity: '', occupied: '', hostelId: '' };

const AdminRooms = () => {
  const { data, loading, execute } = useApi(roomApi.getAll);
  const { data: hostelData, execute: fetchHostels } = useApi(hostelApi.getAll);
  const [modal, setModal]         = useState({ open: false, room: null });
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [form, setForm]           = useState(emptyForm);
  const [saving, setSaving]       = useState(false);
  const [deleting, setDeleting]   = useState(false);
  const [filterHostel, setFilterHostel] = useState('');

  useEffect(() => { execute(); fetchHostels(); }, []);

  const rooms = (data?.rooms || []).filter((r) => !filterHostel || String(r.hostelId) === filterHostel);
  const hostels = hostelData?.hostels || [];

  const openCreate = () => { setForm(emptyForm); setModal({ open: true, room: null }); };
  const openEdit   = (r) => {
    setForm({ roomNumber: r.roomNumber, capacity: r.capacity, occupied: r.occupied, hostelId: r.hostelId });
    setModal({ open: true, room: r });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.roomNumber.trim() || !form.capacity || !form.hostelId) return toast.error('All required fields must be filled');
    setSaving(true);
    try {
      const payload = { ...form, capacity: Number(form.capacity), occupied: Number(form.occupied) || 0, hostelId: Number(form.hostelId) };
      if (modal.room) { await roomApi.update(modal.room.id, payload); toast.success('Room updated'); }
      else            { await roomApi.create(payload);                toast.success('Room created'); }
      setModal({ open: false, room: null });
      execute();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await roomApi.delete(deleteTarget.id);
      toast.success('Room deleted');
      setDeleteTarget(null);
      execute();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Delete failed');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Manage Rooms</h1>
          <p className="page-subtitle">{rooms.length} room(s) listed</p>
        </div>
        <div className="flex gap-2">
          <select className="input w-auto text-sm" value={filterHostel} onChange={(e) => setFilterHostel(e.target.value)}>
            <option value="">All Hostels</option>
            {hostels.map((h) => <option key={h.id} value={h.id}>{h.hostelName}</option>)}
          </select>
          <button className="btn-primary" onClick={openCreate}><FiPlus /> Add Room</button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-16"><Spinner size="lg" /></div>
      ) : rooms.length === 0 ? (
        <EmptyState icon={FiList} title="No rooms" description="Add rooms to hostels." action={<button className="btn-primary btn-sm" onClick={openCreate}>Add Room</button>} />
      ) : (
        <div className="table-wrapper">
          <table className="table">
            <thead>
              <tr>
                <th>Room No.</th><th>Hostel</th><th>Capacity</th><th>Occupied</th><th>Status</th><th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {rooms.map((r) => (
                <tr key={r.id}>
                  <td className="font-semibold text-gray-900">{r.roomNumber}</td>
                  <td className="text-gray-500">{r.hostel?.hostelName}</td>
                  <td>{r.capacity}</td>
                  <td>{r.occupied}</td>
                  <td>
                    <span className={getAvailabilityBadge(r.occupied, r.capacity)}>
                      {getAvailabilityLabel(r.occupied, r.capacity)}
                    </span>
                  </td>
                  <td>
                    <div className="flex gap-1">
                      <button onClick={() => openEdit(r)} className="btn-secondary btn-sm p-1.5"><FiEdit2 className="w-3.5 h-3.5" /></button>
                      <button onClick={() => setDeleteTarget(r)} className="btn-danger btn-sm p-1.5"><FiTrash2 className="w-3.5 h-3.5" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal */}
      <Modal isOpen={modal.open} onClose={() => setModal({ open: false, room: null })} title={modal.room ? 'Edit Room' : 'Add New Room'}>
        <form onSubmit={handleSave} className="space-y-4">
          <div className="form-group">
            <label className="label">Hostel *</label>
            <select className="input" value={form.hostelId} onChange={(e) => setForm((p) => ({ ...p, hostelId: e.target.value }))}>
              <option value="">Select hostel</option>
              {hostels.map((h) => <option key={h.id} value={h.id}>{h.hostelName}</option>)}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="form-group">
              <label className="label">Room Number *</label>
              <input className="input" placeholder="e.g. A-101" value={form.roomNumber}
                onChange={(e) => setForm((p) => ({ ...p, roomNumber: e.target.value }))} />
            </div>
            <div className="form-group">
              <label className="label">Capacity *</label>
              <input className="input" type="number" min="1" placeholder="e.g. 3" value={form.capacity}
                onChange={(e) => setForm((p) => ({ ...p, capacity: e.target.value }))} />
            </div>
          </div>
          {modal.room && (
            <div className="form-group">
              <label className="label">Currently Occupied</label>
              <input className="input" type="number" min="0" value={form.occupied}
                onChange={(e) => setForm((p) => ({ ...p, occupied: e.target.value }))} />
            </div>
          )}
          <div className="flex gap-3 pt-2">
            <button type="button" className="btn-secondary flex-1" onClick={() => setModal({ open: false, room: null })}>Cancel</button>
            <button type="submit" className="btn-primary flex-1" disabled={saving}>{saving ? 'Saving...' : modal.room ? 'Update' : 'Create'}</button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete Room"
        message={`Delete room "${deleteTarget?.roomNumber}"? All applications for this room will be removed.`}
        confirmText="Delete"
        danger loading={deleting}
      />
    </div>
  );
};

export default AdminRooms;