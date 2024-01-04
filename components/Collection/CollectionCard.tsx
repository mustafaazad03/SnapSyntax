import Image from "next/image";
import React from "react";
import { prisma } from "@/lib/prisma";

export const CollectionCard = async () => {
	const fetchAllCollection = async () => {
		try {
			return await prisma.collection.findMany({
				include: {
					user: true,
					snippets: true,
				},
			});
		} catch (error) {
			throw new Error(error as string);
		}
	};
	const collections = await fetchAllCollection();
	return (
		<div className="max-w-[85rem] px-4 py-10 sm:px-6 lg:px-8 lg:py-14 mx-auto">
			<div className="grid lg:grid-cols-2 lg:gap-y-16 gap-10">
				{collections.map((collection) => (
					<a
						key={collection.id}
						className="group rounded-xl overflow-hidden dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600 border border-white"
						href={`/collection/${collection.id}`}
					>
						<div className="grow mt-4 sm:mt-0 sm:ms-6 p-4 sm:px-0">
							<h3 className="text-xl font-semibold text-gray-800 group-hover:text-gray-600 dark:text-gray-300 dark:group-hover:text-white">
								{collection.name}
							</h3>
							<p className="mt-3 text-gray-600 dark:text-gray-400">
								{collection.description}
							</p>
							<div className="mt-3 sm:mt-6 flex items-center">
								<div className="flex-shrink-0">
									<Image
										width={500}
										height={500}
										className="h-10 w-10 sm:h-14 sm:w-14 rounded-full"
										src={collection.user.image as string}
										alt={collection.user.name as string}
									/>
								</div>

								<div className="ms-3 sm:ms-4">
									<p className="sm:mb-1 font-semibold text-gray-800 dark:text-gray-200">
										{collection.user.name}
									</p>
									<p className="text-xs text-gray-500">
										{collection.user.email}
									</p>
								</div>
							</div>
							<p className="mt-4 inline-flex items-center gap-x-1 text-blue-600 decoration-2 hover:underline font-medium">
								<span>View Collection</span>
								<svg
									className="flex-shrink-0 w-4 h-4"
									xmlns="http://www.w3.org/2000/svg"
									width="24"
									height="24"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									strokeWidth="2"
									strokeLinecap="round"
									strokeLinejoin="round"
								>
									<path d="m9 18 6-6-6-6" />
								</svg>
							</p>
						</div>
					</a>
				))}
			</div>
		</div>
	);
};
