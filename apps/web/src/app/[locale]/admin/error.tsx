"use client";

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[30vh] gap-4">
      <h1 className="text-xl font-bold">Something went wrong</h1>
      <p className="text-gray-600">{error.message}</p>
      <button onClick={reset} className="px-4 py-2 rounded-lg font-medium bg-blue-600 text-white hover:bg-blue-700">
        Try again
      </button>
    </div>
  );
}
