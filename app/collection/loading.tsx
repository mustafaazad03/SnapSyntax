import React from "react";
import Skeleton from "@/components/ui/Skeleton";

const Loading = () => {
	const skeletonStyle = "h-4 w-36 mb-4";

	return (
		<>
			<div className="mx-auto max-w-7xl xl:w-full w-[90%] pt-20 pb-12">
				<section className="min-h-96 relative flex flex-1 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-gray-100 py-16 shadow-lg md:py-20 xl:py-48">
					<Skeleton className="absolute inset-0 h-full w-full object-cover object-center" />
					<div className="absolute inset-0 bg-almost-black mix-blend-multiply"></div>
					<div
						className={`relative flex flex-col items-center p-4 text-white sm:max-w-4xl`}
					>
						<Skeleton className={skeletonStyle} />
						<Skeleton className="mb-8 text-center text-4xl font-bold sm:text-5xl md:mb-12 md:text-6xl" />
						<Skeleton className={skeletonStyle} />
					</div>
				</section>
			</div>

			<div className="max-w-[85rem] px-4 py-10 sm:px-6 lg:px-8 lg:py-14 mx-auto">
				<div className="grid lg:grid-cols-2 lg:gap-y-16 gap-10">
					{[1, 2].map((index) => (
						<div
							key={index}
							className="group rounded-xl overflow-hidden dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600 border border-white"
						>
							<Skeleton className="h-56 w-full" />
							<div className="grow mt-4 sm:mt-0 sm:ms-6 p-4 sm:px-0">
								<Skeleton className={skeletonStyle} />
								<Skeleton className={skeletonStyle} />
								<Skeleton className={skeletonStyle} />
								<div className="mt-3 sm:mt-6 flex items-center">
									<Skeleton className="h-14 w-14 rounded-full" />
									<div className="ms-3 sm:ms-4">
										<Skeleton className={skeletonStyle} />
										<Skeleton className={skeletonStyle} />
									</div>
								</div>
								<Skeleton className={skeletonStyle} />
							</div>
						</div>
					))}
				</div>
			</div>
		</>
	);
};

export default Loading;
