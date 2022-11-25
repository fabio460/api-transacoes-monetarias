/*
  Warnings:

  - A unique constraint covering the columns `[idTransaction]` on the table `Accounts` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[idTransaction]` on the table `Users` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `idTransaction` to the `Accounts` table without a default value. This is not possible if the table is not empty.
  - Added the required column `idTransaction` to the `Users` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Accounts" ADD COLUMN     "idTransaction" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Users" ADD COLUMN     "idTransaction" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Accounts_idTransaction_key" ON "Accounts"("idTransaction");

-- CreateIndex
CREATE UNIQUE INDEX "Users_idTransaction_key" ON "Users"("idTransaction");

-- AddForeignKey
ALTER TABLE "Users" ADD CONSTRAINT "Users_idTransaction_fkey" FOREIGN KEY ("idTransaction") REFERENCES "Transactions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Accounts" ADD CONSTRAINT "Accounts_idTransaction_fkey" FOREIGN KEY ("idTransaction") REFERENCES "Transactions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
