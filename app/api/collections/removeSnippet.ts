import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
const prisma = new PrismaClient();

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	if (req.method === "DELETE") {
		const { snippetId } = JSON.parse(req.body);

		try {
			// Update the snippet's collectionId to null
			const updatedSnippet = await prisma.snippet.update({
				where: { id: snippetId },
				data: { collectionId: null },
			});

			res.status(200).json(updatedSnippet);
		} catch (error) {
			console.error(error);
			res.status(500).json({ error: "Internal Server Error" });
		}
	} else {
		res.status(405).json({ error: "Method Not Allowed" });
	}
}
