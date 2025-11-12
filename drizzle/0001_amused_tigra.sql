CREATE TABLE `registrations` (
	`id` varchar(64) NOT NULL,
	`fullName` text NOT NULL,
	`phoneNumber` varchar(20) NOT NULL,
	`email` varchar(320),
	`address` text NOT NULL,
	`packageType` enum('100mbps','200mbps','500mbps') NOT NULL,
	`notes` text,
	`status` enum('pending','contacted','completed','cancelled') NOT NULL DEFAULT 'pending',
	`createdAt` timestamp DEFAULT (now()),
	`updatedAt` timestamp DEFAULT (now()),
	CONSTRAINT `registrations_id` PRIMARY KEY(`id`)
);
