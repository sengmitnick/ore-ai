/*
  Warnings:

  - A unique constraint covering the columns `[pwd]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `pwd` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `User` ADD COLUMN `pwd` VARCHAR(191) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `User_pwd_key` ON `User`(`pwd`);
