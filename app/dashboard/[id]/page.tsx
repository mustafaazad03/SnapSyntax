import Button from "@/components/Dashboard/Button";
import Snippets from "@/components/Dashboard/Snippets";
import Editor from "@/components/Editor";
import SetupStore from "@/components/Editor/SetupStore";
import { getSession } from "@/lib/auth";
import { cn } from "@/lib/cn";
import { prisma } from "@/lib/prisma";
import { serialize } from "@/lib/serialize";
import { notFound } from "next/navigation";

async function getSnippet(id: string) {
	return await prisma.snippet.findUnique({
		where: {
			id,
		},
		include: {
			views: true,
		},
	});
}

async function increaseViewCount(id: string) {
	return await prisma.view.update({
		where: {
			snippetId: id,
		},
		data: {
			count: {
				increment: 1,
			},
		},
	});
}

async function getSnippets(userId: string) {
	return await prisma.snippet.findMany({
		where: {
			userId,
		},
		include: {
			views: true,
		},
	});
}

export default async function Page({ params }: { params: { id: string } }) {
	const session = await getSession();

	const snippet = await getSnippet(params.id);
	const snippets = await getSnippets(session.user.id);

	let views;

	if (snippet) {
		views =
			session?.user?.id !== snippet.userId
				? await increaseViewCount(params.id)
				: snippet.views;
	}

	const editable = session?.user?.id === snippet?.userId;
	const isAuthenticated = !!session;

	if (!snippet) {
		notFound();
	}

	return (
		<>
			<SetupStore snippet={snippet} />
			<div className="flex">
				<div
					className={cn(
						"flex w-1/4 flex-col rounded-r-xl p-5",
						"border border-white/20 bg-black shadow-xl shadow-black/40"
					)}
				>
					<div className={cn("flex w-full items-center justify-between")}>
						<h2 className={cn("text-xl font-extrabold")}>Snippets</h2>

						<Button snippetCount={snippets.length} />
					</div>

					<Snippets snippets={serialize(snippets)} />
				</div>

				<Editor
					views={views?.count}
					editable={editable}
					isAuthenticated={isAuthenticated}
				/>
			</div>
		</>
	);
}
