"use client";
import { cn } from "@/lib/cn";
import { useSession } from "next-auth/react";
import Message from "./Message";
import Social from "./Social";
import Help from "./Help";
import Auth from "./Auth";
import Image from "next/image";
import Link from "next/link";

export default function Header() {
	const { status: sessionStatus } = useSession();

	return (
		<header
			className={cn(
				"sticky top-0 z-40 flex h-16 items-center justify-between px-[18px] font-medium",
				"border-b border-white bg-black shadow-xl shadow-black/40"
			)}
		>
			<Link href="/">
				<Image
					src="/snapsyntaxlogowhite.png"
					width={70}
					height={70}
					alt="Logo Snap Syntax"
				/>
			</Link>
			<Message />

			{sessionStatus !== "loading" && (
				<div className={cn("flex items-center justify-center")}>
			<Link
				href="/collection"
				className="align-middle ml-2 select-none font-sans font-bold text-center uppercase transition-all disabled:opacity-50 disabled:shadow-none disabled:pointer-events-none text-xs py-3 px-6 rounded-lg bg-gray-900 text-white shadow-md shadow-gray-900/10 hover:shadow-lg hover:shadow-gray-900/20 focus:opacity-[0.90] focus:shadow-none active:opacity-[0.85] active:shadow-none"
			>
				Collections
			</Link>
					<Social />
					<Help />
					<Auth />
				</div>
			)}
		</header>
	);
}
