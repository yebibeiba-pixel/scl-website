CREATE TABLE `staffUsers` (
	`id` varchar(64) NOT NULL,
	`userId` varchar(64) NOT NULL,
	`role` enum('admin','manager','agent','viewer') NOT NULL DEFAULT 'viewer',
	`canViewRegistrations` varchar(10) NOT NULL DEFAULT 'yes',
	`canEditRegistrations` varchar(10) NOT NULL DEFAULT 'no',
	`canDeleteRegistrations` varchar(10) NOT NULL DEFAULT 'no',
	`canManageUsers` varchar(10) NOT NULL DEFAULT 'no',
	`canExportReports` varchar(10) NOT NULL DEFAULT 'no',
	`createdAt` timestamp DEFAULT (now()),
	`updatedAt` timestamp DEFAULT (now()),
	CONSTRAINT `staffUsers_id` PRIMARY KEY(`id`)
);
