import { useEffect, useState } from 'react';
import useApi from '../../hooks/useApi.js';
import { hostelApi } from '../../api/index.js';
import Spinner from '../../components/common/Spinner.jsx';
import EmptyState from '../../components/common/EmptyState.jsx';
import Modal from '../../components/common/Modal.jsx';
import ConfirmDialog from '../../components/common/ConfirmDialog.jsx';
import toast from 'react-hot-toast';
import { FiGrid, FiPlus, FiEdit2, FiTrash2 } from 'react-icons/fi';

const emptyForm = { hostelName: '', totalRooms: '', description: '' };

const AdminHostels = () => {
  const { data, loading, execute } = useApi(hostelApi.getAll);
  const [modal, setModal] = useState({ open: false, hostel: null });
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => { execute(); }, []);

  const hostels = data?.hostels || [];

  const openCreate = () => { setForm(emptyForm); setModal({ open: true, hostel: null }); };
  const openEdit = (h) => {
    setForm({ hostelName: h.hostelName, totalRooms: h.totalRooms, description: h.description || '' });
    setModal({ open: true, hostel: h });
  };
  const closeModal = () => setModal({ open: false, hostel: null });

  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.hostelName.trim()) return toast.error('Hostel name is required');
    if (!form.totalRooms || form.totalRooms < 0) return toast.error('Valid total rooms required');
    setSaving(true);
    try {
      if (modal.hostel) {
        await hostelApi.update(modal.hostel.id, form);
        toast.success('Hostel updated');
      } else {
        await hostelApi.create(form);
        toast.success('Hostel created');
      }
      closeModal();
      execute();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await hostelApi.delete(deleteTarget.id);
      toast.success('Hostel deleted');
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
          <h1 className="page-title">Manage Hostels</h1>
          <p className="page-subtitle">Create and manage hostel blocks</p>
        </div>
        <button className="btn-primary" onClick={openCreate}><FiPlus /> Add Hostel</button>
      </div>

      {loading ? (
        <div className="flex justify-center py-16"><Spinner size="lg" /></div>
      ) : hostels.length === 0 ? (
        <EmptyState icon={FiGrid} title="No hostels" description="Add your first hostel." action={<button className="btn-primary btn-sm" onClick={openCreate}>Add Hostel</button>} />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {hostels.map((h) => {
            const occupied = h.rooms?.reduce((s, r) => s + r.occupied, 0) || 0;
            const capacity = h.rooms?.reduce((s, r) => s + r.capacity, 0) || 0;
            return (
              <div key={h.id} className="card">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary-100 flex items-center justify-center">
                      <FiGrid className="w-5 h-5 text-primary-700" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 text-sm leading-tight">{h.hostelName}</h3>
                      <p className="text-xs text-gray-400">{h.totalRooms} rooms configured</p>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <button onClick={() => openEdit(h)} className="btn-secondary btn-sm p-1.5"><FiEdit2 className="w-3.5 h-3.5" /></button>
                    <button onClick={() => setDeleteTarget(h)} className="btn-danger btn-sm p-1.5"><FiTrash2 className="w-3.5 h-3.5" /></button>
                  </div>
                </div>
                {h.description && <p className="text-xs text-gray-400 mb-3 line-clamp-2">{h.description}</p>}
                <div className="flex items-center justify-between text-xs text-gray-500 pt-2 border-t border-gray-50">
                  <span>{h.rooms?.length || 0} rooms added</span>
                  <span>{occupied}/{capacity} seats occupied</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Create/Edit Modal */}
      <Modal isOpen={modal.open} onClose={closeModal} title={modal.hostel ? 'Edit Hostel' : 'Add New Hostel'}>
        <form onSubmit={handleSave} className="space-y-4">
          <div className="form-group">
            <label className="label">Hostel Name *</label>
            <input className="input" placeholder="e.g. Block A — Men's Hostel" value={form.hostelName}
              onChange={(e) => setForm((p) => ({ ...p, hostelName: e.target.value }))} />
          </div>
          <div className="form-group">
            <label className="label">Total Rooms *</label>
            <input className="input" type="number" min="0" placeholder="e.g. 20" value={form.totalRooms}
              onChange={(e) => setForm((p) => ({ ...p, totalRooms: e.target.value }))} />
          </div>
          <div className="form-group">
            <label className="label">Description</label>
            <textarea className="input resize-none" rows={3} placeholder="Optional details..."
              value={form.description} onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))} />
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" className="btn-secondary flex-1" onClick={closeModal}>Cancel</button>
            <button type="submit" className="btn-primary flex-1" disabled={saving}>
              {saving ? 'Saving...' : modal.hostel ? 'Update Hostel' : 'Create Hostel'}
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete Hostel"
        message={`Delete "${deleteTarget?.hostelName}"? All associated rooms and applications will also be removed.`}
        confirmText="Delete"
        danger
        loading={deleting}
      />
    </div>
  );
};

export default AdminHostels;