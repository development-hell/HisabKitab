import Skeleton from "./Skeleton";

export default function ProtectedSkeleton() {
	return (
		<div className="flex h-screen">
			{/* Sidebar Skeleton */}
			<div className="w-64 bg-surface border-r border-base p-4 space-y-4 hidden md:block">
				<Skeleton className="h-8 w-32" />
				<Skeleton className="h-6 w-full" />
				<Skeleton className="h-6 w-3/4" />
				<Skeleton className="h-6 w-4/5" />
			</div>

			{/* Main Section */}
			<div className="flex-1 p-6 space-y-6">
				<Skeleton className="h-8 w-48" />
				<Skeleton className="h-48 w-full" />
				<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
					<Skeleton className="h-32 w-full" />
					<Skeleton className="h-32 w-full" />
					<Skeleton className="h-32 w-full" />
				</div>
			</div>
		</div>
	);
}
