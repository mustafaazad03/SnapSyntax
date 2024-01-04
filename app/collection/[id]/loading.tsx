import Skeleton from "@/components/ui/Skeleton";

export default function Loading() {
	return (
		<div className="max-w-[85rem] h-[90vh] px-4 py-10 sm:px-6 lg:px-8 lg:py-6 mx-auto">
			<div className="relative p-6 md:p-16 md:py-10">
				<div className="relative z-10 lg:grid lg:grid-cols-12 lg:gap-16 lg:items-center">
					<div className="mb-10 lg:mb-0 lg:col-span-6 lg:col-start-8 lg:order-2">
						<h2 className="text-2xl text-gray-800 font-bold sm:text-3xl dark:text-gray-200">
							<Skeleton className="h-8 w-[200px]" />
						</h2>

						<nav className="grid gap-4 mt-5 md:mt-10">
							<div className="text-gray-800 text-center dark:text-gray-200">
								<Skeleton className="h-8 w-[200px] mx-auto mb-4" />
								<Skeleton className="h-8 w-[200px] mx-auto mb-4" />
							</div>
						</nav>
					</div>

					<div className="lg:col-span-6">
						<div className="relative">
							<div>
								<div>
									<Skeleton className="h-[500px] w-[500px]" />
								</div>
							</div>

							<div className="hidden absolute top-0 end-0 translate-x-20 md:block lg:translate-x-20">
								<Skeleton className="w-16 h-auto text-primary" />
							</div>
						</div>
					</div>
				</div>

				<div className="absolute inset-0 grid grid-cols-12 w-full h-full">
					<div className="col-span-full lg:col-span-7 lg:col-start-6 bg-gray-100 w-full h-5/6 rounded-xl sm:h-3/4 lg:h-full dark:bg-white/[.075]"></div>
				</div>
			</div>
		</div>
	);
}
