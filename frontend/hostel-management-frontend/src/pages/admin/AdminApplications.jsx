import { useEffect, useState } from 'react';
import useApi from '../../hooks/useApi.js';
import { applicationApi } from '../../api/index.js';
import Spinner from '../../components/common/Spinner.jsx';
import EmptyState from '../../components/common/EmptyState.jsx';
import Modal from '../../components/common/Modal.jsx';
import { formatDateTime, getStatusBadgeClass } from '../../utils/index.js';
import toast from 'react-hot-toast';
import { FiCheckSquare, FiCheck, FiX } from 'react-icons/fi';

const AdminApplications = () => {
  const { data, loading, execute } = useApi(applicationApi.getAll);
  const [filterStatus, setFilterStatus] = useState('');
  const [reviewModal, setReviewModal]   = useState({ open: false, app: null, action: '' });
  const [remarks, setRemarks]           = useState('');
  const [processing, setProcessing]     = useState(false);

  useEffect(() => { execute({ status: filterStatus || undefined }); }, [filterStatus]);

  const applications = data?.applications || [];

  const openReview = (app, action) => {
    setReviewModal({ open: true, app, action });
    setRemarks('');
  };

  const handleDecision = async () => {
    setProcessing(true);
    try {
      await applicationApi.updateStatus(reviewModal.app.id, { status: reviewModal.action, remarks });
      toast.success(`Application ${reviewModal.action}`);
      setReviewModal({ open: false, app: null, action: '' });
      execute({ status: filterStatus || undefined });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Applications</h1>
          <p className="page-subtitle">Review and manage student room applications</p>
        </div>
        <div className="flex gap-2 bg-gray-100 p-1 rounded-lg">
          {['', 'pending', 'approved', 'rejected'].map((s) => (
            <button key={s} onClick={() => setFilterStatus(s)}
              className={`px-3 py-1.5 rounded-md text-xs font-medium capitalize transition
                ${filterStatus === s ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>
              {s || 'All'}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-16"><Spinner size="lg" /></div>
      ) : applications.length === 0 ? (
        <EmptyState icon={FiCheckSquare} title="No applications" description="No applications match this filter." />
      ) : (
        <div className="table-wrapper">
          <table className="table">
            <thead>
              <tr>
                <th>#</th><th>Student</th><th>Room</th><th>Hostel</th><th>Applied</th><th>Status</th><th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {applications.map((app) => (
                <tr key={app.id}>
                  <td className="text-gray-400 text-xs">{app.id}</td>
                  <td>
                    <p className="font-medium text-gray-900">{app.student?.name}</p>
                    <p className="text-xs text-gray-400">{app.student?.email}</p>
                  </td>
                  <td className="font-semibold">{app.room?.roomNumber}</td>
                  <td className="text-gray-500 text-xs">{app.room?.hostel?.hostelName}</td>
                  <td className="text-xs text-gray-500">{formatDateTime(app.appliedAt)}</td>
                  <td><span className={getStatusBadgeClass(app.status)}>{app.status}</span></td>
                  <td>
                    {app.status === 'pending' ? (
                      <div className="flex gap-1">
                        <button onClick={() => openReview(app, 'approved')}
                          className="btn-success btn-sm px-2.5 py-1 gap-1">
                          <FiCheck className="w-3.5 h-3.5" /> Approve
                        </button>
                        <button onClick={() => openReview(app, 'rejected')}
                          className="btn-danger btn-sm px-2.5 py-1 gap-1">
                          <FiX className="w-3.5 h-3.5" /> Reject
                        </button>
                      </div>
                    ) : (
                      <span className="text-xs text-gray-400 italic">
                        {app.remarks ? `"${app.remarks.slice(0, 30)}${app.remarks.length > 30 ? '…' : ''}"` : 'No remarks'}
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Review Modal */}
      <Modal
        isOpen={reviewModal.open}
        onClose={() => setReviewModal({ open: false, app: null, action: '' })}
        title={`${reviewModal.action === 'approved' ? '✅ Approve' : '❌ Reject'} Application`}
        size="sm"
      >
        {reviewModal.app && (
          <div>
            <div className="bg-gray-50 rounded-xl p-4 mb-4 space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-gray-500">Student</span><strong>{reviewModal.app.student?.name}</strong></div>
              <div className="flex justify-between"><span className="text-gray-500">Room</span><strong>{reviewModal.app.room?.roomNumber}</strong></div>
              <div className="flex justify-between"><span className="text-gray-500">Hostel</span><strong>{reviewModal.app.room?.hostel?.hostelName}</strong></div>
            </div>
            <div className="form-group mb-5">
              <label className="label">Remarks (optional)</label>
              <textarea className="input resize-none" rows={3}
                placeholder={reviewModal.action === 'rejected' ? 'Reason for rejection...' : 'Any notes for student...'}
                value={remarks} onChange={(e) => setRemarks(e.target.value)} />
            </div>
            <div className="flex gap-3">
              <button className="btn-secondary flex-1" onClick={() => setReviewModal({ open: false, app: null, action: '' })} disabled={processing}>Cancel</button>
              <button
                className={`flex-1 ${reviewModal.action === 'approved' ? 'btn-success' : 'btn-danger'}`}
                onClick={handleDecision} disabled={processing}
              >
                {processing ? 'Processing...' : reviewModal.action === 'approved' ? 'Approve' : 'Reject'}
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default AdminApplications;