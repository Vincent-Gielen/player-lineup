-- CreateTable
CREATE TABLE `players` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NOT NULL,
    `position` VARCHAR(255) NOT NULL,
    `user_id` INTEGER UNSIGNED NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `teams` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NOT NULL,
    `user_id` INTEGER UNSIGNED NOT NULL,

    UNIQUE INDEX `idx_team_name_user_id_unique`(`name`, `user_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `users` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NOT NULL,
    `email` VARCHAR(255) NOT NULL,
    `password_hash` VARCHAR(255) NOT NULL,
    `roles` JSON NOT NULL,

    UNIQUE INDEX `idx_user_email_unique`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `stats` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `player_id` INTEGER UNSIGNED NOT NULL,
    `points` INTEGER NOT NULL,
    `rebounds` INTEGER NOT NULL,
    `assists` INTEGER NOT NULL,
    `steals` INTEGER NOT NULL,
    `turnovers` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_PlayerToTeam` (
    `A` INTEGER UNSIGNED NOT NULL,
    `B` INTEGER UNSIGNED NOT NULL,

    UNIQUE INDEX `_PlayerToTeam_AB_unique`(`A`, `B`),
    INDEX `_PlayerToTeam_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `players` ADD CONSTRAINT `fk_player_user` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `teams` ADD CONSTRAINT `fk_team_user` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `stats` ADD CONSTRAINT `fk_stat_player` FOREIGN KEY (`player_id`) REFERENCES `players`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `_PlayerToTeam` ADD CONSTRAINT `_PlayerToTeam_A_fkey` FOREIGN KEY (`A`) REFERENCES `players`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_PlayerToTeam` ADD CONSTRAINT `_PlayerToTeam_B_fkey` FOREIGN KEY (`B`) REFERENCES `teams`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
