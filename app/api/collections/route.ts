import { getSession } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";
import { limiter } from "@/lib/limiter";
import { prisma } from "@/lib/prisma";
import { prepare } from "@/lib/prepare";

const ratelimit = limiter();

export async function PATCH(req: NextRequest) {
	const session = await getSession();

	const body = await req.json();

	const { allowed } = await ratelimit.check(30, "UPDATE_COLLECTION");

	if (!session || !session.user.id) {
		return NextResponse.json(
			{
				code: "UNAUTHORIZED",
			},
			{
				status: 403,
			}
		);
	}

	if (!allowed) {
		return NextResponse.json(
			{
				code: "TOO_MANY_REQUESTS",
			},
			{
				status: 429,
			}
		);
	}

	try {
		const updatedCollection = await prisma.collection.update({
			where: {
				id: body.collectionId,
				userId: session.user.id,
			},
			data: prepare(body),
		});

		return NextResponse.json(updatedCollection, { status: 200 });
	} catch (e) {
		console.log(e);
		return NextResponse.json(
			{
				code: "INTERNAL_SERVER_ERROR",
			},
			{
				status: 500,
			}
		);
	}
}

export async function POST(req: NextRequest) {
	const session = await getSession();

	const body = await req.json();

	const { allowed } = await ratelimit.check(30, "CREATE_COLLECTION");

	if (!session || !session.user.id) {
		return NextResponse.json(
			{
				code: "UNAUTHORIZED",
			},
			{
				status: 403,
			}
		);
	}

	if (!allowed) {
		return NextResponse.json(
			{
				code: "TOO_MANY_REQUESTS",
			},
			{
				status: 429,
			}
		);
	}

	try {
		const createdCollection = await prisma.collection.create({
			data: {
				userId: session.user.id,
				name: body.name,
				description: body?.description,
			},
		});

		return NextResponse.json(createdCollection, { status: 200 });
	} catch (e) {
		return NextResponse.json(
			{
				code: "INTERNAL_SERVER_ERROR",
			},
			{
				status: 500,
			}
		);
	}
}

export async function DELETE(req: NextRequest) {
	const { searchParams } = new URL(req.url);
	const collectionId = searchParams.get("collectionId");

	const session = await getSession();

	if (!session || !session.user.id) {
		return NextResponse.json(
			{
				code: "UNAUTHORIZED",
			},
			{
				status: 403,
			}
		);
	}

	try {
		const deletedCollection = await prisma.collection.delete({
			where: {
				id: collectionId as string,
				userId: session.user.id,
			},
			select: {
				id: true,
			},
		});

		return NextResponse.json(deletedCollection, { status: 200 });
	} catch (e) {
		console.log(e);
		return NextResponse.json(
			{
				code: "INTERNAL_SERVER_ERROR",
			},
			{
				status: 500,
			}
		);
	}
}

export async function PUT(req: NextRequest) {
	const session = await getSession();

	const body = await req.json();

	const { allowed } = await ratelimit.check(30, "ADD_SNIPPET_TO_COLLECTION");

	if (!session || !session.user.id) {
		return NextResponse.json(
			{
				code: "UNAUTHORIZED",
			},
			{
				status: 403,
			}
		);
	}

	if (!allowed) {
		return NextResponse.json(
			{
				code: "TOO_MANY_REQUESTS",
			},
			{
				status: 429,
			}
		);
	}

	try {
		const updatedCollection = await prisma.collection.update({
			where: {
				id: body.collectionId,
				userId: session.user.id,
			},
			data: {
				snippets: {
					connect: body.snippetIds.map((id: string) => ({
						id,
					})),
				},
			},
		});

		return NextResponse.json(updatedCollection, { status: 200 });
	} catch (e) {
		console.log(e);
		return NextResponse.json(
			{
				code: "INTERNAL_SERVER_ERROR",
			},
			{
				status: 500,
			}
		);
	}
}
