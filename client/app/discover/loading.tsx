export default function Loading() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Skeleton */}
      <div className="bg-gradient-to-r from-brand-purple to-brand-pink py-8">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="h-8 bg-white/20 rounded-lg w-48 mx-auto mb-2"></div>
            <div className="h-4 bg-white/20 rounded-lg w-64 mx-auto mb-4"></div>
            <div className="flex justify-center gap-4">
              <div className="h-6 bg-white/20 rounded-lg w-20"></div>
              <div className="h-6 bg-white/20 rounded-lg w-24"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Skeleton */}
      <div className="container mx-auto px-4 py-4">
        <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
          <div className="h-10 bg-gray-200 rounded-lg mb-3"></div>
          <div className="flex gap-2">
            <div className="h-8 bg-gray-200 rounded-lg w-24"></div>
            <div className="h-8 bg-gray-200 rounded-lg w-24"></div>
          </div>
        </div>

        <div className="space-y-3">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white border border-gray-100 rounded-lg p-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gray-200 rounded-full flex-shrink-0"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded w-32 mb-1"></div>
                  <div className="h-3 bg-gray-200 rounded w-24 mb-2"></div>
                  <div className="flex gap-1 mb-2">
                    <div className="h-5 bg-gray-200 rounded-full w-16"></div>
                    <div className="h-5 bg-gray-200 rounded-full w-16"></div>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex gap-3">
                      <div className="h-3 bg-gray-200 rounded w-12"></div>
                      <div className="h-3 bg-gray-200 rounded w-12"></div>
                      <div className="h-3 bg-gray-200 rounded w-12"></div>
                    </div>
                    <div className="h-6 bg-gray-200 rounded w-12"></div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
