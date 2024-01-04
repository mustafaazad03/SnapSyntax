"use client";
import { collectionSnippets } from "@/app/collection/[id]/page";
import React, { useEffect } from "react";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { useState } from "react";
import { XIcon } from "lucide-react";

const ModelAddSnippets = () => {
	const [snippets, setSnippets] = useState<collectionSnippets[] | null>(null);
	const [isModalOpen, setIsModalOpen] = useState(false);
	useEffect(() => {
		const fetchSnippet = async () => {
			const session = await getSession();
			try {
				const snippetsData = await prisma.snippet.findMany({
					where: { id: session?.user.id, stage: "public" },
				});
				setSnippets(snippetsData);
			} catch (error) {
				console.error("Error fetching snippets:", error);
			}
		};
		fetchSnippet();
	}, []);

	const openModal = () => {
		setIsModalOpen(true);
	};

	const closeModal = () => {
		setIsModalOpen(false);
	};

	return (
		<div>
			<div className="text-center">
				<button
					type="button"
					onClick={openModal}
					className="py-3 px-4 inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600"
				>
					Add Snippets
				</button>
			</div>
			{isModalOpen && (
				<div className="w-full h-full fixed top-1/3 start-0 z-[60] overflow-x-hidden overflow-y-auto">
					<div className="mt-7 opacity-100 duration-500 ease-out transition-all sm:max-w-lg sm:w-full m-3 sm:mx-auto">
						<div className="bg-white border border-gray-200 rounded-xl shadow-sm dark:bg-gray-800 dark:border-gray-700">
							<div className="p-1 sm:p-2 sm:px-4">
					<XIcon
						className="relative top-0 right-0 h-6 w-6 m-4 cursor-pointer dark:text-white"
						onClick={closeModal}
					/>
								<div className="">
									<form>
										<div className="grid gap-y-4">
											<div>
												<label
													htmlFor="snippets"
													className="block text-sm mb-2 dark:text-white"
												>
													Snippets
												</label>
												<select
													id="snippets"
													name="snippets"
													className="block w-full border p-2 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
													defaultValue="Select Public Snippets"
												>
													<option value="">
														Select a snippet
													</option>
													{snippets?.map((snippet: collectionSnippets) => (
														<option
															key={snippet?.id}
															value={snippet.title as string}
															className=""
														>
															{snippet?.title}
														</option>
													))}
												</select>
											</div>

											<button
												type="submit"
												className="w-full py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600"
											>
												Add Snippets
											</button>
										</div>
									</form>
								</div>
							</div>
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

export default ModelAddSnippets;
