/*
  Warnings:

  - You are about to drop the column `idKaryawan` on the `transaksi` table. All the data in the column will be lost.
  - You are about to alter the column `statusBayar` on the `transaksi` table. The data in that column could be lost. The data in that column will be cast from `Enum(EnumId(0))` to `Enum(EnumId(2))`.
  - You are about to drop the `karyawan` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `transaksi` DROP FOREIGN KEY `Transaksi_idKaryawan_fkey`;

-- AlterTable
ALTER TABLE `transaksi` DROP COLUMN `idKaryawan`,
    ADD COLUMN `tanggal_kembali` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    MODIFY `statusBayar` ENUM('LUNAS', 'BELUM_LUNAS') NOT NULL DEFAULT 'BELUM_LUNAS';

-- AlterTable
ALTER TABLE `user` ADD COLUMN `role` ENUM('KARYAWAN', 'CUSTOMER') NOT NULL DEFAULT 'CUSTOMER';

-- DropTable
DROP TABLE `karyawan`;
