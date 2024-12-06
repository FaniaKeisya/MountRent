/*
  Warnings:

  - A unique constraint covering the columns `[uuid]` on the table `Alat` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[uuid]` on the table `DetailTransaksi` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[uuid]` on the table `Karyawan` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[uuid]` on the table `Transaksi` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[uuid]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `alat` ADD COLUMN `uuid` VARCHAR(191) NOT NULL DEFAULT '';

-- AlterTable
ALTER TABLE `detailtransaksi` ADD COLUMN `uuid` VARCHAR(191) NOT NULL DEFAULT '';

-- AlterTable
ALTER TABLE `karyawan` ADD COLUMN `uuid` VARCHAR(191) NOT NULL DEFAULT '';

-- AlterTable
ALTER TABLE `transaksi` ADD COLUMN `uuid` VARCHAR(191) NOT NULL DEFAULT '';

-- AlterTable
ALTER TABLE `user` ADD COLUMN `uuid` VARCHAR(191) NOT NULL DEFAULT '';

-- CreateIndex
CREATE UNIQUE INDEX `Alat_uuid_key` ON `Alat`(`uuid`);

-- CreateIndex
CREATE UNIQUE INDEX `DetailTransaksi_uuid_key` ON `DetailTransaksi`(`uuid`);

-- CreateIndex
CREATE UNIQUE INDEX `Karyawan_uuid_key` ON `Karyawan`(`uuid`);

-- CreateIndex
CREATE UNIQUE INDEX `Transaksi_uuid_key` ON `Transaksi`(`uuid`);

-- CreateIndex
CREATE UNIQUE INDEX `User_uuid_key` ON `User`(`uuid`);
