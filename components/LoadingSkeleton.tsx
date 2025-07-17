import { Skeleton } from "@/components/ui/skeleton";
import { CardSkeleton } from "@/components/ui/CardSkeleton";

interface LoadingSkeletonProps {
  pageSize: number;
}

export function LoadingSkeleton({ pageSize }: LoadingSkeletonProps) {
  return (
    <div className="container mx-auto px-4 py-4">
      <div className="mb-6 max-w-2xl mx-auto">
        <Skeleton className="h-6 w-48 mb-2" />
        <Skeleton className="h-10 w-full" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {Array.from({ length: pageSize }).map((_, index) => (
          <CardSkeleton key={index} />
        ))}
      </div>
    </div>
  );
}
