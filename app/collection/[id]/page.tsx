import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { getSession } from "next-auth/react";
import ModelAddSnippets from "@/components/Collection/ModelAddSnippets";

function classNames(...classes: any[]) {
	return classes.filter(Boolean).join(" ");
}

export interface collectionSnippets {
	id: string;
	title: string | null;
	code: string | null;
	language: string;
	theme: string;
	fontFamily: string;
	fontSize: string;
	lineNumbers: boolean;
	padding: string;
	userId: string;
}

const fetchCollection = async (id: string) => {
	return await prisma.collection.findUnique({
		where: { id },
		include: {
			user: true,
			snippets: true,
		},
	});
};

export default async function Page({ params }: { params: { id: string } }) {
	const collection = await fetchCollection(params.id);
	const fetchSnippet = async () => {
		const session = await getSession();
		return await prisma.snippet.findMany({
			where: { id: session?.user.id, stage: "public" },
		});
	};
	const snippets = await fetchSnippet();
	return (
		<div className="max-w-[85rem] h-[90vh] px-4 py-10 sm:px-6 lg:px-8 lg:py-6 mx-auto">
			<div className="relative p-6 md:p-16 md:py-10">
				<div className="relative z-10 lg:grid lg:grid-cols-12 lg:gap-16 lg:items-center">
					<div className="mb-10 lg:mb-0 lg:col-span-6 lg:col-start-8 lg:order-2">
						<h2 className="text-2xl text-gray-800 font-bold sm:text-3xl dark:text-gray-200">
							Collection Name : {collection?.name}
						</h2>

						<nav className="grid gap-4 mt-5 md:mt-10">
							<ModelAddSnippets />
							{snippets.length === 0 ? (
								<div className="text-gray-800 text-center dark:text-gray-200">
									No Snippets Found
								</div>
							) : (
								snippets.map((snippet: collectionSnippets) => (
									<button
										key={snippet.id}
										type="button"
										className="hs-tab-active:bg-white hs-tab-active:shadow-md hs-tab-active:hover:border-transparent text-start hover:bg-gray-200 p-4 md:p-5 rounded-xl dark:hs-tab-active:bg-slate-900 dark:hover:bg-gray-700 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600 active"
										id="tabs-with-card-item-1"
										data-hs-tab="#tabs-with-card-1"
										aria-controls="tabs-with-card-1"
										role="tab"
									>
										<span className="flex">
											<span className="grow ms-6">
												<span className="block text-lg font-semibold hs-tab-active:text-blue-600 text-gray-800 dark:hs-tab-active:text-blue-500 dark:text-gray-200">
													{snippet.title}
												</span>
												<span className="block mt-1 text-gray-800 dark:hs-tab-active:text-gray-200 dark:text-gray-200">
													{snippet.language}
												</span>
												<span className="block mt-1 text-gray-800 dark:hs-tab-active:text-gray-200 dark:text-gray-200">
													{snippet.lineNumbers}
												</span>
											</span>
										</span>
									</button>
								))
							)}
						</nav>
					</div>

					<div className="lg:col-span-6">
						<div className="relative">
							<div>
								<div>
									<Image
										width={500}
										height={500}
										className="shadow-xl shadow-gray-200 rounded-xl dark:shadow-gray-900/[.2]"
										src="https://images.unsplash.com/photo-1605629921711-2f6b00c6bbf4?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=987&h=1220&q=80"
										alt="Image Description"
									/>
								</div>
							</div>

							<div className="hidden absolute top-0 end-0 translate-x-20 md:block lg:translate-x-20">
								<svg
									className="w-16 h-auto text-primary"
									width="121"
									height="135"
									viewBox="0 0 121 135"
									fill="none"
									xmlns="http://www.w3.org/2000/svg"
								>
									<path
										d="M5 16.4754C11.7688 27.4499 21.2452 57.3224 5 89.0164"
										stroke="currentColor"
										strokeWidth="10"
										strokeLinecap="round"
									/>
									<path
										d="M33.6761 112.104C44.6984 98.1239 74.2618 57.6776 83.4821 5"
										stroke="currentColor"
										strokeWidth="10"
										strokeLinecap="round"
									/>
									<path
										d="M50.5525 130C68.2064 127.495 110.731 117.541 116 78.0874"
										stroke="currentColor"
										strokeWidth="10"
										strokeLinecap="round"
									/>
								</svg>
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
