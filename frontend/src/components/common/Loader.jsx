const Loader = ({ size = 'md', fullScreen = false }) => {
  const sizes = {
    sm: 'w-6 h-6',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
  };

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-gradient-to-br from-[#0f0f0f] via-[#1a1a2e] to-[#16213e] flex items-center justify-center z-50">
        <div className="text-center">
          <div className={`spinner ${sizes[size]} mx-auto mb-4`} />
          <p className="text-gray-400 animate-pulse">جاري التحميل...</p>
        </div>
      </div>
    );
  }

  return <div className={`spinner ${sizes[size]}`} />;
};

export default Loader;
