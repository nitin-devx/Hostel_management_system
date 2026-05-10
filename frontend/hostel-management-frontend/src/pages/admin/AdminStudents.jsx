import { useEffect, useState } from 'react';
import useApi from '../../hooks/useApi.js';
import { adminApi } from '../../api/index.js';
import Spinner from '../../components/common/Spinner.jsx';
import EmptyState from '../../components/common/EmptyState.jsx';
import ConfirmDialog from '../../components/common/ConfirmDialog.jsx';
import { formatDate } from '../../utils/index.js';
import toast from 'react-hot-toast';
import { FiUsers, FiTrash2, FiSearch } from 'react-icons/fi';

const AdminStudents = () => {
  const { data, loading, execute } = useApi(adminApi.getStudents);
  const [search, setSearch]         = useState('');
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting]     = useState(false);

  useEffect(() => { execute(); }, []);

  const students = (data?.students || []).filter(
    (s) => s.name.toLowerCase().includes(search.toLowerCase()) || s.email.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await adminApi.deleteStudent(deleteTarget.id);
      toast.success('Student removed');
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
          <h1 className="page-title">Students</h1>
          <p className="page-subtitle">{students.length} registered student(s)</p>
        </div>
        <div className="relative w-64">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            className="input pl-9 text-sm"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-16"><Spinner size="lg" /></div>
      ) : students.length === 0 ? (
        <EmptyState icon={FiUsers} title="No students found" description={search ? 'Try a different search term.' : 'No students registered yet.'} />
      ) : (
        <div className="table-wrapper">
          <table className="table">
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Email</th>
                <th>Joined</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {students.map((s, i) => (
                <tr key={s.id}>
                  <td className="text-gray-400 text-xs">{i + 1}</td>
                  <td>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-bold text-xs flex-shrink-0">
                        {s.name[0].toUpperCase()}
                      </div>
                      <span className="font-medium text-gray-900">{s.name}</span>
                    </div>
                  </td>
                  <td className="text-gray-500">{s.email}</td>
                  <td className="text-gray-500 text-xs">{formatDate(s.createdAt)}</td>
                  <td>
                    <button onClick={() => setDeleteTarget(s)} className="btn-danger btn-sm p-1.5">
                      <FiTrash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Remove Student"
        message={`Remove "${deleteTarget?.name}" (${deleteTarget?.email}) from the system? All their applications will also be deleted.`}
        confirmText="Remove Student"
        danger
        loading={deleting}
      />
    </div>
  );
};

export default AdminStudents;