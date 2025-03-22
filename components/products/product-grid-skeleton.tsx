import { Skeleton } from '@/components/ui/skeleton';

export default function ProductGridSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {Array.from({ length: 12 }).map((_, i) => (
        <div key={i} className="aspect-square overflow-hidden rounded-lg border border-gray-200 bg-white">
          <div className="relative h-full w-full">
            <Skeleton className="h-full w-full" />
            <div className="absolute bottom-0 left-0 right-0 p-4 space-y-2">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
} 