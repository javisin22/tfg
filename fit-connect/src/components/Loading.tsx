import { Loader2 } from 'lucide-react';

export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center h-[calc(100vh-120px)] bg-slate-700">
      <Loader2 className="h-12 w-12 animate-spin text-blue-500" />
      <p className="mt-4 text-lg font-medium text-white">Loading...</p>
    </div>
  );
}
