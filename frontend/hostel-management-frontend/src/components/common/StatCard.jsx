const StatCard = ({ title, value, subtitle, icon: Icon, colorClass = 'bg-primary-50 text-primary-600' }) => (
  <div className="stat-card">
    <div className={`stat-icon ${colorClass}`}>
      {Icon && <Icon className="w-6 h-6" />}
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-xs font-medium text-gray-500 uppercase tracking-wider truncate">{title}</p>
      <p className="text-2xl font-bold text-gray-900 mt-0.5">{value ?? '—'}</p>
      {subtitle && <p className="text-xs text-gray-400 mt-0.5">{subtitle}</p>}
    </div>
  </div>
);

export default StatCard;