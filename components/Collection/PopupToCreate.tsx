"use client";
import { Fragment, useRef, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { CubeIcon } from "@radix-ui/react-icons";
import { useRouter } from "next/navigation";
import { useHotkeys } from "react-hotkeys-hook";
import useSWRMutation from "swr/mutation";
import { Plus, Check, X } from "lucide-react";
import Loader from "../ui/Loader";
import { fetcher } from "@/lib/fetcher";
import { cn } from "@/lib/cn";

// Define button types and configurations
type ButtonType = "DEFAULT" | "SUCCESS" | "ERROR";

interface Button {
	id: string;
	text: string;
	icon: JSX.Element;
	additionClasses: string;
}

const buttons: Record<ButtonType, Button> = {
	DEFAULT: {
		id: "default",
		text: "Create Collection",
		icon: <Plus size={16} aria-hidden="true" />,
		additionClasses:
			"border-white/20 bg-black hover:bg-white hover:text-black disabled:opacity-80 disabled:cursor-not-allowed",
	},
	SUCCESS: {
		id: "success",
		text: "Created",
		icon: <Check size={16} aria-hidden="true" />,
		additionClasses: "border-green-400/20 text-green-400 bg-green-500/20",
	},
	ERROR: {
		id: "error",
		text: "Error",
		icon: <X size={16} aria-hidden="true" />,
		additionClasses: "border-red-400/20 text-red-400 bg-red-500/20",
	},
};

export default function PopupToCreate() {
	const [open, setOpen] = useState(false);

	const cancelButtonRef = useRef(null);

	const [buttonState, setButtonState] = useState<ButtonType>("DEFAULT");
	const [collectionInfo, setCollectionInfo] = useState({
		name: "",
		description: "",
	});

	const router = useRouter();

	const { trigger: createCollection, isMutating: createLoading } =
		useSWRMutation("/api/collections", (url) =>
			fetcher(url, {
				method: "POST",
				body: JSON.stringify(collectionInfo),
			})
		);

	const handleAction = async () => {
		try {
			const { id } = await createCollection();
			setButtonState("SUCCESS");

			router.push(`/collection/${id}`);
		} catch (e) {
			console.error(e);
			setButtonState("ERROR");
		} finally {
			const timer = setTimeout(() => setButtonState("DEFAULT"), 2500);

			return () => clearTimeout(timer);
		}
	};

	useHotkeys(
		"c",
		() => {
			if (!createLoading && buttons[buttonState].id === "default") {
				handleAction();
			}
		},
		{
			preventDefault: true,
		}
	);

	return (
		<>
			<button
				onClick={() => setOpen(true)}
				className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
			>
				Create Collection
			</button>
			<Transition.Root show={open} as={Fragment}>
				<Dialog
					as="div"
					className="relative z-10"
					initialFocus={cancelButtonRef}
					onClose={setOpen}
				>
					<Transition.Child
						as={Fragment}
						enter="ease-out duration-300"
						enterFrom="opacity-0"
						enterTo="opacity-100"
						leave="ease-in duration-200"
						leaveFrom="opacity-100"
						leaveTo="opacity-0"
					>
						<div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
					</Transition.Child>

					<div className="fixed inset-0 z-10 w-screen overflow-y-auto">
						<div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
							<Transition.Child
								as={Fragment}
								enter="ease-out duration-300"
								enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
								enterTo="opacity-100 translate-y-0 sm:scale-100"
								leave="ease-in duration-200"
								leaveFrom="opacity-100 translate-y-0 sm:scale-100"
								leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
							>
								<Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-black px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
									<div className="sm:flex sm:items-start">
										<div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full sm:mx-0 sm:h-10 sm:w-10">
											<CubeIcon
												className="h-6 w-6 text-blue-400"
												aria-hidden="true"
											/>
										</div>
										<div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
											<Dialog.Title
												as="h3"
												className="text-base font-semibold leading-6 text-gray-100"
											>
												Create New Collection
											</Dialog.Title>
											<div className="mt-2">
												<input
													type="text"
													name="name"
													onChange={(e) =>
														setCollectionInfo({
															...collectionInfo,
															name: e.target.value,
														})
													}
													className="w-full border p-2 border-gray-300 rounded-md bg-transparent placeholder:text-gray-300 text-gray-300"
													placeholder="Name of collection"
												/>
												<input
													type="text"
													name="description"
													onChange={(e) =>
														setCollectionInfo({
															...collectionInfo,
															description: e.target.value,
														})
													}
													className="w-full border p-2 border-gray-300 rounded-md mt-2 bg-transparent placeholder:text-gray-300 text-gray-300"
													placeholder="Description (optional)"
												/>
											</div>
										</div>
									</div>
									<div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
										<button
											type="button"
											onClick={() => handleAction()}
											disabled={
												(createLoading ||
													buttons[buttonState].id !== "default") &&
												collectionInfo.name.trim() === ""
											}
											className={cn(
												"flex w-auto items-center gap-4 rounded-lg p-1 font-medium",
												"select-none outline-none ml-2",
												"border",
												"transition-all duration-100 ease-in-out",
												buttons[buttonState].additionClasses,
												"focus:border-amlost-white focus:text-amlost-white",
												"disabled:cursor-not-allowed"
											)}
										>
											<div className={cn("flex items-center gap-2 pl-0.5")}>
												{createLoading ? <Loader /> : buttons[buttonState].icon}
												{buttons[buttonState].text}
											</div>
										</button>
										<button
											type="button"
											className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
											onClick={() => setOpen(false)}
											ref={cancelButtonRef}
										>
											Cancel
										</button>
									</div>
								</Dialog.Panel>
							</Transition.Child>
						</div>
					</div>
				</Dialog>
			</Transition.Root>
		</>
	);
}
