export default function Loading() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Background dengan gambar */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('/loading-bg.jpg')",
        }}
      />

      {/* Overlay untuk membuat teks lebih terbaca */}
      <div className="absolute inset-0 bg-black/30" />

      {/* Loading content */}
      <div className="relative z-10 flex flex-col items-center space-y-6 text-center px-4">
        {/* Logo atau icon */}
        <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-lg">
          <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center">
            <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
            </svg>
          </div>
        </div>

        {/* Spinner */}
        <div className="relative">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-white/20 border-t-white"></div>
          <div className="absolute inset-0 animate-pulse rounded-full h-16 w-16 border-4 border-green-400/40"></div>
        </div>

        {/* Text */}
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-white drop-shadow-lg">iKILO</h2>
          <p className="text-white/90 text-lg drop-shadow">Loading fresh vegetables...</p>
        </div>

        {/* Progress bar (opsional) */}
        <div className="w-64 bg-white/20 rounded-full h-2 overflow-hidden">
          <div className="bg-gradient-to-r from-green-400 to-green-600 h-full rounded-full animate-pulse"></div>
        </div>
      </div>
    </div>
  )
}
