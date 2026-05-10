import useNotifications from '../../hooks/useNotifications.js';
import Spinner from '../../components/common/Spinner.jsx';
import EmptyState from '../../components/common/EmptyState.jsx';
import { formatDateTime } from '../../utils/index.js';
import { FiBell, FiCheckCircle } from 'react-icons/fi';

const Notifications = () => {
  const { notifications, unread, loading, markAllRead } = useNotifications();

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Notifications</h1>
          <p className="page-subtitle">{unread > 0 ? `${unread} unread` : 'All caught up!'}</p>
        </div>
        {unread > 0 && (
          <button className="btn-secondary btn-sm" onClick={markAllRead}>
            <FiCheckCircle /> Mark all as read
          </button>
        )}
      </div>

      {loading ? (
        <div className="flex justify-center py-16"><Spinner size="lg" /></div>
      ) : notifications.length === 0 ? (
        <EmptyState icon={FiBell} title="No notifications" description="You'll see application updates here." />
      ) : (
        <div className="space-y-3">
          {notifications.map((n) => (
            <div
              key={n.id}
              className={`card flex gap-4 transition-colors
                ${!n.isRead ? 'border-l-4 border-l-primary-500 bg-primary-50/30' : ''}`}
            >
              <div className={`w-9 h-9 rounded-full flex-shrink-0 flex items-center justify-center
                ${!n.isRead ? 'bg-primary-100' : 'bg-gray-100'}`}>
                <FiBell className={`w-4 h-4 ${!n.isRead ? 'text-primary-600' : 'text-gray-400'}`} />
              </div>
              <div className="flex-1 min-w-0">
                <p className={`text-sm leading-relaxed ${!n.isRead ? 'text-gray-800 font-medium' : 'text-gray-600'}`}>
                  {n.message}
                </p>
                <p className="text-xs text-gray-400 mt-1">{formatDateTime(n.createdAt)}</p>
              </div>
              {!n.isRead && (
                <div className="w-2.5 h-2.5 rounded-full bg-primary-600 mt-1 flex-shrink-0" />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Notifications;