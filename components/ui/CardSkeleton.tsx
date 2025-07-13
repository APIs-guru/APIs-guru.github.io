import { Skeleton } from "@/components/ui/skeleton";

export function CardSkeleton() {
  return (
    <div className="border border-gray-200 rounded-md bg-[#eee] overflow-hidden h-full">
      {/* Header */}
      <div className="text-center p-4 pb-2">
        <Skeleton className="h-6 w-3/4 mx-auto mb-2" />
        <Skeleton className="h-4 w-16 mx-auto" />
      </div>

      {/* Content */}
      <div className="p-[15px] bg-white flex-grow flex flex-col justify-between">
        <div>
          {/* Logo */}
          <Skeleton className="w-[80px] h-[80px] mx-auto mb-4 rounded" />

          {/* Description lines */}
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-4/5" />
            <Skeleton className="h-4 w-3/5" />
          </div>
        </div>
      </div>
    </div>
  );
}
