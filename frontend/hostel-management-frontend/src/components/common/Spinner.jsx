const Spinner = ({ fullScreen = false, size = 'md', className = '' }) => {
  const sizes = { sm: 'w-4 h-4', md: 'w-8 h-8', lg: 'w-12 h-12' };

  const spinner = (
    <div className={`${sizes[size]} animate-spin rounded-full border-4 border-primary-100 border-t-primary-600 ${className}`} />
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-sm">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 animate-spin rounded-full border-4 border-primary-100 border-t-primary-600" />
          <p className="text-sm text-gray-500 font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  return spinner;
};

export default Spinner;