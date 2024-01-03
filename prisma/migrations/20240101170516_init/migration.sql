-- AlterTable
ALTER TABLE "snippets" ADD COLUMN     "collectionId" TEXT,
ADD COLUMN     "stage" TEXT NOT NULL DEFAULT 'private';

-- CreateTable
CREATE TABLE "collections" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "collections_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "snippets" ADD CONSTRAINT "snippets_collectionId_fkey" FOREIGN KEY ("collectionId") REFERENCES "collections"("id") ON DELETE SET NULL ON UPDATE CASCADE;
