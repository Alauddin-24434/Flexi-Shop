/*
  Warnings:

  - A unique constraint covering the columns `[productId]` on the table `FlashSale` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Product" ALTER COLUMN "discount" SET DEFAULT 0;

-- CreateIndex
CREATE UNIQUE INDEX "FlashSale_productId_key" ON "FlashSale"("productId");
