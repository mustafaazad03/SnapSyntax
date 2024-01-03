import { Menu, Transition } from "@headlessui/react";
import { CircleEllipsisIcon } from "lucide-react";
import Image from "next/image";
import { Fragment } from "react";
import { prisma } from "@/lib/prisma";
import { getSession } from "next-auth/react";

function classNames(...classes: any[]) {
	return classes.filter(Boolean).join(" ");
}

interface collectionSnippets {
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
	const session = await getSession();
	const fetchSnippet = async () => {
		return await prisma.snippet.findMany({
			where: { id: session?.user.id, stage: "public" },
		});
	};
	const snippets = await fetchSnippet();
	return (
		<div className="bg-white py-24 sm:py-32">
			<div className="mx-auto grid max-w-7xl grid-cols-1 gap-x-8 gap-y-12 px-6 sm:gap-y-16 lg:grid-cols-2 lg:px-8">
				<article className="mx-auto w-full max-w-2xl lg:mx-0 lg:max-w-lg">
					<time
						dateTime={collection?.createdAt.getDate().toString()}
						className="block text-sm leading-6 text-gray-600"
					>
						{collection?.createdAt.getDate().toString().slice(0, 15)}
					</time>
					<h2
						id="page-title"
						className="mt-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl"
					>
						{collection?.name}
					</h2>
					<p className="mt-4 text-lg leading-8 text-gray-600">
						{collection?.description}
					</p>
					<div className="mt-4 flex flex-col justify-between gap-6 sm:mt-8 sm:flex-row-reverse sm:gap-8 lg:mt-4 lg:flex-col">
						{/* button for adding multiple snippets to collection */}
						{collection?.userId.toString() === session?.user.id ? (
							<button
								onClick={async () => {
									await fetch(`/api/collection/`, {
										method: "POST",
										body: JSON.stringify({
											collectionId: collection?.id,
											snippets: snippets,
										}),
									});
									window === undefined ? null : window.location.reload();
								}}
								className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-gray-900 hover:bg-gray-800 md:py-4 md:text-lg md:px-10"
							>
								Add snippet
							</button>
						) : null}
						<div className="flex lg:border-t lg:border-gray-900/10 lg:pt-8">
							<div className="flex gap-x-2.5 text-sm font-semibold leading-6 text-gray-900">
								{collection?.userId.toString() === session?.user.id ? (
									<p className="text-gray-900">You</p>
								) : (
									<p className="text-gray-900">{collection?.user?.name}</p>
								)}
							</div>
						</div>
					</div>
				</article>
				<div className="mx-auto w-full max-w-2xl border-t border-gray-900/10 pt-12 sm:pt-16 lg:mx-0 lg:max-w-none lg:border-t-0 lg:pt-0">
					<ul role="list" className="divide-y divide-gray-100">
						{collection?.snippets?.map((snippet: collectionSnippets) => (
							<li
								key={snippet.id}
								className="flex items-center justify-between gap-x-6 py-5"
							>
								<div className="min-w-0">
									<div className="flex items-start gap-x-3">
										<p className="text-sm font-semibold leading-6 text-gray-900">
											{snippet?.title}
										</p>
									</div>
								</div>
								<div className="flex flex-none items-center gap-x-4">
									<a
										href={`/${snippet.id}`}
										className="hidden rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:block"
									>
										View snippet
										<span className="sr-only">, {snippet.title}</span>
									</a>
									<Menu as="div" className="relative flex-none">
										<Menu.Button className="-m-2.5 block p-2.5 text-gray-500 hover:text-gray-900">
											<span className="sr-only">Open options</span>
											<CircleEllipsisIcon
												className="h-5 w-5"
												aria-hidden="true"
											/>
										</Menu.Button>
										<Transition
											as={Fragment}
											enter="transition ease-out duration-100"
											enterFrom="transform opacity-0 scale-95"
											enterTo="transform opacity-100 scale-100"
											leave="transition ease-in duration-75"
											leaveFrom="transform opacity-100 scale-100"
											leaveTo="transform opacity-0 scale-95"
										>
											<Menu.Items className="absolute right-0 z-10 mt-2 w-32 origin-top-right rounded-md bg-white py-2 shadow-lg ring-1 ring-gray-900/5 focus:outline-none">
												{/* <Menu.Item>
													{({ active }) => (
														<a
															href="#"
															className={classNames(
																active ? "bg-gray-50" : "",
																"block px-3 py-1 text-sm leading-6 text-gray-900"
															)}
														>
															Edit
															<span className="sr-only">, {snippet.title}</span>
														</a>
													)}
												</Menu.Item> */}
												<Menu.Item>
													{({ active }) => (
														<button
															onClick={async () => {
																await fetch(`/api/removeSnippet/`, {
																	method: "DELETE",
																	body: JSON.stringify({
																		id: snippet.id,
																	}),
																});
																window === undefined
																	? null
																	: window.location.reload();
															}}
															className={classNames(
																active ? "bg-gray-50" : "",
																"block px-3 py-1 text-sm leading-6 text-gray-900"
															)}
														>
															Delete
															<span className="sr-only">, {snippet.title}</span>
														</button>
													)}
												</Menu.Item>
											</Menu.Items>
										</Transition>
									</Menu>
								</div>
							</li>
						))}
					</ul>
				</div>
			</div>
		</div>
	);
}
