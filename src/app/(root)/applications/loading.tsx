export default function Loading() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-500 border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite] mb-4"></div>
        <div className="text-gray-600 text-lg">页面加载中，请稍后...</div>
      </div>
    </div>
  );
}