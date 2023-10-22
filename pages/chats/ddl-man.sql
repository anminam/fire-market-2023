
CREATE TABLE `Answer` (
	`id` int NOT NULL AUTO_INCREMENT,
	`createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
	`updatedAt` datetime(3) NOT NULL,
	`userId` int NOT NULL,
	`postId` int NOT NULL,
	`answer` mediumtext NOT NULL,
	PRIMARY KEY (`id`),
	KEY `Answer_userId_idx` (`userId`),
	KEY `Answer_postId_idx` (`postId`)
) ENGINE InnoDB,
  CHARSET utf8mb4,
  COLLATE utf8mb4_unicode_ci;

CREATE TABLE `Chat` (
	`id` int NOT NULL AUTO_INCREMENT,
	`createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
	`updatedAt` datetime(3) NOT NULL,
	`productId` int NOT NULL,
	`sellingUserId` int NOT NULL,
	`buyingUserId` int NOT NULL,
	PRIMARY KEY (`id`),
	KEY `Chat_productId_idx` (`productId`),
	KEY `Chat_sellingUserId_idx` (`sellingUserId`),
	KEY `Chat_buyingUserId_idx` (`buyingUserId`)
) ENGINE InnoDB,
  CHARSET utf8mb4,
  COLLATE utf8mb4_unicode_ci;

CREATE TABLE `Favorite` (
	`id` int NOT NULL AUTO_INCREMENT,
	`createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
	`updatedAt` datetime(3) NOT NULL,
	`userId` int NOT NULL,
	`productId` int NOT NULL,
	PRIMARY KEY (`id`),
	KEY `Favorite_userId_idx` (`userId`),
	KEY `Favorite_productId_idx` (`productId`)
) ENGINE InnoDB,
  CHARSET utf8mb4,
  COLLATE utf8mb4_unicode_ci;

CREATE TABLE `Post` (
	`id` int NOT NULL AUTO_INCREMENT,
	`createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
	`updatedAt` datetime(3) NOT NULL,
	`userId` int NOT NULL,
	`question` mediumtext NOT NULL,
	`latitude` double,
	`longitude` double,
	PRIMARY KEY (`id`),
	KEY `Post_userId_idx` (`userId`)
) ENGINE InnoDB,
  CHARSET utf8mb4,
  COLLATE utf8mb4_unicode_ci;

CREATE TABLE `Product` (
	`id` int NOT NULL AUTO_INCREMENT,
	`createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
	`updatedAt` datetime(3) NOT NULL,
	`userId` int NOT NULL,
	`image` varchar(191) NOT NULL,
	`name` varchar(191) NOT NULL,
	`price` int NOT NULL,
	`place` varchar(191) NOT NULL,
	`description` mediumtext NOT NULL,
	PRIMARY KEY (`id`),
	KEY `Product_userId_idx` (`userId`)
) ENGINE InnoDB,
  CHARSET utf8mb4,
  COLLATE utf8mb4_unicode_ci;

CREATE TABLE `Purchase` (
	`id` int NOT NULL AUTO_INCREMENT,
	`createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
	`updatedAt` datetime(3) NOT NULL,
	`userId` int NOT NULL,
	`productId` int NOT NULL,
	PRIMARY KEY (`id`),
	KEY `Purchase_userId_idx` (`userId`),
	KEY `Purchase_productId_idx` (`productId`)
) ENGINE InnoDB,
  CHARSET utf8mb4,
  COLLATE utf8mb4_unicode_ci;

CREATE TABLE `Recode` (
	`id` int NOT NULL AUTO_INCREMENT,
	`createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
	`updatedAt` datetime(3) NOT NULL,
	`userId` int NOT NULL,
	`productId` int NOT NULL,
	`Kind` enum('SALE', 'PURCHASE', 'FAVORITE') NOT NULL,
	PRIMARY KEY (`id`),
	KEY `Recode_userId_idx` (`userId`),
	KEY `Recode_productId_idx` (`productId`)
) ENGINE InnoDB,
  CHARSET utf8mb4,
  COLLATE utf8mb4_unicode_ci;

CREATE TABLE `Review` (
	`id` int NOT NULL AUTO_INCREMENT,
	`createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
	`updatedAt` datetime(3) NOT NULL,
	`review` mediumtext NOT NULL,
	`createdById` int NOT NULL,
	`createdForId` int NOT NULL,
	`rating` int NOT NULL,
	PRIMARY KEY (`id`),
	KEY `Review_createdById_idx` (`createdById`),
	KEY `Review_createdForId_idx` (`createdForId`)
) ENGINE InnoDB,
  CHARSET utf8mb4,
  COLLATE utf8mb4_unicode_ci;

CREATE TABLE `Sale` (
	`id` int NOT NULL AUTO_INCREMENT,
	`createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
	`updatedAt` datetime(3) NOT NULL,
	`userId` int NOT NULL,
	`productId` int NOT NULL,
	PRIMARY KEY (`id`),
	KEY `Sale_userId_idx` (`userId`),
	KEY `Sale_productId_idx` (`productId`)
) ENGINE InnoDB,
  CHARSET utf8mb4,
  COLLATE utf8mb4_unicode_ci;

CREATE TABLE `Stream` (
	`id` int NOT NULL AUTO_INCREMENT,
	`createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
	`updatedAt` datetime(3) NOT NULL,
	`name` varchar(191) NOT NULL,
	`description` mediumtext NOT NULL,
	`price` int NOT NULL,
	`userId` int NOT NULL,
	`cloudStreamId` varchar(191) NOT NULL,
	`cloudStreamUrl` varchar(191) NOT NULL,
	`cloudStreamKey` varchar(191) NOT NULL,
	PRIMARY KEY (`id`),
	KEY `Stream_userId_idx` (`userId`)
) ENGINE InnoDB,
  CHARSET utf8mb4,
  COLLATE utf8mb4_unicode_ci;

CREATE TABLE `StreamMessage` (
	`id` int NOT NULL AUTO_INCREMENT,
	`createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
	`updatedAt` datetime(3) NOT NULL,
	`userId` int NOT NULL,
	`streamId` int NOT NULL,
	`message` mediumtext NOT NULL,
	PRIMARY KEY (`id`),
	KEY `StreamMessage_userId_idx` (`userId`),
	KEY `StreamMessage_streamId_idx` (`streamId`)
) ENGINE InnoDB,
  CHARSET utf8mb4,
  COLLATE utf8mb4_unicode_ci;

CREATE TABLE `Token` (
	`id` int NOT NULL AUTO_INCREMENT,
	`payload` varchar(191) NOT NULL,
	`userId` int NOT NULL,
	`createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
	`updatedAt` datetime(3) NOT NULL,
	PRIMARY KEY (`id`),
	UNIQUE KEY `Token_payload_key` (`payload`)
) ENGINE InnoDB,
  CHARSET utf8mb4,
  COLLATE utf8mb4_unicode_ci;

CREATE TABLE `User` (
	`id` int NOT NULL AUTO_INCREMENT,
	`phone` varchar(191),
	`email` varchar(191),
	`name` varchar(191) NOT NULL,
	`avatar` varchar(191),
	`createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
	`updatedAt` datetime(3) NOT NULL,
	`firebaseUid` varchar(191) NOT NULL,
	PRIMARY KEY (`id`),
	UNIQUE KEY `User_firebaseUid_key` (`firebaseUid`),
	UNIQUE KEY `User_phone_key` (`phone`),
	UNIQUE KEY `User_email_key` (`email`)
) ENGINE InnoDB,
  CHARSET utf8mb4,
  COLLATE utf8mb4_unicode_ci;

CREATE TABLE `Wondering` (
	`id` int NOT NULL AUTO_INCREMENT,
	`createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
	`updatedAt` datetime(3) NOT NULL,
	`userId` int NOT NULL,
	`postId` int NOT NULL,
	PRIMARY KEY (`id`),
	KEY `Wondering_userId_idx` (`userId`),
	KEY `Wondering_postId_idx` (`postId`)
) ENGINE InnoDB,
  CHARSET utf8mb4,
  COLLATE utf8mb4_unicode_ci;